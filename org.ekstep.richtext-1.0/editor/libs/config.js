/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.toolbarGroups = [
		//{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		// { name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		// { name: 'links' },
		// { name: 'insert' },
		// { name: 'forms' },
		// { name: 'tools' },
		// { name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		// { name: 'others' },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph',   groups: [ 'list', 'align' ] },
		{ name: 'styles' },
		{ name: 'colors' }
	];
	config.removePlugins = 'stylescombo, magicline';
	config.font_names  = "Georgia/Georgia: Helvetica/Helvetica; Monospace/Monospace; Sans-serif/Sans-serif; Serif/Serif; Tahoma/Tahoma; Times/Times; Trebuchet MS/Trebuchet MS; Verdana/Verdana; NotoSans/NotoSans; Kannada/NotoSansKannada; Gujarati/NotoSansGujarati; Bengali/NotoSansBengali; Gurmukhi/Gurmukhi; Oriya/NotoSansOriya; Devanagari/NotoSansDevanagari; Tamil/NotoSansTamil; Telugu/NotoSansTelugu; Urdu/NotoNastaliqUrdu; Malayalam/NotoSansMalayalam"

	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	config.removeButtons = 'Underline,Subscript,Superscript';

	// Set the most common block elemnts.
	config.format_tags = 'p;h1;h2;h3';

	// Simplify the dialog windows.
	config.removeDialogTabs = 'image:advanced;link:advanced';
	config.extraPlugins = 'colorbutton,font,justify';
};

//# sourceURL=editorConfig.js