
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { api } from "../../lib/api";
import logo from "../../assets/github-mark-white.svg";

  function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { refresh } = useAuth(); // cookie auth: refresh calls /api/me and sets user

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      setLoading(true);


      await api.post("/api/login", { email, password });
      await refresh();

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Login Failed!");
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
            <h1 className="h4 mb-3 text-center">Sign In</h1>

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
              onClick={handleLogin}
            >
              {loading ? "Loading..." : "Login"}
            </button>

            <p className="text-center mt-3 mb-0">
              New to MyGit? <Link to="/signup">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


export {Login}