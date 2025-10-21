<?php
require_once 'db.php';

$createTableSql = "CREATE TABLE IF NOT EXISTS testimonios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contenido TEXT NOT NULL,
    video_url VARCHAR(255) DEFAULT NULL,
    creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

if ($conn->query($createTableSql)) {
    echo "OK: Tabla 'testimonios' creada o ya existe.";
} else {
    echo "ERROR: " . $conn->error;
}
