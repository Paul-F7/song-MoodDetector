import { AnalyzeResult, Emotion } from './api';

const EMOTION_COORDINATES: Record<string, [number, number]> = {
  Ecstatic:   [0.92, 0.92],
  Excited:    [0.88, 0.88],
  Happy:      [0.80, 0.75],
  Delighted:  [0.85, 0.70],
  Amused:     [0.70, 0.65],
  Furious:    [0.10, 0.90],
  Angry:      [0.15, 0.85],
  Frustrated: [0.20, 0.80],
  Tense:      [0.25, 0.85],
  Afraid:     [0.20, 0.90],
  Alarmed:    [0.30, 0.92],
  Distressed: [0.15, 0.75],
  Miserable:  [0.10, 0.20],
  Depressed:  [0.15, 0.15],
  Sad:        [0.20, 0.25],
  Bored:      [0.30, 0.30],
  Tired:      [0.35, 0.20],
  Gloomy:     [0.25, 0.30],
  Serene:     [0.85, 0.30],
  Relaxed:    [0.80, 0.20],
  Calm:       [0.70, 0.25],
  Content:    [0.75, 0.35],
  Sleepy:     [0.55, 0.15],
  Peaceful:   [0.75, 0.15],
  Neutral:    [0.50, 0.50],
  Astonished: [0.55, 0.95],
};

// Short descriptions mirroring the backend's tone, kept brief for UI.
const EMOTION_META: Record<string, { emoji: string; description: string }> = {
  Ecstatic:   { emoji: '🎉', description: 'Festival-sized euphoria — towering synths, confetti-cannon drops, and choruses that launch you skyward.' },
  Excited:    { emoji: '🔥', description: 'Anthemic and adrenaline-laced — bright guitars, laser synths, and hooks built to be shouted.' },
  Happy:      { emoji: '😊', description: 'Sunlit, jangly, and grinning — hand-claps, bouncing bass, and choruses that feel like good news.' },
  Delighted:  { emoji: '✨', description: 'Glittering nu-disco energy — velvet strings, rubbery bass, and a wink under the disco ball.' },
  Amused:     { emoji: '😏', description: 'Playful and sly — offbeat horns, witty turns, and a melody that raises one eyebrow.' },
  Furious:    { emoji: '😡', description: 'Snarling and serrated — distortion, blast beats, and a refusal to swallow the rage.' },
  Angry:      { emoji: '🤬', description: 'Hardcore intensity — gang vocals, chainsaw guitars, and a mic shoved into your hand.' },
  Frustrated: { emoji: '💥', description: 'Tense verses cracking into cathartic, feedback-soaked release.' },
  Tense:      { emoji: '😰', description: 'Cinematic darkwave — creeping pads and bass pulses sitting at the edge of your heartbeat.' },
  Afraid:     { emoji: '👻', description: 'Haunted ambient — distant whispers, bowed metal, and shadows in the hallway.' },
  Alarmed:    { emoji: '🚨', description: 'Sirens and strobes — rattling breaks and alarm-call synths moving as fast as your pulse.' },
  Distressed: { emoji: '😓', description: 'Late-night trip-hop — cracked vinyl hiss and hushed confessionals.' },
  Miserable:  { emoji: '😔', description: 'Bare piano laments and aching strings, slow and heavy as winter air.' },
  Depressed: { emoji: '💧', description: 'Shoegaze fog — swollen reverb and distant vocals blooming in a dim room.' },
  Sad:        { emoji: '🥀', description: 'Intimate fingerpicked ballads written like diary entries.' },
  Bored:      { emoji: '😐', description: 'Lo-fi loops and bedroom beats drifting like a slow ceiling fan.' },
  Tired:      { emoji: '😴', description: 'Velvety neo-soul rocking like a hammock, gently telling you to let go.' },
  Gloomy:     { emoji: '🌫️', description: 'Smoke-blue jazz — minor-key piano and a sax lingering in the doorway.' },
  Serene:     { emoji: '🌿', description: 'Pastoral classical — harp plucks and woodwinds opening to sunrise fields.' },
  Relaxed:    { emoji: '☕', description: 'Chillhop and Balearic lounge swaying like waves against a pier.' },
  Calm:       { emoji: '🕊️', description: 'Featherlight ambient — soft choir pads and chimes drifting over a still lake.' },
  Content:    { emoji: '🌻', description: 'Cozy folk-pop and porch harmonies in golden hour.' },
  Sleepy:     { emoji: '🌙', description: 'Indie lullabies — cottony pads and whispered vocals blurring the edges of the room.' },
  Peaceful:   { emoji: '🎐', description: 'Nature-woven ambient — rain, bamboo flutes, and glassy tones on calm water.' },
  Neutral:    { emoji: '🤍', description: 'Mid-tempo electro-pop holding a steady emotional midpoint.' },
  Astonished: { emoji: '😮', description: 'Maximalist orchestral-pop — sudden brass swells and cliff-drop choruses full of awe.' },
};

export interface SongExample {
  id: string;
  title: string;
  artist: string;
  valence: number;
  arousal: number;
  graphFile: string;
  searchTerm: string; // used for iTunes Search artwork lookup
}

export const SONG_EXAMPLES: SongExample[] = [
  { id: 'happy_pharrell',       title: 'Happy',                    artist: 'Pharrell Williams', valence: 0.96, arousal: 0.82, graphFile: 'happy_pharrell_williams.png',          searchTerm: 'Happy Pharrell Williams' },
  { id: 'uptown_funk',          title: 'Uptown Funk',              artist: 'Bruno Mars',        valence: 0.92, arousal: 0.90, graphFile: 'uptown_funk_bruno_mars.png',           searchTerm: 'Uptown Funk Bruno Mars Mark Ronson' },
  { id: 'dont_stop_believin',   title: "Don't Stop Believin'",     artist: 'Journey',           valence: 0.86, arousal: 0.80, graphFile: 'don_t_stop_believin_journey.png',      searchTerm: "Don't Stop Believin' Journey" },
  { id: 'shape_of_you',         title: 'Shape of You',             artist: 'Ed Sheeran',        valence: 0.82, arousal: 0.72, graphFile: 'shape_of_you_ed_sheeran.png',          searchTerm: 'Shape of You Ed Sheeran' },
  { id: 'smells_like_teen',     title: 'Smells Like Teen Spirit',  artist: 'Nirvana',           valence: 0.30, arousal: 0.94, graphFile: 'smells_like_teen_spirit_nirvana.png',  searchTerm: 'Smells Like Teen Spirit Nirvana' },
  { id: 'bohemian_rhapsody',    title: 'Bohemian Rhapsody',        artist: 'Queen',             valence: 0.50, arousal: 0.70, graphFile: 'bohemian_rhapsody_queen.png',          searchTerm: 'Bohemian Rhapsody Queen' },
  { id: 'hello_adele',          title: 'Hello',                    artist: 'Adele',             valence: 0.22, arousal: 0.40, graphFile: 'hello_adele.png',                     searchTerm: 'Hello Adele' },
  { id: 'someone_like_you',     title: 'Someone Like You',         artist: 'Adele',             valence: 0.18, arousal: 0.28, graphFile: 'someone_like_you_adele.png',           searchTerm: 'Someone Like You Adele' },
  { id: 'mad_world',            title: 'Mad World',                artist: 'Gary Jules',        valence: 0.12, arousal: 0.18, graphFile: 'mad_world_gary_jules.png',             searchTerm: 'Mad World Gary Jules Donnie Darko' },
  { id: 'weightless',           title: 'Weightless',               artist: 'Marconi Union',     valence: 0.62, arousal: 0.10, graphFile: 'weightless_marconi_union.png',         searchTerm: 'Weightless Marconi Union' },
];

function rankEmotions(valence: number, arousal: number) {
  return Object.entries(EMOTION_COORDINATES)
    .map(([name, [v, a]]) => ({ name, distance: Math.hypot(v - valence, a - arousal) }))
    .sort((a, b) => a.distance - b.distance);
}

function buildEmotion({ name, distance }: { name: string; distance: number }): Emotion {
  const meta = EMOTION_META[name] ?? { emoji: '🎵', description: '' };
  // Distance ranges roughly 0–0.5 in this layout; map to 55–99% match.
  const percentage = Math.max(55, Math.min(99, Math.round(99 - distance * 90)));
  return {
    name,
    percentage,
    emoji: meta.emoji,
    description: meta.description,
  };
}

export function buildResultForSong(song: SongExample): AnalyzeResult {
  const ranked = rankEmotions(song.valence, song.arousal);
  return {
    image: '',
    imageUrl: `/song_examples/${song.graphFile}`,
    emotion1: buildEmotion(ranked[0]),
    emotion2: ranked[1] ? buildEmotion(ranked[1]) : undefined,
    emotion3: ranked[2] ? buildEmotion(ranked[2]) : undefined,
  };
}

const artworkCache = new Map<string, string>();
const artworkPending = new Map<string, Promise<string | null>>();

export function fetchArtwork(song: SongExample): Promise<string | null> {
  const cached = artworkCache.get(song.id);
  if (cached) return Promise.resolve(cached);
  const pending = artworkPending.get(song.id);
  if (pending) return pending;

  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(song.searchTerm)}&entity=song&limit=1`;
  const promise = fetch(url)
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      const raw: string | undefined = data?.results?.[0]?.artworkUrl100;
      if (!raw) return null;
      // iTunes returns 100x100; bump to 600x600 for crisp cards.
      const big = raw.replace('100x100bb', '600x600bb');
      artworkCache.set(song.id, big);
      return big;
    })
    .catch(() => null)
    .finally(() => artworkPending.delete(song.id));

  artworkPending.set(song.id, promise);
  return promise;
}
