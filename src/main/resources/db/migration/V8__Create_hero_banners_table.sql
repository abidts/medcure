CREATE TABLE IF NOT EXISTS hero_banners (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(140) NOT NULL,
    subtitle VARCHAR(280),
    description VARCHAR(600),
    image_url VARCHAR(1000) NOT NULL,
    image_position VARCHAR(16) NOT NULL DEFAULT 'CENTER',
    primary_link_text VARCHAR(60),
    primary_link_url VARCHAR(600),
    secondary_link_text VARCHAR(60),
    secondary_link_url VARCHAR(600),
    display_order INT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    start_date DATETIME NULL,
    end_date DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
