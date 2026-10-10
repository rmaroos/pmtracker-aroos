"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  CalendarDays,
  CheckSquare2,
  FolderKanban,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  ChevronRight,
  ShieldCheck,
  FolderPlus
} from "lucide-react";
import { signOut } from "@/lib/actions";

const workspaceLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/planner", label: "Daily Planner", icon: CalendarDays },
  { href: "/history", label: "Task History", icon: CheckSquare2 },
  { href: "/projects", label: "Projects", icon: FolderKanban },
];

const secondaryLinks = [
  { href: "/reports", label: "Reports & Export", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children, email }: { children: React.ReactNode; email: string }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const initials = (email.split("@")[0] || "PM").slice(0, 2).toUpperCase();

  // Close mobile drawer whenever route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="shell">
      {/* Mobile Top Header */}
      <header className="mobile-topbar">
        <Link href="/dashboard" className="mobile-brand-link">
          <span className="brand-mark">
            <Activity size={18} />
          </span>
          <span className="mobile-brand-text">
            <b>Personal PM</b>
            <small>Tracker</small>
          </span>
        </Link>
        <div className="mobile-topbar-actions">
          <Link href="/planner/new" className="mobile-quick-add" aria-label="Add task">
            <Plus size={18} />
          </Link>
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Backdrop */}
      <div
        className={`mobile-backdrop ${mobileMenuOpen ? "open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Slide-Over Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? "open" : ""}`} aria-label="Mobile navigation">
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-brand">
            <span className="brand-mark">
              <Activity size={18} />
            </span>
            <div>
              <b>Personal PM</b>
              <span className="drawer-status-pill">
                <span className="status-dot"></span> Private
              </span>
            </div>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Card */}
        <div className="drawer-user-card">
          <div className="avatar-large">{initials}</div>
          <div className="drawer-user-info">
            <b>{email.split("@")[0]}</b>
            <span className="user-email-text">{email}</span>
            <span className="user-role-badge">Workspace Owner</span>
          </div>
        </div>

        {/* Drawer Navigation List */}
        <div className="drawer-scroll-body">
          <div className="drawer-section">
            <p className="drawer-section-title">WORKSPACE</p>
            <nav className="drawer-nav">
              {workspaceLinks.map((item) => {
                const Icon = item.icon;
                const selected =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={selected ? "nav-link active" : "nav-link"}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    <ChevronRight size={14} className="drawer-chevron" />
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="drawer-section">
            <p className="drawer-section-title">ANALYTICS & SETTINGS</p>
            <nav className="drawer-nav">
              {secondaryLinks.map((item) => {
                const Icon = item.icon;
                const selected =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={selected ? "nav-link active" : "nav-link"}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    <ChevronRight size={14} className="drawer-chevron" />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="drawer-section">
            <p className="drawer-section-title">QUICK ACTIONS</p>
            <div className="drawer-actions">
              <Link
                href="/planner/new"
                className="button primary full drawer-action-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Plus size={16} /> New Task
              </Link>
              <Link
                href="/projects/new"
                className="button secondary full drawer-action-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FolderPlus size={16} /> New Project
              </Link>
            </div>
          </div>
        </div>

        {/* Drawer Footer with Sign Out */}
        <div className="drawer-footer">
          <form action={signOut} className="drawer-signout-form">
            <button className="drawer-signout-btn" type="submit">
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          </form>
          <div className="drawer-security-tag">
            <ShieldCheck size={13} />
            <span>Encrypted · Supabase RLS</span>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <Link href="/dashboard" className="brand">
          <span className="brand-mark">
            <Activity size={18} />
          </span>
          <span>
            <b>Personal PM</b>
            <small>Tracker</small>
          </span>
        </Link>
        <nav className="nav">
          {[...workspaceLinks, ...secondaryLinks].map((item) => {
            const Icon = item.icon;
            const selected =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={selected ? "nav-link active" : "nav-link"}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="profile-chip">
            <span className="avatar">{initials}</span>
            <span className="profile-copy">
              <b>{email.split("@")[0]}</b>
              <small>Personal workspace</small>
            </span>
          </div>
          <form action={signOut}>
            <button className="signout" type="submit">
              <LogOut size={16} /> Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-area">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <Link
          href="/dashboard"
          className={`bottom-nav-item ${pathname === "/dashboard" ? "active" : ""}`}
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/planner"
          className={`bottom-nav-item ${pathname.startsWith("/planner") && pathname !== "/planner/new" ? "active" : ""}`}
        >
          <CalendarDays size={19} />
          <span>Planner</span>
        </Link>
        <Link
          href="/planner/new"
          className="bottom-nav-item bottom-nav-fab"
          aria-label="New Task"
        >
          <div className="fab-inner">
            <Plus size={22} />
          </div>
        </Link>
        <Link
          href="/projects"
          className={`bottom-nav-item ${pathname.startsWith("/projects") ? "active" : ""}`}
        >
          <FolderKanban size={19} />
          <span>Projects</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className={`bottom-nav-item ${mobileMenuOpen ? "active" : ""}`}
        >
          <Menu size={19} />
          <span>Menu</span>
        </button>
      </nav>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="page-header">
      <div className="header-text">
        <p className="eyebrow">WORKSPACE</p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {action ? <div className="header-action">{action}</div> : null}
    </header>
  );
}

export function SetupNotice() {
  return (
    <main className="setup-wrap">
      <section className="setup-card">
        <div className="brand-mark">
          <Activity size={18} />
        </div>
        <p className="eyebrow">ONE-TIME SETUP</p>
        <h1>Connect your private workspace</h1>
        <p>Configure Supabase Auth and the database before signing in. This starter does not save pretend demo data.</p>
        <ol>
          <li>Create a Supabase project.</li>
          <li>Copy <strong>.env.example</strong> to <strong>.env.local</strong> and add your project URL and anon/publishable key.</li>
          <li>Run the SQL migration in <strong>supabase/migrations</strong>, then restart the app.</li>
        </ol>
        <p className="setup-note">The SQL enables Row Level Security on every user-owned table. Never add a service-role key to browser environment variables.</p>
      </section>
    </main>
  );
}


