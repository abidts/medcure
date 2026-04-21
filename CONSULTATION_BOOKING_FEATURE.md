# Doctor Consultation Booking Feature

## Overview
This feature allows patients to book online consultations with doctors across various specializations. It includes a category-based browsing system, patient information collection, and OTP-based verification.

## Features

### 1. **Consultation Categories Page**
- Browse consultations by specialization (Gynaecology, Dermatology, Cardiology, etc.)
- Visual cards with icons and specialization names
- Quick access to booking forms
- "View All Specialities" option

### 2. **Consultation Booking Form**
- **Step 1: Patient Information**
  - Select specialization (pre-selected based on category)
  - Enter patient name
  - Enter mobile number
  - Optional email address
  - Optional symptoms/additional notes
  - Real-time consultation fee display

- **Step 2: Mobile Verification**
  - 6-digit OTP verification
  - Option to resend verification code
  - Automatic confirmation after verification

- **Step 3: Success Page**
  - Booking confirmation with booking ID
  - Consultation details
  - Next steps information

## Backend Components

### Models
- **ConsultationBooking** (`ConsultationBooking.java`)
  - Stores all consultation booking details
  - Tracks booking status (PENDING, VERIFICATION_PENDING, VERIFIED, DOCTOR_ASSIGNED, CONFIRMED, COMPLETED, CANCELLED)
  - Links to Patient and Specialization

### DTOs
- **ConsultationBookingRequest** - For creating new bookings
- **ConsultationVerificationRequest** - For OTP verification
- **ConsultationBookingResponse** - For API responses

### Services
- **ConsultationBookingService**
  - `createConsultationBooking()` - Create new booking with OTP generation
  - `verifyConsultationBooking()` - Verify OTP
  - `confirmConsultationBooking()` - Confirm after verification
  - `getConsultationBooking()` - Get booking details
  - `getBookingsByStatus()` - Filter bookings by status
  - `cancelConsultationBooking()` - Cancel a booking
  - `resendVerificationCode()` - Resend OTP

### Repository
- **ConsultationBookingRepository**
  - Custom queries for finding bookings by mobile number, patient, status

### Controller
- **ConsultationBookingController**
  - REST API endpoints for all consultation operations
  - Error handling and response formatting

## API Endpoints

### 1. Create Consultation Booking
```
POST /api/consultations/book
Content-Type: application/json

{
  "specializationId": 1,
  "patientName": "John Doe",
  "mobileNumber": "9876543210",
  "email": "john@example.com",
  "symptoms": "Fever and cold",
  "additionalNotes": "Started 3 days ago"
}

Response:
{
  "success": true,
  "message": "Consultation booking created. Verification code sent to mobile number.",
  "data": {
    "id": 1,
    "patientName": "John Doe",
    "mobileNumber": "9876543210",
    "email": "john@example.com",
    "specialization": "General",
    "consultationFee": 499.0,
    "status": "PENDING",
    "verificationCodeVerified": false,
    "createdAt": "2026-04-16T10:30:00"
  }
}
```

### 2. Verify Consultation Booking
```
POST /api/consultations/verify
Content-Type: application/json

{
  "consultationBookingId": 1,
  "verificationCode": "123456"
}

Response:
{
  "success": true,
  "message": "Mobile number verified successfully.",
  "data": {
    "id": 1,
    "patientName": "John Doe",
    "mobileNumber": "9876543210",
    "specialization": "General",
    "consultationFee": 499.0,
    "status": "VERIFIED",
    "verificationCodeVerified": true,
    "verifiedAt": "2026-04-16T10:35:00"
  }
}
```

### 3. Get Consultation Booking
```
GET /api/consultations/{id}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "patientName": "John Doe",
    "mobileNumber": "9876543210",
    "specialization": "General",
    "consultationFee": 499.0,
    "status": "VERIFIED",
    "verificationCodeVerified": true
  }
}
```

### 4. Get Bookings by Status
```
GET /api/consultations/status/{status}

Possible statuses: PENDING, VERIFICATION_PENDING, VERIFIED, DOCTOR_ASSIGNED, CONFIRMED, COMPLETED, CANCELLED
```

### 5. Confirm Consultation Booking
```
POST /api/consultations/{id}/confirm

Response:
{
  "success": true,
  "message": "Consultation booking confirmed successfully.",
  "data": {
    "id": 1,
    "status": "CONFIRMED",
    "bookedAt": "2026-04-16T10:35:00"
  }
}
```

### 6. Cancel Consultation Booking
```
DELETE /api/consultations/{id}/cancel

Response:
{
  "success": true,
  "message": "Consultation booking cancelled successfully."
}
```

### 7. Resend Verification Code
```
POST /api/consultations/{id}/resend-code

Response:
{
  "success": true,
  "message": "Verification code resent to mobile number."
}
```

## Frontend Components

### ConsultationCategories.tsx
- Displays consultation categories
- Fetches specializations from API
- Provides quick access links to booking forms
- Responsive grid layout

### ConsultationBookingForm.tsx
- Multi-step form (Form → Verification → Success)
- Handles patient information collection
- OTP verification integration
- Success confirmation

## Styling
- **File**: `css/consultation.css`
- Responsive design (mobile-first approach)
- Professional card-based UI
- Security badge styling
- Success page styling

## Consultation Fees (Default)
- Gynaecology: ₹499
- Cardiology: ₹599
- Dermatology: ₹399
- General: ₹299

*Can be customized in `ConsultationBookingService.getConsultationFee()` method*

## Database Schema

```sql
CREATE TABLE consultation_bookings (
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
    FOREIGN KEY (assigned_doctor_id) REFERENCES doctors(id)
);
```

## Routes

### Frontend Routes
- `/consultations` - Browse all consultation categories
- `/consultation/book/:specializationId` - Book a consultation for specific specialization

### Backend Routes
- `POST /api/consultations/book` - Create booking
- `POST /api/consultations/verify` - Verify OTP
- `POST /api/consultations/{id}/confirm` - Confirm booking
- `DELETE /api/consultations/{id}/cancel` - Cancel booking
- `GET /api/consultations/{id}` - Get booking details
- `GET /api/consultations/status/{status}` - Get bookings by status
- `POST /api/consultations/{id}/resend-code` - Resend verification code

## Future Enhancements

1. **SMS/Email Integration**
   - Send actual SMS with verification code
   - Send email confirmations
   - Send appointment reminders

2. **Payment Integration**
   - Integrate payment gateway for consultation fees
   - Support multiple payment methods
   - Generate receipts

3. **Doctor Matching**
   - Auto-assign available doctors based on specialization
   - Doctor availability calendar
   - Slot management

4. **Consultation Scheduling**
   - Schedule video/clinic consultations
   - Send scheduled appointment links
   - Consultation history

5. **Ratings & Reviews**
   - Allow patients to rate consultations
   - Leave feedback for doctors
   - Display doctor ratings

6. **Admin Dashboard**
   - View all pending consultations
   - Assign doctors to consultations
   - Manage consultation fees
   - Analytics and reports

## Testing

### Manual Testing
1. Navigate to `/consultations`
2. Click on any "CONSULT NOW" button
3. Fill in the consultation form
4. Click "Continue"
5. Enter verification code (in development, use the code shown in browser console or backend logs)
6. Verify and confirm
7. See success page

### API Testing
Use tools like Postman or cURL:

```bash
# Create booking
curl -X POST http://localhost:8080/api/consultations/book \
  -H "Content-Type: application/json" \
  -d '{
    "specializationId": 1,
    "patientName": "Test Patient",
    "mobileNumber": "9876543210",
    "email": "test@example.com",
    "symptoms": "Test symptoms"
  }'
```

## Notes

- Currently, verification codes are generated but not sent via SMS. Implement `sendVerificationCode()` method for SMS integration
- Consultation fees are hardcoded; can be made configurable via admin panel
- Doctor assignment is manual; can be automated with availability checking
- The feature assumes Specialization and Doctor entities already exist in the system
