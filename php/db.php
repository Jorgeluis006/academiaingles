<?php
// Cambia estos valores por los de tu base de datos en Hostinger
$host = 'localhost';
$user = 'u6E02B4C38E_admin';
$pass = 'Atisbe02082004';
$dbname = 'u6E02B4C38E_atisbe_db';

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die('Error de conexión: ' . $conn->connect_error);
}
// $conn está listo para usarse
?>
