import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
from matplotlib.colors import LinearSegmentedColormap
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent.parent))
from backend.constants.constants import EMOTION_COORDINATES


def generate_base_graph(output_path: str = None):

    if output_path is None:
        output_path = Path(__file__).parent.parent / 'assets' / 'valence_arousal_base.png'

    fig, ax = plt.subplots(figsize=(12, 12))

    # Create gradient background
    # Define colors for each corner: [bottom-left, bottom-right, top-left, top-right]
    # Low arousal negative (blue), low arousal positive (green),
    # high arousal negative (red), high arousal positive (yellow)
    resolution = 500
    x = np.linspace(0, 1, resolution)
    y = np.linspace(0, 1, resolution)
    X, Y = np.meshgrid(x, y)

    # Create RGB gradient
    # Red channel: increases with arousal in negative valence, decreases in positive
    # Green channel: increases with valence
    # Blue channel: increases in low arousal, negative valence
    R = (1 - X) * Y * 0.9 + X * Y * 1.0  # Red in top-left, yellow contribution top-right
    G = X * 0.8 + Y * X * 0.2  # Green increases with valence
    B = (1 - X) * (1 - Y) * 0.8 + (1 - X) * Y * 0.3  # Blue in bottom-left, some in top-left

    # Normalize and combine
    RGB = np.stack([R, G, B], axis=-1)
    RGB = np.clip(RGB, 0, 1)

    # Add some transparency/softness
    RGB = RGB * 0.4 + 0.6  # Lighten the colors

    ax.imshow(RGB, extent=[0, 1, 0, 1], origin='lower', aspect='auto')

    # Add quadrant divider lines
    ax.axhline(y=0.5, color='white', linestyle='-', alpha=0.5, linewidth=2)
    ax.axvline(x=0.5, color='white', linestyle='-', alpha=0.5, linewidth=2)

    # Add quadrant labels
    ax.text(0.25, 0.97, 'Tense / Angry', ha='center', va='top', fontsize=14,
            fontweight='bold', color='#8B0000', alpha=0.8)
    ax.text(0.75, 0.97, 'Excited / Happy', ha='center', va='top', fontsize=14,
            fontweight='bold', color='#B8860B', alpha=0.8)
    ax.text(0.25, 0.03, 'Sad / Depressed', ha='center', va='bottom', fontsize=14,
            fontweight='bold', color='#00008B', alpha=0.8)
    ax.text(0.75, 0.03, 'Calm / Relaxed', ha='center', va='bottom', fontsize=14,
            fontweight='bold', color='#006400', alpha=0.8)

    # Plot all emotion points
    for emotion, (v, a) in EMOTION_COORDINATES.items():
        # Color based on quadrant
        if v >= 0.5 and a >= 0.5:
            color = '#FF8C00'  # Orange for high energy positive
        elif v < 0.5 and a >= 0.5:
            color = '#DC143C'  # Crimson for high energy negative
        elif v < 0.5 and a < 0.5:
            color = '#4169E1'  # Royal blue for low energy negative
        else:
            color = '#228B22'  # Forest green for low energy positive

        ax.scatter(v, a, c=color, s=120, alpha=0.9, zorder=3,
                   edgecolors='white', linewidths=1.5)

        # Add emotion label with slight offset
        offset_x = 0.02 if v < 0.5 else -0.02
        ha = 'left' if v < 0.5 else 'right'
        ax.annotate(emotion, (v, a), textcoords="offset points",
                    xytext=(8 if v < 0.5 else -8, 5),
                    fontsize=9, fontweight='bold', color='#333333',
                    ha=ha, va='bottom',
                    bbox=dict(boxstyle='round,pad=0.2', facecolor='white',
                             edgecolor='none', alpha=0.7))

    # Add axis labels
    ax.set_xlabel('Valence (Negative → Positive)', fontsize=14, fontweight='bold', labelpad=10)
    ax.set_ylabel('Arousal (Low Energy → High Energy)', fontsize=14, fontweight='bold', labelpad=10)
    ax.set_title('Valence-Arousal Emotion Space', fontsize=18, fontweight='bold', pad=20)

    # Set limits and ticks
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.set_xticks([0, 0.25, 0.5, 0.75, 1])
    ax.set_yticks([0, 0.25, 0.5, 0.75, 1])

    # Style the spines
    for spine in ax.spines.values():
        spine.set_color('#666666')
        spine.set_linewidth(2)

    ax.tick_params(axis='both', which='major', labelsize=11, colors='#333333')

    plt.tight_layout()
    plt.savefig(output_path, dpi=200, bbox_inches='tight', facecolor='white')
    plt.close(fig)

    print(f"Base graph saved to: {output_path}")
    return output_path


if __name__ == '__main__':
    generate_base_graph()