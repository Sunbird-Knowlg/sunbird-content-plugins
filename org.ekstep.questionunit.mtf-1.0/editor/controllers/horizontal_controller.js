/**
 * Plugin to create MTF question
 * @class org.ekstep.questionunitmcq:mtfQuestionFormController
 * Sachin<sachin.kumar@goodworklabs.com>
 */
angular.module('mtfApp', [])
  .controller('mtfQuestionFormController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.formVaild = false;
    $scope.indexCount = 4;
    $scope.mtfConfiguartion = {
      'questionConfig': {
        'isText': true,
        'isImage': false,
        'isAudio': false,
        'isHint': false
      },
      'optionsConfig': [{
        'isText': true,
        'isImage': false,
        'isAudio': false,
        'isHint': false
      }, {
        'isText': true,
        'isImage': false,
        'isAudio': false,
        'isHint': false
      }]
    };
    $scope.mtfFormData = {
      'question': {
        'text': '',
        'image': '',
        'audio': '',
        'hint': ''
      },
      'option': {
        'optionsLHS': [{
          'text': '',
          'image': '',
          'audio': '',
          'hint': '',
          'index': 1
        }, {
          'text': '',
          'image': '',
          'audio': '',
          'hint': '',
          'index': 2
        }, {
          'text': '',
          'image': '',
          'audio': '',
          'hint': '',
          'index': 3
        }],
        'optionsRHS': [{
          'text': '',
          'image': '',
          'audio': '',
          'hint': '',
          'mapIndex': 1
        }, {
          'text': '',
          'image': '',
          'audio': '',
          'hint': '',
          'mapIndex': 2
        }, {
          'text': '',
          'image': '',
          'audio': '',
          'hint': '',
          'mapIndex': 3
        }]
      }
    };
    $scope.questionMedia = {};
    $scope.optionsMedia = {
      'image': [],
      'audio': []
    };
    $scope.mtfFormData.media = [];
    $scope.editMedia = [];
    var questionInput = CKEDITOR.replace('mtfQuestion', {
      customConfig: CKEDITOR.basePath + "config.js",
      skin: 'moono-lisa,' + CKEDITOR.basePath + "skins/moono-lisa/",
      contentsCss: CKEDITOR.basePath + "contents.css"
    });
    questionInput.on('change', function() {
      $scope.mtfFormData.question.text = this.getData();
    });

    $scope.init = function() {
      if (!ecEditor._.isUndefined($scope.questionEditData)) {
        var data = $scope.questionEditData.data;
        $scope.mtfFormData.question = data.question;
        $scope.mtfFormData.option = data.option;
        $scope.editMedia = $scope.questionEditData.media;
        if ($scope.mtfFormData.option.length < 3) {
          $scope.mtfFormData.option.splice(3, 1);
        }
      }
      $scope.$parent.$on('question:form:val', function(event) {
        if ($scope.formValidation()) {
          $scope.$emit('question:form:valid', $scope.mtfFormData);
        } else {
          $scope.$emit('question:form:inValid', $scope.mtfFormData);
        }
      })
    }
    $scope.addPair = function() {

      var optionLHS = {
        'text': '',
        'image': '',
        'audio': '',
        'hint': '',
        'index': $scope.indexCount
      };
      var optionRHS = {
        'text': '',
        'image': '',
        'audio': '',
        'hint': '',
        'mapIndex': $scope.indexCount++
      };
      if ($scope.mtfFormData.option.optionsLHS.length < 5) {
        $scope.mtfFormData.option.optionsLHS.push(optionLHS);
        $scope.mtfFormData.option.optionsRHS.push(optionRHS);
      }
    }
    //on click next the form validation function called
    $scope.formValidation = function() {
      console.log($scope.mtfFormData);
      var opSel = false;
      var valid = false;
      //check form valid and lhs should be more than 3
      var formValid = $scope.mtfForm.$valid && $scope.mtfFormData.option.optionsLHS.length > 2;
      $scope.submitted = true;
      if (formValid) {
        opSel = true;
        $scope.selLbl = 'success';
      } else {
        opSel = false;
        $scope.selLbl = 'error';
      }
      var tempArray = [];
      _.isEmpty($scope.questionMedia.image) ? 0 : tempArray.push($scope.questionMedia.image);
      _.isEmpty($scope.questionMedia.audio) ? 0 : tempArray.push($scope.questionMedia.audio);
      _.each($scope.optionsMedia.image, function(key, val) {
        tempArray.push(key);
      });
      _.each($scope.optionsMedia.audio, function(key, val) {
        tempArray.push(key);
      });
      var temp = tempArray.filter(function(element) {
        return element !== undefined;
      });
      $scope.editMedia = _.union($scope.editMedia, temp);
      $scope.mtfFormData.media = $scope.editMedia;
      console.log("Form data", $scope.mtfFormData);
      return (formValid && opSel) ? true : false;
    }
    $scope.deletePair = function(id) {
      $scope.mtfFormData.option.optionsLHS.splice(id, 1);
      $scope.mtfFormData.option.optionsRHS.splice(id, 1);
      //}
    }
    $scope.addImage = function(id, type) {
      ecEditor.dispatchEvent('org.ekstep.assetbrowser:show', {
        type: 'image',
        search_filter: {}, // All composite keys except mediaType
        callback: function(data) {
          var tempImage = {
            "id": Math.floor(Math.random() * 1000000000), // Unique identifier
            "src": org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src), // Media URL
            "assetId": data.assetMedia.id, // Asset identifier
            "type": "image", // Type of asset (image, audio, etc)
            "preload": false // true or false
          };
          if (id == 'q') {
            $scope.mtfFormData.question.image = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
            $scope.questionMedia.image = tempImage;
          } else if (type == 'LHS') {
            $scope.mtfFormData.option.optionsLHS[id].image = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
            $scope.optionsMedia.image[id] = tempImage;
          } else if (type == 'RHS') {
            $scope.mtfFormData.option.optionsRHS[id].image = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
            $scope.optionsMedia.image[id] = tempImage;
          }
        }
      });
    }
    $scope.addAudio = function(id, type) {
      ecEditor.dispatchEvent('org.ekstep.assetbrowser:show', {
        type: 'audio',
        search_filter: {}, // All composite keys except mediaType
        callback: function(data) {
          var tempAudio = {
            "id": Math.floor(Math.random() * 1000000000), // Unique identifier
            "src": org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src), // Media URL
            "assetId": data.assetMedia.id, // Asset identifier
            "type": "audio", // Type of asset (image, audio, etc)
            "preload": false // true or false
          };
          if (id == 'q') {
            $scope.mtfFormData.question.audio = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
            $scope.questionMedia.audio = tempAudio;
          } else if (type == 'LHS') {
            $scope.mtfFormData.option.optionsLHS[id].audio = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
            $scope.optionsMedia.audio[id] = tempAudio;
          } else if (type == 'RHS') {
            $scope.mtfFormData.option.optionsRHS[id].audio = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
            $scope.optionsMedia.audio[id] = tempAudio;
          }
        }
      });
    }
    $scope.deleteImage = function(id, type) {
      if (id == 'q') {
        $scope.mtfFormData.question.image = '';
        delete $scope.questionMedia.image;
      } else if (type == 'LHS') {
        $scope.mtfFormData.option.optionsLHS[id].image = '';
        delete $scope.optionsMedia.image[id];
      } else if (type == 'RHS') {
        $scope.mtfFormData.option.optionsRHS[id].image = '';
        delete $scope.optionsMedia.image[id];
      }
    }
    $scope.deleteAudio = function(id, type) {
      if (id == 'q') {
        $scope.isPlayingQ = false;
        $scope.mtfFormData.question.audio = '';
        delete $scope.questionMedia.audio;
      } else if (type == 'LHS') {
        $scope.mtfFormData.option.optionsLHS[id].audio = '';
        delete $scope.optionsMedia.audio[id];
      } else if (type == 'RHS') {
        $scope.mtfFormData.option.optionsRHS[id].audio = '';
        delete $scope.optionsMedia.audio[id];
      }
    }
    $scope.generateTelemetry = function(data, event) {
      if (data) ecEditor.getService('telemetry').interact({
        "type": data.type,
        "subtype": data.subtype,
        "id": data.id,
        "pageId": ecEditor.getCurrentStage().id,
        "target": {
          "id": event.target.id,
          "ver": "1.0",
          "type": data.type
        },
        "plugin": {
          "id": "org.ekstep.questionunit.mtf",
          "ver": "1.0"
        }
      })
    }
  }]);
//# sourceURL=horizontalMtf.js