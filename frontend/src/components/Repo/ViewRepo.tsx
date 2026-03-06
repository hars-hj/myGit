import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export type Repo = {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  visibility?: "PUBLIC" | "PRIVATE" | string;
  content?: string;
  owner?: { _id?: string; username?: string };
  issues?: any[]; // populated by API
};

function ViewRepo() {
  const { repoId } = useParams<{ repoId: string }>();
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [repo, setRepo] = useState<Repo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // issues are included in the repo payload
  const [issues, setIssues] = useState<any[]>([]);
  const [issuesError, setIssuesError] = useState<string | null>(null);



  useEffect(() => {
    const load = async () => {
      if (!repoId) return;
      setLoading(true);
      try {
        const res = await api.get<Repo[]>(`/api/repos/id/${repoId}`);
        const data = res.data;
      
        if (Array.isArray(data) && data.length > 0) {
          setRepo(data[0]);
        } else {
          setError("Repository not found");
        }
      } catch (err: any) {
        console.error("fetch repo", err);
        setError("Failed to load repository");
      } finally {
        setLoading(false);
      }
    };
    load();

    
  }, [repoId]);

  // sync issues when repo data arrives
  useEffect(() => {
    if (repo && (repo as any).issues) {
      setIssues((repo as any).issues);
    }
  }, [repo]);

  const isOwner = repo && repo.owner && repo.owner._id === userId;

  const handleDelete = async () => {
    if (!repoId) return;
    if (!window.confirm("Are you sure you want to delete this repository?")) return;
    try {
      await api.delete(`/api/repos/delete/${repoId}`);
      navigate("/dashboard");
    } catch (err) {
      console.error("delete failed", err);
      alert("Failed to delete repository");
    }
  };



  if (loading) {
    return <div className="p-4">Loading…</div>;
  }
  if (error) {
    return <div className="p-4 text-danger">{error}</div>;
  }
  if (!repo) {
    return <div className="p-4">No repo data</div>;
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#0d1117", color: "#fff" }}>
      <Navbar />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>{repo.name}</h2>
          {isOwner && (
            <div className="btn-group">
              <button className="btn btn-primary btn-sm" onClick={() => navigate(`/repos/${repoId}/edit`)}>
                Edit
              </button>
              <button className="btn btn-danger btn-sm ms-2" onClick={handleDelete}>
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="card" style={{ backgroundColor: "#161b22", color: "#fff" }}>
          <div className="card-body">
            <>
                <p>{repo.description}</p>
                <p className="small">Visibility: {repo.visibility}</p>
                <p className="small">Owner: {repo.owner?.username}</p>
                {repo.content && (
                  <div className="mt-3">
                    <h5>Content</h5>
                    <pre style={{ whiteSpace: "pre-wrap" }}>{repo.content}</pre>
                  </div>
                )}

                {/* issues list */}
                <div className="mt-4">
                  <h5>Issues</h5>
                  {issuesError ? (
                    <p className="text-danger">{issuesError}</p>
                  ) : issues.length === 0 ? (
                    <p className="text-muted">No issues yet.</p>
                  ) : (
                    <ul className="list-group">
                      {issues.map((iss) => (
                        <li
                          key={iss._id}
                          className="list-group-item d-flex justify-content-between align-items-start"
                          style={{
                            background: '#161b22',
                            color: '#fff',
                            borderColor: '#21262d',
                          }}
                        >
                          <div>
                            <strong style={{color:'#fff'}}>{iss.title}</strong>
                            <p className="mb-0 small" style={{color:'#fff'}}>{iss.description}</p>
                            <p className="mb-0 small" style={{color:'#fff'}}>Status: {iss.status}</p>
                            <p className="mb-0 small" style={{color:'#fff'}}>Opened by: {iss.owner?.username}</p>
                          </div>
                          {userId === iss.owner?._id && (
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-primary"
                                onClick={() => navigate(`/repos/${repoId}/issues/${iss._id}/edit`)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger ms-2"
                                onClick={async () => {
                                  if (!window.confirm('Delete this issue?')) return;
                                  try {
                                    await api.delete(`/api/issues/delete/${iss._id}`);
                                    // refresh
                                    setIssues((prev) => prev.filter((i) => i._id !== iss._id));
                                  } catch (err) {
                                    console.error('delete issue', err);
                                    alert('Failed to delete issue');
                                  }
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewRepo;
