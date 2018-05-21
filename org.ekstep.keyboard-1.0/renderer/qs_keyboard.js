QS_FTB_Keyboard = {};
QS_FTB_Keyboard.constant = {
  keyboardVisible: false,
  answerText: undefined,
  answerText: '',
  ftbInputTarget: '',
  buttons: {},
  keyWidth: 0,
  callbackFromKeyboard: undefined
};
QS_FTB_Keyboard.htmlLayout = '<div id = "qs_keyboard">\
    <div class="qBoxArea">\
      <div class="question">\
        <p>\
          <%= questionText %>\
        </p>\
      </div>\
    </div>\
    <div class="textBoxArea">\
      <input type="text" id="txtfillblank1" class="ansField" placeholder="Enter answer" disabled autofocus />\
    </div>\
    <div id="keyboard" class="keyboardArea">\
        <div class="parentDivMainKeyboard qc-keyboard-bottom">\
          <% if(QS_FTB_Keyboard.constant.buttons.firstRow.length >0) { %> \
            <div id="firstRowAlpha">\
              <% _.each(QS_FTB_Keyboard.constant.buttons.firstRow, function(but) { %> \
                <div onclick="QS_FTB_Keyboard.addLetter(event);" class="key_barakhadi" style="width:<%= QS_FTB_Keyboard.constant.keyWidth %>%">\
                  <span><%= but %>\</span>\
                </div>\
              <% }); %>\
            </div>\
            <div id="secondRowAlpha">\
              <% _.each(QS_FTB_Keyboard.constant.buttons.secondRow, function(but) { %> \
                <div onclick="QS_FTB_Keyboard.addLetter(event);" class="key_barakhadi" style="width:<%= QS_FTB_Keyboard.constant.keyWidth %>%">\
                  <span><%= but %>\</span>\
                </div>\
              <% }); %>\
            </div>\
            <div class="erasedDivParent">\
                <img src=<%= eraserIcon %> class="qc-erase-icon" onclick="QS_FTB_Keyboard.deleteText()" />\
            </div>\
            <% if(QS_FTB_Keyboard.constant.buttons.length > 10) { %> \
              <div id="secondRowdiv"></div>\
            <% } %> \
            <div id="thirdRowAlpha">\
                <div class="speacial_keys" onclick="QS_FTB_Keyboard.changeToNumeric()" style="font-size: 2vw;"><span>123</span></div>\
                <div class="spaceBar" onclick="QS_FTB_Keyboard.addLetter(event);" style=" font-size:3vw;"><span> </span>&nbsp;</div>\
                <div class="speacial_keys" onclick="QS_FTB_Keyboard.addLetter(event);"><span>,</span></div>\
                <div class="speacial_keys" onclick="QS_FTB_Keyboard.addLetter(event);"><span>.</span></div>\
            </div>\
            <div class="hideKeyboard">\
                <svg onclick="QS_FTB_Keyboard.hideKeyboard()" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="float: right;margin-right: 6%;margin-top: -4%;">\
                    <path d="M20 3H4c-1.1 0-1.99.9-1.99 2L2 15c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 3h2v2h-2V6zm0 3h2v2h-2V9zM8 6h2v2H8V6zm0 3h2v2H8V9zm-1 2H5V9h2v2zm0-3H5V6h2v2zm9 7H8v-2h8v2zm0-4h-2V9h2v2zm0-3h-2V6h2v2zm3 3h-2V9h2v2zm0-3h-2V6h2v2zm-7 15l4-4H8l4 4z" />\
                </svg>\
            </div>\
          <% } %> \
        </div>\
        <div id="parentDivNumericKeyboard">\
            <div id="firstRowNum">\
                <div class="key_barakhadi_numeric" onclick="QS_FTB_Keyboard.addLetter(event);"><span>1</span></div>\
                <div class="key_barakhadi_numeric" onclick="QS_FTB_Keyboard.addLetter(event);"><span>2</span></div>\
                <div class="key_barakhadi_numeric" onclick="QS_FTB_Keyboard.addLetter(event);"><span>3</span></div>\
                <div class="key_barakhadi_numeric" onclick="QS_FTB_Keyboard.addLetter(event);"><span>4</span></div>\
                <div class="key_barakhadi_numeric" onclick="QS_FTB_Keyboard.addLetter(event);"><span>5</span></div>\
                <div class="key_barakhadi_numeric" onclick="QS_FTB_Keyboard.addLetter(event);"><span>6</span></div>\
                <div class="key_barakhadi_numeric" onclick="QS_FTB_Keyboard.addLetter(event);"><span>7</span></div>\
                <div class="key_barakhadi_numeric" onclick="QS_FTB_Keyboard.addLetter(event);"><span>8</span></div>\
                <div class="key_barakhadi_numeric" onclick="QS_FTB_Keyboard.addLetter(event);"><span>9</span></div>\
                <div class="key_barakhadi_numeric" onclick="QS_FTB_Keyboard.addLetter(event);"><span>0</span></div>\
                <div class="key_barakhadi_numeric" onclick="QS_FTB_Keyboard.addLetter(event);"><span>@</span></div>\
            </div>\
            <div id="secondRowNum">\
                <div class="key_barakhadi_numeric" onclick="QS_FTB_Keyboard.addLetter(event);"><span>?</span></div>\
                <div class="key_barakhadi_numeric" onclick="QS_FTB_Keyboard.addLetter(event);"><span>!</span></div>\
                <div class="key_barakhadi_numeric" onclick="QS_FTB_Keyboard.addLetter(event);"><span>%</span></div>\
                <div class="key_barakhadi_numeric" onclick="QS_FTB_Keyboard.addLetter(event);"><span>&amp;</span></div>\
                <div class="key_barakhadi_numeric" onclick="QS_FTB_Keyboard.addLetter(event);"><span>*</span></div>\
                <div class="key_barakhadi_numeric" onclick="QS_FTB_Keyboard.addLetter(event);"><span>(</span></div>\
                <div class="key_barakhadi_numeric" onclick="QS_FTB_Keyboard.addLetter(event);"><span>)</span></div>\
                <div class="key_barakhadi_numeric" onclick="QS_FTB_Keyboard.addLetter(event);"><span>+</span></div>\
                <div class="key_barakhadi_numeric" onclick="QS_FTB_Keyboard.addLetter(event);"><span>-</span></div>\
                <div class="key_barakhadi_numeric" onclick="QS_FTB_Keyboard.addLetter(event);"><span>÷</span></div>\
                <div class="key_barakhadi_numeric" onclick="QS_FTB_Keyboard.addLetter(event);"><span>×</span></div>\
                <div class="key_barakhadi_numeric" onclick="QS_FTB_Keyboard.addLetter(event);"><span>=</span></div>\
                <div class="erasedDivParent">\
                    <img src=<%= eraserIcon %> class="qc-erase-icon" onclick="QS_FTB_Keyboard.deleteText()" />\
                </div>\
            </div>\
            <div class="third-row-numeric">\
                <div class="speacial_keys" onclick="QS_FTB_Keyboard.addLetter(event);" id="<_btn"><span>&lt;</span></div>\
                <div class="speacial_keys" onclick="QS_FTB_Keyboard.addLetter(event);" id=">_btn"><span>&gt;</span></div>\
                <div>\
                    <img src=<%= languageIcon %> class="qc-language-icon" onclick="QS_FTB_Keyboard.changeToAlphabet()" /> </div>\
                <div class="spaceBar" onclick="QS_FTB_Keyboard.addLetter(event);" style=" font-size:3vw;"><span> </span>&nbsp;</div>\
                <div class="speacial_keys" onclick="QS_FTB_Keyboard.addLetter(event);"><span>,</span></div>\
                <div class="speacial_keys" onclick="QS_FTB_Keyboard.addLetter(event);"><span>.</span></div>\
            </div>\
            <div class="hideKeyboard">\
                <svg onclick="QS_FTB_Keyboard.hideKeyboard()" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="float: right;margin-right: 6%;margin-top: -4%;">\
                    <path d="M20 3H4c-1.1 0-1.99.9-1.99 2L2 15c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 3h2v2h-2V6zm0 3h2v2h-2V9zM8 6h2v2H8V6zm0 3h2v2H8V9zm-1 2H5V9h2v2zm0-3H5V6h2v2zm9 7H8v-2h8v2zm0-4h-2V9h2v2zm0-3h-2V6h2v2zm3 3h-2V9h2v2zm0-3h-2V6h2v2zm-7 15l4-4H8l4 4z" />\
                </svg>\
            </div>\
        </div>\
    </div>\
  </div>';

QS_FTB_Keyboard.createKeyboard = function(customButtons) {
  customButtons = customButtons.replace(/ /g, '');
  customButtons = customButtons.split(',');
  customButtons = _.uniq(customButtons);
  QS_FTB_Keyboard.constant.buttons = customButtons.splice(0, customButtons.length);
  var splitButtonto = parseInt(QS_FTB_Keyboard.constant.buttons.length / 2);
  QS_FTB_Keyboard.constant.buttons.firstRow = QS_FTB_Keyboard.constant.buttons.slice(0, splitButtonto);
  QS_FTB_Keyboard.constant.buttons.secondRow = QS_FTB_Keyboard.constant.buttons.slice(splitButtonto, QS_FTB_Keyboard.constant.buttons.length);
  QS_FTB_Keyboard.constant.keyWidth = parseInt(100 / QS_FTB_Keyboard.constant.buttons.secondRow.length);
};

QS_FTB_Keyboard.changeToNumeric = function() {
  $(".parentDivMainKeyboard").hide();
  $("#parentDivNumericKeyboard").show();
};

QS_FTB_Keyboard.changeToAlphabet = function() {
  $(".parentDivMainKeyboard").show();
  $("#parentDivNumericKeyboard").hide();
};

QS_FTB_Keyboard.addLetter = function(event) {
  keyValue = event.target;
  if (!_.isUndefined(answerText)) {
    if (keyValue.innerText != '123') {
      answer.push(keyValue.innerText);
      answerText = answer.join("");
    }
  } else {
    if (keyValue.innerText != '123') answerText = event.target.innerText;
  }
  $("#txtfillblank1").val(answerText);
  $("#" + QS_FTB_Keyboard.constant.ftbInputTarget).val(answerText);
};

QS_FTB_Keyboard.deleteText = function() {
  answer.pop();
  answerText = answer.join("");
  $("#txtfillblank1").val(answerText);
  $("#" + QS_FTB_Keyboard.constant.ftbInputTarget).val(answerText);
}
QS_FTB_Keyboard.hideKeyboard = function() {
  $("#questionset #preview-ftb-horizontal").show();
  $("#qs_keyboard").hide();
  QS_FTB_Keyboard.constant.callbackFromKeyboard(answerText);
}
//# sourceURL=qs_keyboard.js