# AngularU

Crazy Fast Prototyping

### Firebase

https://www.firebase.com/docs/web/libraries/angular/quickstart.html

```bash
bower install firebase angularfire --save
```

```html
<script src="lib/firebase/firebase.js"></script>
<script src="lib/angularfire/dist/angularfire.js"></script>
```

```js
var app = angular.module("sampleApp", ["firebase"]);
```

In our example app we utilize `$firebaseArray`

https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebasearray