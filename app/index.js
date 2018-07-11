(function () {
	'use strict';

	const app = angular.module('app', ['cloudinary', 'ui.router']);

	app.config(function (cloudinaryProvider, $locationProvider, $stateProvider) {
		cloudinaryProvider
			.set("cloud_name", "hdzc7seee");

		$locationProvider.html5Mode(true);

		$stateProvider.state('default', {
			url: '/{roomName}',
			templateUrl: '/templates/default.html',
			controller: 'mainController',
			controllerAs: 'vm',
			resolve: {
				room: function ($transition$) {
					const database = firebase.database();
					return database.ref('/rooms/').once('value').then((snapshot) => {
						const rooms = snapshot.val();
						const roomName = $transition$.params().roomName;
						if (!roomName) {
							return rooms[0];
						}
						return rooms.filter(room => room.name === roomName)[0] || rooms[0];

					});
				}
			}
		}).state('admin', {
			url: '/mayacool',
			templateUrl: '/templates/admin.html',
			controller: 'adminController',
			controllerAs: 'vm'
		})
	});

	app.filter('underscoreless', function () {
		return function (input) {
			if (!input) {
				return;
			}
			return input.replace(/_/g, ' ');
		}
	});

	app.controller('rootController', function ($location) {
		const vm = this;
		vm.$onInit = () => {
			firebase.database().ref('/rooms/').once('value').then((snapshot) => {
				vm.rooms = snapshot.val();
				vm.selectedRoom = vm.rooms[0].name;
			});

			vm.selected = selected;
		};

		function selected() {
			$location.url(`/${vm.selectedRoom}`);
		}
	});

	app.controller('adminController', function () {
		const vm = this;

		vm.$onInit = () => {
			vm.hello = 'world';
		};
	});

	app.controller('mainController', function ($http, $filter, $location, room) {

		const vm = this;

		vm.$onInit = () => {
			console.log(room);

			vm.uploadImages = uploadImages;
			vm.imageClick = imageClick;
			vm.nextQuestion = nextQuestion;
			vm.startOverClick = startOverClick;

			vm.showOverlay = false;
			vm.gameOver = false;
			vm.index = 0;

			// getImages();

			vm.room = room;
			nextImage();
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
				vm.room.images.splice(vm.index, 1);
			}

			if (vm.room.images.length === 0) {
				return true;
			}

			vm.index = Math.floor(Math.random() * vm.room.images.length);
			vm.image = vm.room.images[vm.index];
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
