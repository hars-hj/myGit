import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // adjust path



interface User {
  _id: string;
  username: string;
  avatarUrl: string | null;
}

interface ProfileDropdownProps {
  user?: User;
  onProfile?: () => void;
  onLogout?: () => void;
}

const ProfileDropdown = ({
 
  onProfile = () => {},
  onLogout = () => {},
}: ProfileDropdownProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {user} = useAuth();
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const initials: string|undefined = user?.username
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <style>{`
        .gh-dropdown-wrapper {
          position: relative;
          display: inline-block;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
        }

        .gh-avatar-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gh-avatar-btn:focus {
          outline: 2px solid #58a6ff;
          outline-offset: 2px;
          border-radius: 50%;
        }

        .gh-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #21262d;
          border: 1px solid #30363d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          color: #e6edf3;
          overflow: hidden;
          transition: box-shadow 0.15s;
        }

        .gh-avatar-btn[aria-expanded="true"] .gh-avatar,
        .gh-avatar-btn:hover .gh-avatar {
          box-shadow: 0 0 0 2px #58a6ff55;
        }

        .gh-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gh-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 200px;
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(1, 4, 9, 0.65);
          z-index: 1000;
          overflow: hidden;
          animation: ghDropIn 0.15s cubic-bezier(0.2, 0, 0, 1.0);
          transform-origin: top right;
        }

        @keyframes ghDropIn {
          from { opacity: 0; transform: scale(0.95) translateY(-4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .gh-dropdown-header {
          padding: 12px 16px;
          border-bottom: 1px solid #21262d;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .gh-dropdown-header-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #21262d;
          border: 1px solid #30363d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          color: #e6edf3;
          overflow: hidden;
          flex-shrink: 0;
        }

        .gh-dropdown-header-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gh-dropdown-name {
          font-size: 13px;
          font-weight: 600;
          color: #e6edf3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .gh-dropdown-username {
          font-size: 12px;
          color: #8b949e;
        }

        .gh-dropdown-menu {
          padding: 6px;
          list-style: none;
          margin: 0;
        }

        .gh-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 7px 10px;
          border: none;
          border-radius: 6px;
          background: none;
          color: #e6edf3;
          font-size: 13px;
          font-family: inherit;
          cursor: pointer;
          text-align: left;
          transition: background 0.1s;
        }

        .gh-dropdown-item:hover {
          background: #21262d;
        }

        .gh-dropdown-item.logout {
          color: #f85149;
        }

        .gh-dropdown-item.logout:hover {
          background: rgba(248, 81, 73, 0.1);
          color: #ff7b72;
        }

        .gh-dropdown-divider {
          height: 1px;
          background: #21262d;
          margin: 4px 6px;
        }
      `}</style>

      <div className="gh-dropdown-wrapper" ref={dropdownRef}>
        <button
          className="gh-avatar-btn"
          aria-label="Open user menu"
          aria-expanded={open}
          aria-haspopup="true"
          onClick={() => setOpen((v: boolean) => !v)}
        >
          <div className="gh-avatar">
            { initials}
          </div>
        </button>

        {open && (
          <div className="gh-dropdown" role="menu">
            <div className="gh-dropdown-header">
              <div className="gh-dropdown-header-avatar">
                { initials}
              </div>
              <div>
                <div className="gh-dropdown-name">{user?.username}</div>
                <div className="gh-dropdown-username">@{user?.username}</div>
              </div>
            </div>

            <ul className="gh-dropdown-menu" role="none">
              <li>
                <button
                  role="menuitem"
                  className="gh-dropdown-item"
                  onClick={() => { setOpen(false); onProfile(); }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" />
                  </svg>
                  Your profile
                </button>
              </li>

              <li><div className="gh-dropdown-divider" /></li>

              <li>
                <button
                  role="menuitem"
                  className="gh-dropdown-item logout"
                  onClick={() => { setOpen(false); onLogout(); }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2 2.75C2 1.784 2.784 1 3.75 1h4.5a.75.75 0 0 1 0 1.5h-4.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h4.5a.75.75 0 0 1 0 1.5h-4.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.97-1.97H6.75a.75.75 0 0 1 0-1.5Z" />
                  </svg>
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileDropdown;
