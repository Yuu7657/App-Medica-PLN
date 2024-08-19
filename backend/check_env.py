import os
from google.cloud import speech

# Verificar la variable de entorno
credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
print(f'GOOGLE_APPLICATION_CREDENTIALS: {credentials_path}')

# Intentar inicializar el cliente de Google Cloud Speech
try:
    client = speech.SpeechClient()
    print("Google Cloud Speech client initialized successfully.")
except Exception as e:
    print(f"Error initializing Google Cloud Speech client: {e}")
