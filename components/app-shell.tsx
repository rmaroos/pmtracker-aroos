"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BarChart3, CalendarDays, CheckSquare2, FolderKanban, LayoutDashboard, Settings, LogOut } from "lucide-react";
import { signOut } from "@/lib/actions";
const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/planner", label: "Daily Planner", icon: CalendarDays },
  { href: "/history", label: "Task History", icon: CheckSquare2 },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings }
];
export function AppShell({ children, email }: { children: React.ReactNode; email: string }) {
  const pathname = usePathname();
  const initials = email.split("@")[0].slice(0, 2).toUpperCase();
  return <div className="shell"><aside className="sidebar"><Link href="/dashboard" className="brand"><span className="brand-mark"><Activity size={18}/></span><span><b>Personal PM</b><small>Tracker</small></span></Link><nav className="nav">{links.map(item => { const Icon = item.icon; const selected = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/")); return <Link key={item.href} href={item.href} className={selected ? "nav-link active" : "nav-link"}><Icon size={18}/><span>{item.label}</span></Link>; })}</nav><div className="sidebar-bottom"><div className="profile-chip"><span className="avatar">{initials}</span><span className="profile-copy"><b>{email.split("@")[0]}</b><small>Personal workspace</small></span></div><form action={signOut}><button className="signout" type="submit"><LogOut size={16}/> Sign out</button></form></div></aside><main className="main-area"><div className="mobile-brand"><Activity size={18}/> Personal PM Tracker</div>{children}</main></div>;
}
export function PageHeader({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) { return <header className="page-header"><div><p className="eyebrow">WORKSPACE</p><h1>{title}</h1><p className="page-description">{description}</p></div>{action ? <div className="header-action">{action}</div> : null}</header>; }
export function SetupNotice() { return <main className="setup-wrap"><section className="setup-card"><div className="brand-mark"><Activity size={18}/></div><p className="eyebrow">ONE-TIME SETUP</p><h1>Connect your private workspace</h1><p>Configure Supabase Auth and the database before signing in. This starter does not save pretend demo data.</p><ol><li>Create a Supabase project.</li><li>Copy <strong>.env.example</strong> to <strong>.env.local</strong> and add your project URL and anon/publishable key.</li><li>Run the SQL migration in <strong>supabase/migrations</strong>, then restart the app.</li></ol><p className="setup-note">The SQL enables Row Level Security on every user-owned table. Never add a service-role key to browser environment variables.</p></section></main>; }
