describe('Unit: MainController', function() {
  // Load the module with MainController
  beforeEach(module('iMetric'));

  var ctrl, scope;
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    // Create the controller
    ctrl = $controller('MainController', {
      $scope: scope
    });
  }));

  it('should have available the scope.name var and equal to MainController', 
    function() {
	  
	  //See if main controller exists
      expect(scope.name).toEqual("MainController");
           
  });
});