-- Add online_status column to doctors table
ALTER TABLE doctors 
ADD COLUMN online_status BOOLEAN NOT NULL DEFAULT false;

-- Create instant_consultation_queue table
CREATE TABLE instant_consultation_queue (
    id BIGSERIAL PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    patient_id BIGINT NOT NULL,
    queue_position INTEGER NOT NULL,
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'WAITING',
    notes TEXT,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Create index on doctor_id and status for faster queries
CREATE INDEX idx_instant_queue_doctor_status ON instant_consultation_queue(doctor_id, status);
CREATE INDEX idx_instant_queue_position ON instant_consultation_queue(doctor_id, queue_position);
