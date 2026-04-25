import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SONG_EXAMPLES, SongExample, fetchArtwork } from '../services/songExamples';

interface SongCarouselProps {
  onSelect: (song: SongExample) => void;
}

export default function SongCarousel({ onSelect }: SongCarouselProps) {
  const [artwork, setArtwork] = useState<Record<string, string | null>>({});

  useEffect(() => {
    let cancelled = false;
    SONG_EXAMPLES.forEach((song) => {
      fetchArtwork(song).then((url) => {
        if (cancelled) return;
        setArtwork((prev) => ({ ...prev, [song.id]: url }));
      });
    });
    return () => { cancelled = true; };
  }, []);

  // Duplicate the list so a -50% transform loops seamlessly.
  const reel = [...SONG_EXAMPLES, ...SONG_EXAMPLES];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-2"
    >
      <h3 className="text-gray-300 text-lg font-semibold mb-3 text-center">
        Or peek at how some classics map out 🎼
      </h3>

      {/* full-width bleed so the marquee feels endless on either side */}
      <div className="song-marquee relative -mx-[50vw] left-1/2 right-1/2 w-screen overflow-hidden">
        {/* edge fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10" />

        {/* generous vertical padding so hover lift/scale never clips */}
        <div className="py-10">
          <div className="song-marquee-track flex gap-4 w-max">
            {reel.map((song, i) => {
              const cover = artwork[song.id];
              return (
                <motion.button
                  key={`${song.id}-${i}`}
                  whileHover={{ scale: 1.07, y: -6 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelect(song)}
                  className="shrink-0 w-44 text-left bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-blue-900/40 border border-purple-500/30 rounded-2xl p-3 backdrop-blur-xl cursor-pointer hover:border-purple-400 transition-colors"
                  style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.15)' }}
                >
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-purple-800/50 to-pink-800/50 mb-3">
                    {cover ? (
                      <img src={cover} alt={`${song.title} cover`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl opacity-60">🎵</div>
                    )}
                  </div>
                  <p className="text-white font-semibold text-sm truncate">{song.title}</p>
                  <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
