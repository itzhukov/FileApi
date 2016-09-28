<?php
	$uploaddir = __DIR__.'/uploads/';

	foreach ($_FILES as $key => $value){
		$uploadfile = $uploaddir . basename($value['name']);

		$success = false;
		$message = '';
		$link =  null;

		if (move_uploaded_file($value['tmp_name'], $uploadfile)) {
			$message =  "Файл загружен";
			$link = $_SERVER['HTTP_ORIGIN'].'/uploads/'.$value['name'];
			$success = true;
		} else {
			$message =  "Ошибка при загрузке файла";
		}

		echo json_encode([
			'success' => $success,
			'message' => $message,
			'link' => $link
		]);
	}
?>