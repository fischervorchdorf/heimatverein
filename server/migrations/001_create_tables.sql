-- Sonderausstellungen
CREATE TABLE IF NOT EXISTS exhibitions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    date_start DATE DEFAULT NULL,
    date_end DATE DEFAULT NULL,
    date_display VARCHAR(200) NOT NULL,
    image_url VARCHAR(500) DEFAULT NULL,
    image_alt VARCHAR(500) DEFAULT NULL,
    location VARCHAR(300) DEFAULT 'Museum der Region Vorchdorf',
    curator VARCHAR(300) DEFAULT NULL,
    detail_items JSON DEFAULT NULL,
    gallery_links JSON DEFAULT NULL,
    modal_content TEXT DEFAULT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_dates (date_start, date_end),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Formulareingänge
CREATE TABLE IF NOT EXISTS form_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    form_type ENUM('kontakt','mitgliedschaft','zeitzeugen','ausflug','ideenworkshop','newsletter') NOT NULL,
    data JSON NOT NULL,
    email VARCHAR(300) DEFAULT NULL,
    name VARCHAR(300) DEFAULT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    file_path VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_type (form_type),
    INDEX idx_read (is_read),
    INDEX idx_created (created_at DESC),
    INDEX idx_type_created (form_type, created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Veranstaltungen
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(300) DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date),
    INDEX idx_active_date (is_active, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
