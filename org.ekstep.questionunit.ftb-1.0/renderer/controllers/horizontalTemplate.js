// TODO: Controller for horizontalTemplate.html
'use strict';
angular.module('FTBRendererApp', []).controller("FTBRendererController", function($scope) {
  var ctrl = this;
  $scope.questionObj = {
    "question": "Choose the best",
    "options": [{
      "value": {
       "id": "a",
       "type": "mixed",
       "text": "This is an Apple This is an Apple This is an Apple This is an Apple",
       "audio": "leg_aud",
       "image": "home_img"

     }
   }, {
    "value": {
     "id": "b",
     "type": "mixed",
     "text": "Mango",
     "audio": "earspell_aud",
     "image": ""
   }
 }, {
  "value": {
   "id": "c",
   "type": "mixed",
   "text": "Orange",
   "audio": "earspell_aud",
   "image": ""
 }
}, {
  "value": {
   "id": "d",
   "type": "mixed",
   "text": "Banana",
   "audio": "earspell_aud",
   "image": ""

 },

 "answer": true
}, {
  "value": {
   "id": "e",
   "type": "mixed",
   "text": "Mango1",
   "audio": "earspell_aud",
   "image": ""
 }
}, {
  "value": {
   "id": "f",
   "type": "mixed",
   "text": "Orange1",
   "audio": "earspell_aud",
   "image": ""
 }
},]
}
ctrl.selectedValue = function(value, event) {
 console.log(value,event.target.id);
 $("#"+event.target.id).parent().css("border","3px solid #166ca6").css("z-index","4").css("box-shadow","2px 2px 2px 2px #93bdda");
 $("#"+event.target.id).parent().siblings().css("border","2px solid #166ca6").css("z-index","1").css("box-shadow","none");
}
});