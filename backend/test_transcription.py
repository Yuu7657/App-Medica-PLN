import os
from google.cloud import speech

# Establecer la variable de entorno
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:/Users/ashis/OneDrive/Escritorio/app-python/credentials/my_project_key.json"
print("Variable de entorno GOOGLE_APPLICATION_CREDENTIALS:", os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))

def transcribe_audio():
    audio_file_path = 'uploads/temp_audio.wav'
    
    try:
        print("Inicializando cliente de Google Cloud Speech...")
        client = speech.SpeechClient()

        with open(audio_file_path, 'rb') as audio:
            audio_content = audio.read()

        print("Configurando reconocimiento de audio...")
        audio = speech.RecognitionAudio(content=audio_content)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code='en-US',
        )

        print("Realizando reconocimiento de voz...")
        response = client.recognize(config=config, audio=audio)

        transcription = ''
        for result in response.results:
            transcription += result.alternatives[0].transcript

        print("Transcripción completada:", transcription)
    except Exception as e:
        print(f"Error during transcription: {e}")  # Agregar detalles del error

if __name__ == '__main__':
    transcribe_audio()
