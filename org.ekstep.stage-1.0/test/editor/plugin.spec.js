'use strict';

describe('Shape plugin', function() {
    var spyEvent;
    var stage1, stage2, stageId, rect1, rect2;

    beforeAll(function(done) {
        ContentTestFramework.init(function() {
            stage1 = EkstepEditorAPI.instantiatePlugin('org.ekstep.stage');
            stageId = stage1.id;
            EkstepEditorAPI.loadPlugin('org.ekstep.shape', '1.0');
            done();
        });
    });

    describe('should test stage plugin', function() {
        it('should create stage', function() {
            EkstepEditorAPI.dispatchEvent('stage:create');
            stage2 = EkstepEditorAPI.getCurrentStage();
            expect(EkstepEditorAPI.getAllStages().length).toBe(2);
            expect(EkstepEditorAPI.getCurrentStage().id).not.toBe(stageId);
        });

        it('should test getOnClick function', function() {
            var currentStageId = EkstepEditorAPI.getCurrentStage().id;
            var onclick = stage1.getOnClick();
            ContentTestFramework.validateObject(onclick, {
                'id': 'stage:select', 'data.stageId': stage1.id, 'data.prevStageId': currentStageId
            });
        });

        it('should test rendering of children', function() {
            rect1 = EkstepEditorAPI.instantiatePlugin("org.ekstep.shape", {"type": "rect", "x": 10, "y": 20, "fill": "#FFFF00", "w": 14, "h": 25, "stroke": "rgba(255, 255, 255, 0)", "strokeWidth": 1, "opacity": 1 }, EkstepEditorAPI.getCurrentStage());
            rect2 = EkstepEditorAPI.instantiatePlugin("org.ekstep.shape", {"type": "rect", "x": 15, "y": 30, "fill": "#FFFF00", "w": 14, "h": 25, "stroke": "rgba(255, 255, 255, 0)", "strokeWidth": 1, "opacity": 1 }, EkstepEditorAPI.getCurrentStage());

            rect1.setAttribute('z-index', 1);
            rect2.setAttribute('z-index', 0);

            stage2.render(EkstepEditorAPI.getCurrentStage().canvas);
            var canvasObjects = EkstepEditorAPI.getCanvas().getObjects();
            expect(canvasObjects[0].id).toBe(rect2.id);
            expect(canvasObjects[1].id).toBe(rect1.id);
        });

        it('should add both fabric plugins and non fabric plugins as children', function() {
            EkstepEditorAPI.loadPlugin('org.ekstep.audio', '1.0');
            var audioPlugin = EkstepEditorAPI.instantiatePlugin("org.ekstep.audio", {
                asset: 'do_123123',
                assetMedia: {
                    name: 'testaudio',
                    id: 'do_123123',
                    src: '/assets/test.mp3',
                    type: 'audio'    
                }
            }, EkstepEditorAPI.getCurrentStage());
            EkstepEditorAPI.dispatchEvent('stage:modified', {});
            expect(EkstepEditorAPI.getCurrentStage().children.length).toBe(3);
        });

        it('should test object selection and deselection', function() {

            ContentTestFramework.select(rect1.id);
            expect(stage2.canvas.getActiveObject().id).toBe(rect1.id);
        });

        it('should validate plugin delete', function() {
            stage2.canvas.remove(rect2.editorObj);
            expect(EkstepEditorAPI.getCurrentStage().children.length).toBe(2);
        });

        it('should validate stage configuration', function() {
            stage2.onConfigChange('instructions', 'Test teacher instructions');
            expect(stage2.getParam('instructions')).toBe('Test teacher instructions');

            EkstepEditorAPI.getAngularScope().showGenieControls = false;
            EkstepEditorAPI.getAngularScope().toggleGenieControl = function() {
                console.log('in callback');
                EkstepEditorAPI.getAngularScope().showGenieControls = !EkstepEditorAPI.getAngularScope().showGenieControls;
            };
            stage2.onConfigChange('genieControls', true);

            expect(EkstepEditorAPI.getAngularScope().showGenieControls).toBe(true);
            stage2.onConfigChange('genieControls', true);
            expect(EkstepEditorAPI.getAngularScope().showGenieControls).toBe(true);
        });

        it('should validate destroyOnLoad function', function() {
            var callbackInvoked = false;
            stage2.destroyOnLoad(2, EkstepEditorAPI.getCanvas(), function() {
                callbackInvoked = true;
            })
            expect(callbackInvoked).toBe(true);

            callbackInvoked = false;
            stage2.destroyOnLoad(3, EkstepEditorAPI.getCanvas(), function() {
                callbackInvoked = true;
            });

            EkstepEditorAPI.instantiatePlugin("org.ekstep.shape", {"type": "rect", "x": 15, "y": 30, "fill": "#FFFF00", "w": 14, "h": 25, "stroke": "rgba(255, 255, 255, 0)", "strokeWidth": 1, "opacity": 1 }, EkstepEditorAPI.getCurrentStage());
            setTimeout(function() {
                expect(callbackInvoked).toBe(true);
            }, 2000);
        });
    });
});
