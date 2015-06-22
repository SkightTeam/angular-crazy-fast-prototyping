# Crazy Fast Prototyping

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