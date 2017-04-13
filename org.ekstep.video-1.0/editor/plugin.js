/**
 * @author Santhosh Vasabhaktula
 */
org.ekstep.contenteditor.basePlugin.extend({
    screenShot: undefined,
    videoSrc: undefined,
    initialize: function() {
        EkstepEditorAPI.addEventListener("org.ekstep.video:showpopup", this.loadBrowser, this);
        var templatePath = EkstepEditorAPI.resolvePluginResource(this.manifest.id, this.manifest.ver, "editor/video.html");
        EkstepEditorAPI.getService('popup').loadNgModules(templatePath);
    },
    newInstance: function() {
        var instance = this;
        var _parent = this.parent;
        this.parent = undefined;
        var props = this.convertToFabric(this.attributes);
        this.editorObj = undefined;
        //var imageURL = "/assets/public/content/do_1122156236916490241183/artifact/maxresdefault_387_1491164926_1491165001510.png";
        // TODO: Comment out the above line and uncomment the below line before upload to dev
        var imageURL = ecEditor.resolvePluginResource(this.manifest.id, this.manifest.ver, 'assets/maxresdefault.png');
        imageURL = ecEditor.getConfig('useProxyForURL') ? "image/get/" + encodeURIComponent(imageURL) : imageURL;
        fabric.Image.fromURL(imageURL, function(img) {
            instance.editorObj = img;
            instance.parent = _parent;
            instance.postInit();
        }, props);
    },
    loadBrowser: function() {
        currentInstance = this;
        EkstepEditorAPI.getService('popup').open({
            template: 'videoPreviewDialog',
            controller: ['$scope', function($scope) {
                $scope.videoUrl = '';
                $scope.show = 'message';
                $scope.messageDiv = true;
                $scope.previewVideo = function() {
                    $scope.messageDiv = true;
                    $scope.show = 'loader';
                    var url = $scope.videoUrl;
                    if(!_.isNull(url.match(/drive.google/g))){
                        $('.video-content .container #previewVideo').html('<video id="myVideo" width="400" height="200" controls="controls" autoplay src="'+$scope.videoUrl+'" ></video>'); 
                        var video = document.getElementsByTagName('video')[0];
                        video.play()
                        .then(function() {
                            var scope = angular.element($("#addToLesson")).scope();
                            scope.$apply(function(){
                                $scope.messageDiv = false;
                                $scope.showAddLessonBtn = true;
                            });
                            console.log("Valid URL:", video);
                        })
                        .catch(function(err){
                            var scope = angular.element($("#addToLesson")).scope();
                            scope.$apply(function(){
                                $scope.show = 'error';
                                $scope.messageDiv = true;
                                $scope.showAddLessonBtn = false;
                            });
                            console.log("Invalid URL:", err);
                        })
                    }else if(!_.isNull(url.match(/youtube./g))){
                        $scope.showPreview = true;
                        $('.video-content .container #previewVideo').html('<iframe id="ytvideo" width="400" height="200" src="'+$scope.videoUrl+'?autoplay=1"></iframe>');
                        console.log('video ', video);
                    }else{
                         $scope.show = 'error';
                    }
                };

                $scope.addVideo = function() {
                    $scope.closeThisDialog();
                    ecEditor.dispatchEvent("org.ekstep.video:create", {
                        "y": 7.9,
                        "x": 10.97,
                        "w": 78.4,
                        "h": 79.51,
                        "videoUrl": $scope.videoUrl,
                        "config": {
                            "autoplay": true,
                            "controls": false,
                            "muted": false,
                            "visible": true
                        }
                    });
                };
            }],
            width: 700,
            showClose: false,
            className: 'ngdialog-theme-plain'
        });
    },
    getMedia: function() {
        return [{
            "id": this.id,
            "src": this.attributes.videoUrl || '',
            "assetId": this.id,
            "type": "video"
        }]
    },
    onConfigChange: function(key, value) {
        console.log('key', key, 'value', value);
        var instance = this;
        var editorObj = instance.editorObj
        switch (key) {
            case "url":
                instance.addConfig(key, value);
                break;
        }
        ecEditor.render();
        ecEditor.dispatchEvent('object:modified', { target: ecEditor.getEditorObject() });
    }
});
//# sourceURL=videoplugin.js
