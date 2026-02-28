/**
 * Quran Service
 *
 * Fetches Quran data from the free AlQuran.cloud API.
 * Caches responses locally for offline access.
 *
 * API docs: https://alquran.cloud/api
 */

import { Audio } from 'expo-av';
import { File, Directory, Paths } from 'expo-file-system';

const BASE_URL = 'https://api.alquran.cloud/v1';

/** Default reciter: Al-Husary (Muallim style — best for learning) */
const DEFAULT_RECITER = 'ar.alafasy'; // Mishary Rashid al-Afasy (clear, popular)
const LEARNING_RECITER = 'ar.husary'; // Mahmoud Khalil Al-Husary (traditional)

// ── Types ──────────────────────────────────────────────────────

export interface QuranAyah {
  number: number;
  numberInSurah: number;
  text: string;
  surahNumber: number;
  surahName: string;
  surahEnglishName: string;
  juz: number;
  page: number;
}

export interface QuranAyahWithTranslation extends QuranAyah {
  translation: string;
  transliteration?: string;
  audioUrl?: string;
}

export interface QuranSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

// ── Cache (expo-file-system v19 new API) ───────────────────────

const cacheDir = new Directory(Paths.cache, 'quran');

function ensureCacheDir(): void {
  if (!cacheDir.exists) {
    cacheDir.create({ intermediates: true, idempotent: true });
  }
}

async function getCached<T>(key: string): Promise<T | null> {
  try {
    const file = new File(cacheDir, `${key}.json`);
    if (!file.exists) return null;
    const raw = await file.text();
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function setCache(key: string, data: unknown): void {
  try {
    ensureCacheDir();
    const file = new File(cacheDir, `${key}.json`);
    file.write(JSON.stringify(data));
  } catch {
    // Silently ignore cache write errors
  }
}

// ── API ────────────────────────────────────────────────────────

async function fetchJSON<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Quran API error: ${response.status}`);
  }
  const json = await response.json();
  return json.data as T;
}

// ── Public API ─────────────────────────────────────────────────

/**
 * Get list of all 114 surahs.
 */
async function getSurahList(): Promise<QuranSurah[]> {
  const cached = await getCached<QuranSurah[]>('surah-list');
  if (cached) return cached;

  interface RawSurah {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: 'Meccan' | 'Medinan';
  }

  const data = await fetchJSON<RawSurah[]>('/surah');
  const surahs: QuranSurah[] = data.map((s) => ({
    number: s.number,
    name: s.name,
    englishName: s.englishName,
    englishNameTranslation: s.englishNameTranslation,
    numberOfAyahs: s.numberOfAyahs,
    revelationType: s.revelationType,
  }));

  await setCache('surah-list', surahs);
  return surahs;
}

/**
 * Get Arabic text for a surah with English translation.
 */
async function getSurah(surahNumber: number): Promise<QuranAyahWithTranslation[]> {
  const cacheKey = `surah-${surahNumber}`;
  const cached = await getCached<QuranAyahWithTranslation[]>(cacheKey);
  if (cached) return cached;

  // Fetch Arabic + English translation in one call
  interface RawEdition {
    ayahs: Array<{
      number: number;
      numberInSurah: number;
      text: string;
      surah: { number: number; name: string; englishName: string };
      juz: number;
      page: number;
    }>;
  }

  const data = await fetchJSON<RawEdition[]>(
    `/surah/${surahNumber}/editions/quran-uthmani,en.asad`,
  );

  const arabicEdition = data[0];
  const englishEdition = data[1];

  if (!arabicEdition || !englishEdition) {
    throw new Error('Failed to fetch surah data');
  }

  const ayahs: QuranAyahWithTranslation[] = arabicEdition.ayahs.map((ayah, i) => ({
    number: ayah.number,
    numberInSurah: ayah.numberInSurah,
    text: ayah.text,
    surahNumber: ayah.surah.number,
    surahName: ayah.surah.name,
    surahEnglishName: ayah.surah.englishName,
    juz: ayah.juz,
    page: ayah.page,
    translation: englishEdition.ayahs[i]?.text ?? '',
    audioUrl: `https://cdn.islamic.network/quran/audio/128/${DEFAULT_RECITER}/${ayah.number}.mp3`,
  }));

  await setCache(cacheKey, ayahs);
  return ayahs;
}

/**
 * Get a single ayah with Arabic text, translation, and audio URL.
 */
async function getAyah(
  surahNumber: number,
  ayahNumber: number,
): Promise<QuranAyahWithTranslation | null> {
  const surah = await getSurah(surahNumber);
  return surah.find((a) => a.numberInSurah === ayahNumber) ?? null;
}

/**
 * Get audio URL for an ayah.
 * Uses CDN URL format: https://cdn.islamic.network/quran/audio/{bitrate}/{reciter}/{ayah_number}.mp3
 */
function getAudioUrl(globalAyahNumber: number, reciter: string = DEFAULT_RECITER): string {
  return `https://cdn.islamic.network/quran/audio/128/${reciter}/${globalAyahNumber}.mp3`;
}

/**
 * Pre-cache audio files for a surah (for offline playback).
 * Downloads MP3 files to local cache.
 */
async function cacheAudioForSurah(surahNumber: number): Promise<void> {
  const ayahs = await getSurah(surahNumber);
  const audioDir = new Directory(cacheDir, 'audio');
  if (!audioDir.exists) {
    audioDir.create({ intermediates: true, idempotent: true });
  }

  for (const ayah of ayahs) {
    if (!ayah.audioUrl) continue;

    const localFile = new File(audioDir, `${ayah.number}.mp3`);
    if (localFile.exists) continue; // Already cached

    try {
      await File.downloadFileAsync(ayah.audioUrl, localFile, { idempotent: true });
    } catch {
      // Skip failed downloads silently
    }
  }
}

/**
 * Get the local or remote audio URI for an ayah.
 * Returns local file if cached, otherwise the CDN URL.
 */
async function getAudioUri(globalAyahNumber: number): Promise<string> {
  const localFile = new File(cacheDir, 'audio', `${globalAyahNumber}.mp3`);

  if (localFile.exists) {
    return localFile.uri;
  }

  return getAudioUrl(globalAyahNumber);
}

// ── Audio Playback ─────────────────────────────────────────────

let currentSound: Audio.Sound | null = null;
let audioModeConfigured = false;

/**
 * Configure the audio session for playback.
 * Must be called before any audio plays — required on iOS for silent-mode support.
 */
async function ensureAudioMode(): Promise<void> {
  if (audioModeConfigured) return;
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
    audioModeConfigured = true;
  } catch (err) {
    console.warn('[QuranService] Failed to set audio mode:', err);
  }
}

async function playAyah(globalAyahNumber: number, onFinish?: () => void): Promise<void> {
  // Configure audio session (one-time, required on iOS)
  await ensureAudioMode();

  // Fully stop and unload any previous sound before creating a new one
  await stopAudio();

  const uri = await getAudioUri(globalAyahNumber);
  console.log('[QuranService] Playing ayah', globalAyahNumber, 'from:', uri);

  const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true, volume: 1.0 });
  currentSound = sound;

  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.isLoaded && status.didJustFinish) {
      // Only clean up if this is still the current sound (not replaced)
      if (currentSound === sound) {
        currentSound = null;
      }
      sound.unloadAsync().catch(() => {});
      onFinish?.();
    }
  });
}

async function stopAudio(): Promise<void> {
  const soundRef = currentSound;
  currentSound = null; // Clear immediately to prevent race conditions
  if (soundRef) {
    try {
      await soundRef.stopAsync();
      await soundRef.unloadAsync();
    } catch {
      // Ignore cleanup errors
    }
    currentSound = null;
  }
}

async function pauseAudio(): Promise<void> {
  if (currentSound) {
    try {
      await currentSound.pauseAsync();
    } catch {
      // Ignore
    }
  }
}

async function resumeAudio(): Promise<void> {
  if (currentSound) {
    try {
      await currentSound.playAsync();
    } catch {
      // Ignore
    }
  }
}

export const quranService = {
  getSurahList,
  getSurah,
  getAyah,
  getAudioUrl,
  getAudioUri,
  cacheAudioForSurah,
  playAyah,
  stopAudio,
  pauseAudio,
  resumeAudio,
  DEFAULT_RECITER,
  LEARNING_RECITER,
};
