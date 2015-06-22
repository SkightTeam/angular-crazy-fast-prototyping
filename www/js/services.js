angular.module('starter.services', [])

.factory('Compliments', function($firebaseArray, store, $state) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var compliments = [{
    id: 0,
    name: 'Ben Sparrow',
    description: 'Kindly help the door open'
  }];

  var complimentsRef = new Firebase("https://angularu2015.firebaseio.com/compliments");

  // complimentsRef.authWithCustomToken(store.get('firebaseToken'), function(error, auth) {
  //   if (error) {
  //     // There was an error logging in, redirect the user to login page
  //     $state.go('tab.account');
  //   }
  // });

  var compliments = $firebaseArray(complimentsRef);

  return {
    all: function() {
      return compliments;
    },
    remove: function(compliment) {
      compliments.splice(compliments.indexOf(compliment), 1);
    },
    add: function(compliment){
      compliments.$add(compliment);
    },
    get: function(complimentId) {
      return compliments.$getRecord(complimentId);
    }
  };
})
.factory('Camera', ['$q', function($q) {


  return {
    
    getPicture: function(options) {
      var q = $q.defer();
      if(navigator.camera != undefined){
        navigator.camera.getPicture(function(result) {
          q.resolve(result);
        }, function(err) {
          q.reject(err);
        }, options);
      }else{
        q.reject(false);
      }

      return q.promise;
    }
  };
}]);
