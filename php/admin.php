<?php
// ...existing code...

if (isset($_POST['edit_testimonio'])) {
    $id = $_POST['id'];
    $nuevoContenido = $_POST['contenido'];
    $query = "UPDATE testimonios SET contenido='$nuevoContenido' WHERE id=$id";
    mysqli_query($conn, $query);
}

if (isset($_POST['delete_testimonio'])) {
    $id = $_POST['id'];
    $query = "DELETE FROM testimonios WHERE id=$id";
    mysqli_query($conn, $query);
}

// ...existing code...
?>