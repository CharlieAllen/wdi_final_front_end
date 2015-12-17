angular
  .module('tedchatApp', ['ui.router', 'angular-jwt', 'ngResource'])
  .constant('YOUTUBE_URL', 'https://www.youtube.com/embed/')
  .constant('API', 'http://localhost:3000/')
  .config(whitelistUrls)
  .config(MainRouter)
  .config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptor')
  });


//Google API callback function...
// function init() {
//   window.init();
// };


whitelistUrls.$inject = ['$sceDelegateProvider', 'YOUTUBE_URL'];

function whitelistUrls($sceDelegateProvider, YOUTUBE_URL){
  $sceDelegateProvider.resourceUrlWhitelist([
    'self', 
    YOUTUBE_URL + '**'
  ])
};

function MainRouter($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home.html'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'login.html'
    })
    .state('signup', {
      url: '/signup', 
      templateUrl: 'signup.html'
    })
    .state('about', {
      url: '/about',
      templateUrl: 'about.html'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'profile.html'
    });
  
  $urlRouterProvider.otherwise("/");
}