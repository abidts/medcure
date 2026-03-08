-- Migration script to update existing doctor records with district and state values
-- Run this script if you have existing doctors with NULL district/state values

-- Update doctors in Srinagar area to have Srinagar district and Jammu and Kashmir state
UPDATE doctors
SET district = 'Srinagar',
    state = 'Jammu and Kashmir'
WHERE district IS NULL
  AND (
    LOWER(clinic_address) LIKE '%srinagar%'
    OR LOWER(city) = 'srinagar'
    OR LOWER(area) LIKE '%srinagar%'
  );

-- Update doctors in Anantnag area
UPDATE doctors
SET district = 'Anantnag',
    state = 'Jammu and Kashmir'
WHERE district IS NULL
  AND (
    LOWER(clinic_address) LIKE '%anantnag%'
    OR LOWER(city) = 'anantnag'
    OR LOWER(area) LIKE '%anantnag%'
  );

-- Update doctors in Baramulla area
UPDATE doctors
SET district = 'Baramulla',
    state = 'Jammu and Kashmir'
WHERE district IS NULL
  AND (
    LOWER(clinic_address) LIKE '%baramulla%'
    OR LOWER(city) = 'baramulla'
    OR LOWER(area) LIKE '%baramulla%'
  );

-- Update doctors in Kupwara area
UPDATE doctors
SET district = 'Kupwara',
    state = 'Jammu and Kashmir'
WHERE district IS NULL
  AND (
    LOWER(clinic_address) LIKE '%kupwara%'
    OR LOWER(city) = 'kupwara'
    OR LOWER(area) LIKE '%kupwara%'
  );

-- Update doctors in Handwara area
UPDATE doctors
SET district = 'Kupwara',
    state = 'Jammu and Kashmir'
WHERE district IS NULL
  AND (
    LOWER(clinic_address) LIKE '%handwara%'
    OR LOWER(city) = 'handwara'
    OR LOWER(area) LIKE '%handwara%'
  );

-- Update doctors in Sopore area
UPDATE doctors
SET district = 'Baramulla',
    state = 'Jammu and Kashmir'
WHERE district IS NULL
  AND (
    LOWER(clinic_address) LIKE '%sopore%'
    OR LOWER(city) = 'sopore'
    OR LOWER(area) LIKE '%sopore%'
  );

-- Update doctors in Budgam area
UPDATE doctors
SET district = 'Budgam',
    state = 'Jammu and Kashmir'
WHERE district IS NULL
  AND (
    LOWER(clinic_address) LIKE '%budgam%'
    OR LOWER(city) = 'budgam'
    OR LOWER(area) LIKE '%budgam%'
  );

-- Update doctors in Pulwama area
UPDATE doctors
SET district = 'Pulwama',
    state = 'Jammu and Kashmir'
WHERE district IS NULL
  AND (
    LOWER(clinic_address) LIKE '%pulwama%'
    OR LOWER(city) = 'pulwama'
    OR LOWER(area) LIKE '%pulwama%'
  );

-- Update doctors in Shopian area
UPDATE doctors
SET district = 'Shopian',
    state = 'Jammu and Kashmir'
WHERE district IS NULL
  AND (
    LOWER(clinic_address) LIKE '%shopian%'
    OR LOWER(city) = 'shopian'
    OR LOWER(area) LIKE '%shopian%'
  );

-- Update doctors in Kulgam area
UPDATE doctors
SET district = 'Kulgam',
    state = 'Jammu and Kashmir'
WHERE district IS NULL
  AND (
    LOWER(clinic_address) LIKE '%kulgam%'
    OR LOWER(city) = 'kulgam'
    OR LOWER(area) LIKE '%kulgam%'
  );

-- Update doctors in Bandipora area
UPDATE doctors
SET district = 'Bandipora',
    state = 'Jammu and Kashmir'
WHERE district IS NULL
  AND (
    LOWER(clinic_address) LIKE '%bandipora%'
    OR LOWER(city) = 'bandipora'
    OR LOWER(area) LIKE '%bandipora%'
  );

-- Update doctors in Ganderbal area
UPDATE doctors
SET district = 'Ganderbal',
    state = 'Jammu and Kashmir'
WHERE district IS NULL
  AND (
    LOWER(clinic_address) LIKE '%ganderbal%'
    OR LOWER(city) = 'ganderbal'
    OR LOWER(area) LIKE '%ganderbal%'
  );

-- Update doctors in Kargil area
UPDATE doctors
SET district = 'Kargil',
    state = 'Ladakh'
WHERE district IS NULL
  AND (
    LOWER(clinic_address) LIKE '%kargil%'
    OR LOWER(city) = 'kargil'
    OR LOWER(area) LIKE '%kargil%'
  );

-- Update doctors in Leh area
UPDATE doctors
SET district = 'Leh',
    state = 'Ladakh'
WHERE district IS NULL
  AND (
    LOWER(clinic_address) LIKE '%leh%'
    OR LOWER(city) = 'leh'
    OR LOWER(area) LIKE '%leh%'
  );

-- Default fallback: Any remaining doctors with NULL district/state
-- Set to Srinagar, Jammu and Kashmir as default
UPDATE doctors
SET district = 'Srinagar',
    state = 'Jammu and Kashmir'
WHERE district IS NULL OR state IS NULL;
