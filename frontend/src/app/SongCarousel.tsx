import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SONGS, type Song } from '../data/songs';

interface SongCardProps {
  song: Song;
  coverUrl: string | null;
  onClick: () => void;
}

function SongCard({ song, coverUrl, onClick }: SongCardProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.06, y: -6 }}
      whileTap={{ scale: 0.97 }}
      className="relative flex-shrink-0 w-44 cursor-pointer rounded-2xl overflow-hidden border-2 border-white/10 hover:border-white/40 transition-colors duration-300 bg-gray-900/90"
    >
      {/* Album art */}
      <div className={`relative h-44 w-44 bg-gradient-to-br ${song.coverGradient}`}>
        {coverUrl && (
          <img
            src={coverUrl}
            alt={`${song.title} cover`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(false)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            {song.fallbackEmoji}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 backdrop-blur-sm">
        <p className="text-white font-bold text-sm truncate">{song.title}</p>
        <p className="text-gray-400 text-xs truncate">{song.artist}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-gray-500 text-xs">{song.year}</span>
          <span className="text-lg">{song.primaryMood.emoji}</span>
        </div>
      </div>
    </motion.div>
  );
}

interface SongCarouselProps {
  onSelectSong: (song: Song, coverUrl: string | null) => void;
}

export default function SongCarousel({ onSelectSong }: SongCarouselProps) {
  const [covers, setCovers] = useState<Record<number, string>>({});

  useEffect(() => {
    let cancelled = false;

    async function fetchCovers() {
      const results = await Promise.all(
        SONGS.map(async (song) => {
          try {
            const res = await fetch(
              `https://itunes.apple.com/search?term=${encodeURIComponent(
                song.searchQuery,
              )}&entity=song&limit=1`,
            );
            if (!res.ok) return null;
            const data = await res.json();
            const url: string | undefined = data?.results?.[0]?.artworkUrl100;
            if (!url) return null;
            const hires = url.replace('100x100', '600x600');
            return [song.id, hires] as const;
          } catch {
            return null;
          }
        }),
      );

      if (cancelled) return;
      const map: Record<number, string> = {};
      for (const r of results) {
        if (r) map[r[0]] = r[1];
      }
      setCovers(map);
    }

    fetchCovers();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full mt-12">
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

      {/* Continuously scrolling belt — never pauses */}
      <div className="overflow-hidden w-full">
        <div className="flex gap-4 px-4 w-max belt-animation">
          {[...SONGS, ...SONGS].map((song, i) => (
            <SongCard
              key={`${song.id}-${i}`}
              song={song}
              coverUrl={covers[song.id] ?? null}
              onClick={() => onSelectSong(song, covers[song.id] ?? null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
