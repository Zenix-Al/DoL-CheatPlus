<?php
$savedata = $_POST['savedata'];
$file = 'details.txt';
file_put_contents($file, $savedata);
$response = 'Data saved successfully!';
echo $response;
?>
