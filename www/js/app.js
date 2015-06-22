// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
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

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  /*
  * we repurposed chats and chat-detail because it is closest to what we
  * want to do
  */
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
    .state('tab.compliments-detail', {
      url: '/compliments/:complimentsId',
      views: {
        'tab-compliments': {
          templateUrl: 'templates/compliments-detail.html',
          controller: 'ComplimentsDetailCtrl'
        }
      },
      data: {
        // This tells Auth0 that this state requires the user to be logged in.
        // If the user isn't logged in and he tries to access this state
        // he'll be redirected to the login page
        requiresLogin: true
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })
  ;

  authProvider.init({
    domain: 'angularu.auth0.com',
    clientID: 'yp0UIH0pbIqX4IqtsGsBfeeRXv30lnyy',
    loginState: 'tab.account'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/account');

});
