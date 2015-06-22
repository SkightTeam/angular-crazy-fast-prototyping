# AngularU

Crazy Fast Prototyping

### Install Formly with Bower

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

Then import the templates into your project.

```javascript
angular.module('myApp', ['ionic', 'formlyIonic'])
```

Add formField configuration to controller

Add formly directive to partial

We are using a version of Formly tailored for Ionic

http://formly-js.github.io/angular-formly-templates-ionic/#/