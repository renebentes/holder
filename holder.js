/*!

Holder - client side image placeholders
Version 2.4.0+8fmw1
© 2014 Ivan Malopinsky - http://imsky.co

Site:		http://imsky.github.io/holder
Issues:		https://github.com/imsky/holder/issues
License:	http://opensource.org/licenses/MIT

*/
/*! 
 * onDomReady.js 1.4.0 (c) 2013 Tubal Martin - MIT license
 */
;(function(name, global, callback){
		global[name] = callback;
})("onDomReady", this, 

(function(win) {
    
    'use strict';

    //Lazy loading fix for Firefox < 3.6
    //http://webreflection.blogspot.com/2009/11/195-chars-to-help-lazy-loading.html
    if (document.readyState == null && document.addEventListener) {
        document.addEventListener("DOMContentLoaded", function DOMContentLoaded() {
            document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
            document.readyState = "complete";
        }, false);
        document.readyState = "loading";
    }

    var doc = win.document,
        docElem = doc.documentElement,

        LOAD = "load",
        FALSE = false,
        ONLOAD = "on"+LOAD,
        COMPLETE = "complete",
        READYSTATE = "readyState",
        ATTACHEVENT = "attachEvent",
        DETACHEVENT = "detachEvent",
        ADDEVENTLISTENER = "addEventListener",
        DOMCONTENTLOADED = "DOMContentLoaded",
        ONREADYSTATECHANGE = "onreadystatechange",
        REMOVEEVENTLISTENER = "removeEventListener",

        // W3C Event model
        w3c = ADDEVENTLISTENER in doc,
        top = FALSE,

        // isReady: Is the DOM ready to be used? Set to true once it occurs.
        isReady = FALSE,

        // Callbacks pending execution until DOM is ready
        callbacks = [];
    
    // Handle when the DOM is ready
    function ready( fn ) {
        if ( !isReady ) {
            
            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if ( !doc.body ) {
                return defer( ready );
            }
            
            // Remember that the DOM is ready
            isReady = true;

            // Execute all callbacks
            while ( fn = callbacks.shift() ) {
                defer( fn );
            }
        }    
    }

    // The ready event handler
    function completed( event ) {
        // readyState === "complete" is good enough for us to call the dom ready in oldIE
        if ( w3c || event.type === LOAD || doc[READYSTATE] === COMPLETE ) {
            detach();
            ready();
        }
    }

    // Clean-up method for dom ready events
    function detach() {
        if ( w3c ) {
            doc[REMOVEEVENTLISTENER]( DOMCONTENTLOADED, completed, FALSE );
            win[REMOVEEVENTLISTENER]( LOAD, completed, FALSE );
        } else {
            doc[DETACHEVENT]( ONREADYSTATECHANGE, completed );
            win[DETACHEVENT]( ONLOAD, completed );
        }
    }
    
    // Defers a function, scheduling it to run after the current call stack has cleared.
    function defer( fn, wait ) {
        // Allow 0 to be passed
        setTimeout( fn, +wait >= 0 ? wait : 1 );
    }
    
    // Attach the listeners:

    // Catch cases where onDomReady is called after the browser event has already occurred.
    // we once tried to use readyState "interactive" here, but it caused issues like the one
    // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
    if ( doc[READYSTATE] === COMPLETE ) {
        // Handle it asynchronously to allow scripts the opportunity to delay ready
        defer( ready );

    // Standards-based browsers support DOMContentLoaded    
    } else if ( w3c ) {
        // Use the handy event callback
        doc[ADDEVENTLISTENER]( DOMCONTENTLOADED, completed, FALSE );

        // A fallback to window.onload, that will always work
        win[ADDEVENTLISTENER]( LOAD, completed, FALSE );

    // If IE event model is used
    } else {            
        // Ensure firing before onload, maybe late but safe also for iframes
        doc[ATTACHEVENT]( ONREADYSTATECHANGE, completed );

        // A fallback to window.onload, that will always work
        win[ATTACHEVENT]( ONLOAD, completed );

        // If IE and not a frame
        // continually check to see if the document is ready
        try {
            top = win.frameElement == null && docElem;
        } catch(e) {}

        if ( top && top.doScroll ) {
            (function doScrollCheck() {
                if ( !isReady ) {
                    try {
                        // Use the trick by Diego Perini
                        // http://javascript.nwbox.com/IEContentLoaded/
                        top.doScroll("left");
                    } catch(e) {
                        return defer( doScrollCheck, 50 );
                    }

                    // detach all dom ready events
                    detach();

                    // and execute any waiting functions
                    ready();
                }
            })();
        } 
    } 
    
    function onDomReady( fn ) { 
        // If DOM is ready, execute the function (async), otherwise wait
        isReady ? defer( fn ) : callbacks.push( fn );
    }
    
    // Add version
    onDomReady.version = "1.4.0";
    // Add method to check if DOM is ready
    onDomReady.isReady = function(){
        return isReady;
    };
    
    return onDomReady;
})(this));

//https://github.com/inexorabletash/polyfill/blob/master/web.js
  if (!document.querySelectorAll) {
    document.querySelectorAll = function (selectors) {
      var style = document.createElement('style'), elements = [], element;
      document.documentElement.firstChild.appendChild(style);
      document._qsa = [];

      style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
      window.scrollBy(0, 0);
      style.parentNode.removeChild(style);

      while (document._qsa.length) {
        element = document._qsa.shift();
        element.style.removeAttribute('x-qsa');
        elements.push(element);
      }
      document._qsa = null;
      return elements;
    };
  }

  if (!document.querySelector) {
    document.querySelector = function (selectors) {
      var elements = document.querySelectorAll(selectors);
      return (elements.length) ? elements[0] : null;
    };
  }

  if (!document.getElementsByClassName) {
    document.getElementsByClassName = function (classNames) {
      classNames = String(classNames).replace(/^|\s+/g, '.');
      return document.querySelectorAll(classNames);
    };
  }
  

//https://github.com/inexorabletash/polyfill/blob/master/web.js
(function (global) {
  var B64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  global.atob = global.atob || function (input) {
    input = String(input);
    var position = 0,
        output = [],
        buffer = 0, bits = 0, n;

    input = input.replace(/\s/g, '');
    if ((input.length % 4) === 0) { input = input.replace(/=+$/, ''); }
    if ((input.length % 4) === 1) { throw Error("InvalidCharacterError"); }
    if (/[^+/0-9A-Za-z]/.test(input)) { throw Error("InvalidCharacterError"); }

    while (position < input.length) {
      n = B64_ALPHABET.indexOf(input.charAt(position));
      buffer = (buffer << 6) | n;
      bits += 6;

      if (bits === 24) {
        output.push(String.fromCharCode((buffer >> 16) & 0xFF));
        output.push(String.fromCharCode((buffer >>  8) & 0xFF));
        output.push(String.fromCharCode(buffer & 0xFF));
        bits = 0;
        buffer = 0;
      }
      position += 1;
    }

    if (bits === 12) {
      buffer = buffer >> 4;
      output.push(String.fromCharCode(buffer & 0xFF));
    } else if (bits === 18) {
      buffer = buffer >> 2;
      output.push(String.fromCharCode((buffer >> 8) & 0xFF));
      output.push(String.fromCharCode(buffer & 0xFF));
    }

    return output.join('');
  };

  global.btoa = global.btoa || function (input) {
    input = String(input);
    var position = 0,
        out = [],
        o1, o2, o3,
        e1, e2, e3, e4;

    if (/[^\x00-\xFF]/.test(input)) { throw Error("InvalidCharacterError"); }

    while (position < input.length) {
      o1 = input.charCodeAt(position++);
      o2 = input.charCodeAt(position++);
      o3 = input.charCodeAt(position++);

      // 111111 112222 222233 333333
      e1 = o1 >> 2;
      e2 = ((o1 & 0x3) << 4) | (o2 >> 4);
      e3 = ((o2 & 0xf) << 2) | (o3 >> 6);
      e4 = o3 & 0x3f;

      if (position === input.length + 2) {
        e3 = 64; e4 = 64;
      }
      else if (position === input.length + 1) {
        e4 = 64;
      }

      out.push(B64_ALPHABET.charAt(e1),
               B64_ALPHABET.charAt(e2),
               B64_ALPHABET.charAt(e3),
               B64_ALPHABET.charAt(e4));
    }

    return out.join('');
  };
}(this));

//https://github.com/jonathantneal/polyfill/blob/master/source/Window.prototype.getComputedStyle.ie8.js
(function () {
	if(window.getComputedStyle) return; //Add an exit if already defined
	function getComputedStylePixel(element, property, fontSize) {
		element.document; // Internet Explorer sometimes struggles to read currentStyle until the element's document is accessed.

		var
		value = element.currentStyle[property].match(/([\d\.]+)(%|cm|em|in|mm|pc|pt|)/) || [0, 0, ''],
		size = value[1],
		suffix = value[2],
		rootSize;

		fontSize = !fontSize ? fontSize : /%|em/.test(suffix) && element.parentElement ? getComputedStylePixel(element.parentElement, 'fontSize', null) : 16;
		rootSize = property == 'fontSize' ? fontSize : /width/i.test(property) ? element.clientWidth : element.clientHeight;

		return suffix == '%' ? size / 100 * rootSize :
		       suffix == 'cm' ? size * 0.3937 * 96 :
		       suffix == 'em' ? size * fontSize :
		       suffix == 'in' ? size * 96 :
		       suffix == 'mm' ? size * 0.3937 * 96 / 10 :
		       suffix == 'pc' ? size * 12 * 96 / 72 :
		       suffix == 'pt' ? size * 96 / 72 :
		       size;
	}

	function setShortStyleProperty(style, property) {
		var
		borderSuffix = property == 'border' ? 'Width' : '',
		t = property + 'Top' + borderSuffix,
		r = property + 'Right' + borderSuffix,
		b = property + 'Bottom' + borderSuffix,
		l = property + 'Left' + borderSuffix;

		style[property] = (style[t] == style[r] && style[t] == style[b] && style[t] == style[l] ? [ style[t] ] :
		                   style[t] == style[b] && style[l] == style[r] ? [ style[t], style[r] ] :
		                   style[l] == style[r] ? [ style[t], style[r], style[b] ] :
		                   [ style[t], style[r], style[b], style[l] ]).join(' ');
	}

	// <CSSStyleDeclaration>
	function CSSStyleDeclaration(element) {
		var
		style = this,
		currentStyle = element.currentStyle,
		fontSize = getComputedStylePixel(element, 'fontSize'),
		unCamelCase = function (match) {
			return '-' + match.toLowerCase();
		},
		property;

		for (property in currentStyle) {
			Array.prototype.push.call(style, property == 'styleFloat' ? 'float' : property.replace(/[A-Z]/, unCamelCase));

			if (property == 'width') {
				style[property] = element.offsetWidth + 'px';
			} else if (property == 'height') {
				style[property] = element.offsetHeight + 'px';
			} else if (property == 'styleFloat') {
				style.float = currentStyle[property];
			} else if (/margin.|padding.|border.+W/.test(property) && style[property] != 'auto') {
				style[property] = Math.round(getComputedStylePixel(element, property, fontSize)) + 'px';
			} else if (/^outline/.test(property)) {
				// errors on checking outline
				try {
					style[property] = currentStyle[property];
				} catch (error) {
					style.outlineColor = currentStyle.color;
					style.outlineStyle = style.outlineStyle || 'none';
					style.outlineWidth = style.outlineWidth || '0px';
					style.outline = [style.outlineColor, style.outlineWidth, style.outlineStyle].join(' ');
				}
			} else {
				style[property] = currentStyle[property];
			}
		}

		setShortStyleProperty(style, 'margin');
		setShortStyleProperty(style, 'padding');
		setShortStyleProperty(style, 'border');

		style.fontSize = Math.round(fontSize) + 'px';
	}

	CSSStyleDeclaration.prototype = {
		constructor: CSSStyleDeclaration,
		// <CSSStyleDeclaration>.getPropertyPriority
		getPropertyPriority: function () {
			throw new Error('NotSupportedError: DOM Exception 9');
		},
		// <CSSStyleDeclaration>.getPropertyValue
		getPropertyValue: function (property) {
			return this[property.replace(/-\w/g, function (match) {
				return match[1].toUpperCase();
			})];
		},
		// <CSSStyleDeclaration>.item
		item: function (index) {
			return this[index];
		},
		// <CSSStyleDeclaration>.removeProperty
		removeProperty: function () {
			throw new Error('NoModificationAllowedError: DOM Exception 7');
		},
		// <CSSStyleDeclaration>.setProperty
		setProperty: function () {
			throw new Error('NoModificationAllowedError: DOM Exception 7');
		},
		// <CSSStyleDeclaration>.getPropertyCSSValue
		getPropertyCSSValue: function () {
			throw new Error('NotSupportedError: DOM Exception 9');
		}
	};

	// <window>.getComputedStyle
	window.getComputedStyle = Window.prototype.getComputedStyle = function (element) {
		return new CSSStyleDeclaration(element);
	};
})();

//https://gist.github.com/jimeh/332357
if (!Object.prototype.hasOwnProperty){
    /*jshint -W001, -W103 */
    Object.prototype.hasOwnProperty = function(prop) {
		var proto = this.__proto__ || this.constructor.prototype;
		return (prop in this) && (!(prop in proto) || proto[prop] !== this[prop]);
	}
    /*jshint +W001, +W103 */
}

/*
Holder.js - client side image placeholders
© 2012-2014 Ivan Malopinsky - http://imsky.co
*/

(function (register, global, undefined) {
	
	var app = {};

	var Holder = {
		addTheme: function (name, theme) {
			name != null && theme != null && (app.settings.themes[name] = theme);
			return this;
		},
		addImage: function (src, el) {
			var node = document.querySelectorAll(el);
			if (node.length) {
				for (var i = 0, l = node.length; i < l; i++) {
					var img = document.createElement("img")
					img.setAttribute("data-src", src);
					node[i].appendChild(img);
				}
			}
			return this;
		},
		run: function (instanceOptions) {
			var instanceConfig = extend({}, app.config)
			app.runtime.preempted = true;

			var options = extend(app.settings, instanceOptions),
				images = [],
				imageNodes = [],
				bgnodes = [];

			if (options.use_canvas != null && options.use_canvas) {
				instanceConfig.use_canvas = true;
				instanceConfig.use_svg = false;
			}

			instanceConfig.debounce = (options.debounce != null) ? options.debounce : instanceConfig.debounce;

			if (typeof (options.images) == "string") {
				imageNodes = document.querySelectorAll(options.images);
			} else if (window.NodeList && options.images instanceof window.NodeList) {
				imageNodes = options.images;
			} else if (window.Node && options.images instanceof window.Node) {
				imageNodes = [options.images];
			} else if (window.HTMLCollection && options.images instanceof window.HTMLCollection) {
				imageNodes = options.images
			}

			if (typeof (options.bgnodes) == "string") {
				bgnodes = document.querySelectorAll(options.bgnodes);
			} else if (window.NodeList && options.elements instanceof window.NodeList) {
				bgnodes = options.bgnodes;
			} else if (window.Node && options.bgnodes instanceof window.Node) {
				bgnodes = [options.bgnodes];
			}
			for (i = 0, l = imageNodes.length; i < l; i++) images.push(imageNodes[i]);

			var cssregex = new RegExp(options.domain + "\/(.*?)\"?\\)");
			for (var l = bgnodes.length, i = 0; i < l; i++) {
				var src = window.getComputedStyle(bgnodes[i], null).getPropertyValue("background-image");
				var flags = src.match(cssregex);
				var bgsrc = bgnodes[i].getAttribute("data-background-src");
				if (flags) {
					var holder = parse_flags(flags[1].split("/"), options);
					if (holder) {
						render("background", bgnodes[i], holder, src, instanceConfig);
					}
				} else if (bgsrc != null) {
					var holder = parse_flags(bgsrc.substr(bgsrc.lastIndexOf(options.domain) + options.domain.length + 1)
						.split("/"), options);
					if (holder) {
						render("background", bgnodes[i], holder, src, instanceConfig);
					}
				}
			}
			for (l = images.length, i = 0; i < l; i++) {
				var attr_data_src, attr_src;
				attr_src = attr_data_src = src = null;
				try {
					attr_src = images[i].getAttribute("src");
					attr_datasrc = images[i].getAttribute("data-src");
				} catch (e) {}
				if (attr_datasrc == null && !!attr_src && attr_src.indexOf(options.domain) >= 0) {
					src = attr_src;
				} else if (!!attr_datasrc && attr_datasrc.indexOf(options.domain) >= 0) {
					src = attr_datasrc;
				}
				if (src) {
					var holder = parse_flags(src.substr(src.lastIndexOf(options.domain) + options.domain.length + 1).split("/"), options);
					if (holder) {
						if (holder.fluid) {
							render("fluid", images[i], holder, src, instanceConfig)
						} else {
							render("image", images[i], holder, src, instanceConfig);
						}
					}
				}
			}
			return this;
		},
		invisibleErrorFn: function (fn) {
			return function (el) {
				if (el.hasAttribute("data-holder-invisible")) {
					throw new Error("Holder: invisible placeholder")
				}
			}
		}
	}
	
	function parse_flags(flags, options) {
	var ret = {
		theme: extend(app.settings.themes.gray, {})
	};
	var render = false;
	for (var fl = flags.length, j = 0; j < fl; j++) {
		var flag = flags[j];
		if (app.flags.dimensions.match(flag)) {
			render = true;
			ret.dimensions = app.flags.dimensions.output(flag);
		} else if (app.flags.fluid.match(flag)) {
			render = true;
			ret.dimensions = app.flags.fluid.output(flag);
			ret.fluid = true;
		} else if (app.flags.textmode.match(flag)) {
			ret.textmode = app.flags.textmode.output(flag)
		} else if (app.flags.colors.match(flag)) {
			var colors = app.flags.colors.output(flag)
			ret.theme = extend(colors, ret.theme);
		} else if (options.themes[flag]) {
			//If a theme is specified, it will override custom colors
			if(options.themes.hasOwnProperty(flag)){
				ret.theme = extend(options.themes[flag], {});
			}
		} else if (app.flags.font.match(flag)) {
			ret.font = app.flags.font.output(flag);
		} else if (app.flags.auto.match(flag)) {
			ret.auto = true;
		} else if (app.flags.text.match(flag)) {
			ret.text = app.flags.text.output(flag);
		}
	}
	return render ? ret : false;
	}
	
	function text_size(width, height, fontSize) {
	height = parseInt(height, 10);
	width = parseInt(width, 10);
	var bigSide = Math.max(height, width)
	var smallSide = Math.min(height, width)
	var scale = 1 / 12;
	var newHeight = Math.min(smallSide * 0.75, 0.75 * bigSide * scale);
	return {
		height: Math.round(Math.max(fontSize, newHeight))
	}
}

var svg_el = (function(){
	//Prevent IE <9 from initializing SVG renderer
	if(!window.XMLSerializer) return;
	var serializer = new XMLSerializer();
	var svg_ns = "http://www.w3.org/2000/svg"
	var svg = document.createElementNS(svg_ns, "svg");
	//IE throws an exception if this is set and Chrome requires it to be set
	if(svg.webkitMatchesSelector){
		svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
	}
	
	/* todo: needs to be generalized
	var xml = new DOMParser().parseFromString('<xml />', "application/xml")
	var css = xml.createProcessingInstruction('xml-stylesheet', 'href="http://netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet"');
	xml.insertBefore(css, xml.firstChild);
	xml.removeChild(xml.documentElement)
	var svg_css = serializer.serializeToString(xml);
	*/
	
	var svg_css = "";
	
	var bg_el = document.createElementNS(svg_ns, "rect")
	var text_el = document.createElementNS(svg_ns, "text")
	var textnode_el = document.createTextNode(null)
	text_el.setAttribute("text-anchor", "middle")
	text_el.appendChild(textnode_el)
	svg.appendChild(bg_el)
	svg.appendChild(text_el)

	return function(props){
		if(isNaN(props.width) || isNaN(props.height) || isNaN(props.text_height)){
			throw "Holder: incorrect properties passed to SVG constructor";
		}
		svg.setAttribute("width",props.width);
		svg.setAttribute("height", props.height);
		svg.setAttribute("viewBox", "0 0 "+props.width+" "+props.height)
		svg.setAttribute("preserveAspectRatio", "none")
		bg_el.setAttribute("width", props.width);
		bg_el.setAttribute("height", props.height);
		bg_el.setAttribute("fill", props.template.background);
		text_el.setAttribute("x", props.width/2)
		text_el.setAttribute("y", props.height/2)
		textnode_el.nodeValue=props.text
		text_el.setAttribute("style", css_properties({
		"fill": props.template.foreground,
		"font-weight": props.font_weight,
		"font-size": props.text_height+"px",
		"font-family":props.font,
		"dominant-baseline":"central"
		}))
		
		return svg_css + serializer.serializeToString(svg)
	}
})()

function drawCanvas(args) {
	var ctx = args.ctx,
		dimensions = args.dimensions,
		template = args.template,
		ratio = args.ratio,
		holder = args.holder,
		literal = holder.textmode == "literal",
		exact = holder.textmode == "exact";

	var ts = text_size(dimensions.width, dimensions.height, template.size);
	var text_height = ts.height;
	var width = dimensions.width * ratio,
		height = dimensions.height * ratio;
	var font = template.font ? template.font : "Arial,Helvetica,sans-serif";
	var font_weight = template.fontweight ? template.fontweight : "bold";
	font_weight = font_weight == "normal" ? "" : font_weight;
	
	_canvas.width = width;
	_canvas.height = height;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = template.background;
	ctx.fillRect(0, 0, width, height);
	ctx.fillStyle = template.foreground;
	ctx.font = font_weight + " " + text_height + "px " + font;
	
	var text = template.text ? template.text : (Math.floor(dimensions.width) + "x" + Math.floor(dimensions.height));
	if (literal) {
		var dimensions = holder.dimensions;
		text = dimensions.width + "x" + dimensions.height;
	}
	else if(exact && holder.exact_dimensions){
		var dimensions = holder.exact_dimensions;
		text = (Math.floor(dimensions.width) + "x" + Math.floor(dimensions.height));
	}

	ctx.font = font_weight + " " + (text_height * ratio) + "px " + font;
	ctx.fillText(text, (width / 2), (height / 2), width);
	return _canvas.toDataURL("image/png");
}

function drawSVG(args){
	var dimensions = args.dimensions,
		template = args.template,
		holder = args.holder,
		literal = holder.textmode == "literal",
		exact = holder.textmode == "exact";

	var ts = text_size(dimensions.width, dimensions.height, template.size);
	var text_height = ts.height;
	var width = dimensions.width,
		height = dimensions.height;
		
	var font = template.font ? template.font : "Arial,Helvetica,sans-serif";
	var font_weight = template.fontweight ? template.fontweight : "bold";
	var text = template.text ? template.text : (Math.floor(dimensions.width) + "x" + Math.floor(dimensions.height));
	
	if (literal) {
		var dimensions = holder.dimensions;
		text = dimensions.width + "x" + dimensions.height;
	}
	else if(exact && holder.exact_dimensions){
		var dimensions = holder.exact_dimensions;
		text = (Math.floor(dimensions.width) + "x" + Math.floor(dimensions.height));
	}
	var string = svg_el({
		text: text, 
		width:width, 
		height:height, 
		text_height:text_height, 
		font:font,
		font_weight:font_weight,
		template:template
	})
	
	return "data:image/svg+xml;base64,"+btoa(unescape(encodeURIComponent(string)));
}

function renderToImage(mode, params, el, instanceConfig){
	var image = draw(params, instanceConfig);
	if(mode == "background"){
		el.style.backgroundImage = "url(" + image + ")";
		el.style.backgroundSize = params.dimensions.width + "px " + params.dimensions.height + "px";
	}
	else{
		el.setAttribute("src", image);
	}
	el.setAttribute("data-holder-rendered", true);
}

function draw(args, instanceConfig) {
	if(instanceConfig.use_canvas && !instanceConfig.use_svg){
		try {
			return drawCanvas(args);
		}
		catch(e){
			window.console && console.error(e);
		}
	}
	else{
		try {
			return drawSVG(args);
		}
		catch(e){
			window.console && console.error(e);
		}
	}
}

function render(mode, el, holder, src, instanceConfig) {
	var dimensions = holder.dimensions,
		theme = holder.theme,
		text = holder.text ? decodeURIComponent(holder.text) : holder.text;
	var dimensionsCaption = dimensions.width + "x" + dimensions.height;
	theme = (text ? extend(theme, {
		text: text
	}) : theme);
	theme = (holder.font ? extend(theme, {
		font: holder.font
	}) : theme);
	el.setAttribute("data-src", src);
	holder.theme = theme;
	el.holderData = holder;
	
	//todo: remove this once canvas_el is implemeted
	var ctx = _ctx;
	
	if (mode == "image") {
		el.setAttribute("alt", text ? text : theme.text ? theme.text + " [" + dimensionsCaption + "]" : dimensionsCaption);
		if (instanceConfig.use_fallback || !holder.auto) {
			el.style.width = dimensions.width + "px";
			el.style.height = dimensions.height + "px";
		}
		if (instanceConfig.use_fallback) {
			el.style.backgroundColor = theme.background;
		} else {
			renderToImage(mode, {ctx: ctx, dimensions: dimensions, template: theme, ratio: app.config.ratio, holder: holder}, el, instanceConfig);
			
			if(holder.textmode && holder.textmode == "exact"){
				app.runtime.resizableImages.push(el);
				//resizable_update(el);
			}
		}
	} else if (mode == "background") {
		if (!instanceConfig.use_fallback) {
			renderToImage(mode, {ctx:ctx, dimensions: dimensions, template: theme, ratio: app.config.ratio, holder: holder},
				el, instanceConfig);
		}
	} else if (mode == "fluid") {
		el.setAttribute("alt", text ? text : theme.text ? theme.text + " [" + dimensionsCaption + "]" : dimensionsCaption);
		if (dimensions.height.slice(-1) == "%") {
			el.style.height = dimensions.height
		} else if(holder.auto == null || !holder.auto){
			el.style.height = dimensions.height + "px"
		}
		if (dimensions.width.slice(-1) == "%") {
			el.style.width = dimensions.width
		} else if(holder.auto == null || !holder.auto){
			el.style.width = dimensions.width + "px"
		}
		if (el.style.display == "inline" || el.style.display === "" || el.style.display == "none") {
			el.style.display = "block";
		}
		
		set_initial_dimensions(el)
		
		if (instanceConfig.use_fallback) {
			el.style.backgroundColor = theme.background;
		} else {
			app.runtime.resizableImages.push(el);
			//resizable_update(el);
		}
	}
}

function resizable_update(element) {
	var images;
	if (element == null || element.nodeType == null) {
		images = app.runtime.resizableImages;
	} else {
		images = [element]
	}
	for (var i in images) {
		if (!images.hasOwnProperty(i)) {
			continue;
		}
		var el = images[i];
		if (el.holderData) {
			var holder = el.holderData;
			var dimensions = dimension_check(el, Holder.invisibleErrorFn(resizable_update))
			if (dimensions) {
				if (holder.fluid) {
					if (holder.auto) {
						switch (holder.fluid_data.mode) {
						case "width":
							dimensions.height = dimensions.width / holder.fluid_data.ratio;
							break;
						case "height":
							dimensions.width = dimensions.height * holder.fluid_data.ratio;
							break;
						}
					}
				}
				
				//todo: remove once canvas_el is implemented
				var ctx = _ctx;
				
				var draw_params = {
					ctx: ctx,
					dimensions: dimensions,
					template: holder.theme,
					ratio: app.config.ratio,
					holder: holder
				};
								
				if (holder.textmode && holder.textmode == "exact") {
					holder.exact_dimensions = dimensions;
					draw_params.dimensions = holder.dimensions;
				}
				
				renderToImage(draw_params, el);
			}
		}
	}
}

function dimension_check(el, callback) {
	var dimensions = {
		height: el.clientHeight,
		width: el.clientWidth
	};
	if (!dimensions.height && !dimensions.width) {
		el.setAttribute("data-holder-invisible", true)
		callback.call(this, el)
	}
	else{
		el.removeAttribute("data-holder-invisible")
		return dimensions;
	}
}

function set_initial_dimensions(el){
	if(el.holderData){
		var dimensions = dimension_check(el, Holder.invisibleErrorFn(set_initial_dimensions))
		if(dimensions){
			var holder = el.holderData;
			holder.initial_dimensions = dimensions;
			holder.fluid_data = {
				fluid_height: holder.dimensions.height.slice(-1) == "%",
				fluid_width: holder.dimensions.width.slice(-1) == "%",
				mode: null
			}
			if(holder.fluid_data.fluid_width && !holder.fluid_data.fluid_height){
				holder.fluid_data.mode = "width"
				holder.fluid_data.ratio = holder.initial_dimensions.width / parseFloat(holder.dimensions.height)
			}
			else if(!holder.fluid_data.fluid_width && holder.fluid_data.fluid_height){
				holder.fluid_data.mode = "height";
				holder.fluid_data.ratio = parseFloat(holder.dimensions.width) / holder.initial_dimensions.height
			}
		}
	}
}

	//Configuration

	app.flags = {
		dimensions: {
			regex: /^(\d+)x(\d+)$/,
			output: function (val) {
				var exec = this.regex.exec(val);
				return {
					width: +exec[1],
					height: +exec[2]
				}
			}
		},
		fluid: {
			regex: /^([0-9%]+)x([0-9%]+)$/,
			output: function (val) {
				var exec = this.regex.exec(val);
				return {
					width: exec[1],
					height: exec[2]
				}
			}
		},
		colors: {
			regex: /#([0-9a-f]{3,})\:#([0-9a-f]{3,})/i,
			output: function (val) {
				var exec = this.regex.exec(val);
				return {
					foreground: "#" + exec[2],
					background: "#" + exec[1]
				}
			}
		},
		text: {
			regex: /text\:(.*)/,
			output: function (val) {
				return this.regex.exec(val)[1];
			}
		},
		font: {
			regex: /font\:(.*)/,
			output: function (val) {
				return this.regex.exec(val)[1];
			}
		},
		auto: {
			regex: /^auto$/
		},
		textmode: {
			regex: /textmode\:(.*)/,
			output: function (val) {
				return this.regex.exec(val)[1];
			}
		}
	}

	for (var flag in app.flags) {
		if (!app.flags.hasOwnProperty(flag)) continue;
		app.flags[flag].match = function (val) {
			return val.match(this.regex)
		}
	}

	app.settings = {
		domain: "holder.js",
		images: "img",
		bgnodes: ".holderjs",
		themes: {
			"gray": {
				background: "#eee",
				foreground: "#aaa",
				size: 12
			},
			"social": {
				background: "#3a5a97",
				foreground: "#fff",
				size: 12
			},
			"industrial": {
				background: "#434A52",
				foreground: "#C2F200",
				size: 12
			},
			"sky": {
				background: "#0D8FDB",
				foreground: "#fff",
				size: 12
			},
			"vine": {
				background: "#39DBAC",
				foreground: "#1E292C",
				size: 12
			},
			"lava": {
				background: "#F8591A",
				foreground: "#1C2846",
				size: 12
			}
		}
	};

	//Helpers

	function extend(a, b) {
		var c = {};
		for (var i in a) {
			if (a.hasOwnProperty(i)) {
				c[i] = a[i];
			}
		}
		for (var i in b) {
			if (b.hasOwnProperty(i)) {
				c[i] = b[i];
			}
		}
		return c
	}

	function css_properties(props) {
		var ret = [];
		for (var p in props) {
			if (props.hasOwnProperty(p)) {
				ret.push(p + ":" + props[p])
			}
		}
		return ret.join(";")
	}

	function debounce(config, fn) {
		if (config.debounce) {
			if (!app.runtime.debounceTimer) fn.call(this);
			if (app.runtime.debounceTimer) clearTimeout(app.runtime.debounceTimer);
			app.runtime.debounceTimer = setTimeout(function () {
				app.runtime.debounceTimer = null;
				fn.call(this)
			}, app.config.debounce);
		} else {
			fn.call(this)
		}
	}
	
	//< v2.4 API compatibility

	Holder.add_theme = Holder.addTheme;
	Holder.add_image = Holder.addImage;
	Holder.invisible_error_fn = Holder.invisibleErrorFn;
	
	//Properties set once on setup

	app.config = {
		use_svg: false,
		use_canvas: false,
		use_fallback: false,
		debounce: 100,
		ratio: 1
	};

	//Properties modified during runtime

	app.runtime = {
		preempted: false,
		resizableImages: [],
		debounceTimer: null
	}
	
	//Pre-flight

	var _canvas = document.createElement('canvas');
	var _ctx = null;
	if (!_canvas.getContext) {
		app.config.use_fallback = true;
	} else {
		if (_canvas.toDataURL("image/png").indexOf("data:image/png") == -1) {
			app.config.use_fallback = true;
		}
		else{
			_ctx =  _canvas.getContext("2d");
		}
	}
	
	var devicePixelRatio = 1,
	backingStoreRatio = 1;
	
	if(!app.config.use_fallback){
		devicePixelRatio = window.devicePixelRatio || 1;
		backingStoreRatio = _ctx.webkitBackingStorePixelRatio || _ctx.mozBackingStorePixelRatio || _ctx.msBackingStorePixelRatio || _ctx.oBackingStorePixelRatio || _ctx.backingStorePixelRatio || 1;
	}

	app.config.ratio = devicePixelRatio / backingStoreRatio;

	if (!!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect) {
		app.config.use_svg = true;
		app.config.use_canvas = false;
	}
	
	//Exposing to document and setting up listeners

	register(Holder, "Holder", global);
	
	if(global.onDomReady){
		global.onDomReady(function(){
			if(!app.runtime.preempted){
				Holder.run({})
			}
			
			/*
			var debounce_resizable_update = function () {
				debounce(function () {
					resizable_update(null)
				})
			};
			*/
			
			if(global.addEventListener){
				//global.addEventListener("resize", resizable_update, false);
				//global.addEventListener("orientationchange", resizable_update, false);
			}
			else{
				//global.attachEvent("onresize", resizable_update);
			}
			
			if(typeof global.Turbolinks == "object"){
				global.document.addEventListener("page:change", function(){
					app.run({})
				})
			}
		})
	}

})(function (fn, name, global) {
	var isAMD = (typeof define === 'function' && define.amd);
	var isNode = (typeof exports === 'object');
	var isWeb = !isNode;

	if (isAMD) {
		define(fn);
	} else {
		global[name] = fn;
	}
}, this);
