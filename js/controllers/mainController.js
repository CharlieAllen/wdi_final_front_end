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

  // $scope.user = {}

  var self = this;

  this.all = [];
  self.user = {};
  self.youtubeLoaded = false;
  self.loading = false;

  $window.init = function() {
    gapi.client.load('youtube', 'v3').then(function() {
      gapi.client.setApiKey('AIzaSyDTU2aqu4zGnwda1KYKF2VwLYqG8hcTaM8');
      self.youtubeLoaded = true;
      search();
    });
  }

  function handleLogin(res, path) {
    var token = res.token ? res.token : null;

    if (token) {
      TokenService.saveToken(token);
      self.user = TokenService.decodeToken();
      self.getUsers();
      $location.path(path);
    }
  }

  self.register = function() {
     User.register(self.user, handleLogin, '/');
     // $location.path('/');
   }

  self.updateUser = function() {
    User.update({ id: self.user._id }, self.user);  
  }

  self.login = function() {
    User.login(self.user, handleLogin, '/profile');
    // $location.path('/profile');
  }

  self.disappear = function() {
    TokenService.removeToken();
    self.all = [];
    self.user = {};
    // $location.path('/');
  }

  self.getUsers = function() {
    self.all = User.query();
  }

  self.isLoggedIn = function() {
    return !!TokenService.getToken();
  }

  if (self.isLoggedIn()) {
    self.getUsers();
    var loggedInUser = TokenService.decodeToken();
    User.get({ id: loggedInUser._id }, function(res) {
      self.user = res.user;
    });
  }

  self.videoIds = [];

  self.keyword = "";

  function search() {
    self.loading = true;
    createSearch(self.keyword).execute(function(res) {

      // $scope.apply forces angular to refresh the view
      $scope.$apply(function() {
        self.videoIds = res.items.map(function(item) {
          return YOUTUBE_URL + item.id.videoId;
        });

        self.loading = false;
        self.keyword = "";
      });
    });
  };

  self.saveVideoToUser = function(videoId) {
    self.user.favourite_videos.push(videoId);
    User.update({ id: self.user._id }, self.user, function() {
      //console.log('added a video to a user');
    });
  }

  self.unsaveVideoFromUser = function(videoId) {
    var index = self.user.favourite_videos.indexOf(videoId);
    self.user.favourite_videos.splice(index, 1);
    User.update({ id: self.user._id }, self.user, function() {
    //console.log('removed a video to a user');
    });
  }

  self.search = search;
}