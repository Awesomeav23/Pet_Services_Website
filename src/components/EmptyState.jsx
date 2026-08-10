import Button from './Button.jsx';
import styles from './EmptyState.module.css';

/** Shown when a filter or search returns nothing. */
export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon} aria-hidden="true">
        🔍
      </span>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {actionLabel && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
