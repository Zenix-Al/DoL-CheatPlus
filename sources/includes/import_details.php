<?php
$fileContent = file_get_contents('details.txt');
$data = json_decode($fileContent, true);
echo json_encode($data);
?>
