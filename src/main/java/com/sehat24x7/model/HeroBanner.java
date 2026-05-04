package com.sehat24x7.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hero_banners")
public class HeroBanner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 140)
    private String title;

    @Column(length = 280)
    private String subtitle;

    @Column(length = 600)
    private String description;

    @Column(nullable = false, length = 20)
    private String titleColor = "#FFFFFF";

    @Column(nullable = false, length = 20)
    private String subtitleColor = "#E2E8F0";

    @Column(nullable = false, length = 20)
    private String descriptionColor = "#F8FAFC";

    @Column(nullable = false, length = 1000)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private ImagePosition imagePosition = ImagePosition.CENTER;

    @Column(length = 60)
    private String primaryLinkText;

    @Column(length = 600)
    private String primaryLinkUrl;

    @Column(length = 60)
    private String secondaryLinkText;

    @Column(length = 600)
    private String secondaryLinkUrl;

    @Column
    private Integer displayOrder = 0;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column
    private LocalDateTime startDate;

    @Column
    private LocalDateTime endDate;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ImagePosition {
        LEFT, CENTER, RIGHT
    }
}
