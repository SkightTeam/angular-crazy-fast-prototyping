angular.module('starter.services', [])

.factory('Compliments', function($firebaseArray) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var compliments = [{
    id: 0,
    name: 'Ben Sparrow',
    description: 'Kindly help the door open'
  }];

  var complimentsRef = new Firebase("https://angularu2015.firebaseio.com/compliments");

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
