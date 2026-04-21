-- Create consultation_bookings table
CREATE TABLE IF NOT EXISTS consultation_bookings (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT,
    specialization_id BIGINT NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    consultation_fee DECIMAL(10, 2),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    verification_code VARCHAR(10),
    verification_code_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    verified_at TIMESTAMP,
    booked_at TIMESTAMP,
    symptoms TEXT,
    additional_notes TEXT,
    assigned_doctor_id BIGINT,
    
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (specialization_id) REFERENCES specializations(id),
    FOREIGN KEY (assigned_doctor_id) REFERENCES doctors(id),
    
    INDEX idx_mobile_number (mobile_number),
    INDEX idx_status (status),
    INDEX idx_specialization_id (specialization_id),
    INDEX idx_patient_id (patient_id)
);
