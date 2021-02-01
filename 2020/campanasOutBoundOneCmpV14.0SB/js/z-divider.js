$.widget(
	"z.zDivider", {
		options:{
			direction:"h",
			initialPosition:80,
			width:6,
			margin:4,
			hideDirection:null,
			dividerClass:null,
			hidden:false,
			relativeTo:null
		},
		_create:function() {
			var thisWidget = this;
			if (this.element.data("divider-direction")) {
				this.options.direction = this.element.data("divider-direction");				
			}
			if (this.element.data("divider-initial-position")) {
				this.options.initialPosition = parseInt(this.element.data("divider-initial-position"));				
			}
			if (this.element.data("divider-width")) {
				this.options.width = parseInt(this.element.data("divider-width"));				
			}
			if (this.element.data("divider-margin")) {
				this.options.margin = parseInt(this.element.data("divider-margin"));				
			}
			if (this.element.data("divider-class")) {
				this.options.dividerClass = this.element.data("divider-class");				
			} else {
				this.options.dividerClass = "ui-button ui-widget ui-state-default";
			}
			if (this.element.data("hide-direction")) {
				this.options.hideDirection = this.element.data("hide-direction");				
			}
			if (this.element.data("position-relativeto")) {
				this.options.relativeTo = this.element.data("position-relativeto");
			} else {
				if (this.options.direction == "h") {
					this.options.relativeTo = "left";
				} else {
					this.options.relativeTo = "top";
				}
			}
			if (this.element.children().length != 2) $.error("Divider must have two children, but " + this.element.children().length + " found. In divider " + this.element.html());
			this.element.append("<div id='slider' class='" + this.options.dividerClass + "'></div>");
			var hidder = null;
			if (this.options.hideDirection) {
				var hidderHtml = "<div style='position:absolute; width:20px; height:20px; cursor:pointer;' class='ui-button ui-widget ui-state-default ui-corner-all'><span class='ui-icon ui-icon-check' style='display:inline-block; margin-top:2px;'></span></div>";
				this.element.append(hidderHtml);
				hidder = $(this.element.children()[3]);
				hidder.hide();
			}
			var p1 = $(this.element.children()[0]);
			var p2 = $(this.element.children()[1]);
			p1.css("position", "absolute");
			p2.css("position", "absolute");
			var slider = $(this.element.children()[2]);
			var timer = null;
			slider.hover(
				function() {
					if (!thisWidget.element.data("divider-class")) {slider.addClass("ui-state-hover");}						
					if (hidder) thisWidget._showHidder();
				}, function() {
					if (!thisWidget.element.data("divider-class")) {slider.removeClass("ui-state-hover")};
					if (hidder) {
						if (timer) clearTimeout(timer);
						timer = setTimeout(function() {
							thisWidget._hideHidder();
						}, 1000);						
					}
				}
			);
			if (hidder) {
				hidder.hover(
					function() {
						hidder.addClass("ui-state-hover");						
					}, function() {
						hidder.removeClass("ui-state-hover");
					}
				);
				hidder.click(function() {
					thisWidget._activateHidder();
				});
			}
			slider.css("position", "absolute");
			this.element.data("divider", {dragStart:0, position:this.options.initialPosition});
			slider.draggable({
				axis:(thisWidget.options.direction == "h"?"x":"y"),
				containment: "parent",
				start:function(event, ui) {
					if (thisWidget.options.direction == "h") thisWidget.element.data("divider").dragStart = event.pageX;
					else thisWidget.element.data("divider").dragStart = event.pageY;
				},
				drag:function() {
					if (hidder) thisWidget._showHidder();
				},
				stop:function(event, ui) {
					if (thisWidget.options.hidden) thisWidget._cancelHide();
					var slider = $(thisWidget.element.children()[2]);
					var opts = thisWidget.options; 
					var dragStart = thisWidget.element.data("divider").dragStart;
					var currentPos = thisWidget.element.data("divider").position;
					// transform currentPos to screen coordinates before validation
					if (opts.direction == "h" && opts.relativeTo == "right") {
						currentPos = thisWidget.element.width() - currentPos;
					} else if (opts.direction == "v" && opts.relativeTo == "bottom") {
						currentPos = thisWidget.element.height() - currentPos;
					}
					var newPos;
					if (opts.hideDirection) thisWidget._showHidder();
					if (opts.direction == "h") {
						newPos = currentPos + (event.pageX - dragStart);
						if (newPos + slider.width() > thisWidget.element.width()) newPos = thisWidget.element.width() - slider.width() - 1;
						if (newPos < 0) newPos = 0;
					} else {
						newPos = currentPos + (event.pageY - dragStart);
						if (newPos + slider.height() > thisWidget.element.height()) newPos = thisWidget.element.height() - slider.height() - 1;
						if (newPos < 0) newPos = 0;
					}
					// transform newPos to divider coordinates
					if (opts.direction == "h" && opts.relativeTo == "right") {
						newPos = thisWidget.element.width() - newPos;
					} else if (opts.direction == "v" && opts.relativeTo == "bottom") {
						newPos = thisWidget.element.height() - newPos;
					}
					
					thisWidget.element.data("divider").position = newPos;
					thisWidget.doLayout();
				}
			});

			if (this.options.direction == "h") {
				p1.css("left", 0);
				p1.css("top", 0);
				p2.css("top", 0);
				slider.css("top", 0);
				slider.width(this.options.width);		
				slider.css("cursor", "e-resize");
			} else {
				p1.css("left", 0);
				p1.css("top", 0);
				p2.css("left", 0);
				slider.css("left", 0);
				slider.height(this.options.width);
				slider.css("cursor", "s-resize");	
			}
			markLayoutInitialized(this.element);
		},
		_setHidderIcon:function() {
			var hidderIcon;
			var hidder = $(this.element.children()[3]);
			var hidderSpan = $(hidder.children()[0]);
			var hidden = this.options.hidden;
			if (this.options.hideDirection == "left") {					
				if (!hidden) hidderIcon = "ui-icon-circle-triangle-w";
				else hidderIcon = "ui-icon-circle-triangle-e";
			} else if (this.options.hideDirection == "right") {					
				if (!hidden) hidderIcon = "ui-icon-circle-triangle-e";
				else hidderIcon = "ui-icon-circle-triangle-w";
			} else if (this.options.hideDirection == "top") {					
				if (!hidden) hidderIcon = "ui-icon-circle-triangle-n";
				else hidderIcon = "ui-icon-circle-triangle-s";
			} else if (this.options.hideDirection == "bottom") {					
				if (!hidden) hidderIcon = "ui-icon-circle-triangle-s";
				else hidderIcon = "ui-icon-circle-triangle-n";
			} else {
				$.error("Hide direction '" + this.options.hideDirection + "' not recognized");
			}
			hidderSpan.removeClass().addClass("ui-icon").addClass(hidderIcon);
		},
		_showHidder:function() {
			var slider = $(this.element.children()[2]);
			var hidder = $(this.element.children()[3]);
			this._setHidderIcon();
			if (this.options.direction == "h") {
				var l = parseFloat(slider.css("left")) + (slider.width() - hidder.width()) / 2;
				hidder.show();
				hidder.css("left", l);
				hidder.css("top", 0);
				slider.css("top", 24);
				slider.height(this.element.height() - 24);
			} else {
				var l = parseFloat(slider.css("top")) + (slider.height() - hidder.height()) / 2;
				hidder.show();
				hidder.css("top", l);
				hidder.css("left", 0);
				slider.css("left", 24);
				slider.width(this.element.width() - 24);
			}
		},
		_hideHidder:function() {
			var slider = $(this.element.children()[2]);
			var hidder = $(this.element.children()[3]);
			if (this.options.direction == "h") {
				hidder.hide();
				slider.css("top", 0);
				slider.height(this.element.height());
			} else {
				hidder.hide();
				slider.css("left", 0);
				slider.width(this.element.width());
			}
		},
		_activateHidder:function() {
			var thisWidget = this;
			var p1 = $(this.element.children()[0]);
			var p2 = $(this.element.children()[1]);
			var slider = $(this.element.children()[2]);
			var hidder = $(this.element.children()[3]);
			var hidden = this.options.hidden;
			if (!hidden) {
				this.element.data("divider").beforeHidePosition = this.element.data("divider").position;
				if (this.options.direction == "h") {
					if (this.options.hideDirection == "left") {
						var finalPos = this.options.margin;
						var finalHidder = finalPos + (slider.width() - hidder.width()) / 2;
						slider.animate({left:finalPos});hidder.animate({left:finalHidder});
						p1.animate({opacity:0}, function() {
							thisWidget.element.data("divider").position = finalPos;
							p1.css("opacity", 1);
							p1.hide();
							thisWidget.doLayout();
						});
					} else {
						var finalPos = this.element.width() - slider.width() - this.options.margin;
						var finalHidder = finalPos + (slider.width() - hidder.width()) / 2;
						slider.animate({left:finalPos});hidder.animate({left:finalHidder});
						p2.animate({opacity:0}, function() {
							thisWidget.element.data("divider").position = finalPos;
							p2.css("opacity", 1);
							p2.hide();
							thisWidget.doLayout();
						});
					}
				} else {  // !hidden && "v"
					if (this.options.hideDirection == "top") {
						var finalPos = this.options.margin;
						var finalHidder = finalPos + (slider.height() - hidder.height()) / 2;
						slider.animate({top:finalPos});hidder.animate({top:finalHidder});
						p1.animate({opacity:0}, function() {
							thisWidget.element.data("divider").position = finalPos;
							p1.css("opacity", 1);
							p1.hide();
							thisWidget.doLayout();
						});
					} else {
						var finalPos = this.element.height() - slider.height() - this.options.margin;
						var finalHidder = finalPos + (slider.height() - hidder.height()) / 2;
						slider.animate({top:finalPos});hidder.animate({top:finalHidder});
						p2.animate({opacity:0}, function() {
							thisWidget.element.data("divider").position = finalPos;
							p2.css("opacity", 1);
							p2.hide();
							thisWidget.doLayout();
						});
					}
				}
				this.options.hidden = true;
			} else { // hidden
				if (this.options.direction == "h") {
					if (this.options.hideDirection == "left") {
						var startPos = this.options.margin;
						var startHidder = startPos + (slider.width() - hidder.width()) / 2;
						var pos = this.element.data("divider").beforeHidePosition;
						var finalHidder = pos + (slider.width() - hidder.width()) / 2;
						this.element.data("divider").position = pos;
						slider.hide();
						this.doLayout();
						slider.css("left", startPos);
						slider.show();
						p1.css("opacity", 0);
						p1.show();
						if (this.options.relativeTo == "right") {
							pos = this.element.width() - pos;
							finalHidder = this.element.width() - finalHidder;
						}
						slider.animate({left:pos});
						hidder.animate({left:finalHidder});
						p1.animate({opacity:1}, function() {
							thisWidget.doLayout();
						});
					} else {
						var startPos = this.element.width() - slider.width() - this.options.margin;
						var startHidder = startPos + (slider.width() - hidder.width()) / 2;
						var pos = this.element.data("divider").beforeHidePosition;
						var finalHidder = pos + (slider.width() - hidder.width()) / 2;
						this.element.data("divider").position = pos;
						slider.hide();
						this.doLayout();
						slider.css("left", startPos);
						slider.show();
						p2.css("opacity", 0);
						p2.show();
						if (this.options.relativeTo == "right") {
							pos = this.element.width() - pos;
							finalHidder = this.element.width() - finalHidder;
						}
						slider.animate({left:pos});
						hidder.animate({left:finalHidder});
						p2.animate({opacity:1}, function() {
							thisWidget.doLayout();
						});
					}
				} else { // hidden & "v"
					if (this.options.hideDirection == "top") {
						var startPos = this.options.margin;
						var startHidder = startPos + (slider.height() - hidder.height()) / 2;
						var pos = this.element.data("divider").beforeHidePosition;
						var finalHidder = pos + (slider.height() - hidder.height()) / 2;
						this.element.data("divider").position = pos;
						slider.hide();
						this.doLayout();
						slider.css("top", startPos);
						slider.show();
						p1.css("opacity", 0);
						p1.show();
						if (this.options.relativeTo == "bottom") {
							pos = this.element.height() - pos;
							finalHidder = this.element.height() - finalHidder;
						}
						slider.animate({top:pos});
						hidder.animate({top:finalHidder});
						p1.animate({opacity:1}, function() {
							thisWidget.doLayout();
						});
					} else {
						var startPos = this.element.height() - slider.height() - this.options.margin;
						var startHidder = startPos + (slider.height() - hidder.height()) / 2;
						var pos = this.element.data("divider").beforeHidePosition;
						var finalHidder = pos + (slider.height() - hidder.height()) / 2;
						this.element.data("divider").position = pos;
						slider.hide();
						this.doLayout();
						slider.css("top", startPos);
						slider.show();
						p2.css("opacity", 0);
						p2.show();
						if (this.options.relativeTo == "bottom") {
							pos = this.element.height() - pos;
							finalHidder = this.element.height() - finalHidder;
						}
						slider.animate({top:pos});
						hidder.animate({top:finalHidder});
						p2.animate({opacity:1}, function() {
							thisWidget.doLayout();
						});
					}
				}
				this.options.hidden = false;
			}
		},
		_cancelHide:function() {
			var p1 = $(this.element.children()[0]);
			var p2 = $(this.element.children()[1]);
			p1.show();
			p2.show();
			this.options.hidden = false;
		},
		doLayout:function() {
			var p1 = $(this.element.children()[0]);				
			var p2 = $(this.element.children()[1]);
			if (layoutLoader.isLoading()) {
			    if (playsLayout(p1) && !isLayoutInitialized(p1)) initChildLayout(p1);
			    if (playsLayout(p2) && !isLayoutInitialized(p2)) initChildLayout(p2);
			    return;
			}
			var slider = $(this.element.children()[2]);
			var w = this.element.width();
			var h = this.element.height();
			var options = this.options;
			var pos = this.element.data("divider").position;
			if (options.hidden) {
				if (options.direction == "h" && options.hideDirection == "right") {
					pos = this.element.width() - slider.width() - options.margin;
				} else if (options.direction == "v" && options.hideDirection == "bottom") {
					pos = this.element.height() - slider.height() - options.margin;
				}
			} else if (options.direction == "h" && options.relativeTo == "right") {
				pos = this.element.width() - pos;
			} else if (options.direction == "v" && options.relativeTo == "bottom") {
				pos = this.element.height() - pos;
			}
			if (options.direction == "h") {				
				p1.height(h);
				p1.width(pos - 1 - options.margin);
				slider.css("left", pos);
				slider.height(h);
				p2.height(h);
				p2.css("left", pos + slider.width() + options.margin + 1);
				p2.width(w - slider.width() - p1.width() - 2 * options.margin - 4);
			} else {
				p1.width(w);
				p1.height(pos - 1 - options.margin);
				slider.css("top", pos);
				slider.width(w);
				p2.width(w);
				p2.css("top", pos + slider.height() + options.margin + 1);
				p2.height(h - slider.height() - p1.height() - 2 * options.margin - 4);
			}

			doChildLayout(p1);
			doChildLayout(p2);
		}
	}
);