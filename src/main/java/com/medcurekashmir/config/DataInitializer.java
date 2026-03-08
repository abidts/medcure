package com.medcurekashmir.config;

import com.medcurekashmir.model.*;
import com.medcurekashmir.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private SpecializationRepository specializationRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private DoctorAvailabilityRepository availabilityRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public void run(String... args) {
        // Create default Super Admin
        createSuperAdmin();

        // Create Sample Patient
        createSamplePatient();

        // Create Specializations
        Specialization cardiology = createSpecialization("Cardiology", "Heart and cardiovascular system specialist");
        Specialization dermatology = createSpecialization("Dermatology", "Skin, hair, and nail specialist");
        Specialization pediatrics = createSpecialization("Pediatrics", "Child healthcare specialist");
        Specialization orthopedics = createSpecialization("Orthopedics", "Bone and joint specialist");
        Specialization neurology = createSpecialization("Neurology", "Nervous system specialist");
        Specialization gynecology = createSpecialization("Gynecology", "Women's health specialist");

        // Create Doctors with User Accounts (so they can login)
        Long doctorId = createDoctorWithUser("Dr. Aadil Hassan", "dr.aadil@medcure.com", "doctor123", "+91 9906123456",
                "MBBS, MD (Cardiology)", "Specialist in interventional cardiology with 12 years of experience",
                12, cardiology, "Medical Complex, Lal Chowk, Srinagar", 800.0, true,
                34.0836, 74.7973, "Srinagar", "Lal Chowk", "Srinagar", "Jammu and Kashmir");

        // Create other doctors (without login for now)
        createDoctorWithUser("Dr. Zainab Khan", "dr.zainab@medcure.com", "doctor123", "+91 9906234567",
                "MBBS, MD (Dermatology)", "Expert in cosmetic and clinical dermatology",
                8, dermatology, "Skin Care Clinic, Rajouri Kadal, Srinagar", 600.0, true,
                34.0900, 74.8000, "Srinagar", "Rajouri Kadal", "Srinagar", "Jammu and Kashmir");

        createDoctorWithUser("Dr. Umar Farooq", "dr.umar@medcure.com", "doctor123", "+91 9906345678",
                "MBBS, MD (Pediatrics)", "Dedicated to providing comprehensive child healthcare",
                15, pediatrics, "Child Care Center, Karan Nagar, Srinagar", 500.0, true,
                34.0950, 74.8100, "Srinagar", "Karan Nagar", "Srinagar", "Jammu and Kashmir");

        // Create sample availabilities for the first doctor
        if (doctorId != null) {
            createSampleAvailabilities(doctorId);
        }
    }

    private void createSuperAdmin() {
        if (userRepository.findByEmail("admin@medcure.com").isEmpty()) {
            // Create user
            User adminUser = new User();
            adminUser.setEmail("admin@medcure.com");
            adminUser.setName("Super Admin");
            adminUser.setPhone("+91 9906000000");
            adminUser.setPassword("HASH_admin123");
            adminUser.setRole(User.UserRole.SUPER_ADMIN);
            adminUser.setIsActive(true);
            adminUser.setCreatedAt(java.time.LocalDateTime.now());
            adminUser.setUpdatedAt(java.time.LocalDateTime.now());
            userRepository.save(adminUser);

            // Create admin record
            Admin admin = new Admin();
            admin.setUser(adminUser);
            admin.setIsSuperAdmin(true);
            admin.setPermissions("ALL");
            admin.setCreatedAt(java.time.LocalDateTime.now());
            admin.setUpdatedAt(java.time.LocalDateTime.now());
            adminRepository.save(admin);

            System.out.println("Default Super Admin created:");
            System.out.println("Email: admin@medcure.com");
            System.out.println("Password: admin123");
        }
    }

    private Specialization createSpecialization(String name, String description) {
        return specializationRepository.findByName(name).orElseGet(() -> {
            Specialization spec = new Specialization();
            spec.setName(name);
            spec.setDescription(description);
            return specializationRepository.save(spec);
        });
    }

    private Long createDoctor(String name, String email, String phone, String qualification,
                              String experience, int yearsOfExperience, Specialization specialization,
                              String clinicAddress, Double consultationFee, Boolean available) {
        if (doctorRepository.findByEmail(email).isEmpty()) {
            Doctor doctor = new Doctor();
            doctor.setName(name);
            doctor.setEmail(email);
            doctor.setPhone(phone);
            doctor.setQualification(qualification);
            doctor.setExperience(experience);
            doctor.setYearsOfExperience(yearsOfExperience);
            doctor.setSpecialization(specialization);
            doctor.setClinicAddress(clinicAddress);
            doctor.setConsultationFee(consultationFee);
            doctor.setAvailable(available);
            doctor.setJoiningDate(LocalDate.now());
            doctorRepository.save(doctor);
            return doctor.getId();
        }
        return doctorRepository.findByEmail(email).map(Doctor::getId).orElse(null);
    }

    private Long createDoctorWithUser(String name, String email, String password, String phone, 
                                      String qualification, String experience, int yearsOfExperience, 
                                      Specialization specialization, String clinicAddress, 
                                      Double consultationFee, Boolean available,
                                      Double latitude, Double longitude, String city, String area,
                                      String district, String state) {
        if (doctorRepository.findByEmail(email).isPresent() || userRepository.findByEmail(email).isPresent()) {
            return doctorRepository.findByEmail(email).map(Doctor::getId).orElse(null);
        }

        // Create user account for doctor
        User user = new User();
        user.setEmail(email);
        user.setName(name);
        user.setPhone(phone);
        user.setPassword("HASH_" + password);
        user.setRole(User.UserRole.DOCTOR);
        user.setIsActive(true);
        user.setCreatedAt(java.time.LocalDateTime.now());
        user.setUpdatedAt(java.time.LocalDateTime.now());
        userRepository.save(user);

        // Create doctor profile linked to user
        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setName(name);
        doctor.setEmail(email);
        doctor.setPhone(phone);
        doctor.setQualification(qualification);
        doctor.setExperience(experience);
        doctor.setYearsOfExperience(yearsOfExperience);
        doctor.setSpecialization(specialization);
        doctor.setClinicAddress(clinicAddress);
        doctor.setConsultationFee(consultationFee);
        doctor.setAvailable(available);
        doctor.setLatitude(latitude);
        doctor.setLongitude(longitude);
        doctor.setCity(city);
        doctor.setArea(area);
        doctor.setDistrict(district);
        doctor.setState(state);
        doctor.setJoiningDate(LocalDate.now());
        doctorRepository.save(doctor);

        System.out.println("Doctor account created: " + email + " / Password: " + password);
        return doctor.getId();
    }

    private void createSampleAvailabilities(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId).orElse(null);
        if (doctor == null) return;

        // Create sample clinic availability for weekdays
        createAvailability(doctor, DoctorAvailability.ConsultationType.CLINIC, DayOfWeek.MONDAY, 
                LocalTime.of(9, 0), LocalTime.of(13, 0), 15);
        createAvailability(doctor, DoctorAvailability.ConsultationType.CLINIC, DayOfWeek.MONDAY, 
                LocalTime.of(16, 0), LocalTime.of(20, 0), 15);
        createAvailability(doctor, DoctorAvailability.ConsultationType.CLINIC, DayOfWeek.TUESDAY, 
                LocalTime.of(9, 0), LocalTime.of(13, 0), 15);
        createAvailability(doctor, DoctorAvailability.ConsultationType.CLINIC, DayOfWeek.TUESDAY, 
                LocalTime.of(16, 0), LocalTime.of(20, 0), 15);
        createAvailability(doctor, DoctorAvailability.ConsultationType.CLINIC, DayOfWeek.WEDNESDAY, 
                LocalTime.of(9, 0), LocalTime.of(13, 0), 15);
        createAvailability(doctor, DoctorAvailability.ConsultationType.CLINIC, DayOfWeek.WEDNESDAY, 
                LocalTime.of(16, 0), LocalTime.of(20, 0), 15);
        createAvailability(doctor, DoctorAvailability.ConsultationType.CLINIC, DayOfWeek.THURSDAY, 
                LocalTime.of(9, 0), LocalTime.of(13, 0), 15);
        createAvailability(doctor, DoctorAvailability.ConsultationType.CLINIC, DayOfWeek.THURSDAY, 
                LocalTime.of(16, 0), LocalTime.of(20, 0), 15);
        createAvailability(doctor, DoctorAvailability.ConsultationType.CLINIC, DayOfWeek.FRIDAY, 
                LocalTime.of(9, 0), LocalTime.of(13, 0), 15);
        createAvailability(doctor, DoctorAvailability.ConsultationType.CLINIC, DayOfWeek.FRIDAY, 
                LocalTime.of(16, 0), LocalTime.of(20, 0), 15);
        createAvailability(doctor, DoctorAvailability.ConsultationType.CLINIC, DayOfWeek.SATURDAY, 
                LocalTime.of(10, 0), LocalTime.of(14, 0), 20);

        // Create sample video consultation availability
        createAvailability(doctor, DoctorAvailability.ConsultationType.VIDEO, DayOfWeek.MONDAY, 
                LocalTime.of(20, 0), LocalTime.of(22, 0), 30);
        createAvailability(doctor, DoctorAvailability.ConsultationType.VIDEO, DayOfWeek.WEDNESDAY, 
                LocalTime.of(20, 0), LocalTime.of(22, 0), 30);
        createAvailability(doctor, DoctorAvailability.ConsultationType.VIDEO, DayOfWeek.FRIDAY, 
                LocalTime.of(20, 0), LocalTime.of(22, 0), 30);
    }

    private void createAvailability(Doctor doctor, DoctorAvailability.ConsultationType type, 
                                    DayOfWeek day, LocalTime start, LocalTime end, int duration) {
        DoctorAvailability availability = new DoctorAvailability();
        availability.setDoctor(doctor);
        availability.setConsultationType(type);
        availability.setDayOfWeek(day);
        availability.setStartTime(start);
        availability.setEndTime(end);
        availability.setSlotDurationMinutes(duration);
        availability.setIsActive(true);
        availabilityRepository.save(availability);
    }

    private void createSamplePatient() {
        if (patientRepository.findByPhone("+91 9906999999").isEmpty()) {
            Patient patient = new Patient();
            patient.setName("Test Patient");
            patient.setEmail("patient@test.com");
            patient.setPhone("+91 9906999999");
            patient.setPassword("HASH_patient123");
            patient.setAge(32);
            patient.setGender("Male");
            patient.setAddress("Test Address, Srinagar");
            patient.setBloodGroup("O+");
            patient.setRegistrationDate(LocalDate.now());
            patientRepository.save(patient);
            System.out.println("Sample patient created: patient@test.com / Password: patient123");
        }
    }
}
