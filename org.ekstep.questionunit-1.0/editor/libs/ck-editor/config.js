/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
CKEDITOR.editorConfig = function(config) {
  config.extraPlugins = 'wordcount,notification,font,justify,colorbutton';
  config.toolbarGroups = [
    //{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
    // { name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
    // { name: 'links' },
    // { name: 'insert' },
    // { name: 'forms' },
    // { name: 'tools' },
    // { name: 'document',     groups: [ 'mode', 'document', 'doctools' ] },
    // { name: 'others' },
    '/',
    { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
    { name: 'paragraph', groups: ['list', 'align'] },
    { name: 'styles' },
    { name: 'colors' }
  ];
  // Font pixel to wm conversion done based on taking 14px = 1em;
  config.fontSize_sizes = '18/1.285714285em;20/1.428571428em;22/1.571428571em;24/1.714285714em;26/1.857142857em;28/2em;32/2.285714285em;36/2.571428571em;40/2.857142857em;44/3.142857142em;48/3.428571428em;54/3.857142857em;60/4.285714285em;66/4.714285714em;72/5.142857142em;80/5.714285714em;88/6.285714285em;96/6.857142857em;';

  // config.fontSize_defaultLabel = '18';

  config.removePlugins = 'stylescombo, magicline';

  // Remove some buttons provided by the standard plugins, which are
  // not needed in the Standard(s) toolbar.
  config.removeButtons = 'Underline,Subscript,Superscript,Font,Format';

  // Set the most common block elemnts.
  config.format_tags = 'p;h1;h2;h3';

  // Simplify the dialog windows.
  config.removeDialogTabs = 'image:advanced;link:advanced';

  config.wordcount = {

    // Whether or not you want to show the Paragraphs Count
    showParagraphs: false,

    // Whether or not you want to show the Word Count
    showWordCount: false,

    // Whether or not you want to show the Char Count
    showCharCount: true,

    // Whether or not you want to count Spaces as Chars
    countSpacesAsChars: true,

    // Whether or not to include Html chars in the Char Count
    countHTML: false,

    // Maximum allowed Word Count, -1 is default for unlimited
    maxWordCount: -1,

    // Maximum allowed Char Count, -1 is default for unlimited
    maxCharCount: 220,

    // Add filter to add or remove element before counting (see CKEDITOR.htmlParser.filter), Default value : null (no filter)
    filter: new CKEDITOR.htmlParser.filter({
      elements: {
        div: function(element) {
          if (element.attributes.class == 'mediaembed') {
            return false;
          }
        }
      }
    })
  };
};

// Overrride ckeditor line-height css to 1.3
CKEDITOR.addCss('.cke_editable { line-height: 1.3 !important; }');

//# sourceURL=editorConfig.js