<?php

/**
Spec:


/login ... => login user
/logout .. => logout user

/... => URL to files and folders:

GET /<DIR>
= return file/folders in this dir

POST /<DIR>
= create the directory and send message back

DELETE <DIR>
= delete the directory

GET /<file>
= return binary data of file

POST /<file>
= create the file with corresponding content

DELETE /<file>
= delete the file and send message


Authentication workflow:

POST /login with username password => return token

All other requests:
authorization: Basic base64(username.token)

*/

require "lib/Folder.php";
require "lib/File.php";
require "lib/Authenticator.php";

$authorized = false;

//first check if user is valid
$headers = getallheaders();
$auth = array(2);
if(isset($headers["Authorization"])){
	$temp = explode(" ",$headers["Authorization"]);
	$raw_auth = base64_decode($temp[1]);
	$auth = explode(":",$raw_auth);
	$authenticator = new Authenticator();
	$authorized = $authenticator->verifyToken($auth[0],$auth[1]);
}

$url = filter_input(INPUT_SERVER,"REQUEST_URI",FILTER_SANITIZE_URL);

$paramPos = strpos($url,"?");
if($paramPos == 0){
	$path = $url;
} else {
	$path = substr($url,0,$paramPos);
}



$method = filter_input(INPUT_SERVER,"REQUEST_METHOD",FILTER_SANITIZE_FULL_SPECIAL_CHARS);
if($path != "/login" && !$authorized){
	http_response_code(401);
	echo '{"error": "authorization failed"}';
} else if($path == "/login"){
	$username = filter_input(INPUT_POST,"username",FILTER_SANITIZE_FULL_SPECIAL_CHARS);
	$password = filter_input(INPUT_POST,"password",FILTER_SANITIZE_FULL_SPECIAL_CHARS);
	$authenticator = new Authenticator();
	$result = $authenticator->authUser($username, $password);
	if(!$result){
		http_response_code(401);
		echo '{"error": "authentication failed"}';
	} else {
		http_response_code(200);
		echo '{"token": "'.$result.'"}';
	}
} else if($path == "/logout"){
	if(count($auth) > 0){
		$authenticator = new Authenticator();
		if(!$authenticator->logoutToken($auth[0], $auth[1])){
			http_response_code(500);
			echo '{"error": "logout failed"}';
		} else {
			http_response_code(200);
			echo '{"message": "logout successful"}';
		}
	}
} else if($authorized){
	$fullPath = __DIR__."/data".urldecode($path);

	if($method == "GET"){
		$isDir = Folder::isDirectory($fullPath);
		if($isDir){
			$dir = new Folder($fullPath);
			$entries = $dir->getEntries();
			if($entries === false){
				http_response_code(500);
				echo '{"error": "failed to load directory entries"}';
			} else {
				http_response_code(200);
				echo json_encode($entries);
			}
		} else {
			$file = new File($fullPath);
			if($file->doExists()){
 				if(isset($_GET["format"]) && filter_input(INPUT_GET,"format",FILTER_SANITIZE_FULL_SPECIAL_CHARS) == "base64"){
					echo base64_encode($file->getContent());
				} else {
					header('Content-Type: '.$file->getMimeType());
					header('Content-Disposition: attachment; filename="'.$file->getFilename().'"');
					echo $file->getContent();
				}
			} else {
				http_response_code(500);
				echo '{"error": "file does not exist"}';
			}
		}
	}

	if($method == "POST"){
		if(isset($_POST["type"]) && filter_input(INPUT_POST,"type",FILTER_SANITIZE_FULL_SPECIAL_CHARS) == "dir"){
			$isDir = true;
		} else {
			$isDir = false;
		}
		if($isDir){
			$dir = new Folder($fullPath);
			if($dir->create() === false){
				http_response_code(500);
				echo '{"error": "failed to create directory"}';
			} else {
				http_response_code(200);
				echo '{"message": "directory created successfully"}';
			}
		} else {
			if(count($_FILES) == 0){ //no upload
				$file = new File($fullPath);
				//no filter, since we need to write the file as is
				$result = $file->writeContent(base64_decode($_POST["content"]));
			} else {
				$file = new File($fullPath);
				$result = $file->createFromUpload($_FILES["newFile"]);
			}

			if($result === false){
	                        http_response_code(500);
                                echo '{"error": "faild to write file"}';
                        } else {
                                http_response_code(200);
        	                echo '{"message": "file written successfully"}';
                        }
		}
	}

	if($method == "DELETE"){
		$isDir = Folder::isDirectory($fullPath);
                if($isDir){
                        $dir = new Folder($fullPath);
                        if(!$dir->delete()){
                                http_response_code(500);
                                echo '{"error": "failed to delete directory"}';
                        } else {
                                http_response_code(200);
                                echo '{"message": "directory deleted successfully"}';
                        }
                } else {
			$file = new File($fullPath);
			if(!$file->delete()){
				http_response_code(500);
				echo '{"error": "failed to delete file"}';
			} else {
				http_response_code(200);
				echo '{"message": "file deleted successfully"}';
			}
                }

	}

}
