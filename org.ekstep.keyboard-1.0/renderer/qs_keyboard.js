var Keyboard = {};
Keyboard.constant = {
  keyboardVisible: false,
  ftbInputTarget: '',
  buttons: {},
  keyWidth: 0,
  callbackFromKeyboard: undefined,
  keyboardElement: "#keyboardDiv",
  keyboardInput: "#keyboardInput"
};
Keyboard.htmlLayout = '<div id = "keyboardDiv">\
    <div class="textBoxArea">\
      <input type="text" id="keyboardInput" class="ansField" placeholder="Enter answer"  onclick="Keyboard.logTelemetryInteract(event);" disabled autofocus />\
    </div>\
    <div id="keyboard" class="keyboardArea">\
        <div class="parentDivMainKeyboard qc-keyboard-bottom">\
          <% if(Keyboard.constant.buttons.firstRow.length >0) { %> \
            <div id="firstRowAlpha">\
              <% _.each(Keyboard.constant.buttons.firstRow, function(but) { %> \
                <div onclick="Keyboard.addLetter(event);" class="key_barakhadi" style="width:<%= Keyboard.constant.keyWidth %>%">\
                  <span><%= but %>\</span>\
                </div>\
              <% }); %>\
            </div>\
            <div id="secondRowAlpha">\
              <% _.each(Keyboard.constant.buttons.secondRow, function(but) { %> \
                <div onclick="Keyboard.addLetter(event);" class="key_barakhadi" style="width:<%= Keyboard.constant.keyWidth %>%">\
                  <span><%= but %>\</span>\
                </div>\
              <% }); %>\
            </div>\
            <div class="erasedDivParent">\
                <img src=<%=_keyboardInstance.addImageIcon("renderer/assets/eras_icon.png") %> class="qc-erase-icon" onclick="Keyboard.deleteText();" />\
            </div>\
            <% if(Keyboard.constant.buttons.length > 10) { %> \
              <div id="secondRowdiv"></div>\
            <% } %> \
            <div id="thirdRowAlpha">\
                <div class="special_keys" onclick="Keyboard.changeToNumeric()" style="font-size: 2vw;"><span>123</span></div>\
                <div class="spaceBar" onclick="Keyboard.addLetter(event);" style=" font-size:3vw;"><span> </span>&nbsp;</div>\
                <div class="special_keys" onclick="Keyboard.addLetter(event);"><span>,</span></div>\
                <div class="special_keys" onclick="Keyboard.addLetter(event);"><span>.</span></div>\
            </div>\
            <div class="hideKeyboard">\
                <img src=<%=_keyboardInstance.addImageIcon("renderer/assets/keyboard.svg") %> onclick="Keyboard.hideKeyboard();Keyboard.logTelemetryInteract(event);" />\
            </div>\
          <% } %> \
        </div>\
        <div id="parentDivNumericKeyboard">\
            <div id="firstRowNum">\
                <div class="key_barakhadi_numeric" onclick="Keyboard.addLetter(event);"><span>1</span></div>\
                <div class="key_barakhadi_numeric" onclick="Keyboard.addLetter(event);"><span>2</span></div>\
                <div class="key_barakhadi_numeric" onclick="Keyboard.addLetter(event);"><span>3</span></div>\
                <div class="key_barakhadi_numeric" onclick="Keyboard.addLetter(event);"><span>4</span></div>\
                <div class="key_barakhadi_numeric" onclick="Keyboard.addLetter(event);"><span>5</span></div>\
                <div class="key_barakhadi_numeric" onclick="Keyboard.addLetter(event);"><span>6</span></div>\
                <div class="key_barakhadi_numeric" onclick="Keyboard.addLetter(event);"><span>7</span></div>\
                <div class="key_barakhadi_numeric" onclick="Keyboard.addLetter(event);"><span>8</span></div>\
                <div class="key_barakhadi_numeric" onclick="Keyboard.addLetter(event);"><span>9</span></div>\
                <div class="key_barakhadi_numeric" onclick="Keyboard.addLetter(event);"><span>0</span></div>\
                <div class="key_barakhadi_numeric" onclick="Keyboard.addLetter(event);"><span>@</span></div>\
            </div>\
            <div id="secondRowNum">\
                <div class="key_barakhadi_numeric" onclick="Keyboard.addLetter(event);"><span>?</span></div>\
                <div class="key_barakhadi_numeric" onclick="Keyboard.addLetter(event);"><span>!</span></div>\
                <div class="key_barakhadi_numeric" onclick="Keyboard.addLetter(event);"><span>%</span></div>\
                <div class="key_barakhadi_numeric" onclick="Keyboard.addLetter(event);"><span>&amp;</span></div>\
                <div class="key_barakhadi_numeric" onclick="Keyboard.addLetter(event);"><span>*</span></div>\
                <div class="key_barakhadi_numeric" onclick="Keyboard.addLetter(event);"><span>(</span></div>\
                <div class="key_barakhadi_numeric" onclick="Keyboard.addLetter(event);"><span>)</span></div>\
                <div class="key_barakhadi_numeric" onclick="Keyboard.addLetter(event);"><span>+</span></div>\
                <div class="key_barakhadi_numeric" onclick="Keyboard.addLetter(event);"><span>-</span></div>\
                <div class="key_barakhadi_numeric" onclick="Keyboard.addLetter(event);"><span>÷</span></div>\
                <div class="key_barakhadi_numeric" onclick="Keyboard.addLetter(event);"><span>×</span></div>\
                <div class="key_barakhadi_numeric" onclick="Keyboard.addLetter(event);"><span>=</span></div>\
                <div class="erasedDivParent">\
                    <img src=<%=_keyboardInstance.addImageIcon("renderer/assets/eras_icon.png") %> class="qc-erase-icon" onclick="Keyboard.deleteText()" />\
                </div>\
            </div>\
            <div class="third-row-numeric">\
                <div class="special_keys" onclick="Keyboard.addLetter(event);" id="<_btn"><span>&lt;</span></div>\
                <div class="special_keys" onclick="Keyboard.addLetter(event);" id=">_btn"><span>&gt;</span></div>\
                <div>\
                    <img src=<%=_keyboardInstance.addImageIcon("renderer/assets/language_icon.png") %> class="qc-language-icon" onclick="Keyboard.changeToAlphabet()" /> </div>\
                <div class="spaceBar" onclick="Keyboard.addLetter(event);" style=" font-size:3vw;"><span> </span>&nbsp;</div>\
                <div class="special_keys" onclick="Keyboard.addLetter(event);"><span>,</span></div>\
                <div class="special_keys" onclick="Keyboard.addLetter(event);"><span>.</span></div>\
            </div>\
            <div class="hideKeyboard">\
              <img src=<%=_keyboardInstance.addImageIcon("renderer/assets/keyboard.svg") %> onclick="Keyboard.hideKeyboard();Keyboard.logTelemetryInteract(event);" />\
            </div>\
        </div>\
    </div>\
  </div>';

Keyboard.createKeyboard = function(customButtons) {
  customButtons = customButtons.replace(/ /g, '');
  customButtons = customButtons.split(',');
  customButtons = _.uniq(customButtons);
  Keyboard.constant.buttons = customButtons.splice(0, customButtons.length);
  var splitButtonto = parseInt(Keyboard.constant.buttons.length / 2);
  Keyboard.constant.buttons.firstRow = Keyboard.constant.buttons.slice(0, splitButtonto);
  Keyboard.constant.buttons.secondRow = Keyboard.constant.buttons.slice(splitButtonto, Keyboard.constant.buttons.length);
  Keyboard.constant.keyWidth = parseInt(100 / Keyboard.constant.buttons.secondRow.length);
};

Keyboard.changeToNumeric = function() {
  $(".parentDivMainKeyboard").hide();
  $("#parentDivNumericKeyboard").show();
};

Keyboard.changeToAlphabet = function() {
  $(".parentDivMainKeyboard").show();
  $("#parentDivNumericKeyboard").hide();
};

Keyboard.addLetter = function(event) {
  var keyValue = event.target;
  if (!_.isUndefined(inputValue)) { // eslint-disable-line no-undef
    if (keyValue.innerText != '123') {
      targetInputValue.push(keyValue.innerText); // eslint-disable-line no-undef
      inputValue = targetInputValue.join(""); // eslint-disable-line no-undef
    }
  } else {
    if (keyValue.innerText != '123') inputValue = event.target.innerText; // eslint-disable-line no-undef
  }
  $(Keyboard.constant.keyboardInput).val(inputValue); // eslint-disable-line no-undef
  $("#" + Keyboard.constant.ftbInputTarget).val(inputValue); // eslint-disable-line no-undef
};
Keyboard.deleteText = function() {
  targetInputValue.pop(); // eslint-disable-line no-undef
  inputValue = targetInputValue.join(""); // eslint-disable-line no-undef
  $(Keyboard.constant.keyboardInput).val(inputValue); // eslint-disable-line no-undef
  $("#" + Keyboard.constant.ftbInputTarget).val(inputValue); // eslint-disable-line no-undef
}
Keyboard.hideKeyboard = function() {
  $(Keyboard.constant.keyboardElement).hide();
  Keyboard.constant.callbackFromKeyboard(inputValue); // eslint-disable-line no-undef
}
Keyboard.logTelemetryInteract = function(event) {
  QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.TOUCH, { type: QSTelemetryLogger.EVENT_TYPES.TOUCH, id: event.target.id }); // eslint-disable-line no-undef
}
//# sourceURL=qs_keyboard.js