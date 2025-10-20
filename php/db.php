<?php
// Cambia estos valores por los de tu base de datos en Hostinger
$host = 'localhost';
$user = 'u602854038_admin';
$pass = 'Atisbe02062004';
$dbname = 'u602854038_atisbe_db';

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die('Error de conexión: ' . $conn->connect_error);
}
// $conn está listo para usarse
?>
