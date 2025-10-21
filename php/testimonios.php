<?php
require_once 'db.php';
header('Content-Type: application/json; charset=utf-8');
$action = $_GET['action'] ?? '';

// Simple logging para depuración
$logDir = __DIR__ . '/logs';
if (!is_dir($logDir)) {
    @mkdir($logDir, 0755, true);
}
$logFile = $logDir . '/testimonios.log';
$reqBody = @file_get_contents('php://input');
file_put_contents($logFile, sprintf("%s - ACTION=%s METHOD=%s POST=%s RAW=%s\n", date('c'), $action, $_SERVER['REQUEST_METHOD'], json_encode($_POST), $reqBody), FILE_APPEND);

// Asegurar que la tabla exista (útil si no se importó db.sql en phpMyAdmin)
$createTableSql = "CREATE TABLE IF NOT EXISTS testimonios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contenido TEXT NOT NULL,
    video_url VARCHAR(255) DEFAULT NULL,
    creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
if (!$conn->query($createTableSql)) {
    file_put_contents($logFile, date('c') . " - ERROR creando tabla testimonios: " . $conn->error . "\n", FILE_APPEND);
    // No detener ejecución aquí: si falla, las consultas siguientes mostrarán el error hacia el cliente
}

if ($action === 'listar') {
    $result = $conn->query("SELECT * FROM testimonios ORDER BY creado_at DESC");
    if (!$result) {
        echo json_encode(['success' => false, 'msg' => $conn->error]);
        exit;
    }
    $items = [];
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
    echo json_encode(['success' => true, 'testimonios' => $items]);
    exit;
}

if ($action === 'agregar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = trim($_POST['nombre'] ?? '');
    $contenido = trim($_POST['contenido'] ?? '');
    $video_url = isset($_POST['video_url']) ? trim($_POST['video_url']) : '';
    if ($nombre && $contenido) {
        $stmt = $conn->prepare("INSERT INTO testimonios (nombre, contenido, video_url) VALUES (?, ?, ?)");
        if (!$stmt) {
            echo json_encode(['success' => false, 'msg' => $conn->error]);
            exit;
        }
        $stmt->bind_param('sss', $nombre, $contenido, $video_url);
        $ok = $stmt->execute();
        if (!$ok) {
            echo json_encode(['success' => false, 'msg' => $stmt->error]);
            $stmt->close();
            exit;
        }
        $newId = $conn->insert_id;
        $stmt->close();
        echo json_encode(['success' => true, 'id' => $newId]);
        exit;
    }
    echo json_encode(['success' => false, 'msg' => 'Faltan datos']);
    exit;
}

if ($action === 'editar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';
    $nombre = trim($_POST['nombre'] ?? '');
    $contenido = trim($_POST['contenido'] ?? '');
    $video_url = isset($_POST['video_url']) ? trim($_POST['video_url']) : '';
    if ($id && $nombre && $contenido) {
        $stmt = $conn->prepare("UPDATE testimonios SET nombre=?, contenido=?, video_url=? WHERE id=?");
        if (!$stmt) {
            echo json_encode(['success' => false, 'msg' => $conn->error]);
            exit;
        }
        $stmt->bind_param('sssi', $nombre, $contenido, $video_url, $id);
        $ok = $stmt->execute();
        if (!$ok) {
            echo json_encode(['success' => false, 'msg' => $stmt->error]);
            $stmt->close();
            exit;
        }
        $stmt->close();
        echo json_encode(['success' => true]);
        exit;
    }
    echo json_encode(['success' => false, 'msg' => 'Faltan datos']);
    exit;
}

if ($action === 'eliminar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';
    if ($id) {
        $stmt = $conn->prepare("DELETE FROM testimonios WHERE id=?");
        if (!$stmt) {
            echo json_encode(['success' => false, 'msg' => $conn->error]);
            exit;
        }
        $stmt->bind_param('i', $id);
        $ok = $stmt->execute();
        if (!$ok) {
            echo json_encode(['success' => false, 'msg' => $stmt->error]);
            $stmt->close();
            exit;
        }
        $stmt->close();
        echo json_encode(['success' => true]);
        exit;
    }
    echo json_encode(['success' => false, 'msg' => 'Falta el id']);
    exit;
}

echo json_encode(['success' => false, 'msg' => 'Acción no válida']);
