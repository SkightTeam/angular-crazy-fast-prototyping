angular.module('starter.services', [])

.factory('Compliments', function($firebaseArray) {
  // Might use a resource here that returns a JSON array

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