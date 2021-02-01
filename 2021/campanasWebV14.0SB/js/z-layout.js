var layoutLoader = {
    pendingCounter: 0,
    onFinished: null,
    forcingLayout:false,
    isLoading: function () {
        return this.pendingCounter > 0;
    },
    isForcingLayout:function() {
        return this.isForcingLayout;
    },
    startLoading: function () {
        this.pendingCounter++;
        //console.log("start loading:[" + this.pendingCounter + "]");
    },
    finishLoading: function () {
        this.pendingCounter--;
        //console.log("finish loading:[" + this.pendingCounter + "]");
        if (this.pendingCounter < 0) $.error("Error: pending counter in loader is < 0");
        if (this.pendingCounter == 0 && this.onFinished) this.onFinished();
    },
    whenFinish: function (callback) {
        this.onFinished = callback;
    }
};

function _zParseLayout(def, element) {
	if (!def) {
		$.error("No 'data-layout' found in element: " + (element.attr("id")?"id=" + element.attr("id"):element.html()));
	}
	def = def.toLowerCase();
	var layoutType;
	if (def.substring(0,4) == "rows") layoutType="rows";
	else if (def.substring(0,4) == "cols") layoutType="cols";
	else $.error("data-layout must start with 'rows' or 'cols' in element " + element);
	def = def.substring(4);
	if (def.substring(0,1) != "(" || def.substr(def.length-1, 1) != ")") $.error("invalid data-layout syntax. Not delimited by '(' and ')' in element " + element);
	var splitted = def.substr(1).substr(0,def.length - 2).split(",");
	var sizes = [];
	$.each(splitted, function(i, s) {
		var sizeDef, alignDef;
		var splitted2 = s.split(":");
		if (splitted2.length == 1) {
			sizeDef = splitted2[0];
			alignDef = "full";
		} else {
			sizeDef = splitted2[0];
			alignDef = splitted2[1];
		}
		if (sizeDef.substr(sizeDef.length-2) == "px") {
			sizes.push({type:"fixed", value:parseInt(sizeDef), align:alignDef});
		} else if (sizeDef.substr(sizeDef.length-1) == "%") {
			sizes.push({type:"percent", value:parseInt(sizeDef), align:alignDef});
		} else {
			$.error("Can't interpret '" + sizeDef + "' as a size specificaton in " + element);
		}
	});
	return {type:layoutType, sizes:sizes};
}

function getChildMargins(c) {
	var m = $(c).data("layout-mg");
	if (m) return m;
	if ($(c).data("layout-margin")) {
		var n = parseInt($(c).data("layout-margin"));
		if (isNaN(n)) {
			$.error("Invalid 'data-layout-margin'. Value '" + $(c).data("layout-margin") + "' should be an integer");
		}
		m = [n, n, n, n];
		$(c).data("layout-mg", m);
		return m;
	} else if ($(c).data("layout-margins")) {
		var nn = $(c).data("layout-margins").split(",");
		if (!nn || nn.length != 4) {
			$.error("Invalid 'data-layout-margins'. Value '" + $(c).data("layout-margins") + "' should be four integers, in the form 'left, top, right, bottom'");
		}
		m = [];
		$.each(nn, function(i, n) {
			n = parseInt(n);
			if (isNaN(n)) {
				$.error("Invalid 'data-layout-margins'. Value '" + $(c).data("layout-margins") + "' should be four integers, in the form 'left, top, right, bottom'");
			}
			m.push(n);
		});
		$(c).data("layout-mg", m);
		return m;
	} else {
		m = [0,0,0,0];
		$(c).data("layout-mg", m);
		return m;
	}
}

function isDivider(c) {
	return $(c).data("divider-direction") || $(c).data("divider-initial-position") || $(c).data("divider-width") || $(c).data("divider-class");
}
function isSelector(c) {
	return $(c).data("selector-initial");
}
function isLayout(c) {
	return $(c).data("layout");
}
function isMaximizable(c) {
	return $(c).data("maximizable");
}
function isAutoload(c) {
    return $(c).data("layout-autoload");
}
function isScroller(c) {
    return $(c).data("scroller-min-height") || $(c).data("scroller-min-width");
}

function playsLayout(c) {
	return isLayout(c) || isSelector(c) || isDivider(c) || isMaximizable(c) || isAutoload(c) || isScroller(c);
}
function isLayoutInitialized(c) {
	return $(c).data("layout-initialized");
}
function markLayoutInitialized(c) {
	$(c).data("layout-initialized", true);
}
function initChildLayout(c) {
	if (isLayoutInitialized(c)) return;
	if (isLayout(c)) $(c).zLayout();
	if (isDivider(c)) $(c).zDivider();
	if (isSelector(c)) $(c).zSelector();
	if (isMaximizable(c)) $(c).zMaximizable();
	if (isAutoload(c)) zAutoload(c);
	if (isScroller(c)) zScroller(c);
}
var zAutoloadCounter = 0;
var zAutoloadBuffer = [];
var zAutoloadListeners = {};
function whenAutoloadReady(autoloadId, callback) {
    var c = $("#" + autoloadId);
    if (isLayoutInitialized(c)) callback();
    else zAutoloadListeners[autoloadId] = callback;
}
function zAutoload(c) {
    if ($(c).data("zautoload-counter")) return;
    var zCounter = ++zAutoloadCounter;
    $(c).data("zautoload-counter", zCounter);
    zAutoloadBuffer[zCounter] = { html: null, controller: null };
    var path = $(c).data("layout-autoload");
    layoutLoader.startLoading();
    $.ajax({
        url: path + ".html",
        data: null,
        success: function (html) {
            zAutoloadBuffer[zCounter].html = html;
            if (zAutoloadBuffer[zCounter].controller) finishAutoload(c);
            layoutLoader.finishLoading();
        },
        error: function (xhr, errorText, errorThrown) {
            $.error("Error:" + errorThrown);
        },
        cache: false,
        dataType: "html"
    });
    layoutLoader.startLoading();
    $.ajax({
        url: path + ".js",
        data: null,
        success: function () {
            zAutoloadBuffer[zCounter].controller = controller;
            if (zAutoloadBuffer[zCounter].html) finishAutoload(c);
            layoutLoader.finishLoading();
        },
        error: function (xhr, errorText, errorThrown) {
            $.error("Error:" + errorThrown);
        },
        dataType: "script"
    });
}
function finishAutoload(c) {
    var counter = $(c).data("zautoload-counter");
    var mvc = zAutoloadBuffer[counter];
    delete zAutoloadBuffer[counter];
    $(c).html(mvc.html);
    $(c).data("controller", mvc.controller);
    markLayoutInitialized(c);
    if (mvc.controller.init) mvc.controller.init($(c), {});
    if (layoutLoader.isLoading()) {
        if (playsLayout(c) && !isLayoutInitialized(c)) initChildLayout(c);
    } else {
        doChildLayout(c);
    }
    var id = $(c).attr("id");
    if (id && zAutoloadListeners[id]) {
        zAutoloadListeners[id]();
        delete zAutoloadListeners[id];
    }
}
function zScroller(c) {
    $(c).css("overflow", "auto");
    var children = $(c).children();
    if (!children || children.length == 0) {
        $.error("Scroller has no children");
        return;
    }
    if (children.length > 1) {
        $.error("Scroller has " + children.length + " children");
        return;
    }
    var c1 = children[0];
    initChildLayout(c1);
}
var zScrollbarWidth = 20;
var zScrollbarHeight = 20;
function doZScrollLayout(c) {
    var c1 = $(c).children()[0];
    $(c1).css("position", "absolute");
    $(c1).css("left", 0);
    $(c1).css("top", 0);

    var h = $(c).height()-3;
    var w = $(c).width()-3;

    var minH = $(c).data("scroller-min-height");
    var vScroll = false;
    if (minH && h < minH) {
        h = minH;
        vScroll = true;
    }
    var minW = $(c).data("scroller-min-width");
    var hScroll = false;
    if (minW && w < minW) {
        w = minW;
        hScroll = true;
    }
    // Add scrollbars
    if (vScroll && !hScroll) {
        w -= zScrollbarWidth;
        if (minW && w < minW) {
            w = minW;
            hScroll = true;
        }
    }
    if (hScroll && !vScroll) {
        h -= zScrollbarHeight;
        if (minH && h < minH) {
            h = minH;
            vScroll = true;
        }
    }
    $(c1).height(h);
    $(c1).width(w);

    doChildLayout(c1);
}
function doChildLayout(c) {
	if ($(c).data("on-layout-resize")) {
		$(c).data("on-layout-resize")($(c).width(), $(c).height());
	}
	var r = false;
	if (playsLayout(c) && !isLayoutInitialized(c)) initChildLayout(c);
	if (isLayout(c)) {r=true; $(c).zLayout("doLayout")};
	if (isDivider(c)) {r=true; $(c).zDivider("doLayout")};
	if (isSelector(c)) {r=true; $(c).zSelector("doLayout")};
	if (isMaximizable(c)) { r = true; $(c).zMaximizable("doLayout") };
	if (isAutoload(c)) { r = true; doAutoloadLayout(c); }
	if (isScroller(c)) { r = true; doZScrollLayout(c);}
	return r;
}
function doAutoloadLayout(c) {
    if (!isLayoutInitialized(c)) return; // not loaded yet
    var children = $(c).children();
    if (!children || children.length == 0) {
        $.error("autoload has no children");
        return;
    }
    if (children.length > 1) {
        $.error("autoload has " + children.length + " children");
        return;
    }
    var c1 = children[0];
    if (layoutLoader.isLoading()) {
        if (playsLayout(c1) && !isLayoutInitialized(c1)) initChildLayout(c1);
        return;
    }
    var $c1 = $(c1);
    $c1.css("position", "absolute");
    $c1.css("left", 0);
    $c1.css("top", 0);
    var oldWidth = $c1.width();
    var oldHeight = $c1.height();
    var newWidth = $(c).width();
    var newHeight = $(c).height();
    $c1.width(newWidth);
    $c1.height(newHeight);
    if (newWidth != oldWidth || newHeight != oldHeight || layoutLoader.isForcingLayout()) {
        doChildLayout(c1);
    } else {
        if (playsLayout(c1) && !isLayoutInitialized(c1)) initChildLayout(c1);
    }
}

var isOldIE = document.all && !document.getElementsByClassName;
var oldIEResizeTimer = null;
var _oldW = -1, _oldH = -1;

$.widget(
	"z.zLayout", {
		options:{
			layoutWithWindow:false,
			sizes:null
		},
		_create:function() {
			var thisWidget = this;
			if (this.options.layoutWithWindow) {
			    if (!isOldIE) {
			        $(window).resize(function (e) {
			            if (e.target == window) {
			                thisWidget.doLayout();
			            }
			        });
			    } else {
			        _oldW = thisWidget.element.width();
			        _oldH = thisWidget.element.height();
			        $(window).resize(function (e) {
			            if (oldIEResizeTimer) {
			                clearTimeout(oldIEResizeTimer);
			            }
			            oldIEResizeTimer = setTimeout(function () {
			                oldIEResizeTimer = null;
			                if (thisWidget.element.width() == _oldW && thisWidget.element.height() == _oldH) return;
			                _oldW = thisWidget.element.width();
			                _oldH = thisWidget.element.height();
			                thisWidget.doLayout();
			            }, 500);
			        });
			    }
			}
			this.options.sizes = _zParseLayout(this.element.data("layout"), this.element);
			var children = this.element.children();
			if (children.length != this.options.sizes.sizes.length) {
				$.error("Invalid structure: " + this.options.sizes.sizes.length + " children expected, but " + children.length + " found in element " + (this.element.attr("id")?"id=" + this.element.attr("id"):this.element.html()));
			}
			markLayoutInitialized(this.element);
		    // Retard layout
			if (this.options.layoutWithWindow) {
			    // Retard layout of children, just initialize them
			    //this.showLoading();
			    layoutLoader.startLoading();
			    layoutLoader.whenFinish(function () {
			        layoutLoader.forcingLayout = true;
			        thisWidget.doLayout();
			        layoutLoader.forcingLayout = false;
			        /*
			        setTimeout(function () {
			            $.unblockUI();
			        }, 2000);
                    */
			    });
			    $.each(children, function (i, c) {
			        if (playsLayout(c) && !isLayoutInitialized(c)) initChildLayout(c);
			    });
			    layoutLoader.finishLoading();
			} else {
			    this.doLayout();
			}
			return this;
		},
		doLayout: function () {
		    var children = this.element.children();
		    if (layoutLoader.isLoading()) {
		        $.each(children, function (i, c) {
		            $(c).css("position", "absolute");
		            if (playsLayout(c) && !isLayoutInitialized(c)) initChildLayout(c);
		        });
		        return;
		    }
		    var thisW = this;
			var w = this.element.width();
			var h = this.element.height();
			var layoutType = this.options.sizes.type;
			var sizes = this.options.sizes.sizes;
			var fixedSum = 0, percentSum = 0;
			$.each(sizes, function(i, s) {
				if (s.type == "fixed") fixedSum += s.value;
				else if (s.type == "percent") percentSum += s.value;
			});
			var size2share = (layoutType=="rows"?h - fixedSum:w - fixedSum);
			var acum = 0;
			$.each(children, function (i, c) {
				var s = sizes[i];
				if (!s) {
					console.log("no size in controller for i=" + i, thisW.element);
				}
				var $c = $(c);
				var oldWidth = $c.width();
				var oldHeight = $c.height();
				var newWidth = null;
				var newHeight = null;
				$c.css("position", "absolute");
				var newSize;				
				if (i == (children.length - 1)) {
					newSize = layoutType == "cols"?w - acum:h - acum;
				} else {
					newSize = s.type == "fixed"?s.value:size2share * s.value / percentSum;
				}
				var m = getChildMargins($c);
				if (layoutType == "cols") {
					$c.css("left", acum + m[0]);
					newWidth = newSize - m[0] - m[2];
					switch(s.align) {
						case "full":$c.css("top", m[1]);newHeight = h - m[1] - m[3];break;
						case "top":$c.css("top", m[1]);break;
						case "bottom":$c.css("top", h - oldHeight - m[3]);break;
						case "center":$c.css("top", m[1] + (h - oldHeight - m[1] - m[3]) / 2);break;
					}
				} else {
					$c.css("top", acum + m[1]);
					newHeight = newSize - m[1] - m[3];
					switch(s.align) {
						case "full":$c.css("left", m[0]);newWidth = w - m[0] - m[2];break;
						case "left":$c.css("left", m[0]);break;
						case "right":$c.css("left", w - oldWidth - m[2]);break;
						case "center":$c.css("left", m[0] + (w - oldWidth - m[0] - m[2]) / 2);break;
					}
				}
				acum += newSize;
				if (newWidth != oldWidth) $c.width(newWidth);
				if (newHeight != oldHeight) $c.height(newHeight);
				if (newWidth != oldWidth || newHeight != oldHeight || layoutLoader.isForcingLayout()) {
				    doChildLayout(c);
				} else {
				    if (playsLayout(c) && !isLayoutInitialized(c)) initChildLayout(c);
				}
			});
		},
		setLayout:function(index, def) {
			var split = def.split(":");
			var alignDef = split.length==1?"full":split[1];
			var sizeDef = split[0];
			var size;
			if (sizeDef.substr(sizeDef.length-2) == "px") {
				size = {type:"fixed", value:parseInt(sizeDef), align:alignDef};
			} else if (sizeDef.substr(sizeDef.length-1) == "%") {
				size = {type:"percent", value:parseInt(sizeDef), align:alignDef};
			} else {
				$.error("Can't interpret '" + sizeDef + "' as a size specificaton setting layout");
			}
			this.options.sizes.sizes[index] = size;
			this.doLayout();
		},
		showLoading: function () {
		    $.blockUI({
		        message: "... Loading Campaign ...",
		        css: {
		            border: 'none',
		            padding: '15px',
		            backgroundColor: '#000',
		            '-webkit-border-radius': '10px',
		            '-moz-border-radius': '10px',
		            color: '#fff',
		            width: '100%',
		            height: '100%',
		            position: 'absolute',
		            left: 0,
                    top:0
		        }
		    });
		}
	}
);