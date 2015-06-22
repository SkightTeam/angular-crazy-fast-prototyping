# Crazy Fast Prototyping

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