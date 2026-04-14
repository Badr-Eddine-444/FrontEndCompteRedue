import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';
import api from '../api/axios';
import HeaderMUI from '../components/HeaderMUI';
import styles from './ProjectDetail.module.css';

interface Project {
  id: string;
  name: string;
  color: string;
}

function ProjectDetailContent({ id }: { id: string }) {
  const navigate = useNavigate();
  const { state: authState, dispatch } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get<Project>(`/projects/${id}`)
      .then((res) => {
        if (!cancelled) setProject(res.data);
      })
      .catch(() => {
        if (!cancelled) navigate('/dashboard');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  if (loading) return <div className={styles.loading}>Chargement...</div>;
  if (!project) return null;

  return (
    <div className={styles.layout}>
      <HeaderMUI
        title="TaskFlow"
        onMenuClick={() => navigate('/dashboard')}
        userName={authState.user?.name}
        onLogout={() => dispatch({ type: 'LOGOUT' })}
      />
      <main className={styles.main}>
        <div className={styles.header}>
          <span className={styles.dot} style={{ background: project.color }} />
          <h2>{project.name}</h2>
        </div>
        <p className={styles.info}>Projet ID: {project.id}</p>
      </main>
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  if (!id) return <Navigate to="/dashboard" replace />;
  return <ProjectDetailContent key={id} id={id} />;
}
