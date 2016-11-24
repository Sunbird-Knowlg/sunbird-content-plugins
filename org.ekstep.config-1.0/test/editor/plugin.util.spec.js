'use strict';
describe('Config plugin Util', function() {
    var $ele;
    beforeEach(function() {
        $("<div id='plugin-toolbar-container'></div>").appendTo("body");
        $ele = $("#plugin-toolbar-container");
    });
    afterEach(function() {
        $("#plugin-toolbar-container").remove();
    });
    it('should behave add class on mouse down', function() {
        spyOn($ele,'on').and.callThrough();
        $ele.trigger('mousedown');
        expect($ele.hasClass('plugin-toolbar-draggable')).toBeTruthy();
    });
    it('should behave changed position on mouse move', function() {
        $ele.trigger('mousedown').trigger('mousemove').trigger('mouseup');
        expect($ele.css('position')).toBeDefined();
    });
    it('should remove class on mouse up', function() {
        $ele.trigger('mouseup');
        expect($ele.hasClass('plugin-toolbar-draggable')).not.toBeTruthy();
    });
});
