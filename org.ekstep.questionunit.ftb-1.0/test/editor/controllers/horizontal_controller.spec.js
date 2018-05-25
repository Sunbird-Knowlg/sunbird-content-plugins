describe("FTB Editor template controller", function() {
  var plugin, popupService, $controller, $scope, ctrl, $rootScope;
  beforeEach(function(done) {
    plugin = new org.ekstep.questionunitFTB.EditorPlugin({}, {}, {});
    angular.module('ftbApp', []);
    inject(function(_$rootScope_, _$controller_) {
      $rootScope = _$rootScope_;
      $scope = _$rootScope_.$new();
      $controller = _$controller_;
      $scope.closeThisDialog = function() {};
      $scope.$safeApply = function() {};
      done();
    });

  });
  describe("FTB Question Creation", function() {
    it("should set ctrl not to be undefined", function() {
      setTimeout(function() {
        ctrl = $controller('ftbQuestionFormController', { $scope: $scope, $rootScope: $rootScope });
        expect(ctrl).not.toBeUndefined();
      }, 2000);
    });
  });
});