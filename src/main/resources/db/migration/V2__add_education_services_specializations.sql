-- Migration V2: Add new tables for doctor education and services, and add specializations column
-- Run this script to add education, services, and specializations support

-- Add specializations column to doctors table if not exists
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS specializations TEXT;

-- Create doctor_education table
CREATE TABLE IF NOT EXISTS doctor_education (
    id BIGSERIAL PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    institute VARCHAR(255) NOT NULL,
    degree_course VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    CONSTRAINT fk_doctor_education_doctor
        FOREIGN KEY (doctor_id)
        REFERENCES doctors(id)
        ON DELETE CASCADE
);

-- Create doctor_services table
CREATE TABLE IF NOT EXISTS doctor_services (
    id BIGSERIAL PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    CONSTRAINT fk_doctor_services_doctor
        FOREIGN KEY (doctor_id)
        REFERENCES doctors(id)
        ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_doctor_education_doctor_id ON doctor_education(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_services_doctor_id ON doctor_services(doctor_id);
