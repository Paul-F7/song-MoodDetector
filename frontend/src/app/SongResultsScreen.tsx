import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Song } from '../data/songs';
import MoodPlot from './MoodPlot';

interface SongResultsScreenProps {
  song: Song;
  coverUrl: string | null;
  onBack: () => void;
}

export default function SongResultsScreen({ song, coverUrl, onBack }: SongResultsScreenProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [song.id]);

  const mood = song.primaryMood;

  const points = [
    {
      valence: mood.valence,
      arousal: mood.arousal,
      label: mood.name,
      emoji: mood.emoji,
      color: mood.accentColor,
      size: 'large' as const,
    },
    ...(song.secondaryMood
      ? [
          {
            valence: song.secondaryMood.valence,
            arousal: song.secondaryMood.arousal,
            label: song.secondaryMood.name,
            emoji: song.secondaryMood.emoji,
            color: song.secondaryMood.accentColor,
            size: 'small' as const,
          },
        ]
      : []),
    ...(song.tertiaryMood
      ? [
          {
            valence: song.tertiaryMood.valence,
            arousal: song.tertiaryMood.arousal,
            label: song.tertiaryMood.name,
            emoji: song.tertiaryMood.emoji,
            color: song.tertiaryMood.accentColor,
            size: 'small' as const,
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-y-auto overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.4) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)',
            backgroundSize: '100% 100%',
          }}
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-20" />

      <div className="w-full max-w-6xl mx-auto relative z-10 p-8 pb-40">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <span className="text-2xl">←</span>
          <span>Back to songs</span>
        </motion.button>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left: Album cover + song info + primary mood */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 w-full"
          >
            {/* Album cover */}
            <div className="mb-6 max-w-sm mx-auto lg:mx-0">
              <div
                className={`relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br ${song.coverGradient} border border-white/10`}
                style={{ boxShadow: `0 0 60px ${mood.accentColor}` }}
              >
                {coverUrl && (
                  <img
                    src={coverUrl}
                    alt={`${song.title} album cover`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoaded(false)}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                )}
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center text-8xl">
                    {song.fallbackEmoji}
                  </div>
                )}
              </div>
            </div>

            {/* Song info */}
            <div className="text-center lg:text-left mb-6">
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                {song.title}
              </h1>
              <p className="text-2xl text-gray-200">{song.artist}</p>
              <p className="text-gray-500 text-sm mt-1">
                {song.year} · {song.genre}
              </p>
            </div>

            {/* Primary mood */}
            <div className="text-center lg:text-left">
              <motion.div
                className="text-7xl mb-3"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {mood.emoji}
              </motion.div>

              <h2 className="text-4xl font-black text-white mb-2 capitalize">{mood.name}</h2>

              <div className="mb-4">
                <span className="text-3xl font-bold text-white">{Math.round(mood.percentage)}%</span>
                <span className="text-gray-400 text-lg ml-2">match</span>
              </div>

              <p className="text-gray-300 text-base leading-relaxed max-w-lg">{mood.description}</p>
            </div>
          </motion.div>

          {/* Right: Mood plot */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex-1 w-full"
          >
            <div
              className="bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-blue-900/40 rounded-3xl p-4 backdrop-blur-xl border border-purple-500/30"
              style={{ boxShadow: '0 0 40px rgba(168, 85, 247, 0.3)' }}
            >
              <h3 className="text-white font-bold text-center mb-2 mt-2">Valence × Arousal Map</h3>
              <MoodPlot points={points} />
            </div>
          </motion.div>
        </div>

        {/* Secondary moods */}
        {(song.secondaryMood || song.tertiaryMood) && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Other Detected Moods</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {song.secondaryMood && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 rounded-2xl p-6 backdrop-blur-xl border border-gray-700/50"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl">{song.secondaryMood.emoji}</span>
                    <div>
                      <h3 className="text-2xl font-bold text-white capitalize">{song.secondaryMood.name}</h3>
                      <p className="text-purple-400 font-semibold">{Math.round(song.secondaryMood.percentage)}% match</p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{song.secondaryMood.description}</p>
                </motion.div>
              )}
              {song.tertiaryMood && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 rounded-2xl p-6 backdrop-blur-xl border border-gray-700/50"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl">{song.tertiaryMood.emoji}</span>
                    <div>
                      <h3 className="text-2xl font-bold text-white capitalize">{song.tertiaryMood.name}</h3>
                      <p className="text-purple-400 font-semibold">{Math.round(song.tertiaryMood.percentage)}% match</p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{song.tertiaryMood.description}</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
