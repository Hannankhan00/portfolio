"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FolderKanban,
  Briefcase,
  Mail,
  Plus,
  ExternalLink,
  Database,
  Globe,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { DbProject, DbExperience, DbContactMessage } from "@/lib/db";
import ProjectsTab from "./components/ProjectsTab";
import ExperiencesTab from "./components/ExperiencesTab";
import MessagesTab from "./components/MessagesTab";
import ProjectEditorModal from "./components/ProjectEditorModal";
import ProjectPreviewModal from "./components/ProjectPreviewModal";
import ExperienceEditorModal from "./components/ExperienceEditorModal";
import MessageDetailModal from "./components/MessageDetailModal";

export default function AdminDashboardPage() {
  const router = useRouter();

  // Authentication state
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string | null } | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Tab: "projects" | "experiences" | "messages"
  const [activeTab, setActiveTab] = useState<"projects" | "experiences" | "messages">("projects");

  // Data states
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const [experiences, setExperiences] = useState<DbExperience[]>([]);
  const [experiencesLoading, setExperiencesLoading] = useState(true);

  const [messages, setMessages] = useState<DbContactMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  // Modals for Projects
  const [isProjectEditorOpen, setIsProjectEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<DbProject | null>(null);
  const [previewProject, setPreviewProject] = useState<DbProject | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<number | null>(null);
  const [deletingProject, setDeletingProject] = useState(false);

  // Modals for Experiences
  const [isExperienceEditorOpen, setIsExperienceEditorOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<DbExperience | null>(null);
  const [deleteExperienceId, setDeleteExperienceId] = useState<number | null>(null);
  const [deletingExperience, setDeletingExperience] = useState(false);

  // Modals for Messages
  const [viewingMessage, setViewingMessage] = useState<DbContactMessage | null>(null);
  const [deleteMessageId, setDeleteMessageId] = useState<number | null>(null);
  const [deletingMessage, setDeletingMessage] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth check
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.replace("/admin/login");
          return;
        }
        const data = await res.json();
        if (!data.authenticated) {
          router.replace("/admin/login");
          return;
        }
        setCurrentUser(data.user);
      } catch {
        router.replace("/admin/login");
      } finally {
        setAuthChecking(false);
      }
    }
    checkAuth();
  }, [router]);

  // Fetch functions
  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
      const res = await fetch("/api/projects?all=true");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch {
      showToast("Error fetching projects");
    } finally {
      setProjectsLoading(false);
    }
  };

  const fetchExperiences = async () => {
    setExperiencesLoading(true);
    try {
      const res = await fetch("/api/experiences?all=true");
      if (res.ok) {
        const data = await res.json();
        setExperiences(data.experiences || []);
      }
    } catch {
      showToast("Error fetching experiences");
    } finally {
      setExperiencesLoading(false);
    }
  };

  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      const res = await fetch("/api/contact");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch {
      showToast("Error fetching contact messages");
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    if (!authChecking) {
      fetchProjects();
      fetchExperiences();
      fetchMessages();
    }
  }, [authChecking]);

  // Message Handlers
  const handleToggleMessageRead = async (id: number, currentRead: boolean) => {
    try {
      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_read: !currentRead }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, is_read: !currentRead } : m))
        );
        if (viewingMessage && viewingMessage.id === id) {
          setViewingMessage((prev) => (prev ? { ...prev, is_read: !currentRead } : null));
        }
        showToast(!currentRead ? "Marked as read" : "Marked as unread");
      }
    } catch {
      showToast("Failed to update message status");
    }
  };

  const handleViewMessage = (msg: DbContactMessage) => {
    setViewingMessage(msg);
    if (!msg.is_read) {
      handleToggleMessageRead(msg.id, false);
    }
  };

  const handleConfirmDeleteMessage = async () => {
    if (!deleteMessageId) return;
    setDeletingMessage(true);
    try {
      const res = await fetch(`/api/contact?id=${deleteMessageId}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== deleteMessageId));
        if (viewingMessage && viewingMessage.id === deleteMessageId) {
          setViewingMessage(null);
        }
        setDeleteMessageId(null);
        showToast("Message deleted successfully");
      }
    } catch {
      showToast("Error deleting message");
    } finally {
      setDeletingMessage(false);
    }
  };

  // Project Handlers
  const handleToggleProjectPublish = async (project: DbProject) => {
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !project.is_published }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, is_published: !p.is_published } : p))
        );
        showToast(project.is_published ? "Project set to Draft" : "Project Published");
      }
    } catch {
      showToast("Failed to update project status");
    }
  };

  const handleMoveProjectOrder = async (project: DbProject, direction: "up" | "down") => {
    const currentIndex = projects.findIndex((p) => p.id === project.id);
    if (currentIndex === -1) return;
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const targetProject = projects[targetIndex];
    try {
      await Promise.all([
        fetch(`/api/projects/${project.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_index: targetProject.order_index }),
        }),
        fetch(`/api/projects/${targetProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_index: project.order_index }),
        }),
      ]);
      await fetchProjects();
      showToast("Display order updated");
    } catch {
      showToast("Failed to reorder projects");
    }
  };

  const handleDeleteProject = async () => {
    if (!deleteProjectId) return;
    setDeletingProject(true);
    try {
      const res = await fetch(`/api/projects/${deleteProjectId}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Project deleted successfully");
        setProjects((prev) => prev.filter((p) => p.id !== deleteProjectId));
        setDeleteProjectId(null);
      }
    } catch {
      showToast("Error deleting project");
    } finally {
      setDeletingProject(false);
    }
  };

  // Experience Handlers
  const handleToggleExperiencePublish = async (exp: DbExperience) => {
    try {
      const res = await fetch(`/api/experiences/${exp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !exp.is_published }),
      });
      if (res.ok) {
        setExperiences((prev) =>
          prev.map((e) => (e.id === exp.id ? { ...e, is_published: !e.is_published } : e))
        );
        showToast(exp.is_published ? "Experience set to Draft" : "Experience Published");
      }
    } catch {
      showToast("Failed to update experience status");
    }
  };

  const handleMoveExperienceOrder = async (exp: DbExperience, direction: "up" | "down") => {
    const currentIndex = experiences.findIndex((e) => e.id === exp.id);
    if (currentIndex === -1) return;
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;

    const targetExp = experiences[targetIndex];
    try {
      await Promise.all([
        fetch(`/api/experiences/${exp.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_index: targetExp.order_index }),
        }),
        fetch(`/api/experiences/${targetExp.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_index: exp.order_index }),
        }),
      ]);
      await fetchExperiences();
      showToast("Display order updated");
    } catch {
      showToast("Failed to reorder experiences");
    }
  };

  const handleDeleteExperience = async () => {
    if (!deleteExperienceId) return;
    setDeletingExperience(true);
    try {
      const res = await fetch(`/api/experiences/${deleteExperienceId}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Experience deleted successfully");
        setExperiences((prev) => prev.filter((e) => e.id !== deleteExperienceId));
        setDeleteExperienceId(null);
      }
    } catch {
      showToast("Error deleting experience");
    } finally {
      setDeletingExperience(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.is_published).length;
  const totalExperiences = experiences.length;
  const publishedExperiences = experiences.filter((e) => e.is_published).length;
  const totalMessages = messages.length;
  const unreadMessages = messages.filter((m) => !m.is_read).length;

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08080c]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-purple-500" />
          <p className="text-slate-400 text-sm font-medium tracking-wide">Validating session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#08080c] text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-950/90 border border-purple-500/40 text-purple-200 text-sm shadow-[0_8px_30px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all">
          <CheckCircle2 size={16} className="text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#0b0b12]/80 backdrop-blur-lg px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <FolderKanban size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-white text-base leading-none">
                Portfolio CMS & CRM
              </h1>
              <span className="text-[11px] text-slate-400 font-mono">Neon Postgres Connected</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-white/8 text-xs text-slate-400">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Branch: production</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-purple-500/40 bg-white/[0.03] hover:bg-white/[0.06] text-xs font-medium text-slate-300 hover:text-white transition-all"
          >
            <span>Live Portfolio</span>
            <ExternalLink size={13} className="text-slate-400" />
          </Link>

          <div className="flex items-center gap-2 pl-2 border-l border-white/8">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-white truncate max-w-[140px]">
                {currentUser?.name || currentUser?.email || "Admin"}
              </p>
              <p className="text-[10px] text-purple-400 font-mono">Authorized Admin</p>
            </div>

            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 hover:border-red-500/40 bg-white/[0.03] hover:bg-red-500/10 text-slate-400 hover:text-red-300 transition-all"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-white/8 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === "projects"
                  ? "bg-purple-600/20 text-purple-200 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <FolderKanban size={16} />
              <span>Projects ({totalProjects})</span>
            </button>

            <button
              onClick={() => setActiveTab("experiences")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === "experiences"
                  ? "bg-purple-600/20 text-purple-200 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <Briefcase size={16} />
              <span>Experience ({totalExperiences})</span>
            </button>

            <button
              onClick={() => setActiveTab("messages")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all relative ${
                activeTab === "messages"
                  ? "bg-purple-600/20 text-purple-200 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <Mail size={16} />
              <span>Messages ({totalMessages})</span>
              {unreadMessages > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500 text-white shadow-[0_0_8px_rgba(168,85,247,0.8)]">
                  {unreadMessages}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchProjects();
                fetchExperiences();
                fetchMessages();
              }}
              title="Refresh database records"
              className="p-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-white transition-all"
            >
              <RefreshCw
                size={16}
                className={projectsLoading || experiencesLoading || messagesLoading ? "animate-spin" : ""}
              />
            </button>

            {activeTab === "projects" ? (
              <button
                onClick={() => {
                  setEditingProject(null);
                  setIsProjectEditorOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-medium shadow-[0_0_20px_rgba(168,85,247,0.3)] border border-purple-400/30 transition-all active:scale-[0.99]"
              >
                <Plus size={16} />
                <span>Add New Project</span>
              </button>
            ) : activeTab === "experiences" ? (
              <button
                onClick={() => {
                  setEditingExperience(null);
                  setIsExperienceEditorOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-medium shadow-[0_0_20px_rgba(168,85,247,0.3)] border border-purple-400/30 transition-all active:scale-[0.99]"
              >
                <Plus size={16} />
                <span>Add Career Experience</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/8 bg-white/[0.03] text-xs text-slate-400">
                <Mail size={14} className="text-purple-400" />
                <span>{unreadMessages} unread inquiry{unreadMessages === 1 ? "" : "s"}</span>
              </div>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl border border-white/8 bg-[#0f0f17]/60 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Projects</span>
              <FolderKanban size={16} className="text-purple-400" />
            </div>
            <p className="text-3xl font-display font-bold text-white tabular-nums">{totalProjects}</p>
            <p className="text-[11px] text-slate-500 mt-1">{publishedProjects} published</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-white/8 bg-[#0f0f17]/60 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Career Experience</span>
              <Briefcase size={16} className="text-purple-400" />
            </div>
            <p className="text-3xl font-display font-bold text-white tabular-nums">{totalExperiences}</p>
            <p className="text-[11px] text-slate-500 mt-1">{publishedExperiences} published</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-white/8 bg-[#0f0f17]/60 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Inquiries / Messages</span>
              <Mail size={16} className="text-purple-400" />
            </div>
            <p className="text-3xl font-display font-bold text-white tabular-nums">{totalMessages}</p>
            <p className={`text-[11px] mt-1 ${unreadMessages > 0 ? "text-purple-400 font-semibold" : "text-slate-500"}`}>
              {unreadMessages > 0 ? `${unreadMessages} unread inquiry` : "All read"}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-white/8 bg-[#0f0f17]/60 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Database</span>
              <Database size={16} className="text-purple-400" />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-sm font-semibold text-slate-200">Neon PostgreSQL</p>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">AWS ap-southeast-1</p>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "projects" ? (
          <ProjectsTab
            projects={projects}
            loading={projectsLoading}
            onMoveOrder={handleMoveProjectOrder}
            onTogglePublish={handleToggleProjectPublish}
            onPreview={(p) => setPreviewProject(p)}
            onEdit={(p) => {
              setEditingProject(p);
              setIsProjectEditorOpen(true);
            }}
            onDelete={(id) => setDeleteProjectId(id)}
          />
        ) : activeTab === "experiences" ? (
          <ExperiencesTab
            experiences={experiences}
            loading={experiencesLoading}
            onMoveOrder={handleMoveExperienceOrder}
            onTogglePublish={handleToggleExperiencePublish}
            onEdit={(e) => {
              setEditingExperience(e);
              setIsExperienceEditorOpen(true);
            }}
            onDelete={(id) => setDeleteExperienceId(id)}
          />
        ) : (
          <MessagesTab
            messages={messages}
            loading={messagesLoading}
            onViewMessage={handleViewMessage}
            onToggleRead={handleToggleMessageRead}
            onDeleteMessage={(id) => setDeleteMessageId(id)}
          />
        )}
      </main>

      {/* ── PROJECT EDITOR MODAL ── */}
      {isProjectEditorOpen && (
        <ProjectEditorModal
          editingProject={editingProject}
          initialOrderIndex={
            projects.length > 0 ? Math.max(...projects.map((p) => p.order_index)) + 1 : 1
          }
          onClose={() => setIsProjectEditorOpen(false)}
          onSaveSuccess={() => {
            setIsProjectEditorOpen(false);
            fetchProjects();
          }}
          showToast={showToast}
        />
      )}

      {/* ── PROJECT PREVIEW MODAL ── */}
      <ProjectPreviewModal
        project={previewProject}
        onClose={() => setPreviewProject(null)}
      />

      {/* ── EXPERIENCE EDITOR MODAL ── */}
      {isExperienceEditorOpen && (
        <ExperienceEditorModal
          editingExperience={editingExperience}
          initialOrderIndex={
            experiences.length > 0 ? Math.max(...experiences.map((e) => e.order_index)) + 1 : 1
          }
          onClose={() => setIsExperienceEditorOpen(false)}
          onSaveSuccess={() => {
            setIsExperienceEditorOpen(false);
            fetchExperiences();
          }}
          showToast={showToast}
        />
      )}

      {/* ── DELETE PROJECT MODAL ── */}
      {deleteProjectId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#0f0f17] p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <AlertCircle size={20} />
              <h4 className="text-base font-bold text-white">Delete Project?</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Are you sure you want to delete this project from the database? This action is permanent and will remove it from your live portfolio.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteProjectId(null)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProject}
                disabled={deletingProject}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-all flex items-center gap-2"
              >
                {deletingProject ? (
                  <>
                    <Loader2 size={13} className="animate-spin text-white" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Confirm Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE EXPERIENCE MODAL ── */}
      {deleteExperienceId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#0f0f17] p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <AlertCircle size={20} />
              <h4 className="text-base font-bold text-white">Delete Experience?</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Are you sure you want to delete this career experience entry? It will be removed from your portfolio immediately.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteExperienceId(null)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteExperience}
                disabled={deletingExperience}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-all flex items-center gap-2"
              >
                {deletingExperience ? (
                  <>
                    <Loader2 size={13} className="animate-spin text-white" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Confirm Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MESSAGE DETAIL MODAL ── */}
      <MessageDetailModal
        message={viewingMessage}
        onClose={() => setViewingMessage(null)}
        onToggleRead={handleToggleMessageRead}
        onDelete={(id) => {
          setViewingMessage(null);
          setDeleteMessageId(id);
        }}
      />

      {/* ── DELETE MESSAGE MODAL ── */}
      {deleteMessageId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#0f0f17] p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <AlertCircle size={20} />
              <h4 className="text-base font-bold text-white">Delete Contact Inquiry?</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Are you sure you want to permanently delete this contact inquiry from your database? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteMessageId(null)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteMessage}
                disabled={deletingMessage}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-all flex items-center gap-2"
              >
                {deletingMessage ? (
                  <>
                    <Loader2 size={13} className="animate-spin text-white" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Confirm Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}