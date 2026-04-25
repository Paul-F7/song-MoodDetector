"""Generate valence-arousal graphs for a curated list of mainstream songs.

Renders one PNG per song using assets/valence_arousal_base.png as the backdrop
and writes them into assets/song_examples/.
"""
import os
import math
import re
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE_GRAPH_PATH = os.path.join(BASE_DIR, 'assets', 'valence_arousal_base.png')
OUTPUT_DIR = os.path.join(BASE_DIR, 'assets', 'song_examples')

OUTPUT_SIZE = 800

PLOT_LEFT = 125
PLOT_RIGHT = 1975
PLOT_TOP = 312
PLOT_BOTTOM = 2162

# Valence (0 negative -> 1 positive), Arousal (0 low energy -> 1 high energy)
SONGS = [
    ("Happy - Pharrell Williams",            0.96, 0.82),
    ("Uptown Funk - Bruno Mars",             0.92, 0.90),
    ("Don't Stop Believin' - Journey",       0.86, 0.80),
    ("Shape of You - Ed Sheeran",            0.82, 0.72),
    ("Smells Like Teen Spirit - Nirvana",    0.30, 0.94),
    ("Bohemian Rhapsody - Queen",            0.50, 0.70),
    ("Hello - Adele",                        0.22, 0.40),
    ("Someone Like You - Adele",             0.18, 0.28),
    ("Mad World - Gary Jules",               0.12, 0.18),
    ("Weightless - Marconi Union",           0.62, 0.10),
]


def slugify(name: str) -> str:
    s = name.lower()
    s = re.sub(r"[^a-z0-9]+", "_", s)
    return s.strip("_")


def render(base: Image.Image, label: str, valence: float, arousal: float) -> Image.Image:
    img = base.copy()
    draw = ImageDraw.Draw(img)

    x = PLOT_LEFT + valence * (PLOT_RIGHT - PLOT_LEFT)
    y = PLOT_BOTTOM - arousal * (PLOT_BOTTOM - PLOT_TOP)

    radius = 25
    draw.ellipse(
        [x - radius, y - radius, x + radius, y + radius],
        fill='red', outline='darkred', width=3,
    )

    offset = 140
    text_x = x - offset if valence > 0.6 else x + offset
    text_y = y + offset if arousal > 0.7 else y - offset

    arrow_color = 'darkred'
    draw.line([(text_x, text_y), (x, y)], fill=arrow_color, width=4)

    angle = math.atan2(y - text_y, x - text_x)
    arrow_size = 20
    arrow_angle = math.pi / 6
    x1 = x - arrow_size * math.cos(angle - arrow_angle)
    y1 = y - arrow_size * math.sin(angle - arrow_angle)
    x2 = x - arrow_size * math.cos(angle + arrow_angle)
    y2 = y - arrow_size * math.sin(angle + arrow_angle)
    draw.polygon([(x, y), (x1, y1), (x2, y2)], fill=arrow_color)

    try:
        font = ImageFont.load_default(size=34)
    except Exception:
        font = ImageFont.load_default()

    bbox = draw.textbbox((text_x, text_y), label, font=font, anchor="mm")
    padding = 12
    draw.rounded_rectangle(
        [bbox[0] - padding, bbox[1] - padding, bbox[2] + padding, bbox[3] + padding],
        radius=10, fill='white', outline='darkred', width=2,
    )
    draw.text((text_x, text_y), label, fill='darkred', font=font, anchor="mm")

    return img.resize((OUTPUT_SIZE, OUTPUT_SIZE), Image.LANCZOS)


def main() -> None:
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    base = Image.open(BASE_GRAPH_PATH).convert('RGBA')

    for label, valence, arousal in SONGS:
        out = render(base, label, valence, arousal)
        path = os.path.join(OUTPUT_DIR, f"{slugify(label)}.png")
        out.save(path, format='PNG')
        print(f"wrote {path}  (valence={valence}, arousal={arousal})")


if __name__ == "__main__":
    main()
