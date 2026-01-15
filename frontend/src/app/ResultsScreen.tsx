import { motion } from 'framer-motion';
import { AnalyzeResult } from '../services/api';

interface ResultsScreenProps {
  result: AnalyzeResult;
  onBack: () => void;
}

export default function ResultsScreen({ result, onBack }: ResultsScreenProps) {
  const emotion = result.emotion1;
  const imageBase64 = typeof result.image === 'string'
    ? result.image
    : btoa(String.fromCharCode(...new Uint8Array(result.image as unknown as ArrayBuffer)));

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
          <span>Analyze another song</span>
        </motion.button>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Emotion Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 text-center lg:text-left"
          >
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

          {/* Plot Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex-1"
          >
            <div className="bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-blue-900/40 rounded-3xl p-4 backdrop-blur-xl border border-purple-500/30"
              style={{ boxShadow: '0 0 40px rgba(168, 85, 247, 0.3)' }}
            >
              <img
                src={`data:image/png;base64,${imageBase64}`}
                alt="Emotion plot"
                className="w-full rounded-2xl"
              />
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