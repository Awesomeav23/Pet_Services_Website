import { randomBytes } from 'node:crypto';
import { Router } from 'express';
import {
  validateDetailsStep,
  validateScheduleStep,
  validateServiceStep,
} from '../../../src/utils/validation.js';
import { query } from '../db.js';

export const bookingsRouter = Router();

/**
 * Reference such as "PAW-4F2A19".
 *
 * Generated here rather than in the browser. The client used to invent its own
 * with Math.random(); moving it server-side means the reference on the
 * confirmation panel is the one actually stored, and the UNIQUE constraint on
 * the column is what guarantees it. crypto over Math.random so two requests
 * arriving in the same millisecond cannot collide.
 */
const createReference = () => `PAW-${randomBytes(4).toString('hex').slice(0, 6).toUpperCase()}`;

/**
 * Re-runs the client's own validators over the whole payload.
 *
 * Imported from the front-end module rather than reimplemented, so a rule can
 * never drift between the two sides. Client-side validation is a courtesy to
 * the user; this is the copy that actually protects the table.
 */
const validateBooking = (form) => ({
  ...validateServiceStep(form),
  ...validateDetailsStep(form),
  ...validateScheduleStep(form),
});

/** POST /api/bookings — replaces the localStorage write the form used to do. */
bookingsRouter.post('/', async (request, response, next) => {
  try {
    const form = request.body ?? {};
    const errors = validateBooking(form);

    if (Object.keys(errors).length > 0) {
      return response.status(422).json({ error: 'Validation failed', errors });
    }

    // Checked separately from the field validators: this is a referential
    // question, not a formatting one, and it needs the database to answer.
    const service = await query('SELECT id FROM services WHERE id = $1', [form.serviceId]);

    if (service.rows.length === 0) {
      return response
        .status(422)
        .json({ error: 'Validation failed', errors: { serviceId: 'Choose a service to continue' } });
    }

    const { rows } = await query(
      `INSERT INTO bookings
         (reference, service_id, pet_name, pet_type, pet_breed, pet_age, pet_notes,
          owner_name, email, phone, preferred_date, preferred_time, consent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING reference, created_at`,
      [
        createReference(),
        form.serviceId,
        form.petName.trim(),
        form.petType,
        form.petBreed?.trim() || null,
        form.petAge === '' || form.petAge === undefined ? null : Number(form.petAge),
        form.petNotes?.trim() || null,
        form.ownerName.trim(),
        form.email.trim(),
        form.phone.trim(),
        form.preferredDate,
        form.preferredTime,
        Boolean(form.consent),
      ],
    );

    response.status(201).json({
      reference: rows[0].reference,
      submittedAt: rows[0].created_at,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/bookings/:reference
 *
 * Lets a customer re-open a confirmation from the reference alone. Returns
 * only what the confirmation panel renders — deliberately not the phone
 * number or notes, since the reference is guessable enough that it should not
 * unlock full contact details.
 */
bookingsRouter.get('/:reference', async (request, response, next) => {
  try {
    const { rows } = await query(
      `SELECT b.reference, b.pet_name, b.owner_name, b.preferred_date,
              b.preferred_time, b.created_at, s.id AS service_id, s.name AS service_name
       FROM bookings b
       JOIN services s ON s.id = b.service_id
       WHERE b.reference = $1`,
      [request.params.reference.toUpperCase()],
    );

    if (rows.length === 0) {
      return response.status(404).json({ error: 'Booking not found' });
    }

    const row = rows[0];

    response.json({
      reference: row.reference,
      petName: row.pet_name,
      ownerName: row.owner_name,
      preferredDate: row.preferred_date,
      preferredTime: row.preferred_time,
      submittedAt: row.created_at,
      service: { id: row.service_id, name: row.service_name },
    });
  } catch (error) {
    next(error);
  }
});
