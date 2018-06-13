describe("FTB Editor template controller", function() {
  var $controller, $scope, ctrl, $rootScope, telemetryService;
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
      telemetryService = jasmine.createSpyObj("telemetry", ["interact"]);
      spyOn(ecEditor, "getService").and.callFake(function() {
        return telemetryService;
      });
      spyOn(CKEDITOR, "replace").and.callThrough(); // eslint-disable-line no-undef
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

    it("should generate telemetry on focus", function() {
      var data = { "type": "TOUCH", "id": "input", "target": { "id": "questionunit-ftb-question", "ver": "", "type": "input" } };
      $scope.generateTelemetry(data);
      expect(ecEditor.getService).toHaveBeenCalledWith('telemetry');
    })
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
  describe("FTB Question Edit", function() {
    var expectedFormData, expectedKeyboardConfig;
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
      $scope.questionEditData = { "plugin": { "id": "org.ekstep.questionunit.ftb", "version": "1.0", "templateId": "ftbtemplate" }, "data": { "question": { "text": "<p>Device a [[b]] c [[d]]</p>\n", "image": "", "audio": "", "keyboardConfig": { "keyboardType": "Device", "customKeys": [] } }, "answer": ["b", "d"], "parsedQuestion": { "text": "<p>Device a <input type=\"text\" class=\"ans-field\" id=\"ans-field1\"> c <input type=\"text\" class=\"ans-field\" id=\"ans-field2\"></p>\n", "image": "", "audio": "" } }, "config": { "metadata": { "category": "FTB", "title": "Device a ____ c ____\n", "language": ["English"], "qlevel": "EASY", "gradeLevel": ["Kindergarten"], "concepts": [{ "identifier": "BIO1", "name": "Animals" }], "description": "Device a ____ c ____", "max_score": 1 }, "max_time": 0, "max_score": 1, "partial_scoring": true, "layout": "Horizontal", "isShuffleOption": false } };
    });
    it("should set form data", function() {
      $scope.init();
      expectedFormData = {
        "text": "<p>Device a [[b]] c [[d]]</p>\n",
        "image": "",
        "audio": "",
        "keyboardConfig": {
          "keyboardType": "Device",
          "customKeys": []
        }
      };
      expect($scope.ftbFormData.question).toEqual(expectedFormData);
    });
    it("should set keyboard config to device", function() {
      $scope.init();
      expectedKeyboardConfig = { "keyboardType": "Device", "customKeys": [] };
      expect($scope.keyboardConfig).toEqual(expectedKeyboardConfig);
    })
  });
});
//# sourceURL=horizontalFTB.spec.js