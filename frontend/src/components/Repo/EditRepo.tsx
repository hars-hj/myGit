import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { api } from "../../lib/api";

export type Repo = {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  content?: string;
  visibility?: "PUBLIC" | "PRIVATE" | string;
};

function EditRepo() {
  const { repoId } = useParams<{ repoId: string }>();
  const navigate = useNavigate();

  const [repo, setRepo] = useState<Repo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!repoId) return;
      setLoading(true);
      try {
        const res = await api.get<Repo[]>(`/api/repos/id/${repoId}`);
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          const r = data[0];
          setRepo(r);
          setName(r.name);
          setDescription(r.description ?? "");
          setContent(r.content ?? "");
          setVisibility((r.visibility as any) === "PRIVATE" ? "PRIVATE" : "PUBLIC");
        } else {
          setError("Repository not found");
        }
      } catch (err) {
        console.error("fetch repo for edit", err);
        setError("Failed to load repository");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [repoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoId) return;
    setSubmitting(true);
    try {
      const payload: any = {
        name: name.trim(),
        description: description.trim(),
        content: content,
        visibility,
      };
      await api.put(`/api/repos/update/${repoId}`, payload);
      navigate(`/repos/${repoId}`);
    } catch (err: any) {
      console.error("update repo error", err);
      const msg = err?.response?.data?.message || "Failed to update repository";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-4">Loading…</div>;
  if (error) return <div className="p-4 text-danger">{error}</div>;
  if (!repo) return <div className="p-4">No repo data</div>;

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#0d1117", color: "#fff" }}>
      <Navbar />
      <div className="container py-4">
        <h2>Edit repository</h2>
        <form onSubmit={handleSubmit} className="mt-3">
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              style={{
                background: "#0d1117",
                borderColor: "#30363d",
                color: "#fff",
                borderRadius: 12,
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <input
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
              style={{
                background: "#0d1117",
                borderColor: "#30363d",
                color: "#fff",
                borderRadius: 12,
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Content</label>
            <textarea
              className="form-control"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={submitting}
              style={{
                background: "#0d1117",
                borderColor: "#30363d",
                color: "#fff",
                borderRadius: 12,
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Visibility</label>
            <select
              className="form-select"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as any)}
              disabled={submitting}
              style={{
                background: "#0d1117",
                borderColor: "#30363d",
                color: "#fff",
                borderRadius: 12,
              }}
            >
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>
          <button className="btn btn-primary" disabled={submitting}>
            {submitting ? "Saving…" : "Save changes"}
          </button>
          <button
            className="btn btn-link ms-2"
            type="button"
            onClick={() => navigate(`/repos/${repoId}`)}
            disabled={submitting}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditRepo;
