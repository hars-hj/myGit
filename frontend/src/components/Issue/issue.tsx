import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import Navbar from "../Navbar/Navbar";

function CreateIssue() {
  const { repoId } = useParams<{ repoId: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoId) return;
    setSubmitting(true);
    setError(null);
    try {
     await api.post("/api/issues/create", {
        title,
        description,
        status: "OPEN",
        repository: repoId,
      });
   
      navigate("/dashboard");
    } catch (err: any) {
      console.error("create issue failed", err);
      setError(err?.response?.data?.message || "Failed to create issue");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#0d1117", color: "#fff" }}>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <div className="card" style={{ backgroundColor: "#161b22", color: "#fff" }}>
              <div className="card-body">
                <h2 className="h5 mb-4">New Issue</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
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
                    <textarea
                      className="form-control"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      style={{
                        background: "#0d1117",
                        borderColor: "#30363d",
                        color: "#fff",
                        borderRadius: 12,
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Creating…" : "Create Issue"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateIssue;
