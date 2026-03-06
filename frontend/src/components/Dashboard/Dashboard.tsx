import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api.js";
import Navbar from "../Navbar/Navbar.tsx"; 
//import { useAuth } from "../../context/AuthContext"; 

type Repo = {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  visibility?: "public" | "private" | string;
  language?: string;
  updatedAt?: string;
  stars?: number;
  forks?: number;
  owner?: { _id?: string; username?: string; name?: string };
};

function Dashboard() {
  const [repositories, setRepositories] = useState<Repo[]>([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState<Repo[]>([]);
  //const { userId } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const meRes = await api.get("/api/me");
        const userId = meRes.data._id ?? meRes.data.id;

        const [repoRes, suggestedRes] = await Promise.all([
          api.get(`/api/repos/userId/${userId}`),
          api.get("/api/repos/all"),
        ]);

        setRepositories(repoRes.data ?? []);
        setSuggestedRepositories(suggestedRes.data ?? []);
      } catch (error) {
        console.error("Dashboard load error:", error);
      }
    };

    loadData();
  }, []);

  const filteredAllRepos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return suggestedRepositories;

    return suggestedRepositories.filter((r) => {
      const hay = [
        r.name,
        r.description ?? "",
        r.owner?.username ?? "",
        r.owner?.name ?? "",
        r.language ?? "",
        r.visibility ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [suggestedRepositories, searchQuery]);

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.shell}>
        {/* LEFT: User repos */}
        <aside style={styles.left}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>Your repositories</div>
              <div style={styles.muted}>{repositories.length}</div>
            </div>

            <div style={styles.list}>
              {repositories.length === 0 ? (
                <div style={styles.empty}>No repositories yet.</div>
              ) : (
                repositories.map((repo) => (
                  <RepoRow
                    key={repo._id ?? repo.id ?? repo.name}
                    repo={repo}
                    compact
                  />
                ))
              )}
            </div>
          </div>
        </aside>

        {/* MIDDLE: All repos + search */}
        <main style={styles.middle}>
          <div style={styles.card}>
            <div style={styles.midTop}>
              <div>
                <div style={styles.cardTitle}>All repositories</div>
                <div style={styles.muted}>
                  Showing {filteredAllRepos.length} of {suggestedRepositories.length}
                </div>
              </div>

              <div style={styles.searchWrap}>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search repositories..."
                  style={styles.searchInput}
                />
              </div>
            </div>

            <div style={styles.divider} />

            <div style={styles.list}>
              {filteredAllRepos.length === 0 ? (
                <div style={styles.empty}>No matching repositories.</div>
              ) : (
                filteredAllRepos.map((repo) => (
                  <RepoRow
                    key={repo._id ?? repo.id ?? repo.name}
                    repo={repo}
                  />
                ))
              )}
            </div>
          </div>
        </main>

        {/* RIGHT: Upcoming events */}
        <aside style={styles.right}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>Upcoming</div>
              <span style={styles.badge}>Static</span>
            </div>

            <div style={{ padding: 12, display: "grid", gap: 10 }}>
              <EventItem
                title="Team sync"
                time="Wed • 10:00 AM"
                meta="Google Meet"
              />
              <EventItem
                title="Release checklist"
                time="Fri • 6:00 PM"
                meta="Repo: backend-api"
              />
              <EventItem
                title="Hack session"
                time="Sat • 2:00 PM"
                meta="Topics: issues + PRs"
              />

              <div style={styles.divider} />

             
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>Tips</div>
            </div>
            <div style={{ padding: 12, display: "grid", gap: 8 }}>
              <div style={styles.tip}>
                • Use search to quickly find repos by name/description.
              </div>
              <div style={styles.tip}>
                • Add language, stars, updated time once your API sends them.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function RepoRow({ repo, compact }: { repo: Repo; compact?: boolean }) {
  const visibility = repo.visibility ?? "public";
  const navigate = useNavigate();
 // const { userId } = useAuth();

  const handleNewIssue = () => {
    const id = repo._id ?? repo.id;
    if (id) navigate(`/repos/${id}/issues/new`);
  };

  //const isOwner = repo.owner && (repo.owner as any)._id === userId;

  return (
    <div style={styles.repoRow}>
      <div style={{ display: "grid", gap: compact ? 4 : 6 }}>
        <div style={{ ...styles.repoTopLine, justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: 'pointer' }} onClick={() => {
            const id = repo._id ?? repo.id;
            if (id) navigate(`/repos/${id}`);
          }}>
            <span style={styles.repoName}>{repo.name}</span>
            <span style={styles.pill}>{visibility}</span>
          </div>
          <button style={styles.issueBtn} onClick={handleNewIssue}>Issue</button>
        </div>

        {!compact && repo.description ? (
          <div style={styles.repoDesc}>{repo.description}</div>
        ) : null}

        <div style={styles.repoMeta}>
          {repo.language ? <MetaDot label={repo.language} /> : null}
          {repo.updatedAt ? <MetaDot label={`Updated ${formatDate(repo.updatedAt)}`} /> : null}
          {typeof repo.stars === "number" ? <MetaDot label={`${repo.stars} ★`} /> : null}
          {typeof repo.forks === "number" ? <MetaDot label={`${repo.forks} forks`} /> : null}
        </div>
      </div>
    </div>
  );
}

function MetaDot({ label }: { label: string }) {
  return (
    <span style={styles.metaDot}>
      <span style={styles.dot} />
      <span>{label}</span>
    </span>
  );
}

function EventItem({ title, time, meta }: { title: string; time: string; meta: string }) {
  return (
    <div style={styles.eventItem}>
      <div style={{ display: "grid", gap: 2 }}>
        <div style={styles.eventTitle}>{title}</div>
        <div style={styles.mutedSmall}>{time}</div>
        <div style={styles.mutedSmall}>{meta}</div>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0d1117",
    color: "#c9d1d9",
  },
  shell: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "16px 16px 32px",
    display: "grid",
    gridTemplateColumns: "280px minmax(520px, 1fr) 320px",
    gap: 16,
    alignItems: "start",
  },

  left: { position: "sticky", top: 12, height: "fit-content" },
  middle: { minWidth: 0 },
  right: { position: "sticky", top: 12, height: "fit-content", display: "grid", gap: 20 },

  card: {
    background: "#161b22",
    border: "1px solid #30363d",
    borderRadius: 12,
    overflow: "hidden",
  },
  cardHeader: {
    padding: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #30363d",
  },
  cardTitle: { fontWeight: 700, color: "#c9d1d9" },
  muted: { color: "#8b949e", fontSize: 12 },

  midTop: {
    padding: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  searchWrap: { flex: 1, display: "flex", justifyContent: "flex-end" },
  searchInput: {
    width: "min(520px, 100%)",
    background: "#0d1117",
    border: "1px solid #30363d",
    borderRadius: 10,
    padding: "10px 12px",
    outline: "none",
    color: "#c9d1d9",
  },

  divider: { height: 1, background: "#30363d" },
  list: { display: "grid" },

  repoRow: {
    padding: 12,
    borderBottom: "1px solid #30363d",
  },
  issueBtn: {
    background: "#238636",
    color: "#ffffff",
    border: "none",
    borderRadius: 4,
    padding: "4px 8px",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
  },
  repoTopLine: { display: "flex", gap: 8, alignItems: "center" },
  repoName: { fontWeight: 700, color: "#58a6ff" },
  pill: {
    fontSize: 11,
    color: "#8b949e",
    border: "1px solid #30363d",
    padding: "2px 8px",
    borderRadius: 999,
  },
  repoDesc: { color: "#8b949e", fontSize: 13, lineHeight: 1.35 },
  repoMeta: { display: "flex", flexWrap: "wrap", gap: 10, color: "#8b949e", fontSize: 12 },

  metaDot: { display: "inline-flex", alignItems: "center", gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 999, background: "#8b949e" },

  empty: { padding: 12, color: "#8b949e", fontSize: 13 },

  badge: {
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 999,
    border: "1px solid #30363d",
    color: "#8b949e",
  },

  eventItem: {
    padding: 10,
    border: "1px solid #30363d",
    borderRadius: 10,
    background: "#0d1117",
  },
  eventTitle: { fontWeight: 650, color: "#c9d1d9" },
  mutedSmall: { color: "#8b949e", fontSize: 12 },
  tip: { color: "#8b949e", fontSize: 12, lineHeight: 1.45 },
};

export { Dashboard };