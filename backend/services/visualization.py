import os
import math
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE_GRAPH_PATH = os.path.join(BASE_DIR, 'assets', 'valence_arousal_base.png')

# These define the plot area within the image (in pixels)
# Image is 2379x2379, center (0.5, 0.5) is at pixel (1050, 1237)
PLOT_LEFT = 125
PLOT_RIGHT = 1975
PLOT_TOP = 312
PLOT_BOTTOM = 2162

def visualize_emotion(valence: float, arousal: float) -> BytesIO:
    img = Image.open(BASE_GRAPH_PATH).convert('RGBA')
    draw = ImageDraw.Draw(img)

    # Map valence (0-1) to x pixel coordinate
    x = PLOT_LEFT + valence * (PLOT_RIGHT - PLOT_LEFT)
    # Map arousal (0-1) to y pixel coordinate (inverted because y=0 is top in images)
    y = PLOT_BOTTOM - arousal * (PLOT_BOTTOM - PLOT_TOP)

    # Draw the point
    radius = 25
    draw.ellipse(
        [x - radius, y - radius, x + radius, y + radius],
        fill='red',
        outline='darkred',
        width=3
    )

    # Draw arrow and label
    # Position label offset based on point location to stay in bounds
    offset = 120
    if valence > 0.7:
        text_x = x - offset
    else:
        text_x = x + offset
    if arousal > 0.7:
        text_y = y + offset
    else:
        text_y = y - offset

    # Draw arrow line from text to point
    arrow_color = 'darkred'
    draw.line([(text_x, text_y), (x, y)], fill=arrow_color, width=4)

    # Draw arrowhead
    angle = math.atan2(y - text_y, x - text_x)
    arrow_size = 20
    arrow_angle = math.pi / 6  # 30 degrees

    x1 = x - arrow_size * math.cos(angle - arrow_angle)
    y1 = y - arrow_size * math.sin(angle - arrow_angle)
    x2 = x - arrow_size * math.cos(angle + arrow_angle)
    y2 = y - arrow_size * math.sin(angle + arrow_angle)

    draw.polygon([(x, y), (x1, y1), (x2, y2)], fill=arrow_color)

    # Draw text label with background
    try:
        font = ImageFont.load_default(size=36)
    except:
        font = ImageFont.load_default()

    text = "YOUR SONG"
    bbox = draw.textbbox((text_x, text_y), text, font=font, anchor="mm")
    padding = 10
    draw.rounded_rectangle(
        [bbox[0] - padding, bbox[1] - padding, bbox[2] + padding, bbox[3] + padding],
        radius=8,
        fill='white',
        outline='darkred',
        width=2
    )
    draw.text((text_x, text_y), text, fill='darkred', font=font, anchor="mm")

    buf = BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    return buf