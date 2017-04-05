'use strict';

describe('reviewcontroller', function() {

	describe("initialization", function(){
		it("shuld be initializationzed", function(){
			module('org.ekstep.review');

			var scope = {};
			var ctrl;

			inject(function($controller){
				ctrl = $controller('reviewcontroller',{$scope:scope});
			});
			expect(scope).toBeDefined();
		});
	});
});
