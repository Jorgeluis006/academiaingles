
<?php
// API para listar, agregar, editar y eliminar cursos (solo admin)
require_once 'db.php';

$action = $_GET['action'] ?? '';

if ($action === 'eliminar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';
    if ($id) {
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
