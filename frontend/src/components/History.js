import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './styles.css';

function History() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/notes')
      .then(response => {
        setNotes(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching notes:', error);
        Swal.fire('Error', 'No se pudieron cargar las notas. Inténtalo de nuevo.', 'error');
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/notes/${id}`)
      .then(response => {
        setNotes(notes.filter(note => note.id !== id));
        Swal.fire('Éxito', 'Nota eliminada', 'success');
      })
      .catch(error => {
        console.error('Error deleting note:', error);
        Swal.fire('Error', 'Hubo un problema al eliminar la nota', 'error');
      });
  };

  const handleEdit = (note) => {
    setEditingNote(note);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!editingNote.paciente.trim() || !editingNote.doctor.trim()) {
      Swal.fire('Error', 'Paciente y Doctor son campos requeridos.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('paciente', editingNote.paciente);
    formData.append('doctor', editingNote.doctor);
    formData.append('descripcion', editingNote.descripcion);
    formData.append('diagnostico', editingNote.diagnostico);
    formData.append('tratamiento', editingNote.tratamiento);
    formData.append('observaciones', editingNote.observaciones);
    formData.append('transcripcion', editingNote.transcripcion);
    if (editingNote.audio) {
      formData.append('audio', new File([editingNote.audio], 'audio.wav', { type: 'audio/wav' }));
    }

    axios.put(`http://localhost:5000/api/notes/${editingNote.id}`, formData)
      .then(response => {
        setNotes(notes.map(note => (note.id === editingNote.id ? editingNote : note)));
        setEditingNote(null);
        Swal.fire('Éxito', 'Nota actualizada', 'success');
      })
      .catch(error => {
        console.error('Error updating note:', error);
        Swal.fire('Error', 'Hubo un problema al actualizar la nota', 'error');
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingNote({
      ...editingNote,
      [name]: value,
    });
  };

  return (
    <div className="history-container">
      <h2>Historial de Notas Médicas</h2>
      {loading && <p>Cargando...</p>}
      {!loading && !notes.length && <p>No hay notas para mostrar.</p>}
      {notes.map(note => (
        <div key={note.id} className="note-card">
          <p><strong>Paciente:</strong> {note.paciente}</p>
          <p><strong>Doctor:</strong> {note.doctor}</p>
          <p><strong>Descripción:</strong> {note.descripcion}</p>
          <p><strong>Diagnóstico:</strong> {note.diagnostico}</p>
          <p><strong>Tratamiento:</strong> {note.tratamiento}</p>
          <p><strong>Observaciones:</strong> {note.observaciones}</p>
          {note.audio && (
            <audio controls>
              <source src={`data:audio/wav;base64,${note.audio}`} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          )}
          <button onClick={() => handleEdit(note)}>Editar</button>
          <button onClick={() => handleDelete(note.id)}>Eliminar</button>
        </div>
      ))}

      {editingNote && (
        <div className="edit-form">
          <h2>Editar Nota Médica</h2>
          <form onSubmit={handleUpdate}>
            <textarea
              name="paciente"
              value={editingNote.paciente}
              onChange={handleInputChange}
              placeholder="Nombre del Paciente"
            />
            <textarea
              name="doctor"
              value={editingNote.doctor}
              onChange={handleInputChange}
              placeholder="Nombre del Doctor"
            />
            <textarea
              name="descripcion"
              value={editingNote.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción"
            />
            <textarea
              name="diagnostico"
              value={editingNote.diagnostico}
              onChange={handleInputChange}
              placeholder="Diagnóstico"
            />
            <textarea
              name="tratamiento"
              value={editingNote.tratamiento}
              onChange={handleInputChange}
              placeholder="Tratamiento"
            />
            <textarea
              name="observaciones"
              value={editingNote.observaciones}
              onChange={handleInputChange}
              placeholder="Observaciones"
            />
            <button type="submit">Actualizar Nota</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default History;
