var dialogsCache = {};
var useDialogsCache = false;

function isDialogLoaded(path) {
	var dialogData = dialogsCache[path];
	if (!dialogData) return false;
	return dialogData.htmlLoaded && dialogData.jsLoaded;
}
function loadDialog(path, onLoaded) {
	if (isDialogLoaded(path)) {
		onLoaded();
		return;
	}
	var dialogData = dialogsCache[path];
	if (!dialogData) {
		dialogData = {htmlLoaded:false, jsLoaded:false};
		dialogsCache[path] = dialogData;
	}
	if (!dialogData.htmlLoaded) {
		$.ajax({
			url:path + ".html",
			data:null,
			success:function(html) {
				dialogsCache[path].html = html;
				dialogsCache[path].htmlLoaded = true;
				if (dialogsCache[path].jsLoaded) onLoaded();
			},
			error:function(xhr, errorText, errorThrown) {
			    $.error("Error Loaded Dialog HTML:" + errorThrown);
			},
			dataType:"html",
			cache:false
		});
		$.ajax({
			url:path + ".js",
			data:null,
			success:function() {
				dialogsCache[path].controller = controller;						
				dialogsCache[path].jsLoaded = true;
				if (dialogsCache[path].htmlLoaded) onLoaded();
			},
			error:function(xhr, errorText, errorThrown) {
			    $.error("Error Loaded Dialog JS:" + errorThrown);
			},
			dataType:"script",
			cache:false
		});
	}
}
function openDialog(path, initialData) {
	$.blockUI({
		message:"Cargando ...",
		css: { 
            border: 'none', 
            padding: '15px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .5, 
            color: '#fff' 
        }
	});
	loadDialog(path, function() {
		var controller = dialogsCache[path].controller;
		var w = controller.createInstance(dialogsCache[path].html, initialData);
		controller.init(w, initialData);
		w.dialog("open");
		$.unblockUI();
		if (!useDialogsCache) dialogsCache[path] = undefined;
	});
}
function attachRootLayoutPanelToDialog(dlg) {
	var root = $(dlg.children()[0]).zLayout();
	dlg.bind("dialogresize", function() {
		root.width(dlg.width() - 8);
		root.height(dlg.height());
		root.zLayout("doLayout");
	});
	dlg.bind("dialogopen", function() {
		root.width(dlg.width() - 8);
		root.height(dlg.height());
		root.zLayout("doLayout");
	});
}