(function () {
	'use strict';

	const app = angular.module('app', []);

	app.controller('mainController', function ($http) {

		const vm = this;

		vm.$onInit = () => {
			vm.uploadImages = uploadImages;
			vm.nextImage = nextImage;

			vm.showName = false;

			$http.get('/images')
				.then((res) => {
					vm.images = res.data.resources;
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

		function nextImage() {
			vm.showName = false;
			let index = Math.floor(Math.random() * vm.images.length);
			vm.image = vm.images[index];
		}

	});

})();
