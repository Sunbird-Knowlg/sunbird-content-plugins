/**
 * @author Santhosh Vasabhaktula
 */
org.ekstep.contenteditor.basePlugin.extend({
    screenShot: undefined,
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
                    
                    // var id = url.match(/[-\w]{25,}/);
                    // $scope.videoUrl =  "https://drive.google.com/uc?export=download&id="+id;
                    // ecEditor.jQuery('.video-content .container #previewVideo').html('<video width="400" height="200" controls="controls" autoplay src="'+$scope.videoUrl+'" ></video>'); 
                    var videoelement = $scope.creteVideoElement($scope.videoUrl);
                    ecEditor.jQuery('.video-content .container #previewVideo').html(videoelement);
                    var video = document.getElementsByTagName('video')[0];
                    video.play()
                        .then(function() {
                            var scope = angular.element(ecEditor.jQuery("#addToLesson")).scope();
                            scope.$apply(function() {
                                $scope.messageDiv = false;
                                $scope.showAddLessonBtn = true;
                            });
                            console.log("Valid URL:", video);
                        })
                        .catch(function(err) {
                            var scope = angular.element(ecEditor.jQuery("#addToLesson")).scope();
                            scope.$apply(function() {
                                $scope.show = 'error';
                                $scope.messageDiv = true;
                                $scope.showAddLessonBtn = false;
                            });
                            console.log("Invalid URL:", err);
                        });
                };

                $scope.creteVideoElement = function(url) {
                    var video = document.createElement('video');
                    video.src = url;
                    video.width = '400';
                    video.height = '200';
                    video.controls = true;
                    video.autoplay = 'autoplay';
                    return video;
                };

                $scope.addVideo = function() {
                    $scope.closeThisDialog();
                    ecEditor.dispatchEvent("org.ekstep.video:create", {
                        "y": 7.9,
                        "x": 10.97,
                        "w": 78.4,
                        "h": 79.51,
                        "config": {
                            "autoplay": true,
                            "controls": false,
                            "muted": false,
                            "visible": true,
                            "url": $scope.videoUrl
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
        var media = {};
        media[this.id] = {
            "id": this.id,
            "src": this.getConfig()['url'] || '',
            "assetId": this.id,
            "type": "video"
        };
        return media;
    }
});
//# sourceURL=videoplugin.js
