window.requestAnimFrame = (function(){
	return window.requestAnimationFrame    ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		function( callback ){
		window.setTimeout(callback, 1000 / 60);
	};
})();

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

		if (mb > 35) {
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

			let progressBarEl = document.createElement("div");
			progressBarEl.className = "uFileUploader-progressbar uFileUploader-progressbar"+i;

			let percentEl = document.createElement("div");
			percentEl.className = "uFileUploader-percent";
			percentEl.textContent = "0%";

			progressBarEl.appendChild(percentEl);
			fileContailnerEl.appendChild(imgEl);
			fileContailnerEl.appendChild(progressBarEl);
			df.appendChild(fileContailnerEl);

			filesList.appendChild(df);

			let fileContailner = document.querySelector('.uFileUploader-fileContailner'+i);
			let img = fileContailner.querySelector('.uFileUploader-img');
			let progressBar = fileContailner.querySelector('.uFileUploader-progressbar');
			let percent = progressBar.querySelector('.uFileUploader-percent');

			let reader = new FileReader();

			reader.onerror = errorHandler;

			reader.onprogress = function(event) {
				if (event.lengthComputable) {
					let percentLoaded = Math.round((event.loaded / event.total) * 100);

					if (percentLoaded < 100) {
						window.requestAnimationFrame(function(){
							percent.style.width = percentLoaded + '%';
							percent.textContent = percentLoaded + '%';
						});
					}
				}
			}

			reader.onabort = function(event) {
				console.log('File read cancelled');
			};

			reader.onloadstart = function(event) {
				progressBar.classList.add('loading');
			};

			reader.onload = function(event) {
				if (isImage) {
					img.src = reader.result;
				} else {
					img.classList.add('uFileUploader-img--notimage');
					img.src = 'https://uremont.com/img/icon_print.svg';
				}

				window.requestAnimationFrame(function(){
					percent.style.width = '100%';
					percent.textContent = '100%';
				});
			};

			reader.onloadend = function(event) {
				progressBar.classList.remove('loading');
			};

			readears.push(reader)
			reader.readAsDataURL(file);
		}
	}
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