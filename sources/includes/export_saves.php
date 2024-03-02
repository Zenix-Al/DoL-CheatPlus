<?php
$savedata = $_POST['savedata'];
$file = 'saves.txt';
file_put_contents($file, $savedata);
$response = 'Data saved successfully!';
echo $response;
?>
