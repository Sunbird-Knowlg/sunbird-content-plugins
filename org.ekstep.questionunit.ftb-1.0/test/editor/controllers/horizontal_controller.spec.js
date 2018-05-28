describe("FTB Editor template controller", function() {
  var $controller, $scope, ctrl, $rootScope;
  beforeEach(module('ftbApp'));
  beforeEach(function(done) {
    setTimeout(function() {
      inject(function(_$rootScope_, _$controller_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $scope.closeThisDialog = function() {};
        $scope.$safeApply = function() {};
        done();
      });
    }, 2000);
  });

  describe("FTB Question Creation", function() {
    beforeEach(function() {
      ctrl = $controller('ftbQuestionFormController', { $scope: $scope, $rootScope: $rootScope });
      spyOn($scope, "getMatches").and.callThrough();
      spyOn($scope, "init").and.callThrough();
      spyOn($scope, "formValidation").and.callThrough();
      spyOn($scope.$parent, "$on").and.callThrough();
      spyOn($scope, "$emit");
      spyOn($scope, "generateTelemetry").and.callThrough();
      $scope.ftbForm = {
        $invalid: true,
        $name: "ftbForm",
        $pending: undefined,
        $pristine: true,
        submitted: false,
        $valid: false,
        ftbQuestion: {
          $valid: false
        }
      };
      $scope.ftbFormData.question.text = "a [[b]] c [[d]]";
    });
    it("should set ctrl not to be undefined", function() {
      expect(ctrl).not.toBeUndefined();
    });
    it("should call init", function() {
      $scope.init();
      expect($scope.$parent.$on).toHaveBeenCalled();
    });
    it("should call init", function() {
      $scope.init();
      $rootScope.$broadcast('question:form:val');
      expect($scope.formValidation).toHaveBeenCalled();
    });
    it("should call init", function() {
      $scope.init();
      $rootScope.$broadcast('question:form:val');
      $scope.formValidation();
      expect($scope.$emit).toHaveBeenCalled();
    });
    it("should set ctrl not to be undefined", function() {

      var matches = $scope.getMatches("a [[b]] c [[d]]", /(?:^|)\[\[(.*?)(?:\]\]|$)/g, 1);
      expect(matches).not.toBeUndefined();
    });

    it("should ftbForm to be invalid", function() {
      var expectFormValid = $scope.formValidation();
      expect(expectFormValid).toBeFalsy();
    });
    describe("FTB Form  valid", function() {
      beforeEach(function() {
        $scope.ftbForm = {
          $invalid: false,
          $name: "ftbForm",
          $pending: undefined,
          $pristine: true,
          submitted: false,
          $valid: true,
          ftbQuestion: {
            $valid: true
          }
        };
      });
      it("should call init", function() {
        $scope.init();
        $rootScope.$broadcast('question:form:val');
        $scope.formValidation();
        expect($scope.$emit).toHaveBeenCalled();
      });
      it("should return form to be valid", function() {

        var expectFormValid = $scope.formValidation();
        expect(expectFormValid).toBeTruthy();
      });
    });

  });
});
//# sourceURL=horizontalFTB.spec.js