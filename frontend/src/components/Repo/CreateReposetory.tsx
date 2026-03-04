import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

type Visibility = "PUBLIC" | "PRIVATE";

type CreateRepoPayload = {
  name: string;
  description?: string;
  content?: string;
  visibility: Visibility;
  owner: string; // userId (sent automatically, not shown)
};

function CreateRepository() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("PUBLIC");
  const [submitting, setSubmitting] = useState(false);

  const disabled = useMemo(() => {
    if (authLoading) return true;
    if (!user?._id) return true;
    if (!name.trim()) return true;
    return submitting;
  }, [authLoading, user?._id, name, submitting]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    const payload: CreateRepoPayload = {
      name: name.trim(),
      description: description.trim() || undefined,
      content: content.trim() || undefined,
      visibility,
      owner: user!._id,
    };

    try {
      setSubmitting(true);
      await api.post("/api/repos/create", payload);
      navigate("/dashboard");
    } catch (err) {
      console.error("Create repo error:", err);
      alert("Failed to create repository");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#c9d1d9" }}>
      <Navbar />

      <div className="container py-4" style={{ maxWidth: 900 }}>
        <div
          className="card border-0 shadow-sm"
          style={{ borderRadius: 16, background: "#161b22", color: "#c9d1d9" }}
        >
          <div
            className="card-body"
            style={{ borderRadius: 16 }}
          >
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
              <div>
                <h4 className="mb-1" style={{ color: "#c9d1d9" }}>
                  Create repository
                </h4>
                <div className="small" style={{ color: "#8b949e" }}>
                  Owner: <span style={{ color: "#c9d1d9" }}>{user?.username ?? "—"}</span>
                </div>
              </div>
            </div>

            <hr style={{ borderColor: "#30363d" }} />

            <form onSubmit={onSubmit} className="mt-3">
              {/* Repo name */}
              <div className="mb-3">
                <label className="form-label" style={{ color: "#c9d1d9" }}>
                  Repository name <span style={{ color: "#8b949e" }}>*</span>
                </label>
                <input
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="my-awesome-repo"
                  style={{
                    borderRadius: 12,
                    background: "#0d1117",
                    borderColor: "#30363d",
                    color: "#c9d1d9",
                  }}
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label" style={{ color: "#c9d1d9" }}>
                  Description
                </label>
                <input
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of your repository"
                  style={{
                    borderRadius: 12,
                    background: "#0d1117",
                    borderColor: "#30363d",
                    color: "#c9d1d9",
                  }}
                />
              </div>

              {/* Content */}
              <div className="mb-3">
                <label className="form-label" style={{ color: "#c9d1d9" }}>
                  Content
                </label>
                <textarea
                  className="form-control"
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Initial README / notes / code snippet..."
                  style={{
                    borderRadius: 12,
                    background: "#0d1117",
                    borderColor: "#30363d",
                    color: "#c9d1d9",
                    resize: "vertical",
                  }}
                />
              </div>

             {/* Visibility */}
                <div className="mb-4">
                <label className="form-label d-block" style={{ color: "#c9d1d9" }}>
                    Visibility <span style={{ color: "#8b949e" }}>*</span>
                </label>

                <div
                    className="d-flex align-items-center gap-4 flex-wrap"
                    style={{
                    padding: "10px 12px",
                    borderRadius: 14,
                    border: "1px solid #30363d",
                    background: "#0d1117",
                    }}
                >
                    <div className="form-check m-0 d-flex align-items-center gap-2">
                    <input
                        className="form-check-input m-0"
                        type="radio"
                        name="visibility"
                        id="visPublic"
                        checked={visibility === "PUBLIC"}
                        onChange={() => setVisibility("PUBLIC")}
                        style={{
                        width: 16,
                        height: 16,
                        backgroundColor: "#0d1117",
                        borderColor: "#30363d",
                        }}
                    />
                    <label className="form-check-label m-0" htmlFor="visPublic" style={{ color: "#c9d1d9" }}>
                        Public
                    </label>
                    </div>

                    <div className="form-check m-0 d-flex align-items-center gap-2">
                    <input
                        className="form-check-input m-0"
                        type="radio"
                        name="visibility"
                        id="visPrivate"
                        checked={visibility === "PRIVATE"}
                        onChange={() => setVisibility("PRIVATE")}
                        style={{
                        width: 16,
                        height: 16,
                        backgroundColor: "#0d1117",
                        borderColor: "#30363d",
                        }}
                    />
                    <label className="form-check-label m-0" htmlFor="visPrivate" style={{ color: "#c9d1d9" }}>
                        Private
                    </label>
                    </div>
                </div>
                </div>

              {/* Actions */}
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate(-1)}
                  style={{ borderRadius: 12, borderColor: "#30363d", color: "#c9d1d9" }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn"
                  disabled={disabled}
                  style={{
                    borderRadius: 12,
                    background: "#238636",
                    color: "white",
                  }}
                >
                  {submitting ? "Creating..." : "Create repository"}
                </button>
              </div>
            </form>
          </div>
        </div>

       
      </div>
    </div>
  );
}

export default CreateRepository;