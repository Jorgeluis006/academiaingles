<?php
// upload_image.php: recibe un archivo y lo guarda en /uploads/courses
header('Content-Type: application/json; charset=utf-8');

// Allow only POST with file
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($_FILES['file'])) {
    echo json_encode(['success' => false, 'msg' => 'No se recibió archivo']);
    exit;
}

$file = $_FILES['file'];
// folder type: courses or testimonios
$type = isset($_GET['type']) ? $_GET['type'] : 'courses';
$allowedTypes = ['courses', 'testimonios'];
if (!in_array($type, $allowedTypes)) $type = 'courses';
if ($file['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'msg' => 'Error en la subida']);
    exit;
}

$maxSize = 5 * 1024 * 1024; // 5 MB
if ($file['size'] > $maxSize) {
    echo json_encode(['success' => false, 'msg' => 'El archivo es demasiado grande']);
    exit;
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($file['tmp_name']);
$allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
if (!isset($allowed[$mime])) {
    echo json_encode(['success' => false, 'msg' => 'Tipo de archivo no permitido']);
    exit;
}

$ext = $allowed[$mime];
// store in uploads/<type>
$uploadDir = __DIR__ . '/../uploads/' . $type;
if (!is_dir($uploadDir)) {
    @mkdir($uploadDir, 0755, true);
}

$basename = bin2hex(random_bytes(8)) . '_' . time();
$filename = $basename . '.' . $ext;
$target = $uploadDir . '/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $target)) {
    echo json_encode(['success' => false, 'msg' => 'No se pudo guardar el archivo']);
    exit;
}

$url = '/uploads/' . $type . '/' . $filename;
echo json_encode(['success' => true, 'url' => $url]);
exit;

?>
