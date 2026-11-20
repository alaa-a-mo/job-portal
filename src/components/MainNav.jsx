import { useState, useRef, useEffect } from "react";
import { NavLink, useRevalidator, useRouteLoaderData } from "react-router-dom";
import { logout } from "../api/authUtils";
import { useTheme } from "../hooks/useTheme";

export default function MainNav() {
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const token = useRouteLoaderData("root");
  const { revalidate } = useRevalidator();
  const isAuthenticated =
    typeof token === "string" && token !== "" && token !== "EXPIRED";

  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getLinkClass = ({ isActive }) =>
    `px-4 py-2 text-sm font-medium rounded-full transition-all ${
      isActive
        ? "bg-teal-100/80 dark:bg-teal-950/90 text-teal-900 dark:text-teal-200 font-semibold"
        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
    }`;

  const getDropdownLinkClass = ({ isActive }) =>
    `block px-4 py-2.5 text-sm transition-all ${
      isActive
        ? "bg-teal-50 dark:bg-teal-950/80 text-teal-900 dark:text-teal-200 font-semibold"
        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
    }`;

  function handleLogout() {
    logout();
    setIsOpen(false);
    setIsProfileOpen(false);
    revalidate();
  }

  function closeAllMenus() {
    setIsOpen(false);
    setIsProfileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md border-b border-zinc-200/70 dark:border-zinc-800">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <NavLink
          to="/"
          className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
        >
          <span className="text-teal-600 dark:text-teal-400 font-bold">●</span>{" "}
          JobPortal
        </NavLink>

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="md:hidden p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-lg cursor-pointer"
          aria-label="Toggle menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>

        <div
          className={`${
            isOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row absolute md:static top-16 left-0 right-0 bg-white dark:bg-zinc-900 md:bg-transparent md:dark:bg-transparent border-b md:border-none border-zinc-200 dark:border-zinc-800 p-4 md:p-0 space-y-2 md:space-y-0 md:space-x-2 items-stretch md:items-center shadow-lg md:shadow-none`}
        >
          <NavLink to="/" className={getLinkClass} onClick={closeAllMenus} end>
            Browse Jobs
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="jobs/new"
              className={getLinkClass}
              onClick={closeAllMenus}
            >
              Post a Job
            </NavLink>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="px-3.5 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium transition-all cursor-pointer"
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>

          {isAuthenticated ? (
            <div className="relative pt-2 md:pt-0" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-full md:w-auto flex items-center justify-between md:justify-start gap-2 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all text-sm font-medium text-zinc-700 dark:text-zinc-200 cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-200 flex items-center justify-center font-bold text-xs">
                  {userEmail?.charAt(0).toUpperCase()}
                </div>
                <span>Account</span>
                <svg
                  className={`w-4 h-4 text-zinc-400 dark:text-zinc-500 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="md:absolute md:right-0 md:mt-2 w-full md:w-56 bg-white dark:bg-zinc-900 md:rounded-2xl md:border md:border-zinc-200/80 dark:md:border-zinc-800 md:shadow-xl py-2 z-50 space-y-1 md:space-y-0">
                  <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                    <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                      Signed in as
                    </p>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate mt-0.5">
                      {userEmail}
                    </p>
                  </div>
                  <NavLink
                    to="jobs/my-jobs"
                    className={getDropdownLinkClass}
                    onClick={closeAllMenus}
                  >
                    My Posted Jobs
                  </NavLink>
                  <NavLink
                    to="jobs/saved-jobs"
                    className={getDropdownLinkClass}
                    onClick={closeAllMenus}
                  >
                    Saved Jobs
                  </NavLink>
                  <NavLink
                    to="my-applications"
                    className={getDropdownLinkClass}
                    onClick={closeAllMenus}
                  >
                    My Applications
                  </NavLink>
                  <NavLink
                    to="employer-applications"
                    className={getDropdownLinkClass}
                    onClick={closeAllMenus}
                  >
                    Employer Applications
                  </NavLink>

                  <div className="border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/auth?mode=login"
              className={({ isActive }) =>
                `px-5 py-2 rounded-full text-sm font-medium transition-all text-center ${
                  isActive
                    ? "bg-teal-800 text-white font-semibold ring-2 ring-teal-600 ring-offset-2 dark:ring-offset-zinc-950"
                    : "bg-teal-600 text-white hover:bg-teal-700 shadow-xs"
                }`
              }
              onClick={closeAllMenus}
            >
              Login
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}
