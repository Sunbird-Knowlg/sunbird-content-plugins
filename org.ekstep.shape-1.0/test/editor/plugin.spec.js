'use strict';

describe('Shape plugin', function() {
    var spyEvent;
    var stage, rect, circle, roundedRect, star, polygon, trapezium, arrow, doubleArrow;

    beforeAll(function(done) {
        ContentTestFramework.init(function() {
            stage = EkstepEditorAPI.instantiatePlugin('org.ekstep.stage');
            EkstepEditorAPI.loadPlugin('org.ekstep.shape', '1.0');
            done();
        });
    });

    describe('should create all shapes', function() {
        it('should create rectangle and test circle configuration changes', function() {
            expect(stage.children.length).toBe(0);

            // Test Rectangle
            rect = EkstepEditorAPI.dispatchEvent("org.ekstep.shape:create", {"type": "rect", "x": 10, "y": 20, "fill": "#FFFF00", "w": 14, "h": 25, "stroke": "rgba(255, 255, 255, 0)", "strokeWidth": 1, "opacity": 1 }); 
            expect(stage.children.length).toBe(1);
        });

        it('should create circle and test circle configuration changes', function() {
            // Test Circle
            circle = EkstepEditorAPI.dispatchEvent("org.ekstep.shape:create", {"type": "ellipse", "x": 15, "y": 15, "fill": "#00FF00", "w": 18, "h": 32, "stroke": "rgba(255, 255, 255, 0)", "strokeWidth": 1, "opacity": 1 }); 
            expect(stage.children.length).toBe(2);
        });

        it('should create rounded rectange and test configuration changes', function() {
            
            // Test Rounded Rectange
            roundedRect = EkstepEditorAPI.dispatchEvent("org.ekstep.shape:create", {"type": "roundrect", "x": 20, "y": 20, "fill": "#FF0000", "w": 14, "h": 25, "radius": 10, "stroke": "rgba(255, 255, 255, 0)", "strokeWidth": 1, "opacity": 1 });
            expect(stage.children.length).toBe(3);
        });

        it('should create star shape and test configuration changes', function() {
            
            // Test Star Shape
            star = EkstepEditorAPI.dispatchEvent("org.ekstep.shape:create", {"type": "star", "x": 20, "y": 20, "fill": "#FF0000", "w": 14, "h": 25, "corners": 5, "stroke": "rgba(255, 255, 255, 0)", "strokeWidth": 1, "opacity": 1 });
            expect(stage.children.length).toBe(4);
        });

        it('should create polygon shape and test configuration changes', function() {
            
            // Test Polygon
            polygon = EkstepEditorAPI.dispatchEvent("org.ekstep.shape:create", {"type": "polygon", "x": 20, "y": 20, "fill": "#FF0000", "w": 14, "h": 25, "sides": 5, "stroke": "rgba(255, 255, 255, 0)", "strokeWidth": 1, "opacity": 1 });
            expect(stage.children.length).toBe(5);
        });

        it('should create trapezium shape and test configuration changes', function() {
            
            // Test Trapezium
            trapezium = EkstepEditorAPI.dispatchEvent("org.ekstep.shape:create", {"type": "trapezium", "x": 20, "y": 20, "fill": "#FF0000", "w": 14, "h": 25, "stroke": "rgba(255, 255, 255, 0)", "strokeWidth": 1, "opacity": 1 });
            expect(stage.children.length).toBe(6);
        });

        it('should create single arrow shape and test configuration changes', function() {
            
            // Test Arrow
            arrow = EkstepEditorAPI.dispatchEvent("org.ekstep.shape:create", {"type": "rarrow", "x": 20, "y": 20, "fill": "#000000", "w": 30, "h": 25, "stroke": "rgba(255, 255, 255, 0)", "strokeWidth": 1, "opacity": 1 });
            expect(stage.children.length).toBe(7);
        });

        it('should create double arrow shape and test configuration changes', function() {

            // Test Double Arrow
            doubleArrow = EkstepEditorAPI.dispatchEvent("org.ekstep.shape:create", {"type": "harrow", "x": 20, "y": 20, "fill": "#000000", "w": 30, "h": 25, "stroke": "rgba(255, 255, 255, 0)", "strokeWidth": 1, "opacity": 1 });
            expect(stage.children.length).toBe(8);
        });
    });
});
