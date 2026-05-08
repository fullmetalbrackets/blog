#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '../src/data/last-played.json');

async function fetchLastPlayed() {
  const { TAUTULLI_URL, TAUTULLI_API_KEY } = process.env;

  if (!TAUTULLI_URL || !TAUTULLI_API_KEY) {
    throw new Error(
      'Missing TAUTULLI_URL or TAUTULLI_API_KEY in environment. ' +
        'Run with: yarn music OR node --env-file=.env scripts/last-played.mjs'
    );
  }

  const url = new URL('/api/v2', TAUTULLI_URL);
  url.searchParams.set('apikey', TAUTULLI_API_KEY);
  url.searchParams.set('cmd', 'get_history');
  url.searchParams.set('media_type', 'track');
  url.searchParams.set('length', '1');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Tautulli responded with HTTP ${res.status}`);

  const json = await res.json();

  if (json?.response?.result !== 'success') {
    throw new Error(`Tautulli API error: ${JSON.stringify(json?.response)}`);
  }

  const track = json?.response?.data?.data?.[0];
  if (!track) throw new Error('No music history found in Tautulli response.');

  return {
    title: track.title,
    artist: track.grandparent_title,
    album: track.parent_title,
    year: track.year ?? null,
    lastPlayed: new Date(track.date * 1000).toISOString(),
  };
}

async function fetchAlbumArt(artist, album) {
  const term = encodeURIComponent(`${artist} ${album}`);
  const url = `https://itunes.apple.com/search?term=${term}&entity=album&limit=1`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`iTunes API responded with HTTP ${res.status}`);

  const json = await res.json();
  const result = json?.results?.[0];

  if (!result?.artworkUrl100) {
    console.warn('⚠  No album art found on iTunes for:', artist, '-', album);
    return null;
  }

  return result.artworkUrl100;
}

async function main() {
  console.log('🎵 Fetching last played track from Tautulli...');
  const track = await fetchLastPlayed();
  console.log(
    `   Found: "${track.title}" by ${track.artist} (${track.album}, ${track.year})`
  );

  console.log('🎨 Fetching album art from iTunes...');
  const albumArt = await fetchAlbumArt(track.artist, track.album);
  if (albumArt) {
    console.log(`   Art URL: ${albumArt}`);
  }

  const output = { ...track, albumArt };

  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n');
  console.log(`✅ Written to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
