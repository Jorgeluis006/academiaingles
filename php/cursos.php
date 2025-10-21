
<?php
// API para listar, agregar, editar y eliminar cursos (solo admin)
require_once 'db.php';

$action = $_GET['action'] ?? '';

if ($action === 'eliminar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';
    if ($id) {
        // delete image file if present
        $stmtImg = $conn->prepare("SELECT imagen FROM cursos WHERE id=? LIMIT 1");
        if ($stmtImg) {
            $stmtImg->bind_param('i', $id);
            $stmtImg->execute();
            $stmtImg->bind_result($oldImage);
            if ($stmtImg->fetch()) {
                // remove local upload if inside uploads dir
                $uploadsDir = realpath(__DIR__ . '/../uploads');
                $filePath = realpath(__DIR__ . '/../' . ltrim($oldImage, '/'));
                if ($filePath && $uploadsDir && strpos($filePath, $uploadsDir) === 0 && is_file($filePath)) {
                            // move to trash instead of immediate deletion
                            $trashDir = __DIR__ . '/../uploads/trash';
                            if (!is_dir($trashDir)) @mkdir($trashDir, 0755, true);
                            $newName = bin2hex(random_bytes(6)) . '_' . basename($filePath);
                            $trashed = $trashDir . '/' . $newName;
                            @rename($filePath, $trashed);
                            $trashUrl = '/uploads/trash/' . $newName;
                        }
            }
            $stmtImg->close();
        }

        $stmt = $conn->prepare("DELETE FROM cursos WHERE id=?");
        $stmt->bind_param('i', $id);
        $ok = $stmt->execute();
        $stmt->close();
        echo json_encode(['success' => $ok]);
        exit;
    }
    echo json_encode(['success' => false, 'msg' => 'Falta el id']);
    exit;
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
            $dest = __DIR__ . '/../uploads/courses/' . $newName;
            @rename($trashPath, $dest);
            $newUrl = '/uploads/courses/' . $newName;
            $stmt = $conn->prepare("UPDATE cursos SET imagen=? WHERE id=?");
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

// delete image only
if ($action === 'eliminar_imagen' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';
    if ($id) {
        $stmt = $conn->prepare("SELECT imagen FROM cursos WHERE id=? LIMIT 1");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $stmt->bind_result($img);
        if ($stmt->fetch()) {
            $uploadsDir = realpath(__DIR__ . '/../uploads');
            $filePath = realpath(__DIR__ . '/../' . ltrim($img, '/'));
            if ($filePath && $uploadsDir && strpos($filePath, $uploadsDir) === 0 && is_file($filePath)) {
                @unlink($filePath);
            }
        }
        $stmt->close();
        $stmt2 = $conn->prepare("UPDATE cursos SET imagen='' WHERE id=?");
        $stmt2->bind_param('i', $id);
        $ok = $stmt2->execute();
        $stmt2->close();
        echo json_encode(['success' => $ok, 'trash' => $trashUrl ?? '']);
        exit;
    }
    echo json_encode(['success' => false, 'msg' => 'Falta id']);
    exit;
}

if ($action === 'listar') {
    $result = $conn->query("SELECT * FROM cursos ORDER BY id ASC");
    $cursos = [];
    while ($row = $result->fetch_assoc()) {
        $cursos[] = $row;
    }
    echo json_encode(['success' => true, 'cursos' => $cursos]);
    exit;
}

if ($action === 'agregar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $titulo = $_POST['titulo'] ?? '';
    $descripcion = $_POST['descripcion'] ?? '';
    $imagen = $_POST['imagen'] ?? '';
    if ($titulo && $descripcion && $imagen) {
        $stmt = $conn->prepare("INSERT INTO cursos (titulo, descripcion, imagen) VALUES (?, ?, ?)");
        $stmt->bind_param('sss', $titulo, $descripcion, $imagen);
        $ok = $stmt->execute();
        $stmt->close();
        echo json_encode(['success' => $ok]);
        exit;
    }
    echo json_encode(['success' => false, 'msg' => 'Faltan datos']);
    exit;
}

if ($action === 'editar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';
    $titulo = $_POST['titulo'] ?? '';
    $descripcion = $_POST['descripcion'] ?? '';
    $imagen = $_POST['imagen'] ?? '';
    if ($id && $titulo && $descripcion && $imagen) {
        // remove old image when replacing
        $stmtOld = $conn->prepare("SELECT imagen FROM cursos WHERE id=? LIMIT 1");
        if ($stmtOld) {
            $stmtOld->bind_param('i', $id);
            $stmtOld->execute();
            $stmtOld->bind_result($oldImage);
            if ($stmtOld->fetch()) {
                if ($oldImage !== $imagen) {
                    $uploadsDir = realpath(__DIR__ . '/../uploads');
                    $filePath = realpath(__DIR__ . '/../' . ltrim($oldImage, '/'));
                    if ($filePath && $uploadsDir && strpos($filePath, $uploadsDir) === 0 && is_file($filePath)) {
                        @unlink($filePath);
                    }
                }
            }
            $stmtOld->close();
        }

        $stmt = $conn->prepare("UPDATE cursos SET titulo=?, descripcion=?, imagen=? WHERE id=?");
        $stmt->bind_param('sssi', $titulo, $descripcion, $imagen, $id);
        $ok = $stmt->execute();
        $stmt->close();
        echo json_encode(['success' => $ok]);
        exit;
    }
    echo json_encode(['success' => false, 'msg' => 'Faltan datos']);
    exit;
}

echo json_encode(['success' => false, 'msg' => 'Acción no válida']);
