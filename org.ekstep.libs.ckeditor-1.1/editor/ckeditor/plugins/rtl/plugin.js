/*
 * Custom CK-Editor Plugin for rtl language support
 * Sivashanmugam Kannan<sivashanmugam.kannan@funtoot.com>
 * @example 
 * Add rtl as part of extra Plugins in ck-editor config
 * config.extraPlugins = 'rtl'
 */

(function () {
    CKEDITOR.plugins.add('rtl', {
        init: function (editor) {

            function RTLLang(language, unicodes, cssClass) {
                this.language = language;
                this.unicodes = unicodes;
                this.cssClass = cssClass
            }
            RTLLang.list = [];
            RTLLang.isRTL = function(string) {
                var returnVal;
                this.list.forEach(function (lang) {
                    if(lang.containsLangText(string)){
                        returnVal = lang;
                    } 
                })
                return returnVal;
            }

            RTLLang.removeStyle = function(element){
                this.list.forEach(function (lang) {
                    element.classList.remove(lang.cssClass);
                })
            }

            RTLLang.prototype = {
                containsLangText: function (string) {
                    return this.unicodes.test(string)
                },
                addStyle: function (element) {
                    element.setAttribute('class', this.cssClass);
                }
            }

            // Push the RTL support required languages list here
            RTLLang.list.push(new RTLLang('urdu', /[\u0600-\u06FF]/, 'urdu-text'));

            editor.on('afterPaste', addRTLSupport)
            editor.on('contentDom', function () {
                this.editable().attachListener(editor.document, 'input', addRTLSupport);
            })

            editor.addCommand('RTLSupport', {
                exec: function () {
                    addRTLSupport();
                }
            });

            function addRTLSupport() {
                var inputText = editor.getData();
                var inputTextAsElement = new DOMParser().parseFromString(inputText, 'text/html').body.firstElementChild;
                if (inputTextAsElement) {
                    var rtlLang = RTLLang.isRTL(inputText);
                    if (rtlLang) {
                        if (inputTextAsElement.getAttribute('dir') != 'rtl') {
                            inputTextAsElement.setAttribute("dir", "rtl");
                            rtlLang.addStyle(inputTextAsElement)
                            editor.setData(inputTextAsElement.outerHTML);
                        }
                    } else {
                        if (inputTextAsElement.getAttribute('dir') == 'rtl') {
                            RTLLang.removeStyle(inputTextAsElement);
                            inputTextAsElement.removeAttribute("dir");
                            editor.setData(inputTextAsElement.outerHTML);
                        }
                    }
                }
            }
        }

    });
})()

//# sourceURL=rtl-ckeditor-plugin.js