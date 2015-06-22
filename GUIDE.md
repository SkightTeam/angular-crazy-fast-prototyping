//TODO remove angularU context and rename app complimeme

## Step 1

Create app

`ionic start complimeme tabs`

Change states in app.js

We can utilize the structure of our starter app to do some of the work for us.  We will use tab-chats and chat-details as our compliments and compliment detail states, partials, and controllers

```js
//repurposed states in app.js
.state('tab.compliments', {
	url: '/compliments',
	views: {
	  'tab-compliments': {
	    templateUrl: 'templates/tab-compliments.html',
	    controller: 'ComplimentsCtrl'
	  }
	}
})
.state('tab.compliments-detail', {
	url: '/compliments/:complimentsId',
	views: {
	  'tab-compliments': {
	    templateUrl: 'templates/compliments-detail.html',
	    controller: 'ComplimentsDetailCtrl'
	  }
	}
})
$urlRouterProvider.otherwise('/tab/account');

//repurpose controllers.js to add compliments via $ionicModal
.controller('ComplimentsCtrl', function($scope, $ionicModal, Compliments) {

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

//repurpose service.js for compliments rather then chats
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
```

```html
<!-- tab-chats.html to tab-compliments.html -->
<ion-view title="Compliments">
  <ion-nav-buttons side="right">
    <button class="button button-clear button-positive" ng-click="showAddCompliment()">
      Add
    </button>
  </ion-nav-buttons>
  <ion-content class="has-header">
    <ion-list>
      <ion-item ng-repeat="compliment in compliments" type="item-text-wrap" href="#/tab/compliments/{{compliment.id}}">
        {{compliment.name}}
      </ion-item>
    </ion-list>
  </ion-content>
</ion-view>

<!-- chats-detail.html to compliments-detail.html -->
<ion-view title="{{compliment.name}}">
  <ion-content has-header="true" padding="true">
    <div class="list card">
      <div class="item">
        <h2>{{compliment.name}}</h2>
      </div>
      <div class="item item-body">
        <p>
          {{compliment.description}}
        </p>
      </div>
    </div>
  </ion-content>
</ion-view>

<!-- update tabs.html navigation -->
<ion-tabs class="tabs-icon-top tabs-color-active-positive">
  <!-- Compliments Tab -->
  <ion-tab title="Compliments" icon-off="ion-ios-heart-outline" icon-on="ion-ios-heart" href="#/tab/compliments">
    <ion-nav-view name="tab-compliments"></ion-nav-view>
  </ion-tab>
  <!-- Account Tab -->
  <ion-tab title="Account" icon-off="ion-ios-gear-outline" icon-on="ion-ios-gear" href="#/tab/account">
    <ion-nav-view name="tab-account"></ion-nav-view>
  </ion-tab>
</ion-tabs>
```

Okay so now that we have altered existing files let's create a new one.  We are making the modal template for adding a compliment

```html
<ion-modal-view>
  <ion-header-bar>
    <div class="buttons">
      <button class="button ion-close-round button-clear" ng-click="close()"></button>
    </div>
    <h1 class="title">Make A New Compliment!</h1>
  </ion-header-bar>
  <ion-content class="padding">
    <div class="list">
      <label class="item item-input">
        <input type="text" placeholder="First Name" ng-model="newCompliment.name">
      </label>
      <label class="item item-input">
        <textarea placeholder="Comments" ng-model="newCompliment.description"></textarea>
      </label>
      <button class="button button-block button-positive" ng-click="save()">
        save
      </button>
    </div>
  </ion-content>
</ion-modal-view>
```

Now we can delete the files and parts of files that we aren't using.

```
//in app.js
.state('tab.dash', {
	url: '/dash',
	views: {
	  'tab-dash': {
	    templateUrl: 'templates/tab-dash.html',
	    controller: 'DashCtrl'
	  }
	}
})
```

And completely delete the files that we aren't using at all

`./www/templates/tab-dash.html`


PHASE 3

Follow README file
add form fields to controller
add directive to add modal partial
add awesomeness to compliments-detail
**NOTE need to move scale for value to be set

PHASE 4

follow readme for installation, deps, and DI
update Compliments factory
add $ to id in compliments partial

PHASE 5

add cordova camera plugin
add camera service
add camera logic to controller
add Camera service to controller
update add compliment modal
update compliment detail view
add custom styles

PHASE 6

