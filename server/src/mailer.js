import { Resend } from 'resend';

/**
 * Email side-effects for booking and contact submissions.
 *
 * Missing RESEND_API_KEY is not an error: the DB write is the source of truth
 * and the site should keep taking submissions if the mail provider is offline
 * or the key hasn't been set yet. A failed send is logged and swallowed for
 * the same reason.
 */

const FROM = process.env.MAIL_FROM ?? 'Pawsome Pet Services <onboarding@resend.dev>';
const OWNER = process.env.OWNER_EMAIL;

let client = null;
const getClient = () => {
  if (client) return client;
  if (!process.env.RESEND_API_KEY) return null;
  client = new Resend(process.env.RESEND_API_KEY);
  return client;
};

const send = async ({ to, subject, html }) => {
  const resend = getClient();
  if (!resend) {
    console.warn(`RESEND_API_KEY not set — skipping email to ${to}`);
    return;
  }
  try {
    const { error } = await resend.emails.send({ from: FROM, to, subject, html });
    if (error) console.error(`Resend rejected email to ${to}:`, error.message ?? error);
  } catch (error) {
    console.error(`Resend request failed for ${to}:`, error.message ?? error);
  }
};

const ESCAPE = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escape = (value) =>
  value == null ? '' : String(value).replace(/[&<>"']/g, (c) => ESCAPE[c]);

const detailsTable = (rows) =>
  `<table style="border-collapse:collapse;">${rows
    .filter(([, v]) => v != null && v !== '')
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#555;">${escape(k)}</td>` +
        `<td style="padding:4px 0;"><strong>${escape(v)}</strong></td></tr>`,
    )
    .join('')}</table>`;

const wrapper = (heading, body) => `
  <div style="font-family:system-ui,-apple-system,sans-serif;max-width:520px;color:#111;">
    <h2 style="margin:0 0 16px;">${escape(heading)}</h2>
    ${body}
  </div>`;

export const sendBookingEmails = async ({ reference, service, form }) => {
  const details = detailsTable([
    ['Reference', reference],
    ['Service', service.name],
    ['Pet', `${form.petName} (${form.petType})`],
    ['Date', form.preferredDate],
    ['Time', form.preferredTime],
    ['Owner', form.ownerName],
    ['Email', form.email],
    ['Phone', form.phone],
  ]);

  const customer = wrapper(
    "We've got your booking",
    `<p>Thanks, ${escape(form.ownerName)}! Here's what we received:</p>${details}
     <p style="margin-top:24px;color:#555;">We'll be in touch shortly to confirm the appointment.</p>`,
  );

  const owner = wrapper(
    `New booking — ${service.name}`,
    `${details}${
      form.petNotes
        ? `<p style="margin-top:16px;"><strong>Notes:</strong> ${escape(form.petNotes)}</p>`
        : ''
    }`,
  );

  const tasks = [send({ to: form.email, subject: `Booking received — ${reference}`, html: customer })];
  if (OWNER) {
    tasks.push(send({ to: OWNER, subject: `New booking — ${service.name} — ${reference}`, html: owner }));
  }
  await Promise.allSettled(tasks);
};

export const sendContactEmails = async ({ form }) => {
  const summary = `${detailsTable([
    ['From', `${form.name} <${form.email}>`],
    ['Subject', form.subject],
  ])}<p style="white-space:pre-wrap;margin-top:16px;">${escape(form.message)}</p>`;

  const customer = wrapper(
    'Thanks for reaching out',
    `<p>We received your message and will reply within one business day. Here's a copy for your records:</p>${summary}`,
  );

  const owner = wrapper(`New contact message — ${form.subject}`, summary);

  const tasks = [send({ to: form.email, subject: 'We got your message', html: customer })];
  if (OWNER) {
    tasks.push(send({ to: OWNER, subject: `Contact form — ${form.subject}`, html: owner }));
  }
  await Promise.allSettled(tasks);
};
