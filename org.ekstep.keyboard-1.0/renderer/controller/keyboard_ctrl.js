'use strict';
app.controllerProvider.register("KeyboardCtrl", function($scope) {
    $scope.keyboardVisible = false;
    $scope.answerText = undefined;
    $scope.upperCase = true;
    $scope.lowerCase = false;
    $scope.answerText = '';

    EkstepRendererAPI.addEventListener("renderer:keyboard:invoke", function(e, callback) {
        $scope.callback = callback;
        $scope.config = e.target;
        $scope.question = $scope.config.question.text.replace(/\[\[.*?\]\]/g, '____');
        $scope.keyboardVisible = true;
        var customButtons = '';
        $scope.answerText = '';
        if ($scope.config.question.keyboardConfig.keyboardType == "English") {
            $scope.hideDeviceKeyboard();
            $("#qs-ftb-text").hide();
            customButtons = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
            $("#parentDivMainKeyboard").length ? "" : $scope.createKeyboard(customButtons, $scope.config);
        } else if ($scope.config.question.keyboardConfig.keyboardType == 'Custom') {
            $scope.hideDeviceKeyboard();
            $("#qs-ftb-text").hide();
            _.each($scope.config.question.keyboardConfig.customKeys, function(key, val) {
                customButtons = customButtons + key + ',';
            });
            $("#parentDivMainKeyboard").length ? "" : $scope.createKeyboard(customButtons, $scope.config);
        } else if ($scope.config.question.keyboardConfig.keyboardType == 'Device') {
            $scope.keyboardVisible = false;
        }
        $scope.safeApply();
    });

    $scope.erasIcon = EkstepRendererAPI.resolvePluginResource("org.ekstep.keyboard", "1.0", "renderer/assets/eras_icon.png");
    $scope.langIcon = EkstepRendererAPI.resolvePluginResource("org.ekstep.keyboard", "1.0", "renderer/assets/language_icon.png");

    $scope.createKeyboard = function(customButtons, config) {
        $scope.deleteText();
        $("#erasedDiv").show();
        var asset = undefined;
        var type = "custom";
        var parentDiv = document.getElementById('keyboard');
        var keyboardMainKeysParentDiv = document.createElement('div');
        keyboardMainKeysParentDiv.id = "parentDivMainKeyboard";
        if (type == "custom") {
            customButtons = customButtons.replace(/ /g, '');
            customButtons = customButtons.split(',');
            customButtons = _.uniq(customButtons);
            var buttons = customButtons.splice(0, customButtons.length);
            var keyHeight;
            var keyWidth;
            var specialKeyButtons = ["123", " ", ",", "."];
            var firstRowdiv = document.createElement('div');
            firstRowdiv.id = "firstRow";
            if (buttons.length > 10) {
                var secondRowdiv = document.createElement('div');
                secondRowdiv.id = "secondRow";
            }
            var thirdRowdiv = document.createElement('div');
            thirdRowdiv.id = "thirdRow";
            var fontSize = 3.0;
            var customKeys = '';
            var keysForFirstRow = '';
            var keysForSecondRow = '';
            var keysForThirdRow = '';
            var eachRowLength = parseInt(buttons.length / 2);
            if (config.question.keyboardConfig.keyboardType == 'Custom') {
                for (var i = 0; i < buttons.length; i++) {
                    keysForFirstRow += '<div class="key_barakhadi" id="' + buttons[i] + '_btn" style="width: ' + keyWidth + 'px"><span>' + buttons[i] + '</span></div>';
                }
            } else {
                for (var i = 0; i < buttons.length; i++) {
                    if (i < eachRowLength) {
                        keysForFirstRow += '<div class="key_barakhadi" id="' + buttons[i] + '_btn" style="width: ' + keyWidth + 'px"><span>' + buttons[i] + '</span></div>';
                    } else {
                        keysForSecondRow += '<div class="key_barakhadi" id="' + buttons[i] + '_btn" style="width: ' + keyWidth + 'px"><span>' + buttons[i] + '</span></div>';
                    }
                }
            }
            for (var i = 0; i < specialKeyButtons.length; i++) {
                var keyWidth = "41";
                if (specialKeyButtons[i] == " ") {
                    keysForThirdRow += '<div class="spaceBar" style=" font-size:' + fontSize + 'vw;" id="' + specialKeyButtons[i] + 'MK_btn"><span>' + specialKeyButtons[i] + '</span>&nbsp;</div>';
                } else {
                    keysForThirdRow += '<div class="speacial_keys" id="' + specialKeyButtons[i] + 'MK_btn"><span>' + specialKeyButtons[i] + '</span></div>';
                }
            }
            firstRowdiv.innerHTML = '' + keysForFirstRow + '';
            if (buttons.length > 10) {
                secondRowdiv.innerHTML = '' + keysForSecondRow + '';
            }
            thirdRowdiv.innerHTML = '' + keysForThirdRow + '';
        }
        keyboardMainKeysParentDiv.appendChild(firstRowdiv);
        if (buttons.length > 10) {
            keyboardMainKeysParentDiv.appendChild(secondRowdiv);
        }
        keyboardMainKeysParentDiv.appendChild(thirdRowdiv);
        parentDiv.appendChild(keyboardMainKeysParentDiv);
        var elmnt = document.getElementById("firstRow");
        var divWidth = elmnt.offsetWidth;
        var keyWidth = (divWidth / (buttons.length - eachRowLength)) - 2;
        $(".key_barakhadi").css('width', '37px');
        $("#123MK_btn").css('font-size', '2vw');
        if (buttons.length <= 10) {
            $("#parentDivMainKeyboard > #secondRow").css('left', '-7%');
        }
        for (var i = buttons.length - 1; i >= 0; i--) {
            $scope.assignButtonEvent(buttons[i], 25);
        };
        for (var i = specialKeyButtons.length - 1; i >= 0; i--) {
            $scope.assignButtonEvent(specialKeyButtons[i] + "MK", 25);
        };
        /*Numeric Keyboard*/
        var keyboardNumericKeysParentDiv = document.createElement('div');
        keyboardNumericKeysParentDiv.id = "parentDivNumericKeyboard";
        customButtons = "1,2,3,4,5,6,7,8,9,0,@,?,!,%,&,*,(,),+,-,÷,×,=";
        if (type == "custom") {
            customButtons = customButtons.replace(/ /g, '');
            customButtons = customButtons.split(',');
            customButtons = _.uniq(customButtons);
            var buttons = customButtons.splice(0, customButtons.length);
            var keyHeight;
            var keyWidth;
            var specialKeyButtons = ["<", ">", " ", ",", "."];
            var firstRowdiv = document.createElement('div');
            firstRowdiv.id = "firstRow";
            var secondRowdiv = document.createElement('div');
            secondRowdiv.id = "secondRow";
            var thirdRowdiv = document.createElement('div');
            thirdRowdiv.id = "thirdRow";
            var fontSize = 3.0;
            var customKeys = '';
            var keysForFirstRow = '';
            var keysForSecondRow = '';
            var keysForThirdRow = '';
            var eachRowLength = parseInt(buttons.length / 2);
            // if() 
            for (var i = 0; i < buttons.length; i++) {
                if (i < eachRowLength) {
                    keysForFirstRow += '<div class="key_barakhadi_numeric" id="' + buttons[i] + '_btn" style="width: ' + keyWidth + 'px"><span>' + buttons[i] + '</span></div>';
                } else {
                    keysForSecondRow += '<div class="key_barakhadi_numeric" id="' + buttons[i] + '_btn" style="width: ' + keyWidth + 'px"><span>' + buttons[i] + '</span></div>';
                }
            }
            for (var i = 0; i < specialKeyButtons.length; i++) {
                var keyWidth = "41";
                if (specialKeyButtons[i] == " ") {
                    keysForThirdRow += '<div id="languageIconDiv"><img id="languageIconImage" src=" ' + $scope.langIcon + ' ">' + specialKeyButtons[i] + '</img></div>';
                    keysForThirdRow += '<div class="spaceBar" style=" font-size:' + fontSize + 'vw;" id="' + specialKeyButtons[i] + '_btn"><span>' + specialKeyButtons[i] + '</span>&nbsp;</div>';
                } else {
                    keysForThirdRow += '<div class="speacial_keys" id="' + specialKeyButtons[i] + '_btn"><span>' + specialKeyButtons[i] + '</span></div>';
                }
            }
            firstRowdiv.innerHTML = '' + keysForFirstRow + '';
            secondRowdiv.innerHTML = '' + keysForSecondRow + '';
            thirdRowdiv.innerHTML = '' + keysForThirdRow + '';
        }
        keyboardNumericKeysParentDiv.appendChild(firstRowdiv);
        keyboardNumericKeysParentDiv.appendChild(secondRowdiv);
        keyboardNumericKeysParentDiv.appendChild(thirdRowdiv);
        parentDiv.appendChild(keyboardNumericKeysParentDiv);
        var elmnt = document.getElementById("firstRow");
        var divWidth = elmnt.offsetWidth;
        var keyWidth = (divWidth / (buttons.length - eachRowLength)) - 2;
        $(".key_barakhadi_numeric").css('width', '37px');
        $("#parentDivNumericKeyboard").hide();
        $("#languageIconDiv").click(function() {
            $("#parentDivMainKeyboard").show();
            $("#parentDivNumericKeyboard").hide();
        });
        $("#123MK_btn").click(function() {
            $("#parentDivMainKeyboard").hide();
            $("#parentDivNumericKeyboard").show();
        });
        for (var i = buttons.length - 1; i >= 0; i--) {
            $scope.assignButtonEvent(buttons[i], 25);
        };
        for (var i = specialKeyButtons.length - 1; i >= 0; i--) {
            $scope.assignButtonEvent(specialKeyButtons[i], 25);
        };
    }

    $scope.assignButtonEvent = function(id, limit) {
        var btn = document.getElementById(id + "_btn");
        var instance = this;
        if (btn != null) {
            btn.addEventListener("click", function(event) {
                if (event.target.innerText.endsWith("MK") == true) {
                    event.target.innerText = " ";
                }
                if (event.target.innerText == " ") {
                    $scope.answerText = $scope.answerText + " ";
                    $scope.safeApply();
                } else {
                    $scope.addLetter(event);
                }
            });
        }
    }

    $scope.addLetter = function(event) {
        if (!_.isUndefined($scope.answerText)) {
            if (event.target.innerText != '123') $scope.answerText = $scope.answerText + event.target.innerText;
        } else {
            if (event.target.innerText != '123') $scope.answerText = event.target.innerText;
        }
        $scope.safeApply();
    }

    $scope.deleteText = function() {
        div = document.createElement('div');
        div.id = "parentDivEraser";
        var eraserParent = document.createElement('div');
        eraserParent.id = "erasedDivParent";
        var eraser = document.createElement('div');
        eraser.id = "erasedDiv";
        var eraserImageElement = document.createElement("img");
        eraserImageElement.setAttribute("id", "eraserImg");
        eraserImageElement.setAttribute("src", $scope.erasIcon);
        eraser.appendChild(eraserImageElement);
        eraserParent.appendChild(eraser);
        div.appendChild(eraserParent);
        var parentDiv = document.getElementById(Renderer.divIds.gameArea);
        parentDiv.insertBefore(div, parentDiv.childNodes[0]);
        div.addEventListener("click", function() {
            $("input#txtfillblank1").val($("input#txtfillblank1").val().substr(0, $("input#txtfillblank1").val().length - 1));
            $scope.answerText = $scope.answerText.substring(0, $scope.answerText.length - 1);
            $scope.safeApply();
        });
        $("#erasedDiv").show();
    }

    $scope.changeCase = function() {
        if ($scope.upperCase == true) {
            $scope.keyboardArr.english = $scope.englishKeyboard['lowerCase'];
            $scope.keyboard = $scope.englishKeyboard['lowerCase'];
            $scope.upperCase = false;
        } else {
            $scope.keyboardArr.english = $scope.englishKeyboard['upperCase'];
            $scope.keyboard = $scope.englishKeyboard['upperCase'];
            $scope.upperCase = true;
        }
        $scope.safeApply();
    }

    $scope.numericKeys = function() {
        $scope.upperCase = false;
        $scope.keyboard = $scope.keyboardArr['numeric'];
    }

    $scope.deleteLetter = function() {
        $scope.answerText = $scope.answerText.substring(0, $scope.answerText.length - 1);
    }

    $scope.hideKeyboard = function() {
        $scope.keyboardVisible = false;
        $("#erasedDiv").remove();
        $("#parentDivMainKeyboard").remove();
        $("#parentDivNumericKeyboard").remove();
        $scope.callback($scope.answerText);
    }
    $scope.hideDeviceKeyboard = function(){
      // window.addEventListener('native.keyboardhide');
      var field = document.createElement('input');
      field.setAttribute('type', 'text');
      document.body.appendChild(field);
      setTimeout(function() {
          field.focus();
          setTimeout(function() {
              field.setAttribute('style', 'display:none;');
          }, 50);
      }, 50);
    }
});
//# sourceURL=keyboardCtrl.js