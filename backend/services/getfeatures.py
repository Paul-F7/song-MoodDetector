import librosa
import numpy as np
from io import BytesIO


# extracts features from song, same features that were used 
def get_features(audio_file, duration=45, sr=22050):
    try:
        if isinstance(audio_file, bytes):
            audio_file = BytesIO(audio_file)

        y, sr = librosa.load(audio_file, duration=duration, sr=sr, mono=True)

        if len(y) == 0 or np.max(np.abs(y)) < 0.001:
            return None

        # Temporal features (4)
        zcr = librosa.feature.zero_crossing_rate(y)
        zcr_mean, zcr_std = np.mean(zcr), np.std(zcr)

        rms = librosa.feature.rms(y=y)
        rms_mean, rms_std = np.mean(rms), np.std(rms)

        # Spectral features (22)
        spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
        sc_mean, sc_std = np.mean(spectral_centroid), np.std(spectral_centroid)

        spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)
        sb_mean, sb_std = np.mean(spectral_bandwidth), np.std(spectral_bandwidth)

        spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
        sr_mean, sr_std = np.mean(spectral_rolloff), np.std(spectral_rolloff)

        spectral_contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
        contrast_mean = np.mean(spectral_contrast, axis=1)
        contrast_std = np.std(spectral_contrast, axis=1)

        # Rhythm features (1)
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)

        # Tonal/Harmonic features (36)
        chroma = librosa.feature.chroma_stft(y=y, sr=sr)
        chroma_mean = np.mean(chroma, axis=1)
        chroma_std = np.std(chroma, axis=1)

        tonnetz = librosa.feature.tonnetz(y=y, sr=sr)
        tonnetz_mean = np.mean(tonnetz, axis=1)
        tonnetz_std = np.std(tonnetz, axis=1)

        # Timbre features (26)
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        mfcc_mean = np.mean(mfcc, axis=1)
        mfcc_std = np.std(mfcc, axis=1)

        # Harmonic/Percussive features (2)
        y_harmonic, y_percussive = librosa.effects.hpss(y)
        harmonic_ratio = np.mean(np.abs(y_harmonic)) / (np.mean(np.abs(y)) + 1e-6)
        percussive_ratio = np.mean(np.abs(y_percussive)) / (np.mean(np.abs(y)) + 1e-6)

        # Combine in exact training order
        features = np.concatenate([
            [zcr_mean, zcr_std, rms_mean, rms_std],
            [sc_mean, sc_std, sb_mean, sb_std, sr_mean, sr_std],
            contrast_mean, contrast_std,
            [tempo[0]],
            chroma_mean, chroma_std,
            tonnetz_mean, tonnetz_std,
            mfcc_mean, mfcc_std,
            [harmonic_ratio, percussive_ratio]
        ])

        return features.reshape(1, -1)  # Shape (1, 89) for model

    except Exception as e:
        print(f"Feature extraction failed: {e}")
        return None
