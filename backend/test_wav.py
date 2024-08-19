import wave
import os
import requests

def download_wav_file(url, save_path):
    try:
        response = requests.get(url)
        response.raise_for_status()
        with open(save_path, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded file to: {save_path}")
    except Exception as e:
        print(f"Error downloading file: {e}")

def verify_audio_file(filepath):
    try:
        with wave.open(filepath, 'rb') as wav_file:
            frames = wav_file.getnframes()
            if frames == 0:
                print("Audio file is empty or corrupt.")
            else:
                print(f"Audio file contains {frames} frames.")
    except wave.Error as e:
        print(f"Error opening audio file: {e}")

if __name__ == '__main__':
    url = 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav'
    save_path = r'C:\Users\ashis\OneDrive\Escritorio\app-python\backend\uploads\BabyElephantWalk60.wav'

    # Descargar el archivo WAV si no existe
    if not os.path.exists(save_path):
        download_wav_file(url, save_path)

    # Verificar el archivo WAV
    if os.path.exists(save_path):
        verify_audio_file(save_path)
    else:
        print(f"File {save_path} does not exist.")
