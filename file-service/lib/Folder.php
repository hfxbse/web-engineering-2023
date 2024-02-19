<?php

class Folder{
	private $fullDirname = "";

	public static function isDirectory($fullPath){
		return is_dir($fullPath);
	}

	public function __construct($fullDirname){
		if(substr($fullDirname,-1,1)=="/" && $fullDirname != "/"){
			$fullDirname=substr($fullDirname,0,-1);
		}
		$this->fullDirname = $fullDirname;
	}

	public function create(){
		return mkdir($this->fullDirname);
	}

	public function isEmpty(){
		return (count(scandir($this->fullDirname)) <= 2);
	}

	public function delete(){
		if($this->isEmpty()){
			return rmdir($this->fullDirname);
		}else{
			return false;
		}
	}

	public function getFoldername(){
		return basename($this->fullDirname);
	}

	public function getFolderpath(){
		return dirname($this->fullDirname);
	}

	public function getEntries(){
		$entries = array();
		if($dir = opendir($this->fullDirname)){

			while (false !== ($entry = readdir($dir))) {
				if($entry != "." && $entry != ".."){
					if(is_dir($this->fullDirname."/".$entry)){
						$temp = array("Name" => $entry, "Type" => "dir");
					}else{
						$temp = array("Name" => $entry, "Type" => mime_content_type($this->fullDirname."/".$entry));
					}
					array_push($entries,$temp);
				}
			}

			closedir($dir);
			return $entries;

		}else{
			return false;
		}
	}
}
