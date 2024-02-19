<?php

class Authenticator{

	private $dbDN = "sqlite:auth.db";
	private $tokenValidity = 600;

	private function createInitalDB(){
		$db = new PDO($this->dbDN);
		$db->exec("CREATE TABLE users (user TEXT, pass TEXT)");
		$db->exec("INSERT INTO users VALUES('admin','".md5("admin")."')");
		$db->exec("CREATE TABLE tokens (username TEXT, token TEXT, validTo INT)");
		unset($db);
	}

	private function createToken($username){

		$token = md5($username.time());
		$validTo = time()+$this->tokenValidity;

		$db = new PDO($this->dbDN);
		$stmt = $db->prepare("INSERT INTO tokens VALUES (:USER, :TOKEN, :VALIDTO)");
		$result = $stmt->execute(array(
			":USER" => $username,
			":TOKEN" => $token,
			":VALIDTO" => $validTo
			));
		unset($db);
		if($result){
			return $token;
		} else {
			return false;
		}
	}

	public function createUser($username,$password){
		$db = new PDO($this->dbDN);
		$stmt = $db->prepare("INSERT INTO users VALUES(:USER,:PASS)");
		$result = $stmt->execute(array(
			":USER" => $username,
			":PASS" => md5($password)
			));
		unset($db);
		return $result;
	}

	public function deleteUser($username){
		$db = new PDO($this->dbDN);
		$stmt = $db->prepare("DELETE FROM users WHERE user = :USER");
		$result = $stmt->execute(array(
			":USER" => $username
			));
		unset($db);
		return $result;
	}

	public function authUser($username,$password){
	        if(!file_exists("auth.db")){
                        $this->createInitalDB();
                }
		$db = new PDO($this->dbDN);
		$stmt = $db->prepare("SELECT COUNT(*) AS NUMUSER FROM users WHERE user = :USER and pass = :PASS");
		$result = $stmt->execute(array(
			":USER" => $username,
			":PASS" => md5($password)
			));
		if($result){
			$temp = $stmt->fetchAll();
			if(intval($temp[0]["NUMUSER"]) == 1){
				return $this->createToken($username);
			} else {
				return false;
			}
		} else {
			return false;
		}

	}

	public function verifyToken($username,$token){
		$db = new PDO($this->dbDN);
		$stmt = $db->prepare("SELECT COUNT(*) AS NUMTOK FROM tokens WHERE username = :USER and token = :TOKEN and validTo >= :VALIDTO");
		$result = $stmt->execute(array(
			":USER" => $username,
			":TOKEN" => $token,
			":VALIDTO" => time()
			));
		if($result){
			$temp = $stmt->fetchAll();
			if(intval($temp[0]["NUMTOK"]) == 1){
				$stmt2 = $db->prepare("UPDATE tokens SET validTo = :VALIDTO WHERE token = :TOKEN");
				$result = $stmt2->execute(array(
					":VALIDTO" => time()+$this->tokenValidity,
					":TOKEN" => $token
					));
				unset($db);
				return $result;
			} else {
				unset($db);
				return false;
			}
		} else {
			unset($db);
			return false;
		}

	}

	public function logoutToken($username, $token){
		$db = new PDO($this->dbDN);
		$stmt = $db->prepare("DELETE FROM tokens WHERE username = :USER AND token = :TOKEN");
		$result = $stmt->execute(array(
			":USER" => $username,
			":TOKEN" => $token
			));
		return $result;
	}
}
