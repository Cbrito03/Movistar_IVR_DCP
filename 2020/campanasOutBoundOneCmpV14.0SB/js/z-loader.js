(function($) {
	var methods = {
		init: function(options) {
			var defaults = {
				panels:[],
				useCache:false
			};
			var $this = $(this);
			var opts = $.extend({}, defaults, options);
			$this.data("zLoader", {options:opts, panels:{} });
			$.each(opts.panels, function(i, p) {
				if (p.initial) {
					$this.zLoader("load", p.code, p.options);
					return false;
				}
			});
			if ($this.data("layout") != undefined) $this.zLayout();
			return $(this);
		},
		destroy:function() {
			var $this = $(this);
			$this.removeData("zLoader");
		},
		load:function(code, initialData) {	
			var $this = $(this);
			var panels = $this.data("zLoader").panels;
			if (panels[code]) {
				$this.zLoader("switchPanel", code, initialData, panels);
			} else {
				$this.data("zLoader").loading = true;
				$(this).zLoader("showLoading");
				var panelsDef = $this.data("zLoader").options.panels;
				var def;
				$.each(panelsDef,function(i, p) {
					if (p.code == code) {
						def = p;
						return false;
					}
				});
				if (def == undefined) $.error("Panel definition not found for code '" + code + "'");	
				panels[code] = def;
				panels[code].htmlLoaded = false;
				panels[code].jsLoaded = false;
				$.ajax({
					url:def.url + ".html",
					data:null,
					success:function(html) {
						panels[code].html = html;
						panels[code].htmlLoaded = true;
						if (panels[code].jsLoaded) {
							$this.zLoader("switchPanel", code, initialData, panels);
						}
					},
					error:function(xhr, errorText, errorThrown) {
						$.error("Error:" + errorThrown);
					},
					cache:false,
					dataType:"html"
				});
				$.ajax({
					url:def.url + ".js",
					data:null,
					success:function() {
						panels[code].controller = controller;
						if (!controller) $.error("Controller not created for panel code:" + code);
						panels[code].jsLoaded = true;
						if (panels[code].htmlLoaded) {
							$this.zLoader("switchPanel", code, initialData, panels);
						}
					},
					error:function(xhr, errorText, errorThrown) {
						$.error("Error:" + errorThrown);
					},
					dataType:"script"
				});
			}			
		},
		showLoading:function() {
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
		switchPanel:function(code, initialData, panels) {	
			var $this = $(this);
			var p = (panels?panels[code]:$this.data("zLoader").panels[code]);
			if (p == undefined) $.error("Switching to panel '" + code + "'. Panel not loaded.");
			var controller = p.controller;
			if (controller == undefined) $.error("Switching to panel '" + code + "'. Panel Controller is undefined.")
			$this.data("zLoader").currentController = controller;
			$this.data("zLoader").currentPanel = code;
			$this.html(p.html);
			initChildLayout($(this.html()));
			if (controller.init) {
				controller.init($this, p, initialData);				
			}
			doChildLayout($this);
			
			if (controller.show) controller.show($this, initialData);
			$.unblockUI();
			if (!$this.data("zLoader").options.useCache) $(this).zLoader("forgetPanel", code);
			if (initialData && initialData.onLoad) initialData.onLoad();
		},
		forgetPanel:function(code) {
			if ($(this).data("zLoader").panels[code].cacheable == true) return;
			delete $(this).data("zLoader").panels[code];
		},
		getCurrentController:function() {
			var $this = $(this);
			return $this.data("zLoader").currentController;
		},
		getCurrentPanel:function() {
			var $this = $(this);
			return $this.data("zLoader").currentPanel;
		}
	};	
	$.fn.zLoader = function(method) {
		if ( methods[method] ) {
		  return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  return methods.init.apply( this, arguments );
		} else {
		  $.error( 'Method ' +  method + ' does not exist on jQuery.zLoader' );
		}  
	};
})(jQuery);
	