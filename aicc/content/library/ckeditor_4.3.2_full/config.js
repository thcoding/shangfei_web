/**
* @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
* For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.editorConfig = function (config) {
    config.toolbarGroups = [
		{ name: 'document', groups: ['mode', 'document', 'doctools'] },
		{ name: 'clipboard', groups: ['clipboard', 'undo'] },
		{ name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
		{ name: 'forms' },
		{ name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
		{ name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'] },
		{ name: 'links' },
		{ name: 'insert' },
		{ name: 'styles' },
		{ name: 'colors', items: ['TextColor', 'BGColor'] },
		{ name: 'tools' },
		{ name: 'others' },
		{ name: 'about' }
	];
    config.removeButtons = 'Cut,Copy,Paste,Undo,Redo,Anchor,Underline,Strike,Subscript,Superscript';
    config.font_names = '宋体/宋体;黑体/黑体;仿宋/仿宋_GB2312;楷体/楷体_GB2312;隶书/隶书;幼圆/幼圆;微软雅黑/微软雅黑;' + config.font_names;
    config.disableNativeTableHandles = false;
    config.disableObjectResizing = false;
    config.contentEditalbe = "true";
    config.removeDialogTabs = 'link:advanced';
    config.extraPlugins += (config.extraPlugins ? ',lineheight' : 'lineheight');
    config.extraPlugins += (config.extraPlugins ? ',AreaBGColor' : 'AreaBGColor');
    config.removePlugins = 'elementspath';
    config.fontSize_sizes = '8/8px;9/9px;10/10px;11/11px;12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;';
    config.resize_enabled = false;
    config.removeDialogTabs = 'table:advanced';
};




