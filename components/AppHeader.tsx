"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/lib/theme-context";
import ProfileModal from "@/components/ProfileModal";
import SettingsModal from "@/components/SettingsModal";

type AppHeaderProps = {
  userName: string;
  userEmail: string;
  onLogout: () => void;
  onMobileMenuToggle: () => void;
  onNameChange: (name: string) => void;
};

export default function AppHeader({ userName, userEmail, onLogout, onMobileMenuToggle, onNameChange }: AppHeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { isDark, toggle } = useTheme();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    };
    if (profileOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileOpen]);

  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <header
        className="relative z-30 flex h-12 shrink-0 items-center justify-between px-4 transition-colors"
        style={{ background: "var(--s3)", borderBottom: "1px solid var(--bd)" }}
      >
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-[var(--s4)] md:hidden"
            style={{ color: "var(--t2)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg shadow-md" style={{ background: "var(--btn-bg)" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--btn-fg)" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <span className="text-[14px] font-bold tracking-tight" style={{ color: "var(--t1)" }}>SyncNotes</span>
          </div>
        </div>

        {/* Right: theme toggle + profile */}
        <div className="flex items-center gap-2">

          {/* Theme toggle */}
          <button
            onClick={toggle}
            title={isDark ? "Light Mode" : "Dark Mode"}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:bg-[var(--s4)]"
            style={{ color: "var(--t2)" }}
          >
            {isDark ? (
              <svg key="sun" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg key="moon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition-all ${
                profileOpen ? "ring-1 ring-violet-500/30" : ""
              }`}
              style={{ background: profileOpen ? "var(--s4)" : undefined }}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-bold shadow-md ring-1 ring-[var(--bd)]"
                style={{ background: "var(--btn-bg)", color: "var(--btn-fg)" }}>
                {initials}
              </div>
              <span className="hidden text-[13px] font-medium sm:block" style={{ color: "var(--t2)" }}>{userName}</span>
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className={`hidden transition-transform sm:block ${profileOpen ? "rotate-180" : ""}`}
                style={{ color: "var(--t3)" }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {profileOpen && (
              <div className="glass animate-scale-in absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl shadow-2xl">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

                {/* User info */}
                <div className="px-4 py-3.5" style={{ borderBottom: "1px solid var(--bd)" }}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl text-[13px] font-bold shadow-md"
                      style={{ background: "var(--btn-bg)", color: "var(--btn-fg)" }}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold" style={{ color: "var(--t1)" }}>{userName}</p>
                      <p className="text-[11px]" style={{ color: "var(--t3)" }}>Persönlicher Account</p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="px-2 py-2">
                  <button
                    onClick={() => { setProfileOpen(false); setIsProfileModalOpen(true); }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition hover:bg-[var(--s4)]"
                    style={{ color: "var(--t2)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                    Profil
                  </button>

                  <button
                    onClick={() => { setProfileOpen(false); setIsSettingsModalOpen(true); }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition hover:bg-[var(--s4)]"
                    style={{ color: "var(--t2)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    Einstellungen
                  </button>
                </div>

                {/* Logout */}
                <div className="px-2 py-2" style={{ borderTop: "1px solid var(--bd)" }}>
                  <button
                    onClick={() => { setProfileOpen(false); onLogout(); }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition hover:bg-red-500/10 hover:text-red-400"
                    style={{ color: "var(--t2)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Abmelden
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <ProfileModal
        isOpen={isProfileModalOpen}
        name={userName}
        email={userEmail}
        onSave={onNameChange}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </>
  );
}
