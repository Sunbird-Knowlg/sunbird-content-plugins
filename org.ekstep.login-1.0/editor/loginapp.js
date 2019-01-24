'use strict';
angular.module('loginApp', []).controller('logincontroller', ['$scope', 'instance', function ($scope, instance) {
    var ctrl = this;
    var audiodata = {};
    ctrl.showDiv = true;
    $scope.init = function () {
        var deviceId;
        var fp = new Fingerprint2()
		fp.get(function (result) {
			deviceId= result.toString()
		})
        
        setTimeout(function () {
            var video = document.createElement("video");
            var canvasElement = document.getElementById("loginCanvas");
            var canvas = canvasElement.getContext("2d");
            console.log(deviceId);
            function drawLine(begin, end, color) {
                canvas.beginPath();
                canvas.moveTo(begin.x, begin.y);
                canvas.lineTo(end.x, end.y);
                canvas.lineWidth = 4;
                canvas.strokeStyle = color;
                canvas.stroke();
            }

            // Use facingMode: environment to attemt to get the front camera on phones
            navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment"
                }
            }).then(function (stream) {
                video.srcObject = stream;
                video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
                video.play();
                requestAnimationFrame(tick);
            });

            function tick() {
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    canvasElement.height = video.videoHeight + 180;
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
                if (!code) {
                    var x = angular.element(document.getElementById("qrcode"));
                    code = x.val();
                }
                var data = {
                    request: {
                        type: 'sample',
                        subType: 'test',
                        action: 'create',
                        rootOrgId: '1234567890',
                        code: code
                    }
                };
                // Add your stall telemetry data and remove unwanted telemetry
                var telemetryData = {
                    "events": [{
                            "eid": "DC_START",
                            "ets": new Date().getTime(),
                            "did": deviceId,
                            "dimensions": {
                                "visitorId": code,
                                "stallId": "STA1",
                                "ideaId": "IDE2",
                                "visitorName": "",
                                "studentId": "studentId",
                                "studentName": "studentName",
                                "teacherId": "TCH1",
                                "teacherName": "Nirmala",
                                "parentId": "parentId",
                                "parentName": "parentName",
                                "stallName": "Creation",
                                "ideaName": "AI Assisted Content Creation",
                                "classroomId": "classroomId",
                                "school": "school",
                                "district": "district",
                                "period": "period",
                                "topics": "topics",
                                "subject": "subject",
                                "grade": "grade"
                            },
                            "edata": {}
                        }
 
                    ]
                };
                $.ajax({
                    method: 'POST',
                    url: 'https://dev.ekstep.in/api/devcon/v3/login',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    contentType: 'application/json',
                }).done(function (data) {
                    ctrl.showDiv = false;
                    $scope.$safeApply();
                    ecEditor.jQuery('.login-container').parents('#ngdialog1').addClass('hide');
                    $scope.fireEvent({ id: 'org.ekstep.timetable:add' });
                    if (data.result && data.result.Visitor) {
                        ecEditor.dispatchEvent("org.ekstep.login:success",data.result);
                        telemetryData.visitorName = data.result.Visitor.name
                        $.ajax({
                            method: 'POST',
                            url: 'http://52.172.188.118:3000/v1/telemetry',
                            data: JSON.stringify(telemetryData),
                            dataType: 'json',
                            contentType: 'application/json',
                        }).done(function (data) {
                            console.log(data)
                        });
                        iziToast.success({
                            title: 'Success',
                            message: 'Login successful',
                            position: 'topCenter'
                        });
                    } else {
                        iziToast.error({
                            title: 'Error',
                            message: 'Invalid Login ID',
                            position: 'topCenter'
                        });
                    }
                }).error(function (error) {
                    iziToast.error({
                        title: 'Error',
                        message: 'Something went wrong. Please try again later...',
                        position: 'topCenter'
                    });
                });
            }
        }, 3000);

    }
    $scope.fireEvent = function(event) {
        if (event) org.ekstep.contenteditor.api.dispatchEvent(event.id, event.data);
    };
    $scope.init();
}]);

//# sourceURL=loginApp.js
