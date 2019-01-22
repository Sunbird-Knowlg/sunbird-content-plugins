'use strict';
angular.module('loginApp', []).controller('logincontroller', ['$scope', 'instance', function ($scope, instance) {
    var ctrl = this;
    var audiodata = {};
    $scope.init = function () {
        setTimeout(function () {
            var video = document.createElement("video");
            var canvasElement = document.getElementById("loginCanvas");
            var canvas = canvasElement.getContext("2d");

            function drawLine(begin, end, color) {
                canvas.beginPath();
                canvas.moveTo(begin.x, begin.y);
                canvas.lineTo(end.x, end.y);
                canvas.lineWidth = 4;
                canvas.strokeStyle = color;
                canvas.stroke();
            }

            // Use facingMode: environment to attemt to get the front camera on phones
            navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function (stream) {
                video.srcObject = stream;
                video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
                video.play();
                requestAnimationFrame(tick);
            });

            function tick() {
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    canvasElement.height = video.videoHeight;
                    canvasElement.width = video.videoWidth;
                    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
                    var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
                    var code = jsQR(imageData.data, imageData.width, imageData.height);

                    if (code && !document.getElementById('qrcode').value) {
                        drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
                        drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
                        drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
                        drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
                        document.getElementById('qrcode').value = code.data
                        ctrl.verifyQrCode(code.data);
                    }
                }
                requestAnimationFrame(tick);
            }
            ctrl.verifyQrCode = function (code) {
                console.log("In the QR code varify code");
                if(!code){
                    var   x=angular.element(document.getElementById("qrcode"));      
                    code = x.val();
                }
                var data = {
                    request: {
                        type: 'sample',
                        subType: 'test',
                        action: 'create',
                        rootOrgId: '1234567890',
                        framework: code
                    }
                };

                $.ajax({
                    method: "POST",
                    url: "https://dev.sunbirded.org/api/data/v1/form/read",
                    data: JSON.stringify(data),
                    dataType: 'json',
                    contentType: 'application/json',
                }).done(function (msg) {
                    iziToast.success({ title: 'Success', message: 'Login successful', position: 'topCenter' });
                }).error(function (error) {
                    iziToast.error({ title: 'Error', message: 'Something went wrong. Please try again later...', position: 'topCenter' });
                });
            }

            // function verifyQrCode(code) {
            //     var data = {
            //         request: {
            //             type: 'sample',
            //             subType: 'test',
            //             action: 'create',
            //             rootOrgId: '1234567890',
            //             framework: code
            //         }
            //     };

            //     $.ajax({
            //         method: "POST",
            //         url: "https://dev.sunbirded.org/api/data/v1/form/read",
            //         data: JSON.stringify(data),
            //         dataType: 'json',
            //         contentType: 'application/json',
            //     }).done(function (msg) {
            //         iziToast.success({ title: 'Success', message: 'Login successful', position: 'topCenter' });
            //     }).error(function (error) {
            //         iziToast.error({ title: 'Error', message: 'Something went wrong. Please try again later...', position: 'topCenter' });
            //     });
            // }
        }, 3000);

    }
    $scope.init();
}]);

//# sourceURL=loginApp.js
