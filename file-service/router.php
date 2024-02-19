<?php
header("Access-Control-Allow-Origin: *");
if($_SERVER["REQUEST_METHOD"] == "OPTIONS"){
	http_response_code(200);
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
	header("Access-Control-Allow-Headers: authorization, origin, content-type, accept, x-requested-with");
	header("Access-Control-Max-Age: 3600");
} else {
	include "index.php";
}
?>

