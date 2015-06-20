angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, auth, $state, store) {
  auth.signin({
    closable: false,
    // This asks for the refresh token
    // So that the user never has to log in again
    authParams: {
      scope: 'openid offline_access'
    }
  }, function(profile, idToken, accessToken, state, refreshToken) {
    store.set('profile', profile);
    store.set('token', idToken);
    store.set('refreshToken', refreshToken);
    auth.getToken({
      api: 'firebase'
    }).then(function(delegation) {
      store.set('firebaseToken', delegation.id_token);
      $state.go('tab.friends');
    }, function(error) {
      console.log("There was an error logging in", error);
    })
  }, function(error) {
    console.log("There was an error logging in", error);
  });
})


.controller('FriendsCtrl', function($scope, Friends, Camera, $ionicModal) {

  //setting logic for ionic modal
 $ionicModal.fromTemplateUrl('templates/friend-add-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.friends = Friends.all();
  $scope.formData = {};

  //use phone camera to take image
  $scope.takePhoto = function() {
    Camera.getPicture({
      sourceType:1,   //camera
      destinationType:0,  //base64
      saveToPhotoAlbum:false,
      correctOrientation:true
    })
      .then(function(imageURI) {
        $scope.imageURI = "data:image/jpeg;base64," + imageURI;
        $scope.formData.image = "data:image/jpeg;base64," + imageURI;
      }, function(err) {
        console.error(err);
      });
    };
    
  $scope.selectPhoto = function(){
    Camera.getPicture({
      sourceType:0,   //photo album,
      destinationType:0,  //base64
      saveToPhotoAlbum:false,
      correctOrientation:true
    })
      .then(function(imageURI) {
        $scope.imageURI = "data:image/jpeg;base64," + imageURI;   
        $scope.formData.image = "data:image/jpeg;base64," + imageURI;  
      }, function(err) {
          console.error(err);
      });
  };

  $scope.showAddFriend = function() {
    $scope.modal.show();
  };

  $scope.addFriend = function() {
    if(!$scope.formData.$id) {
      Friends.add($scope.formData);
    } else {
      Friends.save($scope.formData);
    }
    $scope.formData = {};
    $scope.imageURI = undefined;
    $scope.modal.hide();
  };

  $scope.cancel = function(){
    $scope.formData = {};
    $scope.imageURI = undefined;
    $scope.modal.hide();
  };

  
  $scope.formFields = [
      {
          //the key to be used in the model values {... "username": "johndoe" ... }
          key: 'name',
          type: 'input',
          templateOptions: {
              type: 'text',
              placeholder: 'Name',
          }
      },         
      {
          //the key to be used in the model values {... "username": "johndoe" ... }
          key: 'description',
          type: 'textarea',
          templateOptions: {
              placeholder: 'Description',
          }
      },{
          key: 'kindness',
          type: 'range',
          templateOptions: {
              label: 'Kindness',
              rangeClass: 'calm',
              min: '0',
              max: '100',
              step: '5',
              value: '25',
              minIcon: 'ion-heart-broken',
              maxIcon: 'ion-heart'
          }
      }

  ];

  $scope.deleteFriend = function(friend) {
    Friends.delete(friend);
  };

  $scope.editFriend = function(friend) {
    $scope.newFriend = friend;
    $scope.modal.show();
  };

  $scope.close = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope, auth, $state, store) {

  $scope.logout = function() {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    $state.go('login');
  }
});
