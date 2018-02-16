(function () {
	'use strict';

	const app = angular.module('app', []);

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
			vm.overlayClick = overlayClick;
			vm.startOverClick = startOverClick;

			vm.showOverlay = false;
			vm.gameOver = false;

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

		function overlayClick() {
			if (vm.gameOver) {
				return;
			}
			if (nextImage()) {
				vm.gameOver = true;
				vm.overlayText = "All done!"
			} else {
				vm.showOverlay = false;
			}
		}

		function startOverClick() {
			vm.gameOver = false;
			vm.showOverlay = false;
			getImages();
		}

		function nextImage() {
			if (vm.images.length === 0) {
				return true;
			}

			let index = Math.floor(Math.random() * vm.images.length);
			vm.image = vm.images[index];
			vm.overlayText = $filter('underscoreless')(vm.image.public_id);
			vm.images.splice(index, 1);
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
