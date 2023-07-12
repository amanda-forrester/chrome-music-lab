webpackJsonp([1],[
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/*!
	  * domready (c) Dustin Diaz 2014 - License MIT
	  */
	!function (name, definition) {

	  if (true) module.exports = definition()
	  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
	  else this[name] = definition()

	}('domready', function () {

	  var fns = [], listener
	    , doc = document
	    , hack = doc.documentElement.doScroll
	    , domContentLoaded = 'DOMContentLoaded'
	    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


	  if (!loaded)
	  doc.addEventListener(domContentLoaded, listener = function () {
	    doc.removeEventListener(domContentLoaded, listener)
	    loaded = 1
	    while (listener = fns.shift()) listener()
	  })

	  return function (fn) {
	    loaded ? setTimeout(fn, 0) : fns.push(fn)
	  }

	});


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/autoprefixer-loader/index.js!../node_modules/sass-loader/index.js!./main.scss", function() {
				var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/autoprefixer-loader/index.js!../node_modules/sass-loader/index.js!./main.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "@charset \"UTF-8\";\n@font-face {\n  font-family: \"icons\";\n  src: url(\"https://gweb-musiclab-site.appspot.com/static/fonts/icons/icons.eot\");\n  src: url(\"https://gweb-musiclab-site.appspot.com/static/fonts/icons/icons.eot?#iefix\") format(\"eot\"), url(\"https://gweb-musiclab-site.appspot.com/static/fonts/icons/icons.woff\") format(\"woff\"), url(\"https://gweb-musiclab-site.appspot.com/static/fonts/icons/icons.ttf\") format(\"truetype\"), url(\"https://gweb-musiclab-site.appspot.com/static/fonts/icons/icons.svg#icons\") format(\"svg\"); }\n\n.icon-svg_808:before, .icon-svg_back_arrow:before, .icon-svg_bird:before, .icon-svg_close-button:before, .icon-svg_computer:before, .icon-svg_facebook:before, .icon-svg_fast_man:before, .icon-svg_flute:before, .icon-svg_frowny_face:before, .icon-svg_go_arrow:before, .icon-svg_gplus:before, .icon-svg_hamburger_menu:before, .icon-svg_hand:before, .icon-svg_harp:before, .icon-svg_horn:before, .icon-svg_left_arrow:before, .icon-svg_man:before, .icon-svg_metronome:before, .icon-svg_no_record:before, .icon-svg_pause:before, .icon-svg_piano:before, .icon-svg_play:before, .icon-svg_record:before, .icon-svg_right_arrow:before, .icon-svg_rotate_phone:before, .icon-svg_slow_man:before, .icon-svg_twitter:before, .icon-svg_wave_form:before, .icon-svg_wine_glass:before {\n  font-family: \"icons\";\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  font-style: normal;\n  font-variant: normal;\n  font-weight: normal;\n  text-decoration: none;\n  text-transform: none; }\n\n.icon-svg_808:before {\n  content: \"\\E001\"; }\n\n.icon-svg_back_arrow:before {\n  content: \"\\E002\"; }\n\n.icon-svg_bird:before {\n  content: \"\\E003\"; }\n\n.icon-svg_close-button:before {\n  content: \"\\E004\"; }\n\n.icon-svg_computer:before {\n  content: \"\\E005\"; }\n\n.icon-svg_facebook:before {\n  content: \"\\E006\"; }\n\n.icon-svg_fast_man:before {\n  content: \"\\E007\"; }\n\n.icon-svg_flute:before {\n  content: \"\\E008\"; }\n\n.icon-svg_frowny_face:before {\n  content: \"\\E009\"; }\n\n.icon-svg_go_arrow:before {\n  content: \"\\E00A\"; }\n\n.icon-svg_gplus:before {\n  content: \"\\E00B\"; }\n\n.icon-svg_hamburger_menu:before {\n  content: \"\\E00C\"; }\n\n.icon-svg_hand:before {\n  content: \"\\E00D\"; }\n\n.icon-svg_harp:before {\n  content: \"\\E00E\"; }\n\n.icon-svg_horn:before {\n  content: \"\\E00F\"; }\n\n.icon-svg_left_arrow:before {\n  content: \"\\E010\"; }\n\n.icon-svg_man:before {\n  content: \"\\E011\"; }\n\n.icon-svg_metronome:before {\n  content: \"\\E012\"; }\n\n.icon-svg_no_record:before {\n  content: \"\\E013\"; }\n\n.icon-svg_pause:before {\n  content: \"\\E014\"; }\n\n.icon-svg_piano:before {\n  content: \"\\E015\"; }\n\n.icon-svg_play:before {\n  content: \"\\E016\"; }\n\n.icon-svg_record:before {\n  content: \"\\E017\"; }\n\n.icon-svg_right_arrow:before {\n  content: \"\\E018\"; }\n\n.icon-svg_rotate_phone:before {\n  content: \"\\E019\"; }\n\n.icon-svg_slow_man:before {\n  content: \"\\E01A\"; }\n\n.icon-svg_twitter:before {\n  content: \"\\E01B\"; }\n\n.icon-svg_wave_form:before {\n  content: \"\\E01C\"; }\n\n.icon-svg_wine_glass:before {\n  content: \"\\E01D\"; }\n\nhtml, body {\n  width: 100%;\n  height: 100%;\n  margin: 0px;\n  background-color: #f2f2f2;\n  font-family: \"Quicksand\";\n  overflow: hidden;\n  position: fixed;\n  top: 0px;\n  left: 0px;\n  -webkit-touch-callout: none;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0); }\n  html #iOSTap, body #iOSTap {\n    background-color: white;\n    position: absolute;\n    top: 0px;\n    left: 0px;\n    height: 100%;\n    width: 100%;\n    z-index: 1000000; }\n\n.Button {\n  width: 60px;\n  height: 60px;\n  border-radius: 50%;\n  background-color: white;\n  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.4);\n  line-height: 60px;\n  font-size: 60px;\n  text-align: center;\n  color: #646464;\n  cursor: pointer;\n  transition: transform 0.05s ease-in; }\n  @media screen and (max-width: 360px) {\n    .Button {\n      width: 45px;\n      height: 45px;\n      line-height: 45px;\n      font-size: 45px; } }\n\n.Button:active {\n  transform: scale(1.1); }\n\n.Button:focus {\n  outline: none; }\n", ""]);

	// exports


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 *  StartAudioContext.js
	 *  @author Yotam Mann
	 *  @license http://opensource.org/licenses/MIT MIT License
	 *  @copyright 2016 Yotam Mann
	 */
	(function (root, factory) {
		if (true) {
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
		 } else if (typeof module === "object" && module.exports) {
	        module.exports = factory()
		} else {
			root.StartAudioContext = factory()
	  }
	}(this, function () {

		//TAP LISTENER/////////////////////////////////////////////////////////////

		/**
		 * @class  Listens for non-dragging tap ends on the given element
		 * @param {Element} element
		 * @internal
		 */
		var TapListener = function(element, context){

			this._dragged = false

			this._element = element

			this._bindedMove = this._moved.bind(this)
			this._bindedEnd = this._ended.bind(this, context)

			element.addEventListener("touchstart", this._bindedEnd)
			element.addEventListener("touchmove", this._bindedMove)
			element.addEventListener("touchend", this._bindedEnd)
			element.addEventListener("mouseup", this._bindedEnd)
		}

		/**
		 * drag move event
		 */
		TapListener.prototype._moved = function(e){
			this._dragged = true
		};

		/**
		 * tap ended listener
		 */
		TapListener.prototype._ended = function(context){
			if (!this._dragged){
				startContext(context)
			}
			this._dragged = false
		};

		/**
		 * remove all the bound events
		 */
		TapListener.prototype.dispose = function(){
			this._element.removeEventListener("touchstart", this._bindedEnd)
			this._element.removeEventListener("touchmove", this._bindedMove)
			this._element.removeEventListener("touchend", this._bindedEnd)
			this._element.removeEventListener("mouseup", this._bindedEnd)
			this._bindedMove = null
			this._bindedEnd = null
			this._element = null
		};

		//END TAP LISTENER/////////////////////////////////////////////////////////

		/**
		 * Plays a silent sound and also invoke the "resume" method
		 * @param {AudioContext} context
		 * @private
		 */
		function startContext(context){
			// this accomplishes the iOS specific requirement
			var buffer = context.createBuffer(1, 1, context.sampleRate)
			var source = context.createBufferSource()
			source.buffer = buffer
			source.connect(context.destination)
			source.start(0)

			// resume the audio context
			if (context.resume){
				context.resume()
			}
		}

		/**
		 * Returns true if the audio context is started
		 * @param  {AudioContext}  context
		 * @return {Boolean}
		 * @private
		 */
		function isStarted(context){
			 return context.state === "running"
		}

		/**
		 * Invokes the callback as soon as the AudioContext
		 * is started
		 * @param  {AudioContext}   context
		 * @param  {Function} callback
		 */
		function onStarted(context, callback){

			function checkLoop(){
				if (isStarted(context)){
					callback()
				} else {
					requestAnimationFrame(checkLoop)
					if (context.resume){
						context.resume()
					}
				}
			}

			if (isStarted(context)){
				callback()
			} else {
				checkLoop()
			}
		}

		/**
		 * Add a tap listener to the audio context
		 * @param  {Array|Element|String|jQuery} element
		 * @param {Array} tapListeners
		 */
		function bindTapListener(element, tapListeners, context){
			if (Array.isArray(element) || (NodeList && element instanceof NodeList)){
				for (var i = 0; i < element.length; i++){
					bindTapListener(element[i], tapListeners, context)
				}
			} else if (typeof element === "string"){
				bindTapListener(document.querySelectorAll(element), tapListeners, context)
			} else if (element.jquery && typeof element.toArray === "function"){
				bindTapListener(element.toArray(), tapListeners, context)
			} else if (Element && element instanceof Element){
				//if it's an element, create a TapListener
				var tap = new TapListener(element, context)
				tapListeners.push(tap)
			} 
		}

		/**
		 * @param {AudioContext} context The AudioContext to start.
		 * @param {Array|String|Element|jQuery=} elements For iOS, the list of elements
		 *                                               to bind tap event listeners
		 *                                               which will start the AudioContext. If
		 *                                               no elements are given, it will bind
		 *                                               to the document.body.
		 * @param {Function=} callback The callback to invoke when the AudioContext is started.
		 * @return {Promise} The promise is invoked when the AudioContext
		 *                       is started.
		 */
		function StartAudioContext(context, elements, callback){

			//the promise is invoked when the AudioContext is started
			var promise = new Promise(function(success) {
				onStarted(context, success)
			})

			// The TapListeners bound to the elements
			var tapListeners = []

			// add all the tap listeners
			if (!elements){
				elements = document.body
			}
			bindTapListener(elements, tapListeners, context)

			//dispose all these tap listeners when the context is started
			promise.then(function(){
				for (var i = 0; i < tapListeners.length; i++){
					tapListeners[i].dispose()
				}
				tapListeners = null

				if (callback){
					callback()
				}
			})

			return promise
		}

		return StartAudioContext
	}))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 *  Tone.js
	 *  @author Yotam Mann
	 *  @license http://opensource.org/licenses/MIT MIT License
	 *  @copyright 2014-2016 Yotam Mann
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){

		"use strict";

		//////////////////////////////////////////////////////////////////////////
		//	WEB AUDIO CONTEXT
		///////////////////////////////////////////////////////////////////////////

		//borrowed from underscore.js
		function isUndef(val){
			return val === void 0;
		}

		//borrowed from underscore.js
		function isFunction(val){
			return typeof val === "function";
		}

		var audioContext;

		//polyfill for AudioContext and OfflineAudioContext
		if (isUndef(window.AudioContext)){
			window.AudioContext = window.webkitAudioContext;
		} 
		if (isUndef(window.OfflineAudioContext)){
			window.OfflineAudioContext = window.webkitOfflineAudioContext;
		} 

		if (!isUndef(AudioContext)){
			audioContext = new AudioContext();
		} else {
			throw new Error("Web Audio is not supported in this browser");
		}

		//SHIMS////////////////////////////////////////////////////////////////////

		if (!isFunction(AudioContext.prototype.createGain)){
			AudioContext.prototype.createGain = AudioContext.prototype.createGainNode;
		}
		if (!isFunction(AudioContext.prototype.createDelay)){
			AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode;
		}
		if (!isFunction(AudioContext.prototype.createPeriodicWave)){
			AudioContext.prototype.createPeriodicWave = AudioContext.prototype.createWaveTable;
		}
		if (!isFunction(AudioBufferSourceNode.prototype.start)){
			AudioBufferSourceNode.prototype.start = AudioBufferSourceNode.prototype.noteGrainOn;
		}
		if (!isFunction(AudioBufferSourceNode.prototype.stop)){
			AudioBufferSourceNode.prototype.stop = AudioBufferSourceNode.prototype.noteOff;
		}
		if (!isFunction(OscillatorNode.prototype.start)){
			OscillatorNode.prototype.start = OscillatorNode.prototype.noteOn;
		}
		if (!isFunction(OscillatorNode.prototype.stop)){
			OscillatorNode.prototype.stop = OscillatorNode.prototype.noteOff;	
		}
		if (!isFunction(OscillatorNode.prototype.setPeriodicWave)){
			OscillatorNode.prototype.setPeriodicWave = OscillatorNode.prototype.setWaveTable;	
		}
		//extend the connect function to include Tones
		AudioNode.prototype._nativeConnect = AudioNode.prototype.connect;
		AudioNode.prototype.connect = function(B, outNum, inNum){
			if (B.input){
				if (Array.isArray(B.input)){
					if (isUndef(inNum)){
						inNum = 0;
					}
					this.connect(B.input[inNum]);
				} else {
					this.connect(B.input, outNum, inNum);
				}
			} else {
				try {
					if (B instanceof AudioNode){
						this._nativeConnect(B, outNum, inNum);
					} else {
						this._nativeConnect(B, outNum);
					}
				} catch (e) {
					throw new Error("error connecting to node: "+B);
				}
			}
		};

		///////////////////////////////////////////////////////////////////////////
		//	TONE
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  @class  Tone is the base class of all other classes. It provides 
		 *          a lot of methods and functionality to all classes that extend
		 *          it. 
		 *  
		 *  @constructor
		 *  @alias Tone
		 *  @param {number} [inputs=1] the number of input nodes
		 *  @param {number} [outputs=1] the number of output nodes
		 */
		var Tone = function(inputs, outputs){

			/**
			 *  the input node(s)
			 *  @type {GainNode|Array}
			 */
			if (isUndef(inputs) || inputs === 1){
				this.input = this.context.createGain();
			} else if (inputs > 1){
				this.input = new Array(inputs);
			}

			/**
			 *  the output node(s)
			 *  @type {GainNode|Array}
			 */
			if (isUndef(outputs) || outputs === 1){
				this.output = this.context.createGain();
			} else if (outputs > 1){
				this.output = new Array(inputs);
			}
		};

		/**
		 *  Set the parameters at once. Either pass in an
		 *  object mapping parameters to values, or to set a
		 *  single parameter, by passing in a string and value.
		 *  The last argument is an optional ramp time which 
		 *  will ramp any signal values to their destination value
		 *  over the duration of the rampTime.
		 *  @param {Object|string} params
		 *  @param {number=} value
		 *  @param {Time=} rampTime
		 *  @returns {Tone} this
		 *  @example
		 * //set values using an object
		 * filter.set({
		 * 	"frequency" : 300,
		 * 	"type" : highpass
		 * });
		 *  @example
		 * filter.set("type", "highpass");
		 *  @example
		 * //ramp to the value 220 over 3 seconds. 
		 * oscillator.set({
		 * 	"frequency" : 220
		 * }, 3);
		 */
		Tone.prototype.set = function(params, value, rampTime){
			if (this.isObject(params)){
				rampTime = value;
			} else if (this.isString(params)){
				var tmpObj = {};
				tmpObj[params] = value;
				params = tmpObj;
			}
			for (var attr in params){
				value = params[attr];
				var parent = this;
				if (attr.indexOf(".") !== -1){
					var attrSplit = attr.split(".");
					for (var i = 0; i < attrSplit.length - 1; i++){
						parent = parent[attrSplit[i]];
					}
					attr = attrSplit[attrSplit.length - 1];
				}
				var param = parent[attr];
				if (isUndef(param)){
					continue;
				}
				if ((Tone.Signal && param instanceof Tone.Signal) || 
						(Tone.Param && param instanceof Tone.Param)){
					if (param.value !== value){
						if (isUndef(rampTime)){
							param.value = value;
						} else {
							param.rampTo(value, rampTime);
						}
					}
				} else if (param instanceof AudioParam){
					if (param.value !== value){
						param.value = value;
					}				
				} else if (param instanceof Tone){
					param.set(value);
				} else if (param !== value){
					parent[attr] = value;
				}
			}
			return this;
		};

		/**
		 *  Get the object's attributes. Given no arguments get
		 *  will return all available object properties and their corresponding
		 *  values. Pass in a single attribute to retrieve or an array
		 *  of attributes. The attribute strings can also include a "."
		 *  to access deeper properties.
		 *  @example
		 * osc.get();
		 * //returns {"type" : "sine", "frequency" : 440, ...etc}
		 *  @example
		 * osc.get("type");
		 * //returns { "type" : "sine"}
		 * @example
		 * //use dot notation to access deep properties
		 * synth.get(["envelope.attack", "envelope.release"]);
		 * //returns {"envelope" : {"attack" : 0.2, "release" : 0.4}}
		 *  @param {Array=|string|undefined} params the parameters to get, otherwise will return 
		 *  					                  all available.
		 *  @returns {Object}
		 */
		Tone.prototype.get = function(params){
			if (isUndef(params)){
				params = this._collectDefaults(this.constructor);
			} else if (this.isString(params)){
				params = [params];
			} 
			var ret = {};
			for (var i = 0; i < params.length; i++){
				var attr = params[i];
				var parent = this;
				var subRet = ret;
				if (attr.indexOf(".") !== -1){
					var attrSplit = attr.split(".");
					for (var j = 0; j < attrSplit.length - 1; j++){
						var subAttr = attrSplit[j];
						subRet[subAttr] = subRet[subAttr] || {};
						subRet = subRet[subAttr];
						parent = parent[subAttr];
					}
					attr = attrSplit[attrSplit.length - 1];
				}
				var param = parent[attr];
				if (this.isObject(params[attr])){
					subRet[attr] = param.get();
				} else if (Tone.Signal && param instanceof Tone.Signal){
					subRet[attr] = param.value;
				} else if (Tone.Param && param instanceof Tone.Param){
					subRet[attr] = param.value;
				} else if (param instanceof AudioParam){
					subRet[attr] = param.value;
				} else if (param instanceof Tone){
					subRet[attr] = param.get();
				} else if (!isFunction(param) && !isUndef(param)){
					subRet[attr] = param;
				} 
			}
			return ret;
		};

		/**
		 *  collect all of the default attributes in one
		 *  @private
		 *  @param {function} constr the constructor to find the defaults from
		 *  @return {Array} all of the attributes which belong to the class
		 */
		Tone.prototype._collectDefaults = function(constr){
			var ret = [];
			if (!isUndef(constr.defaults)){
				ret = Object.keys(constr.defaults);
			}
			if (!isUndef(constr._super)){
				var superDefs = this._collectDefaults(constr._super);
				//filter out repeats
				for (var i = 0; i < superDefs.length; i++){
					if (ret.indexOf(superDefs[i]) === -1){
						ret.push(superDefs[i]);
					}
				}
			}
			return ret;
		};

		/**
		 *  @returns {string} returns the name of the class as a string
		 */
		Tone.prototype.toString = function(){
			for (var className in Tone){
				var isLetter = className[0].match(/^[A-Z]$/);
				var sameConstructor =  Tone[className] === this.constructor;
				if (isFunction(Tone[className]) && isLetter && sameConstructor){
					return className;
				}
			}
			return "Tone";
		};

		///////////////////////////////////////////////////////////////////////////
		//	CLASS VARS
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  A static pointer to the audio context accessible as Tone.context. 
		 *  @type {AudioContext}
		 */
		Tone.context = audioContext;

		/**
		 *  The audio context.
		 *  @type {AudioContext}
		 */
		Tone.prototype.context = Tone.context;

		/**
		 *  the default buffer size
		 *  @type {number}
		 *  @static
		 *  @const
		 */
		Tone.prototype.bufferSize = 2048;

		/**
		 *  The delay time of a single frame (128 samples according to the spec). 
		 *  @type {number}
		 *  @static
		 *  @const
		 */
		Tone.prototype.blockTime = 128 / Tone.context.sampleRate;

		/**
		 *  The time of a single sample
		 *  @type {number}
		 *  @static
		 *  @const
		 */
		Tone.prototype.sampleTime = 1 / Tone.context.sampleRate;
		
		///////////////////////////////////////////////////////////////////////////
		//	CONNECTIONS
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  disconnect and dispose
		 *  @returns {Tone} this
		 */
		Tone.prototype.dispose = function(){
			if (!this.isUndef(this.input)){
				if (this.input instanceof AudioNode){
					this.input.disconnect();
				} 
				this.input = null;
			}
			if (!this.isUndef(this.output)){
				if (this.output instanceof AudioNode){
					this.output.disconnect();
				} 
				this.output = null;
			}
			return this;
		};

		/**
		 *  a silent connection to the DesinationNode
		 *  which will ensure that anything connected to it
		 *  will not be garbage collected
		 *  
		 *  @private
		 */
		var _silentNode = null;

		/**
		 *  makes a connection to ensure that the node will not be garbage collected
		 *  until 'dispose' is explicitly called
		 *
		 *  use carefully. circumvents JS and WebAudio's normal Garbage Collection behavior
		 *  @returns {Tone} this
		 */
		Tone.prototype.noGC = function(){
			this.output.connect(_silentNode);
			return this;
		};

		AudioNode.prototype.noGC = function(){
			this.connect(_silentNode);
			return this;
		};

		/**
		 *  connect the output of a ToneNode to an AudioParam, AudioNode, or ToneNode
		 *  @param  {Tone | AudioParam | AudioNode} unit 
		 *  @param {number} [outputNum=0] optionally which output to connect from
		 *  @param {number} [inputNum=0] optionally which input to connect to
		 *  @returns {Tone} this
		 */
		Tone.prototype.connect = function(unit, outputNum, inputNum){
			if (Array.isArray(this.output)){
				outputNum = this.defaultArg(outputNum, 0);
				this.output[outputNum].connect(unit, 0, inputNum);
			} else {
				this.output.connect(unit, outputNum, inputNum);
			}
			return this;
		};

		/**
		 *  disconnect the output
		 *  @returns {Tone} this
		 */
		Tone.prototype.disconnect = function(outputNum){
			if (Array.isArray(this.output)){
				outputNum = this.defaultArg(outputNum, 0);
				this.output[outputNum].disconnect();
			} else {
				this.output.disconnect();
			}
			return this;
		};

		/**
		 *  connect together all of the arguments in series
		 *  @param {...AudioParam|Tone|AudioNode} nodes
		 *  @returns {Tone} this
		 */
		Tone.prototype.connectSeries = function(){
			if (arguments.length > 1){
				var currentUnit = arguments[0];
				for (var i = 1; i < arguments.length; i++){
					var toUnit = arguments[i];
					currentUnit.connect(toUnit);
					currentUnit = toUnit;
				}
			}
			return this;
		};

		/**
		 *  fan out the connection from the first argument to the rest of the arguments
		 *  @param {...AudioParam|Tone|AudioNode} nodes
		 *  @returns {Tone} this
		 */
		Tone.prototype.connectParallel = function(){
			var connectFrom = arguments[0];
			if (arguments.length > 1){
				for (var i = 1; i < arguments.length; i++){
					var connectTo = arguments[i];
					connectFrom.connect(connectTo);
				}
			}
			return this;
		};

		/**
		 *  Connect the output of this node to the rest of the nodes in series.
		 *  @example
		 *  //connect a node to an effect, panVol and then to the master output
		 *  node.chain(effect, panVol, Tone.Master);
		 *  @param {...AudioParam|Tone|AudioNode} nodes
		 *  @returns {Tone} this
		 */
		Tone.prototype.chain = function(){
			if (arguments.length > 0){
				var currentUnit = this;
				for (var i = 0; i < arguments.length; i++){
					var toUnit = arguments[i];
					currentUnit.connect(toUnit);
					currentUnit = toUnit;
				}
			}
			return this;
		};

		/**
		 *  connect the output of this node to the rest of the nodes in parallel.
		 *  @param {...AudioParam|Tone|AudioNode} nodes
		 *  @returns {Tone} this
		 */
		Tone.prototype.fan = function(){
			if (arguments.length > 0){
				for (var i = 0; i < arguments.length; i++){
					this.connect(arguments[i]);
				}
			}
			return this;
		};

		//give native nodes chain and fan methods
		AudioNode.prototype.chain = Tone.prototype.chain;
		AudioNode.prototype.fan = Tone.prototype.fan;

		///////////////////////////////////////////////////////////////////////////
		//	UTILITIES / HELPERS / MATHS
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  If the `given` parameter is undefined, use the `fallback`. 
		 *  If both `given` and `fallback` are object literals, it will
		 *  return a deep copy which includes all of the parameters from both 
		 *  objects. If a parameter is undefined in given, it will return
		 *  the fallback property. 
		 *  <br><br>
		 *  WARNING: if object is self referential, it will go into an an 
		 *  infinite recursive loop.
		 *  
		 *  @param  {*} given    
		 *  @param  {*} fallback 
		 *  @return {*}          
		 */
		Tone.prototype.defaultArg = function(given, fallback){
			if (this.isObject(given) && this.isObject(fallback)){
				var ret = {};
				//make a deep copy of the given object
				for (var givenProp in given) {
					ret[givenProp] = this.defaultArg(fallback[givenProp], given[givenProp]);
				}
				for (var fallbackProp in fallback) {
					ret[fallbackProp] = this.defaultArg(given[fallbackProp], fallback[fallbackProp]);
				}
				return ret;
			} else {
				return isUndef(given) ? fallback : given;
			}
		};

		/**
		 *  returns the args as an options object with given arguments
		 *  mapped to the names provided. 
		 *
		 *  if the args given is an array containing only one object, it is assumed
		 *  that that's already the options object and will just return it. 
		 *  
		 *  @param  {Array} values  the 'arguments' object of the function
		 *  @param  {Array} keys the names of the arguments as they
		 *                                 should appear in the options object
		 *  @param {Object=} defaults optional defaults to mixin to the returned 
		 *                            options object                              
		 *  @return {Object}       the options object with the names mapped to the arguments
		 */
		Tone.prototype.optionsObject = function(values, keys, defaults){
			var options = {};
			if (values.length === 1 && this.isObject(values[0])){
				options = values[0];
			} else {
				for (var i = 0; i < keys.length; i++){
					options[keys[i]] = values[i];
				}
			}
			if (!this.isUndef(defaults)){
				return this.defaultArg(options, defaults);
			} else {
				return options;
			}
		};

		///////////////////////////////////////////////////////////////////////////
		// TYPE CHECKING
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  test if the arg is undefined
		 *  @param {*} arg the argument to test
		 *  @returns {boolean} true if the arg is undefined
		 *  @function
		 */
		Tone.prototype.isUndef = isUndef;

		/**
		 *  test if the arg is a function
		 *  @param {*} arg the argument to test
		 *  @returns {boolean} true if the arg is a function
		 *  @function
		 */
		Tone.prototype.isFunction = isFunction;

		/**
		 *  Test if the argument is a number.
		 *  @param {*} arg the argument to test
		 *  @returns {boolean} true if the arg is a number
		 */
		Tone.prototype.isNumber = function(arg){
			return (typeof arg === "number");
		};

		/**
		 *  Test if the given argument is an object literal (i.e. `{}`);
		 *  @param {*} arg the argument to test
		 *  @returns {boolean} true if the arg is an object literal.
		 */
		Tone.prototype.isObject = function(arg){
			return (Object.prototype.toString.call(arg) === "[object Object]" && arg.constructor === Object);
		};

		/**
		 *  Test if the argument is a boolean.
		 *  @param {*} arg the argument to test
		 *  @returns {boolean} true if the arg is a boolean
		 */
		Tone.prototype.isBoolean = function(arg){
			return (typeof arg === "boolean");
		};

		/**
		 *  Test if the argument is an Array
		 *  @param {*} arg the argument to test
		 *  @returns {boolean} true if the arg is an array
		 */
		Tone.prototype.isArray = function(arg){
			return (Array.isArray(arg));
		};

		/**
		 *  Test if the argument is a string.
		 *  @param {*} arg the argument to test
		 *  @returns {boolean} true if the arg is a string
		 */
		Tone.prototype.isString = function(arg){
			return (typeof arg === "string");
		};

	 	/**
		 *  An empty function.
		 *  @static
		 */
		Tone.noOp = function(){};

		/**
		 *  Make the property not writable. Internal use only. 
		 *  @private
		 *  @param  {string}  property  the property to make not writable
		 */
		Tone.prototype._readOnly = function(property){
			if (Array.isArray(property)){
				for (var i = 0; i < property.length; i++){
					this._readOnly(property[i]);
				}
			} else {
				Object.defineProperty(this, property, { 
					writable: false,
					enumerable : true,
				});
			}
		};

		/**
		 *  Make an attribute writeable. Interal use only. 
		 *  @private
		 *  @param  {string}  property  the property to make writable
		 */
		Tone.prototype._writable = function(property){
			if (Array.isArray(property)){
				for (var i = 0; i < property.length; i++){
					this._writable(property[i]);
				}
			} else {
				Object.defineProperty(this, property, { 
					writable: true,
				});
			}
		};

		/**
		 * Possible play states. 
		 * @enum {string}
		 */
		Tone.State = {
			Started : "started",
			Stopped : "stopped",
			Paused : "paused",
	 	};

		///////////////////////////////////////////////////////////////////////////
		// GAIN CONVERSIONS
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  Equal power gain scale. Good for cross-fading.
		 *  @param  {NormalRange} percent (0-1)
		 *  @return {Number}         output gain (0-1)
		 */
		Tone.prototype.equalPowerScale = function(percent){
			var piFactor = 0.5 * Math.PI;
			return Math.sin(percent * piFactor);
		};

		/**
		 *  Convert decibels into gain.
		 *  @param  {Decibels} db
		 *  @return {Number}   
		 */
		Tone.prototype.dbToGain = function(db) {
			return Math.pow(2, db / 6);
		};

		/**
		 *  Convert gain to decibels.
		 *  @param  {Number} gain (0-1)
		 *  @return {Decibels}   
		 */
		Tone.prototype.gainToDb = function(gain) {
			return  20 * (Math.log(gain) / Math.LN10);
		};

		///////////////////////////////////////////////////////////////////////////
		//	TIMING
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  Return the current time of the AudioContext clock.
		 *  @return {Number} the currentTime from the AudioContext
		 */
		Tone.prototype.now = function(){
			return this.context.currentTime;
		};

		/**
		 *  Return the current time of the AudioContext clock.
		 *  @return {Number} the currentTime from the AudioContext
		 *  @static
		 */
		Tone.now = function(){
			return Tone.context.currentTime;
		};

		///////////////////////////////////////////////////////////////////////////
		//	INHERITANCE
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  have a child inherit all of Tone's (or a parent's) prototype
		 *  to inherit the parent's properties, make sure to call 
		 *  Parent.call(this) in the child's constructor
		 *
		 *  based on closure library's inherit function
		 *
		 *  @static
		 *  @param  {function} 	child  
		 *  @param  {function=} parent (optional) parent to inherit from
		 *                             if no parent is supplied, the child
		 *                             will inherit from Tone
		 */
		Tone.extend = function(child, parent){
			if (isUndef(parent)){
				parent = Tone;
			}
			function TempConstructor(){}
			TempConstructor.prototype = parent.prototype;
			child.prototype = new TempConstructor();
			/** @override */
			child.prototype.constructor = child;
			child._super = parent;
		};

		///////////////////////////////////////////////////////////////////////////
		//	CONTEXT
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  array of callbacks to be invoked when a new context is added
		 *  @private 
		 *  @private
		 */
		var newContextCallbacks = [];

		/**
		 *  invoke this callback when a new context is added
		 *  will be invoked initially with the first context
		 *  @private 
		 *  @static
		 *  @param {function(AudioContext)} callback the callback to be invoked
		 *                                           with the audio context
		 */
		Tone._initAudioContext = function(callback){
			//invoke the callback with the existing AudioContext
			callback(Tone.context);
			//add it to the array
			newContextCallbacks.push(callback);
		};

		/**
		 *  Tone automatically creates a context on init, but if you are working
		 *  with other libraries which also create an AudioContext, it can be
		 *  useful to set your own. If you are going to set your own context, 
		 *  be sure to do it at the start of your code, before creating any objects.
		 *  @static
		 *  @param {AudioContext} ctx The new audio context to set
		 */
		Tone.setContext = function(ctx){
			//set the prototypes
			Tone.prototype.context = ctx;
			Tone.context = ctx;
			//invoke all the callbacks
			for (var i = 0; i < newContextCallbacks.length; i++){
				newContextCallbacks[i](ctx);
			}
		};

		/**
		 *  Bind this to a touchstart event to start the audio on mobile devices. 
		 *  <br>
		 *  http://stackoverflow.com/questions/12517000/no-sound-on-ios-6-web-audio-api/12569290#12569290
		 *  @static
		 */
		Tone.startMobile = function(){
			var osc = Tone.context.createOscillator();
			var silent = Tone.context.createGain();
			silent.gain.value = 0;
			osc.connect(silent);
			silent.connect(Tone.context.destination);
			var now = Tone.context.currentTime;
			osc.start(now);
			osc.stop(now+1);
		};

		//setup the context
		Tone._initAudioContext(function(audioContext){
			//set the blockTime
			Tone.prototype.blockTime = 128 / audioContext.sampleRate;
			Tone.prototype.sampleTime = 1 / audioContext.sampleRate;
			_silentNode = audioContext.createGain();
			_silentNode.gain.value = 0;
			_silentNode.connect(audioContext.destination);
		});

		Tone.version = "r7-dev";

		console.log("%c * Tone.js " + Tone.version + " * ", "background: #000; color: #fff");

		return Tone;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })
]);