from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os
import wave
import base64
from werkzeug.utils import secure_filename
import assemblyai as aai
from pydub import AudioSegment

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="utom",
    database="app_medica"
)

# Tu clave de API de AssemblyAI
ASSEMBLYAI_API_KEY = '7322368d62d142af8abeb23b24915ef8'
aai.settings.api_key = ASSEMBLYAI_API_KEY

def save_audio_temporarily(audio):
    try:
        if not os.path.exists('uploads'):
            os.makedirs('uploads')
        
        filename = secure_filename(audio.filename)
        filepath = os.path.join('uploads', filename)
        audio.save(filepath)
        print(f"Audio file saved to: {filepath}")
        return filepath
    except Exception as e:
        print(f"Error saving audio: {e}")
        return None

def convert_audio_to_wav(filepath):
    try:
        audio = AudioSegment.from_file(filepath)
        wav_path = filepath.replace(filepath.split('.')[-1], 'wav')
        audio.export(wav_path, format='wav')
        print(f"Audio file converted to WAV format: {wav_path}")
        return wav_path
    except Exception as e:
        print(f"Error converting audio to WAV: {e}")
        return None

def verify_audio_file(filepath):
    try:
        with wave.open(filepath, 'rb') as wav_file:
            frames = wav_file.getnframes()
            if frames == 0:
                print("Audio file is empty or corrupt.")
                return False
            else:
                print(f"Audio file contains {frames} frames.")
                return True
    except wave.Error as e:
        print(f"Error opening audio file: {e}")
        return False

def transcribe_audio_with_assemblyai(filepath):
    try:
        transcriber = aai.Transcriber()
        transcript = transcriber.transcribe(filepath)
        if transcript.status == aai.TranscriptStatus.error:
            print(transcript.error)
            return None
        else:
            return transcript.text
    except Exception as e:
        print(f"Error transcribing audio: {e}")
        return None

# Ruta para crear una nota
@app.route('/api/notes', methods=['POST'])
def create_note():
    try:
        paciente = request.form['paciente']
        doctor = request.form['doctor']
        descripcion = request.form['descripcion']
        diagnostico = request.form['diagnostico']
        tratamiento = request.form['tratamiento']
        observaciones = request.form['observaciones']
        transcripcion = request.form['transcripcion']
        audio = request.files['audio'].read() if 'audio' in request.files else None

        cursor = db.cursor()
        cursor.execute("INSERT INTO notas_medicas (paciente, doctor, descripcion, diagnostico, tratamiento, observaciones, transcripcion, audio) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                       (paciente, doctor, descripcion, diagnostico, tratamiento, observaciones, transcripcion, audio))
        db.commit()
        return jsonify({'message': 'Nota creada con éxito'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Ruta para obtener todas las notas
@app.route('/api/notes', methods=['GET'])
def get_notes():
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM notas_medicas")
        notes = cursor.fetchall()
        for note in notes:
            if note['audio']:
                note['audio'] = base64.b64encode(note['audio']).decode('ISO-8859-1')
        return jsonify(notes)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Ruta para obtener una nota por ID
@app.route('/api/notes/<int:id>', methods=['GET'])
def get_note_by_id(id):
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM notas_medicas WHERE id = %s", (id,))
        note = cursor.fetchone()
        if note and note['audio']:
            note['audio'] = base64.b64encode(note['audio']).decode('ISO-8859-1')
        return jsonify(note)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Ruta para actualizar una nota por ID
@app.route('/api/notes/<int:id>', methods=['PUT'])
def update_note_by_id(id):
    try:
        paciente = request.form['paciente']   
        doctor = request.form['doctor']
        descripcion = request.form['descripcion']
        diagnostico = request.form['diagnostico']
        tratamiento = request.form['tratamiento']
        observaciones = request.form['observaciones']
        transcripcion = request.form['transcripcion']
        audio = request.files['audio'].read() if 'audio' in request.files else None

        cursor = db.cursor()
        if audio:
            cursor.execute("""
                UPDATE notas_medicas
                SET paciente = %s, doctor = %s, descripcion = %s, diagnostico = %s,
                    tratamiento = %s, observaciones = %s, transcripcion = %s, audio = %s
                WHERE id = %s
            """, (paciente, doctor, descripcion, diagnostico, tratamiento, observaciones, transcripcion, audio, id))
        else:
            cursor.execute("""
                UPDATE notas_medicas
                SET paciente = %s, doctor = %s, descripcion = %s, diagnostico = %s,
                    tratamiento = %s, observaciones = %s, transcripcion = %s
                WHERE id = %s
            """, (paciente, doctor, descripcion, diagnostico, tratamiento, observaciones, transcripcion, id))

        db.commit()

        return jsonify({'message': 'Nota actualizada con éxito'})

    except mysql.connector.Error as db_error:
        print(f"Database error: {db_error}")
        return jsonify({'error': 'Database error'}), 500
    except Exception as e:
        print(f"General error: {e}")
        return jsonify({'error': 'Error general al actualizar la nota'}), 500

# Ruta para eliminar una nota por ID
@app.route('/api/notes/<int:id>', methods=['DELETE'])
def delete_note_by_id(id):
    try:
        cursor = db.cursor()
        cursor.execute("DELETE FROM notas_medicas WHERE id = %s", (id,))
        db.commit()
        return jsonify({'message': 'Nota eliminada con éxito'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Ruta para transcribir audio
@app.route('/api/transcribe', methods=['POST'])
def transcribe_audio():
    try:
        if 'audio' not in request.files:
            print("No audio file part")
            return jsonify({'error': 'No audio part in the request'}), 400

        audio = request.files['audio']
        
        print(f"Received file:\nFilename: {audio.filename}\nContent-Type: {audio.content_type}")

        filepath = save_audio_temporarily(audio)
        if not filepath:
            return jsonify({'error': 'Error al guardar el archivo de audio'}), 500

        wav_filepath = convert_audio_to_wav(filepath)
        if not wav_filepath:
            return jsonify({'error': 'Error al convertir el archivo de audio a formato WAV'}), 500

        if not verify_audio_file(wav_filepath):
            return jsonify({'error': 'El archivo de audio está vacío o corrupto'}), 400

        transcription_text = transcribe_audio_with_assemblyai(wav_filepath)
        if transcription_text is None:
            return jsonify({'error': 'Error al obtener el resultado de la transcripción'}), 500

        return jsonify({'transcription': transcription_text})

    except Exception as e:
        print(f"Exception: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
