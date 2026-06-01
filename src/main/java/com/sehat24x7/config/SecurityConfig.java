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
                // Static assets and frontend SPA routes
                .requestMatchers("/", "/index.html", "/assets/**", "/static/**",
                                 "/js/**", "/css/**", "/images/**", "/*.js", "/*.css", "/*.map").permitAll()
                // Frontend catch-all (FrontendController handles SPA routing)
                .requestMatchers("/favicon.ico", "/error").permitAll()
                // Public API endpoints - read-only data
                .requestMatchers(HttpMethod.GET, "/api/doctors/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/specializations/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/specialization/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/home/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/home-api/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/hero-banners/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/announcements/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/location/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/locations/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/reviews/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/about-us/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/consultations/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/video-call-requests/**").permitAll()
                // Auth endpoints (admin/staff/doctor login)
                .requestMatchers("/api/auth/**").permitAll()
                // Patient self-service registration and login
                .requestMatchers(HttpMethod.POST, "/api/patients/register").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/patients/login").permitAll()
                // Doctor registration
                .requestMatchers(HttpMethod.POST, "/api/doctors/register").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/doctor/register").permitAll()
                // WebSocket (STOMP + SockJS)
                .requestMatchers("/ws/**").permitAll()
                // Everything else requires authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
