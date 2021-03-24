var app = angular.module('myApp', ['ui.router']);
let fs = require('fs')
let filename = 'books'
let sno = 0

app.config(['$stateProvider', function ($stateProvider) {

  $stateProvider
    .state('addBook', {
      url: '/add-book',
      templateUrl: 'add-book.html',
    })

}]);
