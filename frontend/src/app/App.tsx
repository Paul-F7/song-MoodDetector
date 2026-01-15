import { motion } from 'framer-motion';
import { useFileUpload } from '../hooks/useFileUpload';
import ResultsScreen from './ResultsScreen';

export default function App() {
  const {
    isDragging,
    isLoading,
    error,
    result,
    inputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleClick,
    handleFileChange,
    resetResult,
  } = useFileUpload();

  if (result) {
    return <ResultsScreen result={result} onBack={resetResult} />;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
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

      {/* Floating Emojis Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {['🎵', '🎶', '💜', '✨', '🌟', '💫', '🎧', '🎤'].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
            }}
            animate={{
              y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)],
              x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
              rotate: [0, 360]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: i * 0.5
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            className="text-8xl mb-4"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎵
          </motion.div>
          <h1 className="text-7xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-3">
            Feelify
          </h1>
          <p className="text-gray-400 text-xl">
            Upload your MP3 and discover its vibe ✨
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <input
            ref={inputRef}
            type="file"
            accept="audio/mp3,audio/mpeg,.mp3"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="relative group">
            <div
              onClick={handleClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative cursor-pointer bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-blue-900/40 border-2 ${
                isDragging ? 'border-purple-300 scale-105' : 'border-purple-500/50'
              } rounded-3xl p-12 hover:border-purple-400 transition-all duration-300 backdrop-blur-xl`}
              style={{ boxShadow: isDragging ? '0 0 60px rgba(168, 85, 247, 0.6)' : '0 0 30px rgba(168, 85, 247, 0.3)' }}
              onMouseEnter={(e) => !isDragging && (e.currentTarget.style.boxShadow = '0 0 50px rgba(168, 85, 247, 0.5)')}
              onMouseLeave={(e) => !isDragging && (e.currentTarget.style.boxShadow = '0 0 30px rgba(168, 85, 247, 0.3)')}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              />

              <div className="relative text-center">
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="text-7xl mb-4"
                    >
                      🎵
                    </motion.div>
                    <h3 className="text-3xl font-bold text-white mb-2">
                      Analyzing...
                    </h3>
                    <p className="text-gray-400 text-lg">
                      Feeling the vibes of your song
                    </p>
                  </>
                ) : (
                  <>
                    <motion.div
                      animate={{ y: [0, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-7xl mb-4"
                    >
                      {isDragging ? '🎯' : '📂'}
                    </motion.div>
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {isDragging ? 'Drop it!' : 'Drop your MP3 here!'} 🎧
                    </h3>
                    <p className="text-gray-400 text-lg">
                      or click to browse files 👆
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-center mt-4"
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-7xl mb-4">👆</div>
          <p className="text-gray-400 text-2xl">
            Upload a song to get started! 🚀
          </p>
        </motion.div>
      </div>
    </div>
  );
}