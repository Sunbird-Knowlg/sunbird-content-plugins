describe("Math text Editor template controller", function() {
  var $controller, $scope, ctrl, $rootScope, plugin, $timeout;
   var latexSpan,hiddenSpanArea;

  beforeEach(module('org.ekstep.mathtext'));
  beforeEach(function(done) {
    plugin = org.ekstep.mathtext.EditorPlugin({}, {}, {});
    setTimeout(function() {
      inject(function(_$rootScope_, _$controller_, _$timeout_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $timeout = _$timeout_;
        $scope.closeThisDialog = function() {};
        $scope.$safeApply = function() {};
        done();
      });
    }, 2000);
    var elem = '<div ><span id="latex"></span><span id="math-field"></span><span id="hiddenSpan"></span></div>';
    var body = document.getElementsByTagName("body")[0];
    var div = document.createElement('div');
    div.innerHTML = elem;
    body.appendChild(div.children[0]);
    var mathField;
   


    spyOn(katex, "render");
    spyOn(ecEditor, "dispatchEvent");

  });
  describe("Math text  Creation", function() {
    beforeEach(function() {
      ctrl = $controller('mathTextController', {
        $scope: $scope,
        instance: plugin,
        $timeout: $timeout
      });
    });
    it("Should load controller", function() {
      expect($scope).not.toBeUndefined();
    });
    it("Should call katex render function", function() {
      $scope.latexToFormula('libFormula1', 'text');
      expect(katex.render).toHaveBeenCalled();
    });
    it("Should dispatch event", function() {
      $scope.addToStage();
      expect(ecEditor.dispatchEvent).toHaveBeenCalled();
    });
  /*  it("Should ", function() {
      var MQ = MathQuill.getInterface(2);
      var mathFieldSpan = document.getElementById('math-field');
      latexSpan = document.getElementById('latex');
      hiddenSpanArea = document.getElementById('hiddenSpan');
      mathField = MQ.MathField(mathFieldSpan, {
        spaceBehavesLikeTab: true,
        handlers: {
          edit: function() {
            latexSpan.textContent = mathField.latex();
          }
        }
      });

      spyOn(mathField, "write");

      $scope.latexToEquations("test");
      expect(mathField.write).toHaveBeenCalled();
    })*/
  });
});
//# sourceURL=math-controller.spec.js