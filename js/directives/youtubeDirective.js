angular
  .module('tedchatApp')
  .directive('youtube', youtubeDirective);

function youtubeDirective(){
  var directive = {};
  directive.restrict = 'E';
  directive.replace = true;
  directive.templateUrl = 'youtubeView.html';
  directive.scope = {
    videoId: '='
  }
  return directive;
}