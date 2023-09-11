describe('licenses Directive', function () {
    var elm, scope;

    beforeEach(module('example'));

    beforeEach(inject(function ($rootScope, $compile) {
        elm = angular.element('<div> <label>LICENSE</label><div> <select><option label="CC BY-NC 4.0" value="CC BY-NC 4.0">CC BY-NC 4.0</option><option label="CC BY-NC-SA 4.0" value="CC BY-NC-SA 4.0">CC BY-NC-SA 4.0</option><option label="CC BY4.0" value="CC BY4.0">CC BY4.0</option><option label="Dummy License 2" value="Dummy License 2">Dummy License 2</option> </select></div></div>');
        scope = $rootScope.$new();
        $compile(elm)(scope);
        scope.$digest();
    }))});

    it('should check if directive with options are loaded', inject(function($compile, $rootScope) {
        var items = elm.find('_selectlicenses');
        expect(items.length).toBe(4);
        expect(items.eq(0).text()).toContain('CC BY-NC 4.0');
      }));

    it('should set active class on tenant license', function () {
        scope.$digest();
        var items = elm.find('_selectlicenses');
        expect($('<option label="Dummy License 2" value="Dummy License 2" selected="selected">Dummy License 2</option>')).toBeSelected()
    });

    
