import { Router } from 'express';
import { validateContactMessage } from '../../../src/utils/validation.js';
import { query } from '../db.js';

export const contactRouter = Router();

const SUBJECTS = new Set(['general', 'booking', 'services', 'feedback']);

/** POST /api/contact — stores a message from the contact form. */
contactRouter.post('/', async (request, response, next) => {
  try {
    const form = request.body ?? {};
    const errors = validateContactMessage(form);

    // The subject arrives from a <select>, so a bad value means a crafted
    // request rather than a user mistake — but it still gets a field error
    // instead of a 500 when it hits the column.
    if (!SUBJECTS.has(form.subject)) {
      errors.subject = 'Choose one of the listed subjects';
    }

    if (Object.keys(errors).length > 0) {
      return response.status(422).json({ error: 'Validation failed', errors });
    }

    const { rows } = await query(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id, created_at`,
      [form.name.trim(), form.email.trim(), form.subject, form.message.trim()],
    );

    response.status(201).json({ id: rows[0].id, receivedAt: rows[0].created_at });
  } catch (error) {
    next(error);
  }
});
