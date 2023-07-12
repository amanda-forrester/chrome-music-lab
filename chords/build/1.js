webpackJsonp([1],[
/* 0 */,
/* 1 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "body, html, #Container {\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n  margin: 0px;\n  overflow: hidden;\n  -webkit-touch-callout: none;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0); }\n  body #Container, html #Container, #Container #Container {\n    -ms-flex-align: center;\n        align-items: center;\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-direction: column;\n        flex-direction: column;\n    -ms-flex-pack: center;\n        justify-content: center;\n    position: absolute; }\n  body #iOSTap, html #iOSTap, #Container #iOSTap {\n    width: 100%;\n    height: 100%;\n    top: 0px;\n    left: 0px;\n    position: absolute;\n    background-color: white;\n    z-index: 100000; }\n", ""]);

	// exports


/***/ },
/* 4 */
/***/ function(module, exports) {

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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

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
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

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

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Copyright 2016 Google Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(7), __webpack_require__(13), __webpack_require__(15), __webpack_require__(30)], __WEBPACK_AMD_DEFINE_RESULT__ = function (PianoComp, pianoStyle, teoria, Tone) {

		
		var Piano = function(container, lowestNote, highestNote){

			/**
			 * the element
			 */
			this.element = document.createElement("DIV");
			this.element.id = "Piano";
			container.appendChild(this.element);

			/**
			 * the piano rendering
			 */
			this.piano = new PianoComp(this.element, lowestNote, highestNote);
			this.piano.setHighlightColor("#ffb729");
			this.piano.onkeydown = this.clicked.bind(this);

			this.piano.oncontextstart = function(){
				Tone.startMobile();
			};

			/**
			 * The callback to invoke on each click
			 */
			this.onNotes = function(){};

			/**
			 * the currently selected notes
			 */
			this.selected = [];

			/**
			 * the current mode of the piano. 
			 * "major" | "minor"
			 */
			this.mode = "major";

			/**
			 * the name of the key that we're in.
			 */
			this.key = null;

			/**
			 * the timeouts for each note
			 */
			this.timeouts = {};

			window.addEventListener("resize", function(){
				this.piano._resize();
			}.bind(this));
		};

		/**
		 * the delay time between sequential notes
		 * @type {Number}
		 */
		Piano.prototype.delayTime = 0.05;

		Piano.prototype.clicked = function(midiNote){
			this.setChord(midiNote);
		};

		Piano.prototype.setChord = function(pitchOctave){
			this.clearTimeouts();
			var note = teoria.note(pitchOctave);
			this.key = note;
			var chord = note.chord(this.mode).notes();
			//unselect the previous notes
			this.unselectAll();
			var notes = [];
			for (var i = 0; i < chord.length; i++){
				chordNote = chord[i];
				var midiNote = chordNote.midi();
				var scientific = teoria.note.fromMIDI(midiNote).scientific();
				this.piano.keyDown(scientific);
				notes.push(scientific);
				this.triggerNote(scientific, this.delayTime * (i + 1));
			}
			this.onNotes(notes, this.key.name() + this.key.accidental(), this.mode);
		};

		Piano.prototype.triggerNote = function(note, delay){
			this.timeouts[note] = setTimeout(function(){
				//set the note as highlighted for a short time
				this.piano.highlight(note, "#996e19", "#996e19");
				this.timeouts[note] = setTimeout(function(){
					this.piano.keyDown(note);
				}.bind(this), this.delayTime * 1200);
			}.bind(this), delay * 1000);
		};

		Piano.prototype.clearTimeouts = function(){
			for (var id in this.timeouts){
				clearTimeout(this.timeouts[id]);
			}
			this.timeouts = {};
		};

		Piano.prototype.setMode = function(mode){
			this.mode = mode;
			if (this.key){
				this.setChord(this.key.scientific());
			}
		};

		Piano.prototype.unselectAll = function() {
			this.piano.unselectAll();
		};

		return Piano;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Copyright 2016 Google Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(8), __webpack_require__(10), __webpack_require__(12), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Key, mainStyle, Notes, Colors){

		var enharmonics = {
			"C#" : "Db",
			"D#" : "Eb",
			"F#" : "Gb", 
			"G#" : "Ab", 
			"A#" : "Bb"
		};


		/**
		 * @class Create a new piano keyboard.
		 * @param {Element} container The container to put the piano
		 * @param {String=} start The lowest note on the keyboard
		 * @param {String=} end The highest note on the keyboard
		 */
		var Piano = function(container, start, end){

			/**
			 * The canvas
			 * @type {Element}
			 * @private
			 */
			this._canvas = document.createElement("canvas");
			this._canvas.id = "PianoKeyboard";
			container.appendChild(this._canvas);

			/**
			 * The drawing context
			 * @type {Context2D}
			 * @private
			 */
			this._context = this._canvas.getContext("2d");

			/**
			 * The container of the canvas
			 * @type {Element}
			 * @private
			 */
			this._container = container;

			/**
			 * The lowest note on the keyboard
			 * @type {String}
			 * @private
			 */
			this._startNote = start || "C4";

			/**
			 * The highest note on the keyboard
			 * @type {String}
			 * @private
			 */
			this._endNote = end || "C6";

			/**
			 * The array of note names
			 * @private
			 * @type {Array}
			 */
			this._notes = [];

			/**
			 * an object mapping note names to note objects
			 * @type {Object}
			 * @private
			 */
			this._noteNames = {};

			/**
			 * Indicates if the mouse is currently down
			 * @type {Boolean}
			 * @private
			 */
			this._isMouseDown = false;

			/**
			 * Flag if the touch was moved
			 * @type {Boolean}
			 * @private
			 */
			this._touchDragged = false;

			/**
			 * Flag if the context started callback
			 * was invoked.
			 * @type {Boolean}
			 * @private
			 */
			this._contextStarted = false;

			/**
			 * The highlighted keys
			 * @type {Array}
			 * @private
			 */
			this._highlightedKeys = [];

			/**
			 * the highlight color
			 * @type {String}
			 * @private
			 */
			this._highlightColor = "#FFB729";

			//listen for changes in the size of the container
			window.addEventListener("resize", this._resize.bind(this));
			//events
			this._canvas.addEventListener("mousedown", this._mouseDown.bind(this));
			this._canvas.addEventListener("mousemove", this._mouseMove.bind(this));
			this._canvas.addEventListener("mouseup", this._mouseUp.bind(this));
			this._canvas.addEventListener("mouseleave", this._mouseLeave.bind(this));
			this._canvas.addEventListener("touchstart", this._touchStart.bind(this));
			this._canvas.addEventListener("touchend", this._touchEnd.bind(this));
			this._canvas.addEventListener("touchmove", this._touchMove.bind(this));

			//size the container initially
			this._makeKeys();
			this._resize();

			//callback events
			this.onkeydown = function(){};
			this.onkeyup = function(){};

			//callback if the context can be started
			this.oncontextstart = function(){};
		};

		/**
		 * resize the canvas
		 * @private
		 */
		Piano.prototype._resize = function(){
			this._context.canvas.width = this._container.clientWidth * 2;
			this._context.canvas.height = this._container.clientHeight * 2;
			this.draw();
		};

		/**
		 * Force a redraw of the piano
		 * @return {Piano} this
		 */
		Piano.prototype.draw = function(){
			var width = this._context.canvas.width;
			var height = this._context.canvas.height;

			var lineWidth = 2;
			this._context.lineWidth = lineWidth;

			//clear the previous one
			this._context.clearRect(0, 0, width, height);

			this._context.strokeStyle = Colors.lightGrey;

			var span = Notes.getDistanceBetween(this._startNote, this._endNote);
			var keyWidth = width / span;
			var key;
			//draw the white keys
			for (var i = 0; i < this._keys.length; i++){
				key = this._keys[i];
				if (!key.isSharp){
					key.draw(this._context, keyWidth, height);
				}
			}
			//draw the black keys
			for (var j = 0; j < this._keys.length; j++){
				key = this._keys[j];
				if (key.isSharp){
					key.draw(this._context, keyWidth, height);
				}
			}

			//draw the overal2;
			this._context.beginPath();
			this._context.lineWidth = lineWidth * 2;
			this._context.rect(0, 0, width, height);
			this._context.stroke();
			return this;
		};

		/**
		 * Test for collisions
		 */
		Piano.prototype._getCollision = function(x, y){
			var span = Notes.getDistanceBetween(this._startNote, this._endNote);
			var width = this._context.canvas.width / span;
			var height = this._context.canvas.height;
			x  = x * 2 / width;
			y = y * 2 / height;
			var key;
			var collidedKey;
			//draw the white keys
			for (var i = 0; i < this._keys.length; i++){
				key = this._keys[i];
				if (key.isSharp){
					if (key.testCollision(x, y)){
						collidedKey = key;
						break;
					}
				}
			}
			if (!collidedKey){
				//test the white keys
				for (var j = 0; j < this._keys.length; j++){
					key = this._keys[j];
					if (!key.isSharp){
						if (key.testCollision(x, y)){
							collidedKey = key;
							break;
						}
					}
				}
			}
			return collidedKey;
		};

		/**
		 * Make all the keys
		 */
		Piano.prototype._makeKeys = function(){
			this._notes = Notes.getNotes(this._startNote, this._endNote);
			this._keys = [];
			for (var i = 0; i < this._notes.length; i++){
				var note = this._notes[i];
				var key = new Key(note, Notes.getDistanceBetween(this._startNote, note));
				this._noteNames[note] = key;
				var sharpedNote = note.substr(0, 2);
				if (enharmonics.hasOwnProperty(sharpedNote)){
					var octave = note.substr(2);
					this._noteNames[enharmonics[sharpedNote] + octave] = key;
				}
				this._keys.push(key);
			}
			return this;
		};

		///////////////////////////////////////////////////////////////////////////
		// MOUSE EVENTS
		///////////////////////////////////////////////////////////////////////////

		Piano.prototype._mouseDown = function(e){
			//test collisions
			e.preventDefault();
			var key = this._getCollision(e.offsetX, e.offsetY);
			this._isMouseDown = true;
			if (key){
				this._highlightedKeys.push(key);
				this.onkeydown(key.note);
			}
		};

		Piano.prototype._mouseUp = function(e){
			//test collisions
			e.preventDefault();
			var key = this._getCollision(e.offsetX, e.offsetY);
			this._isMouseDown = false;
			if (key){
				this._highlightedKeys.splice(this._highlightedKeys.indexOf(key), 1);
				this.onkeyup(key.note);
			}
		};

		Piano.prototype._mouseLeave = function(e){
			//test collisions
			e.preventDefault();
			this._isMouseDown = false;
			for (var i = 0; i < this._highlightedKeys.length; i++){
				this.onkeyup(this._highlightedKeys[i].note);
			}
			this._highlightedKeys = [];
		};

		Piano.prototype._mouseMove = function(e){
			if (this._isMouseDown){
				e.preventDefault();
				var key = this._getCollision(e.offsetX, e.offsetY);
				//if it's not already down
				if (this._highlightedKeys.indexOf(key) === -1){
					//unhighlight the current key
					for (var i = 0; i < this._highlightedKeys.length; i++){
						this.onkeyup(this._highlightedKeys[i].note);
					}
					this._highlightedKeys = [];
					if (key){
						this._highlightedKeys.push(key);
						this.onkeydown(key.note);
					}
				}
			}
		};

		Piano.prototype._touchStart = function(e){
			e.preventDefault();
			var parentOffset = this._container.getBoundingClientRect();
			var touches = e.changedTouches;
			for (var i = 0; i < touches.length; i++){
				var touch = touches[i];
				var key = this._getCollision(touch.clientX - parentOffset.left, touch.clientY - parentOffset.top);
				if (key){
					this._highlightedKeys.push(key);
					this.onkeydown(key.note);
				}			
			}
			this._touchDragged = false;
		};

		Piano.prototype._touchEnd = function(e){
			e.preventDefault();
			var parentOffset = this._container.getBoundingClientRect();
			var touches = e.changedTouches;
			for (var i = 0; i < touches.length; i++){
				var touch = touches[i];
				var key = this._getCollision(touch.clientX - parentOffset.left, touch.clientY - parentOffset.top);
				if (key){
					this._highlightedKeys.splice(this._highlightedKeys.indexOf(key), 1);
					this.onkeyup(key.note);
				}			
			}
			if (!this._touchDragged && !this._contextStarted){
				this._contextStarted = true;
				this.oncontextstart();
			}
		};

		Piano.prototype._touchMove = function(e){
			e.preventDefault();
			var parentOffset = this._container.getBoundingClientRect();
			var touches = e.changedTouches;
			for (var i = 0; i < touches.length; i++){
				var touch = touches[i];
				var key = this._getCollision(touch.clientX - parentOffset.left, touch.clientY - parentOffset.top);
				//if it's not already down
				if (this._highlightedKeys.indexOf(key) === -1){
					//unhighlight the current key
					for (var j = 0; j < this._highlightedKeys.length; j++){
						this.onkeyup(this._highlightedKeys[j].note);
					}
					this._highlightedKeys = [];
					if (key){
						this._highlightedKeys.push(key);
						this.onkeydown(key.note);
					}
				}	
			}
			//flag that the touch moved
			this._touchDragged = true;
		};

		///////////////////////////////////////////////////////////////////////////
		// SETTERS
		///////////////////////////////////////////////////////////////////////////

		/**
		 * Set the highlight color. "rainbow" will use the 
		 * colored keyboard palette. 
		 * @param {String} color
		 * @return {Piano} this
		 */
		Piano.prototype.setHighlightColor = function(color){
			this._highlightColor = color;
			this._keys.forEach(function(key){
				key.setHighlightColor(color);
			});
			this.draw();
			return this;
		};

		/**
		 * Set the lowest note on the keyboard
		 * @param {String} startNote
		 * @return {Piano} this
		 */
		Piano.prototype.setStartNote = function(startNote){
			this._startNote = startNote;
			this._makeKeys();
			this.draw();
			return this;
		};

		/**
		 * Set the highest note on the keyboard
		 * @param {String} endNote
		 * @return {Piano} this
		 */
		Piano.prototype.setEndNote = function(endNote){
			this._endNote = endNote;
			this._makeKeys();
			this.draw();
			return this;
		};

		///////////////////////////////////////////////////////////////////////////
		// HIGHLIGHTING
		///////////////////////////////////////////////////////////////////////////

		Piano.prototype.keyDown = function(note){
			if (Array.isArray(note)){
				for(var i = 0; i < note.length; i++){
					this.keyDown(note[i]);
				}
			} else if (this._noteNames.hasOwnProperty(note)){
				this._noteNames[note].highlight(this._highlightColor);
			}
			this.draw();
		};

		Piano.prototype.highlight = function(note, whiteColor, blackColor){
			if (Array.isArray(note)){
				for(var i = 0; i < note.length; i++){
					this.highlight(note[i]);
				}
			} else if (this._noteNames.hasOwnProperty(note)){
				var key = this._noteNames[note];
				if (key.isSharp){
					this._noteNames[note].highlight( blackColor || Colors.lightGrey);
				} else {
					this._noteNames[note].highlight( whiteColor || "black");
				}
			}
			this.draw();
		};

		Piano.prototype.keyUp = function(note){
			if (Array.isArray(note)){
				for(var i = 0; i < note.length; i++){
					this.keyUp(note[i]);
				}
			} else if (this._noteNames.hasOwnProperty(note)){
				this._noteNames[note].unhighlight();
			}
			this.draw();
		};

		Piano.prototype.unselectAll = function(){
			for (var j = 0; j < this._keys.length; j++){
				this._keys[j].unhighlight();
			}
			this.draw();
		};

		return Piano;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Copyright 2016 Google Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(9)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Colors) {

		"use strict";

		/**
		 * @class Represents a single key
		 * @param {HTML Canvas}
		 * @param {String} note
		 * @param {String} startNote
		 * @param {String} endNote
		 */
		var Key = function(note, offset){

			/**
			 * The note
			 * @type {String}
			 * @private
			 */
			this.note = note;

			/**
			 * The key offset between the start note
			 * and this note
			 * @type {Number}
			 * @private
			 */
			this._offset = offset;

			/**
			 * The key offset between the start note
			 * and this note
			 * @type {Number}
			 * @private
			 */
			this.isSharp = this.note.indexOf("#") !== -1;

			/**
			 * If the note is highlighted or not
			 * @type {Boolean}
			 * @private
			 */
			this._isHighlighted = false;

			/**
			 * The highlight color
			 * @type {String}
			 * @private
			 */
			this._highlightColor = "";

			//defaults to rainbow
			this.setHighlightColor("rainbow");

			this._computeBoundingBox();
			//listen for mouse and touch events
			// this._canvas.on("mousedown", this._mousedown.bind(this));
		};

		/**
		 * returns an array of [left, top, width, height] for the note
		 */
		Key.prototype._computeBoundingBox = function(){
			var noteHeight = this.isSharp ? 0.6 : 1;
			var noteWidth = this.isSharp ? 0.7 : 1;
			var offset = this.isSharp ? (1 - noteWidth) / 2 : 0;
			return [this._offset + offset, 0, noteWidth, noteHeight];
		};

		/**
		 * The pitch of the note
		 * @return {String}
		 * @private
		 */
		Key.prototype._getNoteName = function(){
			var parts = this.note.split(/(-?\d+)/);
			if (parts.length === 3){
				var noteName = parts[0].toUpperCase();
				return noteName;
			}
		};

		/**
		 * Mark the key as highlighted
		 * @param  {String} color, set the highlight color
		 * @return {Key} this
		 */
		Key.prototype.highlight = function(color){
			this._isHighlighted = true;
			this._highlightColor = color;
			return this;
		};

		/**
		 * Unhighlight the key
		 * @return {Key} this
		 */
		Key.prototype.unhighlight = function(){
			this._isHighlighted = false;
			return this;
		};

		/**
		 * Set the highlight color of the note
		 * @param {String}
		 */
		Key.prototype.setHighlightColor = function(color){
			if (color === "rainbow"){
				this._highlightColor = Colors[this._getNoteName()];
			} else {
				this._highlightColor = color;
			}
			return this;
		};

		/**
		 * Set the lowest note on the piano
		 * @param {String}
		 */
		Key.prototype.setStartNote = function(startNote){
			this._startNote = startNote;
			this._computeBoundingBox();
		};

		/**
		 * Set the highest note on the piano
		 * @param {String}
		 */
		Key.prototype.setEndNote = function(endNote){
			this._endNote = endNote;
			this._computeBoundingBox();
		};

		/**
		 * Test if coords intersect with this key
		 */
		Key.prototype.testCollision = function(x, y){
			var box = this._computeBoundingBox();
			if (box[0] <= x && box[0] + box[2] >= x && box[1] <= y && box[3] >= y){
				return true;
			}
		};

		/**
		 * Draw the note on the context
		 * @return {Key} this
		 */
		Key.prototype.draw = function(context, width, height){
			context.beginPath();
			if (this._isHighlighted){
				context.fillStyle = this._highlightColor;
			} else {
				context.fillStyle = this.isSharp ? Colors.charcoal : "white";
			}
			var box = this._computeBoundingBox();
			box[0] = Math.round(width * box[0]);
			box[2] = Math.round(width * box[2]);
			box[1] = Math.round(height * box[1]);
			box[3] = Math.round(height * box[3]);
			context.rect.apply(context, box);
			context.fill();
			if (!this.isSharp && !this._isHighlighted){
				context.stroke();
			}
			return this;
		};

		return Key;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Copyright 2016 Google Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){

		return {
			//shades
			"charcoal" : "rgb(50,51,52)",
			"lightGrey" : "rgb(223,224,225)",
			"grey" : "rgb(204, 204, 204)",
			//colors
			"orange" : "#FFB729",
			"blue" : "rgb(22, 168, 240)",
			"lightBlue" : "rgb(131, 211, 248)",
			//keys
			"C" : "#4e61d8",
			"C#" : "#8064c6",
			"Db" : "#8064c6",
			"D" : "#a542b1",
			"D#" : "#ed3883",
			"Eb" : "#ed3883",
			"E" : "#f75839",
			"F" : "#f7943d",
			"F#" : "#f6be37",
			"Gb" : "#f6be37",
			"G" : "#d1c12e",
			"G#" : "#95c631",
			"Ab" : "#95c631",
			"A" : "#4bb250",
			"A#" : "#45b5a1",
			"Bb" : "#45b5a1",
			"B" : "#4598b6",
		};
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(11);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/autoprefixer-loader/index.js!../node_modules/sass-loader/index.js!./keyboard.scss", function() {
				var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/autoprefixer-loader/index.js!../node_modules/sass-loader/index.js!./keyboard.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "#PianoKeyboard {\n  width: 100%;\n  height: 100%;\n  position: relative;\n  cursor: pointer; }\n", ""]);

	// exports


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Copyright 2016 Google Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {

		var chromatic = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

		return {
			getNotes : function(start, end){
				var startOctave = parseInt(start.split(/(-?\d+)/)[1]);
				var startNote = start.split(/(-?\d+)/)[0];
				startNote = chromatic.indexOf(startNote);
				var endOctave = parseInt(end.split(/(-?\d+)/)[1]);
				var endNote = end.split(/(-?\d+)/)[0];
				endNote = chromatic.indexOf(endNote);

				var currentNote = startNote;
				var currentOctave = startOctave;

				var retNotes = [];

				while(!(currentNote === endNote && currentOctave === endOctave)){
					retNotes.push(chromatic[currentNote] + currentOctave);

					currentNote++;

					if (currentNote >= chromatic.length){
						currentNote = 0;
						currentOctave++;
					}
				}

				return retNotes;
			},
			/**
			 * Get the offset between the start note
			 * and the give note
			 */
			getDistanceBetween : function(start, note){
				var notes = this.getNotes(start, note);
				var dist = 0;
				for (var i = 0; i < notes.length; i++){
					var n = notes[i];
					if ((n[0] === "E" || n[0] === "B") && n[1] !== "#"){
						dist += 1;
					} else {
						dist += 0.5;
					}
				}
				return dist;
			}
		};
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(14);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/autoprefixer-loader/index.js!../node_modules/sass-loader/index.js!./piano.scss", function() {
				var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/autoprefixer-loader/index.js!../node_modules/sass-loader/index.js!./piano.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "#Piano {\n  position: relative;\n  width: 100%;\n  min-width: 300px;\n  max-width: 400px;\n  height: 120px; }\n", ""]);

	// exports


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var Note = __webpack_require__(16);
	var Interval = __webpack_require__(24);
	var Chord = __webpack_require__(26);
	var Scale = __webpack_require__(28);

	// never thought I would write this, but: Legacy support
	function intervalConstructor(from, to) {
	  // Construct a Interval object from string representation
	  if (typeof from === 'string')
	    return Interval.toCoord(from);

	  if (typeof to === 'string' && from instanceof Note)
	    return Interval.from(from, Interval.toCoord(to));

	  if (to instanceof Interval && from instanceof Note)
	    return Interval.from(from, to);

	  if (to instanceof Note && from instanceof Note)
	    return Interval.between(from, to);

	  throw new Error('Invalid parameters');
	}

	intervalConstructor.toCoord = Interval.toCoord;
	intervalConstructor.from = Interval.from;
	intervalConstructor.between = Interval.between;
	intervalConstructor.invert = Interval.invert;

	function noteConstructor(name, duration) {
	  if (typeof name === 'string')
	    return Note.fromString(name, duration);
	  else
	    return new Note(name, duration);
	}

	noteConstructor.fromString = Note.fromString;
	noteConstructor.fromKey = Note.fromKey;
	noteConstructor.fromFrequency = Note.fromFrequency;
	noteConstructor.fromMIDI = Note.fromMIDI;

	function chordConstructor(name, symbol) {
	  if (typeof name === 'string') {
	    var root, octave;
	    root = name.match(/^([a-h])(x|#|bb|b?)/i);
	    if (root && root[0]) {
	      octave = typeof symbol === 'number' ? symbol.toString(10) : '4';
	      return new Chord(Note.fromString(root[0].toLowerCase() + octave),
	                            name.substr(root[0].length));
	    }
	  } else if (name instanceof Note)
	    return new Chord(name, symbol);

	  throw new Error('Invalid Chord. Couldn\'t find note name');
	}

	function scaleConstructor(tonic, scale) {
	  tonic = (tonic instanceof Note) ? tonic : teoria.note(tonic);
	  return new Scale(tonic, scale);
	}

	var teoria = {
	  note: noteConstructor,

	  chord: chordConstructor,

	  interval: intervalConstructor,

	  scale: scaleConstructor,

	  Note: Note,
	  Chord: Chord,
	  Scale: Scale,
	  Interval: Interval
	};

	__webpack_require__(29)(teoria);
	exports = module.exports = teoria;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var scientific = __webpack_require__(17);
	var helmholtz = __webpack_require__(20);
	var pitchFq = __webpack_require__(21);
	var knowledge = __webpack_require__(22);
	var vector = __webpack_require__(23);
	var Interval = __webpack_require__(24);

	function pad(str, ch, len) {
	  for (; len > 0; len--) {
	    str += ch;
	  }

	  return str;
	}


	function Note(coord, duration) {
	  if (!(this instanceof Note)) return new Note(coord, duration);
	  duration = duration || {};

	  this.duration = { value: duration.value || 4, dots: duration.dots || 0 };
	  this.coord = coord;
	}

	Note.prototype = {
	  octave: function() {
	    return this.coord[0] + knowledge.A4[0] - knowledge.notes[this.name()][0] +
	      this.accidentalValue() * 4;
	  },

	  name: function() {
	    return knowledge.fifths[this.coord[1] + knowledge.A4[1] - this.accidentalValue() * 7 + 1];
	  },

	  accidentalValue: function() {
	    return Math.round((this.coord[1] + knowledge.A4[1] - 2) / 7);
	  },

	  accidental: function() {
	    return knowledge.accidentals[this.accidentalValue() + 2];
	  },

	  /**
	   * Returns the key number of the note
	   */
	  key: function(white) {
	    if (white)
	      return this.coord[0] * 7 + this.coord[1] * 4 + 29;
	    else
	      return this.coord[0] * 12 + this.coord[1] * 7 + 49;
	  },

	  /**
	  * Returns a number ranging from 0-127 representing a MIDI note value
	  */
	  midi: function() {
	    return this.key() + 20;
	  },

	  /**
	   * Calculates and returns the frequency of the note.
	   * Optional concert pitch (def. 440)
	   */
	  fq: function(concertPitch) {
	    return pitchFq(this.coord, concertPitch)
	  },

	  /**
	   * Returns the pitch class index (chroma) of the note
	   */
	  chroma: function() {
	    var value = (vector.sum(vector.mul(this.coord, [12, 7])) - 3) % 12;

	    return (value < 0) ? value + 12 : value;
	  },

	  interval: function(interval) {
	    if (typeof interval === 'string') interval = Interval.toCoord(interval);

	    if (interval instanceof Interval)
	      return new Note(vector.add(this.coord, interval.coord));
	    else if (interval instanceof Note)
	      return new Interval(vector.sub(interval.coord, this.coord));
	  },

	  transpose: function(interval) {
	    this.coord = vector.add(this.coord, interval.coord);
	    return this;
	  },

	  /**
	   * Returns the Helmholtz notation form of the note (fx C,, d' F# g#'')
	   */
	  helmholtz: function() {
	    var octave = this.octave();
	    var name = this.name();
	    name = octave < 3 ? name.toUpperCase() : name.toLowerCase();
	    var padchar = octave < 3 ? ',' : '\'';
	    var padcount = octave < 2 ? 2 - octave : octave - 3;

	    return pad(name + this.accidental(), padchar, padcount);
	  },

	  /**
	   * Returns the scientific notation form of the note (fx E4, Bb3, C#7 etc.)
	   */
	  scientific: function() {
	    return this.name().toUpperCase() + this.accidental() + this.octave();
	  },

	  /**
	   * Returns notes that are enharmonic with this note.
	   */
	  enharmonics: function(oneaccidental) {
	    var key = this.key(), limit = oneaccidental ? 2 : 3;

	    return ['m3', 'm2', 'm-2', 'm-3']
	      .map(this.interval.bind(this))
	      .filter(function(note) {
	      var acc = note.accidentalValue();
	      var diff = key - (note.key() - acc);

	      if (diff < limit && diff > -limit) {
	        note.coord = vector.add(note.coord, vector.mul(knowledge.sharp, diff - acc));
	        return true;
	      }
	    });
	  },

	  solfege: function(scale, showOctaves) {
	    var interval = scale.tonic.interval(this), solfege, stroke, count;
	    if (interval.direction() === 'down')
	      interval = interval.invert();

	    if (showOctaves) {
	      count = (this.key(true) - scale.tonic.key(true)) / 7;
	      count = (count >= 0) ? Math.floor(count) : -(Math.ceil(-count));
	      stroke = (count >= 0) ? '\'' : ',';
	    }

	    solfege = knowledge.intervalSolfege[interval.simple(true).toString()];
	    return (showOctaves) ? pad(solfege, stroke, Math.abs(count)) : solfege;
	  },

	  scaleDegree: function(scale) {
	    var inter = scale.tonic.interval(this);

	    // If the direction is down, or we're dealing with an octave - invert it
	    if (inter.direction() === 'down' ||
	       (inter.coord[1] === 0 && inter.coord[0] !== 0)) {
	      inter = inter.invert();
	    }

	    inter = inter.simple(true).coord;

	    return scale.scale.reduce(function(index, current, i) {
	      var coord = Interval.toCoord(current).coord;
	      return coord[0] === inter[0] && coord[1] === inter[1] ? i + 1 : index;
	    }, 0);
	  },

	  /**
	   * Returns the name of the duration value,
	   * such as 'whole', 'quarter', 'sixteenth' etc.
	   */
	  durationName: function() {
	    return knowledge.durations[this.duration.value];
	  },

	  /**
	   * Returns the duration of the note (including dots)
	   * in seconds. The first argument is the tempo in beats
	   * per minute, the second is the beat unit (i.e. the
	   * lower numeral in a time signature).
	   */
	  durationInSeconds: function(bpm, beatUnit) {
	    var secs = (60 / bpm) / (this.duration.value / 4) / (beatUnit / 4);
	    return secs * 2 - secs / Math.pow(2, this.duration.dots);
	  },

	  /**
	   * Returns the name of the note, with an optional display of octave number
	   */
	  toString: function(dont) {
	    return this.name() + this.accidental() + (dont ? '' : this.octave());
	  }
	};

	Note.fromString = function(name, dur) {
	  var coord = scientific(name);
	  if (!coord) coord = helmholtz(name);
	  return new Note(coord, dur);
	}

	Note.fromKey = function(key) {
	  var octave = Math.floor((key - 4) / 12);
	  var distance = key - (octave * 12) - 4;
	  var name = knowledge.fifths[(2 * Math.round(distance / 2) + 1) % 7];
	  var note = vector.add(vector.sub(knowledge.notes[name], knowledge.A4), [octave + 1, 0]);
	  var diff = (key - 49) - vector.sum(vector.mul(note, [12, 7]));

	  return new Note(diff ? vector.add(note, vector.mul(knowledge.sharp, diff)) : note);
	}

	Note.fromFrequency = function(fq, concertPitch) {
	  var key, cents, originalFq;
	  concertPitch = concertPitch || 440;

	  key = 49 + 12 * ((Math.log(fq) - Math.log(concertPitch)) / Math.log(2));
	  key = Math.round(key);
	  originalFq = concertPitch * Math.pow(2, (key - 49) / 12);
	  cents = 1200 * (Math.log(fq / originalFq) / Math.log(2));

	  return { note: Note.fromKey(key), cents: cents };
	}

	Note.fromMIDI = function(note) {
	  return Note.fromKey(note - 20);
	}

	module.exports = Note;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var coords = __webpack_require__(18);
	var accval = __webpack_require__(19);

	module.exports = function scientific(name) {
	  var format = /^([a-h])(x|#|bb|b?)(-?\d*)/i;

	  var parser = name.match(format);
	  if (!(parser && name === parser[0] && parser[3].length)) return;

	  var noteName = parser[1];
	  var octave = +parser[3];
	  var accidental = parser[2].length ? parser[2].toLowerCase() : '';

	  var accidentalValue = accval.interval(accidental);
	  var coord = coords(noteName.toLowerCase());

	  coord[0] += octave;
	  coord[0] += accidentalValue[0] - coords.A4[0];
	  coord[1] += accidentalValue[1] - coords.A4[1];

	  return coord;
	};


/***/ },
/* 18 */
/***/ function(module, exports) {

	// First coord is octaves, second is fifths. Distances are relative to c
	var notes = {
	  c: [0, 0],
	  d: [-1, 2],
	  e: [-2, 4],
	  f: [1, -1],
	  g: [0, 1],
	  a: [-1, 3],
	  b: [-2, 5],
	  h: [-2, 5]
	};

	module.exports = function(name) {
	  return name in notes ? [notes[name][0], notes[name][1]] : null;
	};

	module.exports.notes = notes;
	module.exports.A4 = [3, 3]; // Relative to C0 (scientic notation, ~16.35Hz)
	module.exports.sharp = [-4, 7];


/***/ },
/* 19 */
/***/ function(module, exports) {

	var accidentalValues = {
	  'bb': -2,
	  'b': -1,
	  '': 0,
	  '#': 1,
	  'x': 2
	};

	module.exports = function accidentalNumber(acc) {
	  return accidentalValues[acc];
	}

	module.exports.interval = function accidentalInterval(acc) {
	  var val = accidentalValues[acc];
	  return [-4 * val, 7 * val];
	}


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var coords = __webpack_require__(18);
	var accval = __webpack_require__(19);

	module.exports = function helmholtz(name) {
	  var name = name.replace(/\u2032/g, "'").replace(/\u0375/g, ',');
	  var parts = name.match(/^(,*)([a-h])(x|#|bb|b?)([,\']*)$/i);

	  if (!parts || name !== parts[0])
	    throw new Error('Invalid formatting');

	  var note = parts[2];
	  var octaveFirst = parts[1];
	  var octaveLast = parts[4];
	  var lower = note === note.toLowerCase();
	  var octave;

	  if (octaveFirst) {
	    if (lower)
	      throw new Error('Invalid formatting - found commas before lowercase note');

	    octave = 2 - octaveFirst.length;
	  } else if (octaveLast) {
	    if (octaveLast.match(/^'+$/) && lower)
	      octave = 3 + octaveLast.length;
	    else if (octaveLast.match(/^,+$/) && !lower)
	      octave = 2 - octaveLast.length;
	    else
	      throw new Error('Invalid formatting - mismatch between octave ' +
	        'indicator and letter case')
	  } else
	    octave = lower ? 3 : 2;

	  var accidentalValue = accval.interval(parts[3].toLowerCase());
	  var coord = coords(note.toLowerCase());

	  coord[0] += octave;
	  coord[0] += accidentalValue[0] - coords.A4[0];
	  coord[1] += accidentalValue[1] - coords.A4[1];

	  return coord;
	};


/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = function(coord, stdPitch) {
	  if (typeof coord === 'number') {
	    stdPitch = coord;
	    return function(coord) {
	      return stdPitch * Math.pow(2, (coord[0] * 12 + coord[1] * 7) / 12);
	    }
	  }

	  stdPitch = stdPitch || 440;
	  return stdPitch * Math.pow(2, (coord[0] * 12 + coord[1] * 7) / 12);
	}


/***/ },
/* 22 */
/***/ function(module, exports) {

	// Note coordinates [octave, fifth] relative to C
	module.exports = {
	  notes: {
	    c: [0, 0],
	    d: [-1, 2],
	    e: [-2, 4],
	    f: [1, -1],
	    g: [0, 1],
	    a: [-1, 3],
	    b: [-2, 5],
	    h: [-2, 5]
	  },

	  intervals: {
	    unison: [0, 0],
	    second: [3, -5],
	    third: [2, -3],
	    fourth: [1, -1],
	    fifth: [0, 1],
	    sixth: [3, -4],
	    seventh: [2, -2],
	    octave: [1, 0]
	  },

	  intervalFromFifth: ['second', 'sixth', 'third', 'seventh', 'fourth',
	                         'unison', 'fifth'],

	  intervalsIndex: ['unison', 'second', 'third', 'fourth', 'fifth',
	                      'sixth', 'seventh', 'octave', 'ninth', 'tenth',
	                      'eleventh', 'twelfth', 'thirteenth', 'fourteenth',
	                      'fifteenth'],

	// linaer index to fifth = (2 * index + 1) % 7
	  fifths: ['f', 'c', 'g', 'd', 'a', 'e', 'b'],
	  accidentals: ['bb', 'b', '', '#', 'x'],

	  sharp: [-4, 7],
	  A4: [3, 3],

	  durations: {
	    '0.25': 'longa',
	    '0.5': 'breve',
	    '1': 'whole',
	    '2': 'half',
	    '4': 'quarter',
	    '8': 'eighth',
	    '16': 'sixteenth',
	    '32': 'thirty-second',
	    '64': 'sixty-fourth',
	    '128': 'hundred-twenty-eighth'
	  },

	  qualityLong: {
	    P: 'perfect',
	    M: 'major',
	    m: 'minor',
	    A: 'augmented',
	    AA: 'doubly augmented',
	    d: 'diminished',
	    dd: 'doubly diminished'
	  },

	  alterations: {
	    perfect: ['dd', 'd', 'P', 'A', 'AA'],
	    minor: ['dd', 'd', 'm', 'M', 'A', 'AA']
	  },

	  symbols: {
	    'min': ['m3', 'P5'],
	    'm': ['m3', 'P5'],
	    '-': ['m3', 'P5'],

	    'M': ['M3', 'P5'],
	    '': ['M3', 'P5'],

	    '+': ['M3', 'A5'],
	    'aug': ['M3', 'A5'],

	    'dim': ['m3', 'd5'],
	    'o': ['m3', 'd5'],

	    'maj': ['M3', 'P5', 'M7'],
	    'dom': ['M3', 'P5', 'm7'],
	    'ø': ['m3', 'd5', 'm7'],

	    '5': ['P5']
	  },

	  chordShort: {
	    'major': 'M',
	    'minor': 'm',
	    'augmented': 'aug',
	    'diminished': 'dim',
	    'half-diminished': '7b5',
	    'power': '5',
	    'dominant': '7'
	  },

	  stepNumber: {
	    'unison': 1,
	    'first': 1,
	    'second': 2,
	    'third': 3,
	    'fourth': 4,
	    'fifth': 5,
	    'sixth': 6,
	    'seventh': 7,
	    'octave': 8,
	    'ninth': 9,
	    'eleventh': 11,
	    'thirteenth': 13
	  },

	  // Adjusted Shearer syllables - Chromatic solfege system
	  // Some intervals are not provided for. These include:
	  // dd2 - Doubly diminished second
	  // dd3 - Doubly diminished third
	  // AA3 - Doubly augmented third
	  // dd6 - Doubly diminished sixth
	  // dd7 - Doubly diminished seventh
	  // AA7 - Doubly augmented seventh
	  intervalSolfege: {
	    'dd1': 'daw',
	    'd1': 'de',
	    'P1': 'do',
	    'A1': 'di',
	    'AA1': 'dai',
	    'd2': 'raw',
	    'm2': 'ra',
	    'M2': 're',
	    'A2': 'ri',
	    'AA2': 'rai',
	    'd3': 'maw',
	    'm3': 'me',
	    'M3': 'mi',
	    'A3': 'mai',
	    'dd4': 'faw',
	    'd4': 'fe',
	    'P4': 'fa',
	    'A4': 'fi',
	    'AA4': 'fai',
	    'dd5': 'saw',
	    'd5': 'se',
	    'P5': 'so',
	    'A5': 'si',
	    'AA5': 'sai',
	    'd6': 'law',
	    'm6': 'le',
	    'M6': 'la',
	    'A6': 'li',
	    'AA6': 'lai',
	    'd7': 'taw',
	    'm7': 'te',
	    'M7': 'ti',
	    'A7': 'tai',
	    'dd8': 'daw',
	    'd8': 'de',
	    'P8': 'do',
	    'A8': 'di',
	    'AA8': 'dai'
	  }
	}


/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = {
	  add: function(note, interval) {
	    return [note[0] + interval[0], note[1] + interval[1]];
	  },

	  sub: function(note, interval) {
	    return [note[0] - interval[0], note[1] - interval[1]];
	  },

	  mul: function(note, interval) {
	    if (typeof interval === 'number')
	      return [note[0] * interval, note[1] * interval];
	    else
	      return [note[0] * interval[0], note[1] * interval[1]];
	  },

	  sum: function(coord) {
	    return coord[0] + coord[1];
	  }
	}


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var knowledge = __webpack_require__(22);
	var vector = __webpack_require__(23);
	var toCoord = __webpack_require__(25);

	function Interval(coord) {
	  if (!(this instanceof Interval)) return new Interval(coord);
	  this.coord = coord;
	}

	Interval.prototype = {
	  name: function() {
	    return knowledge.intervalsIndex[this.number() - 1];
	  },

	  semitones: function() {
	    return vector.sum(vector.mul(this.coord, [12, 7]));
	  },

	  number: function() {
	    return Math.abs(this.value());
	  },

	  value: function() {
	    var without = vector.sub(this.coord,
	      vector.mul(knowledge.sharp, Math.floor((this.coord[1] - 2) / 7) + 1))
	      , i, val;

	    i = knowledge.intervalFromFifth[without[1] + 5];
	    val = knowledge.stepNumber[i] + (without[0] - knowledge.intervals[i][0]) * 7;

	    return (val > 0) ? val : val - 2;
	  },

	  type: function() {
	    return knowledge.intervals[this.base()][0] <= 1 ? 'perfect' : 'minor';
	  },

	  base: function() {
	    var fifth = vector.sub(this.coord, vector.mul(knowledge.sharp, this.qualityValue()))[1], name;
	    fifth = this.value() > 0 ? fifth + 5 : -(fifth - 5) % 7;
	    fifth = fifth < 0 ? knowledge.intervalFromFifth.length + fifth : fifth;

	    name = knowledge.intervalFromFifth[fifth];
	    if (name === 'unison' && this.number() >= 8)
	      name = 'octave';

	    return name;
	  },

	  direction: function(dir) {
	    if (dir) {
	      var is = this.value() >= 1 ? 'up' : 'down';
	      if (is !== dir)
	        this.coord = vector.mul(this.coord, -1);

	      return this;
	    }
	    else
	      return this.value() >= 1 ? 'up' : 'down';
	  },

	  simple: function(ignore) {
	    // Get the (upwards) base interval (with quality)
	    var simple = knowledge.intervals[this.base()];
	    simple = vector.add(simple, vector.mul(knowledge.sharp, this.qualityValue()));

	    // Turn it around if necessary
	    if (!ignore)
	      simple = this.direction() === 'down' ? vector.mul(simple, -1) : simple;

	    return new Interval(simple);
	  },

	  isCompound: function() {
	    return this.number() > 8;
	  },

	  octaves: function() {
	    var without, octaves;

	    if (this.direction() === 'up') {
	      without = vector.sub(this.coord, vector.mul(knowledge.sharp, this.qualityValue()));
	      octaves = without[0] - knowledge.intervals[this.base()][0];
	    } else {
	      without = vector.sub(this.coord, vector.mul(knowledge.sharp, -this.qualityValue()));
	      octaves = -(without[0] + knowledge.intervals[this.base()][0]);
	    }

	    return octaves;
	  },

	  invert: function() {
	    var i = this.base();
	    var qual = this.qualityValue();
	    var acc = this.type() === 'minor' ? -(qual - 1) : -qual;
	    var coord = knowledge.intervals[knowledge.intervalsIndex[9 - knowledge.stepNumber[i] - 1]];
	    coord = vector.add(coord, vector.mul(knowledge.sharp, acc));

	    return new Interval(coord);
	  },

	  quality: function(lng) {
	    var quality = knowledge.alterations[this.type()][this.qualityValue() + 2];

	    return lng ? knowledge.qualityLong[quality] : quality;
	  },

	  qualityValue: function() {
	    if (this.direction() === 'down')
	      return Math.floor((-this.coord[1] - 2) / 7) + 1;
	    else
	      return Math.floor((this.coord[1] - 2) / 7) + 1;
	  },

	  equal: function(interval) {
	      return this.coord[0] === interval.coord[0] &&
	          this.coord[1] === interval.coord[1];
	  },

	  greater: function(interval) {
	    var semi = this.semitones();
	    var isemi = interval.semitones();

	    // If equal in absolute size, measure which interval is bigger
	    // For example P4 is bigger than A3
	    return (semi === isemi) ?
	      (this.number() > interval.number()) : (semi > isemi);
	  },

	  smaller: function(interval) {
	    return !this.equal(interval) && !this.greater(interval);
	  },

	  add: function(interval) {
	    return new Interval(vector.add(this.coord, interval.coord));
	  },

	  toString: function(ignore) {
	    // If given true, return the positive value
	    var number = ignore ? this.number() : this.value();

	    return this.quality() + number;
	  }
	}

	Interval.toCoord = function(simple) {
	  var coord = toCoord(simple);
	  if (!coord)
	    throw new Error('Invalid simple format interval');

	  return new Interval(coord);
	}

	Interval.from = function(from, to) {
	  return from.interval(to);
	}

	Interval.between = function(from, to) {
	  return new Interval(vector.sub(to.coord, from.coord));
	}

	Interval.invert = function(sInterval) {
	  return Interval.toCoord(sInterval).invert().toString();
	}

	module.exports = Interval;


/***/ },
/* 25 */
/***/ function(module, exports) {

	var pattern = /^(AA|A|P|M|m|d|dd)(-?\d+)$/;

	// The interval it takes to raise a note a semitone
	var sharp = [-4, 7];

	var pAlts = ['dd', 'd', 'P', 'A', 'AA'];
	var mAlts = ['dd', 'd', 'm', 'M', 'A', 'AA'];

	var baseIntervals = [
	  [0, 0],
	  [3, -5],
	  [2, -3],
	  [1, -1],
	  [0, 1],
	  [3, -4],
	  [2, -2],
	  [1, 0]
	];

	module.exports = function(simple) {
	  var parser = simple.match(pattern);
	  if (!parser) return null;

	  var quality = parser[1];
	  var number = +parser[2];
	  var sign = number < 0 ? -1 : 1;

	  number = sign < 0 ? -number : number;

	  var lower = number > 8 ? (number % 7 || 7) : number;
	  var octaves = (number - lower) / 7;

	  var base = baseIntervals[lower - 1];
	  var alts = base[0] <= 1 ? pAlts : mAlts;
	  var alt = alts.indexOf(quality) - 2;

	  // this happens, if the alteration wasn't suitable for this type
	  // of interval, such as P2 or M5 (no "perfect second" or "major fifth")
	  if (alt === -3) return null;

	  return [
	    sign * (base[0] + octaves + sharp[0] * alt),
	    sign * (base[1] + sharp[1] * alt)
	  ];
	}

	// Copy to avoid overwriting internal base intervals
	module.exports.coords = baseIntervals.slice(0);


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var daccord = __webpack_require__(27);
	var knowledge = __webpack_require__(22);
	var Note = __webpack_require__(16);
	var Interval = __webpack_require__(24);

	function Chord(root, name) {
	  if (!(this instanceof Chord)) return new Chord(root, name);
	  name = name || '';
	  this.name = root.name().toUpperCase() + root.accidental() + name;
	  this.symbol = name;
	  this.root = root;
	  this.intervals = [];
	  this._voicing = [];

	  var bass = name.split('/');
	  if (bass.length === 2 && bass[1].trim() !== '9') {
	    name = bass[0];
	    bass = bass[1].trim();
	  } else {
	    bass = null;
	  }

	  this.intervals = daccord(name).map(Interval.toCoord)
	  this._voicing = this.intervals.slice();

	  if (bass) {
	    var intervals = this.intervals, bassInterval, note;
	    // Make sure the bass is atop of the root note
	    note = Note.fromString(bass + (root.octave() + 1)); // crude

	    bassInterval = Interval.between(root, note);
	    bass = bassInterval.simple();
	    bassInterval = bassInterval.invert().direction('down');

	    this._voicing = [bassInterval];
	    for (var i = 0, length = intervals.length;  i < length; i++) {
	      if (!intervals[i].simple().equal(bass))
	        this._voicing.push(intervals[i]);
	    }
	  }
	}

	Chord.prototype = {
	  notes: function() {
	    var root = this.root;
	    return this.voicing().map(function(interval) {
	      return root.interval(interval);
	    });
	  },

	  simple: function() {
	    return this.notes().map(function(n) { return n.toString(true); });
	  },

	  bass: function() {
	    return this.root.interval(this._voicing[0]);
	  },

	  voicing: function(voicing) {
	    // Get the voicing
	    if (!voicing) {
	      return this._voicing;
	    }

	    // Set the voicing
	    this._voicing = [];
	    for (var i = 0, length = voicing.length; i < length; i++) {
	      this._voicing[i] = Interval.toCoord(voicing[i]);
	    }

	    return this;
	  },

	  resetVoicing: function() {
	    this._voicing = this.intervals;
	  },

	  dominant: function(additional) {
	    additional = additional || '';
	    return new Chord(this.root.interval('P5'), additional);
	  },

	  subdominant: function(additional) {
	    additional = additional || '';
	    return new Chord(this.root.interval('P4'), additional);
	  },

	  parallel: function(additional) {
	    additional = additional || '';
	    var quality = this.quality();

	    if (this.chordType() !== 'triad' || quality === 'diminished' ||
	        quality === 'augmented') {
	      throw new Error('Only major/minor triads have parallel chords');
	    }

	    if (quality === 'major') {
	      return new Chord(this.root.interval('m3', 'down'), 'm');
	    } else {
	      return new Chord(this.root.interval('m3', 'up'));
	    }
	  },

	  quality: function() {
	    var third, fifth, seventh, intervals = this.intervals;

	    for (var i = 0, length = intervals.length; i < length; i++) {
	      if (intervals[i].number() === 3) {
	        third = intervals[i];
	      } else if (intervals[i].number() === 5) {
	        fifth = intervals[i];
	      } else if (intervals[i].number() === 7) {
	        seventh = intervals[i];
	      }
	    }

	    if (!third) {
	      return;
	    }

	    third = (third.direction() === 'down') ? third.invert() : third;
	    third = third.simple().toString();

	    if (fifth) {
	      fifth = (fifth.direction === 'down') ? fifth.invert() : fifth;
	      fifth = fifth.simple().toString();
	    }

	    if (seventh) {
	      seventh = (seventh.direction === 'down') ? seventh.invert() : seventh;
	      seventh = seventh.simple().toString();
	    }

	    if (third === 'M3') {
	      if (fifth === 'A5') {
	        return 'augmented';
	      } else if (fifth === 'P5') {
	        return (seventh === 'm7') ? 'dominant' : 'major';
	      }

	      return 'major';
	    } else if (third === 'm3') {
	      if (fifth === 'P5') {
	        return 'minor';
	      } else if (fifth === 'd5') {
	        return (seventh === 'm7') ? 'half-diminished' : 'diminished';
	      }

	      return 'minor';
	    }
	  },

	  chordType: function() { // In need of better name
	    var length = this.intervals.length, interval, has, invert, i, name;

	    if (length === 2) {
	      return 'dyad';
	    } else if (length === 3) {
	      has = {first: false, third: false, fifth: false};
	      for (i = 0; i < length; i++) {
	        interval = this.intervals[i];
	        invert = interval.invert();
	        if (interval.base() in has) {
	          has[interval.base()] = true;
	        } else if (invert.base() in has) {
	          has[invert.base()] = true;
	        }
	      }

	      name = (has.first && has.third && has.fifth) ? 'triad' : 'trichord';
	    } else if (length === 4) {
	      has = {first: false, third: false, fifth: false, seventh: false};
	      for (i = 0; i < length; i++) {
	        interval = this.intervals[i];
	        invert = interval.invert();
	        if (interval.base() in has) {
	          has[interval.base()] = true;
	        } else if (invert.base() in has) {
	          has[invert.base()] = true;
	        }
	      }

	      if (has.first && has.third && has.fifth && has.seventh) {
	        name = 'tetrad';
	      }
	    }

	    return name || 'unknown';
	  },

	  get: function(interval) {
	    if (typeof interval === 'string' && interval in knowledge.stepNumber) {
	      var intervals = this.intervals, i, length;

	      interval = knowledge.stepNumber[interval];
	      for (i = 0, length = intervals.length; i < length; i++) {
	        if (intervals[i].number() === interval) {
	          return this.root.interval(intervals[i]);
	        }
	      }

	      return null;
	    } else {
	      throw new Error('Invalid interval name');
	    }
	  },

	  interval: function(interval) {
	    return new Chord(this.root.interval(interval), this.symbol);
	  },

	  transpose: function(interval) {
	    this.root.transpose(interval);
	    this.name = this.root.name().toUpperCase() +
	                this.root.accidental() + this.symbol;

	    return this;
	  },

	  toString: function() {
	    return this.name;
	  }
	};

	module.exports = Chord;


/***/ },
/* 27 */
/***/ function(module, exports) {

	var SYMBOLS = {
	  'm': ['m3', 'P5'],
	  'mi': ['m3', 'P5'],
	  'min': ['m3', 'P5'],
	  '-': ['m3', 'P5'],

	  'M': ['M3', 'P5'],
	  'ma': ['M3', 'P5'],
	  '': ['M3', 'P5'],

	  '+': ['M3', 'A5'],
	  'aug': ['M3', 'A5'],

	  'dim': ['m3', 'd5'],
	  'o': ['m3', 'd5'],

	  'maj': ['M3', 'P5', 'M7'],
	  'dom': ['M3', 'P5', 'm7'],
	  'ø': ['m3', 'd5', 'm7'],

	  '5': ['P5'],

	  '6/9': ['M3', 'P5', 'M6', 'M9']
	};

	module.exports = function(symbol) {
	  var c, parsing = 'quality', additionals = [], name, chordLength = 2
	  var notes = ['P1', 'M3', 'P5', 'm7', 'M9', 'P11', 'M13'];
	  var explicitMajor = false;

	  function setChord(name) {
	    var intervals = SYMBOLS[name];
	    for (var i = 0, len = intervals.length; i < len; i++) {
	      notes[i + 1] = intervals[i];
	    }

	    chordLength = intervals.length;
	  }

	  // Remove whitespace, commas and parentheses
	  symbol = symbol.replace(/[,\s\(\)]/g, '');
	  for (var i = 0, len = symbol.length; i < len; i++) {
	    if (!(c = symbol[i]))
	      return;

	    if (parsing === 'quality') {
	      var sub3 = (i + 2) < len ? symbol.substr(i, 3).toLowerCase() : null;
	      var sub2 = (i + 1) < len ? symbol.substr(i, 2).toLowerCase() : null;
	      if (sub3 in SYMBOLS)
	        name = sub3;
	      else if (sub2 in SYMBOLS)
	        name = sub2;
	      else if (c in SYMBOLS)
	        name = c;
	      else
	        name = '';

	      if (name)
	        setChord(name);

	      if (name === 'M' || name === 'ma' || name === 'maj')
	        explicitMajor = true;


	      i += name.length - 1;
	      parsing = 'extension';
	    } else if (parsing === 'extension') {
	      c = (c === '1' && symbol[i + 1]) ? +symbol.substr(i, 2) : +c;

	      if (!isNaN(c) && c !== 6) {
	        chordLength = (c - 1) / 2;

	        if (chordLength !== Math.round(chordLength))
	          return new Error('Invalid interval extension: ' + c.toString(10));

	        if (name === 'o' || name === 'dim')
	          notes[3] = 'd7';
	        else if (explicitMajor)
	          notes[3] = 'M7';

	        i += c >= 10 ? 1 : 0;
	      } else if (c === 6) {
	        notes[3] = 'M6';
	        chordLength = Math.max(3, chordLength);
	      } else
	        i -= 1;

	      parsing = 'alterations';
	    } else if (parsing === 'alterations') {
	      var alterations = symbol.substr(i).split(/(#|b|add|maj|sus|M)/i),
	          next, flat = false, sharp = false;

	      if (alterations.length === 1)
	        return new Error('Invalid alteration');
	      else if (alterations[0].length !== 0)
	        return new Error('Invalid token: \'' + alterations[0] + '\'');

	      var ignore = false;
	      alterations.forEach(function(alt, i, arr) {
	        if (ignore || !alt.length)
	          return ignore = false;

	        var next = arr[i + 1], lower = alt.toLowerCase();
	        if (alt === 'M' || lower === 'maj') {
	          if (next === '7')
	            ignore = true;

	          chordLength = Math.max(3, chordLength);
	          notes[3] = 'M7';
	        } else if (lower === 'sus') {
	          var type = 'P4';
	          if (next === '2' || next === '4') {
	            ignore = true;

	            if (next === '2')
	              type = 'M2';
	          }

	          notes[1] = type; // Replace third with M2 or P4
	        } else if (lower === 'add') {
	          if (next === '9')
	            additionals.push('M9');
	          else if (next === '11')
	            additionals.push('P11');
	          else if (next === '13')
	            additionals.push('M13');

	          ignore = true
	        } else if (lower === 'b') {
	          flat = true;
	        } else if (lower === '#') {
	          sharp = true;
	        } else {
	          var token = +alt, quality, intPos;
	          if (isNaN(token) || String(token).length !== alt.length)
	            return new Error('Invalid token: \'' + alt + '\'');

	          if (token === 6) {
	            if (sharp)
	              notes[3] = 'A6';
	            else if (flat)
	              notes[3] = 'm6';
	            else
	              notes[3] = 'M6';

	            chordLength = Math.max(3, chordLength);
	            return;
	          }

	          // Calculate the position in the 'note' array
	          intPos = (token - 1) / 2;
	          if (chordLength < intPos)
	            chordLength = intPos;

	          if (token < 5 || token === 7 || intPos !== Math.round(intPos))
	            return new Error('Invalid interval alteration: ' + token);

	          quality = notes[intPos][0];

	          // Alterate the quality of the interval according the accidentals
	          if (sharp) {
	            if (quality === 'd')
	              quality = 'm';
	            else if (quality === 'm')
	              quality = 'M';
	            else if (quality === 'M' || quality === 'P')
	              quality = 'A';
	          } else if (flat) {
	            if (quality === 'A')
	              quality = 'M';
	            else if (quality === 'M')
	              quality = 'm';
	            else if (quality === 'm' || quality === 'P')
	              quality = 'd';
	          }

	          sharp = flat = false;
	          notes[intPos] = quality + token;
	        }
	      });
	      parsing = 'ended';
	    } else if (parsing === 'ended') {
	      break;
	    }
	  }

	  return notes.slice(0, chordLength + 1).concat(additionals);
	}


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var knowledge = __webpack_require__(22);
	var Interval = __webpack_require__(24);

	var scales = {
	  aeolian: ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'],
	  blues: ['P1', 'm3', 'P4', 'd5', 'P5', 'm7'],
	  chromatic: ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'A4', 'P5', 'm6', 'M6', 'm7', 'M7'],
	  dorian: ['P1', 'M2', 'm3', 'P4', 'P5', 'M6', 'm7'],
	  doubleharmonic: ['P1', 'm2', 'M3', 'P4', 'P5', 'm6', 'M7'],
	  harmonicminor: ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'M7'],
	  ionian: ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'],
	  locrian: ['P1', 'm2', 'm3', 'P4', 'd5', 'm6', 'm7'],
	  lydian: ['P1', 'M2', 'M3', 'A4', 'P5', 'M6', 'M7'],
	  majorpentatonic: ['P1', 'M2', 'M3', 'P5', 'M6'],
	  melodicminor: ['P1', 'M2', 'm3', 'P4', 'P5', 'M6', 'M7'],
	  minorpentatonic: ['P1', 'm3', 'P4', 'P5', 'm7'],
	  mixolydian: ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'm7'],
	  phrygian: ['P1', 'm2', 'm3', 'P4', 'P5', 'm6', 'm7'],
	  wholetone: ['P1', 'M2', 'M3', 'A4', 'A5', 'A6']
	}

	// synonyms
	scales.harmonicchromatic = scales.chromatic;
	scales.minor = scales.aeolian;
	scales.major = scales.ionian;
	scales.flamenco = scales.doubleharmonic;

	function Scale(tonic, scale) {
	  if (!(this instanceof Scale)) return new Scale(tonic, scale);
	  var scaleName, i;
	  if (!('coord' in tonic)) {
	    throw new Error('Invalid Tonic');
	  }

	  if (typeof scale === 'string') {
	    scaleName = scale;
	    scale = scales[scale];
	    if (!scale)
	      throw new Error('Invalid Scale');
	  } else {
	    for (i in scales) {
	      if (scales.hasOwnProperty(i)) {
	        if (scales[i].toString() === scale.toString()) {
	          scaleName = i;
	          break;
	        }
	      }
	    }
	  }

	  this.name = scaleName;
	  this.tonic = tonic;
	  this.scale = scale;
	}

	Scale.prototype = {
	  notes: function() {
	    var notes = [];

	    for (var i = 0, length = this.scale.length; i < length; i++) {
	      notes.push(this.tonic.interval(this.scale[i]));
	    }

	    return notes;
	  },

	  simple: function() {
	    return this.notes().map(function(n) { return n.toString(true); });
	  },

	  type: function() {
	    var length = this.scale.length - 2;
	    if (length < 8) {
	      return ['di', 'tri', 'tetra', 'penta', 'hexa', 'hepta', 'octa'][length] +
	        'tonic';
	    }
	  },

	  get: function(i) {
	    i = (typeof i === 'string' && i in knowledge.stepNumber) ? knowledge.stepNumber[i] : i;

	    return this.tonic.interval(this.scale[i - 1]);
	  },

	  solfege: function(index, showOctaves) {
	    if (index)
	      return this.get(index).solfege(this, showOctaves);

	    return this.notes().map(function(n) {
	      return n.solfege(this, showOctaves);
	    });
	  },

	  interval: function(interval) {
	    interval = (typeof interval === 'string') ?
	      Interval.toCoord(interval) : interval;
	    return new Scale(this.tonic.interval(interval), this.scale);
	  },

	  transpose: function(interval) {
	    var scale = this.interval(interval);
	    this.scale = scale.scale;
	    this.tonic = scale.tonic;

	    return this;
	  }
	};

	module.exports = Scale;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var knowledge = __webpack_require__(22);

	module.exports = function(teoria) {
	  var Note = teoria.Note;
	  var Chord = teoria.Chord;
	  var Scale = teoria.Scale;

	  Note.prototype.chord = function(chord) {
	    chord = (chord in knowledge.chordShort) ? knowledge.chordShort[chord] : chord;

	    return new Chord(this, chord);
	  }

	  Note.prototype.scale = function(scale) {
	    return new Scale(this, scale);
	  }
	}


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Copyright 2016 Google Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(32), __webpack_require__(35), __webpack_require__(48)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Sequence, Transport, Player) {

		var Arp = function(delayTime, lowestNote, highestNote){

			this.delayTime = delayTime;

			/**
			 * The notes to play
			 * @type {Array}
			 * @private
			 */
			this._notes = [];

			this.seq = new Sequence(this._tick.bind(this), [Infinity, 0, 1, 2], delayTime).start(0);
			this.seq.loop = false;

			this.player = new Player("https://gweb-musiclab-site.appspot.com/static/sound/piano", lowestNote, highestNote, 3);
		};

		Arp.prototype.stop = function(){
			Transport.stop();
		};

		Arp.prototype.play = function(notes){
			if (Transport.state === "started"){
				Transport.ticks = 0;
			}
			this._notes = notes;
			Transport.start();
		};

		Arp.prototype.load = function(cb){
			this.player.load();
			this.player.onload = cb;
		};

		Arp.prototype._tick = function(time, index){
			if (this._notes.length > index){
				if (this.player.loaded){
					this.player.triggerAttackRelease(this._notes[index], this.delayTime * 2.5, time);
				}
			}
		};

		return Arp;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(30), __webpack_require__(33), __webpack_require__(35)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tone) {

		"use strict";

		/**
		 *  @class A sequence is an alternate notation of a part. Instead
		 *         of passing in an array of [time, event] pairs, pass
		 *         in an array of events which will be spaced at the
		 *         given subdivision. Sub-arrays will subdivide that beat
		 *         by the number of items are in the array. 
		 *         Sequence notation inspiration from [Tidal](http://yaxu.org/tidal/)
		 *  @param  {Function}  callback  The callback to invoke with every note
		 *  @param  {Array}    events  The sequence
		 *  @param  {Time} subdivision  The subdivision between which events are placed. 
		 *  @extends {Tone.Part}
		 *  @example
		 * var seq = new Tone.Sequence(function(time, note){
		 * 	console.log(note);
		 * //straight quater notes
		 * }, ["C4", "E4", "G4", "A4"], "4n");
		 *  @example
		 * var seq = new Tone.Sequence(function(time, note){
		 * 	console.log(note);
		 * //subdivisions are given as subarrays
		 * }, ["C4", ["E4", "D4", "E4"], "G4", ["A4", "G4"]]);
		 */
		Tone.Sequence = function(){

			var options = this.optionsObject(arguments, ["callback", "events", "subdivision"], Tone.Sequence.defaults);

			//remove the events
			var events = options.events;
			delete options.events;

			Tone.Part.call(this, options);

			/**
			 *  The subdivison of each note
			 *  @type  {Ticks}
			 *  @private
			 */
			this._subdivision = this.toTicks(options.subdivision);

			//if no time was passed in, the loop end is the end of the cycle
			if (this.isUndef(options.loopEnd) && !this.isUndef(events)){
				this._loopEnd = (events.length * this._subdivision);
			} 
			//defaults to looping
			this._loop = true;

			//add all of the events
			if (!this.isUndef(events)){
				for (var i = 0; i < events.length; i++){
					this.add(i, events[i]);
				}
			}
		};

		Tone.extend(Tone.Sequence, Tone.Part);

		/**
		 *  The default values.
		 *  @type  {Object}
		 */
		Tone.Sequence.defaults = {
			"subdivision" : "4n",
		};

		/**
		 *  The subdivision of the sequence. This can only be 
		 *  set in the constructor. The subdivision is the 
		 *  interval between successive steps. 
		 *  @type {Time}
		 *  @memberOf Tone.Sequence#
		 *  @name subdivision
		 *  @readOnly
		 */
		Object.defineProperty(Tone.Sequence.prototype, "subdivision", {
			get : function(){
				return this.toNotation(this._subdivision + "i");
			}
		});

		/**
		 *  Get/Set an index of the sequence. If the index contains a subarray, 
		 *  a Tone.Sequence representing that sub-array will be returned. 
		 *  @example
		 * var sequence = new Tone.Sequence(playNote, ["E4", "C4", "F#4", ["A4", "Bb3"]])
		 * sequence.at(0)// => returns "E4"
		 * //set a value
		 * sequence.at(0, "G3");
		 * //get a nested sequence
		 * sequence.at(3).at(1)// => returns "Bb3"
		 * @param {Positive} index The index to get or set
		 * @param {*} value Optionally pass in the value to set at the given index.
		 */
		Tone.Sequence.prototype.at = function(index, value){
			//if the value is an array, 
			if (this.isArray(value)){
				//remove the current event at that index
				this.remove(index);
			}
			//call the parent's method
			return Tone.Part.prototype.at.call(this, this._indexTime(index), value);
		};

		/**
		 *  Add an event at an index, if there's already something
		 *  at that index, overwrite it. If `value` is an array, 
		 *  it will be parsed as a subsequence.
		 *  @param {Number} index The index to add the event to
		 *  @param {*} value The value to add at that index
		 *  @returns {Tone.Sequence} this
		 */
		Tone.Sequence.prototype.add = function(index, value){
			if (value === null){
				return this;
			}
			if (this.isArray(value)){
				//make a subsequence and add that to the sequence
				var subSubdivision = Math.round(this._subdivision / value.length) + "i";
				value = new Tone.Sequence(this._tick.bind(this), value, subSubdivision);
			} 
			Tone.Part.prototype.add.call(this, this._indexTime(index), value);
			return this;
		};

		/**
		 *  Remove a value from the sequence by index
		 *  @param {Number} index The index of the event to remove
		 *  @returns {Tone.Sequence} this
		 */
		Tone.Sequence.prototype.remove = function(index, value){
			Tone.Part.prototype.remove.call(this, this._indexTime(index), value);
			return this;
		};

		/**
		 *  Get the time of the index given the Sequence's subdivision
		 *  @param  {Number}  index 
		 *  @return  {Time}  The time of that index
		 *  @private
		 */
		Tone.Sequence.prototype._indexTime = function(index){
			if (this.isTicks(index)){
				return index;
			} else {
				return (index * this._subdivision + this.startOffset) + "i";
			}
		};

		/**
		 *  Clean up.
		 *  @return {Tone.Sequence} this
		 */
		Tone.Sequence.prototype.dispose = function(){
			Tone.Part.prototype.dispose.call(this);
			return this;
		};

		return Tone.Sequence;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(30), __webpack_require__(34), __webpack_require__(41), __webpack_require__(35)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tone) {

		"use strict";
		
		/**
		 *  @class Tone.Part is a collection Tone.Events which can be
		 *         started/stoped and looped as a single unit.
		 *
		 *  @extends {Tone.Event}
		 *  @param {Function} callback The callback to invoke on each event
		 *  @param {Array} events the array of events
		 *  @example
		 * var part = new Tone.Part(function(time, note){
		 * 	//the notes given as the second element in the array
		 * 	//will be passed in as the second argument
		 * 	synth.triggerAttackRelease(note, "8n", time);
		 * }, [[0, "C2"], ["0:2", "C3"], ["0:3:2", "G2"]]);
		 *  @example
		 * //use an array of objects as long as the object has a "time" attribute
		 * var part = new Tone.Part(function(time, value){
		 * 	//the value is an object which contains both the note and the velocity
		 * 	synth.triggerAttackRelease(value.note, "8n", time, value.velocity);
		 * }, [{"time" : 0, "note" : "C3", "velocity": 0.9}, 
		 * 	   {"time" : "0:2", "note" : "C4", "velocity": 0.5}
		 * ]).start(0);
		 */
		Tone.Part = function(){

			var options = this.optionsObject(arguments, ["callback", "events"], Tone.Part.defaults);

			/**
			 *  If the part is looping or not
			 *  @type  {Boolean|Positive}
			 *  @private
			 */
			this._loop = options.loop;

			/**
			 *  When the note is scheduled to start.
			 *  @type  {Ticks}
			 *  @private
			 */
			this._loopStart = this.toTicks(options.loopStart);

			/**
			 *  When the note is scheduled to start.
			 *  @type  {Ticks}
			 *  @private
			 */
			this._loopEnd = this.toTicks(options.loopEnd);

			/**
			 *  The playback rate of the part
			 *  @type  {Positive}
			 *  @private
			 */
			this._playbackRate = options.playbackRate;

			/**
			 *  private holder of probability value
			 *  @type {NormalRange}
			 *  @private
			 */
			this._probability = options.probability;

			/**
			 *  the amount of variation from the
			 *  given time. 
			 *  @type {Boolean|Time}
			 *  @private
			 */
			this._humanize = options.humanize;

			/**
			 *  The start offset
			 *  @type {Ticks}
			 *  @private
			 */
			this._startOffset = 0;

			/**
			 *  Keeps track of the current state
			 *  @type {Tone.TimelineState}
			 *  @private
			 */
			this._state = new Tone.TimelineState(Tone.State.Stopped);

			/**
			 *  An array of Objects. 
			 *  @type  {Array}
			 *  @private
			 */
			this._events = [];

			/**
			 *  The callback to invoke at all the scheduled events.
			 *  @type {Function}
			 */
			this.callback = options.callback;

			/**
			 *  If mute is true, the callback won't be
			 *  invoked.
			 *  @type {Boolean}
			 */
			this.mute = options.mute;

			//add the events
			var events = this.defaultArg(options.events, []);
			if (!this.isUndef(options.events)){
				for (var i = 0; i < events.length; i++){
					if (Array.isArray(events[i])){
						this.add(events[i][0], events[i][1]);
					} else {
						this.add(events[i]);
					}
				}
			}
		};

		Tone.extend(Tone.Part, Tone.Event);

		/**
		 *  The default values
		 *  @type  {Object}
		 *  @const
		 */
		Tone.Part.defaults = {
			"callback" : Tone.noOp,
			"loop" : false,
			"loopEnd" : "1m",
			"loopStart" : 0,
			"playbackRate" : 1,
			"probability" : 1,
			"humanize" : false,
			"mute" : false,
		};

		/**
		 *  Start the part at the given time. 
		 *  @param  {Time}  time    When to start the part.
		 *  @param  {Time=}  offset  The offset from the start of the part
		 *                           to begin playing at.
		 *  @return  {Tone.Part}  this
		 */
		Tone.Part.prototype.start = function(time, offset){
			var ticks = this.toTicks(time);
			if (this._state.getStateAtTime(ticks) !== Tone.State.Started){
				if (this._loop){
					offset = this.defaultArg(offset, this._loopStart);
				} else {
					offset = this.defaultArg(offset, 0);
				}
				offset = this.toTicks(offset);
				this._state.addEvent({
					"state" : Tone.State.Started, 
					"time" : ticks, 
					"offset" : offset
				});
				this._forEach(function(event){
					this._startNote(event, ticks, offset);
				});
			}
			return this;
		};

		/**
		 *  Start the event in the given event at the correct time given
		 *  the ticks and offset and looping.
		 *  @param  {Tone.Event}  event 
		 *  @param  {Ticks}  ticks
		 *  @param  {Ticks}  offset
		 *  @private
		 */
		Tone.Part.prototype._startNote = function(event, ticks, offset){
			ticks -= offset;
			if (this._loop){
				if (event.startOffset >= this._loopStart && event.startOffset < this._loopEnd){
					if (event.startOffset < offset){
						//start it on the next loop
						ticks += this._getLoopDuration();
					}
					event.start(ticks + "i");
				} else if (event.startOffset < this._loopStart && event.startOffset >= offset) {
					event.loop = false;
					event.start(ticks + "i");
				}
			} else {
				if (event.startOffset >= offset){
					event.start(ticks + "i");
				}
			}
		};

		/**
		 *  The start from the scheduled start time
		 *  @type {Ticks}
		 *  @memberOf Tone.Part#
		 *  @name startOffset
		 *  @private
		 */
		Object.defineProperty(Tone.Part.prototype, "startOffset", {
			get : function(){
				return this._startOffset;
			},
			set : function(offset){
				this._startOffset = offset;
				this._forEach(function(event){
					event.startOffset += this._startOffset;
				});
			}
		});

		/**
		 *  Stop the part at the given time.
		 *  @param  {Time}  time  When to stop the part.
		 *  @return  {Tone.Part}  this
		 */
		Tone.Part.prototype.stop = function(time){
			var ticks = this.toTicks(time);
			if (this._state.getStateAtTime(ticks) === Tone.State.Started){
				this._state.setStateAtTime(Tone.State.Stopped, ticks);
				this._forEach(function(event){
					event.stop(time);
				});
			}
			return this;
		};

		/**
		 *  Get/Set an Event's value at the given time. 
		 *  If a value is passed in and no event exists at
		 *  the given time, one will be created with that value. 
		 *  If two events are at the same time, the first one will
		 *  be returned.
		 *  @example
		 * part.at("1m"); //returns the part at the first measure
		 *
		 * part.at("2m", "C2"); //set the value at "2m" to C2. 
		 * //if an event didn't exist at that time, it will be created.
		 *  @param {Time} time the time of the event to get or set
		 *  @param {*=} value If a value is passed in, the value of the
		 *                    event at the given time will be set to it.
		 *  @return {Tone.Event} the event at the time
		 */
		Tone.Part.prototype.at = function(time, value){
			time = this.toTicks(time);
			var tickTime = this.ticksToSeconds(1);
			for (var i = 0; i < this._events.length; i++){
				var event = this._events[i];
				if (Math.abs(time - event.startOffset) < tickTime){
					if (!this.isUndef(value)){
						event.value = value;
					}
					return event;
				}
			}
			//if there was no event at that time, create one
			if (!this.isUndef(value)){
				this.add(time + "i", value);
				//return the new event
				return this._events[this._events.length - 1];
			} else {
				return null;
			}
		};

		/**
		 *  Add a an event to the part. 
		 *  @param {Time} time The time the note should start.
		 *                            If an object is passed in, it should
		 *                            have a 'time' attribute and the rest
		 *                            of the object will be used as the 'value'.
		 *  @param  {Tone.Event|*}  value 
		 *  @returns {Tone.Part} this
		 *  @example
		 * part.add("1m", "C#+11");
		 */
		Tone.Part.prototype.add = function(time, value){
			//extract the parameters
			if (this.isObject(time) && time.hasOwnProperty("time")){
				value = time;
				time = value.time;
				delete value.time;
			} 
			time = this.toTicks(time);
			var event;
			if (value instanceof Tone.Event){
				event = value;
				event.callback = this._tick.bind(this);
			} else {
				event = new Tone.Event({
					"callback" : this._tick.bind(this), 
					"value" : value,
				});
			}
			//the start offset
			event.startOffset = time;

			//initialize the values
			event.set({
				"loopEnd" : this.loopEnd,
				"loopStart" : this.loopStart,
				"loop" : this.loop,
				"humanize" : this.humanize,
				"playbackRate" : this.playbackRate,
				"probability" : this.probability
			});

			this._events.push(event);

			//start the note if it should be played right now
			this._restartEvent(event);
			return this;
		};

		/**
		 *  Restart the given event
		 *  @param  {Tone.Event}  event 
		 *  @private
		 */
		Tone.Part.prototype._restartEvent = function(event){
			var stateEvent = this._state.getEvent(this.now());
			if (stateEvent && stateEvent.state === Tone.State.Started){
				this._startNote(event, stateEvent.time, stateEvent.offset);
			}	
		};

		/**
		 *  Remove an event from the part. Will recursively iterate
		 *  into nested parts to find the event.
		 *  @param {Time} time The time of the event
		 *  @param {*} value Optionally select only a specific event value
		 */
		Tone.Part.prototype.remove = function(time, value){
			//extract the parameters
			if (this.isObject(time) && time.hasOwnProperty("time")){
				value = time;
				time = value.time;
			} 
			time = this.toTicks(time);
			for (var i = this._events.length - 1; i >= 0; i--){
				var event = this._events[i];
				if (event instanceof Tone.Part){
					event.remove(time, value);
				} else {
					if (event.startOffset === time){
						if (this.isUndef(value) || (!this.isUndef(value) && event.value === value)){
							this._events.splice(i, 1);
							event.dispose();
						}
					}
				}
			}
			return this;
		};

		/**
		 *  Remove all of the notes from the group. 
		 *  @return  {Tone.Part}  this
		 */
		Tone.Part.prototype.removeAll = function(){
			this._forEach(function(event){
				event.dispose();
			});
			this._events = [];
			return this;
		};

		/**
		 *  Cancel scheduled state change events: i.e. "start" and "stop".
		 *  @param {Time} after The time after which to cancel the scheduled events.
		 *  @return  {Tone.Part}  this
		 */
		Tone.Part.prototype.cancel = function(after){
			this._forEach(function(event){
				event.cancel(after);
			});
			this._state.cancel(after);
			return this;
		};

		/**
		 *  Iterate over all of the events
		 *  @param {Function} callback
		 *  @param {Object} ctx The context
		 *  @private
		 */
		Tone.Part.prototype._forEach = function(callback, ctx){
			ctx = this.defaultArg(ctx, this);
			for (var i = this._events.length - 1; i >= 0; i--){
				var e = this._events[i];
				if (e instanceof Tone.Part){
					e._forEach(callback, ctx);
				} else {
					callback.call(ctx, e);
				}
			}
			return this;
		};

		/**
		 *  Set the attribute of all of the events
		 *  @param  {String}  attr  the attribute to set
		 *  @param  {*}  value      The value to set it to
		 *  @private
		 */
		Tone.Part.prototype._setAll = function(attr, value){
			this._forEach(function(event){
				event[attr] = value;
			});
		};

		/**
		 *  Internal tick method
		 *  @param  {Number}  time  The time of the event in seconds
		 *  @private
		 */
		Tone.Part.prototype._tick = function(time, value){
			if (!this.mute){
				this.callback(time, value);
			}
		};

		/**
		 *  Determine if the event should be currently looping
		 *  given the loop boundries of this Part.
		 *  @param  {Tone.Event}  event  The event to test
		 *  @private
		 */
		Tone.Part.prototype._testLoopBoundries = function(event){
			if (event.startOffset < this._loopStart || event.startOffset >= this._loopEnd){
				event.cancel();
			} else {
				//reschedule it if it's stopped
				if (event.state === Tone.State.Stopped){
					this._restartEvent(event);
				}
			}
		};

		/**
		 *  The probability of the notes being triggered.
		 *  @memberOf Tone.Part#
		 *  @type {NormalRange}
		 *  @name probability
		 */
		Object.defineProperty(Tone.Part.prototype, "probability", {
			get : function(){
				return this._probability;
			},
			set : function(prob){
				this._probability = prob;
				this._setAll("probability", prob);
			}
		});

		/**
		 *  If set to true, will apply small random variation
		 *  to the callback time. If the value is given as a time, it will randomize
		 *  by that amount.
		 *  @example
		 * event.humanize = true;
		 *  @type {Boolean|Time}
		 *  @name humanize
		 */
		Object.defineProperty(Tone.Part.prototype, "humanize", {
			get : function(){
				return this._humanize;
			},
			set : function(variation){
				this._humanize = variation;
				this._setAll("humanize", variation);
			}
		});

		/**
		 *  If the part should loop or not
		 *  between Tone.Part.loopStart and 
		 *  Tone.Part.loopEnd. An integer
		 *  value corresponds to the number of
		 *  loops the Part does after it starts.
		 *  @memberOf Tone.Part#
		 *  @type {Boolean|Positive}
		 *  @name loop
		 *  @example
		 * //loop the part 8 times
		 * part.loop = 8;
		 */
		Object.defineProperty(Tone.Part.prototype, "loop", {
			get : function(){
				return this._loop;
			},
			set : function(loop){
				this._loop = loop;
				this._forEach(function(event){
					event._loopStart = this._loopStart;
					event._loopEnd = this._loopEnd;
					event.loop = loop;
					this._testLoopBoundries(event);
				});
			}
		});

		/**
		 *  The loopEnd point determines when it will 
		 *  loop if Tone.Part.loop is true.
		 *  @memberOf Tone.Part#
		 *  @type {Boolean|Positive}
		 *  @name loopEnd
		 */
		Object.defineProperty(Tone.Part.prototype, "loopEnd", {
			get : function(){
				return this.toNotation(this._loopEnd + "i");
			},
			set : function(loopEnd){
				this._loopEnd = this.toTicks(loopEnd);
				if (this._loop){
					this._forEach(function(event){
						event.loopEnd = this.loopEnd;
						this._testLoopBoundries(event);
					});
				}
			}
		});

		/**
		 *  The loopStart point determines when it will 
		 *  loop if Tone.Part.loop is true.
		 *  @memberOf Tone.Part#
		 *  @type {Boolean|Positive}
		 *  @name loopStart
		 */
		Object.defineProperty(Tone.Part.prototype, "loopStart", {
			get : function(){
				return this.toNotation(this._loopStart + "i");
			},
			set : function(loopStart){
				this._loopStart = this.toTicks(loopStart);
				if (this._loop){
					this._forEach(function(event){
						event.loopStart = this.loopStart;
						this._testLoopBoundries(event);
					});
				}
			}
		});

		/**
		 * 	The playback rate of the part
		 *  @memberOf Tone.Part#
		 *  @type {Positive}
		 *  @name playbackRate
		 */
		Object.defineProperty(Tone.Part.prototype, "playbackRate", {
			get : function(){
				return this._playbackRate;
			},
			set : function(rate){
				this._playbackRate = rate;
				this._setAll("playbackRate", rate);
			}
		});

		/**
		 * 	The number of scheduled notes in the part. 
		 *  @memberOf Tone.Part#
		 *  @type {Positive}
		 *  @name length
		 *  @readOnly
		 */
		Object.defineProperty(Tone.Part.prototype, "length", {
			get : function(){
				return this._events.length;
			}
		});

		/**
		 *  Clean up
		 *  @return  {Tone.Part}  this
		 */
		Tone.Part.prototype.dispose = function(){
			this.removeAll();
			this._state.dispose();
			this._state = null;
			this.callback = null;
			this._events = null;
			return this;
		};

		return Tone.Part;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(30), __webpack_require__(35), __webpack_require__(41), __webpack_require__(45)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tone) {

		"use strict";

		/**
		 *  @class  Tone.Event abstracts away Tone.Transport.schedule and provides a schedulable
		 *          callback for a single or repeatable events along the timeline. 
		 *
		 *  @extends {Tone}
		 *  @param {function} callback The callback to invoke at the time. 
		 *  @param {*} value The value or values which should be passed to
		 *                      the callback function on invocation.  
		 *  @example
		 * var chord = new Tone.Event(function(time, chord){
		 * 	//the chord as well as the exact time of the event
		 * 	//are passed in as arguments to the callback function
		 * }, ["D4", "E4", "F4"]);
		 * //start the chord at the beginning of the transport timeline
		 * chord.start();
		 * //loop it every measure for 8 measures
		 * chord.loop = 8;
		 * chord.loopEnd = "1m";
		 */
		Tone.Event = function(){

			var options = this.optionsObject(arguments, ["callback", "value"], Tone.Event.defaults);

			/**
			 *  Loop value
			 *  @type  {Boolean|Positive}
			 *  @private
			 */
			this._loop = options.loop;

			/**
			 *  The callback to invoke. 
			 *  @type  {Function}
			 */
			this.callback = options.callback;

			/**
			 *  The value which is passed to the
			 *  callback function.
			 *  @type  {*}
			 *  @private
			 */
			this.value = options.value;

			/**
			 *  When the note is scheduled to start.
			 *  @type  {Number}
			 *  @private
			 */
			this._loopStart = this.toTicks(options.loopStart);

			/**
			 *  When the note is scheduled to start.
			 *  @type  {Number}
			 *  @private
			 */
			this._loopEnd = this.toTicks(options.loopEnd);

			/**
			 *  Tracks the scheduled events
			 *  @type {Tone.TimelineState}
			 *  @private
			 */
			this._state = new Tone.TimelineState(Tone.State.Stopped);

			/**
			 *  The playback speed of the note. A speed of 1
			 *  is no change. 
			 *  @private
			 *  @type {Positive}
			 */
			this._playbackRate = 1;

			/**
			 *  A delay time from when the event is scheduled to start
			 *  @type {Ticks}
			 *  @private
			 */
			this._startOffset = 0;

			/**
			 *  The probability that the callback will be invoked
			 *  at the scheduled time. 
			 *  @type {NormalRange}
			 *  @example
			 * //the callback will be invoked 50% of the time
			 * event.probability = 0.5;
			 */
			this.probability = options.probability;

			/**
			 *  If set to true, will apply small (+/-0.02 seconds) random variation
			 *  to the callback time. If the value is given as a time, it will randomize
			 *  by that amount.
			 *  @example
			 * event.humanize = true;
			 *  @type {Boolean|Time}
			 */
			this.humanize = options.humanize;

			/**
			 *  If mute is true, the callback won't be
			 *  invoked.
			 *  @type {Boolean}
			 */
			this.mute = options.mute;

			//set the initial values
			this.playbackRate = options.playbackRate;
		};

		Tone.extend(Tone.Event);

		/**
		 *  The default values
		 *  @type  {Object}
		 *  @const
		 */
		Tone.Event.defaults = {
			"callback" : Tone.noOp,
			"loop" : false,
			"loopEnd" : "1m",
			"loopStart" : 0,
			"playbackRate" : 1,
			"value" : null,
			"probability" : 1,
			"mute" : false,
			"humanize" : false,
		};

		/**
		 *  Reschedule all of the events along the timeline
		 *  with the updated values.
		 *  @param {Time} after Only reschedules events after the given time.
		 *  @return  {Tone.Event}  this
		 *  @private
		 */
		Tone.Event.prototype._rescheduleEvents = function(after){
			//if no argument is given, schedules all of the events
			after = this.defaultArg(after, -1);
			this._state.forEachFrom(after, function(event){
				var duration;
				if (event.state === Tone.State.Started){
					if (!this.isUndef(event.id)){
						Tone.Transport.clear(event.id);
					}
					var startTick = event.time + Math.round(this.startOffset / this._playbackRate);
					if (this._loop){
						duration = Infinity;
						if (this.isNumber(this._loop)){
							duration =  (this._loop - 1) * this._getLoopDuration();
						}
						var nextEvent = this._state.getEventAfter(startTick);
						if (nextEvent !== null){
							duration = Math.min(duration, nextEvent.time - startTick);
						}
						if (duration !== Infinity){
							//schedule a stop since it's finite duration
							this._state.setStateAtTime(Tone.State.Stopped, startTick + duration + 1);
							duration += "i";
						}
						event.id = Tone.Transport.scheduleRepeat(this._tick.bind(this), this._getLoopDuration().toString() + "i", startTick + "i", duration);
					} else {
						event.id = Tone.Transport.schedule(this._tick.bind(this), startTick + "i");
					}
				} 
			}.bind(this));
			return this;
		};

		/**
		 *  Returns the playback state of the note, either "started" or "stopped".
		 *  @type {String}
		 *  @readOnly
		 *  @memberOf Tone.Event#
		 *  @name state
		 */
		Object.defineProperty(Tone.Event.prototype, "state", {
			get : function(){
				return this._state.getStateAtTime(Tone.Transport.ticks);
			}
		});

		/**
		 *  The start from the scheduled start time
		 *  @type {Ticks}
		 *  @memberOf Tone.Event#
		 *  @name startOffset
		 *  @private
		 */
		Object.defineProperty(Tone.Event.prototype, "startOffset", {
			get : function(){
				return this._startOffset;
			},
			set : function(offset){
				this._startOffset = offset;
			}
		});

		/**
		 *  Start the note at the given time. 
		 *  @param  {Time}  time  When the note should start.
		 *  @return  {Tone.Event}  this
		 */
		Tone.Event.prototype.start = function(time){
			time = this.toTicks(time);
			if (this._state.getStateAtTime(time) === Tone.State.Stopped){
				this._state.addEvent({
					"state" : Tone.State.Started,
					"time" : time,
					"id" : undefined,
				});
				this._rescheduleEvents(time);
			}
			return this;
		};

		/**
		 *  Stop the Event at the given time.
		 *  @param  {Time}  time  When the note should stop.
		 *  @return  {Tone.Event}  this
		 */
		Tone.Event.prototype.stop = function(time){
			this.cancel(time);
			time = this.toTicks(time);
			if (this._state.getStateAtTime(time) === Tone.State.Started){
				this._state.setStateAtTime(Tone.State.Stopped, time);
				var previousEvent = this._state.getEventBefore(time);
				var reschedulTime = time;
				if (previousEvent !== null){
					reschedulTime = previousEvent.time;
				}
				this._rescheduleEvents(reschedulTime);
			}
			return this;
		};

		/**
		 *  Cancel all scheduled events greater than or equal to the given time
		 *  @param  {Time}  [time=0]  The time after which events will be cancel.
		 *  @return  {Tone.Event}  this
		 */
		Tone.Event.prototype.cancel = function(time){
			time = this.defaultArg(time, -Infinity);
			time = this.toTicks(time);
			this._state.forEachFrom(time, function(event){
				Tone.Transport.clear(event.id);
			});
			this._state.cancel(time);
			return this;
		};

		/**
		 *  The callback function invoker. Also 
		 *  checks if the Event is done playing
		 *  @param  {Number}  time  The time of the event in seconds
		 *  @private
		 */
		Tone.Event.prototype._tick = function(time){
			if (!this.mute && this._state.getStateAtTime(Tone.Transport.ticks) === Tone.State.Started){
				if (this.probability < 1 && Math.random() > this.probability){
					return;
				} 
				if (this.humanize){
					var variation = 0.02;
					if (!this.isBoolean(this.humanize)){
						variation = this.toSeconds(this.humanize);
					}
					time += (Math.random() * 2 - 1) * variation;
				}
				this.callback(time, this.value);
			}
		};

		/**
		 *  Get the duration of the loop.
		 *  @return  {Ticks}
		 *  @private
		 */
		Tone.Event.prototype._getLoopDuration = function(){
			return Math.round((this._loopEnd - this._loopStart) / this._playbackRate);
		};

		/**
		 *  If the note should loop or not
		 *  between Tone.Event.loopStart and 
		 *  Tone.Event.loopEnd. An integer
		 *  value corresponds to the number of
		 *  loops the Event does after it starts.
		 *  @memberOf Tone.Event#
		 *  @type {Boolean|Positive}
		 *  @name loop
		 */
		Object.defineProperty(Tone.Event.prototype, "loop", {
			get : function(){
				return this._loop;
			},
			set : function(loop){
				this._loop = loop;
				this._rescheduleEvents();
			}
		});

		/**
		 * 	The playback rate of the note. Defaults to 1.
		 *  @memberOf Tone.Event#
		 *  @type {Positive}
		 *  @name playbackRate
		 *  @example
		 * note.loop = true;
		 * //repeat the note twice as fast
		 * note.playbackRate = 2;
		 */
		Object.defineProperty(Tone.Event.prototype, "playbackRate", {
			get : function(){
				return this._playbackRate;
			},
			set : function(rate){
				this._playbackRate = rate;
				this._rescheduleEvents();
			}
		});

		/**
		 *  The loopEnd point is the time the event will loop. 
		 *  Note: only loops if Tone.Event.loop is true.
		 *  @memberOf Tone.Event#
		 *  @type {Boolean|Positive}
		 *  @name loopEnd
		 */
		Object.defineProperty(Tone.Event.prototype, "loopEnd", {
			get : function(){
				return this.toNotation(this._loopEnd + "i");
			},
			set : function(loopEnd){
				this._loopEnd = this.toTicks(loopEnd);
				if (this._loop){
					this._rescheduleEvents();
				}
			}
		});

		/**
		 *  The time when the loop should start. 
		 *  @memberOf Tone.Event#
		 *  @type {Boolean|Positive}
		 *  @name loopStart
		 */
		Object.defineProperty(Tone.Event.prototype, "loopStart", {
			get : function(){
				return this.toNotation(this._loopStart + "i");
			},
			set : function(loopStart){
				this._loopStart = this.toTicks(loopStart);
				if (this._loop){
					this._rescheduleEvents();
				}
			}
		});

		/**
		 *  The current progress of the loop interval.
		 *  Returns 0 if the event is not started yet or
		 *  it is not set to loop.
		 *  @memberOf Tone.Event#
		 *  @type {NormalRange}
		 *  @name progress
		 *  @readOnly
		 */
		Object.defineProperty(Tone.Event.prototype, "progress", {
			get : function(){
				if (this._loop){
					var ticks = Tone.Transport.ticks;
					var lastEvent = this._state.getEvent(ticks);
					if (lastEvent !== null && lastEvent.state === Tone.State.Started){
						var loopDuration = this._getLoopDuration();
						var progress = (ticks - lastEvent.time) % loopDuration;
						return progress / loopDuration;
					} else {
						return 0;
					}
				} else {
					return 0;
				}
			}
		});

		/**
		 *  Clean up
		 *  @return  {Tone.Event}  this
		 */
		Tone.Event.prototype.dispose = function(){
			this.cancel();
			this._state.dispose();
			this._state = null;
			this.callback = null;
			this.value = null;
		};

		return Tone.Event;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(30), __webpack_require__(36), __webpack_require__(41), __webpack_require__(44), 
		__webpack_require__(46), __webpack_require__(43), __webpack_require__(47)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class  Transport for timing musical events.
		 *          Supports tempo curves and time changes. Unlike browser-based timing (setInterval, requestAnimationFrame)
		 *          Tone.Transport timing events pass in the exact time of the scheduled event
		 *          in the argument of the callback function. Pass that time value to the object
		 *          you're scheduling. <br><br>
		 *          A single transport is created for you when the library is initialized. 
		 *          <br><br>
		 *          The transport emits the events: "start", "stop", "pause", and "loop" which are
		 *          called with the time of that event as the argument. 
		 *
		 *  @extends {Tone.Emitter}
		 *  @singleton
		 *  @example
		 * //repeated event every 8th note
		 * Tone.Transport.setInterval(function(time){
		 * 	//do something with the time
		 * }, "8n");
		 *  @example
		 * //one time event 1 second in the future
		 * Tone.Transport.setTimeout(function(time){
		 * 	//do something with the time
		 * }, 1);
		 *  @example
		 * //event fixed to the Transports timeline. 
		 * Tone.Transport.setTimeline(function(time){
		 * 	//do something with the time
		 * }, "16:0:0");
		 */
		Tone.Transport = function(){

			Tone.Emitter.call(this);

			///////////////////////////////////////////////////////////////////////
			//	LOOPING
			//////////////////////////////////////////////////////////////////////

			/** 
			 * 	If the transport loops or not.
			 *  @type {boolean}
			 */
			this.loop = false;

			/** 
			 * 	The loop start position in ticks
			 *  @type {Ticks}
			 *  @private
			 */
			this._loopStart = 0;

			/** 
			 * 	The loop end position in ticks
			 *  @type {Ticks}
			 *  @private
			 */
			this._loopEnd = 0;

			///////////////////////////////////////////////////////////////////////
			//	CLOCK/TEMPO
			//////////////////////////////////////////////////////////////////////

			/**
			 *  Pulses per quarter is the number of ticks per quarter note.
			 *  @private
			 *  @type  {Number}
			 */
			this._ppq = TransportConstructor.defaults.PPQ;

			/**
			 *  watches the main oscillator for timing ticks
			 *  initially starts at 120bpm
			 *  @private
			 *  @type {Tone.Clock}
			 */
			this._clock = new Tone.Clock({
				"callback" : this._processTick.bind(this), 
				"frequency" : 0,
			});
			/**
			 *  The Beats Per Minute of the Transport. 
			 *  @type {BPM}
			 *  @signal
			 *  @example
			 * Tone.Transport.bpm.value = 80;
			 * //ramp the bpm to 120 over 10 seconds
			 * Tone.Transport.bpm.rampTo(120, 10);
			 */
			this.bpm = this._clock.frequency;
			this.bpm._toUnits = this._toUnits.bind(this);
			this.bpm._fromUnits = this._fromUnits.bind(this);
			this.bpm.units = Tone.Type.BPM;
			this.bpm.value = TransportConstructor.defaults.bpm;
			this._readOnly("bpm");

			/**
			 *  The time signature, or more accurately the numerator
			 *  of the time signature over a denominator of 4. 
			 *  @type {Number}
			 *  @private
			 */
			this._timeSignature = TransportConstructor.defaults.timeSignature;

			///////////////////////////////////////////////////////////////////////
			//	TIMELINE EVENTS
			//////////////////////////////////////////////////////////////////////

			/**
			 *  All the events in an object to keep track by ID
			 *  @type {Object}
			 *  @private
			 */
			this._scheduledEvents = {};

			/**
			 *  The event ID counter
			 *  @type {Number}
			 *  @private
			 */
			this._eventID = 0;

			/**
			 * 	The scheduled events.
			 *  @type {Tone.Timeline}
			 *  @private
			 */
			this._timeline = new Tone.Timeline();

			/**
			 *  Repeated events
			 *  @type {Array}
			 *  @private
			 */
			this._repeatedEvents = new Tone.IntervalTimeline();

			/**
			 *  Events that occur once
			 *  @type {Array}
			 *  @private
			 */
			this._onceEvents = new Tone.Timeline();

			/** 
			 *  All of the synced Signals
			 *  @private 
			 *  @type {Array}
			 */
			this._syncedSignals = [];

			///////////////////////////////////////////////////////////////////////
			//	SWING
			//////////////////////////////////////////////////////////////////////

			var swingSeconds = this.notationToSeconds(TransportConstructor.defaults.swingSubdivision, TransportConstructor.defaults.bpm, TransportConstructor.defaults.timeSignature);

			/**
			 *  The subdivision of the swing
			 *  @type  {Ticks}
			 *  @private
			 */
			this._swingTicks = (swingSeconds / (60 / TransportConstructor.defaults.bpm)) * this._ppq;

			/**
			 *  The swing amount
			 *  @type {NormalRange}
			 *  @private
			 */
			this._swingAmount = 0;

		};

		Tone.extend(Tone.Transport, Tone.Emitter);

		/**
		 *  the defaults
		 *  @type {Object}
		 *  @const
		 *  @static
		 */
		Tone.Transport.defaults = {
			"bpm" : 120,
			"swing" : 0,
			"swingSubdivision" : "16n",
			"timeSignature" : 4,
			"loopStart" : 0,
			"loopEnd" : "4m",
			"PPQ" : 48
		};

		///////////////////////////////////////////////////////////////////////////////
		//	TICKS
		///////////////////////////////////////////////////////////////////////////////

		/**
		 *  called on every tick
		 *  @param   {number} tickTime clock relative tick time
		 *  @private
		 */
		Tone.Transport.prototype._processTick = function(tickTime){
			//handle swing
			if (this._swingAmount > 0 && 
				this._clock.ticks % this._ppq !== 0 && //not on a downbeat
				this._clock.ticks % this._swingTicks === 0){
				//add some swing
				tickTime += this.ticksToSeconds(this._swingTicks) * this._swingAmount;
			}
			//do the loop test
			if (this.loop){
				if (this._clock.ticks === this._loopEnd){
					this.ticks = this._loopStart;
					this.trigger("loop", tickTime);
				}
			}
			var ticks = this._clock.ticks;
			//fire the next tick events if their time has come
			this._timeline.forEachAtTime(ticks, function(event){
				event.callback(tickTime);
			});
			//process the repeated events
			this._repeatedEvents.forEachOverlap(ticks, function(event){
				if ((ticks - event.time) % event.interval === 0){
					event.callback(tickTime);
				}
			});
			//process the single occurrence events
			this._onceEvents.forEachBefore(ticks, function(event){
				event.callback(tickTime);
			});
			//and clear the single occurrence timeline
			this._onceEvents.cancelBefore(ticks);
		};

		///////////////////////////////////////////////////////////////////////////////
		//	SCHEDULABLE EVENTS
		///////////////////////////////////////////////////////////////////////////////

		/**
		 *  Schedule an event along the timeline.
		 *  @param {Function} callback The callback to be invoked at the time.
		 *  @param {Time}  time The time to invoke the callback at.
		 *  @return {Number} The id of the event which can be used for canceling the event. 
		 *  @example
		 * //trigger the callback when the Transport reaches the desired time
		 * Tone.Transport.schedule(function(time){
		 * 	envelope.triggerAttack(time);
		 * }, "128i");
		 */
		Tone.Transport.prototype.schedule = function(callback, time){
			var event = {
				"time" : this.toTicks(time),
				"callback" : callback
			};
			var id = this._eventID++;
			this._scheduledEvents[id.toString()] = {
				"event" : event,
				"timeline" : this._timeline
			};
			this._timeline.addEvent(event);
			return id;
		};

		/**
		 *  Schedule a repeated event along the timeline. The event will fire
		 *  at the `interval` starting at the `startTime` and for the specified
		 *  `duration`. 
		 *  @param  {Function}  callback   The callback to invoke.
		 *  @param  {Time}    interval   The duration between successive
		 *                               callbacks.
		 *  @param  {Time=}    startTime  When along the timeline the events should
		 *                               start being invoked.
		 *  @param {Time} [duration=Infinity] How long the event should repeat. 
		 *  @return  {Number}    The ID of the scheduled event. Use this to cancel
		 *                           the event. 
		 *  @example
		 * //a callback invoked every eighth note after the first measure
		 * Tone.Transport.scheduleRepeat(callback, "8n", "1m");
		 */
		Tone.Transport.prototype.scheduleRepeat = function(callback, interval, startTime, duration){
			if (interval <= 0){
				throw new Error("repeat events must have an interval larger than 0");
			}
			var event = {
				"time" : this.toTicks(startTime),
				"duration" : this.toTicks(this.defaultArg(duration, Infinity)),
				"interval" : this.toTicks(interval),
				"callback" : callback
			};
			var id = this._eventID++;
			this._scheduledEvents[id.toString()] = {
				"event" : event,
				"timeline" : this._repeatedEvents
			};
			this._repeatedEvents.addEvent(event);
			return id;
		};

		/**
		 *  Schedule an event that will be removed after it is invoked. 
		 *  Note that if the given time is less than the current transport time, 
		 *  the event will be invoked immediately. 
		 *  @param {Function} callback The callback to invoke once.
		 *  @param {Time} time The time the callback should be invoked.
		 *  @returns {Number} The ID of the scheduled event. 
		 */
		Tone.Transport.prototype.scheduleOnce = function(callback, time){
			var event = {
				"time" : this.toTicks(time),
				"callback" : callback
			};
			var id = this._eventID++;
			this._scheduledEvents[id.toString()] = {
				"event" : event,
				"timeline" : this._onceEvents
			};
			this._onceEvents.addEvent(event);
			return id;
		};

		/**
		 *  Clear the passed in event id from the timeline
		 *  @param {Number} eventId The id of the event.
		 *  @returns {Tone.Transport} this
		 */
		Tone.Transport.prototype.clear = function(eventId){
			if (this._scheduledEvents.hasOwnProperty(eventId)){
				var item = this._scheduledEvents[eventId.toString()];
				item.timeline.removeEvent(item.event);
				delete this._scheduledEvents[eventId.toString()];
			}
			return this;
		};

		/**
		 *  Remove scheduled events from the timeline after
		 *  the given time. Repeated events will be removed
		 *  if their startTime is after the given time
		 *  @param {Time} [after=0] Clear all events after
		 *                          this time. 
		 *  @returns {Tone.Transport} this
		 */
		Tone.Transport.prototype.cancel = function(after){
			after = this.defaultArg(after, 0);
			after = this.toTicks(after);
			this._timeline.cancel(after);
			this._onceEvents.cancel(after);
			this._repeatedEvents.cancel(after);
			return this;
		};

		///////////////////////////////////////////////////////////////////////////////
		//	QUANTIZATION
		///////////////////////////////////////////////////////////////////////////////

		/**
		 *  Returns the time closest time (equal to or after the given time) that aligns 
		 *  to the subidivision. 
		 *  @param {Time} time The time value to quantize to the given subdivision
		 *  @param  {String} [subdivision="4n"] The subdivision to quantize to.
		 *  @return {Number} 	the time in seconds until the next subdivision.
		 *  @example
		 * Tone.Transport.bpm.value = 120;
		 * Tone.Transport.quantize("3 * 4n", "1m"); //return 0.5
		 * //if the clock is started, it will return a value less than 0.5
		 */
		Tone.Transport.prototype.quantize = function(time, subdivision){
			subdivision = this.defaultArg(subdivision, "4n");
			var tickTime = this.toTicks(time);
			subdivision = this.toTicks(subdivision);
			var remainingTicks = subdivision - (tickTime % subdivision);
			if (remainingTicks === subdivision){
				remainingTicks = 0;
			}
			var now = this.now();
			if (this.state === Tone.State.Started){
				now = this._clock._nextTick;
			}
			return this.toSeconds(time, now) + this.ticksToSeconds(remainingTicks);
		};

		///////////////////////////////////////////////////////////////////////////////
		//	START/STOP/PAUSE
		///////////////////////////////////////////////////////////////////////////////

		/**
		 *  Returns the playback state of the source, either "started", "stopped", or "paused"
		 *  @type {Tone.State}
		 *  @readOnly
		 *  @memberOf Tone.Transport#
		 *  @name state
		 */
		Object.defineProperty(Tone.Transport.prototype, "state", {
			get : function(){
				return this._clock.getStateAtTime(this.now());
			}
		});

		/**
		 *  Start the transport and all sources synced to the transport.
		 *  @param  {Time} [time=now] The time when the transport should start.
		 *  @param  {Time=} offset The timeline offset to start the transport.
		 *  @returns {Tone.Transport} this
		 *  @example
		 * //start the transport in one second starting at beginning of the 5th measure. 
		 * Tone.Transport.start("+1", "4:0:0");
		 */
		Tone.Transport.prototype.start = function(time, offset){
			time = this.toSeconds(time);
			if (!this.isUndef(offset)){
				offset = this.toTicks(offset);
			} else {
				offset = this.defaultArg(offset, this._clock.ticks);
			}
			//start the clock
			this._clock.start(time, offset);
			this.trigger("start", time, this.ticksToSeconds(offset));
			return this;
		};

		/**
		 *  Stop the transport and all sources synced to the transport.
		 *  @param  {Time} [time=now] The time when the transport should stop. 
		 *  @returns {Tone.Transport} this
		 *  @example
		 * Tone.Transport.stop();
		 */
		Tone.Transport.prototype.stop = function(time){
			time = this.toSeconds(time);
			this._clock.stop(time);
			this.trigger("stop", time);
			return this;
		};

		/**
		 *  Pause the transport and all sources synced to the transport.
		 *  @param  {Time} [time=now]
		 *  @returns {Tone.Transport} this
		 */
		Tone.Transport.prototype.pause = function(time){
			time = this.toSeconds(time);
			this._clock.pause(time);
			this.trigger("pause", time);
			return this;
		};

		///////////////////////////////////////////////////////////////////////////////
		//	SETTERS/GETTERS
		///////////////////////////////////////////////////////////////////////////////

		/**
		 *  The time signature as just the numerator over 4. 
		 *  For example 4/4 would be just 4 and 6/8 would be 3.
		 *  @memberOf Tone.Transport#
		 *  @type {Number|Array}
		 *  @name timeSignature
		 *  @example
		 * //common time
		 * Tone.Transport.timeSignature = 4;
		 * // 7/8
		 * Tone.Transport.timeSignature = [7, 8];
		 * //this will be reduced to a single number
		 * Tone.Transport.timeSignature; //returns 3.5
		 */
		Object.defineProperty(Tone.Transport.prototype, "timeSignature", {
			get : function(){
				return this._timeSignature;
			},
			set : function(timeSig){
				if (this.isArray(timeSig)){
					timeSig = (timeSig[0] / timeSig[1]) * 4;
				}
				this._timeSignature = timeSig;
			}
		});


		/**
		 * When the Tone.Transport.loop = true, this is the starting position of the loop.
		 * @memberOf Tone.Transport#
		 * @type {Time}
		 * @name loopStart
		 */
		Object.defineProperty(Tone.Transport.prototype, "loopStart", {
			get : function(){
				return this.ticksToSeconds(this._loopStart);
			},
			set : function(startPosition){
				this._loopStart = this.toTicks(startPosition);
			}
		});

		/**
		 * When the Tone.Transport.loop = true, this is the ending position of the loop.
		 * @memberOf Tone.Transport#
		 * @type {Time}
		 * @name loopEnd
		 */
		Object.defineProperty(Tone.Transport.prototype, "loopEnd", {
			get : function(){
				return this.ticksToSeconds(this._loopEnd);
			},
			set : function(endPosition){
				this._loopEnd = this.toTicks(endPosition);
			}
		});

		/**
		 *  Set the loop start and stop at the same time. 
		 *  @param {Time} startPosition 
		 *  @param {Time} endPosition   
		 *  @returns {Tone.Transport} this
		 *  @example
		 * //loop over the first measure
		 * Tone.Transport.setLoopPoints(0, "1m");
		 * Tone.Transport.loop = true;
		 */
		Tone.Transport.prototype.setLoopPoints = function(startPosition, endPosition){
			this.loopStart = startPosition;
			this.loopEnd = endPosition;
			return this;
		};

		/**
		 *  The swing value. Between 0-1 where 1 equal to 
		 *  the note + half the subdivision.
		 *  @memberOf Tone.Transport#
		 *  @type {NormalRange}
		 *  @name swing
		 */
		Object.defineProperty(Tone.Transport.prototype, "swing", {
			get : function(){
				return this._swingAmount * 2;
			},
			set : function(amount){
				//scale the values to a normal range
				this._swingAmount = amount * 0.5;
			}
		});

		/**
		 *  Set the subdivision which the swing will be applied to. 
		 *  The default values is a 16th note. Value must be less 
		 *  than a quarter note.
		 *  
		 *  @memberOf Tone.Transport#
		 *  @type {Time}
		 *  @name swingSubdivision
		 */
		Object.defineProperty(Tone.Transport.prototype, "swingSubdivision", {
			get : function(){
				return this.toNotation(this._swingTicks + "i");
			},
			set : function(subdivision){
				this._swingTicks = this.toTicks(subdivision);
			}
		});

		/**
		 *  The Transport's position in MEASURES:BEATS:SIXTEENTHS.
		 *  Setting the value will jump to that position right away. 
		 *  
		 *  @memberOf Tone.Transport#
		 *  @type {TransportTime}
		 *  @name position
		 */
		Object.defineProperty(Tone.Transport.prototype, "position", {
			get : function(){
				var quarters = this.ticks / this._ppq;
				var measures = Math.floor(quarters / this._timeSignature);
				var sixteenths = ((quarters % 1) * 4);
				//if the sixteenths aren't a whole number, fix their length
				if (sixteenths % 1 > 0){
					sixteenths = sixteenths.toFixed(3);	
				}
				quarters = Math.floor(quarters) % this._timeSignature;
				var progress = [measures, quarters, sixteenths];
				return progress.join(":");
			},
			set : function(progress){
				var ticks = this.toTicks(progress);
				this.ticks = ticks;
			}
		});

		/**
		 *  The Transport's loop position as a normalized value. Always
		 *  returns 0 if the transport if loop is not true. 
		 *  @memberOf Tone.Transport#
		 *  @name progress
		 *  @type {NormalRange}
		 */
		Object.defineProperty(Tone.Transport.prototype, "progress", {
			get : function(){
				if (this.loop){
					return (this.ticks - this._loopStart) / (this._loopEnd - this._loopStart);
				} else {
					return 0;
				}
			}
		});

		/**
		 *  The transports current tick position.
		 *  
		 *  @memberOf Tone.Transport#
		 *  @type {Ticks}
		 *  @name ticks
		 */
		Object.defineProperty(Tone.Transport.prototype, "ticks", {
			get : function(){
				return this._clock.ticks;
			},
			set : function(t){
				this._clock.ticks = t;
			}
		});

		/**
		 *  Pulses Per Quarter note. This is the smallest resolution
		 *  the Transport timing supports. This should be set once
		 *  on initialization and not set again. Changing this value 
		 *  after other objects have been created can cause problems. 
		 *  
		 *  @memberOf Tone.Transport#
		 *  @type {Number}
		 *  @name PPQ
		 */
		Object.defineProperty(Tone.Transport.prototype, "PPQ", {
			get : function(){
				return this._ppq;
			},
			set : function(ppq){
				this._ppq = ppq;
				this.bpm.value = this.bpm.value;
			}
		});

		/**
		 *  Convert from BPM to frequency (factoring in PPQ)
		 *  @param  {BPM}  bpm The BPM value to convert to frequency
		 *  @return  {Frequency}  The BPM as a frequency with PPQ factored in.
		 *  @private
		 */
		Tone.Transport.prototype._fromUnits = function(bpm){
			return 1 / (60 / bpm / this.PPQ);
		};

		/**
		 *  Convert from frequency (with PPQ) into BPM
		 *  @param  {Frequency}  freq The clocks frequency to convert to BPM
		 *  @return  {BPM}  The frequency value as BPM.
		 *  @private
		 */
		Tone.Transport.prototype._toUnits = function(freq){
			return (freq / this.PPQ) * 60;
		};

		///////////////////////////////////////////////////////////////////////////////
		//	SYNCING
		///////////////////////////////////////////////////////////////////////////////

		/**
		 *  Attaches the signal to the tempo control signal so that 
		 *  any changes in the tempo will change the signal in the same
		 *  ratio. 
		 *  
		 *  @param  {Tone.Signal} signal 
		 *  @param {number=} ratio Optionally pass in the ratio between
		 *                         the two signals. Otherwise it will be computed
		 *                         based on their current values. 
		 *  @returns {Tone.Transport} this
		 */
		Tone.Transport.prototype.syncSignal = function(signal, ratio){
			if (!ratio){
				//get the sync ratio
				if (signal._param.value !== 0){
					ratio = signal._param.value / this.bpm._param.value;
				} else {
					ratio = 0;
				}
			}
			var ratioSignal = new Tone.Gain(ratio);
			this.bpm.chain(ratioSignal, signal._param);
			this._syncedSignals.push({
				"ratio" : ratioSignal,
				"signal" : signal,
				"initial" : signal._param.value
			});
			signal._param.value = 0;
			return this;
		};

		/**
		 *  Unsyncs a previously synced signal from the transport's control. 
		 *  See Tone.Transport.syncSignal.
		 *  @param  {Tone.Signal} signal 
		 *  @returns {Tone.Transport} this
		 */
		Tone.Transport.prototype.unsyncSignal = function(signal){
			for (var i = this._syncedSignals.length - 1; i >= 0; i--){
				var syncedSignal = this._syncedSignals[i];
				if (syncedSignal.signal === signal){
					syncedSignal.ratio.dispose();
					syncedSignal.signal._param.value = syncedSignal.initial;
					this._syncedSignals.splice(i, 1);
				}
			}
			return this;
		};

		/**
		 *  Clean up. 
		 *  @returns {Tone.Transport} this
		 *  @private
		 */
		Tone.Transport.prototype.dispose = function(){
			Tone.Emitter.prototype.dispose.call(this);
			this._clock.dispose();
			this._clock = null;
			this._writable("bpm");
			this.bpm = null;
			this._timeline.dispose();
			this._timeline = null;
			this._onceEvents.dispose();
			this._onceEvents = null;
			this._repeatedEvents.dispose();
			this._repeatedEvents = null;
			return this;
		};

		///////////////////////////////////////////////////////////////////////////////
		//	INITIALIZATION
		///////////////////////////////////////////////////////////////////////////////

		var TransportConstructor = Tone.Transport;

		Tone._initAudioContext(function(){
			if (typeof Tone.Transport === "function"){
				//a single transport object
				Tone.Transport = new Tone.Transport();
			} else {
				//stop the clock
				Tone.Transport.stop();
				//get the previous values
				var prevSettings = Tone.Transport.get();
				//destory the old transport
				Tone.Transport.dispose();
				//make new Transport insides
				TransportConstructor.call(Tone.Transport);
				//set the previous config
				Tone.Transport.set(prevSettings);
			}
		});

		return Tone.Transport;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(30), __webpack_require__(37), __webpack_require__(45)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tone) {

		"use strict";

		/**
		 *  @class  A sample accurate clock which provides a callback at the given rate. 
		 *          While the callback is not sample-accurate (it is still susceptible to
		 *          loose JS timing), the time passed in as the argument to the callback
		 *          is precise. For most applications, it is better to use Tone.Transport
		 *          instead of the Clock by itself since you can synchronize multiple callbacks.
		 *
		 * 	@constructor
		 * 	@extends {Tone}
		 * 	@param {function} callback The callback to be invoked with the time of the audio event
		 * 	@param {Frequency} frequency The rate of the callback
		 * 	@example
		 * //the callback will be invoked approximately once a second
		 * //and will print the time exactly once a second apart.
		 * var clock = new Tone.Clock(function(time){
		 * 	console.log(time);
		 * }, 1);
		 */
		Tone.Clock = function(){

			var options = this.optionsObject(arguments, ["callback", "frequency"], Tone.Clock.defaults);

			/**
			 *  The callback function to invoke at the scheduled tick.
			 *  @type  {Function}
			 */
			this.callback = options.callback;

			/**
			 *  The time which the clock will schedule events in advance
			 *  of the current time. Scheduling notes in advance improves
			 *  performance and decreases the chance for clicks caused
			 *  by scheduling events in the past. If set to "auto",
			 *  this value will be automatically computed based on the 
			 *  rate of requestAnimationFrame (0.016 seconds). Larger values
			 *  will yeild better performance, but at the cost of latency. 
			 *  Values less than 0.016 are not recommended.
			 *  @type {Number|String}
			 */
			this._lookAhead = "auto";

			/**
			 *  The lookahead value which was automatically
			 *  computed using a time-based averaging.
			 *  @type {Number}
			 *  @private
			 */
			this._computedLookAhead = 1/60;

			/**
			 *  The value afterwhich events are thrown out
			 *  @type {Number}
			 *  @private
			 */
			this._threshold = 0.5;

			/**
			 *  The next time the callback is scheduled.
			 *  @type {Number}
			 *  @private
			 */
			this._nextTick = -1;

			/**
			 *  The last time the callback was invoked
			 *  @type  {Number}
			 *  @private
			 */
			this._lastUpdate = 0;

			/**
			 *  The id of the requestAnimationFrame
			 *  @type {Number}
			 *  @private
			 */
			this._loopID = -1;

			/**
			 *  The rate the callback function should be invoked. 
			 *  @type  {BPM}
			 *  @signal
			 */
			this.frequency = new Tone.TimelineSignal(options.frequency, Tone.Type.Frequency);

			/**
			 *  The number of times the callback was invoked. Starts counting at 0
			 *  and increments after the callback was invoked. 
			 *  @type {Ticks}
			 *  @readOnly
			 */
			this.ticks = 0;

			/**
			 *  The state timeline
			 *  @type {Tone.TimelineState}
			 *  @private
			 */
			this._state = new Tone.TimelineState(Tone.State.Stopped);

			/**
			 *  A pre-binded loop function to save a tiny bit of overhead
			 *  of rebinding the function on every frame.
			 *  @type  {Function}
			 *  @private
			 */
			this._boundLoop = this._loop.bind(this);

			this._readOnly("frequency");
			//start the loop
			this._loop();
		};

		Tone.extend(Tone.Clock);

		/**
		 *  The defaults
		 *  @const
		 *  @type  {Object}
		 */
		Tone.Clock.defaults = {
			"callback" : Tone.noOp,
			"frequency" : 1,
			"lookAhead" : "auto",
		};

		/**
		 *  Returns the playback state of the source, either "started", "stopped" or "paused".
		 *  @type {Tone.State}
		 *  @readOnly
		 *  @memberOf Tone.Clock#
		 *  @name state
		 */
		Object.defineProperty(Tone.Clock.prototype, "state", {
			get : function(){
				return this._state.getStateAtTime(this.now());
			}
		});

		/**
		 *  The time which the clock will schedule events in advance
		 *  of the current time. Scheduling notes in advance improves
		 *  performance and decreases the chance for clicks caused
		 *  by scheduling events in the past. If set to "auto",
		 *  this value will be automatically computed based on the 
		 *  rate of requestAnimationFrame (0.016 seconds). Larger values
		 *  will yeild better performance, but at the cost of latency. 
		 *  Values less than 0.016 are not recommended.
		 *  @type {Number|String}
		 *  @memberOf Tone.Clock#
		 *  @name lookAhead
		 */
		Object.defineProperty(Tone.Clock.prototype, "lookAhead", {
			get : function(){
				return this._lookAhead;
			},
			set : function(val){
				if (val === "auto"){
					this._lookAhead = "auto";
				} else {
					this._lookAhead = this.toSeconds(val);
				}
			}
		});


		/**
		 *  Start the clock at the given time. Optionally pass in an offset
		 *  of where to start the tick counter from.
		 *  @param  {Time}  time    The time the clock should start
		 *  @param  {Ticks=}  offset  Where the tick counter starts counting from.
		 *  @return  {Tone.Clock}  this
		 */
		Tone.Clock.prototype.start = function(time, offset){
			time = this.toSeconds(time);
			if (this._state.getStateAtTime(time) !== Tone.State.Started){
				this._state.addEvent({
					"state" : Tone.State.Started, 
					"time" : time,
					"offset" : offset
				});
			}
			return this;	
		};

		/**
		 *  Stop the clock. Stopping the clock resets the tick counter to 0.
		 *  @param {Time} [time=now] The time when the clock should stop.
		 *  @returns {Tone.Clock} this
		 *  @example
		 * clock.stop();
		 */
		Tone.Clock.prototype.stop = function(time){
			time = this.toSeconds(time);
			if (this._state.getStateAtTime(time) !== Tone.State.Stopped){
				this._state.setStateAtTime(Tone.State.Stopped, time);
			}
			return this;	
		};


		/**
		 *  Pause the clock. Pausing does not reset the tick counter.
		 *  @param {Time} [time=now] The time when the clock should stop.
		 *  @returns {Tone.Clock} this
		 */
		Tone.Clock.prototype.pause = function(time){
			time = this.toSeconds(time);
			if (this._state.getStateAtTime(time) === Tone.State.Started){
				this._state.setStateAtTime(Tone.State.Paused, time);
			}
			return this;	
		};

		/**
		 *  The scheduling loop.
		 *  @param  {Number}  time  The current page time starting from 0
		 *                          when the page was loaded.
		 *  @private
		 */
		Tone.Clock.prototype._loop = function(time){
			this._loopID = requestAnimationFrame(this._boundLoop);
			//compute the look ahead
			if (this._lookAhead === "auto"){
				if (!this.isUndef(time)){
					var diff = (time - this._lastUpdate) / 1000;
					this._lastUpdate = time;
					//throw away large differences
					if (diff < this._threshold){
						//averaging
						this._computedLookAhead = (9 * this._computedLookAhead + diff) / 10;
					}
				}
			} else {
				this._computedLookAhead = this._lookAhead;
			}
			//get the frequency value to compute the value of the next loop
			var now = this.now();
			//if it's started
			var lookAhead = this._computedLookAhead * 2;
			var event = this._state.getEvent(now + lookAhead);
			var state = Tone.State.Stopped;
			if (event){
				state = event.state;
				//if it was stopped and now started
				if (this._nextTick === -1 && state === Tone.State.Started){
					this._nextTick = event.time;
					if (!this.isUndef(event.offset)){
						this.ticks = event.offset;
					}
				}
			}
			if (state === Tone.State.Started){
				while (now + lookAhead > this._nextTick){
					//catch up
					if (now > this._nextTick + this._threshold){
						this._nextTick = now;
					}
					var tickTime = this._nextTick;
					this._nextTick += 1 / this.frequency.getValueAtTime(this._nextTick);
					this.callback(tickTime);
					this.ticks++;
				}
			} else if (state === Tone.State.Stopped){
				this._nextTick = -1;
				this.ticks = 0;
			}
		};

		/**
		 *  Returns the scheduled state at the given time.
		 *  @param  {Time}  time  The time to query.
		 *  @return  {String}  The name of the state input in setStateAtTime.
		 *  @example
		 * clock.start("+0.1");
		 * clock.getStateAtTime("+0.1"); //returns "started"
		 */
		Tone.Clock.prototype.getStateAtTime = function(time){
			return this._state.getStateAtTime(time);
		};

		/**
		 *  Clean up
		 *  @returns {Tone.Clock} this
		 */
		Tone.Clock.prototype.dispose = function(){
			cancelAnimationFrame(this._loopID);
			Tone.TimelineState.prototype.dispose.call(this);
			this._writable("frequency");
			this.frequency.dispose();
			this.frequency = null;
			this._boundLoop = Tone.noOp;
			this._nextTick = Infinity;
			this.callback = null;
			this._state.dispose();
			this._state = null;
		};

		return Tone.Clock;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(30), __webpack_require__(38), __webpack_require__(44)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tone) {

		"use strict";

		/**
		 *  @class A signal which adds the method getValueAtTime. 
		 *         Code and inspiration from https://github.com/jsantell/web-audio-automation-timeline
		 *  @extends {Tone.Param}
		 *  @param {Number=} value The initial value of the signal
		 *  @param {String=} units The conversion units of the signal.
		 */
		Tone.TimelineSignal = function(){

			var options = this.optionsObject(arguments, ["value", "units"], Tone.Signal.defaults);

			//constructors
			Tone.Signal.apply(this, options);
			options.param = this._param;
			Tone.Param.call(this, options);

			/**
			 *  The scheduled events
			 *  @type {Tone.Timeline}
			 *  @private
			 */
			this._events = new Tone.Timeline(10);

			/**
			 *  The initial scheduled value
			 *  @type {Number}
			 *  @private
			 */
			this._initial = this._fromUnits(this._param.value);
		};

		Tone.extend(Tone.TimelineSignal, Tone.Param);

		/**
		 *  The event types of a schedulable signal.
		 *  @enum {String}
		 */
		Tone.TimelineSignal.Type = {
			Linear : "linear",
			Exponential : "exponential",
			Target : "target",
			Set : "set"
		};

		/**
		 * The current value of the signal. 
		 * @memberOf Tone.TimelineSignal#
		 * @type {Number}
		 * @name value
		 */
		Object.defineProperty(Tone.TimelineSignal.prototype, "value", {
			get : function(){
				return this._toUnits(this._param.value);
			},
			set : function(value){
				var convertedVal = this._fromUnits(value);
				this._initial = convertedVal;
				this._param.value = convertedVal;
			}
		});

		///////////////////////////////////////////////////////////////////////////
		//	SCHEDULING
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  Schedules a parameter value change at the given time.
		 *  @param {*}	value The value to set the signal.
		 *  @param {Time}  time The time when the change should occur.
		 *  @returns {Tone.TimelineSignal} this
		 *  @example
		 * //set the frequency to "G4" in exactly 1 second from now. 
		 * freq.setValueAtTime("G4", "+1");
		 */
		Tone.TimelineSignal.prototype.setValueAtTime = function (value, startTime) {
			value = this._fromUnits(value);
			startTime = this.toSeconds(startTime);
			this._events.addEvent({
				"type" : Tone.TimelineSignal.Type.Set,
				"value" : value,
				"time" : startTime
			});
			//invoke the original event
			this._param.setValueAtTime(value, startTime);
			return this;
		};

		/**
		 *  Schedules a linear continuous change in parameter value from the 
		 *  previous scheduled parameter value to the given value.
		 *  
		 *  @param  {number} value   
		 *  @param  {Time} endTime 
		 *  @returns {Tone.TimelineSignal} this
		 */
		Tone.TimelineSignal.prototype.linearRampToValueAtTime = function (value, endTime) {
			value = this._fromUnits(value);
			endTime = this.toSeconds(endTime);
			this._events.addEvent({
				"type" : Tone.TimelineSignal.Type.Linear,
				"value" : value,
				"time" : endTime
			});
			this._param.linearRampToValueAtTime(value, endTime);
			return this;
		};

		/**
		 *  Schedules an exponential continuous change in parameter value from 
		 *  the previous scheduled parameter value to the given value.
		 *  
		 *  @param  {number} value   
		 *  @param  {Time} endTime 
		 *  @returns {Tone.TimelineSignal} this
		 */
		Tone.TimelineSignal.prototype.exponentialRampToValueAtTime = function (value, endTime) {
			//get the previous event and make sure it's not starting from 0
			var beforeEvent = this._searchBefore(endTime);
			if (beforeEvent && beforeEvent.value === 0){
				//reschedule that event
				this.setValueAtTime(this._minOutput, beforeEvent.time);
			}
			value = this._fromUnits(value);
			var setValue = Math.max(value, this._minOutput);
			endTime = this.toSeconds(endTime);
			this._events.addEvent({
				"type" : Tone.TimelineSignal.Type.Exponential,
				"value" : setValue,
				"time" : endTime
			});
			//if the ramped to value is 0, make it go to the min output, and then set to 0.
			if (value < this._minOutput){
				this._param.exponentialRampToValueAtTime(this._minOutput, endTime - 1 / Tone.context.sampleRate);
				this.setValueAtTime(0, endTime);
			} else {
				this._param.exponentialRampToValueAtTime(value, endTime);
			}
			return this;
		};

		/**
		 *  Start exponentially approaching the target value at the given time with
		 *  a rate having the given time constant.
		 *  @param {number} value        
		 *  @param {Time} startTime    
		 *  @param {number} timeConstant 
		 *  @returns {Tone.TimelineSignal} this 
		 */
		Tone.TimelineSignal.prototype.setTargetAtTime = function (value, startTime, timeConstant) {
			value = this._fromUnits(value);
			value = Math.max(this._minOutput, value);
			timeConstant = Math.max(this._minOutput, timeConstant);
			startTime = this.toSeconds(startTime);
			this._events.addEvent({
				"type" : Tone.TimelineSignal.Type.Target,
				"value" : value,
				"time" : startTime,
				"constant" : timeConstant
			});
			this._param.setTargetAtTime(value, startTime, timeConstant);
			return this;
		};

		/**
		 *  Cancels all scheduled parameter changes with times greater than or 
		 *  equal to startTime.
		 *  
		 *  @param  {Time} startTime
		 *  @returns {Tone.TimelineSignal} this
		 */
		Tone.TimelineSignal.prototype.cancelScheduledValues = function (after) {
			this._events.cancel(after);
			this._param.cancelScheduledValues(this.toSeconds(after));
			return this;
		};

		/**
		 *  Sets the computed value at the given time. This provides
		 *  a point from which a linear or exponential curve
		 *  can be scheduled after. Will cancel events after 
		 *  the given time and shorten the currently scheduled
		 *  linear or exponential ramp so that it ends at `time` .
		 *  This is to avoid discontinuities and clicks in envelopes. 
		 *  @param {Time} time When to set the ramp point
		 *  @returns {Tone.TimelineSignal} this
		 */
		Tone.TimelineSignal.prototype.setRampPoint = function (time) {
			time = this.toSeconds(time);
			//get the value at the given time
			var val = this.getValueAtTime(time);
			//if there is an event at the given time
			//and that even is not a "set"
			var before = this._searchBefore(time);
			if (before && before.time === time){
				//remove everything after
				this.cancelScheduledValues(time + this.sampleTime);
			} else {
				//reschedule the next event to end at the given time
				var after = this._searchAfter(time);
				if (after){
					//cancel the next event(s)
					this.cancelScheduledValues(time);
					if (after.type === Tone.TimelineSignal.Type.Linear){
						this.linearRampToValueAtTime(val, time);
					} else if (after.type === Tone.TimelineSignal.Type.Exponential){
						this.exponentialRampToValueAtTime(val, time);
					} 
				} 
				this.setValueAtTime(val, time);
			}
			return this;
		};

		/**
		 *  Do a linear ramp to the given value between the start and finish times.
		 *  @param {Number} value The value to ramp to.
		 *  @param {Time} start The beginning anchor point to do the linear ramp
		 *  @param {Time} finish The ending anchor point by which the value of
		 *                       the signal will equal the given value.
		 *  @returns {Tone.TimelineSignal} this
		 */
		Tone.TimelineSignal.prototype.linearRampToValueBetween = function (value, start, finish) {
			this.setRampPoint(start);
			this.linearRampToValueAtTime(value, finish);
			return this;
		};

		/**
		 *  Do a exponential ramp to the given value between the start and finish times.
		 *  @param {Number} value The value to ramp to.
		 *  @param {Time} start The beginning anchor point to do the exponential ramp
		 *  @param {Time} finish The ending anchor point by which the value of
		 *                       the signal will equal the given value.
		 *  @returns {Tone.TimelineSignal} this
		 */
		Tone.TimelineSignal.prototype.exponentialRampToValueBetween = function (value, start, finish) {
			this.setRampPoint(start);
			this.exponentialRampToValueAtTime(value, finish);
			return this;
		};

		///////////////////////////////////////////////////////////////////////////
		//	GETTING SCHEDULED VALUES
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  Returns the value before or equal to the given time
		 *  @param  {Number}  time  The time to query
		 *  @return  {Object}  The event at or before the given time.
		 *  @private
		 */
		Tone.TimelineSignal.prototype._searchBefore = function(time){
			return this._events.getEvent(time);
		};

		/**
		 *  The event after the given time
		 *  @param  {Number}  time  The time to query.
		 *  @return  {Object}  The next event after the given time
		 *  @private
		 */
		Tone.TimelineSignal.prototype._searchAfter = function(time){
			return this._events.getEventAfter(time);
		};

		/**
		 *  Get the scheduled value at the given time. This will
		 *  return the unconverted (raw) value.
		 *  @param  {Number}  time  The time in seconds.
		 *  @return  {Number}  The scheduled value at the given time.
		 */
		Tone.TimelineSignal.prototype.getValueAtTime = function(time){
			var after = this._searchAfter(time);
			var before = this._searchBefore(time);
			var value = this._initial;
			//if it was set by
			if (before === null){
				value = this._initial;
			} else if (before.type === Tone.TimelineSignal.Type.Target){
				var previous = this._events.getEventBefore(before.time);
				var previouVal;
				if (previous === null){
					previouVal = this._initial;
				} else {
					previouVal = previous.value;
				}
				value = this._exponentialApproach(before.time, previouVal, before.value, before.constant, time);
			} else if (after === null){
				value = before.value;
			} else if (after.type === Tone.TimelineSignal.Type.Linear){
				value = this._linearInterpolate(before.time, before.value, after.time, after.value, time);
			} else if (after.type === Tone.TimelineSignal.Type.Exponential){
				value = this._exponentialInterpolate(before.time, before.value, after.time, after.value, time);
			} else {
				value = before.value;
			}
			return value;
		};

		/**
		 *  When signals connect to other signals or AudioParams, 
		 *  they take over the output value of that signal or AudioParam. 
		 *  For all other nodes, the behavior is the same as a default <code>connect</code>. 
		 *
		 *  @override
		 *  @param {AudioParam|AudioNode|Tone.Signal|Tone} node 
		 *  @param {number} [outputNumber=0] The output number to connect from.
		 *  @param {number} [inputNumber=0] The input number to connect to.
		 *  @returns {Tone.TimelineSignal} this
		 *  @method
		 */
		Tone.TimelineSignal.prototype.connect = Tone.SignalBase.prototype.connect;


		///////////////////////////////////////////////////////////////////////////
		//	AUTOMATION CURVE CALCULATIONS
		//	MIT License, copyright (c) 2014 Jordan Santell
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  Calculates the the value along the curve produced by setTargetAtTime
		 *  @private
		 */
		Tone.TimelineSignal.prototype._exponentialApproach = function (t0, v0, v1, timeConstant, t) {
			return v1 + (v0 - v1) * Math.exp(-(t - t0) / timeConstant);
		};

		/**
		 *  Calculates the the value along the curve produced by linearRampToValueAtTime
		 *  @private
		 */
		Tone.TimelineSignal.prototype._linearInterpolate = function (t0, v0, t1, v1, t) {
			return v0 + (v1 - v0) * ((t - t0) / (t1 - t0));
		};

		/**
		 *  Calculates the the value along the curve produced by exponentialRampToValueAtTime
		 *  @private
		 */
		Tone.TimelineSignal.prototype._exponentialInterpolate = function (t0, v0, t1, v1, t) {
			v0 = Math.max(this._minOutput, v0);
			return v0 * Math.pow(v1 / v0, (t - t0) / (t1 - t0));
		};

		/**
		 *  Clean up.
		 *  @return {Tone.TimelineSignal} this
		 */
		Tone.TimelineSignal.prototype.dispose = function(){
			Tone.Signal.prototype.dispose.call(this);
			Tone.Param.prototype.dispose.call(this);
			this._events.dispose();
			this._events = null;
		};

		return Tone.TimelineSignal;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(30), __webpack_require__(39), __webpack_require__(41), __webpack_require__(42), __webpack_require__(43)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class  A signal is an audio-rate value. Tone.Signal is a core component of the library.
		 *          Unlike a number, Signals can be scheduled with sample-level accuracy. Tone.Signal
		 *          has all of the methods available to native Web Audio 
		 *          [AudioParam](http://webaudio.github.io/web-audio-api/#the-audioparam-interface)
		 *          as well as additional conveniences. Read more about working with signals 
		 *          [here](https://github.com/Tonejs/Tone.js/wiki/Signals).
		 *
		 *  @constructor
		 *  @extends {Tone.Param}
		 *  @param {Number|AudioParam} [value] Initial value of the signal. If an AudioParam
		 *                                     is passed in, that parameter will be wrapped
		 *                                     and controlled by the Signal. 
		 *  @param {string} [units=Number] unit The units the signal is in. 
		 *  @example
		 * var signal = new Tone.Signal(10);
		 */
		Tone.Signal = function(){

			var options = this.optionsObject(arguments, ["value", "units"], Tone.Signal.defaults);

			/**
			 * The node where the constant signal value is scaled.
			 * @type {GainNode}
			 * @private
			 */
			this.output = this._gain = this.context.createGain();

			options.param = this._gain.gain;
			Tone.Param.call(this, options);

			/**
			 * The node where the value is set.
			 * @type {Tone.Param}
			 * @private
			 */
			this.input = this._param = this._gain.gain;

			//connect the const output to the node output
			Tone.Signal._constant.chain(this._gain);
		};

		Tone.extend(Tone.Signal, Tone.Param);

		/**
		 *  The default values
		 *  @type  {Object}
		 *  @static
		 *  @const
		 */
		Tone.Signal.defaults = {
			"value" : 0,
			"units" : Tone.Type.Default,
			"convert" : true,
		};

		/**
		 *  When signals connect to other signals or AudioParams, 
		 *  they take over the output value of that signal or AudioParam. 
		 *  For all other nodes, the behavior is the same as a default <code>connect</code>. 
		 *
		 *  @override
		 *  @param {AudioParam|AudioNode|Tone.Signal|Tone} node 
		 *  @param {number} [outputNumber=0] The output number to connect from.
		 *  @param {number} [inputNumber=0] The input number to connect to.
		 *  @returns {Tone.SignalBase} this
		 *  @method
		 */
		Tone.Signal.prototype.connect = Tone.SignalBase.prototype.connect;

		/**
		 *  dispose and disconnect
		 *  @returns {Tone.Signal} this
		 */
		Tone.Signal.prototype.dispose = function(){
			Tone.Param.prototype.dispose.call(this);
			this._param = null;
			this._gain.disconnect();
			this._gain = null;
			return this;
		};

		///////////////////////////////////////////////////////////////////////////
		//	STATIC
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  Generates a constant output of 1.
		 *  @static
		 *  @private
		 *  @const
		 *  @type {AudioBufferSourceNode}
		 */
		Tone.Signal._constant = null;

		/**
		 *  initializer function
		 */
		Tone._initAudioContext(function(audioContext){
			var buffer = audioContext.createBuffer(1, 128, audioContext.sampleRate);
			var arr = buffer.getChannelData(0);
			for (var i = 0; i < arr.length; i++){
				arr[i] = 1;
			}
			Tone.Signal._constant = audioContext.createBufferSource();
			Tone.Signal._constant.channelCount = 1;
			Tone.Signal._constant.channelCountMode = "explicit";
			Tone.Signal._constant.buffer = buffer;
			Tone.Signal._constant.loop = true;
			Tone.Signal._constant.start(0);
			Tone.Signal._constant.noGC();
		});

		return Tone.Signal;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(30), __webpack_require__(40)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class Wraps the native Web Audio API 
		 *         [WaveShaperNode](http://webaudio.github.io/web-audio-api/#the-waveshapernode-interface).
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @param {function|Array|Number} mapping The function used to define the values. 
		 *                                    The mapping function should take two arguments: 
		 *                                    the first is the value at the current position 
		 *                                    and the second is the array position. 
		 *                                    If the argument is an array, that array will be
		 *                                    set as the wave shaping function. The input
		 *                                    signal is an AudioRange [-1, 1] value and the output
		 *                                    signal can take on any numerical values. 
		 *                                    
		 *  @param {Number} [bufferLen=1024] The length of the WaveShaperNode buffer.
		 *  @example
		 * var timesTwo = new Tone.WaveShaper(function(val){
		 * 	return val * 2;
		 * }, 2048);
		 *  @example
		 * //a waveshaper can also be constructed with an array of values
		 * var invert = new Tone.WaveShaper([1, -1]);
		 */
		Tone.WaveShaper = function(mapping, bufferLen){

			/**
			 *  the waveshaper
			 *  @type {WaveShaperNode}
			 *  @private
			 */
			this._shaper = this.input = this.output = this.context.createWaveShaper();

			/**
			 *  the waveshapers curve
			 *  @type {Float32Array}
			 *  @private
			 */
			this._curve = null;

			if (Array.isArray(mapping)){
				this.curve = mapping;
			} else if (isFinite(mapping) || this.isUndef(mapping)){
				this._curve = new Float32Array(this.defaultArg(mapping, 1024));
			} else if (this.isFunction(mapping)){
				this._curve = new Float32Array(this.defaultArg(bufferLen, 1024));
				this.setMap(mapping);
			} 
		};

		Tone.extend(Tone.WaveShaper, Tone.SignalBase);

		/**
		 *  Uses a mapping function to set the value of the curve. 
		 *  @param {function} mapping The function used to define the values. 
		 *                            The mapping function take two arguments: 
		 *                            the first is the value at the current position 
		 *                            which goes from -1 to 1 over the number of elements
		 *                            in the curve array. The second argument is the array position. 
		 *  @returns {Tone.WaveShaper} this
		 *  @example
		 * //map the input signal from [-1, 1] to [0, 10]
		 * shaper.setMap(function(val, index){
		 * 	return (val + 1) * 5;
		 * })
		 */
		Tone.WaveShaper.prototype.setMap = function(mapping){
			for (var i = 0, len = this._curve.length; i < len; i++){
				var normalized = (i / (len)) * 2 - 1;
				this._curve[i] = mapping(normalized, i);
			}
			this._shaper.curve = this._curve;
			return this;
		};

		/**
		 * The array to set as the waveshaper curve. For linear curves
		 * array length does not make much difference, but for complex curves
		 * longer arrays will provide smoother interpolation. 
		 * @memberOf Tone.WaveShaper#
		 * @type {Array}
		 * @name curve
		 */
		Object.defineProperty(Tone.WaveShaper.prototype, "curve", {
			get : function(){
				return this._shaper.curve;
			},
			set : function(mapping){
				this._curve = new Float32Array(mapping);
				this._shaper.curve = this._curve;
			}
		});

		/**
		 * Specifies what type of oversampling (if any) should be used when 
		 * applying the shaping curve. Can either be "none", "2x" or "4x". 
		 * @memberOf Tone.WaveShaper#
		 * @type {string}
		 * @name oversample
		 */
		Object.defineProperty(Tone.WaveShaper.prototype, "oversample", {
			get : function(){
				return this._shaper.oversample;
			},
			set : function(oversampling){
				if (["none", "2x", "4x"].indexOf(oversampling) !== -1){
					this._shaper.oversample = oversampling;
				} else {
					throw new Error("invalid oversampling: "+oversampling);
				}
			}
		});

		/**
		 *  Clean up.
		 *  @returns {Tone.WaveShaper} this
		 */
		Tone.WaveShaper.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._shaper.disconnect();
			this._shaper = null;
			this._curve = null;
			return this;
		};

		return Tone.WaveShaper;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(30)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class  Base class for all Signals. Used Internally. 
		 *
		 *  @constructor
		 *  @extends {Tone}
		 */
		Tone.SignalBase = function(){};

		Tone.extend(Tone.SignalBase);

		/**
		 *  When signals connect to other signals or AudioParams, 
		 *  they take over the output value of that signal or AudioParam. 
		 *  For all other nodes, the behavior is the same as a default <code>connect</code>. 
		 *
		 *  @override
		 *  @param {AudioParam|AudioNode|Tone.Signal|Tone} node 
		 *  @param {number} [outputNumber=0] The output number to connect from.
		 *  @param {number} [inputNumber=0] The input number to connect to.
		 *  @returns {Tone.SignalBase} this
		 */
		Tone.SignalBase.prototype.connect = function(node, outputNumber, inputNumber){
			//zero it out so that the signal can have full control
			if ((Tone.Signal && Tone.Signal === node.constructor) || 
					(Tone.Param && Tone.Param === node.constructor) || 
					(Tone.TimelineSignal && Tone.TimelineSignal === node.constructor)){
				//cancel changes
				node._param.cancelScheduledValues(0);
				//reset the value
				node._param.value = 0;
				//mark the value as overridden
				node.overridden = true;
			} else if (node instanceof AudioParam){
				node.cancelScheduledValues(0);
				node.value = 0;
			} 
			Tone.prototype.connect.call(this, node, outputNumber, inputNumber);
			return this;
		};

		return Tone.SignalBase;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(30)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tone) {

		"use strict";

		///////////////////////////////////////////////////////////////////////////
		//	TYPES
		///////////////////////////////////////////////////////////////////////////

		/**
		 * Units which a value can take on.
		 * @enum {String}
		 */
		Tone.Type = {
			/** 
			 *  The default value is a number which can take on any value between [-Infinity, Infinity]
			 */
			Default : "number",
			/**
			 *  Time can be described in a number of ways. Read more [Time](https://github.com/Tonejs/Tone.js/wiki/Time).
			 *
			 *  <ul>
			 *  <li>Numbers, which will be taken literally as the time (in seconds).</li>
			 *  <li>Notation, ("4n", "8t") describes time in BPM and time signature relative values.</li>
			 *  <li>TransportTime, ("4:3:2") will also provide tempo and time signature relative times 
			 *  in the form BARS:QUARTERS:SIXTEENTHS.</li>
			 *  <li>Frequency, ("8hz") is converted to the length of the cycle in seconds.</li>
			 *  <li>Now-Relative, ("+1") prefix any of the above with "+" and it will be interpreted as 
			 *  "the current time plus whatever expression follows".</li>
			 *  <li>Expressions, ("3:0 + 2 - (1m / 7)") any of the above can also be combined 
			 *  into a mathematical expression which will be evaluated to compute the desired time.</li>
			 *  <li>No Argument, for methods which accept time, no argument will be interpreted as 
			 *  "now" (i.e. the currentTime).</li>
			 *  </ul>
			 *  
			 *  @typedef {Time}
			 */
			Time : "time",
			/**
			 *  Frequency can be described similar to time, except ultimately the
			 *  values are converted to frequency instead of seconds. A number
			 *  is taken literally as the value in hertz. Additionally any of the 
			 *  Time encodings can be used. Note names in the form
			 *  of NOTE OCTAVE (i.e. C4) are also accepted and converted to their
			 *  frequency value. 
			 *  @typedef {Frequency}
			 */
			Frequency : "frequency",
			/** 
			 *  Normal values are within the range [0, 1].
			 *  @typedef {NormalRange}
			 */
			NormalRange : "normalRange",
			/** 
			 *  AudioRange values are between [-1, 1].
			 *  @typedef {AudioRange}
			 */
			AudioRange : "audioRange",
			/** 
			 *  Decibels are a logarithmic unit of measurement which is useful for volume
			 *  because of the logarithmic way that we perceive loudness. 0 decibels 
			 *  means no change in volume. -10db is approximately half as loud and 10db 
			 *  is twice is loud. 
			 *  @typedef {Decibels}
			 */
			Decibels : "db",
			/** 
			 *  Half-step note increments, i.e. 12 is an octave above the root. and 1 is a half-step up.
			 *  @typedef {Interval}
			 */
			Interval : "interval",
			/** 
			 *  Beats per minute. 
			 *  @typedef {BPM}
			 */
			BPM : "bpm",
			/** 
			 *  The value must be greater than or equal to 0.
			 *  @typedef {Positive}
			 */
			Positive : "positive",
			/** 
			 *  A cent is a hundredth of a semitone. 
			 *  @typedef {Cents}
			 */
			Cents : "cents",
			/** 
			 *  Angle between 0 and 360. 
			 *  @typedef {Degrees}
			 */
			Degrees : "degrees",
			/** 
			 *  A number representing a midi note.
			 *  @typedef {MIDI}
			 */
			MIDI : "midi",
			/** 
			 *  A colon-separated representation of time in the form of
			 *  BARS:QUARTERS:SIXTEENTHS. 
			 *  @typedef {TransportTime}
			 */
			TransportTime : "transportTime",
			/** 
			 *  Ticks are the basic subunit of the Transport. They are
			 *  the smallest unit of time that the Transport supports.
			 *  @typedef {Ticks}
			 */
			Ticks : "tick",
			/** 
			 *  A frequency represented by a letter name, 
			 *  accidental and octave. This system is known as
			 *  [Scientific Pitch Notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation).
			 *  @typedef {Note}
			 */
			Note : "note",
			/** 
			 *  One millisecond is a thousandth of a second. 
			 *  @typedef {Milliseconds}
			 */
			Milliseconds : "milliseconds",
			/** 
			 *  A string representing a duration relative to a measure. 
			 *  <ul>
			 *  	<li>"4n" = quarter note</li>
			 *   	<li>"2m" = two measures</li>
			 *    	<li>"8t" = eighth-note triplet</li>
			 *  </ul>
			 *  @typedef {Notation}
			 */
			Notation : "notation",
		};

		///////////////////////////////////////////////////////////////////////////
		//	MATCHING TESTS
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  Test if a function is "now-relative", i.e. starts with "+".
		 *  
		 *  @param {String} str The string to test
		 *  @return {boolean} 
		 *  @method isNowRelative
		 *  @lends Tone.prototype.isNowRelative
		 */
		Tone.prototype.isNowRelative = (function(){
			var nowRelative = new RegExp(/^\s*\+(.)+/i);
			return function(note){
				return nowRelative.test(note);
			};
		})();

		/**
		 *  Tests if a string is in Ticks notation. 
		 *  
		 *  @param {String} str The string to test
		 *  @return {boolean} 
		 *  @method isTicks
		 *  @lends Tone.prototype.isTicks
		 */
		Tone.prototype.isTicks = (function(){
			var tickFormat = new RegExp(/^\d+i$/i);
			return function(note){
				return tickFormat.test(note);
			};
		})();

		/**
		 *  Tests if a string is musical notation.
		 *  i.e.:
		 *  <ul>
		 *  	<li>4n = quarter note</li>
		 *   	<li>2m = two measures</li>
		 *    	<li>8t = eighth-note triplet</li>
		 *  </ul>
		 *  
		 *  @param {String} str The string to test
		 *  @return {boolean} 
		 *  @method isNotation
		 *  @lends Tone.prototype.isNotation
		 */
		Tone.prototype.isNotation = (function(){
			var notationFormat = new RegExp(/^[0-9]+[mnt]$/i);
			return function(note){
				return notationFormat.test(note);
			};
		})();

		/**
		 *  Test if a string is in the transportTime format. 
		 *  "Bars:Beats:Sixteenths"
		 *  @param {String} transportTime
		 *  @return {boolean} 
		 *  @method isTransportTime
		 *  @lends Tone.prototype.isTransportTime
		 */
		Tone.prototype.isTransportTime = (function(){
			var transportTimeFormat = new RegExp(/^(\d+(\.\d+)?\:){1,2}(\d+(\.\d+)?)?$/i);
			return function(transportTime){
				return transportTimeFormat.test(transportTime);
			};
		})();

		/**
		 *  Test if a string is in Scientific Pitch Notation: i.e. "C4". 
		 *  @param  {String}  note The note to test
		 *  @return {boolean}      true if it's in the form of a note
		 *  @method isNote
		 *  @lends Tone.prototype.isNote
		 *  @function
		 */
		Tone.prototype.isNote = ( function(){
			var noteFormat = new RegExp(/^[a-g]{1}(b|#|x|bb)?-?[0-9]+$/i);
			return function(note){
				return noteFormat.test(note);
			};
		})();

		/**
		 *  Test if the input is in the format of number + hz
		 *  i.e.: 10hz
		 *
		 *  @param {String} freq 
		 *  @return {boolean} 
		 *  @function
		 */
		Tone.prototype.isFrequency = (function(){
			var freqFormat = new RegExp(/^\d*\.?\d+hz$/i);
			return function(freq){
				return freqFormat.test(freq);
			};
		})();

		///////////////////////////////////////////////////////////////////////////
		//	TO SECOND CONVERSIONS
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  @private
		 *  @return  {Object}  The Transport's BPM if the Transport exists, 
		 *                         otherwise returns reasonable defaults.
		 */
		function getTransportBpm(){
			if (Tone.Transport && Tone.Transport.bpm){
				return Tone.Transport.bpm.value;
			} else {
				return 120;
			}
		}

		/**
		 *  @private
		 *  @return  {Object}  The Transport's Time Signature if the Transport exists, 
		 *                         otherwise returns reasonable defaults.
		 */
		function getTransportTimeSignature(){
			if (Tone.Transport && Tone.Transport.timeSignature){
				return Tone.Transport.timeSignature;
			} else {
				return 4;
			}
		}

		/**
		 *
		 *  convert notation format strings to seconds
		 *  
		 *  @param  {String} notation     
		 *  @param {BPM=} bpm 
		 *  @param {number=} timeSignature 
		 *  @return {number} 
		 *                
		 */
		Tone.prototype.notationToSeconds = function(notation, bpm, timeSignature){
			bpm = this.defaultArg(bpm, getTransportBpm());
			timeSignature = this.defaultArg(timeSignature, getTransportTimeSignature());
			var beatTime = (60 / bpm);
			//special case: 1n = 1m
			if (notation === "1n"){
				notation = "1m";
			}
			var subdivision = parseInt(notation, 10);
			var beats = 0;
			if (subdivision === 0){
				beats = 0;
			}
			var lastLetter = notation.slice(-1);
			if (lastLetter === "t"){
				beats = (4 / subdivision) * 2/3;
			} else if (lastLetter === "n"){
				beats = 4 / subdivision;
			} else if (lastLetter === "m"){
				beats = subdivision * timeSignature;
			} else {
				beats = 0;
			}
			return beatTime * beats;
		};

		/**
		 *  convert transportTime into seconds.
		 *  
		 *  ie: 4:2:3 == 4 measures + 2 quarters + 3 sixteenths
		 *
		 *  @param  {TransportTime} transportTime 
		 *  @param {BPM=} bpm 
		 *  @param {number=} timeSignature
		 *  @return {number}               seconds
		 */
		Tone.prototype.transportTimeToSeconds = function(transportTime, bpm, timeSignature){
			bpm = this.defaultArg(bpm, getTransportBpm());
			timeSignature = this.defaultArg(timeSignature, getTransportTimeSignature());
			var measures = 0;
			var quarters = 0;
			var sixteenths = 0;
			var split = transportTime.split(":");
			if (split.length === 2){
				measures = parseFloat(split[0]);
				quarters = parseFloat(split[1]);
			} else if (split.length === 1){
				quarters = parseFloat(split[0]);
			} else if (split.length === 3){
				measures = parseFloat(split[0]);
				quarters = parseFloat(split[1]);
				sixteenths = parseFloat(split[2]);
			}
			var beats = (measures * timeSignature + quarters + sixteenths / 4);
			return beats * (60/bpm);
		};
		
		/**
		 *  Convert ticks into seconds
		 *  @param  {Ticks} ticks 
		 *  @param {BPM=} bpm 
		 *  @return {number}               seconds
		 */
		Tone.prototype.ticksToSeconds = function(ticks, bpm){
			if (this.isUndef(Tone.Transport)){
				return 0;
			}
			ticks = parseFloat(ticks);
			bpm = this.defaultArg(bpm, getTransportBpm());
			var tickTime = (60/bpm) / Tone.Transport.PPQ;
			return tickTime * ticks;
		};

		/**
		 *  Convert a frequency into seconds.
		 *  Accepts numbers and strings: i.e. "10hz" or 
		 *  10 both return 0.1. 
		 *  
		 *  @param  {Frequency} freq 
		 *  @return {number}      
		 */
		Tone.prototype.frequencyToSeconds = function(freq){
			return 1 / parseFloat(freq);
		};

		/**
		 *  Convert a sample count to seconds.
		 *  @param  {number} samples 
		 *  @return {number}         
		 */
		Tone.prototype.samplesToSeconds = function(samples){
			return samples / this.context.sampleRate;
		};

		/**
		 *  Convert from seconds to samples. 
		 *  @param  {number} seconds 
		 *  @return {number} The number of samples        
		 */
		Tone.prototype.secondsToSamples = function(seconds){
			return seconds * this.context.sampleRate;
		};

		///////////////////////////////////////////////////////////////////////////
		//	FROM SECOND CONVERSIONS
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  Convert seconds to transportTime in the form 
		 *  	"measures:quarters:sixteenths"
		 *
		 *  @param {Number} seconds 
		 *  @param {BPM=} bpm 
		 *  @param {Number=} timeSignature
		 *  @return {TransportTime}  
		 */
		Tone.prototype.secondsToTransportTime = function(seconds, bpm, timeSignature){
			bpm = this.defaultArg(bpm, getTransportBpm());
			timeSignature = this.defaultArg(timeSignature, getTransportTimeSignature());
			var quarterTime = 60/bpm;
			var quarters = seconds / quarterTime;
			var measures = Math.floor(quarters / timeSignature);
			var sixteenths = (quarters % 1) * 4;
			quarters = Math.floor(quarters) % timeSignature;
			var progress = [measures, quarters, sixteenths];
			return progress.join(":");
		};

		/**
		 *  Convert a number in seconds to a frequency.
		 *  @param  {number} seconds 
		 *  @return {number}         
		 */
		Tone.prototype.secondsToFrequency = function(seconds){
			return 1/seconds;
		};

		///////////////////////////////////////////////////////////////////////////
		//	GENERALIZED CONVERSIONS
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  Convert seconds to the closest transportTime in the form 
		 *  	measures:quarters:sixteenths
		 *
		 *  @method toTransportTime
		 *  
		 *  @param {Time} time 
		 *  @param {BPM=} bpm 
		 *  @param {number=} timeSignature
		 *  @return {TransportTime}  
		 *  
		 *  @lends Tone.prototype.toTransportTime
		 */
		Tone.prototype.toTransportTime = function(time, bpm, timeSignature){
			var seconds = this.toSeconds(time);
			return this.secondsToTransportTime(seconds, bpm, timeSignature);
		};

		/**
		 *  Convert a frequency representation into a number.
		 *  	
		 *  @param  {Frequency} freq 
		 *  @param {number=} 	now 	if passed in, this number will be 
		 *                        		used for all 'now' relative timings
		 *  @return {number}      the frequency in hertz
		 */
		Tone.prototype.toFrequency = function(freq, now){
			if (this.isFrequency(freq)){
				return parseFloat(freq);
			} else if (this.isNotation(freq) || this.isTransportTime(freq)) {
				return this.secondsToFrequency(this.toSeconds(freq, now));
			} else if (this.isNote(freq)){
				return this.noteToFrequency(freq);
			} else {
				return freq;
			}
		};

		/**
		 *  Convert the time representation into ticks.
		 *  Now-Relative timing will be relative to the current
		 *  Tone.Transport.ticks. 
		 *  @param  {Time} time
		 *  @return {Ticks}   
		 */
		Tone.prototype.toTicks = function(time){
			if (this.isUndef(Tone.Transport)){
				return 0;
			}
			var bpm = Tone.Transport.bpm.value;
			//get the seconds
			var plusNow = 0;
			if (this.isNowRelative(time)){
				time = time.replace("+", "");
				plusNow = Tone.Transport.ticks;
			} else if (this.isUndef(time)){
				return Tone.Transport.ticks;
			}
			var seconds = this.toSeconds(time);
			var quarter = 60/bpm;
			var quarters = seconds / quarter;
			var tickNum = quarters * Tone.Transport.PPQ;
			//align the tick value
			return Math.round(tickNum + plusNow);
		};

		/**
		 *  convert a time into samples
		 *  
		 *  @param  {Time} time
		 *  @return {number}         
		 */
		Tone.prototype.toSamples = function(time){
			var seconds = this.toSeconds(time);
			return Math.round(seconds * this.context.sampleRate);
		};

		/**
		 *  Convert Time into seconds.
		 *  
		 *  Unlike the method which it overrides, this takes into account 
		 *  transporttime and musical notation.
		 *
		 *  Time : 1.40
		 *  Notation: 4n|1m|2t
		 *  TransportTime: 2:4:1 (measure:quarters:sixteens)
		 *  Now Relative: +3n
		 *  Math: 3n+16n or even complicated expressions ((3n*2)/6 + 1)
		 *
		 *  @override
		 *  @param  {Time} time       
		 *  @param {number=} 	now 	if passed in, this number will be 
		 *                        		used for all 'now' relative timings
		 *  @return {number} 
		 */
		Tone.prototype.toSeconds = function(time, now){
			now = this.defaultArg(now, this.now());
			if (this.isNumber(time)){
				return time; //assuming that it's seconds
			} else if (this.isString(time)){
				var plusTime = 0;
				if(this.isNowRelative(time)) {
					time = time.replace("+", "");
					plusTime = now;
				} 
				var betweenParens = time.match(/\(([^)(]+)\)/g);
				if (betweenParens){
					//evaluate the expressions between the parenthesis
					for (var j = 0; j < betweenParens.length; j++){
						//remove the parens
						var symbol = betweenParens[j].replace(/[\(\)]/g, "");
						var symbolVal = this.toSeconds(symbol);
						time = time.replace(betweenParens[j], symbolVal);
					}
				}
				//test if it is quantized
				if (time.indexOf("@") !== -1){
					var quantizationSplit = time.split("@");
					if (!this.isUndef(Tone.Transport)){
						var toQuantize = quantizationSplit[0].trim();
						//if there's no argument it should be evaluated as the current time
						if (toQuantize === ""){
							toQuantize = undefined;
						} 
						//if it's now-relative, it should be evaluated by `quantize`
						if (plusTime > 0){
							toQuantize = "+" + toQuantize;
							plusTime = 0;
						}
						var subdivision = quantizationSplit[1].trim();
						time = Tone.Transport.quantize(toQuantize, subdivision);
					} else {
						throw new Error("quantization requires Tone.Transport");
					}
				} else {
					var components = time.split(/[\(\)\-\+\/\*]/);
					if (components.length > 1){
						var originalTime = time;
						for(var i = 0; i < components.length; i++){
							var symb = components[i].trim();
							if (symb !== ""){
								var val = this.toSeconds(symb);
								time = time.replace(symb, val);
							}
						}
						try {
							//eval is evil
							time = eval(time); // jshint ignore:line
						} catch (e){
							throw new EvalError("cannot evaluate Time: "+originalTime);
						}
					} else if (this.isNotation(time)){
						time = this.notationToSeconds(time);
					} else if (this.isTransportTime(time)){
						time = this.transportTimeToSeconds(time);
					} else if (this.isFrequency(time)){
						time = this.frequencyToSeconds(time);
					} else if (this.isTicks(time)){
						time = this.ticksToSeconds(time);
					} else {
						time = parseFloat(time);
					}
				}
				return time + plusTime;
			} else {
				return now;
			}
		};


		/**
		 *  Convert a Time to Notation. Values will be thresholded to the nearest 128th note. 
		 *  @param {Time} time 
		 *  @param {BPM=} bpm 
		 *  @param {number=} timeSignature
		 *  @return {Notation}  
		 */
		Tone.prototype.toNotation = function(time, bpm, timeSignature){
			var testNotations = ["1m", "2n", "4n", "8n", "16n", "32n", "64n", "128n"];
			var retNotation = toNotationHelper.call(this, time, bpm, timeSignature, testNotations);
			//try the same thing but with tripelets
			var testTripletNotations = ["1m", "2n", "2t", "4n", "4t", "8n", "8t", "16n", "16t", "32n", "32t", "64n", "64t", "128n"];
			var retTripletNotation = toNotationHelper.call(this, time, bpm, timeSignature, testTripletNotations);
			//choose the simpler expression of the two
			if (retTripletNotation.split("+").length < retNotation.split("+").length){
				return retTripletNotation;
			} else {
				return retNotation;
			}
		};

		/**
		 *  Helper method for Tone.toNotation
		 *  @private
		 */
		function toNotationHelper(time, bpm, timeSignature, testNotations){
			var seconds = this.toSeconds(time);
			var threshold = this.notationToSeconds(testNotations[testNotations.length - 1], bpm, timeSignature);
			var retNotation = "";
			for (var i = 0; i < testNotations.length; i++){
				var notationTime = this.notationToSeconds(testNotations[i], bpm, timeSignature);
				//account for floating point errors (i.e. round up if the value is 0.999999)
				var multiple = seconds / notationTime;
				var floatingPointError = 0.000001;
				if (1 - multiple % 1 < floatingPointError){
					multiple += floatingPointError;
				}
				multiple = Math.floor(multiple);
				if (multiple > 0){
					if (multiple === 1){
						retNotation += testNotations[i];
					} else {
						retNotation += multiple.toString() + "*" + testNotations[i];
					}
					seconds -= multiple * notationTime;
					if (seconds < threshold){
						break;
					} else {
						retNotation += " + ";
					}
				}
			}
			if (retNotation === ""){
				retNotation = "0";
			}
			return retNotation;
		}

		/**
		 *  Convert the given value from the type specified by units
		 *  into a number.
		 *  @param  {*} val the value to convert
		 *  @return {Number}     the number which the value should be set to
		 */
		Tone.prototype.fromUnits = function(val, units){
			if (this.convert || this.isUndef(this.convert)){
				switch(units){
					case Tone.Type.Time: 
						return this.toSeconds(val);
					case Tone.Type.Frequency: 
						return this.toFrequency(val);
					case Tone.Type.Decibels: 
						return this.dbToGain(val);
					case Tone.Type.NormalRange: 
						return Math.min(Math.max(val, 0), 1);
					case Tone.Type.AudioRange: 
						return Math.min(Math.max(val, -1), 1);
					case Tone.Type.Positive: 
						return Math.max(val, 0);
					default:
						return val;
				}
			} else {
				return val;
			}
		};

		/**
		 * Convert a number to the specified units.
		 * @param  {number} val the value to convert
		 * @return {number}
		 */
		Tone.prototype.toUnits = function(val, units){
			if (this.convert || this.isUndef(this.convert)){
				switch(units){
					case Tone.Type.Decibels: 
						return this.gainToDb(val);
					default:
						return val;
				}
			} else {
				return val;
			}
		};

		///////////////////////////////////////////////////////////////////////////
		//	FREQUENCY CONVERSIONS
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  Note to scale index
		 *  @type  {Object}
		 */
		var noteToScaleIndex = {
			"cbb" : -2, "cb" : -1, "c" : 0,  "c#" : 1,  "cx" : 2, 
			"dbb" : 0,  "db" : 1,  "d" : 2,  "d#" : 3,  "dx" : 4,
			"ebb" : 2,  "eb" : 3,  "e" : 4,  "e#" : 5,  "ex" : 6, 
			"fbb" : 3,  "fb" : 4,  "f" : 5,  "f#" : 6,  "fx" : 7,
			"gbb" : 5,  "gb" : 6,  "g" : 7,  "g#" : 8,  "gx" : 9,
			"abb" : 7,  "ab" : 8,  "a" : 9,  "a#" : 10, "ax" : 11,
			"bbb" : 9,  "bb" : 10, "b" : 11, "b#" : 12, "bx" : 13,
		};

		/**
		 *  scale index to note (sharps)
		 *  @type  {Array}
		 */
		var scaleIndexToNote = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

		/**
		 *  The [concert pitch](https://en.wikipedia.org/wiki/Concert_pitch, 
		 *  A4's values in Hertz. 
		 *  @type {Frequency}
		 *  @static
		 */
		Tone.A4 = 440;

		/**
		 *  Convert a note name to frequency. 
		 *  @param  {String} note
		 *  @return {number}     
		 *  @example
		 * var freq = tone.noteToFrequency("A4"); //returns 440
		 */
		Tone.prototype.noteToFrequency = function(note){
			//break apart the note by frequency and octave
			var parts = note.split(/(-?\d+)/);
			if (parts.length === 3){
				var index = noteToScaleIndex[parts[0].toLowerCase()];
				var octave = parts[1];
				var noteNumber = index + (parseInt(octave, 10) + 1) * 12;
				return this.midiToFrequency(noteNumber);
			} else {
				return 0;
			}
		};

		/**
		 *  Convert a frequency to a note name (i.e. A4, C#5).
		 *  @param  {number} freq
		 *  @return {String}         
		 */
		Tone.prototype.frequencyToNote = function(freq){
			var log = Math.log(freq / Tone.A4) / Math.LN2;
			var noteNumber = Math.round(12 * log) + 57;
			var octave = Math.floor(noteNumber/12);
			if(octave < 0){
				noteNumber += -12 * octave;
			}
			var noteName = scaleIndexToNote[noteNumber % 12];
			return noteName + octave.toString();
		};

		/**
		 *  Convert an interval (in semitones) to a frequency ratio.
		 *
		 *  @param  {Interval} interval the number of semitones above the base note
		 *  @return {number}          the frequency ratio
		 *  @example
		 * tone.intervalToFrequencyRatio(0); // returns 1
		 * tone.intervalToFrequencyRatio(12); // returns 2
		 */
		Tone.prototype.intervalToFrequencyRatio = function(interval){
			return Math.pow(2,(interval/12));
		};

		/**
		 *  Convert a midi note number into a note name. 
		 *
		 *  @param  {MIDI} midiNumber the midi note number
		 *  @return {String}            the note's name and octave
		 *  @example
		 * tone.midiToNote(60); // returns "C3"
		 */
		Tone.prototype.midiToNote = function(midiNumber){
			var octave = Math.floor(midiNumber / 12) - 1;
			var note = midiNumber % 12;
			return scaleIndexToNote[note] + octave;
		};

		/**
		 *  Convert a note to it's midi value. 
		 *
		 *  @param  {String} note the note name (i.e. "C3")
		 *  @return {MIDI} the midi value of that note
		 *  @example
		 * tone.noteToMidi("C3"); // returns 60
		 */
		Tone.prototype.noteToMidi = function(note){
			//break apart the note by frequency and octave
			var parts = note.split(/(\d+)/);
			if (parts.length === 3){
				var index = noteToScaleIndex[parts[0].toLowerCase()];
				var octave = parts[1];
				return index + (parseInt(octave, 10) + 1) * 12;
			} else {
				return 0;
			}
		};

		/**
		 *  Convert a MIDI note to frequency value. 
		 *
		 *  @param  {MIDI} midi The midi number to convert.
		 *  @return {Frequency} the corresponding frequency value
		 *  @example
		 * tone.midiToFrequency(57); // returns 440
		 */
		Tone.prototype.midiToFrequency = function(midi){
			return Tone.A4 * Math.pow(2, (midi - 69) / 12);
		};

		return Tone;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(30), __webpack_require__(41)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class Tone.Param wraps the native Web Audio's AudioParam to provide
		 *         additional unit conversion functionality. It also
		 *         serves as a base-class for classes which have a single,
		 *         automatable parameter. 
		 *  @extends {Tone}
		 *  @param  {AudioParam}  param  The parameter to wrap.
		 *  @param  {Tone.Type} units The units of the audio param.
		 *  @param  {Boolean} convert If the param should be converted.
		 */
		Tone.Param = function(){

			var options = this.optionsObject(arguments, ["param", "units", "convert"], Tone.Param.defaults);

			/**
			 *  The native parameter to control
			 *  @type  {AudioParam}
			 *  @private
			 */
			this._param = this.input = options.param;

			/**
			 *  The units of the parameter
			 *  @type {Tone.Type}
			 */
			this.units = options.units;

			/**
			 *  If the value should be converted or not
			 *  @type {Boolean}
			 */
			this.convert = options.convert;

			/**
			 *  True if the signal value is being overridden by 
			 *  a connected signal.
			 *  @readOnly
			 *  @type  {boolean}
			 *  @private
			 */
			this.overridden = false;

			if (!this.isUndef(options.value)){
				this.value = options.value;
			}
		};

		Tone.extend(Tone.Param);
		
		/**
		 *  Defaults
		 *  @type  {Object}
		 *  @const
		 */
		Tone.Param.defaults = {
			"units" : Tone.Type.Default,
			"convert" : true,
			"param" : undefined
		};

		/**
		 * The current value of the parameter. 
		 * @memberOf Tone.Param#
		 * @type {Number}
		 * @name value
		 */
		Object.defineProperty(Tone.Param.prototype, "value", {
			get : function(){
				return this._toUnits(this._param.value);
			},
			set : function(value){
				var convertedVal = this._fromUnits(value);
				this._param.value = convertedVal;
			}
		});

		/**
		 *  Convert the given value from the type specified by Tone.Param.units
		 *  into the destination value (such as Gain or Frequency).
		 *  @private
		 *  @param  {*} val the value to convert
		 *  @return {number}     the number which the value should be set to
		 */
		Tone.Param.prototype._fromUnits = function(val){
			if (this.convert || this.isUndef(this.convert)){
				switch(this.units){
					case Tone.Type.Time: 
						return this.toSeconds(val);
					case Tone.Type.Frequency: 
						return this.toFrequency(val);
					case Tone.Type.Decibels: 
						return this.dbToGain(val);
					case Tone.Type.NormalRange: 
						return Math.min(Math.max(val, 0), 1);
					case Tone.Type.AudioRange: 
						return Math.min(Math.max(val, -1), 1);
					case Tone.Type.Positive: 
						return Math.max(val, 0);
					default:
						return val;
				}
			} else {
				return val;
			}
		};

		/**
		 * Convert the parameters value into the units specified by Tone.Param.units.
		 * @private
		 * @param  {number} val the value to convert
		 * @return {number}
		 */
		Tone.Param.prototype._toUnits = function(val){
			if (this.convert || this.isUndef(this.convert)){
				switch(this.units){
					case Tone.Type.Decibels: 
						return this.gainToDb(val);
					default:
						return val;
				}
			} else {
				return val;
			}
		};

		/**
		 *  the minimum output value
		 *  @type {Number}
		 *  @private
		 */
		Tone.Param.prototype._minOutput = 0.00001;

		/**
		 *  Schedules a parameter value change at the given time.
		 *  @param {*}	value The value to set the signal.
		 *  @param {Time}  time The time when the change should occur.
		 *  @returns {Tone.Param} this
		 *  @example
		 * //set the frequency to "G4" in exactly 1 second from now. 
		 * freq.setValueAtTime("G4", "+1");
		 */
		Tone.Param.prototype.setValueAtTime = function(value, time){
			value = this._fromUnits(value);
			this._param.setValueAtTime(value, this.toSeconds(time));
			return this;
		};

		/**
		 *  Creates a schedule point with the current value at the current time.
		 *  This is useful for creating an automation anchor point in order to 
		 *  schedule changes from the current value. 
		 *
		 *  @param {number=} now (Optionally) pass the now value in. 
		 *  @returns {Tone.Param} this
		 */
		Tone.Param.prototype.setRampPoint = function(now){
			now = this.defaultArg(now, this.now());
			var currentVal = this._param.value;
			this._param.setValueAtTime(currentVal, now);
			return this;
		};

		/**
		 *  Schedules a linear continuous change in parameter value from the 
		 *  previous scheduled parameter value to the given value.
		 *  
		 *  @param  {number} value   
		 *  @param  {Time} endTime 
		 *  @returns {Tone.Param} this
		 */
		Tone.Param.prototype.linearRampToValueAtTime = function(value, endTime){
			value = this._fromUnits(value);
			this._param.linearRampToValueAtTime(value, this.toSeconds(endTime));
			return this;
		};

		/**
		 *  Schedules an exponential continuous change in parameter value from 
		 *  the previous scheduled parameter value to the given value.
		 *  
		 *  @param  {number} value   
		 *  @param  {Time} endTime 
		 *  @returns {Tone.Param} this
		 */
		Tone.Param.prototype.exponentialRampToValueAtTime = function(value, endTime){
			value = this._fromUnits(value);
			value = Math.max(this._minOutput, value);
			this._param.exponentialRampToValueAtTime(value, this.toSeconds(endTime));
			return this;
		};

		/**
		 *  Schedules an exponential continuous change in parameter value from 
		 *  the current time and current value to the given value over the 
		 *  duration of the rampTime.
		 *  
		 *  @param  {number} value   The value to ramp to.
		 *  @param  {Time} rampTime the time that it takes the 
		 *                               value to ramp from it's current value
		 *  @returns {Tone.Param} this
		 *  @example
		 * //exponentially ramp to the value 2 over 4 seconds. 
		 * signal.exponentialRampToValue(2, 4);
		 */
		Tone.Param.prototype.exponentialRampToValue = function(value, rampTime){
			var now = this.now();
			// exponentialRampToValueAt cannot ever ramp from 0, apparently.
			// More info: https://bugzilla.mozilla.org/show_bug.cgi?id=1125600#c2
			var currentVal = this.value;
			this.setValueAtTime(Math.max(currentVal, this._minOutput), now);
			this.exponentialRampToValueAtTime(value, now + this.toSeconds(rampTime));
			return this;
		};

		/**
		 *  Schedules an linear continuous change in parameter value from 
		 *  the current time and current value to the given value over the 
		 *  duration of the rampTime.
		 *  
		 *  @param  {number} value   The value to ramp to.
		 *  @param  {Time} rampTime the time that it takes the 
		 *                               value to ramp from it's current value
		 *  @returns {Tone.Param} this
		 *  @example
		 * //linearly ramp to the value 4 over 3 seconds. 
		 * signal.linearRampToValue(4, 3);
		 */
		Tone.Param.prototype.linearRampToValue = function(value, rampTime){
			var now = this.now();
			this.setRampPoint(now);
			this.linearRampToValueAtTime(value, now + this.toSeconds(rampTime));
			return this;
		};

		/**
		 *  Start exponentially approaching the target value at the given time with
		 *  a rate having the given time constant.
		 *  @param {number} value        
		 *  @param {Time} startTime    
		 *  @param {number} timeConstant 
		 *  @returns {Tone.Param} this 
		 */
		Tone.Param.prototype.setTargetAtTime = function(value, startTime, timeConstant){
			value = this._fromUnits(value);
			// The value will never be able to approach without timeConstant > 0.
			// http://www.w3.org/TR/webaudio/#dfn-setTargetAtTime, where the equation
			// is described. 0 results in a division by 0.
			value = Math.max(this._minOutput, value);
			timeConstant = Math.max(this._minOutput, timeConstant);
			this._param.setTargetAtTime(value, this.toSeconds(startTime), timeConstant);
			return this;
		};

		/**
		 *  Sets an array of arbitrary parameter values starting at the given time
		 *  for the given duration.
		 *  	
		 *  @param {Array} values    
		 *  @param {Time} startTime 
		 *  @param {Time} duration  
		 *  @returns {Tone.Param} this
		 */
		Tone.Param.prototype.setValueCurveAtTime = function(values, startTime, duration){
			for (var i = 0; i < values.length; i++){
				values[i] = this._fromUnits(values[i]);
			}
			this._param.setValueCurveAtTime(values, this.toSeconds(startTime), this.toSeconds(duration));
			return this;
		};

		/**
		 *  Cancels all scheduled parameter changes with times greater than or 
		 *  equal to startTime.
		 *  
		 *  @param  {Time} startTime
		 *  @returns {Tone.Param} this
		 */
		Tone.Param.prototype.cancelScheduledValues = function(startTime){
			this._param.cancelScheduledValues(this.toSeconds(startTime));
			return this;
		};

		/**
		 *  Ramps to the given value over the duration of the rampTime. 
		 *  Automatically selects the best ramp type (exponential or linear)
		 *  depending on the `units` of the signal
		 *  
		 *  @param  {number} value   
		 *  @param  {Time} rampTime the time that it takes the 
		 *                               value to ramp from it's current value
		 *  @returns {Tone.Param} this
		 *  @example
		 * //ramp to the value either linearly or exponentially 
		 * //depending on the "units" value of the signal
		 * signal.rampTo(0, 10);
		 */
		Tone.Param.prototype.rampTo = function(value, rampTime){
			rampTime = this.defaultArg(rampTime, 0);
			if (this.units === Tone.Type.Frequency || this.units === Tone.Type.BPM){
				this.exponentialRampToValue(value, rampTime);
			} else {
				this.linearRampToValue(value, rampTime);
			}
			return this;
		};

		/**
		 *  Clean up
		 *  @returns {Tone.Param} this
		 */
		Tone.Param.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._param = null;
			return this;
		};

		return Tone.Param;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(30), __webpack_require__(42), __webpack_require__(41)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tone) {

		"use strict";

		/**
		 *  @class A thin wrapper around the Native Web Audio GainNode.
		 *         The GainNode is a basic building block of the Web Audio
		 *         API and is useful for routing audio and adjusting gains. 
		 *  @extends {Tone}
		 *  @param  {Number=}  gain  The initial gain of the GainNode
		 *  @param {Tone.Type=} units The units of the gain parameter. 
		 */
		Tone.Gain = function(){

			var options = this.optionsObject(arguments, ["gain", "units"], Tone.Gain.defaults);

			/**
			 *  The GainNode
			 *  @type  {GainNode}
			 *  @private
			 */
			this.input = this.output = this._gainNode = this.context.createGain();

			/**
			 *  The gain parameter of the gain node.
			 *  @type {AudioParam}
			 *  @signal
			 */
			this.gain = new Tone.Param({
				"param" : this._gainNode.gain, 
				"units" : options.units,
				"value" : options.gain,
				"convert" : options.convert
			});
			this._readOnly("gain");
		};

		Tone.extend(Tone.Gain);

		/**
		 *  The defaults
		 *  @const
		 *  @type  {Object}
		 */
		Tone.Gain.defaults = {
			"gain" : 1,
			"convert" : true,
		};

		/**
		 *  Clean up.
		 *  @return  {Tone.Gain}  this
		 */
		Tone.Gain.prototype.dispose = function(){
			Tone.Param.prototype.dispose.call(this);
			this._gainNode.disconnect();
			this._gainNode = null;
			this._writable("gain");
			this.gain.dispose();
			this.gain = null;
		};

		return Tone.Gain;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(30), __webpack_require__(41)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tone) {

		"use strict";

		/**
		 *  @class A Timeline class for scheduling and maintaining state
		 *         along a timeline. All events must have a "time" property. 
		 *         Internally, events are stored in time order for fast 
		 *         retrieval.
		 *  @extends {Tone}
		 *  @param {Positive} [memory=Infinity] The number of previous events that are retained.
		 */
		Tone.Timeline = function(){

			var options = this.optionsObject(arguments, ["memory"], Tone.Timeline.defaults);

			/**
			 *  The array of scheduled timeline events
			 *  @type  {Array}
			 *  @private
			 */
			this._timeline = [];

			/**
			 *  An array of items to remove from the list. 
			 *  @type {Array}
			 *  @private
			 */
			this._toRemove = [];

			/**
			 *  Flag if the tieline is mid iteration
			 *  @private
			 *  @type {Boolean}
			 */
			this._iterating = false;

			/**
			 *  The memory of the timeline, i.e.
			 *  how many events in the past it will retain
			 *  @type {Positive}
			 */
			this.memory = options.memory;
		};

		Tone.extend(Tone.Timeline);

		/**
		 *  the default parameters
		 *  @static
		 *  @const
		 */
		Tone.Timeline.defaults = {
			"memory" : Infinity
		};

		/**
		 *  The number of items in the timeline.
		 *  @type {Number}
		 *  @memberOf Tone.Timeline#
		 *  @name length
		 *  @readOnly
		 */
		Object.defineProperty(Tone.Timeline.prototype, "length", {
			get : function(){
				return this._timeline.length;
			}
		});

		/**
		 *  Insert an event object onto the timeline. Events must have a "time" attribute.
		 *  @param  {Object}  event  The event object to insert into the 
		 *                           timeline. 
		 *  @returns {Tone.Timeline} this
		 */
		Tone.Timeline.prototype.addEvent = function(event){
			//the event needs to have a time attribute
			if (this.isUndef(event.time)){
				throw new Error("events must have a time attribute");
			}
			event.time = this.toSeconds(event.time);
			if (this._timeline.length){
				var index = this._search(event.time);
				this._timeline.splice(index + 1, 0, event);
			} else {
				this._timeline.push(event);			
			}
			//if the length is more than the memory, remove the previous ones
			if (this.length > this.memory){
				var diff = this.length - this.memory;
				this._timeline.splice(0, diff);
			}
			return this;
		};

		/**
		 *  Remove an event from the timeline.
		 *  @param  {Object}  event  The event object to remove from the list.
		 *  @returns {Tone.Timeline} this
		 */
		Tone.Timeline.prototype.removeEvent = function(event){
			if (this._iterating){
				this._toRemove.push(event);
			} else {
				var index = this._timeline.indexOf(event);
				if (index !== -1){
					this._timeline.splice(index, 1);
				}
			}
			return this;
		};

		/**
		 *  Get the event whose time is less than or equal to the given time.
		 *  @param  {Number}  time  The time to query.
		 *  @returns {Object} The event object set after that time.
		 */
		Tone.Timeline.prototype.getEvent = function(time){
			time = this.toSeconds(time);
			var index = this._search(time);
			if (index !== -1){
				return this._timeline[index];
			} else {
				return null;
			}
		};

		/**
		 *  Get the event which is scheduled after the given time.
		 *  @param  {Number}  time  The time to query.
		 *  @returns {Object} The event object after the given time
		 */
		Tone.Timeline.prototype.getEventAfter = function(time){
			time = this.toSeconds(time);
			var index = this._search(time);
			if (index + 1 < this._timeline.length){
				return this._timeline[index + 1];
			} else {
				return null;
			}
		};

		/**
		 *  Get the event before the event at the given time.
		 *  @param  {Number}  time  The time to query.
		 *  @returns {Object} The event object before the given time
		 */
		Tone.Timeline.prototype.getEventBefore = function(time){
			time = this.toSeconds(time);
			var index = this._search(time);
			if (index - 1 >= 0){
				return this._timeline[index - 1];
			} else {
				return null;
			}
		};

		/**
		 *  Cancel events after the given time
		 *  @param  {Time}  time  The time to query.
		 *  @returns {Tone.Timeline} this
		 */
		Tone.Timeline.prototype.cancel = function(after){
			if (this._timeline.length > 1){
				after = this.toSeconds(after);
				var index = this._search(after);
				if (index >= 0){
					this._timeline = this._timeline.slice(0, index);
				} else {
					this._timeline = [];
				}
			} else if (this._timeline.length === 1){
				//the first item's time
				if (this._timeline[0].time >= after){
					this._timeline = [];
				}
			}
			return this;
		};

		/**
		 *  Cancel events before or equal to the given time.
		 *  @param  {Time}  time  The time to cancel before.
		 *  @returns {Tone.Timeline} this
		 */
		Tone.Timeline.prototype.cancelBefore = function(time){
			if (this._timeline.length){
				time = this.toSeconds(time);
				var index = this._search(time);
				if (index >= 0){
					this._timeline = this._timeline.slice(index + 1);
				}
			}
			return this;
		};

		/**
		 *  Does a binary serach on the timeline array and returns the 
		 *  event which is after or equal to the time.
		 *  @param  {Number}  time  
		 *  @return  {Number} the index in the timeline array 
		 *  @private
		 */
		Tone.Timeline.prototype._search = function(time){
			var beginning = 0;
			var len = this._timeline.length;
			var end = len;
			// continue searching while [imin,imax] is not empty
			while (beginning <= end && beginning < len){
				// calculate the midpoint for roughly equal partition
				var midPoint = Math.floor(beginning + (end - beginning) / 2);
				var event = this._timeline[midPoint];
				if (event.time === time){
					//choose the last one that has the same time
					for (var i = midPoint; i < this._timeline.length; i++){
						var testEvent = this._timeline[i];
						if (testEvent.time === time){
							midPoint = i;
						}
					}
					return midPoint;
				} else if (event.time > time){
					//search lower
					end = midPoint - 1;
				} else if (event.time < time){
					//search upper
					beginning = midPoint + 1;
				} 
			}
			return beginning - 1;
		};

		/**
		 *  Internal iterator. Applies extra safety checks for 
		 *  removing items from the array. 
		 *  @param  {Function}  callback 
		 *  @param  {Number=}    lowerBound     
		 *  @param  {Number=}    upperBound    
		 *  @private
		 */
		Tone.Timeline.prototype._iterate = function(callback, lowerBound, upperBound){
			this._iterating = true;
			lowerBound = this.defaultArg(lowerBound, 0);
			upperBound = this.defaultArg(upperBound, this._timeline.length - 1);
			for (var i = lowerBound; i <= upperBound; i++){
				callback(this._timeline[i]);
			}
			this._iterating = false;
			if (this._toRemove.length > 0){
				for (var j = 0; j < this._toRemove.length; j++){
					var index = this._timeline.indexOf(this._toRemove[j]);
					if (index !== -1){
						this._timeline.splice(index, 1);
					}
				}
				this._toRemove = [];
			}
		};

		/**
		 *  Iterate over everything in the array
		 *  @param  {Function}  callback The callback to invoke with every item
		 *  @returns {Tone.Timeline} this
		 */
		Tone.Timeline.prototype.forEach = function(callback){
			this._iterate(callback);
			return this;
		};

		/**
		 *  Iterate over everything in the array at or before the given time.
		 *  @param  {Time}  time The time to check if items are before
		 *  @param  {Function}  callback The callback to invoke with every item
		 *  @returns {Tone.Timeline} this
		 */
		Tone.Timeline.prototype.forEachBefore = function(time, callback){
			//iterate over the items in reverse so that removing an item doesn't break things
			time = this.toSeconds(time);
			var upperBound = this._search(time);
			if (upperBound !== -1){
				this._iterate(callback, 0, upperBound);
			}
			return this;
		};

		/**
		 *  Iterate over everything in the array after the given time.
		 *  @param  {Time}  time The time to check if items are before
		 *  @param  {Function}  callback The callback to invoke with every item
		 *  @returns {Tone.Timeline} this
		 */
		Tone.Timeline.prototype.forEachAfter = function(time, callback){
			//iterate over the items in reverse so that removing an item doesn't break things
			time = this.toSeconds(time);
			var lowerBound = this._search(time);
			this._iterate(callback, lowerBound + 1);
			return this;
		};

		/**
		 *  Iterate over everything in the array at or after the given time. Similar to 
		 *  forEachAfter, but includes the item(s) at the given time.
		 *  @param  {Time}  time The time to check if items are before
		 *  @param  {Function}  callback The callback to invoke with every item
		 *  @returns {Tone.Timeline} this
		 */
		Tone.Timeline.prototype.forEachFrom = function(time, callback){
			//iterate over the items in reverse so that removing an item doesn't break things
			time = this.toSeconds(time);
			var lowerBound = this._search(time);
			//work backwards until the event time is less than time
			while (lowerBound >= 0 && this._timeline[lowerBound].time >= time){
				lowerBound--;
			}
			this._iterate(callback, lowerBound + 1);
			return this;
		};

		/**
		 *  Iterate over everything in the array at the given time
		 *  @param  {Time}  time The time to check if items are before
		 *  @param  {Function}  callback The callback to invoke with every item
		 *  @returns {Tone.Timeline} this
		 */
		Tone.Timeline.prototype.forEachAtTime = function(time, callback){
			//iterate over the items in reverse so that removing an item doesn't break things
			time = this.toSeconds(time);
			var upperBound = this._search(time);
			if (upperBound !== -1){
				this._iterate(function(event){
					if (event.time === time){
						callback(event);
					} 
				}, 0, upperBound);
			}
			return this;
		};

		/**
		 *  Clean up.
		 *  @return  {Tone.Timeline}  this
		 */
		Tone.Timeline.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._timeline = null;
			this._toRemove = null;
		};

		return Tone.Timeline;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(30), __webpack_require__(44), __webpack_require__(41)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tone) {

		"use strict";

		/**
		 *  @class  A Timeline State. Provides the methods: <code>setStateAtTime("state", time)</code>
		 *          and <code>getStateAtTime(time)</code>.
		 *
		 *  @extends {Tone.Timeline}
		 *  @param {String} initial The initial state of the TimelineState. 
		 *                          Defaults to <code>undefined</code>
		 */
		Tone.TimelineState = function(initial){

			Tone.Timeline.call(this);

			/**
			 *  The initial state
			 *  @private
			 *  @type {String}
			 */
			this._initial = initial;
		};

		Tone.extend(Tone.TimelineState, Tone.Timeline);

		/**
		 *  Returns the scheduled state scheduled before or at
		 *  the given time.
		 *  @param  {Time}  time  The time to query.
		 *  @return  {String}  The name of the state input in setStateAtTime.
		 */
		Tone.TimelineState.prototype.getStateAtTime = function(time){
			var event = this.getEvent(time);
			if (event !== null){
				return event.state;
			} else {
				return this._initial;
			}
		};

		/**
		 *  Returns the scheduled state scheduled before or at
		 *  the given time.
		 *  @param  {String}  state The name of the state to set.
		 *  @param  {Time}  time  The time to query.
		 */
		Tone.TimelineState.prototype.setStateAtTime = function(state, time){
			this.addEvent({
				"state" : state,
				"time" : this.toSeconds(time)
			});
		};

		return Tone.TimelineState;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(30)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tone) {

		"use strict";

		/**
		 *  @class Tone.Emitter gives classes which extend it
		 *         the ability to listen for and trigger events. 
		 *         Inspiration and reference from Jerome Etienne's [MicroEvent](https://github.com/jeromeetienne/microevent.js).
		 *         MIT (c) 2011 Jerome Etienne.
		 *         
		 *  @extends {Tone}
		 */
		Tone.Emitter = function(){
			/**
			 *  Contains all of the events.
			 *  @private
			 *  @type  {Object}
			 */
			this._events = {};
		};

		Tone.extend(Tone.Emitter);

		/**
		 *  Bind a callback to a specific event.
		 *  @param  {String}    event     The name of the event to listen for.
		 *  @param  {Function}  callback  The callback to invoke when the
		 *                                event is triggered
		 *  @return  {Tone.Emitter}    this
		 */
		Tone.Emitter.prototype.on = function(event, callback){
			//split the event
			var events = event.split(/\W+/);
			for (var i = 0; i < events.length; i++){
				var eventName = events[i];
				if (!this._events.hasOwnProperty(eventName)){
					this._events[eventName] = [];
				}
				this._events[eventName].push(callback);
			}
			return this;
		};

		/**
		 *  Remove the event listener.
		 *  @param  {String}    event     The event to stop listening to.
		 *  @param  {Function=}  callback  The callback which was bound to 
		 *                                the event with Tone.Emitter.on.
		 *                                If no callback is given, all callbacks
		 *                                events are removed.
		 *  @return  {Tone.Emitter}    this
		 */
		Tone.Emitter.prototype.off = function(event, callback){
			var events = event.split(/\W+/);
			for (var ev = 0; ev < events.length; ev++){
				event = events[ev];
				if (this._events.hasOwnProperty(event)){
					if (Tone.prototype.isUndef(callback)){
						this._events[event] = [];
					} else {
						var eventList = this._events[event];
						for (var i = 0; i < eventList.length; i++){
							if (eventList[i] === callback){
								eventList.splice(i, 1);
							}
						}
					}
				}
			}
			return this;
		};

		/**
		 *  Invoke all of the callbacks bound to the event
		 *  with any arguments passed in. 
		 *  @param  {String}  event  The name of the event.
		 *  @param {*...} args The arguments to pass to the functions listening.
		 *  @return  {Tone.Emitter}  this
		 */
		Tone.Emitter.prototype.trigger = function(event){
			if (this._events){
				var args = Array.prototype.slice.call(arguments, 1);
				if (this._events.hasOwnProperty(event)){
					var eventList = this._events[event];
					for (var i = 0, len = eventList.length; i < len; i++){
						eventList[i].apply(this, args);
					}
				}
			}
			return this;
		};

		/**
		 *  Add Emitter functions (on/off/trigger) to the object
		 *  @param  {Object|Function}  object  The object or class to extend.
		 */
		Tone.Emitter.mixin = function(object){
			var functions = ["on", "off", "trigger"];
			object._events = {};
			for (var i = 0; i < functions.length; i++){
				var func = functions[i];
				var emitterFunc = Tone.Emitter.prototype[func];
				object[func] = emitterFunc;
			}
		};

		/**
		 *  Clean up
		 *  @return  {Tone.Emitter}  this
		 */
		Tone.Emitter.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._events = null;
			return this;
		};

		return Tone.Emitter;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(30), __webpack_require__(41)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tone) {

		"use strict";

		/**
		 *  @class Similar to Tone.Timeline, but all events represent
		 *         intervals with both "time" and "duration" times. The 
		 *         events are placed in a tree structure optimized
		 *         for querying an intersection point with the timeline
		 *         events. Internally uses an [Interval Tree](https://en.wikipedia.org/wiki/Interval_tree)
		 *         to represent the data.
		 *  @extends {Tone}
		 */
		Tone.IntervalTimeline = function(){

			/**
			 *  The root node of the inteval tree
			 *  @type  {IntervalNode}
			 *  @private
			 */
			this._root = null;

			/**
			 *  Keep track of the length of the timeline.
			 *  @type  {Number}
			 *  @private
			 */
			this._length = 0;
		};

		Tone.extend(Tone.IntervalTimeline);

		/**
		 *  The event to add to the timeline. All events must 
		 *  have a time and duration value
		 *  @param  {Object}  event  The event to add to the timeline
		 *  @return  {Tone.IntervalTimeline}  this
		 */
		Tone.IntervalTimeline.prototype.addEvent = function(event){
			if (this.isUndef(event.time) || this.isUndef(event.duration)){
				throw new Error("events must have time and duration parameters");
			}
			var node = new IntervalNode(event.time, event.time + event.duration, event);
			if (this._root === null){
				this._root = node;
			} else {
				this._root.insert(node);
			}
			this._length++;
			// Restructure tree to be balanced
			while (node !== null) {
				node.updateHeight();
				node.updateMax();
				this._rebalance(node);
				node = node.parent;
			}
			return this;
		};

		/**
		 *  Remove an event from the timeline.
		 *  @param  {Object}  event  The event to remove from the timeline
		 *  @return  {Tone.IntervalTimeline}  this
		 */
		Tone.IntervalTimeline.prototype.removeEvent = function(event){
			if (this._root !== null){
				var results = [];
				this._root.search(event.time, results);
				for (var i = 0; i < results.length; i++){
					var node = results[i];
					if (node.event === event){
						this._removeNode(node);
						this._length--;
						break;
					}
				}
			}
			return this;
		};

		/**
		 *  The number of items in the timeline.
		 *  @type {Number}
		 *  @memberOf Tone.IntervalTimeline#
		 *  @name length
		 *  @readOnly
		 */
		Object.defineProperty(Tone.IntervalTimeline.prototype, "length", {
			get : function(){
				return this._length;
			}
		});

		/**
		 *  Remove events whose time time is after the given time
		 *  @param  {Time}  time  The time to query.
		 *  @returns {Tone.IntervalTimeline} this
		 */
		Tone.IntervalTimeline.prototype.cancel = function(after){
			after = this.toSeconds(after);
			this.forEachAfter(after, function(event){
				this.removeEvent(event);
			}.bind(this));
			return this;
		};

		/**
		 *  Set the root node as the given node
		 *  @param {IntervalNode} node
		 *  @private
		 */
		Tone.IntervalTimeline.prototype._setRoot = function(node){
			this._root = node;
			if (this._root !== null){
				this._root.parent = null;
			}
		};

		/**
		 *  Replace the references to the node in the node's parent
		 *  with the replacement node.
		 *  @param  {IntervalNode}  node        
		 *  @param  {IntervalNode}  replacement 
		 *  @private
		 */
		Tone.IntervalTimeline.prototype._replaceNodeInParent = function(node, replacement){
			if (node.parent !== null){
				if (node.isLeftChild()){
					node.parent.left = replacement;
				} else {
					node.parent.right = replacement;
				}
				this._rebalance(node.parent);
			} else {
				this._setRoot(replacement);
			}
		};

		/**
		 *  Remove the node from the tree and replace it with 
		 *  a successor which follows the schema.
		 *  @param  {IntervalNode}  node
		 *  @private
		 */
		Tone.IntervalTimeline.prototype._removeNode = function(node){
			if (node.left === null && node.right === null){
				this._replaceNodeInParent(node, null);
			} else if (node.right === null){
				this._replaceNodeInParent(node, node.left);
			} else if (node.left === null){
				this._replaceNodeInParent(node, node.right);
			} else {
				var balance = node.getBalance();
				var replacement, temp;
				if (balance > 0){
					if (node.left.right === null){
						replacement = node.left;
						replacement.right = node.right;
						temp = replacement;
					} else {
						replacement = node.left.right;
						while (replacement.right !== null){
							replacement = replacement.right;
						}
						replacement.parent.right = replacement.left;
						temp = replacement.parent;
						replacement.left = node.left;
						replacement.right = node.right;
					}
				} else {
					if (node.right.left === null){
						replacement = node.right;
						replacement.left = node.left;
						temp = replacement;
					} else {
						replacement = node.right.left;
						while (replacement.left !== null) {
							replacement = replacement.left;
						}
						replacement.parent = replacement.parent;
						replacement.parent.left = replacement.right;
						temp = replacement.parent;
						replacement.left = node.left;
						replacement.right = node.right;
					}
				}
				if (node.parent !== null){
					if (node.isLeftChild()){
						node.parent.left = replacement;
					} else {
						node.parent.right = replacement;
					}
				} else {
					this._setRoot(replacement);
				}
				// this._replaceNodeInParent(node, replacement);
				this._rebalance(temp);
			}
			node.dispose();
		};

		/**
		 *  Rotate the tree to the left
		 *  @param  {IntervalNode}  node
		 *  @private
		 */
		Tone.IntervalTimeline.prototype._rotateLeft = function(node){
			var parent = node.parent;
			var isLeftChild = node.isLeftChild();

			// Make node.right the new root of this sub tree (instead of node)
			var pivotNode = node.right;
			node.right = pivotNode.left;
			pivotNode.left = node;

			if (parent !== null){
				if (isLeftChild){
					parent.left = pivotNode;
				} else{
					parent.right = pivotNode;
				}
			} else{
				this._setRoot(pivotNode);
			}
		};

		/**
		 *  Rotate the tree to the right
		 *  @param  {IntervalNode}  node
		 *  @private
		 */
		Tone.IntervalTimeline.prototype._rotateRight = function(node){
			var parent = node.parent;
			var isLeftChild = node.isLeftChild();
	 
			// Make node.left the new root of this sub tree (instead of node)
			var pivotNode = node.left;
			node.left = pivotNode.right;
			pivotNode.right = node;

			if (parent !== null){
				if (isLeftChild){
					parent.left = pivotNode;
				} else{
					parent.right = pivotNode;
				}
			} else{
				this._setRoot(pivotNode);
			}
		};

		/**
		 *  Balance the BST
		 *  @param  {IntervalNode}  node
		 *  @private
		 */
		Tone.IntervalTimeline.prototype._rebalance = function(node){
			var balance = node.getBalance();
			if (balance > 1){
				if (node.left.getBalance() < 0){
					this._rotateLeft(node.left);
				} else {
					this._rotateRight(node);
				}
			} else if (balance < -1) {
				if (node.right.getBalance() > 0){
					this._rotateRight(node.right);
				} else {
					this._rotateLeft(node);
				}
			}
		};

		/**
		 *  Get an event whose time and duration span the give time. Will
		 *  return the match whose "time" value is closest to the given time.
		 *  @param  {Object}  event  The event to add to the timeline
		 *  @return  {Object}  The event which spans the desired time
		 */
		Tone.IntervalTimeline.prototype.getEvent = function(time){
			if (this._root !== null){
				var results = [];
				this._root.search(time, results);
				if (results.length > 0){
					var max = results[0];
					for (var i = 1; i < results.length; i++){
						if (results[i].low > max.low){
							max = results[i];
						}
					}
					return max.event;
				} 
			}
			return null;
		};

		/**
		 *  Iterate over everything in the timeline.
		 *  @param  {Function}  callback The callback to invoke with every item
		 *  @returns {Tone.IntervalTimeline} this
		 */
		Tone.IntervalTimeline.prototype.forEach = function(callback){
			if (this._root !== null){
				var allNodes = [];
				if (this._root !== null){
					this._root.traverse(function(node){
						allNodes.push(node);
					});
				}
				for (var i = 0; i < allNodes.length; i++){
					var ev = allNodes[i].event;
					if (ev){
						callback(ev);
					}
				}
			}
			return this;
		};

		/**
		 *  Iterate over everything in the array in which the given time
		 *  overlaps with the time and duration time of the event.
		 *  @param  {Time}  time The time to check if items are overlapping
		 *  @param  {Function}  callback The callback to invoke with every item
		 *  @returns {Tone.IntervalTimeline} this
		 */
		Tone.IntervalTimeline.prototype.forEachOverlap = function(time, callback){
			time = this.toSeconds(time);
			if (this._root !== null){
				var results = [];
				this._root.search(time, results);
				for (var i = results.length - 1; i >= 0; i--){
					var ev = results[i].event;
					if (ev){
						callback(ev);
					}
				}
			}
			return this;
		};

		/**
		 *  Iterate over everything in the array in which the time is greater
		 *  than the given time.
		 *  @param  {Time}  time The time to check if items are before
		 *  @param  {Function}  callback The callback to invoke with every item
		 *  @returns {Tone.IntervalTimeline} this
		 */
		Tone.IntervalTimeline.prototype.forEachAfter = function(time, callback){
			time = this.toSeconds(time);
			if (this._root !== null){
				var results = [];
				this._root.searchAfter(time, results);
				for (var i = results.length - 1; i >= 0; i--){
					var ev = results[i].event;
					if (ev){
						callback(ev);
					}
				}
			}
			return this;
		};

		/**
		 *  Clean up
		 *  @return  {Tone.IntervalTimeline}  this
		 */
		Tone.IntervalTimeline.prototype.dispose = function() {
			var allNodes = [];
			if (this._root !== null){
				this._root.traverse(function(node){
					allNodes.push(node);
				});
			}
			for (var i = 0; i < allNodes.length; i++){
				allNodes[i].dispose();
			}
			allNodes = null;
			this._root = null;
			return this;
		};

		///////////////////////////////////////////////////////////////////////////
		//	INTERVAL NODE HELPER
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  Represents a node in the binary search tree, with the addition
		 *  of a "high" value which keeps track of the highest value of
		 *  its children. 
		 *  References: 
		 *  https://brooknovak.wordpress.com/2013/12/07/augmented-interval-tree-in-c/
		 *  http://www.mif.vu.lt/~valdas/ALGORITMAI/LITERATURA/Cormen/Cormen.pdf
		 *  @param {Number} low
		 *  @param {Number} high
		 *  @private
		 */
		var IntervalNode = function(low, high, event){
			//the event container
			this.event = event;
			//the low value
			this.low = low;
			//the high value
			this.high = high;
			//the high value for this and all child nodes
			this.max = this.high;
			//the nodes to the left
			this._left = null;
			//the nodes to the right
			this._right = null;
			//the parent node
			this.parent = null;
			//the number of child nodes
			this.height = 0;
		};

		/** 
		 *  Insert a node into the correct spot in the tree
		 *  @param  {IntervalNode}  node
		 */
		IntervalNode.prototype.insert = function(node) {
			if (node.low <= this.low){
				if (this.left === null){
					this.left = node;
				} else {
					this.left.insert(node);
				}
			} else {
				if (this.right === null){
					this.right = node;
				} else {
					this.right.insert(node);
				}
			}
		};

		/**
		 *  Search the tree for nodes which overlap 
		 *  with the given point
		 *  @param  {Number}  point  The point to query
		 *  @param  {Array}  results  The array to put the results
		 */
		IntervalNode.prototype.search = function(point, results) {
			// If p is to the right of the rightmost point of any interval
			// in this node and all children, there won't be any matches.
			if (point > this.max){
				return;
			}
			// Search left children
			if (this.left !== null){
				this.left.search(point, results);
			}
			// Check this node
			if (this.low <= point && this.high >= point){
				results.push(this);
			}
			// If p is to the left of the time of this interval,
			// then it can't be in any child to the right.
			if (this.low > point){
				return;
			}
			// Search right children
			if (this.right !== null){
				this.right.search(point, results);
			}
		};

		/**
		 *  Search the tree for nodes which are less 
		 *  than the given point
		 *  @param  {Number}  point  The point to query
		 *  @param  {Array}  results  The array to put the results
		 */
		IntervalNode.prototype.searchAfter = function(point, results) {
			// Check this node
			if (this.low >= point){
				results.push(this);
				if (this.left !== null){
					this.left.searchAfter(point, results);
				}
			} 
			// search the right side
			if (this.right !== null){
				this.right.searchAfter(point, results);
			}
		};

		/**
		 *  Invoke the callback on this element and both it's branches
		 *  @param  {Function}  callback
		 */
		IntervalNode.prototype.traverse = function(callback){
			callback(this);
			if (this.left !== null){
				this.left.traverse(callback);
			}
			if (this.right !== null){
				this.right.traverse(callback);
			}
		};

		/**
		 *  Update the height of the node
		 */
		IntervalNode.prototype.updateHeight = function(){
			if (this.left !== null && this.right !== null){
				this.height = Math.max(this.left.height, this.right.height) + 1;
			} else if (this.right !== null){
				this.height = this.right.height + 1;
			} else if (this.left !== null){
				this.height = this.left.height + 1;
			} else {
				this.height = 0;
			}
		};

		/**
		 *  Update the height of the node
		 */
		IntervalNode.prototype.updateMax = function(){
			this.max = this.high;
			if (this.left !== null){
				this.max = Math.max(this.max, this.left.max);
			}
			if (this.right !== null){
				this.max = Math.max(this.max, this.right.max);
			}
		};

		/**
		 *  The balance is how the leafs are distributed on the node
		 *  @return  {Number}  Negative numbers are balanced to the right
		 */
		IntervalNode.prototype.getBalance = function() {
			var balance = 0;
			if (this.left !== null && this.right !== null){
				balance = this.left.height - this.right.height;
			} else if (this.left !== null){
				balance = this.left.height + 1;
			} else if (this.right !== null){
				balance = -(this.right.height + 1);
			}
			return balance;
		};

		/**
		 *  @returns {Boolean} true if this node is the left child
		 *  of its parent
		 */
		IntervalNode.prototype.isLeftChild = function() {
			return this.parent !== null && this.parent.left === this;
		};

		/**
		 *  get/set the left node
		 *  @type {IntervalNode}
		 */
		Object.defineProperty(IntervalNode.prototype, "left", {
			get : function(){
				return this._left;
			},
			set : function(node){
				this._left = node;
				if (node !== null){
					node.parent = this;
				}
				this.updateHeight();
				this.updateMax();
			}
		});

		/**
		 *  get/set the right node
		 *  @type {IntervalNode}
		 */
		Object.defineProperty(IntervalNode.prototype, "right", {
			get : function(){
				return this._right;
			},
			set : function(node){
				this._right = node;
				if (node !== null){
					node.parent = this;
				}
				this.updateHeight();
				this.updateMax();
			}
		});

		/**
		 *  null out references.
		 */
		IntervalNode.prototype.dispose = function() {
			this.parent = null;
			this._left = null;
			this._right = null;
			this.event = null;
		};

		///////////////////////////////////////////////////////////////////////////
		//	END INTERVAL NODE HELPER
		///////////////////////////////////////////////////////////////////////////

		return Tone.IntervalTimeline;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Copyright 2016 Google Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(49), __webpack_require__(52), __webpack_require__(50), __webpack_require__(53)], __WEBPACK_AMD_DEFINE_RESULT__ = function (MultiPlayer, Notes, Master, Buffer) {

		/**
		 * A sample player
		 * @param {String} folder      The folder where all the samples are contained
		 * @param {String} lowestNote 
		 * @param {String} highestNote
		 */
		var Player = function(folder, lowestNote, highestNote, steps){

			/**
			 * The multibuffer player
			 * @type {Tone.MultiPlayer}
			 * @private
			 */
			this._multiPlayer = new MultiPlayer().toMaster();

			/**
			 * the instrument folder
			 * @type {String}
			 * @private
			 */
			this._instrumentFolder = folder;

			/**
			 * The lowest note playable
			 * @type {String}
			 * @private
			 */
			this._lowestNote = lowestNote;

			/**
			 * The highest note playable
			 * @type {String}
			 * @private
			 */
			this._highestNote = highestNote;

			/**
			 * The number of chromaitc steps (up and down) which the sample 
			 * will be repitched
			 * @type {Number}
			 * @private
			 */
			this._stepSize = steps || 4;

			/**
			 * The number of buffers currently 
			 * loading.
			 * @type {Number}
			 * @private
			 */
			this._loadCount = 0;

			/**
			 * The sample lookup. Each note mapes to a buffer and a playbackRate
			 * @type {Object}
			 * @private
			 */
			this._notes = {};

			/**
			 * All the buffers
			 * @type {Object}
			 * @private
			 */
			this._buffers = {};

			/**
			 * The time it takes for the note to release
			 * @type {Number}
			 * @private
			 */
			this._releaseTime = 0.5;

			/**
			 * if all the samples are loaded
			 * @type {Boolean}
			 */
			this.loaded = false;

			//callback when loaded
			this.onload = function(){};
		};

		/**
		 * Load all the buffers
		 */
		Player.prototype.load = function(){
			//get all the samples between lowest and highest notes
			var allNotes = Notes.getNotes(this._lowestNote, this._highestNote);

			//get the samples to load
			for (var i = 0; i < allNotes.length; i+=this._stepSize * 2 + 1){
				var end = Math.max(this._stepSize * 2 + 1, allNotes.length);
				var bufferPitch = allNotes[i + this._stepSize];
				if (typeof bufferPitch !== "undefined"){
					//create the buffer
					this._loadCount+=1;
					var buff = new Buffer(this._instrumentFolder + "/" + bufferPitch + ".mp3", this._loadedBuffer.bind(this));
					// this._buffers[bufferPitch] = buff;
					this._multiPlayer.addBuffer(bufferPitch, buff);
					for (var j = i; j < end; j++){
						var note = allNotes[j];
						this._notes[note] = {
							"interval" : (j - i - this._stepSize),
							"buffer" : bufferPitch,
						};
						//and the respelling if it exists
						var respelling = Notes.getRespelling(note);
						if (respelling){
							this._notes[respelling] = this._notes[note];
						}	
					}
				}
			}
		};

		/**
		 * internal callback when a sample is loaded
		 * @private
		 */
		Player.prototype._loadedBuffer = function(){
			this._loadCount-=1;
			if (this._loadCount === 0){
				this.loaded = true;
				this.onload();
			}
		};

		/**
		 * Trigger the attack and release of the note
		 * @param  {String} note
		 * @param  {Number} duration The held duration in seconds
		 * @param  {Number} time     When the note should trigger
		 */
		Player.prototype.triggerAttackRelease = function(note, duration, time){
			var description = this._notes[note];
			this._multiPlayer.start(description.buffer, time, {
				playbackRate : this._multiPlayer.intervalToFrequencyRatio(description.interval),
				release : this._releaseTime,
				duration : duration,
			});
		};

		/**
		 * Trigger the attack of the note
		 * @param  {String} note
		 * @param  {Number} time     When the note should trigger
		 */
		Player.prototype.triggerAttack = function(note, time){

			var description = this._notes[note];

			/*this._multiPlayer.start(description.buffer, time, {
				playbackRate : this._multiPlayer.intervalToFrequencyRatio(description.interval),
				release : this._releaseTime
			});*/

			// var buffer = this._buffers[description.buffer];

			/*time = toneInstance.toSeconds(time);

			var description = this._notes[note];
			var buffer = this._buffers[description.buffer];

			var amp = Tone.context.createGain();
			amp.connect(this._output);
			amp.gain.value = 1;
			var source = Tone.context.createBufferSource();
			source.connect(amp);
			source.buffer = buffer.get();
			source.playbackRate.value = toneInstance.intervalToFrequencyRatio(description.interval);
			source.start(time);
			this._activeNotes[note] = amp;*/
		};

		/**
		 * Release a note
		 * @param  {String} note
		 * @param  {Number} time     When the note should trigger
		 */
		Player.prototype.triggerRelease = function(note, time){
			var description = this._notes[note];
			console.log(description);
			this._multiPlayer.stop(description.buffer, time);
		};

		/**
		 * Release all of the notes currently playing.
		 */
		Player.prototype.releaseAll = function(){
			this._multiPlayer.stopAll();
			/*var now = toneInstance.now();
			var newOutput = toneInstance.context.createGain();
			newOutput.connect(toneInstance.context.destination);
			this._output.gain.setValueAtTime(1, now);
			this._output.gain.linearRampToValueAtTime(0, now + 0.01);
			this._output = newOutput;
			this._activeNotes = {};*/
		};

		/**
		 * clean up
		 */
		Player.prototype.dispose = function(){
			this.releaseAll();
			for (var buff in this._buffers){
				this._buffers[buff].dispose();
			}
			this._buffers = null;
			this._notes = null;
		};

		return Player;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(30), __webpack_require__(43), __webpack_require__(50)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tone) {

		/**
		 * @class Tone.MultiPlayer implements a "fire and forget"
		 *        style buffer player. This is very good for short samples
		 *        like drum hits, sound effects and instruments samples. 
		 *        Unlike Tone.Player, Tone.MultiPlayer cannot loop samples
		 *        or change any attributes of a playing sample.
		 * @extends {Tone}
		 * @param {Object} buffers An object with sample names as the keys and either
		 *                         urls or Tone.Buffers as the values. 
		 */
		Tone.MultiPlayer = function(buffers){

			Tone.call(this, 0, 1);

			/**
			 * All of the buffers
			 * @type {Object}
			 * @private
			 */
			this._buffers = {};

			/**
			 * The source output node
			 * @type {Tone.Gain}
			 * @private
			 */
			this._sourceOutput = new Tone.Gain();
			this._sourceOutput.connect(this.output);

			//add the buffers
			if (this.isObject(buffers)){
				this.addBuffer(buffers);
			}

			this.output.channelCount = 2;
			this.output.channelCountMode = "explicit";
		};

		Tone.extend(Tone.MultiPlayer);

		/**
		 * Start the given sampleName with 
		 * @param  {String} sampleName The name of the buffer to trigger
		 * @param  {Time} time       The time to play the sample
		 * @param  {Object} options   An object literal of options: gain, 
		 *                            duration, playbackRate, and offset
		 * @return {Tone.MultiPlayer} this
		 */
		Tone.MultiPlayer.prototype.start = function(sampleName, time, options){
			options = this.defaultArg(options, {
				"playbackRate" : 1,
				"gain" : 1,
				"offset" : 0,
				"attack" : 0,
				"release" : 0,
			});

			if (this._buffers.hasOwnProperty(sampleName)){
				var buffer = this._buffers[sampleName];

				//create the source and connect it up
				var source = this.context.createBufferSource();
				source.buffer = buffer.get();
				var gainNode = this.context.createGain();
				source.connect(gainNode);
				gainNode.connect(this._sourceOutput);
				source.playbackRate.value = options.playbackRate;

				//trigger the source with all of the options
				time = this.toSeconds(time);
				source.start(time, options.offset);

				//trigger the gainNode with all of the options
				if (options.attack !== 0){
					gainNode.gain.setValueAtTime(0, time);
					gainNode.gain.linearRampToValueAtTime(options.gain, time + this.toSeconds(options.attack));
				} else {
					gainNode.gain.setValueAtTime(options.gain, time);
				}

				
				if (!this.isUndef(options.duration)){
					var duration = this.toSeconds(options.duration, buffer.duration);
					var release = this.toSeconds(options.release);
					gainNode.gain.setValueAtTime(options.gain, time + duration);
					gainNode.gain.linearRampToValueAtTime(0, time + duration + release);
					source.stop(time + duration + release);
				}
			}
			return this;
		};

		/**
		 * Stop all the samples that are currently playing
		 * @param {Time} time When to stop the samples.
		 * @param {Time} [fadeTime = 0.01] How long to fade out for. 
		 * @return {Tone.MultiPlayer}      this
		 */
		Tone.MultiPlayer.prototype.stopAll = function(time, fadeTime){
			//create a new output node, fade out the current one
			time = this.toSeconds(time);
			fadeTime = this.defaultArg(fadeTime, 0.01);
			fadeTime = this.toSeconds(fadeTime);
			this._sourceOutput.gain.setValueAtTime(1, time);
			//small fade out to avoid pops
			this._sourceOutput.gain.linearRampToValueAtTime(0, time + fadeTime);
			//make a new output
			this._sourceOutput = new Tone.Gain().connect(this.output);
			return this;
		};

		/**
		 * Add a buffer to the list of buffers, or load the given url
		 * @param {String|Object} name The name of the buffer. Or pass in an object
		 *                             with the name as the keys and urls as the values
		 * @param {String|Tone.Buffer} url  Either the url to load, or the
		 *                                  Tone.Buffer which corresponds to the name.
		 * @param {Function=} callback The callback to invoke when the buffer is loaded.
		 * @returns {Tone.MultiPlayer} this
		 */
		Tone.MultiPlayer.prototype.addBuffer = function(name, url, callback){
			var loadCount = 0;
			function loaded(){
				loadCount--;
				if (loadCount === 0){
					if (this.isFunction(url)){
						url();
					}
				}
			}
			if (this.isObject(name)){
				for (var buff in name){
					loadCount++;
					this.addBuffer(buff, name[buff], loaded);
				}
			} else if (url instanceof Tone.Buffer){
				this._buffers[name] = url;
			} else {
				this._buffers[name] = new Tone.Buffer(url, callback);
			}
			return this;
		};

		/**
		 * Clean up
		 * @return {Tone.MultiPlayer} [description]
		 */
		Tone.MultiPlayer.prototype.dispose = function(){
			this.stopAll();
			Tone.prototype.dispose.call(this);
			this._sourceOutput.dispose();
			this._sourceOutput = null;
			for (var buff in this._buffers){
				this._buffers[buff].dispose();
			}
			this._buffers = null;
			return this;
		};

		return Tone.MultiPlayer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(30), __webpack_require__(51)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";
		
		/**
		 *  @class  A single master output which is connected to the
		 *          AudioDestinationNode (aka your speakers). 
		 *          It provides useful conveniences such as the ability 
		 *          to set the volume and mute the entire application. 
		 *          It also gives you the ability to apply master effects to your application. 
		 *          <br><br>
		 *          Like Tone.Transport, A single Tone.Master is created
		 *          on initialization and you do not need to explicitly construct one.
		 *
		 *  @constructor
		 *  @extends {Tone}
		 *  @singleton
		 *  @example
		 * //the audio will go from the oscillator to the speakers
		 * oscillator.connect(Tone.Master);
		 * //a convenience for connecting to the master output is also provided:
		 * oscillator.toMaster();
		 * //the above two examples are equivalent.
		 */
		Tone.Master = function(){
			Tone.call(this);

			/**
			 * the unmuted volume
			 * @type {number}
			 * @private
			 */
			this._unmutedVolume = 1;

			/**
			 *  if the master is muted
			 *  @type {boolean}
			 *  @private
			 */
			this._muted = false;

			/**
			 *  The private volume node
			 *  @type  {Tone.Volume}
			 *  @private
			 */
			this._volume = this.output = new Tone.Volume();

			/**
			 * The volume of the master output.
			 * @type {Decibels}
			 * @signal
			 */
			this.volume = this._volume.volume;
			
			this._readOnly("volume");
			//connections
			this.input.chain(this.output, this.context.destination);
		};

		Tone.extend(Tone.Master);

		/**
		 *  @type {Object}
		 *  @const
		 */
		Tone.Master.defaults = {
			"volume" : 0,
			"mute" : false
		};

		/**
		 * Mute the output. 
		 * @memberOf Tone.Master#
		 * @type {boolean}
		 * @name mute
		 * @example
		 * //mute the output
		 * Tone.Master.mute = true;
		 */
		Object.defineProperty(Tone.Master.prototype, "mute", {
			get : function(){
				return this._muted;
			}, 
			set : function(mute){
				if (!this._muted && mute){
					this._unmutedVolume = this.volume.value;
					//maybe it should ramp here?
					this.volume.value = -Infinity;
				} else if (this._muted && !mute){
					this.volume.value = this._unmutedVolume;
				}
				this._muted = mute;
			}
		});

		/**
		 *  Add a master effects chain. NOTE: this will disconnect any nodes which were previously 
		 *  chained in the master effects chain. 
		 *  @param {AudioNode|Tone...} args All arguments will be connected in a row
		 *                                  and the Master will be routed through it.
		 *  @return  {Tone.Master}  this
		 *  @example
		 * //some overall compression to keep the levels in check
		 * var masterCompressor = new Tone.Compressor({
		 * 	"threshold" : -6,
		 * 	"ratio" : 3,
		 * 	"attack" : 0.5,
		 * 	"release" : 0.1
		 * });
		 * //give a little boost to the lows
		 * var lowBump = new Tone.Filter(200, "lowshelf");
		 * //route everything through the filter 
		 * //and compressor before going to the speakers
		 * Tone.Master.chain(lowBump, masterCompressor);
		 */
		Tone.Master.prototype.chain = function(){
			this.input.disconnect();
			this.input.chain.apply(this.input, arguments);
			arguments[arguments.length - 1].connect(this.output);
		};

		/**
		 *  Clean up
		 *  @return  {Tone.Master}  this
		 */
		Tone.Master.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._writable("volume");
			this._volume.dispose();
			this._volume = null;
			this.volume = null;
		};

		///////////////////////////////////////////////////////////////////////////
		//	AUGMENT TONE's PROTOTYPE
		///////////////////////////////////////////////////////////////////////////

		/**
		 *  Connect 'this' to the master output. Shorthand for this.connect(Tone.Master)
		 *  @returns {Tone} this
		 *  @example
		 * //connect an oscillator to the master output
		 * var osc = new Tone.Oscillator().toMaster();
		 */
		Tone.prototype.toMaster = function(){
			this.connect(Tone.Master);
			return this;
		};

		/**
		 *  Also augment AudioNode's prototype to include toMaster
		 *  as a convenience
		 *  @returns {AudioNode} this
		 */
		AudioNode.prototype.toMaster = function(){
			this.connect(Tone.Master);
			return this;
		};

		var MasterConstructor = Tone.Master;

		/**
		 *  initialize the module and listen for new audio contexts
		 */
		Tone._initAudioContext(function(){
			//a single master output
			if (!Tone.prototype.isUndef(Tone.Master)){
				Tone.Master = new MasterConstructor();
			} else {
				MasterConstructor.prototype.dispose.call(Tone.Master);
				MasterConstructor.call(Tone.Master);
			}
		});

		return Tone.Master;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(30), __webpack_require__(38), __webpack_require__(43)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class Tone.Volume is a simple volume node, useful for creating a volume fader. 
		 *
		 *  @extends {Tone}
		 *  @constructor
		 *  @param {Decibels} [volume=0] the initial volume
		 *  @example
		 * var vol = new Tone.Volume(-12);
		 * instrument.chain(vol, Tone.Master);
		 */
		Tone.Volume = function(){

			var options = this.optionsObject(arguments, ["volume"], Tone.Volume.defaults);

			/**
			 * the output node
			 * @type {GainNode}
			 * @private
			 */
			this.output = this.input = new Tone.Gain(options.volume, Tone.Type.Decibels);

			/**
			 *  The volume control in decibels. 
			 *  @type {Decibels}
			 *  @signal
			 */
			this.volume = this.output.gain;

			this._readOnly("volume");
		};

		Tone.extend(Tone.Volume);

		/**
		 *  Defaults
		 *  @type  {Object}
		 *  @const
		 *  @static
		 */
		Tone.Volume.defaults = {
			"volume" : 0
		};

		/**
		 *  clean up
		 *  @returns {Tone.Volume} this
		 */
		Tone.Volume.prototype.dispose = function(){
			this.input.dispose();
			Tone.prototype.dispose.call(this);
			this._writable("volume");
			this.volume.dispose();
			this.volume = null;
			return this;
		};

		return Tone.Volume;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Copyright 2016 Google Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {

		var chromatic = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

		var respelling = {"Db" : "C#", "Eb" : "D#", "Gb" : "F#", "Ab" : "G#", "Bb" : "A#"};

		var splitRegexp = /(-?\d+)/;

		return {
			getNotes : function(start, end){
				var startOctave = parseInt(start.split(splitRegexp)[1]);
				var startNote = start.split(splitRegexp)[0];
				startNote = chromatic.indexOf(startNote);
				var endOctave = parseInt(end.split(splitRegexp)[1]);
				var endNote = end.split(splitRegexp)[0];
				endNote = chromatic.indexOf(endNote);

				var currentNote = startNote;
				var currentOctave = startOctave;

				var retNotes = [];

				while(!(currentNote === endNote && currentOctave === endOctave)){
					retNotes.push(chromatic[currentNote] + currentOctave);

					currentNote++;

					if (currentNote >= chromatic.length){
						currentNote = 0;
						currentOctave++;
					}
				}

				return retNotes;
			},
			getRespelling : function(note){
				var pitch = note.split(splitRegexp)[0];
				var octave = parseInt(note.split(splitRegexp)[1]);
				if (respelling.hasOwnProperty(pitch)){
					return respelling[pitch] + octave.toString();
				} else {
					return null;
				}
			}
		};
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(30), __webpack_require__(46)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class  Buffer loading and storage. Tone.Buffer is used internally by all 
		 *          classes that make requests for audio files such as Tone.Player,
		 *          Tone.Sampler and Tone.Convolver.
		 *          <br><br>
		 *          Aside from load callbacks from individual buffers, Tone.Buffer 
		 *  		provides static methods which keep track of the loading progress 
		 *  		of all of the buffers. These methods are Tone.Buffer.onload, Tone.Buffer.onprogress,
		 *  		and Tone.Buffer.onerror. 
		 *
		 *  @constructor 
		 *  @extends {Tone}
		 *  @param {AudioBuffer|string} url The url to load, or the audio buffer to set. 
		 *  @param {function=} onload A callback which is invoked after the buffer is loaded. 
		 *                            It's recommended to use Tone.Buffer.onload instead 
		 *                            since it will give you a callback when ALL buffers are loaded.
		 *  @example
		 * var buffer = new Tone.Buffer("path/to/sound.mp3", function(){
		 * 	//the buffer is now available.
		 * 	var buff = buffer.get();
		 * });
		 */
		Tone.Buffer = function(){

			var options = this.optionsObject(arguments, ["url", "onload"], Tone.Buffer.defaults);

			/**
			 *  stores the loaded AudioBuffer
			 *  @type {AudioBuffer}
			 *  @private
			 */
			this._buffer = null;

			/**
			 *  indicates if the buffer should be reversed or not
			 *  @type {boolean}
			 *  @private
			 */
			this._reversed = options.reverse;

			/**
			 *  The url of the buffer. <code>undefined</code> if it was 
			 *  constructed with a buffer
			 *  @type {string}
			 *  @readOnly
			 */
			this.url = undefined;

			/**
			 *  Indicates if the buffer is loaded or not. 
			 *  @type {boolean}
			 *  @readOnly
			 */
			this.loaded = false;

			/**
			 *  The callback to invoke when everything is loaded. 
			 *  @type {function}
			 */
			this.onload = options.onload.bind(this, this);

			if (options.url instanceof AudioBuffer || options.url instanceof Tone.Buffer){
				this.set(options.url);
				this.onload(this);
			} else if (this.isString(options.url)){
				this.url = options.url;
				Tone.Buffer._addToQueue(options.url, this);
			}
		};

		Tone.extend(Tone.Buffer);

		/**
		 *  the default parameters
		 *  @type {Object}
		 */
		Tone.Buffer.defaults = {
			"url" : undefined,
			"onload" : Tone.noOp,
			"reverse" : false
		};

		/**
		 *  Pass in an AudioBuffer or Tone.Buffer to set the value
		 *  of this buffer.
		 *  @param {AudioBuffer|Tone.Buffer} buffer the buffer
		 *  @returns {Tone.Buffer} this
		 */
		Tone.Buffer.prototype.set = function(buffer){
			if (buffer instanceof Tone.Buffer){
				this._buffer = buffer.get();
			} else {
				this._buffer = buffer;
			}
			this.loaded = true;
			return this;
		};

		/**
		 *  @return {AudioBuffer} The audio buffer stored in the object.
		 */
		Tone.Buffer.prototype.get = function(){
			return this._buffer;
		};

		/**
		 *  Load url into the buffer. 
		 *  @param {String} url The url to load
		 *  @param {Function=} callback The callback to invoke on load. 
		 *                              don't need to set if `onload` is
		 *                              already set.
		 *  @returns {Tone.Buffer} this
		 */
		Tone.Buffer.prototype.load = function(url, callback){
			this.url = url;
			this.onload = this.defaultArg(callback, this.onload);
			Tone.Buffer._addToQueue(url, this);
			return this;
		};

		/**
		 *  dispose and disconnect
		 *  @returns {Tone.Buffer} this
		 */
		Tone.Buffer.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			Tone.Buffer._removeFromQueue(this);
			this._buffer = null;
			this.onload = Tone.Buffer.defaults.onload;
			return this;
		};

		/**
		 * The duration of the buffer. 
		 * @memberOf Tone.Buffer#
		 * @type {number}
		 * @name duration
		 * @readOnly
		 */
		Object.defineProperty(Tone.Buffer.prototype, "duration", {
			get : function(){
				if (this._buffer){
					return this._buffer.duration;
				} else {
					return 0;
				}
			},
		});

		/**
		 *  Reverse the buffer.
		 *  @private
		 *  @return {Tone.Buffer} this
		 */
		Tone.Buffer.prototype._reverse = function(){
			if (this.loaded){
				for (var i = 0; i < this._buffer.numberOfChannels; i++){
					Array.prototype.reverse.call(this._buffer.getChannelData(i));
				}
			}
			return this;
		};

		/**
		 * Reverse the buffer.
		 * @memberOf Tone.Buffer#
		 * @type {boolean}
		 * @name reverse
		 */
		Object.defineProperty(Tone.Buffer.prototype, "reverse", {
			get : function(){
				return this._reversed;
			},
			set : function(rev){
				if (this._reversed !== rev){
					this._reversed = rev;
					this._reverse();
				}
			},
		});

		///////////////////////////////////////////////////////////////////////////
		// STATIC METHODS
		///////////////////////////////////////////////////////////////////////////

		//statically inherits Emitter methods
		Tone.Emitter.mixin(Tone.Buffer);
		 
		/**
		 *  the static queue for all of the xhr requests
		 *  @type {Array}
		 *  @private
		 */
		Tone.Buffer._queue = [];

		/**
		 *  the array of current downloads
		 *  @type {Array}
		 *  @private
		 */
		Tone.Buffer._currentDownloads = [];

		/**
		 *  the total number of downloads
		 *  @type {number}
		 *  @private
		 */
		Tone.Buffer._totalDownloads = 0;

		/**
		 *  the maximum number of simultaneous downloads
		 *  @static
		 *  @type {number}
		 */
		Tone.Buffer.MAX_SIMULTANEOUS_DOWNLOADS = 6;
		
		/**
		 *  Adds a file to be loaded to the loading queue
		 *  @param   {string}   url      the url to load
		 *  @param   {function} callback the callback to invoke once it's loaded
		 *  @private
		 */
		Tone.Buffer._addToQueue = function(url, buffer){
			Tone.Buffer._queue.push({
				url : url,
				Buffer : buffer,
				progress : 0,
				xhr : null
			});
			this._totalDownloads++;
			Tone.Buffer._next();
		};

		/**
		 *  Remove an object from the queue's (if it's still there)
		 *  Abort the XHR if it's in progress
		 *  @param {Tone.Buffer} buffer the buffer to remove
		 *  @private
		 */
		Tone.Buffer._removeFromQueue = function(buffer){
			var i;
			for (i = 0; i < Tone.Buffer._queue.length; i++){
				var q = Tone.Buffer._queue[i];
				if (q.Buffer === buffer){
					Tone.Buffer._queue.splice(i, 1);
				}
			}
			for (i = 0; i < Tone.Buffer._currentDownloads.length; i++){
				var dl = Tone.Buffer._currentDownloads[i];
				if (dl.Buffer === buffer){
					Tone.Buffer._currentDownloads.splice(i, 1);
					dl.xhr.abort();
					dl.xhr.onprogress = null;
					dl.xhr.onload = null;
					dl.xhr.onerror = null;
				}
			}
		};

		/**
		 *  load the next buffer in the queue
		 *  @private
		 */
		Tone.Buffer._next = function(){
			if (Tone.Buffer._queue.length > 0){
				if (Tone.Buffer._currentDownloads.length < Tone.Buffer.MAX_SIMULTANEOUS_DOWNLOADS){
					var next = Tone.Buffer._queue.shift();
					Tone.Buffer._currentDownloads.push(next);
					next.xhr = Tone.Buffer.load(next.url, function(buffer){
						//remove this one from the queue
						var index = Tone.Buffer._currentDownloads.indexOf(next);
						Tone.Buffer._currentDownloads.splice(index, 1);
						next.Buffer.set(buffer);
						if (next.Buffer._reversed){
							next.Buffer._reverse();
						}
						next.Buffer.onload(next.Buffer);
						Tone.Buffer._onprogress();
						Tone.Buffer._next();
					});
					next.xhr.onprogress = function(event){
						next.progress = event.loaded / event.total;
						Tone.Buffer._onprogress();
					};
					next.xhr.onerror = function(e){
						Tone.Buffer.trigger("error", e);
					};
				} 
			} else if (Tone.Buffer._currentDownloads.length === 0){
				Tone.Buffer.trigger("load");
				//reset the downloads
				Tone.Buffer._totalDownloads = 0;
			}
		};

		/**
		 *  internal progress event handler
		 *  @private
		 */
		Tone.Buffer._onprogress = function(){
			var curretDownloadsProgress = 0;
			var currentDLLen = Tone.Buffer._currentDownloads.length;
			var inprogress = 0;
			if (currentDLLen > 0){
				for (var i = 0; i < currentDLLen; i++){
					var dl = Tone.Buffer._currentDownloads[i];
					curretDownloadsProgress += dl.progress;
				}
				inprogress = curretDownloadsProgress;
			}
			var currentDownloadProgress = currentDLLen - inprogress;
			var completed = Tone.Buffer._totalDownloads - Tone.Buffer._queue.length - currentDownloadProgress;
			Tone.Buffer.trigger("progress", completed / Tone.Buffer._totalDownloads);
		};

		/**
		 *  Makes an xhr reqest for the selected url then decodes
		 *  the file as an audio buffer. Invokes
		 *  the callback once the audio buffer loads.
		 *  @param {string} url The url of the buffer to load.
		 *                      filetype support depends on the
		 *                      browser.
		 *  @param {function} callback The function to invoke when the url is loaded. 
		 *  @returns {XMLHttpRequest} returns the XHR
		 */
		Tone.Buffer.load = function(url, callback){
			var request = new XMLHttpRequest();
			request.open("GET", url, true);
			request.responseType = "arraybuffer";
			// decode asynchronously
			request.onload = function() {
				Tone.context.decodeAudioData(request.response, function(buff) {
					if(!buff){
						throw new Error("could not decode audio data:" + url);
					}
					callback(buff);
				});
			};
			//send the request
			request.send();
			return request;
		};

		return Tone.Buffer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Copyright 2016 Google Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(55), __webpack_require__(57), __webpack_require__(60)], __WEBPACK_AMD_DEFINE_RESULT__ = function (toggleStyle, Toggle, Translate) {

		var ModeToggle = function(container){

			this.element = document.createElement("DIV");
			this.element.id = "ToggleContainer";
			container.appendChild(this.element);

			this.toggle = new Toggle(this.element, Translate.localize("Chords_UI_Minor"), Translate.localize("Chords_UI_Major"), true);

			this.toggle.onchange = this.toggled.bind(this);

			this.onChange = function(){};
		};

		ModeToggle.prototype.toggled = function(val){
			this.onChange(val ? "major" : "minor");
		};

		return ModeToggle;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(56);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/autoprefixer-loader/index.js!../node_modules/sass-loader/index.js!./toggle.scss", function() {
				var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/autoprefixer-loader/index.js!../node_modules/sass-loader/index.js!./toggle.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "#ToggleContainer {\n  margin-top: 20vh;\n  position: relative; }\n  #ToggleContainer .Label {\n    font-weight: 400; }\n", ""]);

	// exports


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Copyright 2016 Google Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(58)], __WEBPACK_AMD_DEFINE_RESULT__ = function (mainStyle, Slider) {

		var Toggle = function(container, leftLabel, rightLabel, initialValue){

			/**
			 * The current value of the toggle
			 * @type {Boolean}
			 * @private
			 */
			this._value = false;

			/**
			 * The toggle container
			 * @type {Element}
			 * @private
			 */
			this._container = document.createElement("div");
			this._container.classList.add("Toggle");
			container.appendChild(this._container);

			/**
			 * The slider
			 * @type {Element}
			 * @private
			 */
			this._slider = document.createElement("div");
			this._slider.id = "Slider";
			this._container.appendChild(this._slider);

			/**
			 * The railing
			 * @type {Element}
			 * @private
			 */
			this._sliderRailing = document.createElement("div");
			this._sliderRailing.id = "Rail";
			this._slider.appendChild(this._sliderRailing);

			/**
			 * The hanlde
			 * @type {Element}
			 * @private
			 */
			this._sliderHandle = document.createElement("div");
			this._sliderHandle.id = "Handle";
			this._slider.appendChild(this._sliderHandle);
			this._slider.addEventListener("mousedown", this._change.bind(this));
			this._slider.addEventListener("touchstart", this._change.bind(this));

			/**
			 * The label on the left side
			 * @type {Element}
			 * @private
			 */
			this._leftLabel = document.createElement("div");
			this._leftLabel.id = "Left";
			this._leftLabel.classList.add("Label");
			this._leftLabel.textContent = leftLabel || "";
			this._leftLabel.addEventListener("mousedown", this._setFalse.bind(this));
			this._leftLabel.addEventListener("touchstart", this._setFalse.bind(this));
			this._container.appendChild(this._leftLabel);

			/**
			 * The label on the left side
			 * @type {Element}
			 * @private
			 */
			this._rightLabel = document.createElement("div");
			this._rightLabel.id = "Right";
			this._rightLabel.classList.add("Label");
			this._rightLabel.textContent = rightLabel || "";
			this._rightLabel.addEventListener("mousedown", this._setTrue.bind(this));
			this._rightLabel.addEventListener("touchstart", this._setTrue.bind(this));
			this._container.appendChild(this._rightLabel);

			/**
			 * Onchange handler
			 * @type {Function}
			 */
			this.onchange = function(){};

			//set the position initially
			this.setValue(initialValue || false);
		};

		Toggle.prototype._change = function(e){
			e.preventDefault();
			this._value = !this._value;
			this._update();
			this.onchange(this.getValue());
		};

		Toggle.prototype._update = function(){
			if (this.getValue()){
				this._rightLabel.classList.add("Selected");
				this._leftLabel.classList.remove("Selected");
				this._slider.classList.add("Right");
			} else {
				this._rightLabel.classList.remove("Selected");
				this._leftLabel.classList.add("Selected");
				this._slider.classList.remove("Right");
			}
		};

		Toggle.prototype.setValue = function(val){
			this._value = val;
			this._update();
		};

		Toggle.prototype._setFalse = function(e){
			e.preventDefault();
			this._value = false;
			this._update();		
			this.onchange(this.getValue());
		};

		Toggle.prototype._setTrue = function(e){
			e.preventDefault();
			this._value = true;
			this._update();		
			this.onchange(this.getValue());
		};

		Toggle.prototype.getValue = function(){
			return this._value;
		};

		return Toggle;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(59);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/autoprefixer-loader/index.js!../node_modules/sass-loader/index.js!./toggleswitch.scss", function() {
				var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/autoprefixer-loader/index.js!../node_modules/sass-loader/index.js!./toggleswitch.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, ".Toggle #Left {\n  right: 50%;\n  margin-right: 45px;\n  text-align: right; }\n\n.Toggle #Right {\n  left: 50%;\n  margin-left: 45px;\n  text-align: left; }\n\n.Toggle .Label {\n  cursor: pointer;\n  position: absolute;\n  top: 50%;\n  font-family: \"Poppins\", sans-serif;\n  font-weight: 300;\n  color: #afafaf;\n  font-size: 20px;\n  line-height: 20px;\n  margin-top: -10px;\n  transition: color 0.1s; }\n\n.Toggle .Label.Selected {\n  color: #1eaaf1; }\n\n.Toggle #Slider {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  width: 50px;\n  height: 30px;\n  margin-left: -25px;\n  margin-top: -15px;\n  cursor: pointer; }\n  .Toggle #Slider #Rail, .Toggle #Slider #Handle {\n    pointer-events: none; }\n  .Toggle #Slider #Rail {\n    position: absolute;\n    top: 50%;\n    width: 100%;\n    height: 20px;\n    margin-top: -10px;\n    border-radius: 10px !important;\n    background-color: #8ed3f7;\n    background-color: #8ed3f7;\n    border-top-left-radius: 10px;\n    border-bottom-left-radius: 10px; }\n  .Toggle #Slider #Handle {\n    position: absolute;\n    margin-top: -15px;\n    top: 50%;\n    height: 30px;\n    width: 30px;\n    border-radius: 15px;\n    background-color: #1eaaf1;\n    transition: left 0.1s, margin-left 0.1s;\n    margin-left: 0px;\n    left: 0px;\n    box-shadow: 0 0px 2px #afafaf; }\n\n.Toggle #Slider.Right #Handle {\n  left: 100%;\n  margin-left: -30px; }\n", ""]);

	// exports


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Copyright 2016 Google Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {

		var languageText = null;

		function capitalize(str){
			return str.charAt(0).toUpperCase() + str.substr(1);
		}

		//the number of attempts to get the translation
		var tries = 0;

		/**
		 * localize the given word into the desired language
		 * @param  {String} word
		 * @return {String} 
		 */
		return {
			load : function(origin, callback){
				var xhr = new XMLHttpRequest();
				xhr.open("GET", "https://gweb-musiclab-site.appspot.com/static/locales/"+origin+"/locale-music-lab.json");
				xhr.onreadystatechange = function () {
					if (xhr.readyState === 4) {
						if (xhr.status === 200) {
							var json = JSON.parse(xhr.responseText);
							languageText = json;
							callback();
						} else {
							if (tries < 3){
								tries++;
								this.load("en", callback);
							}
						}
					}
				}.bind(this);
				xhr.send(null);
			},
			localize : function(phrase){
				if (languageText){
					if (languageText[phrase]){
						return languageText[phrase].message;
					} else {
						return phrase;
					}
				} else {
					return phrase;
				}
			},
			localizeChord : function(key, mode){
				var transKey = key+"_"+capitalize(mode)+"_Chord";
				if (languageText && languageText[transKey]){				
					return languageText[transKey].message;
				} else {
					return key + " " + " " + mode + " chord";
				}
			}
		};
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Copyright 2016 Google Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(62), __webpack_require__(30)], __WEBPACK_AMD_DEFINE_RESULT__ = function (StartAudioContext, Tone) {

		return function(){
			// send the ready message to the parent
			var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
			var isAndroid = /Android/.test(navigator.userAgent) && !window.MSStream;

			// full screen button on iOS
			if (isIOS || isAndroid) {
				// make a full screen element and put it in front
				var iOSTapper = document.createElement("div");
				iOSTapper.id = "iOSTap";
				document.body.appendChild(iOSTapper);
	      new StartAudioContext(Tone.context, iOSTapper).then(function() {
	        iOSTapper.remove();
	        window.parent.postMessage('ready','*');
	      });
			} else {
				window.parent.postMessage('ready','*');
			}
		};
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 *  StartAudioContext.js
	 *  @author Yotam Mann
	 *  @license http://opensource.org/licenses/MIT MIT License
	 *  @copyright 2016 Yotam Mann
	 */
	(function (root, factory) {
		if (true) {
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		 } else if (typeof module === 'object' && module.exports) {
	        module.exports = factory();
		} else {
			root.StartAudioContext = factory();
	  }
	}(this, function () {

		/**
		 * The StartAudioContext object
		 */
		var StartAudioContext = {
			/**
			 * The audio context passed in by the user
			 * @type {AudioContext}
			 */
			context : null,
			/**
			 * The TapListeners bound to the elements
			 * @type {Array}
			 * @private
			 */
			_tapListeners : [],
			/**
			 * Callbacks to invoke when the audio context is started
			 * @type {Array}
			 * @private
			 */
			_onStarted : [],
		};


		/**
		 * Set the context
		 * @param {AudioContext} ctx
		 * @returns {StartAudioContext}
		 */
		StartAudioContext.setContext = function(ctx){
			StartAudioContext.context = ctx;
			return StartAudioContext;
		};

		/**
		 * Add a tap listener to the audio context
		 * @param  {Array|Element|String|jQuery} element
		 * @returns {StartAudioContext}
		 */
		StartAudioContext.on = function(element){
			if (Array.isArray(element) || (NodeList && element instanceof NodeList)){
				for (var i = 0; i < element.length; i++){
					StartAudioContext.on(element[i]);
				}
			} else if (typeof element === "string"){
				StartAudioContext.on(document.querySelectorAll(element));
			} else if (element.jquery && typeof element.toArray === "function"){
				StartAudioContext.on(element.toArray());
			} else if (Element && element instanceof Element){
				//if it's an element, create a TapListener
				var tap = new TapListener(element, onTap);
				StartAudioContext._tapListeners.push(tap);
			} 
			return StartAudioContext;
		};

		/**
		 * Bind a callback to when the audio context is started. 
		 * @param {Function} cb
		 * @return {StartAudioContext}
		 */
		StartAudioContext.onStarted = function(cb){
			//if it's already started, invoke the callback
			if (StartAudioContext.isStarted()){
				cb();
			} else {
				StartAudioContext._onStarted.push(cb);
			}
			return StartAudioContext;
		};

		/**
		 * returns true if the context is started
		 * @return {Boolean}
		 */
		StartAudioContext.isStarted = function(){
			return (StartAudioContext.context !== null && StartAudioContext.context.state === "running");
		};

		/**
		 * @class  Listens for non-dragging tap ends on the given element
		 * @param {Element} element
		 * @internal
		 */
		var TapListener = function(element){

			this._dragged = false;

			this._element = element;

			this._bindedMove = this._moved.bind(this);
			this._bindedEnd = this._ended.bind(this);

			element.addEventListener("touchmove", this._bindedMove);
			element.addEventListener("touchend", this._bindedEnd);
			element.addEventListener("mouseup", this._bindedEnd);
		};

		/**
		 * drag move event
		 */
		TapListener.prototype._moved = function(e){
			this._dragged = true;
		};

		/**
		 * tap ended listener
		 */
		TapListener.prototype._ended = function(e){
			if (!this._dragged){
				onTap();
			}
			this._dragged = false;
		};

		/**
		 * remove all the bound events
		 */
		TapListener.prototype.dispose = function(){
			this._element.removeEventListener("touchmove", this._bindedMove);
			this._element.removeEventListener("touchend", this._bindedEnd);
			this._element.removeEventListener("mouseup", this._bindedEnd);
			this._bindedMove = null;
			this._bindedEnd = null;
			this._element = null;
		};

		/**
		 * Invoked the first time of the elements is tapped.
		 * Creates a silent oscillator when a non-dragging touchend 
		 * event has been triggered.
		 */
		function onTap(){

			//start the audio context with a silent oscillator
			if (StartAudioContext.context && !StartAudioContext.isStarted()){
				var osc = StartAudioContext.context.createOscillator();
				var silent = StartAudioContext.context.createGain();
				silent.gain.value = 0;
				osc.connect(silent);
				silent.connect(StartAudioContext.context.destination);
				var now = StartAudioContext.context.currentTime;
				osc.start(now);
				osc.stop(now+0.5);
			}

			//dispose all the tap listeners
			if (StartAudioContext._tapListeners){
				for (var i = 0; i < StartAudioContext._tapListeners.length; i++){
					StartAudioContext._tapListeners[i].dispose();
				}
				StartAudioContext._tapListeners = null;
			}
			//the onstarted callbacks
			if (StartAudioContext._onStarted){
				for (var j = 0; j < StartAudioContext._onStarted.length; j++){
					StartAudioContext._onStarted[j]();
				}
				StartAudioContext._onStarted = null;
			}
		}

		return StartAudioContext;
	}));

/***/ }
]);