# Crazy Fast Prototyping

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