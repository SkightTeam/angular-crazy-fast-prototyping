# Crazy Fast Prototyping

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

## Step 2

`ionic upload`

Download Ionic View onto your phone and sync your account

or signup online

https://apps.ionic.io/signup


## Step 3

Install Formly with Bower

```bash
$ bower install api-check angular-formly angular-formly-templates-ionic --save
```

Reference the files in your `index.html`

```html
<!-- right below ionic.bundle.js -->
<script src="lib/api-check/dist/api-check.js"></script>
<script src="lib/angular-formly/dist/formly.js"></script>
<script src="lib/angular-formly-templates-ionic/dist/angular-formly-templates-ionic.js"></script>
```

Then inject the templates into your project.

```javascript
angular.module('myApp', ['ionic', 'formlyIonic'])
```

Add formField configuration to controller

```js
//added to controllers.js ComplimentsCtrl
$scope.formFields = [
    {
        key: 'name',
        type: 'input',
        templateOptions: {
            type: 'text',
            placeholder: 'Name'
        }
    },
    {
        key: 'description',
        type: 'textarea',
        templateOptions: {
            placeholder: 'Comments'
        }
    },
    {
        key: 'awesomeness',
        type: 'range',
        templateOptions: {
            label: 'Awesomeness',
            rangeClass: "calm",
            min: '0',
            max: '100',
            step: '5',
            value: '25',
            minIcon: 'ion-arrow-graph-down-left',
            maxIcon: 'ion-arrow-graph-up-right'

        }
    }
];
```

Add formly directive to partial

```html
<!-- to compliments-add-modal.html -->
<ion-modal-view>
  <ion-header-bar>
    <div class="buttons">
      <button class="button ion-close-round button-clear" ng-click="close()"></button>
    </div>
    <h1 class="title">Make A New Compliment!</h1>
  </ion-header-bar>
  <ion-content class="padding">
    <form >
      <formly-form model="newCompliment" fields="formFields">
        <button class="button button-block button-positive" ng-click="save()">
          Save
        </button>
      </formly-form>
    </form>
  </ion-content>
</ion-modal-view>
```

We are using a version of Formly tailored for Ionic

http://formly-js.github.io/angular-formly-templates-ionic/#/


## Step 4

View Firebase's resource for getting started

https://www.firebase.com/docs/web/libraries/angular/quickstart.html

We need to install our dependencies: `firebase` and `angularfire`

```bash
bower install firebase angularfire --save
```

Now we need to load those dependencies so our app can use them.

```html
<!-- adding to our index.html -->
<script src="lib/firebase/firebase.js"></script>
<script src="lib/angularfire/dist/angularfire.js"></script>
```

```js
var app = angular.module("sampleApp", ["firebase"]);
```

In our example app we utilize `$firebaseArray`

https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebasearray

We can update our Compliments Factory to utilize Firebase to make data realtime

```js
//adding $firebaseArray to our services.js file
.factory('Compliments', function($firebaseArray) {

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
```

and now that Firebase is dynamically creating our ID's we need to change our tab-compliments.html template

```html
<!-- changing compliment.id to compliment.$id -->
<ion-view title="Compliments">
  <ion-nav-buttons side="right">
    <button class="button button-clear button-positive" ng-click="showAddCompliment()">
      Add
    </button>
  </ion-nav-buttons>
  <ion-content class="has-header">
    <ion-list>
      <ion-item ng-repeat="compliment in compliments" type="item-text-wrap" href="#/tab/compliments/{{compliment.$id}}">
        {{compliment.name}}
      </ion-item>
    </ion-list>
  </ion-content>
</ion-view>
```

## Step 5

Cordova Plugins

Add Cordova Camera Plugin

```
cordova plugin add cordova-plugin-camera
```

Create Camera Service

```js
//added to our services.js file
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
```

Add logic to controller

```js
//added to controllers.js ComplimentsCtrl

.controller('ComplimentsCtrl', function($scope, $ionicModal, Compliments, Camera) {

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
        $scope.newCompliment.image = "data:image/jpeg;base64," + imageURI;
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
        $scope.newCompliment.image = "data:image/jpeg;base64," + imageURI;  
      }, function(err) {
          console.error(err);
      });
  };

  ......

```

Update templates

```html
<!-- compliments-add-modal.html -->
<ion-modal-view>
  <ion-header-bar>
    <div class="buttons">
      <button class="button ion-close-round button-clear" ng-click="close()"></button>
    </div>
    <h1 class="title">Make A New Compliment!</h1>
  </ion-header-bar>
  <ion-content class="padding">
    <form >
      <formly-form model="newCompliment" fields="formFields">
        <div class="row">
          <div class="col">
            <button class="button button-block" ng-click="takePhoto()">Take A Photo</button>
          </div>
          <div class="col">
            <button class="button button-block" ng-click="selectPhoto()">Choose A Photo</button>
          </div>
        </div>
        <button class="button button-block button-positive" ng-click="save()">
          Save
        </button>
      </formly-form>
    </form>
    <div class="friend-photo">
        <img ng-src="{{imageURI}}" ng-if="imageURI">
    </div>
  </ion-content>
</ion-modal-view>

<!-- comliments-detail.html -->
<ion-view title="{{compliment.name}}">
  <ion-content has-header="true" padding="true">
    <div class="list card">
      <div class="item item-avatar">
        <img ng-src="{{compliment.image}}">
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
```

Add custom styles

```css
/* added to styles.css */
.friend-photo img {
  max-width: 100%;
  height: auto;
}
```

## Step 6

Setting up the callback URL in Auth0

Go to the Application Settings section in the Auth0 dashboard and make sure that Allowed Callback URLs contains the following value:

```
https://angularu.auth0.com/mobile
```

Also, if you are testing your application locally, make sure to add your local URL as an Allowed Callback URL and the following as an Allowed Origin (CORS):

```
file://*
```

Adding Auth0 dependencies

```bash
bower install auth0-angular a0-angular-storage angular-jwt --save
```

Add the references to the scripts in the `index.html`

```html
<!-- Auth0 Lock -->
<script src="lib/auth0-lock/build/auth0-lock.js"></script>
<!-- auth0-angular -->
<script src="lib/auth0-angular/build/auth0-angular.js"></script>
<!-- angular storage -->
<script src="lib/a0-angular-storage/dist/angular-storage.js"></script>
<!-- angular-jwt -->
<script src="lib/angular-jwt/dist/angular-jwt.js"></script>
```

`InAppBrowser` plugin

You must install the InAppBrowser plugin from Cordova to be able to show the Login popup. For that, just run the following command:

```bash
ionic plugin add org.apache.cordova.inappbrowser
```

and then add the following to `config.xml` file

```xml
<feature name="InAppBrowser">
  <param name="ios-package" value="CDVInAppBrowser" />
  <param name="android-package" value="org.apache.cordova.inappbrowser.InAppBrowser" />
</feature>
```

Add the module dependency and configure the service

Add the auth0, angular-storage and angular-jwt module dependencies to your angular app definition and configure auth0 by calling the init method of the authProvider

As we're going to call an API we did on firebase, we need to make sure we send the JWT token we receive on the login on every request. For that, we need to do the add the jwtInterceptor to the list of $http interceptors. Also, as JWTs expire, we'll use the refreshToken to get a new JWT if the one we have is expired:

We already saved the user profile and tokens into localStorage. We just need to fetch them on page refresh and let auth0-angular know that the user is already authenticated.


```js
// app.js
angular.module('complimeme', ['ionic', 'starter.controllers', 'starter.services', 'formlyIonic', 'firebase', 'auth0', 'angular-storage', 'angular-jwt'])

.run(function($ionicPlatform, $rootScope, auth, store, jwtHelper, $location, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });

  // This hooks all auth events to check everything as soon as the app starts
  auth.hookEvents();

  // This events gets triggered on refresh or URL change
  var refreshingToken = null;
  $rootScope.$on('$locationChangeStart', function() {
    var token = store.get('token');
    var refreshToken = store.get('refreshToken');
    if (token) {
      if (!jwtHelper.isTokenExpired(token)) {
        if (!auth.isAuthenticated) {
          auth.authenticate(store.get('profile'), token);
        }
      } else {
        if (refreshToken) {
          if (refreshingToken === null) {
              refreshingToken =  auth.refreshIdToken(refreshToken).then(function(idToken) {
                store.set('token', idToken);
                auth.authenticate(store.get('profile'), idToken);
              }).finally(function() {
                  refreshingToken = null;
              });
          }
          return refreshingToken;
        } else {
          $state.go('tabs.account');
        }
      }
    }
  });

})

.config(function($stateProvider, $urlRouterProvider, authProvider, $httpProvider,
  jwtInterceptorProvider) {

  jwtInterceptorProvider.tokenGetter = function(store, jwtHelper, auth) {
    var idToken = store.get('token');
    var refreshToken = store.get('refreshToken');
    // If no token return null
    if (!idToken || !refreshToken) {
      return null;
    }
    // If token is expired, get a new one
    if (jwtHelper.isTokenExpired(idToken)) {
      return auth.refreshIdToken(refreshToken).then(function(idToken) {
        store.set('token', idToken);
        return idToken;
      });
    } else {
      return idToken;
    }
  }
  $httpProvider.interceptors.push('jwtInterceptor');

  $stateProvider
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tab.compliments', {
      url: '/compliments',
      views: {
        'tab-compliments': {
          templateUrl: 'templates/tab-compliments.html',
          controller: 'ComplimentsCtrl'
        }
      },
      data: {
        // This tells Auth0 that this state requires the user to be logged in.
        // If the user isn't logged in and he tries to access this state
        // he'll be redirected to the login page
        requiresLogin: true
      }
    })

  ...

  authProvider.init({
    domain: 'angularu.auth0.com',
    clientID: 'yp0UIH0pbIqX4IqtsGsBfeeRXv30lnyy',
    loginState: 'login'
  });

  ...

});
```
Implement login in AccountCtrl

Now we're ready to implement the Login. We can inject the auth service in any controller and just call signin method to show the Login / SignUp popup. In this case, we'll add the call in the login method of the LoginCtrl controller. On login success, we'll save the user profile, token and refresh token into localStorage

```js
//in controllers.js AccountCtrl
$scope.login = function() {
  auth.signin({
    authParams: {
      scope: 'openid offline_access',
      device: 'Mobile device'
    }
  }, function(profile, token, accessToken, state, refreshToken) {
    // Success callback
    store.set('profile', profile);
    store.set('token', token);
    store.set('refreshToken', refreshToken);
    $location.path('/');
  }, function() {
    // Error callback
  });
}
```

And initialize widget in template

```html
<!-- tab-account.html -->
<input type="submit" ng-click="login()" />
```