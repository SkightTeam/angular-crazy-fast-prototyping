angular.module('starter.services', [])

.factory('Compliments', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var compliments = [{
    id: 0,
    name: 'Ben Sparrow',
    description: 'Kindly help the door open'
  }];

  return {
    all: function() {
      return compliments;
    },
    remove: function(compliment) {
      compliments.splice(compliments.indexOf(compliment), 1);
    },
    add: function(compliment){
      var newId = compliments.length;
      compliment.id = newId;
      compliments.push(compliment);
    },
    get: function(complimentId) {
      for (var i = 0; i < compliments.length; i++) {
        if (compliments[i].id === parseInt(complimentId)) {
          return compliments[i];
        }
      }
      return null;
    }
  };
});
