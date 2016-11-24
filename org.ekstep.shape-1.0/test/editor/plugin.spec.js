'use strict';

describe('Shape plugin', function() {
    var spyEvent;

    var rectData = {
        "left": 100,
        "top": 100,
        "fill": "rgb(255, 255, 0)",
        "width": 100,
        "height": 100
    };

    beforeEach(module('editorApp'));

    beforeEach(function() {});

    describe('on shape:createRectangle', function() {
        it('should call createRectangle', function() {
            EkstepEditorAPI.dispatchEvent("shape:createRectangle", rectData);
            // spyEvent = spyOn('createRectangle');
            // expect('createRectangle').toHaveBeenCalled();
            // expect(spyEvent).toHaveBeenTriggered();

        });

    });
});
