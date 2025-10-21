<?php
require_once 'db.php';
header('Content-Type: application/json; charset=utf-8');
$action = $_GET['action'] ?? '';

// Simple logging para depuración
$logDir = __DIR__ . '/logs';
if (!is_dir($logDir)) {
    @mkdir($logDir, 0755, true);
}

// restore image from trash
if ($action === 'restore_image' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';
    $trashUrl = $_POST['trash_url'] ?? '';
    if ($id && $trashUrl) {
        $uploadsDir = realpath(__DIR__ . '/../uploads');
        $trashPath = realpath(__DIR__ . '/../' . ltrim($trashUrl, '/'));
        if ($trashPath && $uploadsDir && strpos($trashPath, realpath(__DIR__ . '/../uploads/trash')) === 0 && is_file($trashPath)) {
            $newName = basename($trashPath);
            $dest = __DIR__ . '/../uploads/testimonios/' . $newName;
            @rename($trashPath, $dest);
            $newUrl = '/uploads/testimonios/' . $newName;
            $stmt = $conn->prepare("UPDATE testimonios SET imagen=? WHERE id=?");
            $stmt->bind_param('si', $newUrl, $id);
            $ok = $stmt->execute();
            $stmt->close();
            echo json_encode(['success' => $ok, 'url' => $newUrl]);
            exit;
        }
    }
    echo json_encode(['success' => false]);
    exit;
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
    imagen VARCHAR(255) DEFAULT NULL,
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
    $imagen = isset($_POST['imagen']) ? trim($_POST['imagen']) : '';
    if ($nombre && $contenido) {
    $stmt = $conn->prepare("INSERT INTO testimonios (nombre, contenido, video_url, imagen) VALUES (?, ?, ?, ?)");
        if (!$stmt) {
            echo json_encode(['success' => false, 'msg' => $conn->error]);
            exit;
        }
    $stmt->bind_param('ssss', $nombre, $contenido, $video_url, $imagen);
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
    $imagen = isset($_POST['imagen']) ? trim($_POST['imagen']) : '';
    if ($id && $nombre && $contenido) {
        // delete old image if changed
        $stmtOld = $conn->prepare("SELECT imagen FROM testimonios WHERE id=? LIMIT 1");
        if ($stmtOld) {
            $stmtOld->bind_param('i', $id);
            $stmtOld->execute();
            $stmtOld->bind_result($oldImage);
            if ($stmtOld->fetch()) {
                if ($oldImage && $oldImage !== $imagen) {
                    $uploadsDir = realpath(__DIR__ . '/../uploads');
                    $filePath = realpath(__DIR__ . '/../' . ltrim($oldImage, '/'));
                    if ($filePath && $uploadsDir && strpos($filePath, $uploadsDir) === 0 && is_file($filePath)) {
                        @unlink($filePath);
                    }
                }
            }
            $stmtOld->close();
        }
    $stmt = $conn->prepare("UPDATE testimonios SET nombre=?, contenido=?, video_url=?, imagen=? WHERE id=?");
        if (!$stmt) {
            echo json_encode(['success' => false, 'msg' => $conn->error]);
            exit;
        }
    $stmt->bind_param('ssssi', $nombre, $contenido, $video_url, $imagen, $id);
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
        // delete image file if present
        $stmtImg = $conn->prepare("SELECT imagen FROM testimonios WHERE id=? LIMIT 1");
        if ($stmtImg) {
            $stmtImg->bind_param('i', $id);
            $stmtImg->execute();
            $stmtImg->bind_result($oldImage);
            if ($stmtImg->fetch()) {
                // remove local upload if inside uploads dir
                $uploadsDir = realpath(__DIR__ . '/../uploads');
                $filePath = realpath(__DIR__ . '/../' . ltrim($oldImage, '/'));
                if ($filePath && $uploadsDir && strpos($filePath, $uploadsDir) === 0 && is_file($filePath)) {
                    @unlink($filePath);
                }
            }
            $stmtImg->close();
        }
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

// delete image only
if ($action === 'eliminar_imagen' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';
    if ($id) {
        $stmt = $conn->prepare("SELECT imagen FROM testimonios WHERE id=? LIMIT 1");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $stmt->bind_result($img);
        if ($stmt->fetch()) {
            $uploadsDir = realpath(__DIR__ . '/../uploads');
            $filePath = realpath(__DIR__ . '/../' . ltrim($img, '/'));
            if ($filePath && $uploadsDir && strpos($filePath, $uploadsDir) === 0 && is_file($filePath)) {
                $trashDir = __DIR__ . '/../uploads/trash';
                if (!is_dir($trashDir)) @mkdir($trashDir, 0755, true);
                $newName = bin2hex(random_bytes(6)) . '_' . basename($filePath);
                $trashed = $trashDir . '/' . $newName;
                @rename($filePath, $trashed);
                $trashUrl = '/uploads/trash/' . $newName;
            }
        }
        $stmt->close();
        $stmt2 = $conn->prepare("UPDATE testimonios SET imagen='' WHERE id=?");
        $stmt2->bind_param('i', $id);
        $ok = $stmt2->execute();
        $stmt2->close();
        echo json_encode(['success' => $ok, 'trash' => $trashUrl ?? '']);
        exit;
    }
    echo json_encode(['success' => false, 'msg' => 'Falta id']);
    exit;
}

echo json_encode(['success' => false, 'msg' => 'Acción no válida']);
