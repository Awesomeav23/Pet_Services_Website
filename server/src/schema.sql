-- Pawsome Pet Services — schema.
--
-- Three tables: the service catalogue the site reads from, and the two kinds
-- of submission it writes. Kept deliberately small; every column here backs
-- something the UI actually renders or the API actually validates.

CREATE TABLE IF NOT EXISTS services (
  id            TEXT PRIMARY KEY,
  name          TEXT           NOT NULL,
  tagline       TEXT           NOT NULL,
  description   TEXT           NOT NULL,
  price         NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  price_unit    TEXT           NOT NULL,
  duration_min  INTEGER        NOT NULL CHECK (duration_min > 0),
  pet_types     TEXT[]         NOT NULL,
  icon          TEXT           NOT NULL,
  popular       BOOLEAN        NOT NULL DEFAULT FALSE,
  includes      TEXT[]         NOT NULL DEFAULT '{}',
  -- Preserves the catalogue ordering the designers chose, which is neither
  -- alphabetical nor by price.
  sort_order    INTEGER        NOT NULL DEFAULT 0
);

-- Filtering by pet type is the one query the services page runs on every
-- filter change, and pet_types is an array, so it wants a GIN index.
CREATE INDEX IF NOT EXISTS services_pet_types_idx ON services USING GIN (pet_types);

CREATE TABLE IF NOT EXISTS bookings (
  id              BIGSERIAL   PRIMARY KEY,
  -- Shown to the customer on the confirmation panel, so it must be unique
  -- and stable. Generated server-side; a client-supplied one is ignored.
  reference       TEXT        NOT NULL UNIQUE,
  service_id      TEXT        NOT NULL REFERENCES services (id),
  pet_name        TEXT        NOT NULL,
  pet_type        TEXT        NOT NULL,
  pet_breed       TEXT,
  -- Numeric rather than integer: "0.5" is a real answer for a young puppy.
  pet_age         NUMERIC(4, 1),
  pet_notes       TEXT,
  owner_name      TEXT        NOT NULL,
  email           TEXT        NOT NULL,
  phone           TEXT        NOT NULL,
  preferred_date  DATE        NOT NULL,
  preferred_time  TEXT        NOT NULL,
  consent         BOOLEAN     NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bookings_service_id_idx ON bookings (service_id);
CREATE INDEX IF NOT EXISTS bookings_email_idx      ON bookings (email);

CREATE TABLE IF NOT EXISTS contact_messages (
  id          BIGSERIAL   PRIMARY KEY,
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  subject     TEXT        NOT NULL,
  message     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
