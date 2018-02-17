(function () {
	'use strict';

	const app = angular.module('app', ['cloudinary']);

	app.config(function (cloudinaryProvider) {
		cloudinaryProvider
			.set("cloud_name", "hdzc7seee");
	});

	app.filter('underscoreless', function () {
		return function (input) {
			if (!input) {
				return;
			}
			return input.replace(/_/g, ' ');
		}
	});

	app.controller('mainController', function ($http, $filter) {

		const vm = this;

		vm.$onInit = () => {
			vm.uploadImages = uploadImages;
			vm.imageClick = imageClick;
			vm.nextQuestion = nextQuestion;
			vm.startOverClick = startOverClick;

			vm.showOverlay = false;
			vm.gameOver = false;
			vm.index = 0;

			getImages();
		};

		function uploadImages() {
			cloudinary.openUploadWidget({
					cloud_name: 'hdzc7seee',
					upload_preset: 'tkru709v'
				},
				(error, result) => {
					location.reload();
				}
			);
		}

		function imageClick() {
			vm.showOverlay = true;
		}

		function nextQuestion(removeImage) {
			if (vm.gameOver) {
				return;
			}
			if (nextImage(removeImage)) {
				vm.gameOver = true;
			} else {
				vm.showOverlay = false;
			}
		}

		function startOverClick() {
			vm.gameOver = false;
			vm.showOverlay = false;
			getImages();
		}

		function nextImage(removeLast) {
			if (removeLast) {
				vm.images.splice(vm.index, 1);
			}

			if (vm.images.length === 0) {
				return true;
			}

			vm.index = Math.floor(Math.random() * vm.images.length);
			vm.image = vm.images[vm.index];
			vm.overlayText = $filter('underscoreless')(vm.image.public_id);
		}

		function getImages() {
			$http.get('/images')
				.then((res) => {
					vm.images = res.data.resources;
					nextImage();
				});
		}

	});

})();
