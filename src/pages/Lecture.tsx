import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/axios";
import { useAuth } from "../hooks/useAuth";
import AssignmentForm from "../components/AssignmentForm";
import CourseNoteForm from "../components/courseNoteForm";
import {
  getNotesByLecture,
  createNote,
  updateNote,
  deleteNote,
} from "../services/courseNoteService";
import type { LectureResponseDTO } from "../types/Lecture";
import type { AssignmentResponseDTO } from "../types/Assignments";
import type { CourseNoteResponseDTO, CourseNoteRequestDTO } from "../types/CourseNote";
import "./style/LecturePage.css";

export default function LecturePage() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const { isInstructor } = useAuth();

  const [lecture, setLecture] = useState<LectureResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Course notes state
  const [notes, setNotes] = useState<CourseNoteResponseDTO[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [notesError, setNotesError] = useState<string | null>(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState<CourseNoteResponseDTO | undefined>(undefined);

  // Assignment form state
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [editingAssign, setEditingAssign] = useState<AssignmentResponseDTO | null>(null);

  useEffect(() => {
    if (!lectureId) return;
    setLoading(true);
    api
      .get<LectureResponseDTO>(`/lectures/${lectureId}`)
      .then(res => setLecture(res.data))
      .catch(err => {
        console.error(err);
        setError("Could not load lecture details.");
      })
      .finally(() => setLoading(false));
  }, [lectureId]);

  // Fetch notes
  const refreshNotes = () => {
    if (!lectureId) return;
    setNotesLoading(true);
    getNotesByLecture(Number(lectureId))
      .then(setNotes)
      .catch(err => {
        console.error(err);
        setNotesError("Could not load notes.");
      })
      .finally(() => setNotesLoading(false));
  };
  useEffect(refreshNotes, [lectureId]);

  // Refresh lecture details
  const refreshLecture = () => {
    if (!lectureId) return;
    api
      .get<LectureResponseDTO>(`/lectures/${lectureId}`)
      .then(res => setLecture(res.data))
      .catch(console.error);
  };

  const handleDeleteAssignment = async (id: number) => {
    await api.delete(`/assignments/${id}`);
    refreshLecture();
  };

  const handleDeleteNote = async (id: number) => {
    await deleteNote(id);
    refreshNotes();
  };

  if (loading) return <div className="lecture-loading">Loading...</div>;
  if (error) return <div className="lecture-error">{error}</div>;
  if (!lecture) return <div className="lecture-error">Lecture not found.</div>;

  return (
    <div className="lecture-page">
      {/* Header */}
      <div className="lecture-header-card">
        <h2>{lecture.lectureTitle}</h2>
        <p><strong>Course:</strong> {lecture.courseCode} – {lecture.courseName}</p>
        <p>
          <strong>Week:</strong> {lecture.weekNumber} |{' '}
          <strong>When:</strong> {new Date(lecture.scheduledDate).toLocaleString()}
        </p>
        {lecture.onlineLectureLink && (
          <p>
            <a href={lecture.onlineLectureLink} target="_blank" rel="noreferrer">
              Join Online Lecture
            </a>
          </p>
        )}
        <p>{lecture.description}</p>
      </div>

      {/* Course Notes Section */}
      <section className="notes-section">
        <h3>Lecture Notes</h3>

        {notesLoading ? (
          <p>Loading notes…</p>
        ) : notesError ? (
          <p className="error">{notesError}</p>
        ) : (
          <>
            {isInstructor && !showNoteForm && (
              <button
                className="add-note-btn"
                onClick={() => { setEditingNote(undefined); setShowNoteForm(true); }}
              >
                + Upload Note
              </button>
            )}

            {showNoteForm && (
  <CourseNoteForm
    initial={editingNote}
    lectureId={Number(lectureId)}
    onCancel={() => setShowNoteForm(false)}
    onDone={() => {
      // close & reset form
      setShowNoteForm(false);
      setEditingNote(undefined);
      // reload the notes list
      refreshNotes();
    }}
  />
)}


            {notes.length > 0 ? (
              <ul className="note-list">
                {notes.map(note => (
                  <li key={note.id} className="note-item">
                    <a href={note.filePath} download>
                      {note.noteTitle}
                    </a>
                    <p>Type: {note.fileType}</p>
                    <p>
                      Uploaded by {note.uploadedBy} on{' '}
                      {new Date(note.uploadedAt).toLocaleString()}
                    </p>
                    {isInstructor && (
                      <button onClick={() => handleDeleteNote(note.id)}>
                        Delete
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">No notes uploaded.</p>
            )}
          </>
        )}
      </section>

      {/* Assignments Section */}
      <section className="assignments-section">
        <h3>Assignments</h3>

        {isInstructor && !showAssignForm && (
          <button
            onClick={() => { setEditingAssign(null); setShowAssignForm(true); }}
          >
            + Add Assignment
          </button>
        )}

        {showAssignForm && (
          <AssignmentForm
            initial={editingAssign ?? undefined}
            lectureId={Number(lectureId)}
            onCancel={() => setShowAssignForm(false)}
            onSubmit={async data => {
              if (editingAssign) {
                await api.put(`/assignments/${editingAssign.id}`, data);
              } else {
                await api.post(`/assignments`, data);
              }
              setShowAssignForm(false);
              setEditingAssign(null);
              refreshLecture();
            }}
          />
        )}

        {lecture.assignments?.length ? (
          <ul className="assignment-list">
            {lecture.assignments
              .slice()
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .map((assn: AssignmentResponseDTO) => (
                <li key={assn.id} className="assignment-item">
                  <Link to={`/lectures/${lectureId}/assignments/${assn.id}`}>
                    <h4>{assn.assignmentTitle}</h4>
                    <p>Due: {new Date(assn.dueDate).toLocaleString()}</p>
                  </Link>

                  {isInstructor && (
                    <div className="instructor-controls">
                      <button onClick={() => { setEditingAssign(assn); setShowAssignForm(true); }}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteAssignment(assn.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
          </ul>
        ) : (
          <p className="empty-state">No assignments yet.</p>
        )}
      </section>
    </div>
  );
}
