# QUICK REFERENCE GUIDE

## 🎯 What Was Done

### Backend Improvements (10 New Files + 2 Refactored)

#### Exception Handling
```
New Package: com.sehat24x7.exception
├── ApiException              → Custom base exception
├── ResourceNotFoundException → 404 errors
├── ValidationException       → Input validation errors
└── GlobalExceptionHandler    → Automatic error handling
```

#### Standard Response Wrapper
```
New Class: ApiResponse<T>
├── Factory methods: success(), error()
├── Version tracking
├── Timestamp included
└── Consistent format across all APIs
```

#### Utilities
```
ValidationUtil            DoctorManagementService
├── Email validation      ├── Paginated queries
├── Phone validation      ├── Search functionality
├── String validation     ├── Specialization filter
└── Input sanitization    └── Top-rated doctors

CommonUtil
├── OTP generation
├── Reference generation
└── File utilities
```

#### Enhanced Services
```
ConsultationBookingService (Refactored)
├── Comprehensive validation
├── Better error handling
├── Structured logging
└── Transaction management

DoctorManagementService (NEW)
├── Pagination support
├── Search & filtering
├── Ranking/sorting
└── Availability checking
```

#### New API Endpoints (v2)
```
/api/doctors/v2              → Paginated list
/api/doctors/v2/{id}         → Get by ID
/api/doctors/v2/search       → Search by name
/api/doctors/v2/online       → Online doctors
/api/doctors/v2/top-rated    → Top-rated list
/api/doctors/v2/available    → Available now
```

### Frontend Modernization (7 New Files)

#### Design System (design-system.css)
```
Colors          Typography      Components
├── Primary     ├── 5 sizes     ├── Buttons (6 types)
├── Secondary   ├── 5 weights   ├── Forms
├── Accent      ├── Line heights├── Cards
├── Neutral     └── Contrast    ├── Alerts
└── Semantic                     ├── Badges
                                 └── Animations
```

#### Modern Components
```
ConsultationBookingFormModern.tsx
├── Step indicators
├── Form validation
├── OTP verification
├── Success page
└── Error handling

HomeModern.tsx
├── Hero section
├── Feature cards
├── Specializations
└── CTA sections

NavbarModern.tsx
├── Logo branding
├── Nav links
├── Auth buttons
└── Mobile menu
```

#### CSS Files
```
design-system.css       500+ lines (complete system)
consultation-modern.css 400+ lines (form styling)
home-modern.css         350+ lines (home styling)
navbar-modern.css       250+ lines (nav styling)
```

---

## 📊 API Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* your data */ },
  "timestamp": 1234567890,
  "version": "1.0"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errorCode": "ERROR_CODE",
  "errors": { "field": "error" },
  "timestamp": 1234567890
}
```

### Paginated Response
```json
{
  "content": [...],
  "pageNumber": 0,
  "pageSize": 10,
  "totalElements": 100,
  "totalPages": 10,
  "hasNext": true,
  "hasPrevious": false
}
```

---

## 🎨 Design System Colors

### Primary Shades
```
--primary-50:  #f0f4ff
--primary-600: #3b47b3 (Main)
--primary-700: #2d3992 (Dark)
--primary-900: #1a2256 (Darkest)
```

### Secondary (Green)
```
--secondary-500: #22c55e (Main)
--secondary-600: #16a34a
--secondary-700: #15803d
```

### Accent (Purple)
```
--accent-500: #d946ef (Main)
--accent-600: #c026d3
--accent-700: #a21caf
```

### States
```
Success: #22c55e
Warning: #f59e0b
Danger:  #ef4444
Info:    #4f5fd4
```

---

## 🧩 Component Classes

### Buttons
```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-danger">Danger</button>

<!-- Sizes -->
<button class="btn btn-sm">Small</button>
<button class="btn btn-lg">Large</button>
<button class="btn btn-full">Full width</button>
```

### Forms
```html
<div class="form-group">
  <label>Label</label>
  <input type="text" placeholder="Enter text">
</div>

<textarea placeholder="Multi-line"></textarea>

<select>
  <option>Option 1</option>
</select>
```

### Cards
```html
<div class="card">
  <div class="card-header">
    <h2 class="card-title">Title</h2>
  </div>
  <div class="card-body">Content</div>
  <div class="card-footer">Footer</div>
</div>
```

### Alerts
```html
<div class="alert alert-success">Success message</div>
<div class="alert alert-warning">Warning message</div>
<div class="alert alert-danger">Error message</div>
<div class="alert alert-info">Info message</div>
```

### Layout
```html
<div class="container">
  <div class="grid grid-3">
    <div>Column 1</div>
    <div>Column 2</div>
    <div>Column 3</div>
  </div>
</div>

<div class="flex flex-between">
  <span>Left</span>
  <span>Right</span>
</div>
```

---

## 🔧 Validation Rules

### Email
```
Pattern: ^[A-Za-z0-9+_.-]+@(.+)$
Example: user@example.com
```

### Phone Number
```
Pattern: ^[0-9]{10}$
Example: 9876543210
```

### Patient Name
```
- Length: 2-100 characters
- Letters and spaces only
- No special characters
```

### Specialization ID
```
- Required
- Must be positive number
- Must exist in database
```

---

## 🚀 How to Use New Features

### Using the New v2 Doctor API
```bash
# Get all doctors (paginated)
curl http://localhost:8080/api/doctors/v2?page=0&size=10

# Get doctors by specialization
curl http://localhost:8080/api/doctors/v2/specialization/1?page=0&size=10

# Search doctors
curl http://localhost:8080/api/doctors/v2/search?name=John

# Get online doctors
curl http://localhost:8080/api/doctors/v2/online

# Get top-rated (limit 5)
curl http://localhost:8080/api/doctors/v2/top-rated?limit=5

# Get available now
curl http://localhost:8080/api/doctors/v2/available
```

### Using Improved Consultation API
```bash
# Create booking (with validation)
curl -X POST http://localhost:8080/api/consultations/book \
  -H "Content-Type: application/json" \
  -d '{
    "specializationId": 1,
    "patientName": "John Doe",
    "mobileNumber": "9876543210",
    "email": "john@example.com",
    "symptoms": "Fever"
  }'

# Verify OTP
curl -X POST http://localhost:8080/api/consultations/verify \
  -H "Content-Type: application/json" \
  -d '{
    "consultationBookingId": 1,
    "verificationCode": "123456"
  }'
```

---

## 📱 Responsive Breakpoints

```css
Desktop:   > 1024px  (full layout)
Tablet:    768px-1024px (adjusted)
Mobile:    480px-768px (stacked)
Small:     < 480px (minimal)
```

---

## 🎨 CSS Utilities

### Spacing
```
gap-2, gap-4, gap-6, gap-8
margin, padding (use --spacing-x variables)
```

### Flexbox
```
.flex                 (display: flex)
.flex-center          (centered both ways)
.flex-between         (space between)
.flex-col             (flex-direction: column)
```

### Grid
```
.grid                 (display: grid)
.grid-2              (2 columns)
.grid-3              (3 columns)
.grid-4              (4 columns)
```

### Text
```
.text-primary
.text-secondary
.text-tertiary
```

### Animations
```
.animate-fade-in     (fade entrance)
.animate-slide-in    (side entrance)
.animate-pulse       (pulse effect)
.animate-spin        (spinning)
```

---

## 🔐 Security Features

- ✓ Input validation on all fields
- ✓ SQL injection prevention (JPA)
- ✓ XSS prevention (React escaping)
- ✓ CORS configured
- ✓ Proper error messages (no stack traces)
- ✓ Input sanitization

---

## 📝 Code Standards

- Extends BaseService for logging
- Extends BaseController for responses
- Use @Valid for request validation
- Use custom exceptions (not RuntimeException)
- Include JavaDoc comments
- Follow Java naming conventions
- DRY principle throughout

---

## 🔄 Response Flow

```
Request
  ↓
@Valid Annotation (Validation)
  ↓
Validation Exception? → GlobalExceptionHandler → Error Response
  ↓
Service Layer (Business Logic)
  ↓
Business Exception? → GlobalExceptionHandler → Error Response
  ↓
Successful Response → ApiResponse.success() → Client
```

---

## ⚡ Performance Tips

- Use pagination for large lists
- Lazy load related entities
- Cache static data
- Use indexes on frequently queried fields
- Minimize CSS in production
- Lazy load images
- Use CDN for assets

---

**All improvements documented with examples above! Ready for production! 🎉**
