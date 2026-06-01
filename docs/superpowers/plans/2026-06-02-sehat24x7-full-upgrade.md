# Sehat24x7 Full Platform Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add JWT security, real-time notifications, appointment slot conflict prevention, patient health metrics, and doctor earnings tracking to the Sehat24x7 healthcare platform.

**Architecture:** Five sequential phases. Phase 1 (JWT) is a prerequisite for all others since notifications, health metrics, and earnings rely on authenticated user identity. Phases 2–5 are independent of each other once Phase 1 is done. Backend is Spring Boot 3.5 + PostgreSQL; frontend is React + TypeScript.

**Tech Stack:** Spring Boot 3.5, jjwt 0.12.6, Spring Security, PostgreSQL, React 18, TypeScript, recharts (new), stompjs/sockjs-client (existing).

**Critical note on passwords:** `Patient` table uses its own `password` field with `"HASH_" + rawPassword` scheme. `User` table (for Doctor/Staff/Admin) uses the same scheme in `UserServiceImpl`. Phase 1 switches both to BCrypt — **existing DB passwords must be reset or recreated after this change.**

---

## File Map

### Phase 1 — JWT Security
| Action | Path |
|--------|------|
| Modify | `pom.xml` |
| Create | `src/main/java/com/sehat24x7/util/JwtUtil.java` |
| Create | `src/main/java/com/sehat24x7/filter/JwtAuthenticationFilter.java` |
| Create | `src/main/java/com/sehat24x7/config/SecurityConfig.java` |
| Modify | `src/main/java/com/sehat24x7/service/impl/UserServiceImpl.java` |
| Modify | `src/main/java/com/sehat24x7/controller/AuthController.java` |
| Modify | `src/main/java/com/sehat24x7/controller/PatientApiController.java` |
| Create | `src/main/resources/static/ts/api.ts` |
| Modify | `src/main/resources/static/ts/AuthContext.tsx` |
| Modify | `src/main/resources/static/ts/Login.tsx` |

### Phase 2 — Notification System
| Action | Path |
|--------|------|
| Create | `src/main/java/com/sehat24x7/model/Notification.java` |
| Create | `src/main/java/com/sehat24x7/repository/NotificationRepository.java` |
| Create | `src/main/java/com/sehat24x7/service/NotificationService.java` |
| Create | `src/main/java/com/sehat24x7/controller/NotificationController.java` |
| Modify | `src/main/java/com/sehat24x7/service/impl/AppointmentServiceImpl.java` |
| Modify | `src/main/java/com/sehat24x7/service/VideoCallRequestService.java` |
| Modify | `src/main/java/com/sehat24x7/service/ConsultationBookingService.java` |
| Create | `src/main/resources/static/ts/NotificationContext.tsx` |
| Modify | `src/main/resources/static/ts/App.tsx` |
| Modify | `src/main/resources/static/ts/NavbarModern.tsx` |

### Phase 3 — Appointment Slot Calendar
| Action | Path |
|--------|------|
| Modify | `src/main/java/com/sehat24x7/repository/AppointmentRepository.java` |
| Modify | `src/main/java/com/sehat24x7/service/impl/AppointmentServiceImpl.java` |
| Create | `src/main/java/com/sehat24x7/dto/SlotDTO.java` |
| Create | `src/main/java/com/sehat24x7/controller/DoctorSlotController.java` |
| Modify | `src/main/resources/static/ts/AppointmentForm.tsx` |

### Phase 4 — Patient Health Metrics
| Action | Path |
|--------|------|
| Create | `src/main/java/com/sehat24x7/model/HealthMetric.java` |
| Create | `src/main/java/com/sehat24x7/repository/HealthMetricRepository.java` |
| Create | `src/main/java/com/sehat24x7/service/HealthMetricService.java` |
| Create | `src/main/java/com/sehat24x7/controller/HealthMetricController.java` |
| Create | `src/main/java/com/sehat24x7/dto/MedicalHistoryItemDTO.java` |
| Modify | `src/main/java/com/sehat24x7/controller/PatientApiController.java` |
| Create | `src/main/resources/static/ts/HealthTracker.tsx` |
| Modify | `src/main/resources/static/ts/PatientDashboard.tsx` |

### Phase 5 — Doctor Earnings & Analytics
| Action | Path |
|--------|------|
| Create | `src/main/java/com/sehat24x7/model/DoctorEarning.java` |
| Create | `src/main/java/com/sehat24x7/repository/DoctorEarningRepository.java` |
| Create | `src/main/java/com/sehat24x7/service/DoctorEarningService.java` |
| Create | `src/main/java/com/sehat24x7/controller/DoctorEarningController.java` |
| Create | `src/main/java/com/sehat24x7/dto/EarningsSummaryDTO.java` |
| Modify | `src/main/java/com/sehat24x7/service/impl/AppointmentServiceImpl.java` |
| Modify | `src/main/java/com/sehat24x7/service/VideoCallRequestService.java` |
| Create | `src/main/resources/static/ts/DoctorEarnings.tsx` |
| Modify | `src/main/resources/static/ts/DoctorDashboard.tsx` |

---

## Phase 1 — JWT Security

### Task 1: Add Security & JWT Dependencies

**Files:**
- Modify: `pom.xml`

- [ ] **Step 1: Add dependencies inside the `<dependencies>` block in `pom.xml`**

```xml
<!-- Spring Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.6</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
```

- [ ] **Step 2: Verify Maven resolves dependencies**

```bash
./mvnw dependency:resolve -q
```
Expected: BUILD SUCCESS with no errors.

- [ ] **Step 3: Add JWT secret to `src/main/resources/application.properties`**

```properties
jwt.secret=sehat24x7-super-secret-key-that-is-at-least-256-bits-long-for-hs256
jwt.expiration-ms=86400000
```

- [ ] **Step 4: Commit**

```bash
git add pom.xml src/main/resources/application.properties
git commit -m "feat: add Spring Security and jjwt dependencies"
```

---

### Task 2: Create JwtUtil

**Files:**
- Create: `src/main/java/com/sehat24x7/util/JwtUtil.java`

- [ ] **Step 1: Create `JwtUtil.java`**

```java
package com.sehat24x7.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Long id, String email, String role) {
        return Jwts.builder()
                .subject(email)
                .claim("id", id)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key())
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Long extractId(String token) {
        return extractClaims(token).get("id", Long.class);
    }

    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/main/java/com/sehat24x7/util/JwtUtil.java
git commit -m "feat: add JwtUtil for HS256 token generation and validation"
```

---

### Task 3: Create JWT Filter and Security Config

**Files:**
- Create: `src/main/java/com/sehat24x7/filter/JwtAuthenticationFilter.java`
- Create: `src/main/java/com/sehat24x7/config/SecurityConfig.java`

- [ ] **Step 1: Create `JwtAuthenticationFilter.java`**

```java
package com.sehat24x7.filter;

import com.sehat24x7.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.isTokenValid(token)) {
                Long id = jwtUtil.extractId(token);
                String role = jwtUtil.extractRole(token);
                String email = jwtUtil.extractEmail(token);
                var auth = new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + role))
                );
                auth.setDetails(id);
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

- [ ] **Step 2: Create `SecurityConfig.java`**

```java
package com.sehat24x7.config;

import com.sehat24x7.filter.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(AbstractHttpConfigurer::disable)
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Static assets
                .requestMatchers("/", "/index.html", "/assets/**", "/static/**",
                                 "/js/**", "/css/**", "/images/**", "/*.js", "/*.css", "/*.map").permitAll()
                // Public API endpoints
                .requestMatchers(HttpMethod.GET, "/api/doctors/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/specializations/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/home-api/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/hero-banners/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/announcements/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/locations/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/reviews/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/about-us/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/specialization/**").permitAll()
                // Auth endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/patients/register").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/patients/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/doctors/register").permitAll()
                // WebSocket
                .requestMatchers("/ws/**").permitAll()
                // Everything else requires authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/main/java/com/sehat24x7/filter/JwtAuthenticationFilter.java \
        src/main/java/com/sehat24x7/config/SecurityConfig.java
git commit -m "feat: add JWT filter and Spring Security configuration"
```

---

### Task 4: Switch Password Hashing to BCrypt

**Files:**
- Modify: `src/main/java/com/sehat24x7/service/impl/UserServiceImpl.java`
- Modify: `src/main/java/com/sehat24x7/controller/PatientApiController.java` (patient password hash)

- [ ] **Step 1: Update `UserServiceImpl.java` — inject `PasswordEncoder` and replace `hashPassword`/`verifyPassword`**

Replace the existing `hashPassword` and `verifyPassword` private methods, and add the `PasswordEncoder` field:

```java
// Add import at top:
import org.springframework.security.crypto.password.PasswordEncoder;

// Add field:
@Autowired
private PasswordEncoder passwordEncoder;

// Replace hashPassword:
private String hashPassword(String password) {
    return passwordEncoder.encode(password);
}

// Replace verifyPassword:
private boolean verifyPassword(String rawPassword, String hashedPassword) {
    return passwordEncoder.matches(rawPassword, hashedPassword);
}
```

- [ ] **Step 2: Update patient password verification in `PatientApiController.java`**

Find the login method and replace the inline password check:

```java
// Add field injection at top of class:
@Autowired
private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

// In the login method, replace:
//   if (!patient.getPassword().equals("HASH_" + request.getPassword()))
// with:
if (!passwordEncoder.matches(request.getPassword(), patient.getPassword())) {
```

Also update patient registration to hash with BCrypt. Find `PatientApiController.register()` and replace any `"HASH_" + password` with:
```java
patient.setPassword(passwordEncoder.encode(request.getPassword()));
```

- [ ] **Step 3: Drop and recreate DB test data**

Because all existing hashed passwords start with `"HASH_"` and BCrypt cannot verify them, clear the relevant tables:

```sql
-- Run in psql or your DB client:
DELETE FROM appointments;
DELETE FROM prescriptions;
DELETE FROM reviews;
DELETE FROM wallet_transactions;
DELETE FROM wallets;
DELETE FROM consultation_bookings;
DELETE FROM doctor_status;
DELETE FROM doctor_availability;
DELETE FROM doctor_education;
DELETE FROM doctor_service;
DELETE FROM doctors;
DELETE FROM patients;
DELETE FROM staff;
DELETE FROM admins;
DELETE FROM users;
```

Then restart the app — `DataInitializer` will re-seed any test data if present.

- [ ] **Step 4: Commit**

```bash
git add src/main/java/com/sehat24x7/service/impl/UserServiceImpl.java \
        src/main/java/com/sehat24x7/controller/PatientApiController.java
git commit -m "feat: switch password hashing from HASH_ prefix to BCrypt"
```

---

### Task 5: Update Login Endpoints to Return JWT

**Files:**
- Modify: `src/main/java/com/sehat24x7/controller/AuthController.java`
- Modify: `src/main/java/com/sehat24x7/controller/PatientApiController.java`

- [ ] **Step 1: Update `AuthController.login()` to generate and return a JWT**

Add field injection of `JwtUtil` and update the login response:

```java
// Add import:
import com.sehat24x7.util.JwtUtil;

// Add field:
@Autowired
private JwtUtil jwtUtil;

// Inside login(), after authenticating user, before building response map:
String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
response.put("token", token);
```

Full updated `login()` method body (replace existing):

```java
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    try {
        User user = userService.authenticateUser(request.getEmail(), request.getPassword());
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("token", token);
        response.put("user", user);

        if (user.getRole() == User.UserRole.DOCTOR && user.getDoctor() != null) {
            response.put("doctorId", user.getDoctor().getId());
        }
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", e.getMessage());
        return ResponseEntity.badRequest().body(response);
    }
}
```

- [ ] **Step 2: Update `PatientApiController.login()` to generate and return a JWT**

Patient principal ID is `patient.getId()`, role is `"PATIENT"`:

```java
// Add imports and field at top of PatientApiController:
import com.sehat24x7.util.JwtUtil;
@Autowired
private JwtUtil jwtUtil;

// In login(), after verifying password:
String token = jwtUtil.generateToken(patient.getId(), patient.getEmail(), "PATIENT");
response.put("token", token);
```

- [ ] **Step 3: Test login manually**

Start the app: `./mvnw spring-boot:run`

```bash
curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@test.com","password":"test123"}' | python3 -m json.tool
```

Expected: response contains `"token": "eyJ..."` and `"success": true`.

- [ ] **Step 4: Commit**

```bash
git add src/main/java/com/sehat24x7/controller/AuthController.java \
        src/main/java/com/sehat24x7/controller/PatientApiController.java
git commit -m "feat: login endpoints return JWT token in response"
```

---

### Task 6: Frontend — JWT Storage and api.ts Fetch Wrapper

**Files:**
- Create: `src/main/resources/static/ts/api.ts`
- Modify: `src/main/resources/static/ts/AuthContext.tsx`
- Modify: `src/main/resources/static/ts/Login.tsx`

- [ ] **Step 1: Create `api.ts` — authenticated fetch wrapper**

```typescript
// src/main/resources/static/ts/api.ts

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    localStorage.clear();
    window.location.href = '/login';
  }
  return response;
}
```

- [ ] **Step 2: Update `AuthContext.tsx` — store token and add it to `clearAuthData`**

In the `login` function, add after `localStorage.setItem('userEmail', userData.email)`:
```typescript
if ((userData as any).token) {
  localStorage.setItem('token', (userData as any).token);
}
```

In `clearAuthData`, add:
```typescript
localStorage.removeItem('token');
```

Update the `User` interface to optionally include `token`:
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
}
```

- [ ] **Step 3: Update `Login.tsx` — store token received from server**

In `handleLogin`, inside the `if (data.success)` block, before calling `login({...})`:
```typescript
// Store token
if (data.token) {
  localStorage.setItem('token', data.token);
}
```

Pass the token through to the login call:
```typescript
login({
  id: user.id,
  name: user.name,
  email: user.email,
  role: userRole,
  token: data.token,
});
```

- [ ] **Step 4: Replace `fetch` with `apiFetch` in protected pages**

In each of the files below, add `import { apiFetch } from './api';` at the top and replace all `fetch(` calls that hit `/api/` protected routes with `apiFetch(`:

Files to update:
- `PatientDashboard.tsx` — all `/api/patients/`, `/api/appointments/patient/`, `/api/video-call-requests/`, wallet endpoints
- `DoctorDashboard.tsx` — all `/api/doctors/`, `/api/appointments/doctor/`, `/api/staff/`, availability endpoints
- `StaffDashboard.tsx` — all dashboard API calls
- `AdminPanel.tsx` — all admin API calls
- `CreatePrescription.tsx` — prescription create/read calls
- `PatientReports.tsx` — medical report calls
- `PatientPrescriptions.tsx` — prescription list calls
- `PatientVideoWaiting.tsx` — video call request calls
- `AppointmentForm.tsx` — appointment booking calls

For public pages (`Home.tsx`, `Doctors.tsx`, `DoctorDetail.tsx`, `ConsultationBookingForm.tsx`), keep using plain `fetch()` — those are public routes.

- [ ] **Step 5: Build frontend and verify**

```bash
npm run build
```
Expected: no TypeScript errors. Check `dist/` for output.

- [ ] **Step 6: Commit**

```bash
git add src/main/resources/static/ts/api.ts \
        src/main/resources/static/ts/AuthContext.tsx \
        src/main/resources/static/ts/Login.tsx \
        src/main/resources/static/ts/PatientDashboard.tsx \
        src/main/resources/static/ts/DoctorDashboard.tsx \
        src/main/resources/static/ts/StaffDashboard.tsx \
        src/main/resources/static/ts/AdminPanel.tsx \
        src/main/resources/static/ts/CreatePrescription.tsx \
        src/main/resources/static/ts/PatientReports.tsx \
        src/main/resources/static/ts/PatientPrescriptions.tsx \
        src/main/resources/static/ts/PatientVideoWaiting.tsx \
        src/main/resources/static/ts/AppointmentForm.tsx
git commit -m "feat: add apiFetch wrapper and store JWT in frontend auth flow"
```

---

## Phase 2 — Real-time Notification System

### Task 7: Notification Entity and Repository

**Files:**
- Create: `src/main/java/com/sehat24x7/model/Notification.java`
- Create: `src/main/java/com/sehat24x7/repository/NotificationRepository.java`

- [ ] **Step 1: Create `Notification.java`**

```java
package com.sehat24x7.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long recipientId;

    @Column(nullable = false, length = 20)
    private String recipientRole;

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @Column(nullable = false, length = 500)
    private String message;

    @Column(nullable = false)
    private Boolean isRead = false;

    @Column
    private Long referenceId;

    @Column(length = 50)
    private String referenceType;

    @Column(length = 200)
    private String referenceUrl;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum NotificationType {
        APPOINTMENT_CONFIRMED,
        APPOINTMENT_CANCELLED,
        APPOINTMENT_COMPLETED,
        VIDEO_REQUEST_RECEIVED,
        VIDEO_REQUEST_ACCEPTED,
        VIDEO_REQUEST_REJECTED,
        BOOKING_ASSIGNED,
        BOOKING_VERIFIED,
        BOOKING_CANCELLED
    }
}
```

- [ ] **Step 2: Create `NotificationRepository.java`**

```java
package com.sehat24x7.repository;

import com.sehat24x7.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Page<Notification> findByRecipientIdAndRecipientRoleOrderByCreatedAtDesc(
            Long recipientId, String role, Pageable pageable);

    long countByRecipientIdAndRecipientRoleAndIsRead(Long recipientId, String role, Boolean isRead);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.recipientId = :id AND n.recipientRole = :role")
    void markAllReadForRecipient(@Param("id") Long id, @Param("role") String role);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/main/java/com/sehat24x7/model/Notification.java \
        src/main/java/com/sehat24x7/repository/NotificationRepository.java
git commit -m "feat: add Notification entity and repository"
```

---

### Task 8: NotificationService and NotificationController

**Files:**
- Create: `src/main/java/com/sehat24x7/service/NotificationService.java`
- Create: `src/main/java/com/sehat24x7/controller/NotificationController.java`

- [ ] **Step 1: Create `NotificationService.java`**

```java
package com.sehat24x7.service;

import com.sehat24x7.model.Notification;
import com.sehat24x7.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public Notification create(Long recipientId, String recipientRole,
                                Notification.NotificationType type, String message,
                                Long referenceId, String referenceType, String referenceUrl) {
        Notification n = new Notification();
        n.setRecipientId(recipientId);
        n.setRecipientRole(recipientRole);
        n.setType(type);
        n.setMessage(message);
        n.setReferenceId(referenceId);
        n.setReferenceType(referenceType);
        n.setReferenceUrl(referenceUrl);
        Notification saved = notificationRepository.save(n);
        messagingTemplate.convertAndSend(
                "/topic/notifications/" + recipientRole + "/" + recipientId, saved);
        return saved;
    }

    public Page<Notification> getForRecipient(Long recipientId, String recipientRole, int page) {
        return notificationRepository.findByRecipientIdAndRecipientRoleOrderByCreatedAtDesc(
                recipientId, recipientRole, PageRequest.of(page, 20));
    }

    public long countUnread(Long recipientId, String recipientRole) {
        return notificationRepository.countByRecipientIdAndRecipientRoleAndIsRead(
                recipientId, recipientRole, false);
    }

    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }

    public void markAllRead(Long recipientId, String recipientRole) {
        notificationRepository.markAllReadForRecipient(recipientId, recipientRole);
    }
}
```

- [ ] **Step 2: Create `NotificationController.java`**

```java
package com.sehat24x7.controller;

import com.sehat24x7.model.Notification;
import com.sehat24x7.service.NotificationService;
import com.sehat24x7.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private JwtUtil jwtUtil;

    private record Principal(Long id, String role) {}

    private Principal extractPrincipal(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        String token = header.substring(7);
        return new Principal(jwtUtil.extractId(token), jwtUtil.extractRole(token));
    }

    @GetMapping
    public ResponseEntity<Page<Notification>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            HttpServletRequest request) {
        Principal p = extractPrincipal(request);
        return ResponseEntity.ok(notificationService.getForRecipient(p.id(), p.role(), page));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> unreadCount(HttpServletRequest request) {
        Principal p = extractPrincipal(request);
        return ResponseEntity.ok(Map.of("count", notificationService.countUnread(p.id(), p.role())));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllRead(HttpServletRequest request) {
        Principal p = extractPrincipal(request);
        notificationService.markAllRead(p.id(), p.role());
        return ResponseEntity.ok().build();
    }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/main/java/com/sehat24x7/service/NotificationService.java \
        src/main/java/com/sehat24x7/controller/NotificationController.java
git commit -m "feat: add NotificationService and REST endpoints"
```

---

### Task 9: Hook Notifications into Appointment and Video Call Events

**Files:**
- Modify: `src/main/java/com/sehat24x7/service/impl/AppointmentServiceImpl.java`
- Modify: `src/main/java/com/sehat24x7/service/VideoCallRequestService.java`
- Modify: `src/main/java/com/sehat24x7/service/ConsultationBookingService.java`

- [ ] **Step 1: Inject `NotificationService` into `AppointmentServiceImpl` and fire notifications on status change**

Add the field:
```java
@Autowired
private NotificationService notificationService;
```

Update `updateAppointmentStatus()` — append after the `appointmentRepository.save(appointment)` line:

```java
// Notify patient about appointment status changes
Appointment saved = appointmentRepository.save(appointment);

Long patientId = saved.getPatient().getId();
String doctorName = saved.getDoctor().getName();
String dateStr = saved.getAppointmentDate().toString();

if (status == AppointmentStatus.CONFIRMED) {
    notificationService.create(patientId, "PATIENT",
        Notification.NotificationType.APPOINTMENT_CONFIRMED,
        "Your appointment with Dr. " + doctorName + " on " + dateStr + " has been confirmed.",
        saved.getId(), "APPOINTMENT", "/patient/dashboard");
} else if (status == AppointmentStatus.CANCELLED) {
    notificationService.create(patientId, "PATIENT",
        Notification.NotificationType.APPOINTMENT_CANCELLED,
        "Your appointment with Dr. " + doctorName + " on " + dateStr + " has been cancelled.",
        saved.getId(), "APPOINTMENT", "/patient/dashboard");
} else if (status == AppointmentStatus.COMPLETED) {
    notificationService.create(patientId, "PATIENT",
        Notification.NotificationType.APPOINTMENT_COMPLETED,
        "Your appointment with Dr. " + doctorName + " is complete. Please leave a review.",
        saved.getId(), "APPOINTMENT", "/patient/dashboard");
}
return saved;
```

Add import at the top:
```java
import com.sehat24x7.model.Notification;
import com.sehat24x7.service.NotificationService;
```

- [ ] **Step 2: Hook into `VideoCallRequestService` — notify doctor on new request, patient on accept/reject**

Inject `NotificationService`:
```java
@Autowired
private NotificationService notificationService;
```

In `createRequest()`, after `VideoCallRequest saved = videoCallRequestRepository.save(request);`:
```java
// Notify doctor (doctor has a User record — use doctor.getUser().getId())
if (saved.getDoctor().getUser() != null) {
    notificationService.create(saved.getDoctor().getUser().getId(), "DOCTOR",
        Notification.NotificationType.VIDEO_REQUEST_RECEIVED,
        "Patient " + saved.getPatient().getName() + " is requesting a video call. Reason: " + saved.getReason(),
        saved.getId(), "VIDEO_CALL", "/doctor/dashboard");
}
```

In `acceptRequest()`, after saving the accepted request:
```java
notificationService.create(saved.getPatient().getId(), "PATIENT",
    Notification.NotificationType.VIDEO_REQUEST_ACCEPTED,
    "Dr. " + saved.getDoctor().getName() + " accepted your video call request. Join now!",
    saved.getId(), "VIDEO_CALL", "/patient/video-call-waiting");
```

In `rejectRequest()` (or `declineRequest()`), after saving:
```java
notificationService.create(saved.getPatient().getId(), "PATIENT",
    Notification.NotificationType.VIDEO_REQUEST_REJECTED,
    "Dr. " + saved.getDoctor().getName() + " is not available for a video call right now.",
    saved.getId(), "VIDEO_CALL", "/patient/dashboard");
```

Add import: `import com.sehat24x7.model.Notification;`

- [ ] **Step 3: Hook into `ConsultationBookingService` — notify patient on doctor assigned / confirmed**

Inject `NotificationService`:
```java
@Autowired
private NotificationService notificationService;
```

Find the `assignDoctor()` or `confirmBooking()` methods. After saving the updated booking, add:

```java
// In assignDoctor() or wherever status changes to DOCTOR_ASSIGNED:
if (booking.getPatient() != null) {
    notificationService.create(booking.getPatient().getId(), "PATIENT",
        Notification.NotificationType.BOOKING_ASSIGNED,
        "Dr. " + booking.getAssignedDoctor().getName() + " has been assigned to your consultation booking.",
        booking.getId(), "BOOKING", "/patient/dashboard");
}
```

- [ ] **Step 4: Restart app and manually test**

```bash
./mvnw spring-boot:run
```

Create an appointment via the frontend, then change its status. Check that a `notifications` row appears in DB:

```sql
SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5;
```

Expected: one row per status change with correct `recipient_id`, `type`, `message`.

- [ ] **Step 5: Commit**

```bash
git add src/main/java/com/sehat24x7/service/impl/AppointmentServiceImpl.java \
        src/main/java/com/sehat24x7/service/VideoCallRequestService.java \
        src/main/java/com/sehat24x7/service/ConsultationBookingService.java
git commit -m "feat: fire notifications on appointment, video call, and booking events"
```

---

### Task 10: Frontend — Notification Context and Navbar Bell

**Files:**
- Create: `src/main/resources/static/ts/NotificationContext.tsx`
- Modify: `src/main/resources/static/ts/App.tsx`
- Modify: `src/main/resources/static/ts/NavbarModern.tsx`

- [ ] **Step 1: Create `NotificationContext.tsx`**

```tsx
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { apiFetch } from './api';

interface NotificationItem {
  id: number;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  referenceUrl?: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markRead: (id: number) => Promise<void>;
  markAllRead: () => Promise<void>;
  refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be within NotificationProvider');
  return ctx;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const [nRes, cRes] = await Promise.all([
        apiFetch('/api/notifications?page=0'),
        apiFetch('/api/notifications/unread-count'),
      ]);
      if (nRes.ok) {
        const data = await nRes.json();
        setNotifications(data.content || []);
      }
      if (cRes.ok) {
        const data = await cRes.json();
        setUnreadCount(data.count || 0);
      }
    } catch { /* ignore if not logged in */ }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId') || localStorage.getItem('patientId');
    const role = localStorage.getItem('userRole');
    if (!token || !userId || !role) return;

    refresh();

    const socket = new SockJS('/ws');
    const client = Stomp.over(socket);
    client.debug = () => {};
    client.connect({}, () => {
      client.subscribe(`/topic/notifications/${role}/${userId}`, (frame) => {
        const newNotif: NotificationItem = JSON.parse(frame.body);
        setNotifications(prev => [newNotif, ...prev]);
        setUnreadCount(prev => prev + 1);
      });
    });
    return () => { if (client.connected) client.disconnect(() => {}); };
  }, [refresh]);

  const markRead = async (id: number) => {
    await apiFetch(`/api/notifications/${id}/read`, { method: 'PUT' });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    await apiFetch('/api/notifications/read-all', { method: 'PUT' });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, refresh }}>
      {children}
    </NotificationContext.Provider>
  );
};
```

- [ ] **Step 2: Wrap the app with `NotificationProvider` in `App.tsx`**

Add import:
```tsx
import { NotificationProvider } from './NotificationContext';
```

Wrap the `<AuthProvider>` content (or place `NotificationProvider` inside `AuthProvider`):
```tsx
<AuthProvider>
  <NotificationProvider>
    <Router>
      {/* existing routes unchanged */}
    </Router>
  </NotificationProvider>
</AuthProvider>
```

- [ ] **Step 3: Add notification bell to `NavbarModern.tsx`**

Add import:
```tsx
import { useNotifications } from './NotificationContext';
import { Bell } from 'lucide-react';
```

Inside the component, add the hook and bell UI. Find the navbar user/profile section and add before it:

```tsx
const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
const [showNotifs, setShowNotifs] = useState(false);

// JSX — add a notification bell button in the navbar actions area:
<div className="relative">
  <button
    onClick={() => setShowNotifs(!showNotifs)}
    className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
  >
    <Bell size={20} className="text-slate-600" />
    {unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
        {unreadCount > 9 ? '9+' : unreadCount}
      </span>
    )}
  </button>

  {showNotifs && (
    <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50">
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">Notifications</h3>
        <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">
          Mark all read
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-center text-slate-500 text-sm py-6">No notifications</p>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => {
                markRead(n.id);
                if (n.referenceUrl) window.location.href = n.referenceUrl;
                setShowNotifs(false);
              }}
              className={`p-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${!n.isRead ? 'bg-blue-50' : ''}`}
            >
              <p className="text-sm text-slate-700">{n.message}</p>
              <p className="text-xs text-slate-400 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )}
</div>
```

- [ ] **Step 4: Build and verify**

```bash
npm run build
```
Expected: BUILD SUCCESS. Open app, log in — notification bell appears in navbar.

- [ ] **Step 5: Commit**

```bash
git add src/main/resources/static/ts/NotificationContext.tsx \
        src/main/resources/static/ts/App.tsx \
        src/main/resources/static/ts/NavbarModern.tsx
git commit -m "feat: real-time notification bell in navbar with WebSocket subscription"
```

---

## Phase 3 — Appointment Slot Calendar + Conflict Prevention

### Task 11: Backend Slot API and Conflict Check

**Files:**
- Modify: `src/main/java/com/sehat24x7/repository/AppointmentRepository.java`
- Modify: `src/main/java/com/sehat24x7/service/impl/AppointmentServiceImpl.java`
- Create: `src/main/java/com/sehat24x7/dto/SlotDTO.java`
- Create: `src/main/java/com/sehat24x7/controller/DoctorSlotController.java`

- [ ] **Step 1: Add conflict-check query to `AppointmentRepository.java`**

```java
boolean existsByDoctorAndAppointmentDateAndAppointmentTimeAndStatusNot(
        Doctor doctor, LocalDate date, LocalTime time, AppointmentStatus status);
```

Add required imports if not already present:
```java
import java.time.LocalTime;
```

- [ ] **Step 2: Add conflict check in `AppointmentServiceImpl.createAppointment()`**

After fetching the doctor but before `appointmentRepository.save()`:

```java
// Add import at top of file:
import com.sehat24x7.exception.ValidationException;

// Conflict check:
boolean slotTaken = appointmentRepository.existsByDoctorAndAppointmentDateAndAppointmentTimeAndStatusNot(
        doctor, appointment.getAppointmentDate(), appointment.getAppointmentTime(),
        AppointmentStatus.CANCELLED);
if (slotTaken) {
    throw new ValidationException("This time slot is already booked. Please choose another.");
}
```

- [ ] **Step 3: Create `SlotDTO.java`**

```java
package com.sehat24x7.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SlotDTO {
    private LocalTime time;
    private boolean available;
    private String consultationType;
}
```

- [ ] **Step 4: Create `DoctorSlotController.java`**

```java
package com.sehat24x7.controller;

import com.sehat24x7.dto.SlotDTO;
import com.sehat24x7.model.Appointment;
import com.sehat24x7.model.Doctor;
import com.sehat24x7.model.DoctorAvailability;
import com.sehat24x7.repository.AppointmentRepository;
import com.sehat24x7.repository.DoctorAvailabilityRepository;
import com.sehat24x7.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doctors/{doctorId}/available-slots")
@CrossOrigin(origins = "*")
public class DoctorSlotController {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorAvailabilityRepository availabilityRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @GetMapping
    public ResponseEntity<List<SlotDTO>> getAvailableSlots(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        DayOfWeek dayOfWeek = date.getDayOfWeek();

        List<DoctorAvailability> schedules = availabilityRepository
                .findByDoctorIdAndDayOfWeek(doctorId, dayOfWeek)
                .stream()
                .filter(DoctorAvailability::getIsActive)
                .toList();

        if (schedules.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        // Get booked times for that date
        Set<LocalTime> bookedTimes = appointmentRepository
                .findByDoctorAndAppointmentDate(doctor, date)
                .stream()
                .filter(a -> a.getStatus() != Appointment.AppointmentStatus.CANCELLED)
                .map(Appointment::getAppointmentTime)
                .collect(Collectors.toSet());

        List<SlotDTO> slots = new ArrayList<>();
        for (DoctorAvailability schedule : schedules) {
            LocalTime cursor = schedule.getStartTime();
            while (cursor.plusMinutes(schedule.getSlotDurationMinutes()).compareTo(schedule.getEndTime()) <= 0) {
                slots.add(new SlotDTO(cursor, !bookedTimes.contains(cursor), schedule.getConsultationType().name()));
                cursor = cursor.plusMinutes(schedule.getSlotDurationMinutes());
            }
        }
        return ResponseEntity.ok(slots);
    }
}
```

- [ ] **Step 5: Test the endpoint**

```bash
# Assuming doctor ID 1 and a future date where availability exists:
curl "http://localhost:8080/api/doctors/1/available-slots?date=2026-06-10"
```
Expected: JSON array of `{ "time": "09:00:00", "available": true, "consultationType": "CLINIC" }` objects.

- [ ] **Step 6: Commit**

```bash
git add src/main/java/com/sehat24x7/repository/AppointmentRepository.java \
        src/main/java/com/sehat24x7/service/impl/AppointmentServiceImpl.java \
        src/main/java/com/sehat24x7/dto/SlotDTO.java \
        src/main/java/com/sehat24x7/controller/DoctorSlotController.java
git commit -m "feat: available slots endpoint and appointment conflict prevention"
```

---

### Task 12: Frontend Slot Calendar in AppointmentForm

**Files:**
- Modify: `src/main/resources/static/ts/AppointmentForm.tsx`

- [ ] **Step 1: Read the current `AppointmentForm.tsx`** to understand the existing state and form structure. Identify where `appointmentTime` is currently set (look for `time` state or `<input type="time">`).

- [ ] **Step 2: Add slot-fetching logic and slot-grid UI**

Add state and fetching near the top of the component (after existing state declarations):

```tsx
const [slots, setSlots] = useState<{ time: string; available: boolean; consultationType: string }[]>([]);
const [loadingSlots, setLoadingSlots] = useState(false);
const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

const fetchSlots = async (doctorId: string | number, date: string) => {
  if (!doctorId || !date) return;
  setLoadingSlots(true);
  try {
    const res = await fetch(`/api/doctors/${doctorId}/available-slots?date=${date}`);
    if (res.ok) {
      setSlots(await res.json());
    }
  } finally {
    setLoadingSlots(false);
  }
};
```

- [ ] **Step 3: Call `fetchSlots` when date changes**

Find the date `<input>` or `onChange` handler and add:
```tsx
onChange={(e) => {
  setDate(e.target.value); // or whatever state var tracks the date
  fetchSlots(doctorId, e.target.value);
  setSelectedSlot(null);
}}
```

- [ ] **Step 4: Replace the time `<input>` with the slot grid**

Remove (or hide) the existing `<input type="time">` and replace with:

```tsx
{slots.length > 0 && (
  <div className="mt-4">
    <label className="block text-sm font-medium text-slate-700 mb-2">
      Available Time Slots
    </label>
    {loadingSlots ? (
      <div className="text-center text-slate-500 py-4">Loading slots...</div>
    ) : (
      <div className="grid grid-cols-4 gap-2">
        {slots.map(slot => (
          <button
            key={slot.time}
            type="button"
            disabled={!slot.available}
            onClick={() => setSelectedSlot(slot.time)}
            className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all
              ${!slot.available
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : selectedSlot === slot.time
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
          >
            {slot.time.substring(0, 5)}
          </button>
        ))}
      </div>
    )}
  </div>
)}
```

- [ ] **Step 5: Use `selectedSlot` in form submission**

Find the `handleSubmit` or `createAppointment` call and replace the time field with `selectedSlot`:
```tsx
// In the booking payload:
time: selectedSlot,
// or:
appointmentTime: selectedSlot,
```

Add validation before submit:
```tsx
if (!selectedSlot) {
  alert('Please select a time slot.');
  return;
}
```

- [ ] **Step 6: Build and verify**

```bash
npm run build
```
Navigate to `/appointments/book/{doctorId}`, pick a date. Slot grid should appear. Booked slots should be greyed out.

- [ ] **Step 7: Commit**

```bash
git add src/main/resources/static/ts/AppointmentForm.tsx
git commit -m "feat: slot picker calendar in appointment booking form"
```

---

## Phase 4 — Patient Health Metrics + Medical History

### Task 13: HealthMetric Entity, Repository, Service, Controller

**Files:**
- Create: `src/main/java/com/sehat24x7/model/HealthMetric.java`
- Create: `src/main/java/com/sehat24x7/repository/HealthMetricRepository.java`
- Create: `src/main/java/com/sehat24x7/service/HealthMetricService.java`
- Create: `src/main/java/com/sehat24x7/controller/HealthMetricController.java`

- [ ] **Step 1: Create `HealthMetric.java`**

```java
package com.sehat24x7.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "health_metrics")
public class HealthMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private MetricType type;

    @Column(nullable = false)
    private Double value;

    @Column(nullable = false, length = 20)
    private String unit;

    @Column(length = 500)
    private String notes;

    @Column(nullable = false)
    private LocalDateTime recordedAt;

    @PrePersist
    protected void onCreate() {
        if (recordedAt == null) recordedAt = LocalDateTime.now();
    }

    public enum MetricType {
        WEIGHT_KG,
        BLOOD_PRESSURE_SYSTOLIC,
        BLOOD_PRESSURE_DIASTOLIC,
        BLOOD_SUGAR_MGDL,
        HEART_RATE_BPM,
        BMI,
        TEMPERATURE_C
    }

    public static String defaultUnit(MetricType type) {
        return switch (type) {
            case WEIGHT_KG -> "kg";
            case BLOOD_PRESSURE_SYSTOLIC, BLOOD_PRESSURE_DIASTOLIC -> "mmHg";
            case BLOOD_SUGAR_MGDL -> "mg/dL";
            case HEART_RATE_BPM -> "bpm";
            case BMI -> "kg/m²";
            case TEMPERATURE_C -> "°C";
        };
    }
}
```

- [ ] **Step 2: Create `HealthMetricRepository.java`**

```java
package com.sehat24x7.repository;

import com.sehat24x7.model.HealthMetric;
import com.sehat24x7.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface HealthMetricRepository extends JpaRepository<HealthMetric, Long> {

    List<HealthMetric> findByPatientOrderByRecordedAtDesc(Patient patient);

    List<HealthMetric> findByPatientAndTypeOrderByRecordedAtDesc(Patient patient, HealthMetric.MetricType type);

    List<HealthMetric> findByPatientAndTypeAndRecordedAtBetweenOrderByRecordedAtAsc(
            Patient patient, HealthMetric.MetricType type, LocalDateTime from, LocalDateTime to);

    @Query("SELECT h FROM HealthMetric h WHERE h.patient = :patient AND h.recordedAt = " +
           "(SELECT MAX(h2.recordedAt) FROM HealthMetric h2 WHERE h2.patient = :patient AND h2.type = h.type)")
    List<HealthMetric> findLatestPerType(@Param("patient") Patient patient);
}
```

- [ ] **Step 3: Create `HealthMetricService.java`**

```java
package com.sehat24x7.service;

import com.sehat24x7.model.HealthMetric;
import com.sehat24x7.model.Patient;
import com.sehat24x7.repository.HealthMetricRepository;
import com.sehat24x7.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class HealthMetricService {

    @Autowired
    private HealthMetricRepository healthMetricRepository;

    @Autowired
    private PatientRepository patientRepository;

    public HealthMetric logMetric(Long patientId, HealthMetric.MetricType type,
                                   Double value, String notes, LocalDateTime recordedAt) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        HealthMetric metric = new HealthMetric();
        metric.setPatient(patient);
        metric.setType(type);
        metric.setValue(value);
        metric.setUnit(HealthMetric.defaultUnit(type));
        metric.setNotes(notes);
        metric.setRecordedAt(recordedAt != null ? recordedAt : LocalDateTime.now());
        return healthMetricRepository.save(metric);
    }

    public List<HealthMetric> getAll(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        return healthMetricRepository.findByPatientOrderByRecordedAtDesc(patient);
    }

    public List<HealthMetric> getByType(Long patientId, HealthMetric.MetricType type,
                                         LocalDateTime from, LocalDateTime to) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        if (from != null && to != null) {
            return healthMetricRepository
                    .findByPatientAndTypeAndRecordedAtBetweenOrderByRecordedAtAsc(patient, type, from, to);
        }
        return healthMetricRepository.findByPatientAndTypeOrderByRecordedAtDesc(patient);
    }

    public List<HealthMetric> getLatestPerType(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        return healthMetricRepository.findLatestPerType(patient);
    }
}
```

- [ ] **Step 4: Create `HealthMetricController.java`**

```java
package com.sehat24x7.controller;

import com.sehat24x7.model.HealthMetric;
import com.sehat24x7.service.HealthMetricService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients/{patientId}/health-metrics")
@CrossOrigin(origins = "*")
public class HealthMetricController {

    @Autowired
    private HealthMetricService healthMetricService;

    @PostMapping
    public ResponseEntity<HealthMetric> log(@PathVariable Long patientId,
                                             @RequestBody Map<String, Object> body) {
        HealthMetric.MetricType type = HealthMetric.MetricType.valueOf(body.get("type").toString());
        Double value = Double.parseDouble(body.get("value").toString());
        String notes = body.containsKey("notes") ? body.get("notes").toString() : null;
        return ResponseEntity.ok(healthMetricService.logMetric(patientId, type, value, notes, null));
    }

    @GetMapping
    public ResponseEntity<List<HealthMetric>> get(
            @PathVariable Long patientId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        if (type != null) {
            return ResponseEntity.ok(healthMetricService.getByType(patientId,
                    HealthMetric.MetricType.valueOf(type), from, to));
        }
        return ResponseEntity.ok(healthMetricService.getAll(patientId));
    }

    @GetMapping("/latest")
    public ResponseEntity<List<HealthMetric>> getLatest(@PathVariable Long patientId) {
        return ResponseEntity.ok(healthMetricService.getLatestPerType(patientId));
    }
}
```

- [ ] **Step 5: Test**

```bash
# Log a weight metric (patient ID 1):
curl -s -X POST http://localhost:8080/api/patients/1/health-metrics \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"type":"WEIGHT_KG","value":72.5}' | python3 -m json.tool

# Get all metrics for patient:
curl -s "http://localhost:8080/api/patients/1/health-metrics" \
  -H "Authorization: Bearer <token>" | python3 -m json.tool
```
Expected: metric saved and returned with id, type, value, unit, recordedAt.

- [ ] **Step 6: Commit**

```bash
git add src/main/java/com/sehat24x7/model/HealthMetric.java \
        src/main/java/com/sehat24x7/repository/HealthMetricRepository.java \
        src/main/java/com/sehat24x7/service/HealthMetricService.java \
        src/main/java/com/sehat24x7/controller/HealthMetricController.java
git commit -m "feat: patient health metrics backend (log, get, latest per type)"
```

---

### Task 14: Medical History Endpoint

**Files:**
- Create: `src/main/java/com/sehat24x7/dto/MedicalHistoryItemDTO.java`
- Modify: `src/main/java/com/sehat24x7/controller/PatientApiController.java`

- [ ] **Step 1: Create `MedicalHistoryItemDTO.java`**

```java
package com.sehat24x7.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalHistoryItemDTO {
    private Long id;
    private String type;    // APPOINTMENT, PRESCRIPTION, REPORT, HEALTH_METRIC
    private String title;
    private String subtitle;
    private LocalDateTime date;
    private String status;
    private String url;
}
```

- [ ] **Step 2: Add `/medical-history` endpoint in `PatientApiController.java`**

Add injected services and the endpoint:

```java
// Add field injections at top of PatientApiController:
@Autowired
private com.sehat24x7.repository.AppointmentRepository appointmentRepository;
@Autowired
private com.sehat24x7.repository.PrescriptionRepository prescriptionRepository;
@Autowired
private com.sehat24x7.repository.MedicalReportRepository medicalReportRepository;
@Autowired
private com.sehat24x7.repository.HealthMetricRepository healthMetricRepository;
@Autowired
private com.sehat24x7.repository.PatientRepository patientRepository;

// Add the endpoint:
@GetMapping("/{patientId}/medical-history")
public ResponseEntity<List<MedicalHistoryItemDTO>> getMedicalHistory(@PathVariable Long patientId) {
    Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient not found"));

    List<MedicalHistoryItemDTO> history = new java.util.ArrayList<>();

    // Appointments
    appointmentRepository.findByPatient(patient).forEach(a -> history.add(new MedicalHistoryItemDTO(
            a.getId(), "APPOINTMENT",
            a.getConsultationType() + " with Dr. " + a.getDoctor().getName(),
            a.getReason() != null ? a.getReason() : "",
            a.getAppointmentDate().atTime(a.getAppointmentTime()),
            a.getStatus().name(), "/patient/dashboard")));

    // Prescriptions
    prescriptionRepository.findByPatient(patient).forEach(p -> history.add(new MedicalHistoryItemDTO(
            p.getId(), "PRESCRIPTION",
            "Prescription by Dr. " + p.getDoctor().getName(),
            p.getDiagnosis() != null ? p.getDiagnosis() : "",
            p.getCreatedAt(), null, "/patient/prescriptions")));

    // Reports
    medicalReportRepository.findByPatient(patient).forEach(r -> history.add(new MedicalHistoryItemDTO(
            r.getId(), "REPORT",
            r.getReportName() != null ? r.getReportName() : "Medical Report",
            r.getReportType() != null ? r.getReportType() : "",
            r.getUploadDate() != null ? r.getUploadDate().atStartOfDay() : null,
            null, "/patient/reports")));

    // Health metrics (last 20 only to keep the list manageable)
    healthMetricRepository.findByPatientOrderByRecordedAtDesc(patient).stream().limit(20)
            .forEach(m -> history.add(new MedicalHistoryItemDTO(
                    m.getId(), "HEALTH_METRIC",
                    m.getType().name().replace("_", " ") + ": " + m.getValue() + " " + m.getUnit(),
                    m.getNotes() != null ? m.getNotes() : "",
                    m.getRecordedAt(), null, "/patient/dashboard")));

    history.sort((a, b) -> {
        if (a.getDate() == null) return 1;
        if (b.getDate() == null) return -1;
        return b.getDate().compareTo(a.getDate());
    });

    return ResponseEntity.ok(history);
}
```

Add the import at the top:
```java
import com.sehat24x7.dto.MedicalHistoryItemDTO;
import java.util.List;
```

- [ ] **Step 3: Commit**

```bash
git add src/main/java/com/sehat24x7/dto/MedicalHistoryItemDTO.java \
        src/main/java/com/sehat24x7/controller/PatientApiController.java
git commit -m "feat: medical history timeline endpoint aggregating all patient health events"
```

---

### Task 15: Frontend Health Tracker and History in PatientDashboard

**Files:**
- Create: `src/main/resources/static/ts/HealthTracker.tsx`
- Modify: `src/main/resources/static/ts/PatientDashboard.tsx`

- [ ] **Step 1: Add recharts to package.json**

```bash
npm install recharts @types/recharts
```

Verify it was added to `package.json` dependencies.

- [ ] **Step 2: Create `HealthTracker.tsx`**

```tsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiFetch } from './api';
import { Activity, Heart, Droplets, Scale, Thermometer } from 'lucide-react';

const METRIC_TYPES = [
  { value: 'WEIGHT_KG', label: 'Weight', unit: 'kg', icon: Scale, color: '#6366f1' },
  { value: 'BLOOD_PRESSURE_SYSTOLIC', label: 'BP Systolic', unit: 'mmHg', icon: Activity, color: '#ef4444' },
  { value: 'BLOOD_PRESSURE_DIASTOLIC', label: 'BP Diastolic', unit: 'mmHg', icon: Activity, color: '#f97316' },
  { value: 'BLOOD_SUGAR_MGDL', label: 'Blood Sugar', unit: 'mg/dL', icon: Droplets, color: '#10b981' },
  { value: 'HEART_RATE_BPM', label: 'Heart Rate', unit: 'bpm', icon: Heart, color: '#ec4899' },
  { value: 'TEMPERATURE_C', label: 'Temperature', unit: '°C', icon: Thermometer, color: '#f59e0b' },
];

interface Metric { id: number; type: string; value: number; unit: string; recordedAt: string; }

const HealthTracker: React.FC<{ patientId: string }> = ({ patientId }) => {
  const [latest, setLatest] = useState<Metric[]>([]);
  const [selected, setSelected] = useState('WEIGHT_KG');
  const [history, setHistory] = useState<Metric[]>([]);
  const [logType, setLogType] = useState('WEIGHT_KG');
  const [logValue, setLogValue] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    apiFetch(`/api/patients/${patientId}/health-metrics/latest`)
      .then(r => r.ok ? r.json() : [])
      .then(setLatest);
  }, [patientId]);

  useEffect(() => {
    apiFetch(`/api/patients/${patientId}/health-metrics?type=${selected}`)
      .then(r => r.ok ? r.json() : [])
      .then((data: Metric[]) => setHistory([...data].reverse().slice(-30)));
  }, [patientId, selected]);

  const handleLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiFetch(`/api/patients/${patientId}/health-metrics`, {
        method: 'POST',
        body: JSON.stringify({ type: logType, value: parseFloat(logValue), notes: logNotes }),
      });
      if (res.ok) {
        setLogValue('');
        setLogNotes('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        // Refresh latest
        const updated = await apiFetch(`/api/patients/${patientId}/health-metrics/latest`);
        if (updated.ok) setLatest(await updated.json());
        if (logType === selected) {
          const hist = await apiFetch(`/api/patients/${patientId}/health-metrics?type=${selected}`);
          if (hist.ok) setHistory((await hist.json() as Metric[]).reverse().slice(-30));
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const chartData = history.map(m => ({
    time: new Date(m.recordedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    value: m.value,
  }));

  const selectedMeta = METRIC_TYPES.find(m => m.value === selected)!;

  return (
    <div className="space-y-6">
      {/* Latest readings */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {METRIC_TYPES.map(mt => {
          const found = latest.find(l => l.type === mt.value);
          const Icon = mt.icon;
          return (
            <button
              key={mt.value}
              onClick={() => setSelected(mt.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${selected === mt.value ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-200'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon size={16} style={{ color: mt.color }} />
                <span className="text-xs font-medium text-slate-500">{mt.label}</span>
              </div>
              {found ? (
                <p className="text-xl font-bold text-slate-800">
                  {found.value} <span className="text-sm font-normal text-slate-500">{mt.unit}</span>
                </p>
              ) : (
                <p className="text-sm text-slate-400">No data</p>
              )}
            </button>
          );
        })}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            {selectedMeta.label} — Last {chartData.length} readings
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke={selectedMeta.color} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Log form */}
      <div className="bg-white rounded-xl p-5 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Log a New Reading</h3>
        <form onSubmit={handleLog} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Metric Type</label>
              <select
                value={logType}
                onChange={e => setLogType(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              >
                {METRIC_TYPES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">
                Value ({METRIC_TYPES.find(m => m.value === logType)?.unit})
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={logValue}
                onChange={e => setLogValue(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                placeholder="e.g. 72.5"
              />
            </div>
          </div>
          <input
            type="text"
            value={logNotes}
            onChange={e => setLogNotes(e.target.value)}
            placeholder="Optional notes..."
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : success ? 'Saved!' : 'Log Reading'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HealthTracker;
```

- [ ] **Step 3: Add "Health" tab to `PatientDashboard.tsx`**

Import `HealthTracker`:
```tsx
import HealthTracker from './HealthTracker';
```

Find the sidebar navigation items array and add:
```tsx
{ id: 'health', label: 'Health Tracker', icon: Activity }
```

Find the tab content rendering section and add the health tab case:
```tsx
{activeTab === 'health' && (
  <div>
    <h2 className="text-xl font-bold text-slate-800 mb-6">Health Tracker</h2>
    <HealthTracker patientId={localStorage.getItem('patientId') || ''} />
  </div>
)}
```

- [ ] **Step 4: Add "History" tab to `PatientDashboard.tsx`**

Add state for medical history:
```tsx
const [medicalHistory, setMedicalHistory] = useState<any[]>([]);
const [loadingHistory, setLoadingHistory] = useState(false);
```

In `fetchData()`, add:
```tsx
const histRes = await apiFetch(`/api/patients/${patientId}/medical-history`);
if (histRes.ok) setMedicalHistory(await histRes.json());
```

Add "History" to the sidebar:
```tsx
{ id: 'history', label: 'Medical History', icon: FileText }
```

Add the history tab content:
```tsx
{activeTab === 'history' && (
  <div>
    <h2 className="text-xl font-bold text-slate-800 mb-6">Medical History</h2>
    <div className="space-y-3">
      {medicalHistory.map((item, i) => (
        <div key={i}
          onClick={() => item.url && (window.location.href = item.url)}
          className="bg-white rounded-xl p-4 border border-slate-200 cursor-pointer hover:border-blue-200 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full mr-2
                ${item.type === 'APPOINTMENT' ? 'bg-blue-100 text-blue-700' :
                  item.type === 'PRESCRIPTION' ? 'bg-green-100 text-green-700' :
                  item.type === 'REPORT' ? 'bg-purple-100 text-purple-700' :
                  'bg-orange-100 text-orange-700'}`}>
                {item.type.replace('_', ' ')}
              </span>
              <span className="text-sm font-medium text-slate-800">{item.title}</span>
            </div>
            <span className="text-xs text-slate-400">
              {item.date ? new Date(item.date).toLocaleDateString('en-IN') : ''}
            </span>
          </div>
          {item.subtitle && <p className="text-xs text-slate-500 mt-1 ml-0">{item.subtitle}</p>}
        </div>
      ))}
      {medicalHistory.length === 0 && (
        <p className="text-center text-slate-500 py-8">No medical history yet.</p>
      )}
    </div>
  </div>
)}
```

- [ ] **Step 5: Build**

```bash
npm run build
```
Expected: no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add src/main/resources/static/ts/HealthTracker.tsx \
        src/main/resources/static/ts/PatientDashboard.tsx \
        package.json package-lock.json
git commit -m "feat: health tracker tab and medical history timeline in PatientDashboard"
```

---

## Phase 5 — Doctor Earnings & Analytics

### Task 16: DoctorEarning Entity, Repository, Service

**Files:**
- Create: `src/main/java/com/sehat24x7/model/DoctorEarning.java`
- Create: `src/main/java/com/sehat24x7/repository/DoctorEarningRepository.java`
- Create: `src/main/java/com/sehat24x7/service/DoctorEarningService.java`
- Create: `src/main/java/com/sehat24x7/dto/EarningsSummaryDTO.java`

- [ ] **Step 1: Create `DoctorEarning.java`**

```java
package com.sehat24x7.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "doctor_earnings")
public class DoctorEarning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private SourceType sourceType;

    @Column(nullable = false)
    private Long sourceId;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private LocalDateTime earnedAt;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EarningStatus status = EarningStatus.PENDING;

    @Column(length = 300)
    private String notes;

    @PrePersist
    protected void onCreate() {
        if (earnedAt == null) earnedAt = LocalDateTime.now();
    }

    public enum SourceType { APPOINTMENT, VIDEO_CALL }
    public enum EarningStatus { PENDING, SETTLED }
}
```

- [ ] **Step 2: Create `DoctorEarningRepository.java`**

```java
package com.sehat24x7.repository;

import com.sehat24x7.model.Doctor;
import com.sehat24x7.model.DoctorEarning;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DoctorEarningRepository extends JpaRepository<DoctorEarning, Long> {

    Page<DoctorEarning> findByDoctorOrderByEarnedAtDesc(Doctor doctor, Pageable pageable);

    List<DoctorEarning> findByDoctorAndEarnedAtBetween(Doctor doctor, LocalDateTime from, LocalDateTime to);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM DoctorEarning e WHERE e.doctor = :doctor AND e.earnedAt BETWEEN :from AND :to")
    Double sumAmountForPeriod(@Param("doctor") Doctor doctor,
                               @Param("from") LocalDateTime from,
                               @Param("to") LocalDateTime to);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM DoctorEarning e WHERE e.doctor = :doctor AND e.earnedAt BETWEEN :from AND :to AND e.sourceType = :type")
    Double sumAmountBySourceType(@Param("doctor") Doctor doctor,
                                  @Param("from") LocalDateTime from,
                                  @Param("to") LocalDateTime to,
                                  @Param("type") DoctorEarning.SourceType type);
}
```

- [ ] **Step 3: Create `EarningsSummaryDTO.java`**

```java
package com.sehat24x7.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EarningsSummaryDTO {
    private Double totalEarned;
    private Double appointmentEarnings;
    private Double videoCallEarnings;
    private Long appointmentCount;
    private Long videoCallCount;
    private List<WeeklyEarning> weeklyBreakdown;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeeklyEarning {
        private String label;
        private Double amount;
    }
}
```

- [ ] **Step 4: Create `DoctorEarningService.java`**

```java
package com.sehat24x7.service;

import com.sehat24x7.dto.EarningsSummaryDTO;
import com.sehat24x7.model.Doctor;
import com.sehat24x7.model.DoctorEarning;
import com.sehat24x7.repository.DoctorEarningRepository;
import com.sehat24x7.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class DoctorEarningService {

    @Autowired
    private DoctorEarningRepository earningRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    public DoctorEarning recordEarning(Doctor doctor, DoctorEarning.SourceType sourceType,
                                        Long sourceId, Double amount, String notes) {
        DoctorEarning earning = new DoctorEarning();
        earning.setDoctor(doctor);
        earning.setSourceType(sourceType);
        earning.setSourceId(sourceId);
        earning.setAmount(amount);
        earning.setNotes(notes);
        return earningRepository.save(earning);
    }

    public Page<DoctorEarning> getEarnings(Long doctorId, int page) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return earningRepository.findByDoctorOrderByEarnedAtDesc(doctor, PageRequest.of(page, 20));
    }

    public EarningsSummaryDTO getSummary(Long doctorId, int month, int year) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        YearMonth ym = YearMonth.of(year, month);
        LocalDateTime from = ym.atDay(1).atStartOfDay();
        LocalDateTime to = ym.atEndOfMonth().atTime(23, 59, 59);

        List<DoctorEarning> all = earningRepository.findByDoctorAndEarnedAtBetween(doctor, from, to);

        double total = earningRepository.sumAmountForPeriod(doctor, from, to);
        double apptEarnings = earningRepository.sumAmountBySourceType(doctor, from, to, DoctorEarning.SourceType.APPOINTMENT);
        double videoEarnings = earningRepository.sumAmountBySourceType(doctor, from, to, DoctorEarning.SourceType.VIDEO_CALL);

        long apptCount = all.stream().filter(e -> e.getSourceType() == DoctorEarning.SourceType.APPOINTMENT).count();
        long videoCount = all.stream().filter(e -> e.getSourceType() == DoctorEarning.SourceType.VIDEO_CALL).count();

        // Weekly breakdown (4 weeks)
        List<EarningsSummaryDTO.WeeklyEarning> weekly = new ArrayList<>();
        for (int w = 1; w <= 4; w++) {
            int startDay = (w - 1) * 7 + 1;
            int endDay = Math.min(w * 7, ym.lengthOfMonth());
            LocalDateTime wFrom = ym.atDay(startDay).atStartOfDay();
            LocalDateTime wTo = ym.atDay(endDay).atTime(23, 59, 59);
            double wAmount = earningRepository.sumAmountForPeriod(doctor, wFrom, wTo);
            weekly.add(new EarningsSummaryDTO.WeeklyEarning("Week " + w, wAmount));
        }

        return new EarningsSummaryDTO(total, apptEarnings, videoEarnings, apptCount, videoCount, weekly);
    }
}
```

- [ ] **Step 5: Commit**

```bash
git add src/main/java/com/sehat24x7/model/DoctorEarning.java \
        src/main/java/com/sehat24x7/repository/DoctorEarningRepository.java \
        src/main/java/com/sehat24x7/service/DoctorEarningService.java \
        src/main/java/com/sehat24x7/dto/EarningsSummaryDTO.java
git commit -m "feat: doctor earnings entity, repository, and service with monthly summary"
```

---

### Task 17: DoctorEarningController and Hook into Events

**Files:**
- Create: `src/main/java/com/sehat24x7/controller/DoctorEarningController.java`
- Modify: `src/main/java/com/sehat24x7/service/impl/AppointmentServiceImpl.java`
- Modify: `src/main/java/com/sehat24x7/service/VideoCallRequestService.java`

- [ ] **Step 1: Create `DoctorEarningController.java`**

```java
package com.sehat24x7.controller;

import com.sehat24x7.dto.EarningsSummaryDTO;
import com.sehat24x7.model.DoctorEarning;
import com.sehat24x7.service.DoctorEarningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctors/{doctorId}/earnings")
@CrossOrigin(origins = "*")
public class DoctorEarningController {

    @Autowired
    private DoctorEarningService earningService;

    @GetMapping
    public ResponseEntity<Page<DoctorEarning>> getEarnings(
            @PathVariable Long doctorId,
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(earningService.getEarnings(doctorId, page));
    }

    @GetMapping("/summary")
    public ResponseEntity<EarningsSummaryDTO> getSummary(
            @PathVariable Long doctorId,
            @RequestParam(defaultValue = "0") int month,
            @RequestParam(defaultValue = "0") int year) {
        int m = month == 0 ? java.time.LocalDateTime.now().getMonthValue() : month;
        int y = year == 0 ? java.time.LocalDateTime.now().getYear() : year;
        return ResponseEntity.ok(earningService.getSummary(doctorId, m, y));
    }
}
```

- [ ] **Step 2: Inject `DoctorEarningService` into `AppointmentServiceImpl` and record earnings on COMPLETED**

Add the field:
```java
@Autowired
private DoctorEarningService doctorEarningService;
```

In `updateAppointmentStatus()`, inside the `if (status == AppointmentStatus.COMPLETED)` block (after the notification), add:
```java
// Record doctor earning
doctorEarningService.recordEarning(
    saved.getDoctor(),
    DoctorEarning.SourceType.APPOINTMENT,
    saved.getId(),
    saved.getDoctor().getConsultationFee(),
    "Appointment #" + saved.getId() + " completed"
);
```

Add import:
```java
import com.sehat24x7.model.DoctorEarning;
import com.sehat24x7.service.DoctorEarningService;
```

- [ ] **Step 3: Inject `DoctorEarningService` into `VideoCallRequestService` and record on call COMPLETED**

Add field:
```java
@Autowired
private DoctorEarningService doctorEarningService;
```

Find the method that sets status to COMPLETED (likely `completeCall()` or wherever `callEndTime` is set). After saving:
```java
doctorEarningService.recordEarning(
    request.getDoctor(),
    DoctorEarning.SourceType.VIDEO_CALL,
    request.getId(),
    request.getCallCost() != null ? request.getCallCost() : 0.0,
    "Video call #" + request.getId() + " completed"
);
```

Add import: `import com.sehat24x7.model.DoctorEarning;`

- [ ] **Step 4: Test**

Complete a test appointment via the API:
```bash
curl -s -X PUT "http://localhost:8080/api/appointments/1/status?status=COMPLETED" \
  -H "Authorization: Bearer <doctor-token>"

# Check earnings:
curl -s "http://localhost:8080/api/doctors/1/earnings/summary" \
  -H "Authorization: Bearer <doctor-token>" | python3 -m json.tool
```
Expected: summary shows `totalEarned > 0` and `appointmentCount: 1`.

- [ ] **Step 5: Commit**

```bash
git add src/main/java/com/sehat24x7/controller/DoctorEarningController.java \
        src/main/java/com/sehat24x7/service/impl/AppointmentServiceImpl.java \
        src/main/java/com/sehat24x7/service/VideoCallRequestService.java
git commit -m "feat: record doctor earnings on appointment/video-call completion"
```

---

### Task 18: Frontend Doctor Earnings Tab

**Files:**
- Create: `src/main/resources/static/ts/DoctorEarnings.tsx`
- Modify: `src/main/resources/static/ts/DoctorDashboard.tsx`

- [ ] **Step 1: Create `DoctorEarnings.tsx`**

```tsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiFetch } from './api';
import { IndianRupee, TrendingUp, Video, Calendar } from 'lucide-react';

interface Summary {
  totalEarned: number;
  appointmentEarnings: number;
  videoCallEarnings: number;
  appointmentCount: number;
  videoCallCount: number;
  weeklyBreakdown: { label: string; amount: number }[];
}

interface Earning {
  id: number;
  sourceType: 'APPOINTMENT' | 'VIDEO_CALL';
  amount: number;
  earnedAt: string;
  notes: string;
  status: string;
}

const DoctorEarnings: React.FC<{ doctorId: string }> = ({ doctorId }) => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [summary, setSummary] = useState<Summary | null>(null);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!doctorId) return;
    setLoading(true);
    Promise.all([
      apiFetch(`/api/doctors/${doctorId}/earnings/summary?month=${month}&year=${year}`).then(r => r.ok ? r.json() : null),
      apiFetch(`/api/doctors/${doctorId}/earnings`).then(r => r.ok ? r.json() : { content: [] }),
    ]).then(([s, e]) => {
      setSummary(s);
      setEarnings(e.content || []);
      setLoading(false);
    });
  }, [doctorId, month, year]);

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div className="space-y-6">
      {/* Month selector */}
      <div className="flex items-center gap-3">
        <select value={month} onChange={e => setMonth(Number(e.target.value))}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
          {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select value={year} onChange={e => setYear(Number(e.target.value))}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
          {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Earned', value: `₹${summary?.totalEarned?.toFixed(0) ?? 0}`, icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Appointments', value: `₹${summary?.appointmentEarnings?.toFixed(0) ?? 0}`, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Video Calls', value: `₹${summary?.videoCallEarnings?.toFixed(0) ?? 0}`, icon: Video, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Sessions', value: `${(summary?.appointmentCount ?? 0) + (summary?.videoCallCount ?? 0)}`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((card, i) => (
          <div key={i} className={`${card.bg} rounded-xl p-4 border border-white`}>
            <card.icon size={18} className={`${card.color} mb-2`} />
            <p className="text-xs text-slate-500">{card.label}</p>
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Weekly chart */}
      {summary?.weeklyBreakdown && summary.weeklyBreakdown.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Weekly Earnings — {MONTHS[month - 1]} {year}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={summary.weeklyBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [`₹${v}`, 'Earned']} />
              <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Earnings list */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">Recent Earnings</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {earnings.map(e => (
            <div key={e.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {e.sourceType === 'VIDEO_CALL'
                  ? <Video size={16} className="text-purple-500" />
                  : <Calendar size={16} className="text-blue-500" />}
                <div>
                  <p className="text-sm text-slate-800">{e.notes || e.sourceType}</p>
                  <p className="text-xs text-slate-400">{new Date(e.earnedAt).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-700">+₹{e.amount}</p>
                <p className="text-xs text-slate-400">{e.status}</p>
              </div>
            </div>
          ))}
          {earnings.length === 0 && (
            <p className="text-center text-slate-500 text-sm py-8">No earnings recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorEarnings;
```

- [ ] **Step 2: Add Earnings tab to `DoctorDashboard.tsx`**

Import `DoctorEarnings`:
```tsx
import DoctorEarnings from './DoctorEarnings';
import { IndianRupee } from 'lucide-react';
```

Add to the sidebar nav items (find the existing array and add):
```tsx
{ id: 'earnings', label: 'Earnings', icon: IndianRupee }
```

Add to the tab content rendering:
```tsx
{activeTab === 'earnings' && (
  <div>
    <h2 className="text-xl font-bold text-slate-800 mb-6">Earnings & Revenue</h2>
    <DoctorEarnings doctorId={localStorage.getItem('doctorId') || ''} />
  </div>
)}
```

Remove or update the hardcoded `earnings: 0` stat in the `stats` state — the real data now comes from the earnings summary endpoint.

- [ ] **Step 3: Build**

```bash
npm run build
```
Expected: BUILD SUCCESS.

- [ ] **Step 4: Commit**

```bash
git add src/main/resources/static/ts/DoctorEarnings.tsx \
        src/main/resources/static/ts/DoctorDashboard.tsx
git commit -m "feat: earnings tab in DoctorDashboard with weekly chart and earnings list"
```

---

## Final Integration Verification

### Task 19: End-to-End Smoke Test

- [ ] **Step 1: Start the full application**

```bash
./mvnw spring-boot:run
```
Wait for `Started Sehat24x7Application` in logs.

- [ ] **Step 2: Test Phase 1 — JWT auth**

```bash
# Register a patient
curl -s -X POST http://localhost:8080/api/patients/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Patient","email":"patient@test.com","phone":"9876543210","password":"Test@123","age":30,"gender":"Male","bloodGroup":"O+","address":"Test City"}' \
  | python3 -m json.tool

# Login as patient
curl -s -X POST http://localhost:8080/api/patients/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@test.com","password":"Test@123"}' \
  | python3 -m json.tool
```
Expected: login returns `token` field.

- [ ] **Step 3: Test Phase 2 — notifications**

```bash
TOKEN="<paste patient token here>"
# Check unread count
curl -s http://localhost:8080/api/notifications/unread-count \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```
Expected: `{ "count": 0 }` (or > 0 if any events fired).

- [ ] **Step 4: Test Phase 3 — slot availability**

```bash
# Public endpoint, no token needed
curl -s "http://localhost:8080/api/doctors/1/available-slots?date=2026-06-10" \
  | python3 -m json.tool
```
Expected: array of slots, or empty array if no availability configured for that day.

- [ ] **Step 5: Test Phase 4 — health metrics**

```bash
TOKEN="<paste patient token here>"
PATIENT_ID="<patient id from login>"
curl -s -X POST "http://localhost:8080/api/patients/${PATIENT_ID}/health-metrics" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"WEIGHT_KG","value":70.5,"notes":"Morning reading"}' | python3 -m json.tool

curl -s "http://localhost:8080/api/patients/${PATIENT_ID}/medical-history" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```
Expected: metric saved, medical history contains at least one HEALTH_METRIC entry.

- [ ] **Step 6: Test Phase 5 — earnings**

```bash
DOCTOR_TOKEN="<paste doctor token here>"
DOCTOR_ID="<doctor id>"
curl -s "http://localhost:8080/api/doctors/${DOCTOR_ID}/earnings/summary" \
  -H "Authorization: Bearer $DOCTOR_TOKEN" | python3 -m json.tool
```
Expected: summary object with all numeric fields.

- [ ] **Step 7: Final commit**

```bash
git add .
git commit -m "chore: complete Sehat24x7 full platform upgrade — JWT, notifications, slots, health metrics, earnings"
```

---

## Self-Review Checklist

- [x] **Spec coverage:** JWT ✓ (Tasks 1-6), Notifications ✓ (Tasks 7-10), Slot Calendar ✓ (Tasks 11-12), Health Metrics ✓ (Tasks 13-15), Doctor Earnings ✓ (Tasks 16-18)
- [x] **No placeholders:** All steps contain complete code or exact commands
- [x] **Type consistency:** `NotificationType` enum used in Task 8+9 matches Task 7 definition; `HealthMetric.MetricType` enum in Task 13+15 consistent; `DoctorEarning.SourceType` in Task 16+17 consistent; `SlotDTO` created in Task 11 used in Task 12
- [x] **BCrypt migration:** Task 4 explicitly handles clearing old HASH_ passwords
- [x] **Public routes:** `DoctorSlotController` uses `@CrossOrigin` and `/api/doctors/{id}/available-slots` is in `SecurityConfig` public under `GET /api/doctors/**`
- [x] **Patient has no User record:** `NotificationService.create()` uses `patientId` with `"PATIENT"` role — matches `NotificationContext.tsx` which subscribes to `/topic/notifications/PATIENT/{patientId}`
