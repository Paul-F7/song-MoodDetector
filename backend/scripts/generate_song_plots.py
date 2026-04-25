"""Pre-render valence/arousal plots for the carousel songs.

Produces one PNG per song into frontend/public/song-plots/song-<id>.png
using the exact same visualize_emotion() function the /analyze endpoint
uses, so song plots are pixel-identical to upload-flow plots.
"""

import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND = os.path.dirname(HERE)
sys.path.insert(0, BACKEND)

from services.visualization import visualize_emotion  # noqa: E402

OUT_DIR = os.path.normpath(os.path.join(BACKEND, '..', 'frontend', 'public', 'song-plots'))

# (id, valence, arousal) — keep in sync with frontend/src/data/songs.ts
SONGS = [
    (1,  0.92, 0.92),  # Blinding Lights — Ecstatic
    (2,  0.20, 0.25),  # Someone Like You — Sad
    (3,  0.80, 0.75),  # Happy — Happy
    (4,  0.55, 0.95),  # Bohemian Rhapsody — Astonished
    (5,  0.25, 0.85),  # Bad Guy — Tense
    (6,  0.80, 0.75),  # Shape of You — Happy
    (7,  0.10, 0.90),  # Lose Yourself — Furious
    (8,  0.20, 0.25),  # Stay With Me — Sad
    (9,  0.88, 0.88),  # Thunderstruck — Excited
    (10, 0.55, 0.95),  # Shallow — Astonished
]


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    for song_id, valence, arousal in SONGS:
        buf = visualize_emotion(valence, arousal)
        path = os.path.join(OUT_DIR, f'song-{song_id}.png')
        with open(path, 'wb') as f:
            f.write(buf.getvalue())
        print(f'wrote {path}')


if __name__ == '__main__':
    main()
