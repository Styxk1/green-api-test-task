import styles from './Avatar.module.css';

const COLORS = ['#e8833a', '#3a8ee8', '#9b5de5', '#2fb380', '#e85d75', '#d4a017'];

const pickColor = (seed: string) => {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return COLORS[Math.abs(hash) % COLORS.length];
};

interface Props {
  name: string;
  seed: string;
  size?: number;
}

export function Avatar({ name, seed, size = 54 }: Props) {
  const letter = name.replace(/^\+/, '').charAt(0).toUpperCase();

  return (
    <div
      className={styles.avatar}
      style={{ width: size, height: size, fontSize: size * 0.4, background: pickColor(seed) }}
      aria-hidden="true"
    >
      {letter}
    </div>
  );
}
