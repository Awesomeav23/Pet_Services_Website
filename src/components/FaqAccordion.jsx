import { useState } from 'react';

import styles from './FaqAccordion.module.css';

/**
 * FAQ accordion.
 *
 * Each trigger is a real <button> inside a heading, which gives Enter/Space
 * activation and heading navigation for free — a styled <div> would need both
 * rebuilt by hand and would still be missed by heading shortcuts.
 *
 * aria-expanded reports state, aria-controls points at the panel, and the
 * panel is hidden with the `hidden` attribute so collapsed answers are removed
 * from the accessibility tree rather than merely painted out of sight.
 *
 * Multiple panels may be open at once; opening one never closes another.
 */
export default function FaqAccordion({ items }) {
  const [openIds, setOpenIds] = useState(() => new Set());

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={styles.accordion}>
      {items.map(({ id, question, answer }) => {
        const isOpen = openIds.has(id);
        const panelId = `${id}-panel`;
        const buttonId = `${id}-button`;

        return (
          <div className={styles.item} key={id}>
            <h3 className={styles.heading}>
              <button
                type="button"
                id={buttonId}
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(id)}
              >
                <span className={styles.question}>{question}</span>
                <span className={styles.icon} aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={styles.panel}
              hidden={!isOpen}
            >
              <p className={styles.answer}>{answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
