describe('service', function(){
	
	beforeEach(module('iMetric.components.login.services'));
	
	describe('Unit: Login Service', function(){
		
		var service, rootScope;
		
		beforeEach(inject(function(LoginService, _$rootScope_){
			
			service = LoginService;
			rootScope = _$rootScope_;
			
		}));
		
		it('should contain a LoginService service.', (function(){
			
			///console.log(rootScope.firebase);
			
			//expect('rootScope.firebase').not.toEqual(null);
			expect('service').not.toEqual(null);
		}));
		
		it('should login with test creds', (function(){
			//service.login('test@test.com', 'test').toEqual(true);
		}));
		
	});
	
});