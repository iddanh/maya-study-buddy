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

	app.controller('mainController', function ($http) {

		const vm = this;

		vm.$onInit = () => {
			vm.uploadImages = uploadImages;
			vm.imageClick = imageClick;

			vm.showName = false;

			$http.get('/images')
				.then((res) => {
					vm.images = res.data.resources;
					nextImage();
				});
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
			if (!vm.showName) {
				vm.showName = true;
				return;
			}
			vm.showName = false;
			nextImage();
		}

		function nextImage() {
			let index = Math.floor(Math.random() * vm.images.length);
			vm.image = vm.images[index];
		}

	});

})();
