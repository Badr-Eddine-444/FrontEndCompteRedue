import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../features/auth/useAuth';
import api from '../api/axios';
import HeaderMUI from '../components/HeaderMUI';
import Sidebar, { type Project } from '../components/Sidebar';
import MainContent from '../components/MainContent';
import ProjectForm from '../components/ProjectForm';
import styles from './Dashboard.module.css';

interface Column {
  id: string;
  title: string;
  tasks: string[];
}

export default function Dashboard() {
  const { state: authState, dispatch } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsRes, columnsRes] = await Promise.all([api.get<Project[]>('/projects'), api.get<Column[]>('/columns')]);
        setProjects(projectsRes.data);
        setColumns(columnsRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function addProject(name: string, color: string) {
    setSaving(true);
    setError(null);
    try {
      const { data } = await api.post<Project>('/projects', { name, color });
      setProjects((prev) => [...prev, data]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? `Erreur ${err.response?.status ?? ''}`.trim());
      } else {
        setError('Erreur inconnue');
      }
    } finally {
      setSaving(false);
    }
  }

  async function renameProject(project: Project) {
    const newName = prompt('Nouveau nom :', project.name);
    if (newName === null) return;
    const trimmed = newName.trim();
    if (!trimmed || trimmed === project.name) return;

    setSaving(true);
    setError(null);
    try {
      const { data } = await api.put<Project>(`/projects/${project.id}`, { ...project, name: trimmed });
      setProjects((prev) => prev.map((p) => (p.id === data.id ? data : p)));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? `Erreur ${err.response?.status ?? ''}`.trim());
      } else {
        setError('Erreur inconnue');
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(id: string) {
    if (!confirm('Êtes-vous sûr ?')) return;

    setSaving(true);
    setError(null);
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? `Erreur ${err.response?.status ?? ''}`.trim());
      } else {
        setError('Erreur inconnue');
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className={styles.loading}>Chargement...</div>;

  return (
    <div className={styles.layout}>
      <HeaderMUI
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen((p) => !p)}
        userName={authState.user?.name}
        onLogout={() => dispatch({ type: 'LOGOUT' })}
      />
      <div className={styles.body}>
        <Sidebar
          projects={projects}
          isOpen={sidebarOpen}
          onRenameProject={renameProject}
          onDeleteProject={deleteProject}
        />
        <div className={styles.content}>
          <div className={styles.toolbar}>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.toolbarRow}>
              {!showForm ? (
                <button type="button" className={styles.addBtn} disabled={saving} onClick={() => setShowForm(true)}>
                  + Nouveau projet
                </button>
              ) : (
                <ProjectForm
                  submitLabel="Créer"
                  submitDisabled={saving}
                  onSubmit={(name, color) => {
                    void addProject(name, color);
                    setShowForm(false);
                  }}
                  onCancel={() => setShowForm(false)}
                />
              )}
            </div>
          </div>
          <MainContent columns={columns} />
        </div>
      </div>
    </div>
  );
}
