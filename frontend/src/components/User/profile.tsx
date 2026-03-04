import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import Navbar from "../Navbar/Navbar"; // show navigation bar

export type Repo = {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  visibility?: "public" | "private" | string;
  language?: string;
  updatedAt?: string;
  stars?: number;
  owner?: { username?: string; name?: string };
};

function Profile() {
  const { user, userId, loading } = useAuth();
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    const loadRepos = async () => {
      if (!userId) return;
      try {
        const res = await api.get<Repo[]>(`/api/repos/userId/${userId}`);
        setRepos(res.data || []);
      } catch (err) {
        console.error("Failed to fetch repos", err);
      }
    };

    loadRepos();
  }, [userId]);

  if (loading) {
    return <div className="p-4">Loading profile...</div>;
  }

  if (!user) {
    return <div className="p-4">You must be logged in to view this page.</div>;
  }

  return (
    <div className="min-vh-100" style={{backgroundColor: '#0d1117', color: '#fff'}}>
      <Navbar />
      <div className="container py-4">
        <div className="row">
          {/* user info column */}
          <div className="col-12 col-md-4 mb-4">
            <div className="card text-center" style={{backgroundColor: '#161b22', color: '#c9d1d9'}}>
              <div className="card-body">
                <img
                  src={user.avatarUrl || "/default-avatar.png"}
                  alt="User avatar"
                  className="rounded-circle mb-3"
                  style={{ width: 96, height: 96, objectFit: "cover" }}
                />
                <h2 className="h5 font-weight-bold">{user.username}</h2>
                <p  className=" mb-1">{user.email}</p>
                <p className=" mb-0">
                  Following: {user.following?.length ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* repositories column */}
          <div className="col-12 col-md-8">
            <div className="card" style={{backgroundColor: '#161b22', color: '#fff'}}>
              <div className="card-body">
                <h3 className="h6 font-weight-bold mb-4">Repositories</h3>

                {repos.length === 0 ? (
                  <p style={{color: '#fff'}}>No repositories yet.</p>
                ) : (
                  <ul className="list-group" style={{backgroundColor: '#161b22', color: '#fff'}}>
                    {repos.map((repo) => (
                      <li
                        key={repo._id ?? repo.id ?? repo.name}
                        className="list-group-item d-flex flex-column"
                        style={{backgroundColor: '#161b22', color: '#fff', borderColor: '#21262d'}}>
                        <a
                          href={`/repo/${repo._id ?? repo.id}`}
                          style={{color: '#58a6ff', fontWeight: 500}}
                        >
                          {repo.name}
                        </a>
                        {repo.description && (
                          <small style={{color: '#8b949e'}}>
                            {repo.description}
                          </small>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
