# AngularU

Crazy Fast Prototyping

### Cordova Plugins

#### Add Cordova Camera Plugin

```
cordova plugin add cordova-plugin-camera
```

#### Create Camera Service

```js
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

#### Add logic to controller

```js
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
```

#### Update templates

```html
<!-- add comliment -->
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

<!-- comliment detail -->
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

### Add custom styles

```css
.friend-photo img {
	max-width: 100%;
	height: auto;
}
```