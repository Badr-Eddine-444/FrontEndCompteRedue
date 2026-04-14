import { useState } from 'react';
import styles from './ProjectForm.module.css';

interface ProjectFormProps {
  initialName?: string;
  initialColor?: string;
  onSubmit: (name: string, color: string) => void;
  onCancel: () => void;
  submitLabel: string;
  submitDisabled?: boolean;
}

export default function ProjectForm({
  initialName = '',
  initialColor = '#3498db',
  onSubmit,
  onCancel,
  submitLabel,
  submitDisabled = false,
}: ProjectFormProps) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(name, color);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom du projet"
        className={styles.input}
        required
      />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className={styles.colorPicker}
      />
      <button type="submit" className={styles.submit} disabled={submitDisabled}>
        {submitLabel}
      </button>
      <button type="button" onClick={onCancel} className={styles.cancel}>
        Annuler
      </button>
    </form>
  );
}
