import { useRef, useState } from 'react';

import FormField from './FormField.jsx';
import ErrorSummary from './ErrorSummary.jsx';
import {
  validateRequired,
  validateEmail,
  isBlank,
} from '../utils/validation.js';
import styles from './ContactForm.module.css';

const EMPTY_MESSAGE = {
  name: '',
  email: '',
  subject: 'general',
  message: '',
};

const FIELD_LABELS = {
  name: 'Your name',
  email: 'Email address',
  message: 'Message',
};

const SUBJECTS = [
  { value: 'general', label: 'General enquiry' },
  { value: 'booking', label: 'Existing booking' },
  { value: 'services', label: 'Question about a service' },
  { value: 'feedback', label: 'Feedback or complaint' },
];

/** Same validate/announce/focus pattern as the booking form. */
const validate = (form) => {
  const errors = {
    name: validateRequired(form.name, 'Your name'),
    email: validateEmail(form.email),
    message: isBlank(form.message)
      ? 'Message is required'
      : form.message.trim().length < 10
        ? 'Please give us a little more detail (at least 10 characters)'
        : undefined,
  };

  return Object.fromEntries(
    Object.entries(errors).filter(([, value]) => value !== undefined)
  );
};

export default function ContactForm() {
  const [form, setForm] = useState(EMPTY_MESSAGE);
  const [errors, setErrors] = useState({});
  const [isSent, setIsSent] = useState(false);

  const errorSummaryRef = useRef(null);
  const successRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      if (!prev[name]) return prev;
      const { [name]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      window.requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    // No backend in this project — the message is acknowledged locally.
    setIsSent(true);
    setForm(EMPTY_MESSAGE);
    window.requestAnimationFrame(() => successRef.current?.focus());
  };

  if (isSent) {
    return (
      <div
        ref={successRef}
        className={styles.success}
        role="status"
        tabIndex={-1}
      >
        <span className={styles.successIcon} aria-hidden="true">
          ✓
        </span>
        <h3>Message sent</h3>
        <p>
          Thanks for getting in touch. We reply to messages within one business
          day — usually sooner.
        </p>
        <button
          type="button"
          className={styles.link}
          onClick={() => setIsSent(false)}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <ErrorSummary
        ref={errorSummaryRef}
        errors={errors}
        fieldLabels={FIELD_LABELS}
      />

      <div className={styles.grid}>
        <FormField
          id="name"
          label="Your name"
          required
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          autoComplete="name"
        />

        <FormField
          id="email"
          label="Email address"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />
      </div>

      <FormField
        id="subject"
        label="What is this about"
        as="select"
        value={form.subject}
        onChange={handleChange}
      >
        {SUBJECTS.map(({ value, label }) => (
          <option value={value} key={value}>
            {label}
          </option>
        ))}
      </FormField>

      <FormField
        id="message"
        label="Message"
        as="textarea"
        required
        hint="Include your pet’s name and any dates you have in mind."
        value={form.message}
        onChange={handleChange}
        error={errors.message}
      />

      <button type="submit" className={styles.submit}>
        Send message
      </button>
    </form>
  );
}
