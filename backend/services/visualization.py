import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from io import BytesIO
from pathlib import Path

BASE_GRAPH_PATH = '../assets/valence_arousal_base.png'

def visualize_emotion(valence: float, arousal: float) -> BytesIO:
    img = mpimg.imread(BASE_GRAPH_PATH)
    fig, ax = plt.subplots(figsize=(10, 10))
    ax.imshow(img, extent=[0, 1, 0, 1], aspect='auto', origin='upper')
    ax.scatter(valence, arousal, c='red', s=500, marker='o', zorder=5,
               edgecolors='darkred', linewidths=3)
    ax.annotate('YOUR SONG', xy=(valence, arousal), xytext=(valence + 0.12, arousal + 0.12),
                fontsize=14, fontweight='bold', color='darkred',
                arrowprops=dict(arrowstyle='->', color='darkred', lw=2),
                bbox=dict(boxstyle='round,pad=0.3', facecolor='white', edgecolor='darkred', alpha=0.9),
                zorder=6)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    plt.tight_layout()
    buf = BytesIO()
    plt.savefig(buf, format='png', dpi=150, bbox_inches='tight', pad_inches=0)
    buf.seek(0)
    plt.close(fig)
    return buf