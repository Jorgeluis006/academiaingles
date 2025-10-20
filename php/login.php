<?php
// login.php: recibe nombre y código por POST, valida contra la base de datos
require_once 'db.php';

$nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
$codigo = isset($_POST['codigo']) ? trim($_POST['codigo']) : '';

if ($nombre === '' || $codigo === '') {
    echo json_encode(['success' => false, 'msg' => 'Faltan datos']);
    exit;
}

$stmt = $conn->prepare('SELECT es_admin FROM usuarios WHERE nombre = ? AND codigo = ? LIMIT 1');
$stmt->bind_param('ss', $nombre, $codigo);
$stmt->execute();
$stmt->bind_result($es_admin);

if ($stmt->fetch()) {
    echo json_encode(['success' => true, 'admin' => $es_admin]);
} else {
    echo json_encode(['success' => false, 'msg' => 'Nombre o código incorrecto']);
}
$stmt->close();
$conn->close();
?>
