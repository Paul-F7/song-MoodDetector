import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AnalyzeResult } from '../services/api';

export interface ResultsSongMeta {
  title: string;
  artist: string;
  year: number;
  genre: string;
  coverUrl: string | null;
  fallbackEmoji: string;
  coverGradient: string;
}

export interface ResultsScreenData extends Omit<AnalyzeResult, 'image'> {
  image?: string;
  imageUrl?: string;
  plotNode?: ReactNode;
  song?: ResultsSongMeta;
}

interface ResultsScreenProps {
  result: ResultsScreenData;
  onBack: () => void;
}

export default function ResultsScreen({ result, onBack }: ResultsScreenProps) {
  const emotion = result.emotion1;
  const [coverLoaded, setCoverLoaded] = useState(false);

  useEffect(() => {
    setCoverLoaded(false);
  }, [result.song?.coverUrl]);

  const imageBase64 =
    typeof result.image === 'string'
      ? result.image
      : result.image
        ? btoa(String.fromCharCode(...new Uint8Array(result.image as unknown as ArrayBuffer)))
        : null;

  return (
    <div className="min-h-screen bg-black relative overflow-y-auto overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.4) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)',
            backgroundSize: '100% 100%'
          }}
        />
      </div>

      {/* Bottom blur gradient to indicate scrollable content */}
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
          <span>{result.song ? 'Back to songs' : 'Analyze another song'}</span>
        </motion.button>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Emotion Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 text-center lg:text-left"
          >
            {/* Optional song metadata header */}
            {result.song && (
              <div className="mb-6 flex items-center gap-4 justify-center lg:justify-start">
                <div
                  className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br ${result.song.coverGradient} border border-white/10`}
                >
                  {result.song.coverUrl && (
                    <img
                      src={result.song.coverUrl}
                      alt={`${result.song.title} cover`}
                      onLoad={() => setCoverLoaded(true)}
                      onError={() => setCoverLoaded(false)}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                        coverLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  )}
                  {!coverLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center text-3xl">
                      {result.song.fallbackEmoji}
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-lg leading-tight">{result.song.title}</p>
                  <p className="text-gray-300 text-sm">{result.song.artist}</p>
                  <p className="text-gray-500 text-xs">{result.song.year} · {result.song.genre}</p>
                </div>
              </div>
            )}

            <motion.div
              className="text-9xl mb-6"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {emotion.emoji}
            </motion.div>

            <h1 className="text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4 capitalize">
              {emotion.name}
            </h1>

            <div className="mb-6">
              <span className="text-5xl font-bold text-white">{Math.round(emotion.percentage)}%</span>
              <span className="text-gray-400 text-xl ml-2">match</span>
            </div>

            <p className="text-gray-300 text-xl leading-relaxed max-w-lg">
              {emotion.description}
            </p>
          </motion.div>

          {/* Plot — base64 image OR custom React node */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex-1"
          >
            <div className="bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-blue-900/40 rounded-3xl p-4 backdrop-blur-xl border border-purple-500/30"
              style={{ boxShadow: '0 0 40px rgba(168, 85, 247, 0.3)' }}
            >
              {imageBase64 ? (
                <img
                  src={`data:image/png;base64,${imageBase64}`}
                  alt="Emotion plot"
                  className="w-full rounded-2xl"
                />
              ) : result.imageUrl ? (
                <img
                  src={result.imageUrl}
                  alt="Emotion plot"
                  className="w-full rounded-2xl"
                />
              ) : result.plotNode ? (
                <div className="rounded-2xl overflow-hidden">{result.plotNode}</div>
              ) : null}
            </div>
          </motion.div>
        </div>

        {/* Expanded Secondary Emotions Section */}
        {(result.emotion2 || result.emotion3) && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Other Detected Emotions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {result.emotion2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 rounded-2xl p-6 backdrop-blur-xl border border-gray-700/50"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl">{result.emotion2.emoji}</span>
                    <div>
                      <h3 className="text-2xl font-bold text-white capitalize">{result.emotion2.name}</h3>
                      <p className="text-purple-400 font-semibold">{Math.round(result.emotion2.percentage)}% match</p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{result.emotion2.description}</p>
                </motion.div>
              )}
              {result.emotion3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 rounded-2xl p-6 backdrop-blur-xl border border-gray-700/50"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl">{result.emotion3.emoji}</span>
                    <div>
                      <h3 className="text-2xl font-bold text-white capitalize">{result.emotion3.name}</h3>
                      <p className="text-purple-400 font-semibold">{Math.round(result.emotion3.percentage)}% match</p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{result.emotion3.description}</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
