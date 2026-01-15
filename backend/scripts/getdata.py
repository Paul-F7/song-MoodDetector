import pandas as pd
import numpy as np
import librosa
import os
import pickle
import time
from tqdm import tqdm

"""
Audio Feature Extraction Pipeline
Extracts 89 librosa features from all audio files
Output: CSV table ready for ML training
"""

AUDIO_DIR = '../dataset/DEAM_audio/MEMD_audio'  # Folder with your MP3 files
CHECKPOINT_INTERVAL = 100
CHECKPOINT_FILE = 'checkpoint.pkl'
OUTPUT_FILE = 'audio_features.csv'


# goes through every file in the song directory
audio_files = []
for filename in os.listdir(AUDIO_DIR):
    name, ext = os.path.splitext(filename)
    audio_files.append({'song_id': name, 'filepath': os.path.join(AUDIO_DIR, filename)})
print(f" Saved {len(audio_files)} audio files")


audio_df = pd.DataFrame(audio_files)

# Extracts 89 librosa audio features, returns numpy array or None
def extract_features(audio_path, duration=45, sr=22050): #what does sr mean
    try:
        # get audio
        y, sr = librosa.load(audio_path, duration=duration, sr=sr, mono=True)
        # check if audio valid
        if len(y) == 0 or np.max(np.abs(y)) < 0.001:
            return None
        
        # temporal features
        zcr = librosa.feature.zero_crossing_rate(y)
        zcr_mean = np.mean(zcr)
        zcr_std = np.std(zcr)
        
        rms = librosa.feature.rms(y=y)
        rms_mean = np.mean(rms)
        rms_std = np.std(rms)
        
        # spectral features
        spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
        sc_mean = np.mean(spectral_centroid)
        sc_std = np.std(spectral_centroid)
        
        spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)
        sb_mean = np.mean(spectral_bandwidth)
        sb_std = np.std(spectral_bandwidth)
        
        spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
        sr_mean = np.mean(spectral_rolloff)
        sr_std = np.std(spectral_rolloff)
        
        spectral_contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
        contrast_mean = np.mean(spectral_contrast, axis=1)  # 7 features
        contrast_std = np.std(spectral_contrast, axis=1)    # 7 features
        
        # rhythm features
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        
        # tonal/harmonic features
        chroma = librosa.feature.chroma_stft(y=y, sr=sr)
        chroma_mean = np.mean(chroma, axis=1)  # 12 features
        chroma_std = np.std(chroma, axis=1)    # 12 features
        
        tonnetz = librosa.feature.tonnetz(y=y, sr=sr)
        tonnetz_mean = np.mean(tonnetz, axis=1)  # 6 features
        tonnetz_std = np.std(tonnetz, axis=1)    # 6 features
        
        # timbre features
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        mfcc_mean = np.mean(mfcc, axis=1)  # 13 features
        mfcc_std = np.std(mfcc, axis=1)    # 13 features
        
        # harmonic / percussive featurees
        y_harmonic, y_percussive = librosa.effects.hpss(y)
        harmonic_ratio = np.mean(np.abs(y_harmonic)) / (np.mean(np.abs(y)) + 1e-6)
        percussive_ratio = np.mean(np.abs(y_percussive)) / (np.mean(np.abs(y)) + 1e-6)
        
        # combining all features into 1 array
        features = np.concatenate([
            # Temporal (4)
            [zcr_mean, zcr_std, rms_mean, rms_std],
            
            # Spectral (22)
            [sc_mean, sc_std, sb_mean, sb_std, sr_mean, sr_std],
            contrast_mean,  # 7
            contrast_std,   # 7
            
            # Rhythm (1)
            [tempo[0]],  # tempo is now an array in newer librosa versions
            
            # Tonal/Harmonic (36)
            chroma_mean,    # 12
            chroma_std,     # 12
            tonnetz_mean,   # 6
            tonnetz_std,    # 6
            
            # Timbre (26)
            mfcc_mean,      # 13
            mfcc_std,       # 13
            
            # Harmonic/Percussive (2)
            [harmonic_ratio, percussive_ratio]
        ])
        return features
    except Exception as e:
        return None


print("\nEstimating processing time...")    
# Test on 3 files and estimate about of time
sample = audio_df.head(3)
start = time.time()
    
for _, row in sample.iterrows():
    extract_features(row['filepath'])
duration = time.time() - start
avg_time = duration / 3
total_hours = (avg_time * len(audio_df)) / 3600

print(f"  Average time per file: {avg_time:.1f} seconds")
print(f"  Estimated total time: {total_hours:.1f} hours")
print(f"  ({len(audio_df)} files × {avg_time:.1f}s)")

if total_hours > 0.5:
    response = input("\n  Continue with extraction? (y/n): ")
    if response.lower() != 'y':
        print("  Cancelled.")
        exit()


print(f"\n Checking for previous progress...")

feature_data = []
processed_ids = set()

if os.path.exists(CHECKPOINT_FILE):
    try:
        with open(CHECKPOINT_FILE, 'rb') as f:
            checkpoint = pickle.load(f)
            feature_data = checkpoint['data']
            processed_ids = checkpoint['processed']
        print(f"Loaded checkpoint: {len(feature_data)} files already processed")
        print(f"  Resuming from where you left off...")
    except:
        print("Checkpoint file corrupted, starting fresh")
else:
    print(" No previous progress found, starting fresh")


#
# Extracting Features from All Files
#
if len(processed_ids) > 0:
    print(f"Already processed: {len(processed_ids)}")
    print(f"Remaining: {len(audio_df) - len(processed_ids)}")

failed = []
start_time = time.time()

for idx, row in tqdm(audio_df.iterrows(), 
                     total=len(audio_df),
                     desc="Extracting features"):
    
    song_id = row['song_id']
    
    # Skip if already processed
    if song_id in processed_ids:
        continue
    
    # Extract features
    features = extract_features(row['filepath'])
    
    if features is not None:
        feature_data.append({
            'song_id': song_id,
            'features': features
        })
        processed_ids.add(song_id)
    else:
        failed.append(song_id)
    
    # Save checkpoint periodically
    if len(feature_data) % CHECKPOINT_INTERVAL == 0 and len(feature_data) > 0:
        with open(CHECKPOINT_FILE, 'wb') as f:
            pickle.dump({
                'data': feature_data,
                'processed': processed_ids
            }, f)

elapsed = time.time() - start_time

print(f"\nSuccessfully processed: {len(feature_data)} files")
print(f"Failed: {len(failed)} files")
print(f"Time elapsed: {elapsed/60:.1f} minutes")

if failed and len(failed) <= 20:
    print(f"\nFailed files: {failed}")



#
# Create Feature Table
#
print(f"\nCreating feature table...")

if len(feature_data) == 0:
    print("ERROR: No features extracted!")
    exit()

# Convert to DataFrame
df = pd.DataFrame(feature_data)

# Create feature column names
feature_names = (
    # Temporal (4)
    ['zcr_mean', 'zcr_std', 'rms_mean', 'rms_std'] +
    
    # Spectral (22)
    ['spectral_centroid_mean', 'spectral_centroid_std',
     'spectral_bandwidth_mean', 'spectral_bandwidth_std',
     'spectral_rolloff_mean', 'spectral_rolloff_std'] +
    [f'spectral_contrast_{i}_mean' for i in range(7)] +
    [f'spectral_contrast_{i}_std' for i in range(7)] +
    
    # Rhythm (1)
    ['tempo'] +
    
    # Tonal/Harmonic (36)
    [f'chroma_{i}_mean' for i in range(12)] +
    [f'chroma_{i}_std' for i in range(12)] +
    [f'tonnetz_{i}_mean' for i in range(6)] +
    [f'tonnetz_{i}_std' for i in range(6)] +
    
    # Timbre (26)
    [f'mfcc_{i}_mean' for i in range(1, 14)] +
    [f'mfcc_{i}_std' for i in range(1, 14)] +
    
    # Harmonic/Percussive (2)
    ['harmonic_ratio', 'percussive_ratio']
) 

# Make features columns
features_expanded = pd.DataFrame(
    df['features'].tolist(),
    columns=feature_names
)

# Add song_id as first column
features_table = pd.concat([
    df[['song_id']].reset_index(drop=True),
    features_expanded
], axis=1)

# Save to CSV
features_table.to_csv(OUTPUT_FILE, index=False)

print(f"Feature table saved: {OUTPUT_FILE}")
print(f"  Shape: {features_table.shape[0]} songs × {features_table.shape[1]} columns")
