
angular.module('autocreationApp', ['angular-inview'])
    .controller('autocreationCtrl', ['$scope', '$timeout', 'instance', function ($scope, $timeout, instance) {
        $scope.isLoading = false;
        $scope.loadingText = 'Loading';
        $scope.init = function () {
            $('input[type=file]').on('dragenter', function () {
                $('div.drop-area').addClass('dragover');
            });

            $('input[type=file]').on('dragleave', function () {
                $('div.drop-area').removeClass('dragover');
            });
        }

        $scope.uploadFile = function (e) {
            // $("#filename").text($(this).val());
            $scope.isLoading = true;
            $scope.loadingText = 'Uploading file';
            $scope.$safeApply();
            var filePath = document.getElementById('inputFile').value;
            var allowedExtensions = /(\.pdf)$/i;

            if (!allowedExtensions.exec(filePath)) {
                $scope.isLoading = false;
                ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                    message: 'Please upload pdf file only',
                    position: 'topCenter',
                    icon: 'fa fa-warning'
                });
                document.getElementById('inputFile').value = '';
                $scope.$safeApply();
                return false;
            } else {
                var data = new FormData();
                data.append("file", document.getElementById('inputFile').files[0]);

                $.ajax({
                    type: "POST",
                    "async": true,
                    "crossDomain": true,
                    url: "/pdf2ecml/uploadFile",
                    headers: {
                        "cache-control": "no-cache",
                    },
                    data: data,
                    "processData": false,
                    "contentType": false,
                    "mimeType": "multipart/form-data",
                    success: function (data) {
                        $scope.isLoading = false;
                        console.log("data", data);
                    },
                    error: function (e) {
                        $scope.isLoading = false;
                        $scope.$safeApply();
                        ecEditor.dispatchEvent("org.ekstep.toaster:error", {
                            message: 'Unable to process this file please upload another',
                            position: 'topCenter',
                            icon: 'fa fa-warning'
                        });
                    }
                });
            }
        };

        $scope.init();
    }]);

//# sourceURL=autocreationApp.js


