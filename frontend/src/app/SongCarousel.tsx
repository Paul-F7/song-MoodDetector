import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SongMood {
  name: string;
  emoji: string;
  percentage: number;
  description: string;
  accentColor: string;
}

interface SecondaryMood {
  name: string;
  emoji: string;
  percentage: number;
}

interface Song {
  id: number;
  title: string;
  artist: string;
  year: number;
  genre: string;
  albumEmoji: string;
  coverGradient: string;
  primaryMood: SongMood;
  secondaryMood?: SecondaryMood;
  tertiaryMood?: SecondaryMood;
}

const SONGS: Song[] = [
  {
    id: 1,
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    year: 2019,
    genre: 'Synth-pop',
    albumEmoji: '🌆',
    coverGradient: 'from-red-900 via-purple-900 to-orange-900',
    primaryMood: {
      name: 'Ecstatic',
      emoji: '🤩',
      percentage: 87,
      description:
        'An electric surge of neon-soaked euphoria — this track pulses like city lights at midnight, lifting every heartbeat into a feverish, unstoppable high. The driving synths and breathless vocals create a state of pure, vibrating joy that feels both desperate and triumphant.',
      accentColor: 'rgba(239, 68, 68, 0.6)',
    },
    secondaryMood: { name: 'Excited', emoji: '⚡', percentage: 72 },
    tertiaryMood: { name: 'Nostalgic', emoji: '🌙', percentage: 45 },
  },
  {
    id: 2,
    title: 'Someone Like You',
    artist: 'Adele',
    year: 2011,
    genre: 'Soul / Pop',
    albumEmoji: '💙',
    coverGradient: 'from-blue-950 via-indigo-900 to-slate-900',
    primaryMood: {
      name: 'Sad',
      emoji: '😢',
      percentage: 92,
      description:
        'A beautifully aching heartbreak that settles deep in the chest — every note carries the weight of love left behind, of finding someone has moved on while you are still caught in the amber of what was. It is the sound of standing in the rain at 2am, knowing you have to let go.',
      accentColor: 'rgba(59, 130, 246, 0.6)',
    },
    secondaryMood: { name: 'Serene', emoji: '🌊', percentage: 58 },
    tertiaryMood: { name: 'Bittersweet', emoji: '🥺', percentage: 44 },
  },
  {
    id: 3,
    title: 'Happy',
    artist: 'Pharrell Williams',
    year: 2013,
    genre: 'Neo Soul',
    albumEmoji: '☀️',
    coverGradient: 'from-yellow-800 via-orange-800 to-amber-900',
    primaryMood: {
      name: 'Happy',
      emoji: '😄',
      percentage: 95,
      description:
        'Pure, unfiltered sunshine in audio form — this track is a direct injection of joy straight into the soul. It is impossible to stay still, impossible to frown. The groove is irresistible, the message beautifully simple: the world is good, and you are alive in it.',
      accentColor: 'rgba(251, 191, 36, 0.6)',
    },
    secondaryMood: { name: 'Excited', emoji: '🎉', percentage: 83 },
  },
  {
    id: 4,
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    year: 1975,
    genre: 'Progressive Rock',
    albumEmoji: '👑',
    coverGradient: 'from-purple-950 via-pink-900 to-red-900',
    primaryMood: {
      name: 'Astonished',
      emoji: '😲',
      percentage: 88,
      description:
        'A kaleidoscopic emotional odyssey that shatters every boundary — it takes you from melancholic confession, through operatic madness, into hard rock fury, and back to a tender farewell. Truly unlike anything before or since. The mind simply cannot contain it all at once.',
      accentColor: 'rgba(168, 85, 247, 0.6)',
    },
    secondaryMood: { name: 'Excited', emoji: '🔥', percentage: 71 },
    tertiaryMood: { name: 'Distressed', emoji: '😰', percentage: 55 },
  },
  {
    id: 5,
    title: 'Bad Guy',
    artist: 'Billie Eilish',
    year: 2019,
    genre: 'Electropop',
    albumEmoji: '🖤',
    coverGradient: 'from-gray-950 via-green-950 to-black',
    primaryMood: {
      name: 'Tense',
      emoji: '😏',
      percentage: 79,
      description:
        'Cool, sinister, and deliciously self-aware — this track prowls like a panther in a dark corridor. The whispered vocals and skittering bass create a pressure that is exciting rather than threatening, a tension born of confidence and playful menace.',
      accentColor: 'rgba(34, 197, 94, 0.5)',
    },
    secondaryMood: { name: 'Amused', emoji: '😈', percentage: 65 },
  },
  {
    id: 6,
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    year: 2017,
    genre: 'Tropical Pop',
    albumEmoji: '💚',
    coverGradient: 'from-emerald-900 via-teal-900 to-cyan-900',
    primaryMood: {
      name: 'Happy',
      emoji: '😊',
      percentage: 81,
      description:
        'Warm and magnetic, this track glows with the easy joy of new attraction — the kind of happiness found in a crowded bar on a Friday night when someone new catches your eye. The marimba groove makes the whole world feel effortlessly carefree.',
      accentColor: 'rgba(16, 185, 129, 0.6)',
    },
    secondaryMood: { name: 'Excited', emoji: '✨', percentage: 68 },
    tertiaryMood: { name: 'Content', emoji: '🌿', percentage: 52 },
  },
  {
    id: 7,
    title: 'Lose Yourself',
    artist: 'Eminem',
    year: 2002,
    genre: 'Hip-Hop',
    albumEmoji: '🎤',
    coverGradient: 'from-gray-950 via-red-950 to-zinc-900',
    primaryMood: {
      name: 'Furious',
      emoji: '🔥',
      percentage: 88,
      description:
        'White-hot, razor-focused intensity — this is what it sounds like when a human being burns every last bridge and bets it all on one moment. The pressure is immense, the stakes absolute. It is motivational fury at its most primal and electric.',
      accentColor: 'rgba(239, 68, 68, 0.6)',
    },
    secondaryMood: { name: 'Excited', emoji: '⚡', percentage: 76 },
    tertiaryMood: { name: 'Determined', emoji: '💪', percentage: 91 },
  },
  {
    id: 8,
    title: 'Stay With Me',
    artist: 'Sam Smith',
    year: 2014,
    genre: 'Soul / Pop',
    albumEmoji: '🕯️',
    coverGradient: 'from-blue-950 via-sky-900 to-indigo-950',
    primaryMood: {
      name: 'Sad',
      emoji: '😔',
      percentage: 85,
      description:
        'Achingly vulnerable and stripped bare — this is the sound of asking someone to stay even when you know they should not, of loneliness wrapped in gospel warmth. The choir swells feel like arms trying to hold something that is already slipping away.',
      accentColor: 'rgba(99, 102, 241, 0.6)',
    },
    secondaryMood: { name: 'Serene', emoji: '🌌', percentage: 60 },
  },
  {
    id: 9,
    title: 'Thunderstruck',
    artist: 'AC/DC',
    year: 1990,
    genre: 'Hard Rock',
    albumEmoji: '⚡',
    coverGradient: 'from-orange-900 via-yellow-900 to-red-900',
    primaryMood: {
      name: 'Excited',
      emoji: '⚡',
      percentage: 91,
      description:
        'Pure electrified adrenaline — from that legendary opening guitar run, this track seizes you by the collar and refuses to let go. It is the kind of excitement that makes you want to sprint, shout, and break something just because you are so alive.',
      accentColor: 'rgba(245, 158, 11, 0.6)',
    },
    secondaryMood: { name: 'Furious', emoji: '🤘', percentage: 74 },
    tertiaryMood: { name: 'Ecstatic', emoji: '🔥', percentage: 62 },
  },
  {
    id: 10,
    title: 'Shallow',
    artist: 'Lady Gaga',
    year: 2018,
    genre: 'Pop Rock',
    albumEmoji: '🎭',
    coverGradient: 'from-rose-950 via-pink-900 to-purple-900',
    primaryMood: {
      name: 'Astonished',
      emoji: '✨',
      percentage: 83,
      description:
        'A breathtaking leap into raw, unguarded feeling — the transition from introspective whisper to full-throated scream captures the terrifying beauty of being truly seen. It is the sound of stepping off the edge into something vast and unknown, with no guarantee of landing.',
      accentColor: 'rgba(244, 63, 94, 0.6)',
    },
    secondaryMood: { name: 'Sad', emoji: '💔', percentage: 62 },
    tertiaryMood: { name: 'Delighted', emoji: '🌸', percentage: 48 },
  },
];

function SongCard({ song, onClick, isSelected }: { song: Song; onClick: () => void; isSelected: boolean }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.06, y: -6 }}
      whileTap={{ scale: 0.97 }}
      className={`relative flex-shrink-0 w-44 cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
        isSelected ? 'border-white shadow-[0_0_30px_rgba(255,255,255,0.4)]' : 'border-white/10 hover:border-white/40'
      }`}
    >
      {/* Album art */}
      <div className={`h-44 bg-gradient-to-br ${song.coverGradient} flex items-center justify-center`}>
        <span className="text-6xl">{song.albumEmoji}</span>
      </div>

      {/* Info */}
      <div className="bg-gray-900/90 backdrop-blur-sm p-3">
        <p className="text-white font-bold text-sm truncate">{song.title}</p>
        <p className="text-gray-400 text-xs truncate">{song.artist}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-gray-500 text-xs">{song.year}</span>
          <span className="text-lg">{song.primaryMood.emoji}</span>
        </div>
      </div>

      {isSelected && (
        <div className="absolute inset-0 ring-2 ring-white/60 rounded-2xl pointer-events-none" />
      )}
    </motion.div>
  );
}

export default function SongCarousel() {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const handleCardClick = (song: Song) => {
    setSelectedSong(prev => (prev?.id === song.id ? null : song));
    setIsPaused(true);
  };

  const handleClose = () => {
    setSelectedSong(null);
    setIsPaused(false);
  };

  return (
    <div className="w-full mt-12 relative">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl font-bold text-white mb-1">
          Explore Song Moods <span className="text-gray-400 font-normal text-lg">— click any song</span>
        </h2>
      </motion.div>

      {/* Belt */}
      <div
        className="overflow-hidden w-full"
        onMouseEnter={() => !selectedSong && setIsPaused(true)}
        onMouseLeave={() => !selectedSong && setIsPaused(false)}
      >
        <div
          className={`flex gap-4 px-4 w-max belt-animation ${isPaused ? 'belt-paused' : ''}`}
        >
          {[...SONGS, ...SONGS].map((song, i) => (
            <SongCard
              key={`${song.id}-${i}`}
              song={song}
              onClick={() => handleCardClick(song)}
              isSelected={selectedSong?.id === song.id}
            />
          ))}
        </div>
      </div>

      {/* Mood Panel */}
      <AnimatePresence>
        {selectedSong && (
          <motion.div
            key={selectedSong.id}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="mx-4 mt-6 rounded-3xl overflow-hidden border border-white/10 backdrop-blur-xl"
            style={{
              background: `linear-gradient(135deg, ${selectedSong.primaryMood.accentColor} 0%, rgba(17,17,27,0.95) 60%)`,
              boxShadow: `0 0 60px ${selectedSong.primaryMood.accentColor}`,
            }}
          >
            <div className="p-6 md:p-8">
              {/* Panel header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedSong.coverGradient} flex items-center justify-center text-3xl flex-shrink-0`}
                  >
                    {selectedSong.albumEmoji}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">{selectedSong.title}</h3>
                    <p className="text-gray-300">{selectedSong.artist}</p>
                    <p className="text-gray-500 text-sm">{selectedSong.year} · {selectedSong.genre}</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white transition-colors text-2xl leading-none cursor-pointer mt-1"
                >
                  ✕
                </button>
              </div>

              {/* Primary mood */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex-shrink-0 text-center md:w-36"
                >
                  <motion.div
                    className="text-7xl mb-2"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    {selectedSong.primaryMood.emoji}
                  </motion.div>
                  <p className="text-white font-black text-2xl capitalize">{selectedSong.primaryMood.name}</p>
                  <p className="text-white/70 font-bold text-lg">{selectedSong.primaryMood.percentage}%</p>
                </motion.div>

                <div className="flex-1">
                  <p className="text-gray-200 text-base leading-relaxed mb-5">
                    {selectedSong.primaryMood.description}
                  </p>

                  {/* Secondary / tertiary moods */}
                  {(selectedSong.secondaryMood || selectedSong.tertiaryMood) && (
                    <div className="flex flex-wrap gap-3">
                      {selectedSong.secondaryMood && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 border border-white/10"
                        >
                          <span className="text-2xl">{selectedSong.secondaryMood.emoji}</span>
                          <div>
                            <p className="text-white font-semibold text-sm capitalize">{selectedSong.secondaryMood.name}</p>
                            <p className="text-white/60 text-xs">{selectedSong.secondaryMood.percentage}%</p>
                          </div>
                        </motion.div>
                      )}
                      {selectedSong.tertiaryMood && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 border border-white/10"
                        >
                          <span className="text-2xl">{selectedSong.tertiaryMood.emoji}</span>
                          <div>
                            <p className="text-white font-semibold text-sm capitalize">{selectedSong.tertiaryMood.name}</p>
                            <p className="text-white/60 text-xs">{selectedSong.tertiaryMood.percentage}%</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
