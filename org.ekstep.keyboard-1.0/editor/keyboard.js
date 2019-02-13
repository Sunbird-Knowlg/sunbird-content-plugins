/**
 * Plugin to Create directive for keyboard config
 * @class keyboardCtrl
 * Jagadish Pujari <jagadish.pujari@tarento.com>
 */
'use strict';
angular.module('keyBoardApp', [])
.directive('keyboardConfig', function() {
  return {
    restrict: 'AE',
    scope: {
      data: '='
    },
    templateUrl: ecEditor.resolvePluginResource('org.ekstep.keyboard', '1.0', 'editor/keyboard.directive.html'),
    link: function(scope) {
      scope.keyboardTypes = ['Device', 'English', 'Custom'];
      if (!_.isUndefined(scope.data) && !_.isUndefined(scope.data.keyboardType))
        scope.keyboardType = scope.data.keyboardType;
      if (!_.isUndefined(scope.data) && !_.isUndefined(scope.data.keyboardType) && scope.data.keyboardType == 'Custom'){
        scope.customTag = true;
        scope.keys = scope.data.customKeys;
        var keys = scope.keys.split(',');
        var editorKeywords = _.uniq(keys);
        scope.editorKeys = [];
        _.each(editorKeywords,function(item){
          if(item)
            scope.editorKeys.push(item);
        });
      }
      else{
        scope.customTag = false;
      }
      scope.selectKeyboardType = function() {
        scope.data.keyboardType = scope.keyboardType;
        if (scope.keyboardType == 'Custom') {
          scope.customTag = true;
        } else {
          scope.customTag = false;
        }
      };
      scope.tokenizeTags = function(event) {
        scope.data.customKeys = event.target.value;
      };
      scope.updateKeys = function () {
        scope.editorKeys = [];
        var splitWords = scope.keys.split(',');
        var editorKeywords = _.uniq(splitWords);
        _.each(editorKeywords,function(item){
          if(item)
            scope.editorKeys.push(item);
        });
      };
    }
  };
});

//# sourceURL=keyboardditorCtrl.js