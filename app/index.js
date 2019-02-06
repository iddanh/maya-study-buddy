(function () {
  'use strict';

  const app = angular.module('app', ['cloudinary', 'ui.router']);

  app.config(function (cloudinaryProvider, $locationProvider, $stateProvider) {
    cloudinaryProvider
      .set("cloud_name", "hdzc7seee");

    $locationProvider.html5Mode(true);

    $stateProvider.state('default', {
      url: '/:roomName',
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
              return rooms[rooms.length - 1];
            }
            return rooms.filter(room => room.name === roomName)[0] || rooms[rooms.length - 1];

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

  app.controller('rootController', function ($location, $scope) {
    const vm = this;
    vm.$onInit = () => {
      firebase.database().ref('/rooms/').once('value').then((snapshot) => {
        $scope.$apply(() => {
          vm.rooms = snapshot.val();

          const roomName = $location.path().replace('/', '');
          vm.selectedRoom = roomName || vm.rooms[vm.rooms.length - 1].name;
        });
      });

      vm.greyscale = false;

      vm.selected = selected;
    };

    function selected() {
      $location.url(`/${vm.selectedRoom}`);
    }
  });

  app.controller('adminController', function ($scope, $state) {
    const vm = this;
    let rooms;

    vm.$onInit = () => {
      firebase.database().ref('/rooms/').once('value').then((snapshot) => {
        $scope.$apply(() => {
          vm.rooms = snapshot.val();
          vm.selectedRoom = vm.rooms[vm.rooms.length - 1].name;
          rooms = angular.copy(snapshot.val());
        });
      });

      vm.uploadImages = uploadImages;
      vm.add = add;
    };

    function uploadImages() {
      cloudinary.openUploadWidget({
          cloud_name: 'hdzc7seee',
          upload_preset: 'tkru709v',
          multiple: false,
          sources: ['local', 'url', 'image_search'],
          google_api_key: 'AIzaSyC7DbHoMV59Q5GDRN7y5IBRn8gGTQAQ6XA'
        },
        (error, result) => {
          $scope.$apply(() => {
            vm.image = result[0];
            vm.desc = result[0].original_filename;
          });
        }
      );
    }

    function add() {
      const newImage = {
        public_id: vm.image ? vm.image.public_id : '',
        desc: vm.desc || '',
        question: vm.question || ''
      };

      const roomsRef = firebase.database().ref('/rooms/');
      const currentRoom = rooms.filter(room => room.name === vm.selectedRoom)[0];
      if (!currentRoom.images) {
        currentRoom.images = [];
      }
      currentRoom.images.push(newImage);

      roomsRef.set(rooms);

      $state.reload();
    }
  });

  app.controller('mainController', function ($http, $filter, $location, room) {

    const vm = this;

    vm.$onInit = () => {
      vm.imageClick = imageClick;
      vm.nextQuestion = nextQuestion;
      vm.startOverClick = startOverClick;

      vm.showOverlay = false;
      vm.gameOver = false;
      vm.index = 0;

      // getImages();

      vm.room = angular.copy(room);
      nextImage();
    };

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

      vm.room = angular.copy(room);
      nextImage();
      // getImages();
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
