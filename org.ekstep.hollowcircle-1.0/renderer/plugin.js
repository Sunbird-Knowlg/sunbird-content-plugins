Plugin.extend({
    _type: 'org.ekstep.hollowcircle',
    _isContainer: false,
    _render: true,
    initPlugin: function(data) {
        console.log('data', data);
        this._self = new createjs.Shape();
        var graphics = this._self.graphics;
        var dims = this.relativeDims();

        if (data.fill) {
            graphics.beginFill(data.fill);
        }

        if (data.stroke) {
            graphics.beginStroke(data.stroke);
        }

        if (data['strokeWidth']) {
            graphics.setStrokeStyle(data['strokeWidth']);
        }

        // Radius for circle
        graphics.dc(0, 0, data.radius || dims.w || 10);
        if (data.hitArea) {
            var hit = new createjs.Shape();
            hit.graphics.beginFill("#000").dc(0, 0, dims.w);
            this._self.hitArea = hit;
        }

        if (data.rotate) {
            this._self.regX = dims.w / 2;
            this._self.regY = dims.h / 2;
            this._self.rotation = data.rotate;
        }
        if (data.opacity)
            this._self.alpha = data.opacity;
        
        this._self.x = dims.x + data.radius + data.strokeWidth/2;
        this._self.y = dims.y + data.radius + data.strokeWidth/2;
    },
    drawBorder: function() {

    }

});
