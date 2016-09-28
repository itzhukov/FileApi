<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="UTF-8">
	<title>File API</title>
	<link rel="stylesheet" href="style.css">
</head>
<body>
	<div class="uFileUploader">
		<label class="uFileUploader-label" for="files" class="btn">Выбрать файлы</label>
		<input class="uFileUploader-input" type="file" id="files"name="files[]" multiple accept=".pdf, .png, .jpg, .bmp, .gif, .doc, .docx, .rtf, .xls, .xlsx, .ods, .odt, .txt, .zip, .rar, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel">
		<div class="uFileUploader-cancel">Прервать загрузку</div>
		<div class="uFileUploader-filesList"></div>
	</div>

	<script src="main.js"></script>
</body>
</html>