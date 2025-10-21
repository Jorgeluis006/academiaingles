<?php
require_once 'db.php';
$action = $_GET['action'] ?? '';

if ($action === 'listar') {
    $result = $conn->query("SELECT * FROM testimonios ORDER BY creado_at DESC");
    $items = [];
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
    echo json_encode(['success' => true, 'testimonios' => $items]);
    exit;
}

if ($action === 'agregar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre'] ?? '';
    $contenido = $_POST['contenido'] ?? '';
    $video_url = $_POST['video_url'] ?? null;
    if ($nombre && $contenido) {
        $stmt = $conn->prepare("INSERT INTO testimonios (nombre, contenido, video_url) VALUES (?, ?, ?)");
        $stmt->bind_param('sss', $nombre, $contenido, $video_url);
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
    $nombre = $_POST['nombre'] ?? '';
    $contenido = $_POST['contenido'] ?? '';
    $video_url = $_POST['video_url'] ?? null;
    if ($id && $nombre && $contenido) {
        $stmt = $conn->prepare("UPDATE testimonios SET nombre=?, contenido=?, video_url=? WHERE id=?");
        $stmt->bind_param('sssi', $nombre, $contenido, $video_url, $id);
        $ok = $stmt->execute();
        $stmt->close();
        echo json_encode(['success' => $ok]);
        exit;
    }
    echo json_encode(['success' => false, 'msg' => 'Faltan datos']);
    exit;
}

if ($action === 'eliminar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';
    if ($id) {
        $stmt = $conn->prepare("DELETE FROM testimonios WHERE id=?");
        $stmt->bind_param('i', $id);
        $ok = $stmt->execute();
        $stmt->close();
        echo json_encode(['success' => $ok]);
        exit;
    }
    echo json_encode(['success' => false, 'msg' => 'Falta el id']);
    exit;
}

echo json_encode(['success' => false, 'msg' => 'Acción no válida']);
