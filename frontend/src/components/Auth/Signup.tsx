// src/pages/auth/Signup.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { api } from "../../lib/api"; 
import logo from "../../assets/github-mark-white.svg";


function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { refresh } = useAuth();

  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

   
      await api.post("/api/signup", { email, username, password });

      // fetch /api/me -> sets user in context
      await refresh();

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Signup Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
      <div className="container" style={{ maxWidth: 420 }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" style={{ width: 56, height: 56 }} />
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <h1 className="h4 mb-3 text-center">Sign Up</h1>

            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                className="form-control"
                type="text"
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                className="form-control"
                type="email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                className="form-control"
                type="password"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn btn-primary w-100"
              disabled={loading}
              onClick={handleSignup}
            >
              {loading ? "Loading..." : "Signup"}
            </button>

            <p className="text-center mt-3 mb-0">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export{Signup};