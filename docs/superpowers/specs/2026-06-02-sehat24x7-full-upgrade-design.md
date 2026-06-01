# Sehat24x7 Full Platform Upgrade — Design Spec
**Date:** 2026-06-02  
**Status:** Approved

---

## Summary

Five-phase upgrade of the Sehat24x7 healthcare platform. Each phase is independently deployable and builds on the previous.

---

## Phase 1: JWT Security Layer

### Problem
All 30+ API controllers have `@CrossOrigin(origins = "*")` and no authentication whatsoever. Any user can read or mutate any other user's data.

### Backend Changes

**New dependencies (pom.xml):**
- `spring-boot-starter-security`
- `io.jsonwebtoken:jjwt-api:0.12.6`, `jjwt-impl`, `jjwt-jackson`

**New files:**
| File | Purpose |
|------|---------|
| `config/SecurityConfig.java` | Configures HttpSecurity: stateless session, JWT filter, permit public routes, require auth elsewhere |
| `util/JwtUtil.java` | HS256 token generation (24h expiry), validation, claim extraction (userId, role) |
| `filter/JwtAuthenticationFilter.java` | OncePerRequestFilter: reads `Authorization: Bearer <token>`, validates, sets SecurityContext |

**Public routes (no token required):**
- `GET /api/doctors/**`
- `GET /api/specializations/**`
- `GET /api/home-api/**`
- `GET /api/hero-banners/**`
- `GET /api/announcements/**`
- `POST /api/auth/**`
- `POST /api/patients/register`
- `POST /api/doctors/register`
- `GET /api/locations/**`
- Static assets (`/`, `/index.html`, `/assets/**`, `/static/**`)

**Protected routes:** Everything else — patient, doctor, staff, admin APIs.

**Updated `AuthController`:** Login endpoint returns:
```json
{ "token": "<jwt>", "userId": 1, "role": "PATIENT", "name": "John", "patientId": 5 }
```

**JWT payload claims:** `userId`, `role`, `sub` (email)

### Frontend Changes

**New `src/api.ts`:**
```typescript
export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) { window.location.href = '/login'; }
  return response;
}
```

All `fetch()` calls in: `PatientDashboard`, `DoctorDashboard`, `AppointmentForm`, `StaffDashboard`, `AdminPanel`, `ConsultationBookingForm`, `CreatePrescription`, `PatientReports`, `PatientPrescriptions`, `VideoCall`, `PatientVideoWaiting`, `ReviewController calls` → replaced with `apiFetch()`.

**AuthContext update:** On login, store `token` in localStorage alongside existing `userId`, `role`, etc.

---

## Phase 2: Real-time Notification System

### Problem
No alerts when appointment status changes, doctor comes online, video call is accepted/rejected, or booking is assigned. Users must manually refresh.

### Backend

**New `Notification` entity (`model/Notification.java`):**
```
id (Long, PK)
recipientUserId (Long) — matches User.id
type (ENUM: APPOINTMENT_CONFIRMED, APPOINTMENT_CANCELLED, APPOINTMENT_COMPLETED,
           VIDEO_REQUEST_RECEIVED, VIDEO_REQUEST_ACCEPTED, VIDEO_REQUEST_REJECTED,
           BOOKING_ASSIGNED, BOOKING_VERIFIED, BOOKING_CANCELLED)
message (String, 500)
isRead (boolean, default false)
referenceId (Long) — e.g. appointmentId, videoCallRequestId
referenceType (String) — e.g. "APPOINTMENT", "VIDEO_CALL"
referenceUrl (String) — frontend path to navigate to on click
createdAt (LocalDateTime)
```

**New files:**
| File | Purpose |
|------|---------|
| `repository/NotificationRepository.java` | findByRecipientUserIdOrderByCreatedAtDesc, countByRecipientUserIdAndIsRead |
| `service/NotificationService.java` | create(), markAsRead(), markAllAsRead(), getForUser(), countUnread() |
| `controller/NotificationController.java` | REST endpoints |

**REST Endpoints:**
- `GET /api/notifications` — paginated list for authenticated user (reads userId from JWT)
- `GET /api/notifications/unread-count` — returns `{ count: 3 }`
- `PUT /api/notifications/{id}/read` — mark one as read
- `PUT /api/notifications/read-all` — mark all as read for user

**WebSocket integration:**
Uses existing `SimpMessagingTemplate`. In `NotificationService.create()`:
```java
messagingTemplate.convertAndSend("/topic/notifications/" + notification.getRecipientUserId(), notification);
```

**Hooks into existing services:**
- `AppointmentServiceImpl.updateAppointmentStatus()` → notify patient on CONFIRMED/CANCELLED/COMPLETED
- `VideoCallRequestService` → notify doctor on new PENDING request, notify patient on ACCEPTED/REJECTED
- `ConsultationBookingService` → notify patient on DOCTOR_ASSIGNED, CONFIRMED, CANCELLED

### Frontend

**Navbar notification bell:**
- Badge showing unread count (red dot if > 0)
- Dropdown panel: list of 10 most recent notifications, each showing type icon + message + time ago
- Click → mark as read + navigate to `referenceUrl`
- "Mark all read" button

**WebSocket subscription in `NotificationContext.tsx`:**
```typescript
// Subscribe to /topic/notifications/{userId}
// On receive: increment unread count, prepend to list, show toast
```

---

## Phase 3: Appointment Slot Calendar + Conflict Prevention

### Problem
The current AppointmentForm lets users pick any date/time freely. No check against DoctorAvailability. Double-booking is possible.

### Backend

**New endpoint:** `GET /api/doctors/{doctorId}/available-slots?date=2026-06-05`

Logic:
1. Parse date → get day of week (e.g. WEDNESDAY)
2. Find `DoctorAvailability` records for that doctor + day
3. Generate all possible slots (start → end, step = slotDurationMinutes)
4. Load existing `Appointment` records for that doctor + date with status NOT CANCELLED
5. Subtract occupied slots
6. Return `List<SlotDTO>{ time, available, consultationType }`

**Conflict prevention in `AppointmentServiceImpl.createAppointment()`:**
Before saving, query: `existsByDoctorAndAppointmentDateAndAppointmentTimeAndStatusNot(doctor, date, time, CANCELLED)`. If exists → throw `ValidationException("Slot already booked")`.

**New `AppointmentRepository` query:**
```java
boolean existsByDoctorAndAppointmentDateAndAppointmentTimeAndStatusNot(Doctor d, LocalDate date, LocalTime time, AppointmentStatus status);
```

### Frontend

**Updated `AppointmentForm.tsx`:**
1. Doctor info + date picker (existing)
2. On date select → fetch `/api/doctors/{id}/available-slots?date=...`
3. Render slot grid: available slots = clickable green cards, booked = greyed out
4. Confirm → submit appointment with selected slot

---

## Phase 4: Patient Health Metrics + Medical History Timeline

### Problem
BMI calculator exists in the Tools page but nothing is persisted. Patients have no longitudinal health data. Medical history is fragmented across appointments, prescriptions, and reports with no unified view.

### Backend

**New `HealthMetric` entity:**
```
id, patient (FK), type (ENUM: WEIGHT_KG, BLOOD_PRESSURE_SYSTOLIC, BLOOD_PRESSURE_DIASTOLIC,
BLOOD_SUGAR_MGDL, HEART_RATE_BPM, BMI, TEMPERATURE_C), value (Double), unit (String),
notes (String, 500), recordedAt (LocalDateTime)
```

**New files:**
| File | Purpose |
|------|---------|
| `repository/HealthMetricRepository.java` | findByPatientAndTypeOrderByRecordedAtDesc, findByPatientAndRecordedAtBetween |
| `service/HealthMetricService.java` | logMetric(), getMetricsForPatient(), getLatestByType() |
| `controller/HealthMetricController.java` | REST endpoints |

**REST Endpoints:**
- `POST /api/patients/{id}/health-metrics` — log a new reading
- `GET /api/patients/{id}/health-metrics?type=WEIGHT_KG&from=2026-01-01&to=2026-06-02` — filtered history
- `GET /api/patients/{id}/health-metrics/latest` — latest reading per type (for dashboard summary)
- `GET /api/patients/{id}/medical-history` — aggregated timeline

**Medical history aggregation** (`GET /api/patients/{id}/medical-history`):
Returns a unified list sorted by date descending:
```json
[
  { "date": "2026-05-30", "type": "APPOINTMENT", "title": "Cardiology - Dr. Khan", "status": "COMPLETED", "id": 12 },
  { "date": "2026-05-28", "type": "PRESCRIPTION", "title": "Prescription by Dr. Khan", "id": 5 },
  { "date": "2026-05-20", "type": "REPORT", "title": "Blood Test Report", "id": 3 },
  { "date": "2026-05-15", "type": "HEALTH_METRIC", "title": "Weight: 72.5 kg", "id": 8 }
]
```

### Frontend

**New "Health" tab in `PatientDashboard.tsx`:**
- Log form: select metric type → enter value → submit
- Per-type trend section: Recharts `<LineChart>` with last 30 readings
- Latest readings summary cards (weight, BP, blood sugar, heart rate)

**New "History" tab in `PatientDashboard.tsx`:**
- Chronological timeline list
- Each item has a type icon + title + date + link to the full detail

---

## Phase 5: Doctor Earnings + Analytics

### Problem
The Doctor Dashboard shows `earnings: 0` because it's hardcoded. No earning records are persisted when appointments complete or video calls end.

### Backend

**New `DoctorEarning` entity:**
```
id, doctor (FK), sourceType (ENUM: APPOINTMENT, VIDEO_CALL), sourceId (Long),
amount (Double), earnedAt (LocalDateTime), status (ENUM: PENDING, SETTLED),
notes (String)
```

**Triggered by:**
- `AppointmentServiceImpl.updateAppointmentStatus()` when status → COMPLETED: create `DoctorEarning` with `amount = doctor.consultationFee`
- `VideoCallRequestService` when status → COMPLETED: create `DoctorEarning` with `amount = callCost`

**New files:**
| File | Purpose |
|------|---------|
| `repository/DoctorEarningRepository.java` | findByDoctorAndEarnedAtBetween, sumByDoctor |
| `service/DoctorEarningService.java` | recordEarning(), getEarningsSummary(), getEarningsList() |
| `controller/DoctorEarningController.java` | REST endpoints |

**REST Endpoints:**
- `GET /api/doctors/{id}/earnings?month=6&year=2026` — paginated list
- `GET /api/doctors/{id}/earnings/summary?month=6&year=2026` → `{ totalEarned, appointmentEarnings, videoCallEarnings, appointmentCount, videoCallCount }`
- `GET /api/doctors/{id}/analytics` → `{ appointmentsByType, peakHours, patientReturnRate, weeklyEarnings[] }`

**Analytics computation:**
- `appointmentsByType`: count CLINIC/VIDEO/HOME_VISIT for the month
- `peakHours`: group appointments by hour-of-day, return top 3
- `weeklyEarnings`: sum earnings per week-of-month (4 data points for chart)

### Frontend

**New "Earnings" tab in `DoctorDashboard.tsx`:**
- Month/year selector
- Summary cards: Total Earned, Appointment Earnings, Video Call Earnings, Session Count
- BarChart (weekly earnings breakdown)
- Earnings list table (date, type, patient, amount)

**New "Analytics" tab in `DoctorDashboard.tsx`:**
- Appointment type donut chart (Clinic / Video / Home Visit)
- Peak hours bar chart
- Patient return rate metric

---

## Data Flow Summary

```
Patient books appointment
  → AppointmentController.createAppointment()
  → AppointmentServiceImpl.createAppointment()
     → conflict check (throws if slot taken)
     → save appointment
  
Doctor confirms appointment  
  → AppointmentServiceImpl.updateStatus(CONFIRMED)
     → NotificationService.create(patient.userId, APPOINTMENT_CONFIRMED, ...)
        → NotificationRepository.save()
        → SimpMessagingTemplate.broadcast("/topic/notifications/{patientUserId}")
           → PatientDashboard bell updates in real time

Appointment completed
  → AppointmentServiceImpl.updateStatus(COMPLETED)
     → NotificationService.create(patient, APPOINTMENT_COMPLETED)
     → DoctorEarningService.recordEarning(doctor, APPOINTMENT, fee)
```

---

## Tech Stack Additions

| Library | Purpose |
|---------|---------|
| `spring-boot-starter-security` | Security filter chain |
| `jjwt-api 0.12.6` + impl + jackson | JWT generation/validation |
| `recharts` (npm) | Health metrics + earnings charts on frontend |

---

## Database Migrations

New tables required (via Hibernate DDL auto or manual migration):
- `notifications`
- `health_metrics`
- `doctor_earnings`

---

## Out of Scope

- Email/SMS notifications (Spring Mail) — deferred to next iteration
- Payment gateway integration (real money) — wallet simulation stays
- Mobile app
