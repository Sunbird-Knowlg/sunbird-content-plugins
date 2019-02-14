(function () {
    CKEDITOR.plugins.add('urdu', {
        init: function (editor) {

            editor.on('afterPaste', checkAddUrduSupport)
            editor.on('contentDom', function () {
                this.editable().attachListener(editor.document, 'input', checkAddUrduSupport);
            })

            function checkAddUrduSupport() {
                var inputText = editor.getData();
                var inputTextAsElement = new DOMParser().parseFromString(inputText, 'text/html').body.firstElementChild;
                if (inputTextAsElement) {
                    if (isUrdu(inputText)) {
                        if (inputTextAsElement.getAttribute('dir') != 'rtl') {
                            inputTextAsElement.setAttribute("dir", "rtl");
                            addUrduStyle(inputTextAsElement);
                            editor.setData(inputTextAsElement.outerHTML);
                        }
                    } else {
                        if (inputTextAsElement.getAttribute('dir') == 'rtl') {
                            removeUrduStyle(inputTextAsElement);
                            inputTextAsElement.removeAttribute("dir");
                            editor.setData(inputTextAsElement.outerHTML);
                        }
                    }
                }
            }

            function isUrdu(string) {
                var urduUniCodeList = /[\u0600-\u06FF]/;
                return urduUniCodeList.test(string)
            }

            function addUrduStyle(element) {
                element.setAttribute('class', 'urdu-text');
            }

            function removeUrduStyle(element) {
                element.classList.remove('urdu-text');
            }

        }

    });
})()

//# sourceURL=urdu-ckeditor-plugin.js