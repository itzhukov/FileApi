let readears = [];

document.querySelector('.uFileUploader-input').addEventListener('change', handleFileSelect, false);
document.querySelector('.uFileUploader-cancel').addEventListener('click', abortRead, false);

function handleFileSelect(event) {
	let filesList = document.querySelector('.uFileUploader-filesList');
	let files = event.target.files;
	let filesLength = files.length;

	filesList.innerHTML = '';
	readears = [];

	for(let i=0; i<filesLength; i++){
		let file = files[i];
		let mb = parseInt(file.size/1024/1024);

		if (mb > 200) {
			alert('Превышен допустимый размер файла "'+file.name+'" !');
			console.error('Превышен допустимый размер файла "'+file.name+'" !');

		} else {
			let filetype = file.type;
			let isImage = false;
			if (!!~['image/jpeg', 'image/png'].indexOf(filetype)) isImage = true;

			let df = document.createDocumentFragment();

			let fileContailnerEl = document.createElement("div");
			fileContailnerEl.className = "uFileUploader-fileContailner uFileUploader-fileContailner"+i;

			let imgEl = document.createElement("img");
			imgEl.className = "uFileUploader-img";

			let linkEl = document.createElement("a");
			linkEl.target = "_black";
			linkEl.className = "uFileUploader-link";

			let progressBarEl = document.createElement("div");
			progressBarEl.className = "uFileUploader-progressbar uFileUploader-progressbar"+i;

			let percentEl = document.createElement("div");
			percentEl.className = "uFileUploader-percent";
			percentEl.textContent = "0%";

			progressBarEl.appendChild(percentEl);
			fileContailnerEl.appendChild(imgEl);
			fileContailnerEl.appendChild(linkEl);
			fileContailnerEl.appendChild(progressBarEl);
			df.appendChild(fileContailnerEl);

			filesList.appendChild(df);

			let fileContailner = document.querySelector('.uFileUploader-fileContailner'+i);
			let img = fileContailner.querySelector('.uFileUploader-img');
			let link = fileContailner.querySelector('.uFileUploader-link');
			let progressBar = fileContailner.querySelector('.uFileUploader-progressbar');
			let percent = progressBar.querySelector('.uFileUploader-percent');

			let reader = new FileReader();

			reader.onerror = errorHandler;

			reader.onprogress = function(event) {
				if (event.lengthComputable) {
					let percentLoaded = Math.round((event.loaded / event.total) * 100);

					if (percentLoaded < 100) {
						window.requestAnimationFrame(function(){
							setProgressbarValue(percent, percentLoaded);
						});
					}
				}
			}

			reader.onabort = function(event) {
				console.log('Загрузка отменена');
			};

			reader.onloadstart = function(event) {
				progressBar.classList.add('loading');
				progressBar.classList.add('preloading');
			};

			reader.onload = function(event) {
				window.requestAnimationFrame(function(){
					setProgressbarValue(percent, 100);
				});
			};

			reader.onloadend = function(event) {
		

				if (isImage) {
					img.src = reader.result;
				} else {
					img.classList.add('uFileUploader-img--notimage');
					img.src = '/icon_print.svg';
				}

				
				var fdata = new FormData()
				fdata.append(file.name, dataURItoBlob(reader.result), file.name );

				var xhr = new XMLHttpRequest();
				xhr.open('post', '/FileApi.php', true);

				xhr.upload.addEventListener("progress", function (event) {
					if (event.lengthComputable) {
						let progressPercent = Math.ceil(event.loaded / event.total * 100);

						window.requestAnimationFrame(function(){
							setProgressbarValue(percent, progressPercent);
						});
					}
				}, false);

				xhr.onloadstart = function (event) {
					progressBar.classList.add('loading');
					progressBar.classList.remove('preloading');
				}

				xhr.onloadend = function (event) {
					let responseText = xhr.responseText;
					if (responseText){
						let json = JSON.parse(responseText);
						console.info(json);

						progressBar.classList.remove('loading');

						if (json.success == true){
							let uploadedLink = json.link
							link.href = uploadedLink;
							link.textContent = file.name;
						}
					} else {
						console.error('Нет ответа от сервера');
					}
				}

				xhr.send(fdata);
			};

			readears.push(reader)
			reader.id = i;
			reader.readAsDataURL(file);
		}
	}
}

function setProgressbarValue(container, value) {
	container.style.width = value + '%';
	container.textContent = value + '%';
}

function dataURItoBlob(dataURI) {
	var byteString;
	if (dataURI.split(',')[0].indexOf('base64') >= 0)
		byteString = atob(dataURI.split(',')[1]);
	else
		byteString = unescape(dataURI.split(',')[1]);

	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	var ia = new Uint8Array(byteString.length);
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	return new Blob([ia], {type:mimeString});
}

function abortRead() {
	readearsLen = readears.length;

	for(let i=0; i<readearsLen; i++){
		readears[i].abort();
	}
}

function errorHandler(event) {
	let target = event.target;

	switch(target.error.code) {
		case target.error.NOT_FOUND_ERR:
			console.error('Файл не найден!');
			break;

		case target.error.NOT_READABLE_ERR:
			console.error('Невозможно прочесть файл!');
			break;

		case target.error.ABORT_ERR:
			break;

		default:
			console.error('Произошла ошибка при чтении файла!');
	};
}