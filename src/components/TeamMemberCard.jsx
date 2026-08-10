import styles from './TeamMemberCard.module.css';

/**
 * Staff profile card.
 *
 * The avatar is a monogram tile rather than a photograph, so it is decorative
 * and hidden from assistive technology — the name sits right beside it as
 * real text.
 */
export default function TeamMemberCard({ member }) {
  const { name, role, initials, credentials, bio } = member;

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <span className={styles.avatar} aria-hidden="true">
          {initials}
        </span>
        <div>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.role}>{role}</p>
        </div>
      </div>

      <p className={styles.credentials}>{credentials}</p>
      <p className={styles.bio}>{bio}</p>
    </article>
  );
}
