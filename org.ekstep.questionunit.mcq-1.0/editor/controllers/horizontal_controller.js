/*
 * Plugin to create MCQ question
 * @class org.ekstep.questionunitmcq:mcqQuestionFormController
 * Jagadish P<jagadish.pujari@tarento.com>
 */
angular.module('mcqApp', [])
  .controller('mcqQuestionFormController', ['$scope', '$rootScope', function ($scope) {
    $scope.formVaild = false;
    $scope.mcqConfiguartion = {
      'questionConfig': {
        'isText': true,
        'isImage': true,
        'isAudio': true,
        'isHint': false
      },
      'optionsConfig': [{
        'isText': true,
        'isImage': true,
        'isAudio': true,
        'isHint': false
      }, {
        'isText': true,
        'isImage': true,
        'isAudio': true,
        'isHint': false
      }]
    };
    $scope.mcqFormData = {
      'question': {
        'text': '',
        'image': '',
        'audio': '',
        'hint': ''
      },
      'options': [{
        'text': '',
        'image': '',
        'audio': '',
        'hint': '',
        'isCorrect': false
      }, {
        'text': '',
        'image': '',
        'audio': '',
        'hint': '',
        'isCorrect': false
      }],
      'questionCount':0
    };
    $scope.oHint = [];
    $scope.questionMedia = {};
    $scope.optionsMedia = {
      'image': [],
      'audio': []
    };
    $scope.mcqFormData.media = [];
    $scope.editMedia = [];
    var questionInput = CKEDITOR.replace('ckedit', { // eslint-disable-line no-undef
      customConfig: CKEDITOR.basePath + "config.js", // eslint-disable-line no-undef
      skin: 'moono-lisa,' + CKEDITOR.basePath + "skins/moono-lisa/", // eslint-disable-line no-undef
      contentsCss: CKEDITOR.basePath + "contents.css" // eslint-disable-line no-undef
    });
    questionInput.on('change', function () {
      $scope.mcqFormData.question.text = this.getData();
    });
    $scope.init = function () {
      $('.menu .item').tab();
      if (!ecEditor._.isUndefined($scope.questionEditData)) {
        var data = $scope.questionEditData.data;
        $scope.mcqFormData.question = data.question;
        $scope.mcqFormData.options = data.options;
        $scope.editMedia = $scope.questionEditData.media;
        //$scope.mcqFormData.media = $scope.questionEditData.media;
        if (data.length > 2) {
          for (var j = 2; j < data.length; j++) {
            $scope.mcqFormData.options.push({
              'text': '',
              'image': '',
              'audio': '',
              'isCorrect': false
            });
            //$scope.mcqConfiguartion.optionsConfig.push({'isText':true,'isImage':true,'isAudio':true,'isHint':true});
            $scope.$safeApply();
          }
        }
        if ($scope.mcqFormData.options.length < 2) {
          $scope.mcqFormData.options.splice(2, 1);
        }
      }
      $scope.$parent.$on('question:form:val', function (event) { // eslint-disable-line no-unused-vars
        if ($scope.formValidation()) {
          /*if dynamic question assign how many questions are create that count to $scope.mcqFormData.questionCount
          Or else assign 1*/
          $scope.mcqFormData.questionCount = 1;
          $scope.$emit('question:form:valid', $scope.mcqFormData);
        } else {
          $scope.$emit('question:form:inValid', $scope.mcqFormData);
        }
      })
    }
    $scope.addAnswerField = function () {
      var option = {
        'text': '',
        'image': '',
        'audio': '',
        'isCorrect': false
      };
      if ($scope.mcqFormData.options.length < 8) $scope.mcqFormData.options.push(option);
    }
    $scope.formValidation = function () {
      var opSel = false;
      var valid = false;
      var formValid = $scope.mcqForm.$valid && $scope.mcqFormData.options.length > 1;
      $scope.submitted = true;
      if (!_.isUndefined($scope.selectedOption)) {
        _.each($scope.mcqFormData.options, function (k, v) {
          $scope.mcqFormData.options[v].isCorrect = false;
        });
        valid = true;
        $scope.mcqFormData.options[$scope.selectedOption].isCorrect = true;
      } else {
        _.each($scope.mcqFormData.options, function (k, v) { // eslint-disable-line no-unused-vars
          if (k.isCorrect) {
            valid = true;
          }
        });
      }
      if (valid) {
        opSel = true;
        $scope.selLbl = 'success';
      } else {
        opSel = false;
        $scope.selLbl = 'error';
      }
      //$scope.mcqFormData.media = [];
      var tempArray = [];
      var temp = [];
      _.isEmpty($scope.questionMedia.image) ? 0 : tempArray.push($scope.questionMedia.image);
      _.isEmpty($scope.questionMedia.audio) ? 0 : tempArray.push($scope.questionMedia.audio);
      _.each($scope.optionsMedia.image, function (key, val) { // eslint-disable-line no-unused-vars
        tempArray.push(key);
      });
      _.each($scope.optionsMedia.audio, function (key, val) { // eslint-disable-line no-unused-vars
        tempArray.push(key);
      });
      temp = tempArray.filter(function (element) {
        return element !== undefined;
      });
      $scope.editMedia = _.isEmpty(temp) ? 0 : _.union($scope.editMedia, temp);
      $scope.mcqFormData.media = _.isEmpty($scope.editMedia[0]) ? temp : $scope.editMedia;
      //check if audio is their then add audio icon in media array
      if ($scope.optionsMedia.audio.length > 0 || _.has($scope.questionMedia, "audio")) $scope.addAudioImage();
      return (formValid && opSel) ? true : false;
    }
    $scope.deleteAnswer = function (id) {
      if (id >= 0) $scope.mcqFormData.options.splice(id, 1);
    }
    //if audio added then audio icon id sent to ecml add stage
    $scope.addAudioImage = function () {
      var audioIcon = {
        id: "org.ekstep.questionset.audioicon",
        src: ecEditor.resolvePluginResource("org.ekstep.questionunit.mcq", "1.0", 'renderer/assets/audio.png'),
        assetId: "org.ekstep.questionset.audioicon",
        type: "image",
        preload: true
      };
      $scope.mcqFormData.media.push(audioIcon);
    }
    $scope.addImage = function (id) {
      ecEditor.dispatchEvent('org.ekstep.assetbrowser:show', {
        type: 'image',
        search_filter: {}, // All composite keys except mediaType
        callback: function (data) {
          var tempImage = {
            "id": Math.floor(Math.random() * 1000000000), // Unique identifier
            "src": org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src), // Media URL
            "assetId": data.assetMedia.id, // Asset identifier
            "type": "image", // Type of asset (image, audio, etc)
            "preload": false // true or false
          };
          //$scope.mcqFormData.media.push(tempImage);
          if (id == 'q') {
            $scope.mcqFormData.question.image = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
            $scope.questionMedia.image = tempImage;
          } else {
            $scope.mcqFormData.options[id].image = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
            $scope.optionsMedia.image[id] = tempImage;
          }
        }
      });
    }
    $scope.addAudio = function (id) {
      ecEditor.dispatchEvent('org.ekstep.assetbrowser:show', {
        type: 'audio',
        search_filter: {}, // All composite keys except mediaType
        callback: function (data) {
          var tempAudio = {
            "id": Math.floor(Math.random() * 1000000000), // Unique identifier
            "src": org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src), // Media URL
            "assetId": data.assetMedia.id, // Asset identifier
            "type": "audio", // Type of asset (image, audio, etc)
            "preload": false // true or false
          };
          if (id == 'q') {
            $scope.mcqFormData.question.audio = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
            $scope.questionMedia.audio = tempAudio;
          } else {
            $scope.mcqFormData.options[id].audio = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
            $scope.optionsMedia.audio[id] = tempAudio;
          }
        }
      });
    }
    $scope.addHint = function (id) {
      if (id == 'q') {
        $scope.qHint = true;
      } else {
        $scope.oHint[id] = true;
      }
    }
    $scope.deleteImage = function (id) {
      if (id == 'q') {
        $scope.mcqFormData.question.image = '';
        delete $scope.questionMedia.image;
      } else {
        $scope.mcqFormData.options[id].image = '';
        //$scope.optionsMedia.image.splice(id,1);
        delete $scope.optionsMedia.image[id];
      }
    }
    $scope.deleteAudio = function (id) {
      if (id == 'q') {
        $scope.isPlayingQ = false;
        $scope.mcqFormData.question.audio = '';
        delete $scope.questionMedia.audio;
      } else {
        $scope.mcqFormData.options[id].audio = '';
        //$scope.optionsMedia.audio.splice(id,1);
        delete $scope.optionsMedia.audio[id];
      }
    }
    $scope.deleteHint = function (id) {
      if (id == 'q') {
        $scope.qHint = false;
        $scope.mcqFormData.question.hint = '';
      } else {
        $scope.oHint[id] = false;
        $scope.mcqFormData.options[id].hint = '';
      }
    }
    $scope.generateTelemetry = function (data, event) {
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
          "id": "org.ekstep.questionunit.mcq",
          "ver": "1.0"
        }
      })
    }
  }]);
//# sourceURL=horizontalMCQ.js