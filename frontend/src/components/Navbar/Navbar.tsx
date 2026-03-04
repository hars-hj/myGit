import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // adjust path

function Navbar() {
  const navigate = useNavigate();
  const { user, loading, isAuthed } = useAuth();

  return (
    <header style={styles.header}>
        
      <div style={styles.inner}>
        <div style={styles.left}>
          <Link to="/dashboard" style={styles.brand}>
            <img
              src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
              alt="GitHub"
              style={styles.logo}
            />
            <span style={styles.brandText}>MyGit</span>
          </Link>
        </div>

        <div style={styles.right}>
          <button style={styles.newRepoBtn} onClick={() => navigate("/repos/new")}>
            + New repo
          </button>

          <button
            style={styles.profileBtn}
            onClick={() => navigate("/profile")}
            title="Profile"
            disabled={loading || !isAuthed}
          >
            <img
              src={getAvatar(user)}
              alt="profile"
              style={{
                ...styles.profileImg,
                opacity: loading || !isAuthed ? 0.6 : 1,
              }}
            />
          </button>
        </div>
      </div>
    </header>
  );
}

function getAvatar(user: any) {
  
  return (
    user?.avatarUrl ??
    "https://avatars.githubusercontent.com/u/9919?s=80&v=4"
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "#161b22",
    borderBottom: "1px solid #30363d",
  },
  inner: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  left: { display: "flex", alignItems: "center", gap: 12 },
  brand: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
  },
  logo: {
    width: 26,
    height: 26,
    borderRadius: 6,
    background: "#0d1117",
  },
  brandText: { color: "#c9d1d9", fontWeight: 800, fontSize: 16 },

  right: { display: "flex", alignItems: "center", gap: 10 },

  newRepoBtn: {
    background: "#238636",
    color: "#ffffff",
    border: "1px solid rgba(240,246,252,0.1)",
    borderRadius: 10,
    padding: "9px 12px",
    cursor: "pointer",
    fontWeight: 700,
  },

  profileBtn: {
    background: "transparent",
    border: "1px solid #30363d",
    borderRadius: 999,
    width: 40,
    height: 40,
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  profileImg: { width: 28, height: 28, borderRadius: 999 },
};

export default Navbar;