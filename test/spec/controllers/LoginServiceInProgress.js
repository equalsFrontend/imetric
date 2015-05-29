describe('Unit: LoginService', function() {
  var $scope, ctrl, $timeout;
  
  /* declare our mocks out here
   * so we can use them through the scope 
   * of this describe block.
   */
  var loginServiceMock;
  
 
  // This function will be called before every "it" block.
  // This should be used to "reset" state for your tests.
  beforeEach(function (){
    // Create a "spy object" for our someService.
    // This will isolate the controller we're testing from
    // any other code.
    // we'll set up the returns for this later 
    loginServiceMock = jasmine.createSpyObj('LoginService', ['login']);
    
    // load the module you're testing.
    module('iMetric.components.login');
    
    // INJECT! This part is critical
    // $rootScope - injected to create a new $scope instance.
    // $controller - injected to create an instance of our controller.
    // $q - injected so we can create promises for our mocks.
    // _$timeout_ - injected to we can flush unresolved promises.
    inject(function($rootScope, $controller, $q, _$timeout_) {
      // create a scope object for us to use.
      $scope = $rootScope.$new();
  
      // set up the returns for our someServiceMock
      // $q.when('weee') creates a resolved promise to "weee".
      // this is important since our service is async and returns
      // a promise.
      loginServiceMock.login.andReturn($q.when('weee'));
      
      // assign $timeout to a scoped variable so we can use 
      // $timeout.flush() later. Notice the _underscore_ trick
      // so we can keep our names clean in the tests.
      $timeout = _$timeout_;
      
      // now run that scope through the controller function,
      // injecting any services or other injectables we need.
      // **NOTE**: this is the only time the controller function
      // will be run, so anything that occurs inside of that
      // will already be done before the first spec.
      ctrl = $controller('LoginControllers', {
        $scope: $scope,
        someService: loginServiceMock
      });
    });
  });	  
  
  /* Test 4: Testing an asynchronous service call.
     Since we've mocked the service to return a promise
     (just like the original service did), we need to do a little
     trick with $timeout.flush() here to resolve our promise so the
     `then()` clause in our controller function fires. 
     
     This will test to see if the `then()` from the promise is wired up
     properly. */
  it('should update fizz asynchronously when test2() is called', function (){
    // just make the call
	  $scope.attemptLogin();
    
    // asser that it called the service method.
    expect(loginServiceMock.login).toHaveBeenCalled();  
    
    // call $timeout.flush() to flush the unresolved dependency from our
    // someServiceMock.
    $timeout.flush();
    
    // assert that it set $scope.fizz
    expect($scope.fizz).toEqual('weee');    
  });
});