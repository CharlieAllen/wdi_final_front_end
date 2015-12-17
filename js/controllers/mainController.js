angular
  .module('tedchatApp')
  .controller('MainController', MainController);

// Youtube Data API search function
function createSearch(keyword) {
  return request = gapi.client.youtube.search.list({
      q: keyword,
      part: "snippet",
      channelId: "UCAuUUnT6oDeKwE6v1NGQxug",
      maxResults: 6,
      type: "video"
    });
}

MainController.$inject = ['$window', '$scope', 'YOUTUBE_URL', 'TokenService', 'User', '$location'];

function MainController($window, $scope, YOUTUBE_URL, TokenService, User, $location){
  var main = this;

  this.all = [];
  main.user = {};
  main.youtubeLoaded = false;
  main.loading = false;

  $window.init = function() {
    gapi.client.load('youtube', 'v3').then(function() {
      gapi.client.setApiKey('AIzaSyDTU2aqu4zGnwda1KYKF2VwLYqG8hcTaM8');
      main.youtubeLoaded = true;
      search();
    });
  }

  function handleLogin(res) {
    var token = res.token ? res.token : null;

    if (token) {
      TokenService.saveToken(token);
      main.user = TokenService.decodeToken();
      main.getUsers();
    }

    main.message = res.message;
  }

  main.register = function() {
     User.register(main.user, handleLogin);
     $location.path('/');
   }

  main.updateUser = function() {
    User.update({ id: main.user._id }, main.user);  
  }

  main.login = function() {
    User.login(main.user, handleLogin);
    $location.path('/profile');
  }

  main.disappear = function() {
    TokenService.removeToken();
    main.all = [];
    main.user = {};
    $location.path('/');
  }

  main.getUsers = function() {
    main.all = User.query();
  }

  main.isLoggedIn = function() {
    return !!TokenService.getToken();
    $location.path('/');
  }

  if (main.isLoggedIn()) {
    main.getUsers();
    var loggedInUser = TokenService.decodeToken();
    User.get({ id: loggedInUser._id }, function(res) {
      main.user = res.user;
    });
  }

  main.videoIds = [];

  main.keyword = "";

  function search() {
    main.loading = true;
    createSearch(main.keyword).execute(function(res) {

      // $scope.apply forces angular to refresh the view
      $scope.$apply(function() {
        main.videoIds = res.items.map(function(item) {
          return YOUTUBE_URL + item.id.videoId;
        });

        main.loading = false;
      });
    });
  };

  main.saveVideoToUser = function(videoId) {
    main.user.favourite_videos.push(videoId);
    User.update({ id: main.user._id }, main.user, function() {
      //console.log('added a video to a user');
    });
  }

  main.unsaveVideoFromUser = function(videoId) {
    var index = main.user.favourite_videos.indexOf(videoId);
    main.user.favourite_videos.splice(index, 1);
    User.update({ id: main.user._id }, main.user, function() {
    console.log('removed a video to a user');
    });
  }

  main.search = search;
}