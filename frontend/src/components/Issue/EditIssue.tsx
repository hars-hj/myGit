import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import Navbar from "../Navbar/Navbar";

function EditIssue() {
  const { repoId, issueId } = useParams<{ repoId: string; issueId: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"OPEN" | "CLOSED">("OPEN");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!issueId) return;
      setLoading(true);
      try {
        const res = await api.get(`/api/issues/${issueId}`);
        const iss = res.data.issue[0];
        setTitle(iss.title);
        setDescription(iss.description);
        setStatus(iss.status);
      } catch (err) {
        console.error("load issue", err);
        setError("Failed to load issue");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [issueId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueId) return;
    setSubmitting(true);
    try {
      await api.put(`/api/issues/update/${issueId}`, { title, description, status });
      if (repoId) navigate(`/repos/${repoId}`);
    } catch (err) {
      console.error("update issue", err);
      alert("Failed to update issue");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-4">Loading…</div>;
  if (error) return <div className="p-4 text-danger">{error}</div>;

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#0d1117", color: "#fff" }}>
      <Navbar />
      <div className="container py-4">
        <h2>Edit Issue</h2>
        <form onSubmit={handleSubmit} className="mt-3">
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              style={{ background: "#0d1117", borderColor: "#30363d", color: "#fff", borderRadius: 12 }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
              style={{ background: "#0d1117", borderColor: "#30363d", color: "#fff", borderRadius: 12 }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              disabled={submitting}
              style={{ background: "#0d1117", borderColor: "#30363d", color: "#fff", borderRadius: 12 }}
            >
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <button className="btn btn-primary" disabled={submitting}>
            {submitting ? "Saving…" : "Save changes"}
          </button>
          <button
            className="btn btn-link ms-2"
            type="button"
            onClick={() => repoId && navigate(`/repos/${repoId}`)}
            disabled={submitting}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditIssue;
