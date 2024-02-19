<?php

class File {
	private $fullFilename = "";

	public function __construct($fullFilename){
		$this->fullFilename = $fullFilename;
	}

	public function doExists(){
		return file_exists($this->fullFilename);
	}

	public function getMimeType(){
		return mime_content_type($this->fullFilename);
	}

	public function getContent(){
		return file_get_contents($this->fullFilename);
	}

	public function delete(){
		return unlink($this->fullFilename);
	}

	public function getFilePath(){
		return dirname($this->fullFilename);
	}

	public function getFilename(){
		return basename($this->fullFilename);
	}

	protected function writeToFile($data,$flag){
		return file_put_contents($this->fullFilename,$data,$flag);
	}

	public function addContent($data){
		return $this->writeToFile($data,FILE_APPEND);
	}

	public function writeContent($data){
		return $this->writeToFile($data,0);
	}

	public function createFromUpload($file){
		move_uploaded_file($file['tmp_name'],$this->fullFilename);
	}
}
