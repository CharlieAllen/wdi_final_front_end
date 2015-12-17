angular
  .module('tedchatApp')
  .factory('User', User);

User.$inject = ['$resource', 'API'];
function User($resource, API) {
  return $resource(API + 'api/users/:id', null, {
    'login': { method: "POST", url: API + 'login' },
    'register': { method: "POST", url: API + 'signup' },
    'update' : { method: "PATCH" }
  })
};