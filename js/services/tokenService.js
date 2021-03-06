angular
  .module('tedchatApp')
  .service("TokenService", TokenService);

TokenService.$inject = ["$window", "jwtHelper"];

function TokenService($window, jwtHelper) {
  var self = this;

  self.saveToken = function(token) {
    //console.log("in save token", token)
    return $window.localStorage.setItem('secret-handshake', token);
  }

  self.getToken = function() {
    return $window.localStorage.getItem('secret-handshake');
  }

  self.removeToken = function() {
    return $window.localStorage.removeItem('secret-handshake');
  }

  self.decodeToken = function() {
    var token = self.getToken();
    return token ? jwtHelper.decodeToken(token) : {};
  }
}



