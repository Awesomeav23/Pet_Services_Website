import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import SectionHeading from '../components/SectionHeading.jsx';
import StepIndicator from '../components/StepIndicator.jsx';
import FormField from '../components/FormField.jsx';
import ErrorSummary from '../components/ErrorSummary.jsx';
import BookingSummary from '../components/BookingSummary.jsx';
import ConfirmationPanel from '../components/ConfirmationPanel.jsx';
import Button from '../components/Button.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { SERVICES, getServiceById } from '../data/services.js';
import { formatPrice } from '../utils/format.js';
import { validateStep } from '../utils/validation.js';
import styles from './Booking.module.css';

const STEPS = ['Choose a service', 'Pet and owner', 'Date and time'];

const EMPTY_FORM = {
  serviceId: '',
  petName: '',
  petType: 'dog',
  petBreed: '',
  petAge: '',
  petNotes: '',
  ownerName: '',
  email: '',
  phone: '',
  preferredDate: '',
  preferredTime: 'morning',
  consent: false,
};

/** Labels used by the error summary to prefix each message. */
const FIELD_LABELS = {
  serviceId: 'Service',
  petName: 'Pet name',
  petAge: 'Pet age',
  ownerName: 'Your name',
  email: 'Email address',
  phone: 'Phone number',
  preferredDate: 'Preferred date',
  consent: 'Contact consent',
};

/** Reference such as "PAW-4F2A19". */
const createReference = () =>
  `PAW-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

/** Today as yyyy-mm-dd for the date input's min attribute. */
const todayISO = () => {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - offsetMs).toISOString().split('T')[0];
};

export default function Booking() {
  useDocumentTitle('Book a Visit');

  const [searchParams] = useSearchParams();
  const [form, setForm, clearStoredForm] = useLocalStorage(
    'pawsome:booking-draft',
    EMPTY_FORM
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState(null);

  const headingRef = useRef(null);
  const errorSummaryRef = useRef(null);
  const confirmationRef = useRef(null);
  // Focus should only move on user-driven step changes, not on first paint.
  const hasInteracted = useRef(false);

  // Deep link from a service detail page: /booking?service=grooming
  useEffect(() => {
    const requested = searchParams.get('service');
    if (requested && getServiceById(requested)) {
      setForm((prev) => ({ ...prev, serviceId: requested }));
    }
  }, [searchParams, setForm]);

  // Moving to a new step must announce itself; focus the step heading.
  useEffect(() => {
    if (hasInteracted.current) headingRef.current?.focus();
  }, [currentStep]);

  const selectedService = getServiceById(form.serviceId);

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear a field's error as soon as the user edits it, rather than making
    // them resubmit to find out whether it is fixed.
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const { [name]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    updateField(name, type === 'checkbox' ? checked : value);
  };

  const goToStep = (nextStep) => {
    hasInteracted.current = true;
    setCurrentStep(nextStep);
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, form);
    setErrors(stepErrors);

    if (Object.keys(stepErrors).length > 0) {
      // Wait for the summary to render before moving focus into it.
      window.requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    goToStep(currentStep + 1);
  };

  // Going back never validates — users must be able to correct an earlier
  // step without first satisfying the one they are leaving.
  const handleBack = () => {
    setErrors({});
    goToStep(currentStep - 1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const stepErrors = validateStep(currentStep, form);
    setErrors(stepErrors);

    if (Object.keys(stepErrors).length > 0) {
      window.requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    // No backend in this project; the request is persisted locally so the
    // confirmation has something real to show.
    const reference = createReference();
    const submitted = { ...form, reference, submittedAt: new Date().toISOString() };

    try {
      const key = 'pawsome:booking-requests';
      const existing = JSON.parse(window.localStorage.getItem(key) ?? '[]');
      window.localStorage.setItem(key, JSON.stringify([...existing, submitted]));
    } catch {
      // Storage unavailable — the confirmation is still shown.
    }

    setConfirmation({ reference, form: submitted, service: selectedService });
    clearStoredForm();
    window.requestAnimationFrame(() => confirmationRef.current?.focus());
  };

  const handleReset = () => {
    setConfirmation(null);
    setErrors({});
    setCurrentStep(0);
    clearStoredForm();
  };

  if (confirmation) {
    return (
      <section className="section container">
        <ConfirmationPanel
          ref={confirmationRef}
          reference={confirmation.reference}
          service={confirmation.service}
          form={confirmation.form}
          onReset={handleReset}
        />
      </section>
    );
  }

  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <section className="section container">
      <SectionHeading
        as="h1"
        eyebrow="Appointment request"
        title="Book a visit for your pet"
        description="Three short steps. We reply within one business day to confirm the time — nothing is charged online."
      />

      <div className={styles.layout}>
        <div>
          <StepIndicator steps={STEPS} currentStep={currentStep} />

          <ErrorSummary
            ref={errorSummaryRef}
            errors={errors}
            fieldLabels={FIELD_LABELS}
          />

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <h2 className={styles.stepHeading} ref={headingRef} tabIndex={-1}>
              {STEPS[currentStep]}
            </h2>

            {/* ---------- Step 1: service ---------- */}
            {currentStep === 0 && (
              <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>
                  Which service do you need?
                  <span className={styles.legendRequired}> (required)</span>
                </legend>

                {errors.serviceId && (
                  <p className={styles.fieldsetError} id="serviceId">
                    {errors.serviceId}
                  </p>
                )}

                <div className={styles.serviceOptions}>
                  {SERVICES.map((service) => {
                    const inputId = `service-${service.id}`;

                    return (
                      <div className={styles.serviceOption} key={service.id}>
                        <input
                          className={styles.serviceInput}
                          type="radio"
                          id={inputId}
                          name="serviceId"
                          value={service.id}
                          checked={form.serviceId === service.id}
                          onChange={handleChange}
                          aria-invalid={errors.serviceId ? true : undefined}
                        />
                        <label className={styles.serviceLabel} htmlFor={inputId}>
                          <span className={styles.serviceIcon} aria-hidden="true">
                            {service.icon}
                          </span>
                          <span className={styles.serviceText}>
                            <span className={styles.serviceName}>{service.name}</span>
                            <span className={styles.serviceMeta}>
                              {formatPrice(service.price)} {service.priceUnit}
                            </span>
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {/* ---------- Step 2: pet + owner ---------- */}
            {currentStep === 1 && (
              <>
                <div className={styles.grid}>
                  <FormField
                    id="petName"
                    label="Pet name"
                    required
                    value={form.petName}
                    onChange={handleChange}
                    error={errors.petName}
                    autoComplete="off"
                  />

                  <FormField
                    id="petType"
                    label="Pet type"
                    as="select"
                    required
                    value={form.petType}
                    onChange={handleChange}
                  >
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                  </FormField>

                  <FormField
                    id="petBreed"
                    label="Breed"
                    hint="Helps us allow the right amount of time."
                    value={form.petBreed}
                    onChange={handleChange}
                  />

                  <FormField
                    id="petAge"
                    label="Age in years"
                    type="number"
                    min="0"
                    max="30"
                    value={form.petAge}
                    onChange={handleChange}
                    error={errors.petAge}
                  />
                </div>

                <FormField
                  id="petNotes"
                  label="Anything we should know"
                  as="textarea"
                  hint="Anxious about clippers, recovering from surgery, dislikes other dogs — tell us here."
                  value={form.petNotes}
                  onChange={handleChange}
                />

                <hr className={styles.divider} />

                <div className={styles.grid}>
                  <FormField
                    id="ownerName"
                    label="Your name"
                    required
                    value={form.ownerName}
                    onChange={handleChange}
                    error={errors.ownerName}
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

                  <FormField
                    id="phone"
                    label="Phone number"
                    type="tel"
                    required
                    hint="Ten digits, for example (555) 018-7742."
                    value={form.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    autoComplete="tel"
                  />
                </div>
              </>
            )}

            {/* ---------- Step 3: schedule ---------- */}
            {currentStep === 2 && (
              <>
                <div className={styles.grid}>
                  <FormField
                    id="preferredDate"
                    label="Preferred date"
                    type="date"
                    required
                    min={todayISO()}
                    value={form.preferredDate}
                    onChange={handleChange}
                    error={errors.preferredDate}
                  />
                </div>

                <fieldset className={styles.fieldset}>
                  <legend className={styles.legend}>
                    Preferred time of day
                    <span className={styles.legendRequired}> (required)</span>
                  </legend>

                  <div className={styles.timeOptions}>
                    {[
                      { value: 'morning', label: 'Morning', hint: '7am – 12pm' },
                      { value: 'afternoon', label: 'Afternoon', hint: '12pm – 4pm' },
                      { value: 'evening', label: 'Evening', hint: '4pm – 7pm' },
                    ].map((slot) => {
                      const inputId = `time-${slot.value}`;

                      return (
                        <div className={styles.timeOption} key={slot.value}>
                          <input
                            className={styles.serviceInput}
                            type="radio"
                            id={inputId}
                            name="preferredTime"
                            value={slot.value}
                            checked={form.preferredTime === slot.value}
                            onChange={handleChange}
                          />
                          <label className={styles.timeLabel} htmlFor={inputId}>
                            <span className={styles.serviceName}>{slot.label}</span>
                            <span className={styles.serviceMeta}>{slot.hint}</span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </fieldset>

                <div className={styles.consent}>
                  <input
                    className={styles.checkbox}
                    type="checkbox"
                    id="consent"
                    name="consent"
                    checked={form.consent}
                    onChange={handleChange}
                    aria-describedby={errors.consent ? 'consent-error' : undefined}
                    aria-invalid={errors.consent ? true : undefined}
                  />
                  <label className={styles.consentLabel} htmlFor="consent">
                    You can contact me by phone or email about this request.
                    <span className={styles.legendRequired}> (required)</span>
                  </label>
                </div>

                {errors.consent && (
                  <p className={styles.fieldsetError} id="consent-error">
                    {errors.consent}
                  </p>
                )}
              </>
            )}

            <div className={styles.actions}>
              {currentStep > 0 && (
                <Button variant="secondary" onClick={handleBack}>
                  Back
                </Button>
              )}

              {isLastStep ? (
                <button type="submit" className={styles.submit}>
                  Send request
                </button>
              ) : (
                <Button onClick={handleNext}>Continue</Button>
              )}
            </div>
          </form>
        </div>

        <BookingSummary service={selectedService} form={form} />
      </div>
    </section>
  );
}
