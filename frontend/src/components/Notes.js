import React, { useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ReactMic } from 'react-mic';
import './styles.css';

function Notes() {
  const [paciente, setPaciente] = useState('');
  const [doctor, setDoctor] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [audio, setAudio] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [record, setRecord] = useState(false);
  const [loading, setLoading] = useState(false);

  const micRef = useRef(null);

  const handleStartRecording = () => {
    setRecord(true);
  };

  const handleStopRecording = () => {
    setRecord(false);
  };

  const onData = (recordedBlob) => {
    console.log('Chunk of real-time data: ', recordedBlob);
  };

  const onStop = (recordedBlob) => {
    console.log('Recorded Blob: ', recordedBlob);
    setAudio(recordedBlob.blob);
    console.log('MIME Type of Blob: ', recordedBlob.blob.type); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!paciente.trim() || !doctor.trim()) {
      Swal.fire('Error', 'Paciente y Doctor son campos requeridos.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('paciente', paciente);
    formData.append('doctor', doctor);
    formData.append('descripcion', descripcion);
    formData.append('diagnostico', diagnostico);
    formData.append('tratamiento', tratamiento);
    formData.append('observaciones', observaciones);
    formData.append('transcripcion', transcription);
    if (audio) {
      formData.append('audio', new File([audio], 'audio.wav', { type: 'audio/wav' }));
    }

    setLoading(true);
    axios.post('http://localhost:5000/api/notes', formData)
      .then(response => {
        console.log(response.data);
        setPaciente('');
        setDoctor('');
        setDescripcion('');
        setDiagnostico('');
        setTratamiento('');
        setObservaciones('');
        setAudio(null);
        setTranscription('');
        Swal.fire('Éxito', 'Nota guardada', 'success');
      })
      .catch(error => {
        console.error('Error creating note:', error);
        Swal.fire('Error', 'Hubo un problema al guardar la nota', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleTranscribe = () => {
    if (!audio) {
      Swal.fire('Error', 'No hay audio para transcribir', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('audio', new File([audio], 'audio.wav', { type: 'audio/wav' }));

    setLoading(true);
    axios.post('http://localhost:5000/api/transcribe', formData)
      .then(response => {
        console.log('Transcription Response:', response.data); // Añade esta línea para depuración
        if (response.data.transcription) {
          setTranscription(response.data.transcription);
          Swal.fire('Éxito', 'Transcripción completada', 'success');
        } else {
          Swal.fire('Error', 'No se pudo obtener la transcripción.', 'error');
        }
      })
      .catch(error => {
        console.error('Error transcribing audio:', error);
        Swal.fire('Error', 'Hubo un problema al transcribir el audio', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="create-form">
      <h2>Crear Nota Médica</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={paciente}
          onChange={(e) => setPaciente(e.target.value)}
          placeholder="Nombre del Paciente"
        />
        <textarea
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          placeholder="Nombre del Doctor"
        />
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción"
        />
        <textarea
          value={diagnostico}
          onChange={(e) => setDiagnostico(e.target.value)}
          placeholder="Diagnóstico"
        />
        <textarea
          value={tratamiento}
          onChange={(e) => setTratamiento(e.target.value)}
          placeholder="Tratamiento"
        />
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Observaciones"
        />
        <textarea
          value={transcription}
          onChange={(e) => setTranscription(e.target.value)}
          placeholder="Transcripción"
          readOnly
        />

        <ReactMic
          record={record}
          className="sound-wave"
          onStop={onStop}
          onData={onData}
          mimeType="audio/wav"
          strokeColor="#000000"
          backgroundColor="#ffffff"
          ref={micRef}
        />
        <button type="button" onClick={handleStartRecording}>Iniciar Grabación</button>
        <button type="button" onClick={handleStopRecording}>Detener Grabación</button>
        <button type="button" onClick={handleTranscribe}>Transcribir Audio</button>
        <button type="submit">Guardar Nota</button>
      </form>
      {loading && <p>Cargando...</p>}
      {transcription && (
        <div>
          <h3>Transcripción</h3>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
}

export default Notes;