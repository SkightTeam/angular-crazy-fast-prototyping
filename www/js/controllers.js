angular.module('starter.controllers', [])

.controller('ComplimentsCtrl', function($scope, $ionicModal, Compliments) {

  $scope.formFields = [
    {
      key: 'name',
      type: 'input',
      templateOptions: {
        type:'text',
        placeholder: 'Name'
      }
    },
    {
      key: 'description',
      type: 'textarea',
      templateOptions: {
        placeholder: 'Comments'
      }
    }
  ];

  $scope.compliments = Compliments.all();

  $scope.newCompliment = {};

  //setting logic for ionic modal
 $ionicModal.fromTemplateUrl('templates/compliment-add-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  //show modal
  $scope.showAddCompliment = function() {
    $scope.modal.show();
  };

  //close modal
  $scope.close = function() {
    $scope.newCompliment = {};
    $scope.modal.hide();
  };

  $scope.save = function() {
    Compliments.add($scope.newCompliment);
    $scope.newCompliment = {};
    $scope.modal.hide();
  };

  //remove modal instance when controller is destroyed
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

})

.controller('ComplimentsDetailCtrl', function($scope, $stateParams, Compliments) {
  $scope.compliment = Compliments.get($stateParams.complimentsId);
  console.log($scope.compliment, $stateParams);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
