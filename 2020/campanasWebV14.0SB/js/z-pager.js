$.widget("z.zPager", {
	options:{pages:[]},
	_create:function() {
		var $this = this.element;
		var thisWidget = this;
		if (!$this.attr("id")) {
			$.error("zPager must have a unique id");
		}
		if (!layoutLoader.isLoading()) this.showLoading();
		$this.data("zPager", {pages:{}, toLoad:0, stack:[] });
		$this.data("on-layout-resize", function() {thisWidget.doLayout();});
		$.each(this.options.pages, function(i, p) {
			$this.data("zPager").pages[p.code] = {};
			// Read html
			$this.data("zPager").toLoad++;
			layoutLoader.startLoading();
			$.ajax({
				url:p.url + ".html",
				data:null,
				success:function(html) {
					$this.data("zPager").pages[p.code].html = html;
					$this.data("zPager").toLoad--;
					layoutLoader.finishLoading();
					if ($this.data("zPager").toLoad == 0) {
						thisWidget.initPages();
					}
				},
				error:function(xhr, errorText, errorThrown) {
					$.error("Error:" + errorThrown);
				},
				cache:false,
				dataType:"html"
			});
		    // Read js
			layoutLoader.startLoading();
			$this.data("zPager").toLoad++;
			$.ajax({
				url:p.url + ".js",
				data:null,
				success:function() {
					$this.data("zPager").pages[p.code].controller = controller;
					$this.data("zPager").toLoad--;
					layoutLoader.finishLoading();
					if ($this.data("zPager").toLoad == 0) {
						thisWidget.initPages();
					}
				},
				error:function(xhr, errorText, errorThrown) {
					$.error("Error:" + errorThrown);
				},
				dataType:"script"
			});
		});
		return this;
	},
	initPages:function() {
		var $this = this.element;
		var thisWidget = this;
		var opts = this.options;
		var pages = $this.data("zPager").pages;
		var initial = null;
		var id = $this.attr("id");
		$this.html("");
		$.each(opts.pages, function(i, p) {
			if (p.initial) initial = p.code;
			$this.append("<div id='h-" + p.code + "' style='position:absolute;left:0;top:0;display:none;'>" + pages[p.code].html + "</div>");
			if (pages[p.code].controller.init) {
				pages[p.code].controller.init($this.find("#h-" + p.code), p.options);
			}
			var page = $this.find("#h-" + p.code);
			if (playsLayout(page) && !isLayoutInitialized(page)) initChildLayout(page);
		});
		if (!initial) {
			$.error("No initial page found in zPager");
		}
		this.gotoPage(initial);
		if (!layoutLoader.isLoading()) $.unblockUI();
		if (this.options.onReady) this.options.onReady();
	},
	showLoading: function () {
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
	},
	gotoPage:function(code) {
		var $this =this.element;
		var id = $this.attr("id");
		var actual = $this.data("zPager").currentPage;
		var pages = $this.data("zPager").pages;
		if (!pages[code]) {
			$.error("No page '" + code + "' found in zPager");
		}
		if (actual) {
			var actualPageHolder = $this.find("#h-" + actual);
			actualPageHolder.css("display", "none");
		}
		var newPageHolder = $this.find("#h-" + code);
		newPageHolder.css("display", "");
		var newPage = $(newPageHolder.children()[0]);
		newPage.css("position", "absolute");
		newPage.css("left", 0);
		newPage.css("top", 0);
		$this.data("zPager").currentPage = code;
		this.doLayout();
	},
	controller:function(code) {
		if (!code) code = this.element.data("zPager").currentPage;
		return this.element.data("zPager").pages[code].controller;
	},
	currentPage:function(code) {
		if (!code) return this.element.data("zPager").currentPage;
		else this.gotoPage(code);
	},
	push:function(code) {
		var stack = this.element.data("zPager").stack;
		stack.push(this.currentPage());
		this.gotoPage(code);
	},
	pop:function() {
		var stack = this.element.data("zPager").stack;
		var newCode = stack[stack.length - 1];
		stack.splice(stack.length - 1, 1);
		this.gotoPage(newCode);
		return newCode;
	},
	canPop:function() {
		var stack = this.element.data("zPager").stack;
		return stack.length > 0;
	},
	doLayout: function () {
	    if (layoutLoader.isLoading()) return;
		var $this =this.element;
		var actual = $this.data("zPager").currentPage;
		if (!actual) return;
		var holder = $this.find("#h-" + actual);
		holder.width($this.width());
		holder.height($this.height());		
		var c = $(holder.children()[0]);
		c.width($this.width());
		c.height($this.height());
		doChildLayout(c);
	}
});	
