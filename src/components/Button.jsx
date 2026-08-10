import { Link } from 'react-router-dom';

import styles from './Button.module.css';

/**
 * Shared action element.
 *
 * Renders a real <a>/<Link> when given a destination and a real <button>
 * otherwise, so keyboard behaviour and assistive-technology semantics match
 * what the control actually does. Never a clickable <div>.
 */
export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...rest
}) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link className={classes} to={to} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a className={classes} href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} type="button" {...rest}>
      {children}
    </button>
  );
}
