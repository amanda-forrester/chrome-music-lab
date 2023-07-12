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
	exports.push([module.id, "@import url(https://fonts.googleapis.com/css?family=Poppins);", ""]);

	// module
	exports.push([module.id, "html, body {\n  width: 100%;\n  height: 100%;\n  position: fixed;\n  top: 0px;\n  left: 0px;\n  margin: 0px;\n  overflow: hidden;\n  -webkit-touch-callout: none;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  font-family: 'Poppins', sans-serif; }\n  html #iOSTap, body #iOSTap {\n    width: 100%;\n    height: 100%;\n    top: 0px;\n    left: 0px;\n    position: absolute;\n    background-color: white;\n    z-index: 100000; }\n", ""]);

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


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

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

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(7), __webpack_require__(9), __webpack_require__(10), __webpack_require__(11), __webpack_require__(12), __webpack_require__(13)], __WEBPACK_AMD_DEFINE_RESULT__ = function(gridStyle, Config, Colors, Tile, AI, TWEEN) {
		var Grid = function(container) {

			this.element = document.createElement('DIV');
			this.element.id = 'Grid';
			container.appendChild(this.element);

			this.bgCanvas = document.createElement('CANVAS');
			this.element.appendChild(this.bgCanvas);

			/**
			 * the background context
			 */
			this.bgContext = this.bgCanvas.getContext('2d');


			this.canvas = document.createElement('CANVAS');
			this.element.appendChild(this.canvas);

			/**
			 * the drawing context
			 */
			this.context = this.canvas.getContext('2d');

			/**
			 * the canvas size
			 */
			this.width = 0;
			this.height = 0;

			this.tileWidth = 0;
			this.tileHeight = 0;

			/**
			 * the currently active column. -1 for nothing
			 */
			this._activeColumn = -1;

	        /**
	         * Track mouse drag events
	         */
	        this.mouseDrag = false;
	        this.lastDragTile = {x: null, y: null};

			this._resize();
			window.addEventListener('resize', this._resize.bind(this));

			//do the drawing
			this.canvas.addEventListener('mousemove', this._hover.bind(this));
			this.canvas.addEventListener('mousedown', this._clicked.bind(this));
	        this.canvas.addEventListener('mouseup', this._mouseUp.bind(this));

	        this.canvas.addEventListener('touchmove', this._hover.bind(this));
	        this.canvas.addEventListener('touchend', this._mouseUp.bind(this));
			this.canvas.addEventListener('touchstart', this._clicked.bind(this));

			/**
			 * all the tiles on the screen
			 */
			this._tiles = new Array(Config.gridWidth);

			//all of the AI on the screen
			this._ai = [];

			/**
			 * the x/y offset of the AI
			 */
			this._aiOffset = {
				x: 0,
				y: 0
			};

			/**
			 * flag if the drawing needs updating
			 */
			this._needsUpdate = false;

			/**
			 * the direction of the AI phasing
			 * "up"/"down"/"left"/"right"/"none"
			 */
			this._direction = 'none';

			/**
			 * counts the number of times
			 * that the loop has rotated
			 */
			this._iterationCounter = 0;

			this._boundDraw = this.draw.bind(this);
			this.draw();

			this.onNote = function() {};
		};

		Grid.prototype._resize = function() {
			this._needsUpdate = true;
			this.width = this.canvas.offsetWidth * 2;
			this.height = this.canvas.offsetHeight * 2;
			this.context.canvas.width = this.width;
			this.context.canvas.height = this.height;
			this.bgContext.canvas.width = this.width;
			this.bgContext.canvas.height = this.height;
			this.tileWidth = this.width / Config.gridWidth;
			this.tileHeight = this.height / Config.gridHeight;
			this._drawLines();
		};

		Grid.prototype._tileAtPosition = function(x, y) {
			return {
				x: Math.floor(x / (this.tileWidth / 2)),
				y: Math.floor(y / (this.tileHeight / 2))
			};
		};

		Grid.prototype._clicked = function(e) {
	        this.mouseDrag = true;

			e.preventDefault();
			//get the touch coord
			if (e.type === 'touchstart' || e.type === 'touchmove') {
				for (var i = 0; i < e.changedTouches.length; i++) {
					var touch = e.changedTouches[i];
					var touchTilePos = this._tileAtPosition(touch.clientX, touch.clientY);
					this._addTile(touchTilePos.x, touchTilePos.y);

	                this.lastDragTile = touchTilePos;
				}
			} else {
				var tilePos = this._tileAtPosition(e.clientX, e.clientY);
				this._addTile(tilePos.x, tilePos.y, true);

	            this.lastDragTile = tilePos;
			}
		};

		Grid.prototype._mouseUp = function(e) {
			e.preventDefault();

			// Reset drag variables
			this.mouseDrag = false;
	        this.lastDragTile = {x: null, y: null};
		};

		Grid.prototype._hover = function(e) {
			const x = e.clientX || e.touches[0].clientX;
	        const y = e.clientY || e.touches[0].clientY;

			var tilePos = this._tileAtPosition(x, y);

			//get the tile at the pos
			var tile = this._tiles[tilePos.x];

			// Call click event on mousedrag
			if (this.mouseDrag && (tilePos.x !== this.lastDragTile.x || tilePos.y !== this.lastDragTile.y)) {
				this.lastDragTile = tilePos;
				this._clicked(e);
			}

			if (tile && !tile.isHovered()) {
				if (tilePos.y === tile.y) {
					this._needsUpdate = true;
					tile.hover();
				}
			}
			//go through the tiles, and unhover them
			for (var i = 0; i < this._tiles.length; i++) {
				var t = this._tiles[i];
				if (t && t.isHovered() && (t.x !== tilePos.x || t.y !== tilePos.y)) {
					this._needsUpdate = true;
					t.unhover();
				}
			}
		};

		Grid.prototype._addTile = function(x, y, hover) {
			this._needsUpdate = true;
			//if there's a tile already in that column
			if (this._tiles[x]) {
				var tile = this._tiles[x];
				//and row, remove it
				if (tile.y == y) {
					this._removeTile(x, y, tile);
				} else {
					//otherwise remove it
					this._removeTile(x, y, tile);
					this._addTile(x, y, hover);
				}
			} else {
				var t = new Tile(x, y, hover);
				this.onNote(y);
				var ai = new AI(t, this);
				this._tiles[x] = t;
				this._ai.push(ai);
			}
		};

		Grid.prototype._removeTile = function(x, y, tile) {
			//remove the AI associated with that tile
			for (var i = 0; i < this._ai.length; i++) {
				var ai = this._ai[i];
				if (ai.tile === tile) {
					ai.dispose();
					this._ai.splice(i, 1);
					break;
				}
			}
			this._tiles[x] = null;
			this._needsUpdate = true;
		};

		/**
		 * Drawing
		 */
		Grid.prototype.draw = function() {
			requestAnimationFrame(this._boundDraw);
			if (this._needsUpdate){
				this._needsUpdate = false;
				this.context.clearRect(0, 0, this.width, this.height);
				//draw the active column
				if (this._activeColumn !== -1) {
					this.context.fillStyle = 'rgba(22, 168, 240, .08)';
					this.context.fillRect(this._activeColumn * this.tileWidth, 0, this.tileWidth, this.height);
				}
				this._drawAI();
				this._drawTiles();
				TWEEN.update();
			}
		};

		Grid.prototype._drawLines = function() {
			var gridWidth = Config.gridWidth;
			var gridHeight = Config.gridHeight;
			this.bgContext.strokeStyle = 'rgba(22, 168, 240, 0.4)';
			this.bgContext.lineWidth = 1;
			for (var x = 0; x < gridWidth; x++) {
			  for (var y = 0; y < gridHeight; y++) {
					//draw tile with border
					this.bgContext.beginPath();
					this.bgContext.strokeRect(x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight);
			  }
			}
		};

		Grid.prototype._drawTiles = function() {
			for (var i = 0; i < this._tiles.length; i++) {
				var tile = this._tiles[i];
				if (tile) {
					tile.draw(this.context, this.tileWidth, this.tileHeight, this._activeColumn);
				}
			}
		};

		Grid.prototype._drawAI = function() {
			for (var i = 0; i < this._ai.length; i++) {
				this._ai[i].draw(this.context, this.tileWidth, this.tileHeight, this._activeColumn, this._aiOffset, this._direction);
			}
		};

		/**
		 * select a column
		 */
		Grid.prototype.select = function(column) {
			this._needsUpdate = true;
			//get all of the tiles in that column
			this._activeColumn = column;
			//returns all the active notes in that column
			var ret = {
				melody: -1,
				harmony: -1,
			};
			if (this._tiles[column]) {
				ret.melody = (this._tiles[column].y);
			}
			for (var i = 0; i < this._ai.length; i++) {
				var ai = this._ai[i];
				if (ai.isInColumn(column)) {
					//if it's not already in there
					var row = ai.getRow();
					if (ret.melody !== row) {
						ret.harmony = row;
					}
				}
			}
			/*if (column === Config.gridWidth - 1){
				if (this._iterationCounter > 0 && this._iterationCounter % 2 === 0){
					//increment all the ghosts
					this._moveAI();
				}
				this._iterationCounter++;
			}*/
			return ret;
		};

		Grid.prototype._moveAI = function() {
			this._needsUpdate = true;
			//if it's a new direciton, do it twice
			switch (this._direction) {
				case 'down' :
					this._aiOffset.y = (this._aiOffset.y + 2) % Config.gridHeight;
					break;
				case 'up' :
					this._aiOffset.y -= 2;
					if (this._aiOffset.y < 0) {
						this._aiOffset.y = Config.gridHeight - 2;
					}
					break;
				case 'left' :
					this._aiOffset.x -= 2;
					if (this._aiOffset.x < 0) {
						this._aiOffset.x = Config.gridWidth - 2;
					}
					break;
				case 'right' :
					this._aiOffset.x = (this._aiOffset.x + 2) % Config.gridWidth;
					break;
				case 'none' : 
					this._aiOffset.x = 0;
					this._aiOffset.y = 0;
					break;
			}
			for (var i = 0; i < this._ai.length; i++) {
				this._ai[i].move(this._aiOffset.x, this._aiOffset.y, this._direction);
			}
		};

		/**
		 * select a column
		 */
		Grid.prototype.setDirection = function(direction) {
			this._needsUpdate = true;
			//if it's early in the loop
			if (this._activeColumn < 2) {
				this._iterationCounter = 1;
			} else {
				this._iterationCounter = 0;
			}

			this._direction = direction;

			//remove all the ai's
			for (var i = 0; i < this._ai.length; i++) {
				this._ai[i].dispose();
			}
			this._ai = [];
			//add them back
			for (var j = 0; j < this._tiles.length; j++) {
				var tile = this._tiles[j];
				if (tile) {
					var ai = new AI(tile, this);
					this._ai.push(ai);
				}
			}

			//reset the offset
			this._aiOffset = {
				x: 0,
				y: 0
			};

			//move the AI initially
			//if it's a new direction, do it twice
			this._moveAI();
		};

		return Grid;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(8);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/autoprefixer-loader/index.js!../node_modules/sass-loader/index.js!./grid.scss", function() {
				var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/autoprefixer-loader/index.js!../node_modules/sass-loader/index.js!./grid.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "#Grid {\n  width: 100%;\n  height: calc(100% - 100px);\n  position: absolute;\n  top: 0px;\n  left: 0px; }\n  #Grid canvas {\n    width: 100%;\n    height: 100%;\n    position: absolute;\n    top: 0px;\n    left: 0px;\n    cursor: pointer; }\n", ""]);

	// exports


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	/**
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

	!(module.exports = {
		'gridHeight' : 14,
		'gridWidth' : 8,
		'tileMargin' : 2,
		'notes' : ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B'],
		'pitches' : ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'],
		'activeTime' : 200
	});


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

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

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {

		return {
			//shades
			'charcoal' : 'rgb(50,51,52)',
			'lightGrey' : 'rgb(223,224,225)',
			'lighterGrey' : 'rgb(244,244,244)',
			'grey' : 'rgb(204, 204, 204)',
			'darkGrey' : 'rgb(104, 104, 104)',
			//colors
			'orange' : '#FFC234',
			'lightOrange' : '#996e19',
			'blue' : 'rgb(22, 168, 240)',
			'lightBlue' : 'rgb(131, 211, 248)',
			//keys
			'C' : '#FF0000',
			'C#' : '#FF5349',
			'Db' : '#FF5349',
			'D' : '#FFA500',
			'D#' : '#FFAE42',
			'Eb' : '#FFAE42',
			'E' : '#FFFF00',
			'F' : '#008000',
			'F#' : '#0CBAA6',
			'Gb' : '#0CBAA6',
			'G' : '#0000FF',
			'G#' : '#8a2be2',
			'Ab' : '#8a2be2',
			'A' : '#800080',
			'A#' : '#D16587',
			'Bb' : '#D16587',
			'B' : '#FFC0CB',
		};
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

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

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(10), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Colors, Config) {

		var tileMargin = Config.tileMargin;

		var Tile = function(x, y, hover) {

			this.x = x;
			this.y = y;

			this._hovered = hover || false;
		};

		Tile.prototype.draw = function(context, width, height, activeColumn) {

			//get the note and color
			var margin = tileMargin;
			var note = Config.notes[this.y];
			context.fillStyle = Colors[note];
			context.beginPath();
			context.fillRect(this.x * width + tileMargin, this.y * height + tileMargin, width - tileMargin * 2, height - tileMargin * 2);
			if (this._hovered || this.x === activeColumn) {
				context.fillStyle = 'rgba(255, 255, 255, 0.4)';
				context.beginPath();
				context.fillRect(this.x * width + tileMargin, this.y * height + tileMargin, width - tileMargin * 2, height - tileMargin * 2);
			}
		};

		Tile.prototype.setPosition = function(x, y) {
			this.x = x;
			this.y = y;
		};

		Tile.prototype.hover = function() {
			this._hovered = true;
		};

		Tile.prototype.unhover = function() {
			this._hovered = false;
		};

		Tile.prototype.isHovered = function() {
			return this._hovered;
		};

		return Tile;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

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

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(10), __webpack_require__(9), __webpack_require__(13)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Colors, Config, TWEEN) {

		var tileMargin = Config.tileMargin;

		var AI = function(tile, GRID) {
			//a refernce to the tile
			this.tile = tile;

			this._offsetX = 0;
			this._offsetY = 0;

			this._currentX = 0;
			this._currentY = 0;

			this._tween = null;

			this.GRID = GRID;

		};

		AI.prototype.draw = function(context, width, height, activeColumn, offset, direction) {

			if (this._offsetX !== offset.x || this._offsetY !== offset.y) {
				this.move(offset.x, offset.y, direction);
			} 


			var x = (this.tile.x + this._currentX) % Config.gridWidth;
			var y = (this.tile.y + this._currentY) % Config.gridHeight;

			this._drawRect(context, x, y, width, height, activeColumn);

			if ((this.tile.y + this._currentY) > Config.gridHeight - 1 && (this.tile.y + this._currentY) < Config.gridHeight) {
				//draw another copy
				var remainerY = this._currentY % 1;
				remainerY -= 1;
				this._drawRect(context, x, remainerY, width, height, activeColumn);
			} else if ((this.tile.x + this._currentX) > Config.gridWidth - 1 && (this.tile.x + this._currentX) < Config.gridWidth) {
				var remainerX = this._currentX % 1;
				remainerX -= 1;
				this._drawRect(context, remainerX, y, width, height, activeColumn);
			}
		};

		AI.prototype._drawRect = function(context, x, y, width, height, activeColumn) {
			context.globalAlpha = 0.5;
			if ((this.tile.x + this._offsetX) % Config.gridWidth === activeColumn) {
				context.fillStyle = Colors.darkGrey;
			} else {
				context.fillStyle = Colors.grey;
			}
			context.beginPath();
			context.fillRect(x * width + tileMargin, y * height + tileMargin, width - tileMargin * 2, height - tileMargin * 2);
			context.globalAlpha = 1;
		};

		AI.prototype.move = function(toX, toY, direction) {

			var xAdder = 0;
			var yAdder = 0;

			var yRemainder = (this._currentY % 1);
			var xRemainder = (this._currentX % 1);

			if (direction === 'down' && this._offsetY === Config.gridHeight - 1 && toY === 0) {
				this._currentY = -1 - yRemainder;
			} else if (direction === 'up' && this._offsetY === 0 && toY === Config.gridHeight - 1) {
				this._currentY = Config.gridHeight + yRemainder;
			} else if (direction === 'up' && this._offsetY === 0) {
				this._currentY = Config.gridHeight + yRemainder;
			} else if (direction === 'left' && this._offsetX === 0) {
				this._currentX = Config.gridWidth + xRemainder;
			} else if (direction === 'right' && this._offsetX === Config.gridWidth - 1 && toX === 0) {
				this._currentX = -1 - xRemainder;
			}

			if (this._tween) {
				this._tween.stop();
			}

			var self = this;

			this._tween = new TWEEN.Tween({
					x: this._currentX,
					y: this._currentY,
				})
				.to({
					x: toX,
					y: toY,
				}, 200)
				.onUpdate(function() {
					self._currentX = this.x;
					self._currentY = this.y;
					self.GRID._needsUpdate = true;
				})
				.start()
				.easing(TWEEN.Easing.Quintic.InOut);

			this._offsetX = toX;
			this._offsetY = toY;

		};

		AI.prototype.isInColumn = function(column) {
			return ((this.tile.x + this._offsetX) % Config.gridWidth) === column;
		};

		AI.prototype.getRow = function() {
			return (this.tile.y + this._offsetY) % Config.gridHeight;
		};

		AI.prototype.dispose = function() {
			if (this._tween) {
				this._tween.stop();
			}
			this._tween = null;
			this.tile = null;
			this.GRID = null;
		};

		return AI;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Tween.js - Licensed under the MIT license
	 * https://github.com/tweenjs/tween.js
	 * ----------------------------------------------
	 *
	 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
	 * Thank you all, you're awesome!
	 */

	var TWEEN = TWEEN || (function () {

		var _tweens = [];

		return {

			getAll: function () {

				return _tweens;

			},

			removeAll: function () {

				_tweens = [];

			},

			add: function (tween) {

				_tweens.push(tween);

			},

			remove: function (tween) {

				var i = _tweens.indexOf(tween);

				if (i !== -1) {
					_tweens.splice(i, 1);
				}

			},

			update: function (time, preserve) {

				if (_tweens.length === 0) {
					return false;
				}

				var i = 0;

				time = time !== undefined ? time : TWEEN.now();

				while (i < _tweens.length) {

					if (_tweens[i].update(time) || preserve) {
						i++;
					} else {
						_tweens.splice(i, 1);
					}

				}

				return true;

			}
		};

	})();


	// Include a performance.now polyfill.
	// In node.js, use process.hrtime.
	if (typeof (window) === 'undefined' && typeof (process) !== 'undefined') {
		TWEEN.now = function () {
			var time = process.hrtime();

			// Convert [seconds, nanoseconds] to milliseconds.
			return time[0] * 1000 + time[1] / 1000000;
		};
	}
	// In a browser, use window.performance.now if it is available.
	else if (typeof (window) !== 'undefined' &&
	         window.performance !== undefined &&
			 window.performance.now !== undefined) {
		// This must be bound, because directly assigning this function
		// leads to an invocation exception in Chrome.
		TWEEN.now = window.performance.now.bind(window.performance);
	}
	// Use Date.now if it is available.
	else if (Date.now !== undefined) {
		TWEEN.now = Date.now;
	}
	// Otherwise, use 'new Date().getTime()'.
	else {
		TWEEN.now = function () {
			return new Date().getTime();
		};
	}


	TWEEN.Tween = function (object) {

		var _object = object;
		var _valuesStart = {};
		var _valuesEnd = {};
		var _valuesStartRepeat = {};
		var _duration = 1000;
		var _repeat = 0;
		var _repeatDelayTime;
		var _yoyo = false;
		var _isPlaying = false;
		var _reversed = false;
		var _delayTime = 0;
		var _startTime = null;
		var _easingFunction = TWEEN.Easing.Linear.None;
		var _interpolationFunction = TWEEN.Interpolation.Linear;
		var _chainedTweens = [];
		var _onStartCallback = null;
		var _onStartCallbackFired = false;
		var _onUpdateCallback = null;
		var _onCompleteCallback = null;
		var _onStopCallback = null;

		this.to = function (properties, duration) {

			_valuesEnd = properties;

			if (duration !== undefined) {
				_duration = duration;
			}

			return this;

		};

		this.start = function (time) {

			TWEEN.add(this);

			_isPlaying = true;

			_onStartCallbackFired = false;

			_startTime = time !== undefined ? time : TWEEN.now();
			_startTime += _delayTime;

			for (var property in _valuesEnd) {

				// Check if an Array was provided as property value
				if (_valuesEnd[property] instanceof Array) {

					if (_valuesEnd[property].length === 0) {
						continue;
					}

					// Create a local copy of the Array with the start value at the front
					_valuesEnd[property] = [_object[property]].concat(_valuesEnd[property]);

				}

				// If `to()` specifies a property that doesn't exist in the source object,
				// we should not set that property in the object
				if (_object[property] === undefined) {
					continue;
				}

				// Save the starting value.
				_valuesStart[property] = _object[property];

				if ((_valuesStart[property] instanceof Array) === false) {
					_valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
				}

				_valuesStartRepeat[property] = _valuesStart[property] || 0;

			}

			return this;

		};

		this.stop = function () {

			if (!_isPlaying) {
				return this;
			}

			TWEEN.remove(this);
			_isPlaying = false;

			if (_onStopCallback !== null) {
				_onStopCallback.call(_object, _object);
			}

			this.stopChainedTweens();
			return this;

		};

		this.end = function () {

			this.update(_startTime + _duration);
			return this;

		};

		this.stopChainedTweens = function () {

			for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
				_chainedTweens[i].stop();
			}

		};

		this.delay = function (amount) {

			_delayTime = amount;
			return this;

		};

		this.repeat = function (times) {

			_repeat = times;
			return this;

		};

		this.repeatDelay = function (amount) {

			_repeatDelayTime = amount;
			return this;

		};

		this.yoyo = function (yoyo) {

			_yoyo = yoyo;
			return this;

		};


		this.easing = function (easing) {

			_easingFunction = easing;
			return this;

		};

		this.interpolation = function (interpolation) {

			_interpolationFunction = interpolation;
			return this;

		};

		this.chain = function () {

			_chainedTweens = arguments;
			return this;

		};

		this.onStart = function (callback) {

			_onStartCallback = callback;
			return this;

		};

		this.onUpdate = function (callback) {

			_onUpdateCallback = callback;
			return this;

		};

		this.onComplete = function (callback) {

			_onCompleteCallback = callback;
			return this;

		};

		this.onStop = function (callback) {

			_onStopCallback = callback;
			return this;

		};

		this.update = function (time) {

			var property;
			var elapsed;
			var value;

			if (time < _startTime) {
				return true;
			}

			if (_onStartCallbackFired === false) {

				if (_onStartCallback !== null) {
					_onStartCallback.call(_object, _object);
				}

				_onStartCallbackFired = true;
			}

			elapsed = (time - _startTime) / _duration;
			elapsed = elapsed > 1 ? 1 : elapsed;

			value = _easingFunction(elapsed);

			for (property in _valuesEnd) {

				// Don't update properties that do not exist in the source object
				if (_valuesStart[property] === undefined) {
					continue;
				}

				var start = _valuesStart[property] || 0;
				var end = _valuesEnd[property];

				if (end instanceof Array) {

					_object[property] = _interpolationFunction(end, value);

				} else {

					// Parses relative end values with start as base (e.g.: +10, -3)
					if (typeof (end) === 'string') {

						if (end.charAt(0) === '+' || end.charAt(0) === '-') {
							end = start + parseFloat(end);
						} else {
							end = parseFloat(end);
						}
					}

					// Protect against non numeric properties.
					if (typeof (end) === 'number') {
						_object[property] = start + (end - start) * value;
					}

				}

			}

			if (_onUpdateCallback !== null) {
				_onUpdateCallback.call(_object, value);
			}

			if (elapsed === 1) {

				if (_repeat > 0) {

					if (isFinite(_repeat)) {
						_repeat--;
					}

					// Reassign starting values, restart by making startTime = now
					for (property in _valuesStartRepeat) {

						if (typeof (_valuesEnd[property]) === 'string') {
							_valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property]);
						}

						if (_yoyo) {
							var tmp = _valuesStartRepeat[property];

							_valuesStartRepeat[property] = _valuesEnd[property];
							_valuesEnd[property] = tmp;
						}

						_valuesStart[property] = _valuesStartRepeat[property];

					}

					if (_yoyo) {
						_reversed = !_reversed;
					}

					if (_repeatDelayTime !== undefined) {
						_startTime = time + _repeatDelayTime;
					} else {
						_startTime = time + _delayTime;
					}

					return true;

				} else {

					if (_onCompleteCallback !== null) {

						_onCompleteCallback.call(_object, _object);
					}

					for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
						// Make the chained tweens start exactly at the time they should,
						// even if the `update()` method was called way past the duration of the tween
						_chainedTweens[i].start(_startTime + _duration);
					}

					return false;

				}

			}

			return true;

		};

	};


	TWEEN.Easing = {

		Linear: {

			None: function (k) {

				return k;

			}

		},

		Quadratic: {

			In: function (k) {

				return k * k;

			},

			Out: function (k) {

				return k * (2 - k);

			},

			InOut: function (k) {

				if ((k *= 2) < 1) {
					return 0.5 * k * k;
				}

				return - 0.5 * (--k * (k - 2) - 1);

			}

		},

		Cubic: {

			In: function (k) {

				return k * k * k;

			},

			Out: function (k) {

				return --k * k * k + 1;

			},

			InOut: function (k) {

				if ((k *= 2) < 1) {
					return 0.5 * k * k * k;
				}

				return 0.5 * ((k -= 2) * k * k + 2);

			}

		},

		Quartic: {

			In: function (k) {

				return k * k * k * k;

			},

			Out: function (k) {

				return 1 - (--k * k * k * k);

			},

			InOut: function (k) {

				if ((k *= 2) < 1) {
					return 0.5 * k * k * k * k;
				}

				return - 0.5 * ((k -= 2) * k * k * k - 2);

			}

		},

		Quintic: {

			In: function (k) {

				return k * k * k * k * k;

			},

			Out: function (k) {

				return --k * k * k * k * k + 1;

			},

			InOut: function (k) {

				if ((k *= 2) < 1) {
					return 0.5 * k * k * k * k * k;
				}

				return 0.5 * ((k -= 2) * k * k * k * k + 2);

			}

		},

		Sinusoidal: {

			In: function (k) {

				return 1 - Math.cos(k * Math.PI / 2);

			},

			Out: function (k) {

				return Math.sin(k * Math.PI / 2);

			},

			InOut: function (k) {

				return 0.5 * (1 - Math.cos(Math.PI * k));

			}

		},

		Exponential: {

			In: function (k) {

				return k === 0 ? 0 : Math.pow(1024, k - 1);

			},

			Out: function (k) {

				return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);

			},

			InOut: function (k) {

				if (k === 0) {
					return 0;
				}

				if (k === 1) {
					return 1;
				}

				if ((k *= 2) < 1) {
					return 0.5 * Math.pow(1024, k - 1);
				}

				return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);

			}

		},

		Circular: {

			In: function (k) {

				return 1 - Math.sqrt(1 - k * k);

			},

			Out: function (k) {

				return Math.sqrt(1 - (--k * k));

			},

			InOut: function (k) {

				if ((k *= 2) < 1) {
					return - 0.5 * (Math.sqrt(1 - k * k) - 1);
				}

				return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

			}

		},

		Elastic: {

			In: function (k) {

				if (k === 0) {
					return 0;
				}

				if (k === 1) {
					return 1;
				}

				return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);

			},

			Out: function (k) {

				if (k === 0) {
					return 0;
				}

				if (k === 1) {
					return 1;
				}

				return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;

			},

			InOut: function (k) {

				if (k === 0) {
					return 0;
				}

				if (k === 1) {
					return 1;
				}

				k *= 2;

				if (k < 1) {
					return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
				}

				return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;

			}

		},

		Back: {

			In: function (k) {

				var s = 1.70158;

				return k * k * ((s + 1) * k - s);

			},

			Out: function (k) {

				var s = 1.70158;

				return --k * k * ((s + 1) * k + s) + 1;

			},

			InOut: function (k) {

				var s = 1.70158 * 1.525;

				if ((k *= 2) < 1) {
					return 0.5 * (k * k * ((s + 1) * k - s));
				}

				return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

			}

		},

		Bounce: {

			In: function (k) {

				return 1 - TWEEN.Easing.Bounce.Out(1 - k);

			},

			Out: function (k) {

				if (k < (1 / 2.75)) {
					return 7.5625 * k * k;
				} else if (k < (2 / 2.75)) {
					return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
				} else if (k < (2.5 / 2.75)) {
					return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
				} else {
					return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
				}

			},

			InOut: function (k) {

				if (k < 0.5) {
					return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
				}

				return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

			}

		}

	};

	TWEEN.Interpolation = {

		Linear: function (v, k) {

			var m = v.length - 1;
			var f = m * k;
			var i = Math.floor(f);
			var fn = TWEEN.Interpolation.Utils.Linear;

			if (k < 0) {
				return fn(v[0], v[1], f);
			}

			if (k > 1) {
				return fn(v[m], v[m - 1], m - f);
			}

			return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);

		},

		Bezier: function (v, k) {

			var b = 0;
			var n = v.length - 1;
			var pw = Math.pow;
			var bn = TWEEN.Interpolation.Utils.Bernstein;

			for (var i = 0; i <= n; i++) {
				b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
			}

			return b;

		},

		CatmullRom: function (v, k) {

			var m = v.length - 1;
			var f = m * k;
			var i = Math.floor(f);
			var fn = TWEEN.Interpolation.Utils.CatmullRom;

			if (v[0] === v[m]) {

				if (k < 0) {
					i = Math.floor(f = m * (1 + k));
				}

				return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);

			} else {

				if (k < 0) {
					return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
				}

				if (k > 1) {
					return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
				}

				return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);

			}

		},

		Utils: {

			Linear: function (p0, p1, t) {

				return (p1 - p0) * t + p0;

			},

			Bernstein: function (n, i) {

				var fc = TWEEN.Interpolation.Utils.Factorial;

				return fc(n) / fc(i) / fc(n - i);

			},

			Factorial: (function () {

				var a = [1];

				return function (n) {

					var s = 1;

					if (a[n]) {
						return a[n];
					}

					for (var i = n; i > 1; i--) {
						s *= i;
					}

					a[n] = s;
					return s;

				};

			})(),

			CatmullRom: function (p0, p1, p2, p3, t) {

				var v0 = (p2 - p0) * 0.5;
				var v1 = (p3 - p1) * 0.5;
				var t2 = t * t;
				var t3 = t * t2;

				return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;

			}

		}

	};

	// UMD (Universal Module Definition)
	(function (root) {

		if (true) {

			// AMD
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return TWEEN;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

		} else if (typeof module !== 'undefined' && typeof exports === 'object') {

			// Node.js
			module.exports = TWEEN;

		} else if (root !== undefined) {

			// Global variable
			root.TWEEN = TWEEN;

		}

	})(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

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

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(16), __webpack_require__(20), __webpack_require__(24), __webpack_require__(38)], __WEBPACK_AMD_DEFINE_RESULT__ = function(bottomStyle, Slider, Transport, Orientation) {


		var Bottom = function(container) {

			this._element = document.createElement('div');
			this._element.id = 'Bottom';
			container.appendChild(this._element);

			this._controlsContainer = document.createElement('div');
			this._controlsContainer.id = 'Controls';
			this._element.appendChild(this._controlsContainer);

			this._playButton = document.createElement('div');
			this._playButton.id = 'PlayButton';
			this._playButton.classList.add('Button');
			this._playButton.classList.add("icon-svg_play");
			this._controlsContainer.appendChild(this._playButton);
			this._playButton.addEventListener('click', this._playClicked.bind(this));

			this._harmony = document.createElement('div');
			this._harmony.id = 'Harmony';
			this._harmony.classList.add('Button');
			this._controlsContainer.appendChild(this._harmony);
			this._harmony.addEventListener('click', this._directionClicked.bind(this));

			// this._directions = ['none', 'up', 'down', 'right', 'left'];
			this._directions = ['none', 'right'];
			this._directionIndex = 0;

			this.slider = new Slider(this._controlsContainer);

			this.onDirection = function() {};

			this._orientation = new Orientation(this._rotated.bind(this));
		};

		Bottom.prototype._playClicked = function(e) {
			e.preventDefault();
			if (Transport.state === 'started') {
				this._playButton.classList.remove('Playing');
				this._playButton.classList.add('icon-svg_play');
				this._playButton.classList.remove('icon-svg_pause');
				Transport.stop();
			} else {
				this._playButton.classList.add('Playing');
				this._playButton.classList.remove('icon-svg_play');
				this._playButton.classList.add('icon-svg_pause');
				Transport.start('+0.1');
			}
		};

		Bottom.prototype._rotated = function() {
			if (Transport.state === 'started') {
				this._playButton.classList.remove('Playing');
				this._playButton.classList.add('icon-svg_play');
				this._playButton.classList.remove('icon-svg_pause');
				Transport.stop();
			}
		};


		Bottom.prototype._directionClicked = function(e) {
			e.preventDefault();
			var formerDir = this._directions[this._directionIndex];
			this._harmony.classList.remove(formerDir);
			this._directionIndex = (this._directionIndex + 1) % this._directions.length;
			var dir = this._directions[this._directionIndex];
			this._harmony.classList.add(dir);
			this.onDirection(dir);
		};

		return Bottom;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(17);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/autoprefixer-loader/index.js!../node_modules/sass-loader/index.js!./bottom.scss", function() {
				var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/autoprefixer-loader/index.js!../node_modules/sass-loader/index.js!./bottom.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "@charset \"UTF-8\";\n@font-face {\n  font-family: \"icons\";\n  src: url(\"https://gweb-musiclab-site.appspot.com/static/fonts/icons/icons.eot\");\n  src: url(\"https://gweb-musiclab-site.appspot.com/static/fonts/icons/icons.eot?#iefix\") format(\"eot\"), url(\"https://gweb-musiclab-site.appspot.com/static/fonts/icons/icons.woff\") format(\"woff\"), url(\"https://gweb-musiclab-site.appspot.com/static/fonts/icons/icons.ttf\") format(\"truetype\"), url(\"https://gweb-musiclab-site.appspot.com/static/fonts/icons/icons.svg#icons\") format(\"svg\"); }\n\n.icon-svg_808:before, .icon-svg_back_arrow:before, .icon-svg_bird:before, .icon-svg_close-button:before, .icon-svg_computer:before, .icon-svg_facebook:before, .icon-svg_fast_man:before, .icon-svg_flute:before, .icon-svg_frowny_face:before, .icon-svg_go_arrow:before, .icon-svg_gplus:before, .icon-svg_hamburger_menu:before, .icon-svg_hand:before, .icon-svg_harp:before, .icon-svg_horn:before, .icon-svg_left_arrow:before, .icon-svg_man:before, .icon-svg_metronome:before, .icon-svg_no_record:before, .icon-svg_pause:before, .icon-svg_piano:before, .icon-svg_play:before, .icon-svg_record:before, .icon-svg_right_arrow:before, .icon-svg_rotate_phone:before, .icon-svg_slow_man:before, .icon-svg_twitter:before, .icon-svg_wave_form:before, .icon-svg_wine_glass:before {\n  font-family: \"icons\";\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  font-style: normal;\n  font-variant: normal;\n  font-weight: normal;\n  text-decoration: none;\n  text-transform: none; }\n\n.icon-svg_808:before {\n  content: \"\\E001\"; }\n\n.icon-svg_back_arrow:before {\n  content: \"\\E002\"; }\n\n.icon-svg_bird:before {\n  content: \"\\E003\"; }\n\n.icon-svg_close-button:before {\n  content: \"\\E004\"; }\n\n.icon-svg_computer:before {\n  content: \"\\E005\"; }\n\n.icon-svg_facebook:before {\n  content: \"\\E006\"; }\n\n.icon-svg_fast_man:before {\n  content: \"\\E007\"; }\n\n.icon-svg_flute:before {\n  content: \"\\E008\"; }\n\n.icon-svg_frowny_face:before {\n  content: \"\\E009\"; }\n\n.icon-svg_go_arrow:before {\n  content: \"\\E00A\"; }\n\n.icon-svg_gplus:before {\n  content: \"\\E00B\"; }\n\n.icon-svg_hamburger_menu:before {\n  content: \"\\E00C\"; }\n\n.icon-svg_hand:before {\n  content: \"\\E00D\"; }\n\n.icon-svg_harp:before {\n  content: \"\\E00E\"; }\n\n.icon-svg_horn:before {\n  content: \"\\E00F\"; }\n\n.icon-svg_left_arrow:before {\n  content: \"\\E010\"; }\n\n.icon-svg_man:before {\n  content: \"\\E011\"; }\n\n.icon-svg_metronome:before {\n  content: \"\\E012\"; }\n\n.icon-svg_no_record:before {\n  content: \"\\E013\"; }\n\n.icon-svg_pause:before {\n  content: \"\\E014\"; }\n\n.icon-svg_piano:before {\n  content: \"\\E015\"; }\n\n.icon-svg_play:before {\n  content: \"\\E016\"; }\n\n.icon-svg_record:before {\n  content: \"\\E017\"; }\n\n.icon-svg_right_arrow:before {\n  content: \"\\E018\"; }\n\n.icon-svg_rotate_phone:before {\n  content: \"\\E019\"; }\n\n.icon-svg_slow_man:before {\n  content: \"\\E01A\"; }\n\n.icon-svg_twitter:before {\n  content: \"\\E01B\"; }\n\n.icon-svg_wave_form:before {\n  content: \"\\E01C\"; }\n\n.icon-svg_wine_glass:before {\n  content: \"\\E01D\"; }\n\n#Bottom {\n  height: 100px;\n  width: 100%;\n  position: absolute;\n  bottom: 0px;\n  left: 0px;\n  background-color: #f2f2f2;\n  box-shadow: inset 0 10px 10px -10px rgba(0, 0, 0, 0.4); }\n  #Bottom #Controls {\n    max-width: 500px;\n    width: 100%;\n    position: relative;\n    margin-left: auto;\n    margin-right: auto;\n    height: 100%; }\n    #Bottom #Controls .Button {\n      position: absolute;\n      bottom: 20px;\n      width: 60px;\n      height: 60px;\n      line-height: 60px;\n      text-align: center;\n      border-radius: 50%;\n      cursor: pointer;\n      box-shadow: 0 0px 3px 1px rgba(0, 0, 0, 0.2);\n      transition: transform 0.05s; }\n    #Bottom #Controls .Button:active {\n      transform: scale(1.1); }\n    #Bottom #Controls #PlayButton {\n      left: 15px;\n      background-color: #16a8f0;\n      font-size: 60px;\n      color: white; }\n    #Bottom #Controls #Harmony {\n      position: absolute;\n      left: 90px;\n      background-color: #fff;\n      background-image: url(" + __webpack_require__(18) + ");\n      background-size: 100% 100%; }\n    #Bottom #Controls #Harmony.right {\n      background-image: url(" + __webpack_require__(19) + ");\n      background-color: #FFC234;\n      background-size: 100% 100%; }\n    #Bottom #Controls #SliderContainer {\n      width: calc(100% - 220px);\n      position: absolute;\n      right: 35px;\n      top: 40%; }\n      #Bottom #Controls #SliderContainer .Slider #Rail #Fill {\n        background-color: #16a8f0; }\n      #Bottom #Controls #SliderContainer .Slider #Handle {\n        background-color: #16a8f0; }\n      #Bottom #Controls #SliderContainer #manual-tempo {\n        background: none;\n        border: none;\n        color: #16a8f0;\n        display: block;\n        font-size: 21px;\n        margin: 0;\n        position: absolute;\n        right: -93px;\n        text-decoration: none;\n        top: -4px;\n        width: 57px; }\n        @media screen and (max-width: 767px) {\n          #Bottom #Controls #SliderContainer #manual-tempo {\n            display: none; } }\n      #Bottom #Controls #SliderContainer #Tortoise, #Bottom #Controls #SliderContainer #Hare {\n        top: -20px;\n        position: absolute;\n        height: 60px;\n        width: 15px;\n        font-size: 60px;\n        line-height: 60px;\n        pointer-events: none;\n        color: #646464; }\n      #Bottom #Controls #SliderContainer #Hare {\n        right: 0px; }\n      #Bottom #Controls #SliderContainer #Tortoise {\n        left: -43px; }\n", ""]);

	// exports


/***/ }),
/* 18 */
/***/ (function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKoAAACpCAYAAAC74qYsAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAhtJREFUeNrs3MFRg0AUgGHiUEA60Q7EDtIFVzvQErhysxO1A+0gJdABeTvD0ZzChl35vpkMNzI8/pAAGQ7zPDdQuoNQESoIFaGCUEGoCBWECkJFqCBUECpCBaEiVBAqCBWhglBBqAgVhApCRaggVIRqCggVhIpQQaggVIQKQgWhIlQQKggVoYJQESoIFYSKUEGoIFSECkIFoSJUECpCBaGCUBEqCBWEilBBqCBUhApCBaEiVBAqQgWhglARKggVhLqxvu/fYzGM4zhlWPcxFk+FbfJPjm1tM++kNMShpCnGELs7v2V6v1PMosuwA9N8PwsL9SVeX1WFGtIn/tlxtXlMOy9TrLvwYAR3j/VoFEIVq1ARq1DFilDFKlTEKlSxIlSxVqU1gr8ttz7fNojVTQFHVEdWoSJWoe4y1sEYhFq633i9GoNQS4/UCZVQRVojl6eu+2jW+QPwsPzmFKlQ1xfBnGNxvnU9cfY+idRXv697oSJSoSJSoYpUqIhUqCJFqCKtmuuodUea1vdd2LZm+SB69lRmOZ89tSdCRaggVIQKQgWhIlQQKggVoYJQQagIFYSKUEGoIFSECkIFoSJUECoIFaGCUBGqUBEqCBWhglBBqAgVhApCRaggVBAqQgWhIlQQKggVoYJQQagIFYQKQkWoIFSECkIFoSJUECoIFaGCUEGoCBWECkJFqCBUhApCBaEiVBAqCJX/4SLAAIzUH77oewIUAAAAAElFTkSuQmCC"

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKoAAACpCAYAAAC74qYsAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAgBJREFUeNrs3MENgjAYgFE0DuAmugG4kSM4AiO4ibqBbuAIbFBL0qvhIL8p+l7SK9r2E4ghrFJKDdRubQkQKggVoYJQQagIFYQKQkWoIFQQKkIFoSJUECoIFaGCUEGoCBWECkJFqCBUhApCBaEiVBAqCBWhglBBqAgVhApCRaggVIQKQgWhIlQQKggVoYJQQagIFYSKUEGoIFSECkIFoSJUECoIFaGCUEGoCBWEilBBqCBUhApChSkbSxDulEefxxBw7G0e+8rme4+Y6yqlFPml92WTatJ9+fOuJaguYAPHY14qW99DmfOizqjjBrVOqs2ubF5ErO5RCYl1aymEKlahIlahihWhilWoiFWoYkWoYhXqjzjlkWYYrViF6swqVMQqVKZj7S2DUGv3yONoGYRae6Rd4ykroYp0eTzh/965mecB4L7cc4pUqCGeZXxqEKlLv8u9UBGpUBGpUEUqVEQqVJEiVJEumv9Rlx3peLxbZXMN+SFGv9KH2HdP/Q2h4h4VhIpQQaggVIQKQgWhIlQQKggVoYJQESoIFYSKUEGoIFSECkIFoSJUECpCBaGCUBEqCBWEilBBqCBUhApCBaEiVBAqQgWhglARKggVhIpQQaggVIQKQkWoIFQQKkIFoYJQESoIFYSKUEGoIFSECkJFqCBUECpCBaGCUPkNLwEGAJsYWNoPx2CkAAAAAElFTkSuQmCC"

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

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

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(21), __webpack_require__(24)], __WEBPACK_AMD_DEFINE_RESULT__ = function(SliderBar, Transport) {

		var Slider = function(container) {
			this._min = 70;
			this._max = 200;

			this.sliderContainer = document.createElement('div');
			this.sliderContainer.id = 'SliderContainer';
			container.appendChild(this.sliderContainer);

			this.slider = new SliderBar(this.sliderContainer, this._min, this._max, Transport.bpm.value);
			this.slider.onchange = this._changed.bind(this);

			this.rabbit = document.createElement('div');
			this.rabbit.id = 'Hare';
			this.rabbit.classList.add("icon-svg_fast_man");
			this.sliderContainer.appendChild(this.rabbit);

			this.tortoise = document.createElement('div');
			this.tortoise.id = 'Tortoise';
			this.tortoise.classList.add("icon-svg_slow_man");
			this.sliderContainer.appendChild(this.tortoise);

			this.input = document.createElement('input');
			this.input.type = 'number';
			this.input.id = 'manual-tempo';
			this.input.value = this.slider.getValue();
			this.input.min = 70;
			this.input.max = 200;
			this.input.addEventListener("input", this._onInputChange.bind(this));
			this.input.addEventListener("blur", this._resetInput.bind(this));
			this.sliderContainer.appendChild(this.input);
		};

		Slider.prototype._useMinMax = function(val) {
			return val > this._max ? this._max : val < this._min ? this._min : val;
		};

		Slider.prototype._resetInput = function() {
			var val = this.input.value;
			this.input.value = this._useMinMax(val);
		};

		Slider.prototype._onInputChange = function() {
			var val = this.input.value;
			this.slider.setValue(val);
			this._changed(val);
		};

		Slider.prototype._changed = function(tempo) {
			this.input.value = tempo;
			Transport.bpm.value = this._useMinMax(tempo);
		};

		return Slider;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

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

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(22)], __WEBPACK_AMD_DEFINE_RESULT__ = function (mainStyle) {

		var Slider = function(container, min, max, initialValue){

			/**
			 * The minimum slider value
			 * @type {Number}
			 * @private
			 */
			this._min = min || 0;

			/**
			 * The maximum slider value
			 * @type {Number}
			 * @private
			 */
			this._max = max || 100;

			/**
			 * The slider container
			 * @type {Element}
			 * @private
			 */
			this._container = document.createElement("div");
			this._container.classList.add("Slider");
			container.appendChild(this._container);

			/**
			 * The slider which captures the inputs
			 * @type {Element}
			 * @private
			 */
			this._range = document.createElement("input");
			this._range.type = "range";
			this._range.id = "Range";
			this._range.min = min;
			this._range.max = max;
			this._container.appendChild(this._range);
			this._range.addEventListener("input", this._change.bind(this));

			/**
			 * The railing behind the handle
			 * @type {Element}
			 * @private
			 */
			this._rail = document.createElement("div");
			this._rail.id = "Rail";
			this._container.appendChild(this._rail);

			/**
			 * The blue indicator within the rail
			 * @type {Element}
			 * @private
			 */
			this._fill = document.createElement("div");
			this._fill.id = "Fill";
			this._rail.appendChild(this._fill);

			/**
			 * The handle of the slider
			 * @type {Element}
			 * @private
			 */
			this._handle = document.createElement("div");
			this._handle.id = "Handle";
			this._container.appendChild(this._handle);

			/**
			 * Internal number holder
			 * @type {Number}
			 * @private
			 */
			this._value = 0;

			/**
			 * Onchange handler
			 * @type {Function}
			 */
			this.onchange = function(){};

			//set the position initially
			this.setValue(initialValue || 50);

			//add a resize handler
			window.addEventListener("resize", this._update.bind(this));
		};

		Slider.prototype._change = function(){
			this._update();
			this._value = parseFloat(this._range.value);
			this.onchange(this._range.value);
		};

		Slider.prototype._update = function(){
			var percent = (this._range.value - this._min) / (this._max - this._min);
			var handleOffset = this._handle.offsetWidth * percent;
			var halfHandle = this._handle.offsetWidth / 2;
			var percentPixels = percent * this._container.offsetWidth;
			//computer the width in pixels
			this._fill.style.width = (percentPixels - handleOffset + halfHandle).toString() + "px";
			this._handle.style.left = (percentPixels - handleOffset).toString() + "px";
		};

		Slider.prototype.setValue = function(val){
			this._value = val;
			this._range.value = val;
			this._update();
		};

		Slider.prototype.getValue = function(){
			return this._value;
		};

		return Slider;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(23);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/autoprefixer-loader/index.js!../node_modules/sass-loader/index.js!./slider.scss", function() {
				var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/autoprefixer-loader/index.js!../node_modules/sass-loader/index.js!./slider.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, ".Slider {\n  width: 100%;\n  height: 28px;\n  position: absolute;\n  top: -5px;\n  cursor: pointer; }\n  .Slider #Rail {\n    background-color: #cccccc;\n    height: 8px;\n    width: 100%;\n    left: 0px;\n    position: absolute;\n    top: 50%;\n    margin-top: -4px;\n    pointer-events: none;\n    border-radius: 4px; }\n    .Slider #Rail #Fill {\n      border-top-left-radius: 4px;\n      border-bottom-left-radius: 4px;\n      position: absolute;\n      top: 0px;\n      left: 0px;\n      width: 50%;\n      height: 100%;\n      background-color: #16a8f0; }\n  .Slider #Handle {\n    position: absolute;\n    top: 0px;\n    left: 50%;\n    border-radius: 14px;\n    width: 28px;\n    height: 28px;\n    background-color: #16a8f0;\n    pointer-events: none; }\n  .Slider #Range {\n    width: 100%;\n    margin: 0px;\n    height: 28px;\n    position: absolute;\n    top: 0px;\n    left: 0px;\n    opacity: 0;\n    cursor: pointer; }\n", ""]);

	// exports


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(26), __webpack_require__(31), __webpack_require__(34), 
		__webpack_require__(36), __webpack_require__(33), __webpack_require__(37)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

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


/***/ }),
/* 25 */
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


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(27), __webpack_require__(35)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tone) {

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

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(28), __webpack_require__(34)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tone) {

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

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(29), __webpack_require__(31), __webpack_require__(32), __webpack_require__(33)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

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

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(30)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

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

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

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

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tone) {

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

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(31)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

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

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(32), __webpack_require__(31)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tone) {

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

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(31)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tone) {

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

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(34), __webpack_require__(31)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tone) {

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

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tone) {

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

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(31)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tone) {

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

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

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

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(24)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Transport) {

		var OrientationListener = function(callback){

			window.addEventListener("orientationchange", this._changed.bind(this));
			if (window.screen && window.screen.orientation){
				window.screen.orientation.addEventListener("change", this._screenChange.bind(this));
			}

			this._callback = callback;
		};

		OrientationListener.prototype._changed = function(){
			//check if it's landscape
			if (Math.abs(window.orientation) === 90){
				if (Transport.state === "started"){
					this._callback();
				}
			}
		};

		OrientationListener.prototype._screenChange = function(){		
			//check if it's landscape
			if (Math.abs(window.screen.orientation.angle) === 90){
				if (Transport.state === "started"){
					this._callback();
				}
			}
		};

		return OrientationListener;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

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

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(40), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Sequence, Config) {

		var Sequencer = function(callback) {

			var steps = [];
			for (var i = 0; i < Config.gridWidth; i++) {
				steps.push(i);
			}

			this.seq = new Sequence(callback, steps, '8n').start(0);
		};

		return Sequencer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(41), __webpack_require__(24)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tone) {

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

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(42), __webpack_require__(31), __webpack_require__(24)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tone) {

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

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(24), __webpack_require__(31), __webpack_require__(35)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Tone) {

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

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

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

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(44), __webpack_require__(51), __webpack_require__(9), __webpack_require__(24), __webpack_require__(62)], __WEBPACK_AMD_DEFINE_RESULT__ = function(SimpleSynth, Master, Config, Transport, PolySynth) {

		var Player = function() {

			// Transport._clock.lookAhead = 0.05;

			this.melodyPlayer = new PolySynth(3, SimpleSynth).set({
				'volume' : -4,
				'oscillator' : {
					'type' : 'triangle17',
					// 'partials' : [16, 8, 4, 2, 1, 0.5, 1, 2]
				},
				'envelope' : {
					'attack' : 0.01,
					'decay' : 0.1,
					'sustain' : 0.2,
					'release' : 1.7,
				}
			}).toMaster();

			this.melodyPlayer.stealVoices = false;


			this.harmonyPlayer = new PolySynth(2, SimpleSynth).set({
				'volume' : -8,
				'oscillator' : {
					'type' : 'triangle11'
				},
				'envelope' : {
					'attack' : 0.01,
					'decay' : 0.1,
					'sustain' : 0.2,
					'release' : 1.7,
				}
			}).toMaster();
		};

		Player.prototype.play = function(notes, time) {
			if (notes.melody !== -1) {
				var melNote = this._indexToNoteName(notes.melody);
				this.melodyPlayer.triggerAttackRelease(melNote, '8n', time, this._randomVelocity());
			}

			if (notes.harmony !== -1) {
				var harmNote = this._indexToNoteName(notes.harmony);
				this.harmonyPlayer.triggerAttackRelease(harmNote, '8n', time, this._randomVelocity());
			}
		};

		Player.prototype._indexToNoteName = function(index) {
			var noteIndex = Config.pitches.length - index - 1;
			var pitch = Config.pitches[noteIndex];
			return pitch;
		};

		Player.prototype._randomVelocity = function() {
			return (Math.random() * 0.5 + 0.5) * 0.8;
		};

		Player.prototype.tap = function(note) {
			if (Transport.state === 'stopped') {
				var noteIndex = Config.pitches.length - note - 1;
				var pitch = Config.pitches[noteIndex];
				this.melodyPlayer.triggerAttackRelease(pitch, '8t', '+0.01', this._randomVelocity());
			}
		};

		return Player;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(45), __webpack_require__(48), __webpack_require__(28), __webpack_require__(60)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class  Tone.SimpleSynth is composed simply of a Tone.OmniOscillator
		 *          routed through a Tone.AmplitudeEnvelope. 
		 *          <img src="https://docs.google.com/drawings/d/1-1_0YW2Z1J2EPI36P8fNCMcZG7N1w1GZluPs4og4evo/pub?w=1163&h=231">
		 *
		 *  @constructor
		 *  @extends {Tone.Monophonic}
		 *  @param {Object} [options] the options available for the synth 
		 *                          see defaults below
		 *  @example
		 * var synth = new Tone.SimpleSynth().toMaster();
		 * synth.triggerAttackRelease("C4", "8n");
		 */
		Tone.SimpleSynth = function(options){

			//get the defaults
			options = this.defaultArg(options, Tone.SimpleSynth.defaults);
			Tone.Monophonic.call(this, options);

			/**
			 *  The oscillator.
			 *  @type {Tone.OmniOscillator}
			 */
			this.oscillator = new Tone.OmniOscillator(options.oscillator);

			/**
			 *  The frequency control.
			 *  @type {Frequency}
			 *  @signal
			 */
			this.frequency = this.oscillator.frequency;

			/**
			 *  The detune control.
			 *  @type {Cents}
			 *  @signal
			 */
			this.detune = this.oscillator.detune;

			/**
			 *  The amplitude envelope.
			 *  @type {Tone.AmplitudeEnvelope}
			 */
			this.envelope = new Tone.AmplitudeEnvelope(options.envelope);

			//connect the oscillators to the output
			this.oscillator.chain(this.envelope, this.output);
			//start the oscillators
			this.oscillator.start();
			this._readOnly(["oscillator", "frequency", "detune", "envelope"]);
		};

		Tone.extend(Tone.SimpleSynth, Tone.Monophonic);

		/**
		 *  @const
		 *  @static
		 *  @type {Object}
		 */
		Tone.SimpleSynth.defaults = {
			"oscillator" : {
				"type" : "triangle"
			},
			"envelope" : {
				"attack" : 0.005,
				"decay" : 0.1,
				"sustain" : 0.3,
				"release" : 1
			}
		};

		/**
		 *  start the attack portion of the envelope
		 *  @param {Time} [time=now] the time the attack should start
		 *  @param {number} [velocity=1] the velocity of the note (0-1)
		 *  @returns {Tone.SimpleSynth} this
		 *  @private
		 */
		Tone.SimpleSynth.prototype._triggerEnvelopeAttack = function(time, velocity){
			//the envelopes
			this.envelope.triggerAttack(time, velocity);
			return this;	
		};

		/**
		 *  start the release portion of the envelope
		 *  @param {Time} [time=now] the time the release should start
		 *  @returns {Tone.SimpleSynth} this
		 *  @private
		 */
		Tone.SimpleSynth.prototype._triggerEnvelopeRelease = function(time){
			this.envelope.triggerRelease(time);
			return this;
		};


		/**
		 *  clean up
		 *  @returns {Tone.SimpleSynth} this
		 */
		Tone.SimpleSynth.prototype.dispose = function(){
			Tone.Monophonic.prototype.dispose.call(this);
			this._writable(["oscillator", "frequency", "detune", "envelope"]);
			this.oscillator.dispose();
			this.oscillator = null;
			this.envelope.dispose();
			this.envelope = null;
			this.frequency = null;
			this.detune = null;
			return this;
		};

		return Tone.SimpleSynth;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(46), __webpack_require__(33)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class  Tone.AmplitudeEnvelope is a Tone.Envelope connected to a gain node. 
		 *          Unlike Tone.Envelope, which outputs the envelope's value, Tone.AmplitudeEnvelope accepts
		 *          an audio signal as the input and will apply the envelope to the amplitude
		 *          of the signal. Read more about ADSR Envelopes on [Wikipedia](https://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope).
		 *  
		 *  @constructor
		 *  @extends {Tone.Envelope}
		 *  @param {Time|Object} [attack] The amount of time it takes for the envelope to go from 
		 *                               0 to it's maximum value. 
		 *  @param {Time} [decay]	The period of time after the attack that it takes for the envelope
		 *                       	to fall to the sustain value. 
		 *  @param {NormalRange} [sustain]	The percent of the maximum value that the envelope rests at until
		 *                                	the release is triggered. 
		 *  @param {Time} [release]	The amount of time after the release is triggered it takes to reach 0. 
		 *  @example
		 * var ampEnv = new Tone.AmplitudeEnvelope({
		 * 	"attack": 0.1,
		 * 	"decay": 0.2,
		 * 	"sustain": 1.0,
		 * 	"release": 0.8
		 * }).toMaster();
		 * //create an oscillator and connect it
		 * var osc = new Tone.Oscillator().connect(ampEnv).start();
		 * //trigger the envelopes attack and release "8t" apart
		 * ampEnv.triggerAttackRelease("8t");
		 */
		Tone.AmplitudeEnvelope = function(){

			Tone.Envelope.apply(this, arguments);

			/**
			 *  the input node
			 *  @type {GainNode}
			 *  @private
			 */
			this.input = this.output = new Tone.Gain();

			this._sig.connect(this.output.gain);
		};

		Tone.extend(Tone.AmplitudeEnvelope, Tone.Envelope);

		/**
		 *  Clean up
		 *  @return  {Tone.AmplitudeEnvelope}  this
		 */
		Tone.AmplitudeEnvelope.prototype.dispose = function(){
			this.input.dispose();
			this.input = null;
			Tone.Envelope.prototype.dispose.call(this);
			return this;
		};

		return Tone.AmplitudeEnvelope;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(27), 
		__webpack_require__(47), __webpack_require__(31)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class  Tone.Envelope is an [ADSR](https://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope)
		 *          envelope generator. Tone.Envelope outputs a signal which 
		 *          can be connected to an AudioParam or Tone.Signal. 
		 *          <img src="https://upload.wikimedia.org/wikipedia/commons/e/ea/ADSR_parameter.svg">
		 *
		 *  @constructor
		 *  @extends {Tone}
		 *  @param {Time} [attack] The amount of time it takes for the envelope to go from 
		 *                         0 to it's maximum value. 
		 *  @param {Time} [decay]	The period of time after the attack that it takes for the envelope
		 *                       	to fall to the sustain value. 
		 *  @param {NormalRange} [sustain]	The percent of the maximum value that the envelope rests at until
		 *                                	the release is triggered. 
		 *  @param {Time} [release]	The amount of time after the release is triggered it takes to reach 0. 
		 *  @example
		 * //an amplitude envelope
		 * var gainNode = Tone.context.createGain();
		 * var env = new Tone.Envelope({
		 * 	"attack" : 0.1,
		 * 	"decay" : 0.2,
		 * 	"sustain" : 1,
		 * 	"release" : 0.8,
		 * });
		 * env.connect(gainNode.gain);
		 */
		Tone.Envelope = function(){

			//get all of the defaults
			var options = this.optionsObject(arguments, ["attack", "decay", "sustain", "release"], Tone.Envelope.defaults);

			/** 
			 *  When triggerAttack is called, the attack time is the amount of
			 *  time it takes for the envelope to reach it's maximum value. 
			 *  @type {Time}
			 */
			this.attack = options.attack;

			/**
			 *  After the attack portion of the envelope, the value will fall
			 *  over the duration of the decay time to it's sustain value. 
			 *  @type {Time}
			 */
			this.decay = options.decay;
			
			/**
			 * 	The sustain value is the value 
			 * 	which the envelope rests at after triggerAttack is
			 * 	called, but before triggerRelease is invoked. 
			 *  @type {NormalRange}
			 */
			this.sustain = options.sustain;

			/**
			 *  After triggerRelease is called, the envelope's
			 *  value will fall to it's miminum value over the
			 *  duration of the release time. 
			 *  @type {Time}
			 */
			this.release = options.release;

			/**
			 *  the next time the envelope is at standby
			 *  @type {number}
			 *  @private
			 */
			this._attackCurve = Tone.Envelope.Type.Linear;

			/**
			 *  the next time the envelope is at standby
			 *  @type {number}
			 *  @private
			 */
			this._releaseCurve = Tone.Envelope.Type.Exponential;

			/**
			 *  the minimum output value
			 *  @type {number}
			 *  @private
			 */
			this._minOutput = 0.00001;

			/**
			 *  the signal
			 *  @type {Tone.TimelineSignal}
			 *  @private
			 */
			this._sig = this.output = new Tone.TimelineSignal();
			this._sig.setValueAtTime(0, 0);

			//set the attackCurve initially
			this.attackCurve = options.attackCurve;
			this.releaseCurve = options.releaseCurve;
		};

		Tone.extend(Tone.Envelope);

		/**
		 *  the default parameters
		 *  @static
		 *  @const
		 */
		Tone.Envelope.defaults = {
			"attack" : 0.01,
			"decay" : 0.1,
			"sustain" : 0.5,
			"release" : 1,
			"attackCurve" : "linear",
			"releaseCurve" : "exponential",
		};

		/**
		 * Read the current value of the envelope. Useful for 
		 * syncronizing visual output to the envelope. 
		 * @memberOf Tone.Envelope#
		 * @type {Number}
		 * @name value
		 * @readOnly
		 */
		Object.defineProperty(Tone.Envelope.prototype, "value", {
			get : function(){
				return this._sig.value;
			}
		});

		/**
		 * The slope of the attack. Either "linear" or "exponential". 
		 * @memberOf Tone.Envelope#
		 * @type {string}
		 * @name attackCurve
		 * @example
		 * env.attackCurve = "linear";
		 */
		Object.defineProperty(Tone.Envelope.prototype, "attackCurve", {
			get : function(){
				return this._attackCurve;
			}, 
			set : function(type){
				if (type === Tone.Envelope.Type.Linear || 
					type === Tone.Envelope.Type.Exponential){
					this._attackCurve = type;
				} else {
					throw Error("attackCurve must be either \"linear\" or \"exponential\". Invalid type: ", type);
				}
			}
		});

		/**
		 * The slope of the Release. Either "linear" or "exponential".
		 * @memberOf Tone.Envelope#
		 * @type {string}
		 * @name releaseCurve
		 * @example
		 * env.releaseCurve = "linear";
		 */
		Object.defineProperty(Tone.Envelope.prototype, "releaseCurve", {
			get : function(){
				return this._releaseCurve;
			}, 
			set : function(type){
				if (type === Tone.Envelope.Type.Linear || 
					type === Tone.Envelope.Type.Exponential){
					this._releaseCurve = type;
				} else {
					throw Error("releaseCurve must be either \"linear\" or \"exponential\". Invalid type: ", type);
				}
			}
		});

		/**
		 *  Trigger the attack/decay portion of the ADSR envelope. 
		 *  @param  {Time} [time=now] When the attack should start.
		 *  @param {NormalRange} [velocity=1] The velocity of the envelope scales the vales.
		 *                               number between 0-1
		 *  @returns {Tone.Envelope} this
		 *  @example
		 *  //trigger the attack 0.5 seconds from now with a velocity of 0.2
		 *  env.triggerAttack("+0.5", 0.2);
		 */
		Tone.Envelope.prototype.triggerAttack = function(time, velocity){
			//to seconds
			var now = this.now() + this.blockTime;
			time = this.toSeconds(time, now);
			var attack = this.toSeconds(this.attack);
			var decay = this.toSeconds(this.decay);
			velocity = this.defaultArg(velocity, 1);
			//check if it's not a complete attack
			var currentValue = this.getValueAtTime(time);
			if (currentValue > 0){
				//subtract the current value from the attack time
				var attackRate = 1 / attack;
				var remainingDistance = 1 - currentValue;
				//the attack is now the remaining time
				attack = remainingDistance / attackRate;
			}
			attack += time;
			//attack
			if (this._attackCurve === Tone.Envelope.Type.Linear){
				this._sig.linearRampToValueBetween(velocity, time, attack);
			} else {
				this._sig.exponentialRampToValueBetween(velocity, time, attack);
			}
			//decay
			this._sig.exponentialRampToValueBetween(velocity * this.sustain, attack + this.sampleTime, attack + decay);
			return this;
		};
		
		/**
		 *  Triggers the release of the envelope.
		 *  @param  {Time} [time=now] When the release portion of the envelope should start. 
		 *  @returns {Tone.Envelope} this
		 *  @example
		 *  //trigger release immediately
		 *  env.triggerRelease();
		 */
		Tone.Envelope.prototype.triggerRelease = function(time){
			var now = this.now() + this.blockTime;
			time = this.toSeconds(time, now);
			if (this.getValueAtTime(time) > 0){
				var release = this.toSeconds(this.release);
				if (this._releaseCurve === Tone.Envelope.Type.Linear){
					this._sig.linearRampToValueBetween(0, time, time + release);
				} else {
					this._sig.exponentialRampToValueBetween(0, time, release + time);
				}
			}
			return this;
		};

		/**
		 *  Get the scheduled value at the given time. This will
		 *  return the unconverted (raw) value.
		 *  @param  {Number}  time  The time in seconds.
		 *  @return  {Number}  The scheduled value at the given time.
		 */
		Tone.Envelope.prototype.getValueAtTime = function(time){
			return this._sig.getValueAtTime(time);
		};

		/**
		 *  triggerAttackRelease is shorthand for triggerAttack, then waiting
		 *  some duration, then triggerRelease. 
		 *  @param {Time} duration The duration of the sustain.
		 *  @param {Time} [time=now] When the attack should be triggered.
		 *  @param {number} [velocity=1] The velocity of the envelope. 
		 *  @returns {Tone.Envelope} this
		 *  @example
		 * //trigger the attack and then the release after 0.6 seconds.
		 * env.triggerAttackRelease(0.6);
		 */
		Tone.Envelope.prototype.triggerAttackRelease = function(duration, time, velocity) {
			time = this.toSeconds(time);
			this.triggerAttack(time, velocity);
			this.triggerRelease(time + this.toSeconds(duration));
			return this;
		};

		/**
		 *  Borrows the connect method from Tone.Signal. 
		 *  @function
		 *  @private
		 */
		Tone.Envelope.prototype.connect = Tone.Signal.prototype.connect;

		/**
		 *  Disconnect and dispose.
		 *  @returns {Tone.Envelope} this
		 */
		Tone.Envelope.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._sig.dispose();
			this._sig = null;
			return this;
		};

	 	/**
		 *  The phase of the envelope. 
		 *  @enum {string}
		 */
		Tone.Envelope.Type = {
			Linear : "linear",
			Exponential : "exponential",
	 	};

		return Tone.Envelope;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(29)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class Pow applies an exponent to the incoming signal. The incoming signal
		 *         must be AudioRange.
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @param {Positive} exp The exponent to apply to the incoming signal, must be at least 2. 
		 *  @example
		 * var pow = new Tone.Pow(2);
		 * var sig = new Tone.Signal(0.5).connect(pow);
		 * //output of pow is 0.25. 
		 */
		Tone.Pow = function(exp){

			/**
			 * the exponent
			 * @private
			 * @type {number}
			 */
			this._exp = this.defaultArg(exp, 1);

			/**
			 *  @type {WaveShaperNode}
			 *  @private
			 */
			this._expScaler = this.input = this.output = new Tone.WaveShaper(this._expFunc(this._exp), 8192);
		};

		Tone.extend(Tone.Pow, Tone.SignalBase);

		/**
		 * The value of the exponent.
		 * @memberOf Tone.Pow#
		 * @type {number}
		 * @name value
		 */
		Object.defineProperty(Tone.Pow.prototype, "value", {
			get : function(){
				return this._exp;
			},
			set : function(exp){
				this._exp = exp;
				this._expScaler.setMap(this._expFunc(this._exp));
			}
		});


		/**
		 *  the function which maps the waveshaper
		 *  @param   {number} exp
		 *  @return {function}
		 *  @private
		 */
		Tone.Pow.prototype._expFunc = function(exp){
			return function(val){
				return Math.pow(Math.abs(val), exp);
			};
		};

		/**
		 *  Clean up.
		 *  @returns {Tone.Pow} this
		 */
		Tone.Pow.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._expScaler.dispose();
			this._expScaler = null;
			return this;
		};

		return Tone.Pow;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(49), __webpack_require__(52), __webpack_require__(53), __webpack_require__(54), 
		__webpack_require__(56), __webpack_require__(57), __webpack_require__(59)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class Tone.OmniOscillator aggregates Tone.Oscillator, Tone.PulseOscillator,
		 *         Tone.PWMOscillator, Tone.FMOscillator, Tone.AMOscillator, and Tone.FatOscillator
		 *         into one class. The oscillator class can be changed by setting the `type`. 
		 *         `omniOsc.type = "pwm"` will set it to the Tone.PWMOscillator. Prefixing
		 *         any of the basic types ("sine", "square4", etc.) with "fm", "am", or "fat"
		 *         will use the FMOscillator, AMOscillator or FatOscillator respectively. 
		 *         For example: `omniOsc.type = "fatsawtooth"` will create set the oscillator
		 *         to a FatOscillator of type "sawtooth". 
		 *
		 *  @extends {Tone.Oscillator}
		 *  @constructor
		 *  @param {Frequency} frequency The initial frequency of the oscillator.
		 *  @param {String} type The type of the oscillator.
		 *  @example
		 *  var omniOsc = new Tone.OmniOscillator("C#4", "pwm");
		 */
		Tone.OmniOscillator = function(){
			var options = this.optionsObject(arguments, ["frequency", "type"], Tone.OmniOscillator.defaults);
			Tone.Source.call(this, options);

			/**
			 *  The frequency control.
			 *  @type {Frequency}
			 *  @signal
			 */
			this.frequency = new Tone.Signal(options.frequency, Tone.Type.Frequency);

			/**
			 *  The detune control
			 *  @type {Cents}
			 *  @signal
			 */
			this.detune = new Tone.Signal(options.detune, Tone.Type.Cents);

			/**
			 *  the type of the oscillator source
			 *  @type {String}
			 *  @private
			 */
			this._sourceType = undefined;

			/**
			 *  the oscillator
			 *  @type {Tone.Oscillator}
			 *  @private
			 */
			this._oscillator = null;

			//set the oscillator
			this.type = options.type;
			this._readOnly(["frequency", "detune"]);
			//set the options
			this.set(options);
		};

		Tone.extend(Tone.OmniOscillator, Tone.Oscillator);

		/**
		 *  default values
		 *  @static
		 *  @type {Object}
		 *  @const
		 */
		Tone.OmniOscillator.defaults = {
			"frequency" : 440,
			"detune" : 0,
			"type" : "sine",
			"phase" : 0,
		};

		/**
		 *  @enum {String}
		 *  @private
		 */
		var OmniOscType = {
			Pulse : "PulseOscillator",
			PWM : "PWMOscillator",
			Osc : "Oscillator",
			FM : "FMOscillator",
			AM : "AMOscillator",
			Fat : "FatOscillator"
		};

		/**
		 *  start the oscillator
		 *  @param {Time} [time=now] the time to start the oscillator
		 *  @private
		 */
		Tone.OmniOscillator.prototype._start = function(time){
			this._oscillator.start(time);
		};

		/**
		 *  start the oscillator
		 *  @param {Time} [time=now] the time to start the oscillator
		 *  @private
		 */
		Tone.OmniOscillator.prototype._stop = function(time){
			this._oscillator.stop(time);
		};

		/**
		 * The type of the oscillator. Can be any of the basic types: sine, square, triangle, sawtooth. Or
		 * prefix the basic types with "fm", "am", or "fat" to use the FMOscillator, AMOscillator or FatOscillator
		 * types. The oscillator could also be set to "pwm" or "pulse". All of the parameters of the
		 * oscillator's class are accessible when the oscillator is set to that type, but throws an error 
		 * when it's not.
		 * 
		 * @memberOf Tone.OmniOscillator#
		 * @type {String}
		 * @name type
		 * @example
		 * omniOsc.type = "pwm";
		 * //modulationFrequency is parameter which is available
		 * //only when the type is "pwm". 
		 * omniOsc.modulationFrequency.value = 0.5;
		 * @example
		 * //an square wave frequency modulated by a sawtooth
		 * omniOsc.type = "fmsquare";
		 * omniOsc.modulationType = "sawtooth";
		 */
		Object.defineProperty(Tone.OmniOscillator.prototype, "type", {
			get : function(){
				var prefix = "";
				if (this._sourceType === OmniOscType.FM){
					prefix = "fm";
				} else if (this._sourceType === OmniOscType.AM){
					prefix = "am";
				} else if (this._sourceType === OmniOscType.Fat){
					prefix = "fat";
				}
				return prefix + this._oscillator.type;
			}, 
			set : function(type){
				if (type.substr(0, 2) === "fm"){
					this._createNewOscillator(OmniOscType.FM);
					this._oscillator.type = type.substr(2);
				} else if (type.substr(0, 2) === "am"){
					this._createNewOscillator(OmniOscType.AM);
					this._oscillator.type = type.substr(2);
				} else if (type.substr(0, 3) === "fat"){
					this._createNewOscillator(OmniOscType.Fat);
					this._oscillator.type = type.substr(3);
				} else if (type === "pwm"){
					this._createNewOscillator(OmniOscType.PWM);
				} else if (type === "pulse"){
					this._createNewOscillator(OmniOscType.Pulse);
				} else {
					this._createNewOscillator(OmniOscType.Osc);
					this._oscillator.type = type;
				}
			}
		});

		/**
		 * The partials of the waveform. A partial represents 
		 * the amplitude at a harmonic. The first harmonic is the 
		 * fundamental frequency, the second is the octave and so on
		 * following the harmonic series. 
		 * Setting this value will automatically set the type to "custom". 
		 * The value is an empty array when the type is not "custom". 
		 * This is not available on "pwm" and "pulse" oscillator types.
		 * @memberOf Tone.OmniOscillator#
		 * @type {Array}
		 * @name partials
		 * @example
		 * osc.partials = [1, 0.2, 0.01];
		 */
		Object.defineProperty(Tone.OmniOscillator.prototype, "partials", {
			get : function(){
				return this._oscillator.partials;
			}, 
			set : function(partials){
				this._oscillator.partials = partials;
			}
		});

		/**
		 *  Set a member/attribute of the oscillator. 
		 *  @param {Object|String} params
		 *  @param {number=} value
		 *  @param {Time=} rampTime
		 *  @returns {Tone.OmniOscillator} this
		 */
		Tone.OmniOscillator.prototype.set = function(params, value){
			//make sure the type is set first
			if (params === "type"){
				this.type = value;
			} else if (this.isObject(params) && params.hasOwnProperty("type")){
				this.type = params.type;
			}
			//then set the rest
			Tone.prototype.set.apply(this, arguments);
			return this;
		};

		/**
		 *  connect the oscillator to the frequency and detune signals
		 *  @private
		 */
		Tone.OmniOscillator.prototype._createNewOscillator = function(oscType){
			if (oscType !== this._sourceType){
				this._sourceType = oscType;
				var OscillatorConstructor = Tone[oscType];
				//short delay to avoid clicks on the change
				var now = this.now() + this.blockTime;
				if (this._oscillator !== null){
					var oldOsc = this._oscillator;
					oldOsc.stop(now);
					//dispose the old one
					setTimeout(function(){
						oldOsc.dispose();
						oldOsc = null;
					}, this.blockTime * 1000);
				}
				this._oscillator = new OscillatorConstructor();
				this.frequency.connect(this._oscillator.frequency);
				this.detune.connect(this._oscillator.detune);
				this._oscillator.connect(this.output);
				if (this.state === Tone.State.Started){
					this._oscillator.start(now);
				}
			}
		};

		/**
		 * The phase of the oscillator in degrees. 
		 * @memberOf Tone.OmniOscillator#
		 * @type {Degrees}
		 * @name phase
		 */
		Object.defineProperty(Tone.OmniOscillator.prototype, "phase", {
			get : function(){
				return this._oscillator.phase;
			}, 
			set : function(phase){
				this._oscillator.phase = phase;
			}
		});

		/**
		 * The width of the oscillator (only if the oscillator is set to "pulse")
		 * @memberOf Tone.OmniOscillator#
		 * @type {NormalRange}
		 * @signal
		 * @name width
		 * @example
		 * var omniOsc = new Tone.OmniOscillator(440, "pulse");
		 * //can access the width attribute only if type === "pulse"
		 * omniOsc.width.value = 0.2; 
		 */
		Object.defineProperty(Tone.OmniOscillator.prototype, "width", {
			get : function(){
				if (this._sourceType === OmniOscType.Pulse){
					return this._oscillator.width;
				} 
			}
		});

		/**
		 * The number of detuned oscillators
		 * @memberOf Tone.OmniOscillator#
		 * @type {Number}
		 * @name count
		 */
		Object.defineProperty(Tone.OmniOscillator.prototype, "count", {
			get : function(){
				if (this._sourceType === OmniOscType.Fat){
					return this._oscillator.count;
				} 
			},
			set : function(count){
				if (this._sourceType === OmniOscType.Fat){
					this._oscillator.count = count;
				} 
			}
		});

		/**
		 * The detune spread between the oscillators. If "count" is
		 * set to 3 oscillators and the "spread" is set to 40,
		 * the three oscillators would be detuned like this: [-20, 0, 20]
		 * for a total detune spread of 40 cents. See Tone.FatOscillator
		 * for more info.
		 * @memberOf Tone.OmniOscillator#
		 * @type {Cents}
		 * @name spread
		 */
		Object.defineProperty(Tone.OmniOscillator.prototype, "spread", {
			get : function(){
				if (this._sourceType === OmniOscType.Fat){
					return this._oscillator.spread;
				} 
			},
			set : function(spread){
				if (this._sourceType === OmniOscType.Fat){
					this._oscillator.spread = spread;
				} 
			}
		});

		/**
		 * The type of the modulator oscillator. Only if the oscillator
		 * is set to "am" or "fm" types. see. Tone.AMOscillator or Tone.FMOscillator
		 * for more info. 
		 * @memberOf Tone.OmniOscillator#
		 * @type {String}
		 * @name modulationType
		 */
		Object.defineProperty(Tone.OmniOscillator.prototype, "modulationType", {
			get : function(){
				if (this._sourceType === OmniOscType.FM || this._sourceType === OmniOscType.AM){
					return this._oscillator.modulationType;
				} 
			},
			set : function(mType){
				if (this._sourceType === OmniOscType.FM || this._sourceType === OmniOscType.AM){
					this._oscillator.modulationType = mType;
				} 
			}
		});

		/**
		 * The modulation index which is in essence the depth or amount of the modulation. In other terms it is the 
		 * ratio of the frequency of the modulating signal (mf) to the amplitude of the 
		 * modulating signal (ma) -- as in ma/mf. 
		 * See Tone.FMOscillator for more info. 
		 * @type {Positive}
		 * @signal
		 * @name modulationIndex
		 */
		Object.defineProperty(Tone.OmniOscillator.prototype, "modulationIndex", {
			get : function(){
				if (this._sourceType === OmniOscType.FM){
					return this._oscillator.modulationIndex;
				} 
			}
		});

		/**
		 *  Harmonicity is the frequency ratio between the carrier and the modulator oscillators. 
		 *  A harmonicity of 1 gives both oscillators the same frequency. 
		 *  Harmonicity = 2 means a change of an octave. See Tone.AMOscillator or Tone.FMOscillator
		 *  for more info. 
		 *  @memberOf Tone.OmniOscillator#
		 *  @signal
		 *  @type {Positive}
		 *  @name harmonicity
		 */
		Object.defineProperty(Tone.OmniOscillator.prototype, "harmonicity", {
			get : function(){
				if (this._sourceType === OmniOscType.FM || this._sourceType === OmniOscType.AM){
					return this._oscillator.harmonicity;
				} 
			}
		});

		/**
		 * The modulationFrequency Signal of the oscillator 
		 * (only if the oscillator type is set to pwm). See 
		 * Tone.PWMOscillator for more info. 
		 * @memberOf Tone.OmniOscillator#
		 * @type {Frequency}
		 * @signal
		 * @name modulationFrequency
		 * @example
		 * var omniOsc = new Tone.OmniOscillator(440, "pwm");
		 * //can access the modulationFrequency attribute only if type === "pwm"
		 * omniOsc.modulationFrequency.value = 0.2; 
		 */
		Object.defineProperty(Tone.OmniOscillator.prototype, "modulationFrequency", {
			get : function(){
				if (this._sourceType === OmniOscType.PWM){
					return this._oscillator.modulationFrequency;
				} 
			}
		});

		/**
		 *  Clean up.
		 *  @return {Tone.OmniOscillator} this
		 */
		Tone.OmniOscillator.prototype.dispose = function(){
			Tone.Source.prototype.dispose.call(this);
			this._writable(["frequency", "detune"]);
			this.detune.dispose();
			this.detune = null;
			this.frequency.dispose();
			this.frequency = null;
			this._oscillator.dispose();
			this._oscillator = null;
			this._sourceType = null;
			return this;
		};

		return Tone.OmniOscillator;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(24), __webpack_require__(50), __webpack_require__(51),
		__webpack_require__(31), __webpack_require__(35), __webpack_require__(28)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";
		
		/**
		 *  @class  Base class for sources. Sources have start/stop methods
		 *          and the ability to be synced to the 
		 *          start/stop of Tone.Transport. 
		 *
		 *  @constructor
		 *  @extends {Tone}
		 *  @example
		 * //Multiple state change events can be chained together,
		 * //but must be set in the correct order and with ascending times
		 * 
		 * // OK
		 * state.start().stop("+0.2");
		 * // AND
		 * state.start().stop("+0.2").start("+0.4").stop("+0.7")
		 *
		 * // BAD
		 * state.stop("+0.2").start();
		 * // OR
		 * state.start("+0.3").stop("+0.2");
		 * 
		 */	
		Tone.Source = function(options){
			//Sources only have an output and no input
			Tone.call(this);

			options = this.defaultArg(options, Tone.Source.defaults);

			/**
			 *  The output volume node
			 *  @type  {Tone.Volume}
			 *  @private
			 */
			this._volume = this.output = new Tone.Volume(options.volume);

			/**
			 * The volume of the output in decibels.
			 * @type {Decibels}
			 * @signal
			 * @example
			 * source.volume.value = -6;
			 */
			this.volume = this._volume.volume;
			this._readOnly("volume");

			/**
			 * 	Keep track of the scheduled state.
			 *  @type {Tone.TimelineState}
			 *  @private
			 */
			this._state = new Tone.TimelineState(Tone.State.Stopped);

			/**
			 *  The synced `start` callback function from the transport
			 *  @type {Function}
			 *  @private
			 */
			this._syncStart = function(time, offset){
				time = this.toSeconds(time);
				time += this.toSeconds(this._startDelay);
				this.start(time, offset);
			}.bind(this);

			/**
			 *  The synced `stop` callback function from the transport
			 *  @type {Function}
			 *  @private
			 */
			this._syncStop = this.stop.bind(this);

			/**
			 *  The offset from the start of the Transport `start`
			 *  @type {Time}
			 *  @private
			 */
			this._startDelay = 0;

			//make the output explicitly stereo
			this._volume.output.output.channelCount = 2;
			this._volume.output.output.channelCountMode = "explicit";
		};

		Tone.extend(Tone.Source);

		/**
		 *  The default parameters
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
		Tone.Source.defaults = {
			"volume" : 0,
		};

		/**
		 *  Returns the playback state of the source, either "started" or "stopped".
		 *  @type {Tone.State}
		 *  @readOnly
		 *  @memberOf Tone.Source#
		 *  @name state
		 */
		Object.defineProperty(Tone.Source.prototype, "state", {
			get : function(){
				return this._state.getStateAtTime(this.now());
			}
		});

		/**
		 *  Start the source at the specified time. If no time is given, 
		 *  start the source now.
		 *  @param  {Time} [time=now] When the source should be started.
		 *  @returns {Tone.Source} this
		 *  @example
		 * source.start("+0.5"); //starts the source 0.5 seconds from now
		 */
		Tone.Source.prototype.start = function(time){
			time = this.toSeconds(time);
			if (this._state.getStateAtTime(time) !== Tone.State.Started || this.retrigger){
				this._state.setStateAtTime(Tone.State.Started, time);
				if (this._start){
					this._start.apply(this, arguments);
				}
			}
			return this;
		};

		/**
		 *  Stop the source at the specified time. If no time is given, 
		 *  stop the source now.
		 *  @param  {Time} [time=now] When the source should be stopped. 
		 *  @returns {Tone.Source} this
		 *  @example
		 * source.stop(); // stops the source immediately
		 */
		Tone.Source.prototype.stop = function(time){
			time = this.toSeconds(time);
			if (this._state.getStateAtTime(time) === Tone.State.Started){
				this._state.setStateAtTime(Tone.State.Stopped, time);
				if (this._stop){
					this._stop.apply(this, arguments);
				}
			}
			return this;
		};
		
		/**
		 *  Sync the source to the Transport so that when the transport
		 *  is started, this source is started and when the transport is stopped
		 *  or paused, so is the source. 
		 *
		 *  @param {Time} [delay=0] Delay time before starting the source after the
		 *                               Transport has started. 
		 *  @returns {Tone.Source} this
		 *  @example
		 * //sync the source to start 1 measure after the transport starts
		 * source.sync("1m");
		 * //start the transport. the source will start 1 measure later. 
		 * Tone.Transport.start();
		 */
		Tone.Source.prototype.sync = function(delay){
			this._startDelay = this.defaultArg(delay, 0);
			Tone.Transport.on("start", this._syncStart);
			Tone.Transport.on("stop pause", this._syncStop);
			return this;
		};

		/**
		 *  Unsync the source to the Transport. See Tone.Source.sync
		 *  @returns {Tone.Source} this
		 */
		Tone.Source.prototype.unsync = function(){
			this._startDelay = 0;
			Tone.Transport.off("start", this._syncStart);
			Tone.Transport.off("stop pause", this._syncStop);
			return this;
		};

		/**
		 *	Clean up.
		 *  @return {Tone.Source} this
		 */
		Tone.Source.prototype.dispose = function(){
			this.stop();
			Tone.prototype.dispose.call(this);
			this.unsync();
			this._writable("volume");
			this._volume.dispose();
			this._volume = null;
			this.volume = null;
			this._state.dispose();
			this._state = null;
			this._syncStart = null;
			this._syncStart = null;
		};

		return Tone.Source;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(28), __webpack_require__(33)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

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

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(50)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

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

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(28), __webpack_require__(49), __webpack_require__(24)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class Tone.Oscillator supports a number of features including
		 *         phase rotation, multiple oscillator types (see Tone.Oscillator.type), 
		 *         and Transport syncing (see Tone.Oscillator.syncFrequency).
		 *
		 *  @constructor
		 *  @extends {Tone.Source}
		 *  @param {Frequency} [frequency] Starting frequency
		 *  @param {string} [type] The oscillator type. Read more about type below.
		 *  @example
		 * //make and start a 440hz sine tone
		 * var osc = new Tone.Oscillator(440, "sine").toMaster().start();
		 */
		Tone.Oscillator = function(){
			
			var options = this.optionsObject(arguments, ["frequency", "type"], Tone.Oscillator.defaults);
			Tone.Source.call(this, options);

			/**
			 *  the main oscillator
			 *  @type {OscillatorNode}
			 *  @private
			 */
			this._oscillator = null;
			
			/**
			 *  The frequency control.
			 *  @type {Frequency}
			 *  @signal
			 */
			this.frequency = new Tone.Signal(options.frequency, Tone.Type.Frequency);

			/**
			 *  The detune control signal.
			 *  @type {Cents}
			 *  @signal
			 */
			this.detune = new Tone.Signal(options.detune, Tone.Type.Cents);

			/**
			 *  the periodic wave
			 *  @type {PeriodicWave}
			 *  @private
			 */
			this._wave = null;

			/**
			 *  The partials of the oscillator
			 *  @type {Array}
			 *  @private
			 */
			this._partials = this.defaultArg(options.partials, [1]);

			/**
			 *  the phase of the oscillator
			 *  between 0 - 360
			 *  @type {number}
			 *  @private
			 */
			this._phase = options.phase;

			/**
			 *  the type of the oscillator
			 *  @type {string}
			 *  @private
			 */
			this._type = null;
			
			//setup
			this.type = options.type;
			this.phase = this._phase;
			this._readOnly(["frequency", "detune"]);
		};

		Tone.extend(Tone.Oscillator, Tone.Source);

		/**
		 *  the default parameters
		 *  @type {Object}
		 */
		Tone.Oscillator.defaults = {
			"type" : "sine",
			"frequency" : 440,
			"detune" : 0,
			"phase" : 0,
			"partials" : []
		};

		/**
		 *  The Oscillator types
		 *  @enum {String}
		 */
		Tone.Oscillator.Type = {
			Sine : "sine",
			Triangle : "triangle",
			Sawtooth : "sawtooth",
			Square : "square",
			Custom : "custom"
		};

		/**
		 *  start the oscillator
		 *  @param  {Time} [time=now] 
		 *  @private
		 */
		Tone.Oscillator.prototype._start = function(time){
			//new oscillator with previous values
			this._oscillator = this.context.createOscillator();
			this._oscillator.setPeriodicWave(this._wave);
			//connect the control signal to the oscillator frequency & detune
			this._oscillator.connect(this.output);
			this.frequency.connect(this._oscillator.frequency);
			this.detune.connect(this._oscillator.detune);
			//start the oscillator
			this._oscillator.start(this.toSeconds(time));
		};

		/**
		 *  stop the oscillator
		 *  @private
		 *  @param  {Time} [time=now] (optional) timing parameter
		 *  @returns {Tone.Oscillator} this
		 */
		Tone.Oscillator.prototype._stop = function(time){
			if (this._oscillator){
				this._oscillator.stop(this.toSeconds(time));
				this._oscillator = null;
			}
			return this;
		};

		/**
		 *  Sync the signal to the Transport's bpm. Any changes to the transports bpm,
		 *  will also affect the oscillators frequency. 
		 *  @returns {Tone.Oscillator} this
		 *  @example
		 * Tone.Transport.bpm.value = 120;
		 * osc.frequency.value = 440;
		 * //the ration between the bpm and the frequency will be maintained
		 * osc.syncFrequency();
		 * Tone.Transport.bpm.value = 240; 
		 * // the frequency of the oscillator is doubled to 880
		 */
		Tone.Oscillator.prototype.syncFrequency = function(){
			Tone.Transport.syncSignal(this.frequency);
			return this;
		};

		/**
		 *  Unsync the oscillator's frequency from the Transport. 
		 *  See Tone.Oscillator.syncFrequency
		 *  @returns {Tone.Oscillator} this
		 */
		Tone.Oscillator.prototype.unsyncFrequency = function(){
			Tone.Transport.unsyncSignal(this.frequency);
			return this;
		};

		/**
		 * The type of the oscillator: either sine, square, triangle, or sawtooth. Also capable of
		 * setting the first x number of partials of the oscillator. For example: "sine4" would
		 * set be the first 4 partials of the sine wave and "triangle8" would set the first
		 * 8 partials of the triangle wave.
		 * <br><br> 
		 * Uses PeriodicWave internally even for native types so that it can set the phase. 
		 * PeriodicWave equations are from the 
		 * [Webkit Web Audio implementation](https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/modules/webaudio/PeriodicWave.cpp&sq=package:chromium).
		 *  
		 * @memberOf Tone.Oscillator#
		 * @type {string}
		 * @name type
		 * @example
		 * //set it to a square wave
		 * osc.type = "square";
		 * @example
		 * //set the first 6 partials of a sawtooth wave
		 * osc.type = "sawtooth6";
		 */
		Object.defineProperty(Tone.Oscillator.prototype, "type", {
			get : function(){
				return this._type;
			},
			set : function(type){
				var coefs = this._getRealImaginary(type, this._phase);
				var periodicWave = this.context.createPeriodicWave(coefs[0], coefs[1]);
				this._wave = periodicWave;
				if (this._oscillator !== null){
					this._oscillator.setPeriodicWave(this._wave);
				}
				this._type = type;
			}
		});

		/**
		 *  Returns the real and imaginary components based 
		 *  on the oscillator type.
		 *  @returns {Array} [real, imaginary]
		 *  @private
		 */
		Tone.Oscillator.prototype._getRealImaginary = function(type, phase){
			var fftSize = 4096;
			var periodicWaveSize = fftSize / 2;

			var real = new Float32Array(periodicWaveSize);
			var imag = new Float32Array(periodicWaveSize);
			
			var partialCount = 1;
			if (type === Tone.Oscillator.Type.Custom){
				partialCount = this._partials.length + 1;
				periodicWaveSize = partialCount;
			} else {
				var partial = /^(sine|triangle|square|sawtooth)(\d+)$/.exec(type);
				if (partial){
					partialCount = parseInt(partial[2]) + 1;
					type = partial[1];
					partialCount = Math.max(partialCount, 2);
					periodicWaveSize = partialCount;
				}
			}

			for (var n = 1; n < periodicWaveSize; ++n) {
				var piFactor = 2 / (n * Math.PI);
				var b; 
				switch (type) {
					case Tone.Oscillator.Type.Sine: 
						b = (n <= partialCount) ? 1 : 0;
						break;
					case Tone.Oscillator.Type.Square:
						b = (n & 1) ? 2 * piFactor : 0;
						break;
					case Tone.Oscillator.Type.Sawtooth:
						b = piFactor * ((n & 1) ? 1 : -1);
						break;
					case Tone.Oscillator.Type.Triangle:
						if (n & 1) {
							b = 2 * (piFactor * piFactor) * ((((n - 1) >> 1) & 1) ? -1 : 1);
						} else {
							b = 0;
						}
						break;
					case Tone.Oscillator.Type.Custom: 
						b = this._partials[n - 1];
						break;
					default:
						throw new Error("invalid oscillator type: "+type);
				}
				if (b !== 0){
					real[n] = -b * Math.sin(phase * n);
					imag[n] = b * Math.cos(phase * n);
				} else {
					real[n] = 0;
					imag[n] = 0;
				}
			}
			return [real, imag];
		};

		/**
		 *  Compute the inverse FFT for a given phase.	
		 *  @param  {Float32Array}  real
		 *  @param  {Float32Array}  imag 
		 *  @param  {NormalRange}  phase 
		 *  @return  {AudioRange}
		 *  @private
		 */
		Tone.Oscillator.prototype._inverseFFT = function(real, imag, phase){
			var sum = 0;
			var len = real.length;
			for (var i = 0; i < len; i++){
				sum += real[i] * Math.cos(i * phase) + imag[i] * Math.sin(i * phase);
			}
			return sum;
		};

		/**
		 *  Returns the initial value of the oscillator.
		 *  @return  {AudioRange}
		 *  @private
		 */
		Tone.Oscillator.prototype._getInitialValue = function(){
			var coefs = this._getRealImaginary(this._type, 0);
			var real = coefs[0];
			var imag = coefs[1];
			var maxValue = 0;
			var twoPi = Math.PI * 2;
			//check for peaks in 8 places
			for (var i = 0; i < 8; i++){
				maxValue = Math.max(this._inverseFFT(real, imag, (i / 8) * twoPi), maxValue);
			}
			return -this._inverseFFT(real, imag, this._phase) / maxValue;
		};

		/**
		 * The partials of the waveform. A partial represents 
		 * the amplitude at a harmonic. The first harmonic is the 
		 * fundamental frequency, the second is the octave and so on
		 * following the harmonic series. 
		 * Setting this value will automatically set the type to "custom". 
		 * The value is an empty array when the type is not "custom". 
		 * @memberOf Tone.Oscillator#
		 * @type {Array}
		 * @name partials
		 * @example
		 * osc.partials = [1, 0.2, 0.01];
		 */
		Object.defineProperty(Tone.Oscillator.prototype, "partials", {
			get : function(){
				if (this._type !== Tone.Oscillator.Type.Custom){
					return [];
				} else {
					return this._partials;
				}
			}, 
			set : function(partials){
				this._partials = partials;
				this.type = Tone.Oscillator.Type.Custom;
			}
		});

		/**
		 * The phase of the oscillator in degrees. 
		 * @memberOf Tone.Oscillator#
		 * @type {Degrees}
		 * @name phase
		 * @example
		 * osc.phase = 180; //flips the phase of the oscillator
		 */
		Object.defineProperty(Tone.Oscillator.prototype, "phase", {
			get : function(){
				return this._phase * (180 / Math.PI);
			}, 
			set : function(phase){
				this._phase = phase * Math.PI / 180;
				//reset the type
				this.type = this._type;
			}
		});

		/**
		 *  Dispose and disconnect.
		 *  @return {Tone.Oscillator} this
		 */
		Tone.Oscillator.prototype.dispose = function(){
			Tone.Source.prototype.dispose.call(this);
			if (this._oscillator !== null){
				this._oscillator.disconnect();
				this._oscillator = null;
			}
			this._wave = null;
			this._writable(["frequency", "detune"]);
			this.frequency.dispose();
			this.frequency = null;
			this.detune.dispose();
			this.detune = null;
			this._partials = null;
			return this;
		};

		return Tone.Oscillator;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(49), __webpack_require__(52), __webpack_require__(28), __webpack_require__(29)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class Tone.PulseOscillator is a pulse oscillator with control over pulse width,
		 *         also known as the duty cycle. At 50% duty cycle (width = 0.5) the wave is 
		 *         a square and only odd-numbered harmonics are present. At all other widths 
		 *         even-numbered harmonics are present. Read more 
		 *         [here](https://wigglewave.wordpress.com/2014/08/16/pulse-waveforms-and-harmonics/).
		 *
		 *  @constructor
		 *  @extends {Tone.Oscillator}
		 *  @param {Frequency} [frequency] The frequency of the oscillator
		 *  @param {NormalRange} [width] The width of the pulse
		 *  @example
		 * var pulse = new Tone.PulseOscillator("E5", 0.4).toMaster().start();
		 */
		Tone.PulseOscillator = function(){

			var options = this.optionsObject(arguments, ["frequency", "width"], Tone.Oscillator.defaults);
			Tone.Source.call(this, options);

			/**
			 *  The width of the pulse. 
			 *  @type {NormalRange}
			 *  @signal
			 */
			this.width = new Tone.Signal(options.width, Tone.Type.NormalRange);

			/**
			 *  gate the width amount
			 *  @type {GainNode}
			 *  @private
			 */
			this._widthGate = this.context.createGain();

			/**
			 *  the sawtooth oscillator
			 *  @type {Tone.Oscillator}
			 *  @private
			 */
			this._sawtooth = new Tone.Oscillator({
				frequency : options.frequency,
				detune : options.detune,
				type : "sawtooth",
				phase : options.phase
			});

			/**
			 *  The frequency control.
			 *  @type {Frequency}
			 *  @signal
			 */
			this.frequency = this._sawtooth.frequency;

			/**
			 *  The detune in cents. 
			 *  @type {Cents}
			 *  @signal
			 */
			this.detune = this._sawtooth.detune;

			/**
			 *  Threshold the signal to turn it into a square
			 *  @type {Tone.WaveShaper}
			 *  @private
			 */
			this._thresh = new Tone.WaveShaper(function(val){
				if (val < 0){
					return -1;
				} else {
					return 1;
				}
			});

			//connections
			this._sawtooth.chain(this._thresh, this.output);
			this.width.chain(this._widthGate, this._thresh);
			this._readOnly(["width", "frequency", "detune"]);
		};

		Tone.extend(Tone.PulseOscillator, Tone.Oscillator);

		/**
		 *  The default parameters.
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
		Tone.PulseOscillator.defaults = {
			"frequency" : 440,
			"detune" : 0,
			"phase" : 0,
			"width" : 0.2,
		};

		/**
		 *  start the oscillator
		 *  @param  {Time} time 
		 *  @private
		 */
		Tone.PulseOscillator.prototype._start = function(time){
			time = this.toSeconds(time);
			this._sawtooth.start(time);
			this._widthGate.gain.setValueAtTime(1, time);
		};

		/**
		 *  stop the oscillator
		 *  @param  {Time} time 
		 *  @private
		 */
		Tone.PulseOscillator.prototype._stop = function(time){
			time = this.toSeconds(time);
			this._sawtooth.stop(time);
			//the width is still connected to the output. 
			//that needs to be stopped also
			this._widthGate.gain.setValueAtTime(0, time);
		};

		/**
		 * The phase of the oscillator in degrees.
		 * @memberOf Tone.PulseOscillator#
		 * @type {Degrees}
		 * @name phase
		 */
		Object.defineProperty(Tone.PulseOscillator.prototype, "phase", {
			get : function(){
				return this._sawtooth.phase;
			}, 
			set : function(phase){
				this._sawtooth.phase = phase;
			}
		});

		/**
		 * The type of the oscillator. Always returns "pulse".
		 * @readOnly
		 * @memberOf Tone.PulseOscillator#
		 * @type {string}
		 * @name type
		 */
		Object.defineProperty(Tone.PulseOscillator.prototype, "type", {
			get : function(){
				return "pulse";
			}
		});

		/**
		 * The partials of the waveform. Cannot set partials for this waveform type
		 * @memberOf Tone.PulseOscillator#
		 * @type {Array}
		 * @name partials
		 * @private
		 */
		Object.defineProperty(Tone.PulseOscillator.prototype, "partials", {
			get : function(){
				return [];
			}
		});

		/**
		 *  Clean up method.
		 *  @return {Tone.PulseOscillator} this
		 */
		Tone.PulseOscillator.prototype.dispose = function(){
			Tone.Source.prototype.dispose.call(this);
			this._sawtooth.dispose();
			this._sawtooth = null;
			this._writable(["width", "frequency", "detune"]);
			this.width.dispose();
			this.width = null;
			this._widthGate.disconnect();
			this._widthGate = null;
			this._widthGate = null;
			this._thresh.disconnect();
			this._thresh = null;
			this.frequency = null;
			this.detune = null;
			return this;
		};

		return Tone.PulseOscillator;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(49), __webpack_require__(53), __webpack_require__(52), __webpack_require__(55)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class Tone.PWMOscillator modulates the width of a Tone.PulseOscillator 
		 *         at the modulationFrequency. This has the effect of continuously
		 *         changing the timbre of the oscillator by altering the harmonics 
		 *         generated.
		 *
		 *  @extends {Tone.Oscillator}
		 *  @constructor
		 *  @param {Frequency} frequency The starting frequency of the oscillator. 
		 *  @param {Frequency} modulationFrequency The modulation frequency of the width of the pulse. 
		 *  @example
		 *  var pwm = new Tone.PWMOscillator("Ab3", 0.3).toMaster().start();
		 */
		Tone.PWMOscillator = function(){
			var options = this.optionsObject(arguments, ["frequency", "modulationFrequency"], Tone.PWMOscillator.defaults);
			Tone.Source.call(this, options);

			/**
			 *  the pulse oscillator
			 *  @type {Tone.PulseOscillator}
			 *  @private
			 */
			this._pulse = new Tone.PulseOscillator(options.modulationFrequency);
			//change the pulse oscillator type
			this._pulse._sawtooth.type = "sine";

			/**
			 *  the modulator
			 *  @type {Tone.Oscillator}
			 *  @private
			 */
			this._modulator = new Tone.Oscillator({
				"frequency" : options.frequency,
				"detune" : options.detune,
				"phase" : options.phase
			});

			/**
			 *  Scale the oscillator so it doesn't go silent 
			 *  at the extreme values.
			 *  @type {Tone.Multiply}
			 *  @private
			 */
			this._scale = new Tone.Multiply(1.01);

			/**
			 *  The frequency control.
			 *  @type {Frequency}
			 *  @signal
			 */
			this.frequency = this._modulator.frequency;

			/**
			 *  The detune of the oscillator.
			 *  @type {Cents}
			 *  @signal
			 */
			this.detune = this._modulator.detune;

			/**
			 *  The modulation rate of the oscillator. 
			 *  @type {Frequency}
			 *  @signal
			 */
			this.modulationFrequency = this._pulse.frequency;	

			//connections
			this._modulator.chain(this._scale, this._pulse.width);
			this._pulse.connect(this.output);
			this._readOnly(["modulationFrequency", "frequency", "detune"]);
		};

		Tone.extend(Tone.PWMOscillator, Tone.Oscillator);

		/**
		 *  default values
		 *  @static
		 *  @type {Object}
		 *  @const
		 */
		Tone.PWMOscillator.defaults = {
			"frequency" : 440,
			"detune" : 0,
			"phase" : 0,
			"modulationFrequency" : 0.4,
		};

		/**
		 *  start the oscillator
		 *  @param  {Time} [time=now]
		 *  @private
		 */
		Tone.PWMOscillator.prototype._start = function(time){
			time = this.toSeconds(time);
			this._modulator.start(time);
			this._pulse.start(time);
		};

		/**
		 *  stop the oscillator
		 *  @param  {Time} time (optional) timing parameter
		 *  @private
		 */
		Tone.PWMOscillator.prototype._stop = function(time){
			time = this.toSeconds(time);
			this._modulator.stop(time);
			this._pulse.stop(time);
		};

		/**
		 * The type of the oscillator. Always returns "pwm".
		 * @readOnly
		 * @memberOf Tone.PWMOscillator#
		 * @type {string}
		 * @name type
		 */
		Object.defineProperty(Tone.PWMOscillator.prototype, "type", {
			get : function(){
				return "pwm";
			}
		});

		/**
		 * The partials of the waveform. Cannot set partials for this waveform type
		 * @memberOf Tone.PWMOscillator#
		 * @type {Array}
		 * @name partials
		 * @private
		 */
		Object.defineProperty(Tone.PWMOscillator.prototype, "partials", {
			get : function(){
				return [];
			}
		});

		/**
		 * The phase of the oscillator in degrees.
		 * @memberOf Tone.PWMOscillator#
		 * @type {number}
		 * @name phase
		 */
		Object.defineProperty(Tone.PWMOscillator.prototype, "phase", {
			get : function(){
				return this._modulator.phase;
			}, 
			set : function(phase){
				this._modulator.phase = phase;
			}
		});

		/**
		 *  Clean up.
		 *  @return {Tone.PWMOscillator} this
		 */
		Tone.PWMOscillator.prototype.dispose = function(){
			Tone.Source.prototype.dispose.call(this);
			this._pulse.dispose();
			this._pulse = null;
			this._scale.dispose();
			this._scale = null;
			this._modulator.dispose();
			this._modulator = null;
			this._writable(["modulationFrequency", "frequency", "detune"]);
			this.frequency = null;
			this.detune = null;
			this.modulationFrequency = null;
			return this;
		};

		return Tone.PWMOscillator;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(28)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class  Multiply two incoming signals. Or, if a number is given in the constructor, 
		 *          multiplies the incoming signal by that value. 
		 *
		 *  @constructor
		 *  @extends {Tone.Signal}
		 *  @param {number=} value Constant value to multiple. If no value is provided,
		 *                         it will return the product of the first and second inputs
		 *  @example
		 * var mult = new Tone.Multiply();
		 * var sigA = new Tone.Signal(3);
		 * var sigB = new Tone.Signal(4);
		 * sigA.connect(mult, 0, 0);
		 * sigB.connect(mult, 0, 1);
		 * //output of mult is 12.
		 *  @example
		 * var mult = new Tone.Multiply(10);
		 * var sig = new Tone.Signal(2).connect(mult);
		 * //the output of mult is 20. 
		 */
		Tone.Multiply = function(value){

			Tone.call(this, 2, 0);

			/**
			 *  the input node is the same as the output node
			 *  it is also the GainNode which handles the scaling of incoming signal
			 *  
			 *  @type {GainNode}
			 *  @private
			 */
			this._mult = this.input[0] = this.output = this.context.createGain();

			/**
			 *  the scaling parameter
			 *  @type {AudioParam}
			 *  @private
			 */
			this._param = this.input[1] = this.output.gain;
			
			this._param.value = this.defaultArg(value, 0);
		};

		Tone.extend(Tone.Multiply, Tone.Signal);

		/**
		 *  clean up
		 *  @returns {Tone.Multiply} this
		 */
		Tone.Multiply.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._mult.disconnect();
			this._mult = null;
			this._param = null;
			return this;
		}; 

		return Tone.Multiply;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(49), __webpack_require__(52), __webpack_require__(55), __webpack_require__(33)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class Tone.FMOscillator 
		 *
		 *  @extends {Tone.Oscillator}
		 *  @constructor
		 *  @param {Frequency} frequency The starting frequency of the oscillator. 
		 *  @param {String} type The type of the carrier oscillator.
		 *  @param {String} modulationType The type of the modulator oscillator.
		 *  @example
		 * //a sine oscillator frequency-modulated by a square wave
		 * var fmOsc = new Tone.FMOscillator("Ab3", "sine", "square").toMaster().start();
		 */
		Tone.FMOscillator = function(){

			var options = this.optionsObject(arguments, ["frequency", "type", "modulationType"], Tone.FMOscillator.defaults);
			Tone.Source.call(this, options);

			/**
			 *  The carrier oscillator
			 *  @type {Tone.Oscillator}
			 *  @private
			 */
			this._carrier = new Tone.Oscillator(options.frequency, options.type);

			/**
			 *  The oscillator's frequency
			 *  @type {Frequency}
			 *  @signal
			 */
			this.frequency = new Tone.Signal(options.frequency, Tone.Type.Frequency);

			/**
			 *  The detune control signal.
			 *  @type {Cents}
			 *  @signal
			 */
			this.detune = this._carrier.detune;
			this.detune.value = options.detune;

			/**
			 *  The modulation index which is in essence the depth or amount of the modulation. In other terms it is the 
			 *  ratio of the frequency of the modulating signal (mf) to the amplitude of the 
			 *  modulating signal (ma) -- as in ma/mf. 
			 *	@type {Positive}
			 *	@signal
			 */
			this.modulationIndex = new Tone.Multiply(options.modulationIndex);
			this.modulationIndex.units = Tone.Type.Positive;

			/**
			 *  The modulating oscillator
			 *  @type  {Tone.Oscillator}
			 *  @private
			 */
			this._modulator = new Tone.Oscillator(options.frequency, options.modulationType);

			/**
			 *  Harmonicity is the frequency ratio between the carrier and the modulator oscillators. 
			 *  A harmonicity of 1 gives both oscillators the same frequency. 
			 *  Harmonicity = 2 means a change of an octave. 
			 *  @type {Positive}
			 *  @signal
			 *  @example
			 * //pitch the modulator an octave below carrier
			 * synth.harmonicity.value = 0.5;
			 */
			this.harmonicity = new Tone.Multiply(options.harmonicity);
			this.harmonicity.units = Tone.Type.Positive;

			/**
			 *  the node where the modulation happens
			 *  @type {Tone.Gain}
			 *  @private
			 */
			this._modulationNode = new Tone.Gain(0);

			//connections
			this.frequency.connect(this._carrier.frequency);
			this.frequency.chain(this.harmonicity, this._modulator.frequency);
			this.frequency.chain(this.modulationIndex, this._modulationNode);
			this._modulator.connect(this._modulationNode.gain);
			this._modulationNode.connect(this._carrier.frequency);
			this._carrier.connect(this.output);
			this.detune.connect(this._modulator.detune);

			this.phase = options.phase;

			this._readOnly(["modulationIndex", "frequency", "detune", "harmonicity"]);
		};

		Tone.extend(Tone.FMOscillator, Tone.Oscillator);

		/**
		 *  default values
		 *  @static
		 *  @type {Object}
		 *  @const
		 */
		Tone.FMOscillator.defaults = {
			"frequency" : 440,
			"detune" : 0,
			"phase" : 0,
			"modulationIndex" : 2,
			"modulationType" : "square",
			"harmonicity" : 1
		};

		/**
		 *  start the oscillator
		 *  @param  {Time} [time=now]
		 *  @private
		 */
		Tone.FMOscillator.prototype._start = function(time){
			time = this.toSeconds(time);
			this._modulator.start(time);
			this._carrier.start(time);
		};

		/**
		 *  stop the oscillator
		 *  @param  {Time} time (optional) timing parameter
		 *  @private
		 */
		Tone.FMOscillator.prototype._stop = function(time){
			time = this.toSeconds(time);
			this._modulator.stop(time);
			this._carrier.stop(time);
		};

		/**
		 * The type of the carrier oscillator
		 * @memberOf Tone.FMOscillator#
		 * @type {string}
		 * @name type
		 */
		Object.defineProperty(Tone.FMOscillator.prototype, "type", {
			get : function(){
				return this._carrier.type;
			},
			set : function(type){
				this._carrier.type = type;	
			}
		});

		/**
		 * The type of the modulator oscillator
		 * @memberOf Tone.FMOscillator#
		 * @type {String}
		 * @name modulationType
		 */
		Object.defineProperty(Tone.FMOscillator.prototype, "modulationType", {
			get : function(){
				return this._modulator.type;
			},
			set : function(type){
				this._modulator.type = type;	
			}
		});

		/**
		 * The phase of the oscillator in degrees.
		 * @memberOf Tone.FMOscillator#
		 * @type {number}
		 * @name phase
		 */
		Object.defineProperty(Tone.FMOscillator.prototype, "phase", {
			get : function(){
				return this._carrier.phase;
			}, 
			set : function(phase){
				this._carrier.phase = phase;
				this._modulator.phase = phase;
			}
		});

		/**
		 * The partials of the carrier waveform. A partial represents 
		 * the amplitude at a harmonic. The first harmonic is the 
		 * fundamental frequency, the second is the octave and so on
		 * following the harmonic series. 
		 * Setting this value will automatically set the type to "custom". 
		 * The value is an empty array when the type is not "custom". 
		 * @memberOf Tone.FMOscillator#
		 * @type {Array}
		 * @name partials
		 * @example
		 * osc.partials = [1, 0.2, 0.01];
		 */
		Object.defineProperty(Tone.FMOscillator.prototype, "partials", {
			get : function(){
				return this._carrier.partials;
			}, 
			set : function(partials){
				this._carrier.partials = partials;
			}
		});

		/**
		 *  Clean up.
		 *  @return {Tone.FMOscillator} this
		 */
		Tone.FMOscillator.prototype.dispose = function(){
			Tone.Source.prototype.dispose.call(this);
			this._writable(["modulationIndex", "frequency", "detune", "harmonicity"]);
			this.frequency.dispose();
			this.frequency = null;
			this.detune = null;
			this.harmonicity.dispose();
			this.harmonicity = null;
			this._carrier.dispose();
			this._carrier = null;
			this._modulator.dispose();
			this._modulator = null;
			this._modulationNode.dispose();
			this._modulationNode = null;
			this.modulationIndex.dispose();
			this.modulationIndex = null;
			return this;
		};

		return Tone.FMOscillator;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(49), __webpack_require__(52), __webpack_require__(55), 
		__webpack_require__(33), __webpack_require__(58)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class Tone.AMOscillator 
		 *
		 *  @extends {Tone.Oscillator}
		 *  @constructor
		 *  @param {Frequency} frequency The starting frequency of the oscillator. 
		 *  @param {String} type The type of the carrier oscillator.
		 *  @param {String} modulationType The type of the modulator oscillator.
		 *  @example
		 * //a sine oscillator frequency-modulated by a square wave
		 * var fmOsc = new Tone.AMOscillator("Ab3", "sine", "square").toMaster().start();
		 */
		Tone.AMOscillator = function(){

			var options = this.optionsObject(arguments, ["frequency", "type", "modulationType"], Tone.AMOscillator.defaults);
			Tone.Source.call(this, options);

			/**
			 *  The carrier oscillator
			 *  @type {Tone.Oscillator}
			 *  @private
			 */
			this._carrier = new Tone.Oscillator(options.frequency, options.type);

			/**
			 *  The oscillator's frequency
			 *  @type {Frequency}
			 *  @signal
			 */
			this.frequency = this._carrier.frequency;

			/**
			 *  The detune control signal.
			 *  @type {Cents}
			 *  @signal
			 */
			this.detune = this._carrier.detune;
			this.detune.value = options.detune;

			/**
			 *  The modulating oscillator
			 *  @type  {Tone.Oscillator}
			 *  @private
			 */
			this._modulator = new Tone.Oscillator(options.frequency, options.modulationType);

			/**
			 *  convert the -1,1 output to 0,1
			 *  @type {Tone.AudioToGain}
			 *  @private
			 */
			this._modulationScale = new Tone.AudioToGain();

			/**
			 *  Harmonicity is the frequency ratio between the carrier and the modulator oscillators. 
			 *  A harmonicity of 1 gives both oscillators the same frequency. 
			 *  Harmonicity = 2 means a change of an octave. 
			 *  @type {Positive}
			 *  @signal
			 *  @example
			 * //pitch the modulator an octave below carrier
			 * synth.harmonicity.value = 0.5;
			 */
			this.harmonicity = new Tone.Multiply(options.harmonicity);
			this.harmonicity.units = Tone.Type.Positive;

			/**
			 *  the node where the modulation happens
			 *  @type {Tone.Gain}
			 *  @private
			 */
			this._modulationNode = new Tone.Gain(0);

			//connections
			this.frequency.chain(this.harmonicity, this._modulator.frequency);
			this.detune.connect(this._modulator.detune);
			this._modulator.chain(this._modulationScale, this._modulationNode.gain);
			this._carrier.chain(this._modulationNode, this.output);

			this.phase = options.phase;

			this._readOnly(["frequency", "detune", "harmonicity"]);
		};

		Tone.extend(Tone.AMOscillator, Tone.Oscillator);

		/**
		 *  default values
		 *  @static
		 *  @type {Object}
		 *  @const
		 */
		Tone.AMOscillator.defaults = {
			"frequency" : 440,
			"detune" : 0,
			"phase" : 0,
			"modulationType" : "square",
			"harmonicity" : 1
		};

		/**
		 *  start the oscillator
		 *  @param  {Time} [time=now]
		 *  @private
		 */
		Tone.AMOscillator.prototype._start = function(time){
			time = this.toSeconds(time);
			this._modulator.start(time);
			this._carrier.start(time);
		};

		/**
		 *  stop the oscillator
		 *  @param  {Time} time (optional) timing parameter
		 *  @private
		 */
		Tone.AMOscillator.prototype._stop = function(time){
			time = this.toSeconds(time);
			this._modulator.stop(time);
			this._carrier.stop(time);
		};

		/**
		 * The type of the carrier oscillator
		 * @memberOf Tone.AMOscillator#
		 * @type {string}
		 * @name type
		 */
		Object.defineProperty(Tone.AMOscillator.prototype, "type", {
			get : function(){
				return this._carrier.type;
			},
			set : function(type){
				this._carrier.type = type;	
			}
		});

		/**
		 * The type of the modulator oscillator
		 * @memberOf Tone.AMOscillator#
		 * @type {string}
		 * @name modulationType
		 */
		Object.defineProperty(Tone.AMOscillator.prototype, "modulationType", {
			get : function(){
				return this._modulator.type;
			},
			set : function(type){
				this._modulator.type = type;	
			}
		});

		/**
		 * The phase of the oscillator in degrees.
		 * @memberOf Tone.AMOscillator#
		 * @type {number}
		 * @name phase
		 */
		Object.defineProperty(Tone.AMOscillator.prototype, "phase", {
			get : function(){
				return this._carrier.phase;
			}, 
			set : function(phase){
				this._carrier.phase = phase;
				this._modulator.phase = phase;
			}
		});

		/**
		 * The partials of the carrier waveform. A partial represents 
		 * the amplitude at a harmonic. The first harmonic is the 
		 * fundamental frequency, the second is the octave and so on
		 * following the harmonic series. 
		 * Setting this value will automatically set the type to "custom". 
		 * The value is an empty array when the type is not "custom". 
		 * @memberOf Tone.AMOscillator#
		 * @type {Array}
		 * @name partials
		 * @example
		 * osc.partials = [1, 0.2, 0.01];
		 */
		Object.defineProperty(Tone.AMOscillator.prototype, "partials", {
			get : function(){
				return this._carrier.partials;
			}, 
			set : function(partials){
				this._carrier.partials = partials;
			}
		});

		/**
		 *  Clean up.
		 *  @return {Tone.AMOscillator} this
		 */
		Tone.AMOscillator.prototype.dispose = function(){
			Tone.Source.prototype.dispose.call(this);
			this._writable(["frequency", "detune", "harmonicity"]);
			this.frequency = null;
			this.detune = null;
			this.harmonicity.dispose();
			this.harmonicity = null;
			this._carrier.dispose();
			this._carrier = null;
			this._modulator.dispose();
			this._modulator = null;
			this._modulationNode.dispose();
			this._modulationNode = null;
			this._modulationScale.dispose();
			this._modulationScale = null;
			return this;
		};

		return Tone.AMOscillator;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(29), __webpack_require__(28)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class AudioToGain converts an input in AudioRange [-1,1] to NormalRange [0,1]. 
		 *         See Tone.GainToAudio.
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @example
		 *  var a2g = new Tone.AudioToGain();
		 */
		Tone.AudioToGain = function(){

			/**
			 *  @type {WaveShaperNode}
			 *  @private
			 */
			this._norm = this.input = this.output = new Tone.WaveShaper(function(x){
				return (x + 1) / 2;
			});
		};

		Tone.extend(Tone.AudioToGain, Tone.SignalBase);

		/**
		 *  clean up
		 *  @returns {Tone.AudioToGain} this
		 */
		Tone.AudioToGain.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._norm.dispose();
			this._norm = null;
			return this;
		};

		return Tone.AudioToGain;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(49), __webpack_require__(52), __webpack_require__(55), __webpack_require__(33)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class Tone.FatOscillator 
		 *
		 *  @extends {Tone.Oscillator}
		 *  @constructor
		 *  @param {Frequency} frequency The starting frequency of the oscillator. 
		 *  @param {String} type The type of the carrier oscillator.
		 *  @param {String} modulationType The type of the modulator oscillator.
		 *  @example
		 * //a sine oscillator frequency-modulated by a square wave
		 * var fmOsc = new Tone.FatOscillator("Ab3", "sine", "square").toMaster().start();
		 */
		Tone.FatOscillator = function(){

			var options = this.optionsObject(arguments, ["frequency", "type", "spread"], Tone.FatOscillator.defaults);
			Tone.Source.call(this, options);

			/**
			 *  The oscillator's frequency
			 *  @type {Frequency}
			 *  @signal
			 */
			this.frequency = new Tone.Signal(options.frequency, Tone.Type.Frequency);

			/**
			 *  The detune control signal.
			 *  @type {Cents}
			 *  @signal
			 */
			this.detune = new Tone.Signal(options.detune, Tone.Type.Cents);

			/**
			 *  The array of oscillators
			 *  @type {Array}
			 *  @private
			 */
			this._oscillators = [];

			/**
			 *  The total spread of the oscillators
			 *  @type  {Cents}
			 *  @private
			 */
			this._spread = options.spread;

			/**
			 *  The type of the oscillator
			 *  @type {String}
			 *  @private
			 */
			this._type = options.type;

			/**
			 *  The phase of the oscillators
			 *  @type {Degrees}
			 *  @private
			 */
			this._phase = options.phase;

			/**
			 *  The partials array
			 *  @type {Array}
			 *  @private
			 */
			this._partials = this.defaultArg(options.partials, []);

			//set the count initially
			this.count = options.count;

			this._readOnly(["frequency", "detune"]);
		};

		Tone.extend(Tone.FatOscillator, Tone.Oscillator);

		/**
		 *  default values
		 *  @static
		 *  @type {Object}
		 *  @const
		 */
		Tone.FatOscillator.defaults = {
			"frequency" : 440,
			"detune" : 0,
			"phase" : 0,
			"spread" : 20,
			"count" : 3,
			"type" : "sawtooth"
		};

		/**
		 *  start the oscillator
		 *  @param  {Time} [time=now]
		 *  @private
		 */
		Tone.FatOscillator.prototype._start = function(time){
			time = this.toSeconds(time);
			this._forEach(function(osc){
				osc.start(time);
			});
		};

		/**
		 *  stop the oscillator
		 *  @param  {Time} time (optional) timing parameter
		 *  @private
		 */
		Tone.FatOscillator.prototype._stop = function(time){
			time = this.toSeconds(time);
			this._forEach(function(osc){
				osc.stop(time);
			});
		};

		/**
		 *  Iterate over all of the oscillators
		 *  @param  {Function}  iterator  The iterator function
		 *  @private
		 */
		Tone.FatOscillator.prototype._forEach = function(iterator){
			for (var i = 0; i < this._oscillators.length; i++){
				iterator.call(this, this._oscillators[i], i);
			}
		};

		/**
		 * The type of the carrier oscillator
		 * @memberOf Tone.FatOscillator#
		 * @type {string}
		 * @name type
		 */
		Object.defineProperty(Tone.FatOscillator.prototype, "type", {
			get : function(){
				return this._type;
			},
			set : function(type){
				this._type = type;
				this._forEach(function(osc){
					osc.type = type;
				});
			}
		});

		/**
		 * The detune spread between the oscillators. If "count" is
		 * set to 3 oscillators and the "spread" is set to 40,
		 * the three oscillators would be detuned like this: [-20, 0, 20]
		 * for a total detune spread of 40 cents.
		 * @memberOf Tone.FatOscillator#
		 * @type {Cents}
		 * @name spread
		 */
		Object.defineProperty(Tone.FatOscillator.prototype, "spread", {
			get : function(){
				return this._spread;
			},
			set : function(spread){
				this._spread = spread;
				if (this._oscillators.length > 1){
					var start = -spread/2;
					var step = spread / (this._oscillators.length - 1);
					this._forEach(function(osc, i){
						osc.detune.value = start + step * i;
					});
				}
			}
		});

		/**
		 * The number of detuned oscillators
		 * @memberOf Tone.FatOscillator#
		 * @type {Number}
		 * @name count
		 */
		Object.defineProperty(Tone.FatOscillator.prototype, "count", {
			get : function(){
				return this._oscillators.length;
			},
			set : function(count){
				count = Math.max(count, 1);
				if (this._oscillators.length !== count){
					// var partials = this.partials;
					// var type = this.type;
					//dispose the previous oscillators
					this._forEach(function(osc){
						osc.dispose();
					});
					this._oscillators = [];
					for (var i = 0; i < count; i++){
						var osc = new Tone.Oscillator();
						if (this.type === Tone.Oscillator.Type.Custom){
							osc.partials = this._partials;
						} else {
							osc.type = this._type;
						}
						osc.phase = this._phase;
						osc.volume.value = -6 - count;
						this.frequency.connect(osc.frequency);
						this.detune.connect(osc.detune);
						osc.connect(this.output);
						this._oscillators[i] = osc;
					}
					//set the spread
					this.spread = this._spread;
					if (this.state === Tone.State.Started){
						this._forEach(function(osc){
							osc.start();
						});						
					}
				}
			}
		});

		/**
		 * The phase of the oscillator in degrees.
		 * @memberOf Tone.FatOscillator#
		 * @type {Number}
		 * @name phase
		 */
		Object.defineProperty(Tone.FatOscillator.prototype, "phase", {
			get : function(){
				return this._phase;
			}, 
			set : function(phase){
				this._phase = phase;
				this._forEach(function(osc){
					osc.phase = phase;
				});
			}
		});

		/**
		 * The partials of the carrier waveform. A partial represents 
		 * the amplitude at a harmonic. The first harmonic is the 
		 * fundamental frequency, the second is the octave and so on
		 * following the harmonic series. 
		 * Setting this value will automatically set the type to "custom". 
		 * The value is an empty array when the type is not "custom". 
		 * @memberOf Tone.FatOscillator#
		 * @type {Array}
		 * @name partials
		 * @example
		 * osc.partials = [1, 0.2, 0.01];
		 */
		Object.defineProperty(Tone.FatOscillator.prototype, "partials", {
			get : function(){
				return this._partials;
			}, 
			set : function(partials){
				this._partials = partials;
				this._type = Tone.Oscillator.Type.Custom;
				this._forEach(function(osc){
					osc.partials = partials;
				});
			}
		});

		/**
		 *  Clean up.
		 *  @return {Tone.FatOscillator} this
		 */
		Tone.FatOscillator.prototype.dispose = function(){
			Tone.Source.prototype.dispose.call(this);
			this._writable(["frequency", "detune"]);
			this.frequency.dispose();
			this.frequency = null;
			this.detune.dispose();
			this.detune = null;
			this._forEach(function(osc){
				osc.dispose();
			});
			this._oscillators = null;
			this._partials = null;
			return this;
		};

		return Tone.FatOscillator;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(61), __webpack_require__(28)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class  This is an abstract base class for other monophonic instruments to 
		 *          extend. IMPORTANT: It does not make any sound on its own and
		 *          shouldn't be directly instantiated.
		 *
		 *  @constructor
		 *  @abstract
		 *  @extends {Tone.Instrument}
		 */
		Tone.Monophonic = function(options){

			//get the defaults
			options = this.defaultArg(options, Tone.Monophonic.defaults);

			Tone.Instrument.call(this, options);

			/**
			 *  The glide time between notes. 
			 *  @type {Time}
			 */
			this.portamento = options.portamento;
		};

		Tone.extend(Tone.Monophonic, Tone.Instrument);

		/**
		 *  @static
		 *  @const
		 *  @type {Object}
		 */
		Tone.Monophonic.defaults = {
			"portamento" : 0
		};

		/**
		 *  Trigger the attack of the note optionally with a given velocity. 
		 *  
		 *  
		 *  @param  {Frequency} note     The note to trigger.
		 *  @param  {Time} [time=now]     When the note should start.
		 *  @param  {number} [velocity=1] velocity The velocity scaler 
		 *                                determines how "loud" the note 
		 *                                will be triggered.
		 *  @returns {Tone.Monophonic} this
		 *  @example
		 * synth.triggerAttack("C4");
		 *  @example
		 * //trigger the note a half second from now at half velocity
		 * synth.triggerAttack("C4", "+0.5", 0.5);
		 */
		Tone.Monophonic.prototype.triggerAttack = function(note, time, velocity) {
			time = this.toSeconds(time);
			this._triggerEnvelopeAttack(time, velocity);
			this.setNote(note, time);
			return this;
		};

		/**
		 *  Trigger the release portion of the envelope
		 *  @param  {Time} [time=now] If no time is given, the release happens immediatly
		 *  @returns {Tone.Monophonic} this
		 *  @example
		 * synth.triggerRelease();
		 */
		Tone.Monophonic.prototype.triggerRelease = function(time){
			this._triggerEnvelopeRelease(time);
			return this;
		};

		/**
		 *  override this method with the actual method
		 *  @abstract
		 *  @private
		 */	
		Tone.Monophonic.prototype._triggerEnvelopeAttack = function() {};

		/**
		 *  override this method with the actual method
		 *  @abstract
		 *  @private
		 */	
		Tone.Monophonic.prototype._triggerEnvelopeRelease = function() {};

		/**
		 *  Set the note at the given time. If no time is given, the note
		 *  will set immediately. 
		 *  @param {Frequency} note The note to change to.
		 *  @param  {Time} [time=now] The time when the note should be set. 
		 *  @returns {Tone.Monophonic} this
		 * @example
		 * //change to F#6 in one quarter note from now.
		 * synth.setNote("F#6", "+4n");
		 * @example
		 * //change to Bb4 right now
		 * synth.setNote("Bb4");
		 */
		Tone.Monophonic.prototype.setNote = function(note, time){
			time = this.toSeconds(time);
			if (this.portamento > 0){
				var currentNote = this.frequency.value;
				this.frequency.setValueAtTime(currentNote, time);
				var portTime = this.toSeconds(this.portamento);
				this.frequency.exponentialRampToValueAtTime(note, time + portTime);
			} else {
				this.frequency.setValueAtTime(note, time);
			}
			return this;
		};

		return Tone.Monophonic;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(31)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class  Base-class for all instruments
		 *  
		 *  @constructor
		 *  @extends {Tone}
		 */
		Tone.Instrument = function(options){

			//get the defaults
			options = this.defaultArg(options, Tone.Instrument.defaults);

			/**
			 *  The output and volume triming node
			 *  @type  {Tone.Volume}
			 *  @private
			 */
			this._volume = this.output = new Tone.Volume(options.volume);

			/**
			 * The volume of the output in decibels.
			 * @type {Decibels}
			 * @signal
			 * @example
			 * source.volume.value = -6;
			 */
			this.volume = this._volume.volume;
			this._readOnly("volume");
		};

		Tone.extend(Tone.Instrument);

		/**
		 *  the default attributes
		 *  @type {object}
		 */
		Tone.Instrument.defaults = {
			/** the volume of the output in decibels */
			"volume" : 0
		};

		/**
		 *  @abstract
		 *  @param {string|number} note the note to trigger
		 *  @param {Time} [time=now] the time to trigger the ntoe
		 *  @param {number} [velocity=1] the velocity to trigger the note
		 */
		Tone.Instrument.prototype.triggerAttack = Tone.noOp;

		/**
		 *  @abstract
		 *  @param {Time} [time=now] when to trigger the release
		 */
		Tone.Instrument.prototype.triggerRelease = Tone.noOp;

		/**
		 *  Trigger the attack and then the release after the duration. 
		 *  @param  {Frequency} note     The note to trigger.
		 *  @param  {Time} duration How long the note should be held for before
		 *                          triggering the release.
		 *  @param {Time} [time=now]  When the note should be triggered.
		 *  @param  {NormalRange} [velocity=1] The velocity the note should be triggered at.
		 *  @returns {Tone.Instrument} this
		 *  @example
		 * //trigger "C4" for the duration of an 8th note
		 * synth.triggerAttackRelease("C4", "8n");
		 */
		Tone.Instrument.prototype.triggerAttackRelease = function(note, duration, time, velocity){
			time = this.toSeconds(time);
			duration = this.toSeconds(duration);
			this.triggerAttack(note, time, velocity);
			this.triggerRelease(time + duration);
			return this;
		};

		/**
		 *  clean up
		 *  @returns {Tone.Instrument} this
		 */
		Tone.Instrument.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._volume.dispose();
			this._volume = null;
			this._writable(["volume"]);
			this.volume = null;
			return this;
		};

		return Tone.Instrument;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(63), __webpack_require__(49)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class  Tone.PolySynth handles voice creation and allocation for any
		 *          instruments passed in as the second paramter. PolySynth is 
		 *          not a synthesizer by itself, it merely manages voices of 
		 *          one of the other types of synths, allowing any of the 
		 *          monophonic synthesizers to be polyphonic. 
		 *
		 *  @constructor
		 *  @extends {Tone.Instrument}
		 *  @param {number|Object} [polyphony=4] The number of voices to create
		 *  @param {function} [voice=Tone.MonoSynth] The constructor of the voices
		 *                                            uses Tone.MonoSynth by default. 
		 *  @example
		 * //a polysynth composed of 6 Voices of MonoSynth
		 * var synth = new Tone.PolySynth(6, Tone.MonoSynth).toMaster();
		 * //set the attributes using the set interface
		 * synth.set("detune", -1200);
		 * //play a chord
		 * synth.triggerAttackRelease(["C4", "E4", "A4"], "4n");
		 */
		Tone.PolySynth = function(){

			Tone.Instrument.call(this);

			var options = this.optionsObject(arguments, ["polyphony", "voice"], Tone.PolySynth.defaults);
			options = this.defaultArg(options, Tone.Instrument.defaults);

			/**
			 *  the array of voices
			 *  @type {Array}
			 */
			this.voices = new Array(options.polyphony);

			/**
			 *  The queue of voices with data about last trigger
			 *  and the triggered note
			 *  @private
			 *  @type {Array}
			 */
			this._triggers = new Array(options.polyphony);

			//create the voices
			for (var i = 0; i < options.polyphony; i++){
				var v = new options.voice(arguments[2], arguments[3]);
				this.voices[i] = v;
				v.connect(this.output);
				this._triggers[i] = {
					release : -1,
					note : null,
					voice : v
				};
			}

			//set the volume initially
			this.volume.value = options.volume;
		};

		Tone.extend(Tone.PolySynth, Tone.Instrument);

		/**
		 *  the defaults
		 *  @const
		 *  @static
		 *  @type {Object}
		 */
		Tone.PolySynth.defaults = {
			"polyphony" : 4,
			"volume" : 0,
			"voice" : Tone.MonoSynth
		};

		/**
		 *  Trigger the attack portion of the note
		 *  @param  {Frequency|Array} notes The notes to play. Accepts a single
		 *                                  Frequency or an array of frequencies.
		 *  @param  {Time} [time=now]  The start time of the note.
		 *  @param {number} [velocity=1] The velocity of the note.
		 *  @returns {Tone.PolySynth} this
		 *  @example
		 * //trigger a chord immediately with a velocity of 0.2
		 * poly.triggerAttack(["Ab3", "C4", "F5"], undefined, 0.2);
		 */
		Tone.PolySynth.prototype.triggerAttack = function(notes, time, velocity){
			if (!Array.isArray(notes)){
				notes = [notes];
			}
			time = this.toSeconds(time);
			for (var i = 0; i < notes.length; i++){
				var val = notes[i];
				//trigger the oldest voice
				var oldest = this._triggers[0];
				var oldestIndex = 0;
				for (var j = 1; j < this._triggers.length; j++){
					if (this._triggers[j].release < oldest.release){
						oldest = this._triggers[j];
						oldestIndex = j;
					}
				}
				oldest.release = Infinity;
				oldest.note = JSON.stringify(val);
				oldest.voice.triggerAttack(val, time, velocity);
			}
			return this;
		};

		/**
		 *  Trigger the attack and release after the specified duration
		 *  
		 *  @param  {Frequency|Array} notes The notes to play. Accepts a single
		 *                                  Frequency or an array of frequencies.
		 *  @param  {Time} duration the duration of the note
		 *  @param  {Time} [time=now]     if no time is given, defaults to now
		 *  @param  {number} [velocity=1] the velocity of the attack (0-1)
		 *  @returns {Tone.PolySynth} this
		 *  @example
		 * //trigger a chord for a duration of a half note 
		 * poly.triggerAttackRelease(["Eb3", "G4", "C5"], "2n");
		 */
		Tone.PolySynth.prototype.triggerAttackRelease = function(notes, duration, time, velocity){
			time = this.toSeconds(time);
			this.triggerAttack(notes, time, velocity);
			this.triggerRelease(notes, time + this.toSeconds(duration));
			return this;
		};

		/**
		 *  Trigger the release of the note. Unlike monophonic instruments, 
		 *  a note (or array of notes) needs to be passed in as the first argument.
		 *  @param  {Frequency|Array} notes The notes to play. Accepts a single
		 *                                  Frequency or an array of frequencies.
		 *  @param  {Time} [time=now]  When the release will be triggered. 
		 *  @returns {Tone.PolySynth} this
		 *  @example
		 * poly.triggerRelease(["Ab3", "C4", "F5"], "+2n");
		 */
		Tone.PolySynth.prototype.triggerRelease = function(notes, time){
			if (!Array.isArray(notes)){
				notes = [notes];
			}
			time = this.toSeconds(time);
			for (var i = 0; i < notes.length; i++){
				//get the voice
				var stringified = JSON.stringify(notes[i]);
				for (var v = 0; v < this._triggers.length; v++){
					var desc = this._triggers[v];
					if (desc.note === stringified && desc.release > time){
						desc.voice.triggerRelease(time);
						desc.release = time;
					}
				}
			}
			return this;
		};

		/**
		 *  Set a member/attribute of the voices. 
		 *  @param {Object|string} params
		 *  @param {number=} value
		 *  @param {Time=} rampTime
		 *  @returns {Tone.PolySynth} this
		 *  @example
		 * poly.set({
		 * 	"filter" : {
		 * 		"type" : "highpass"
		 * 	},
		 * 	"envelope" : {
		 * 		"attack" : 0.25
		 * 	}
		 * });
		 */
		Tone.PolySynth.prototype.set = function(params, value, rampTime){
			for (var i = 0; i < this.voices.length; i++){
				this.voices[i].set(params, value, rampTime);
			}
			return this;
		};

		/**
		 *  Get the synth's attributes. Given no arguments get
		 *  will return all available object properties and their corresponding
		 *  values. Pass in a single attribute to retrieve or an array
		 *  of attributes. The attribute strings can also include a "."
		 *  to access deeper properties.
		 *  @param {Array=} params the parameters to get, otherwise will return 
		 *  					   all available.
		 */
		Tone.PolySynth.prototype.get = function(params){
			return this.voices[0].get(params);
		};

		/**
		 *  Trigger the release portion of all the currently active voices.
		 *  @param {Time} [time=now] When the notes should be released.
		 *  @return {Tone.PolySynth} this
		 */
		Tone.PolySynth.prototype.releaseAll = function(time){
			time = this.toSeconds(time);
			for (var i = 0; i < this._triggers.length; i++){
				var desc = this._triggers[i];
				if (desc.release > time){
					desc.release = time;
					desc.voice.triggerRelease(time);
				}
			}
			return this;
		};

		/**
		 *  Clean up.
		 *  @returns {Tone.PolySynth} this
		 */
		Tone.PolySynth.prototype.dispose = function(){
			Tone.Instrument.prototype.dispose.call(this);
			for (var i = 0; i < this.voices.length; i++){
				this.voices[i].dispose();
				this.voices[i] = null;
			}
			this.voices = null;
			this._triggers = null;
			return this;
		};

		return Tone.PolySynth;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(45), __webpack_require__(64), 
		__webpack_require__(48), __webpack_require__(28), __webpack_require__(68), __webpack_require__(60)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class  Tone.MonoSynth is composed of one oscillator, one filter, and two envelopes.
		 *          The amplitude of the Tone.Oscillator and the cutoff frequency of the 
		 *          Tone.Filter are controlled by Tone.Envelopes. 
		 *          <img src="https://docs.google.com/drawings/d/1gaY1DF9_Hzkodqf8JI1Cg2VZfwSElpFQfI94IQwad38/pub?w=924&h=240">
		 *          
		 *  @constructor
		 *  @extends {Tone.Monophonic}
		 *  @param {Object} [options] the options available for the synth 
		 *                          see defaults below
		 *  @example
		 * var synth = new Tone.MonoSynth({
		 * 	"oscillator" : {
		 * 		"type" : "square"
		 *  },
		 *  "envelope" : {
		 *  	"attack" : 0.1
		 *  }
		 * }).toMaster();
		 * synth.triggerAttackRelease("C4", "8n");
		 */
		Tone.MonoSynth = function(options){

			//get the defaults
			options = this.defaultArg(options, Tone.MonoSynth.defaults);
			Tone.Monophonic.call(this, options);

			/**
			 *  The oscillator.
			 *  @type {Tone.OmniOscillator}
			 */
			this.oscillator = new Tone.OmniOscillator(options.oscillator);

			/**
			 *  The frequency control.
			 *  @type {Frequency}
			 *  @signal
			 */
			this.frequency = this.oscillator.frequency;

			/**
			 *  The detune control.
			 *  @type {Cents}
			 *  @signal
			 */
			this.detune = this.oscillator.detune;

			/**
			 *  The filter.
			 *  @type {Tone.Filter}
			 */
			this.filter = new Tone.Filter(options.filter);

			/**
			 *  The filter envelope.
			 *  @type {Tone.FrequencyEnvelope}
			 */
			this.filterEnvelope = new Tone.FrequencyEnvelope(options.filterEnvelope);

			/**
			 *  The amplitude envelope.
			 *  @type {Tone.AmplitudeEnvelope}
			 */
			this.envelope = new Tone.AmplitudeEnvelope(options.envelope);

			//connect the oscillators to the output
			this.oscillator.chain(this.filter, this.envelope, this.output);
			//start the oscillators
			this.oscillator.start();
			//connect the filter envelope
			this.filterEnvelope.connect(this.filter.frequency);
			this._readOnly(["oscillator", "frequency", "detune", "filter", "filterEnvelope", "envelope"]);
		};

		Tone.extend(Tone.MonoSynth, Tone.Monophonic);

		/**
		 *  @const
		 *  @static
		 *  @type {Object}
		 */
		Tone.MonoSynth.defaults = {
			"frequency" : "C4",
			"detune" : 0,
			"oscillator" : {
				"type" : "square"
			},
			"filter" : {
				"Q" : 6,
				"type" : "lowpass",
				"rolloff" : -24
			},
			"envelope" : {
				"attack" : 0.005,
				"decay" : 0.1,
				"sustain" : 0.9,
				"release" : 1
			},
			"filterEnvelope" : {
				"attack" : 0.06,
				"decay" : 0.2,
				"sustain" : 0.5,
				"release" : 2,
				"baseFrequency" : 200,
				"octaves" : 7,
				"exponent" : 2
			}
		};

		/**
		 *  start the attack portion of the envelope
		 *  @param {Time} [time=now] the time the attack should start
		 *  @param {NormalRange} [velocity=1] the velocity of the note (0-1)
		 *  @returns {Tone.MonoSynth} this
		 *  @private
		 */
		Tone.MonoSynth.prototype._triggerEnvelopeAttack = function(time, velocity){
			//the envelopes
			this.envelope.triggerAttack(time, velocity);
			this.filterEnvelope.triggerAttack(time);	
			return this;	
		};

		/**
		 *  start the release portion of the envelope
		 *  @param {Time} [time=now] the time the release should start
		 *  @returns {Tone.MonoSynth} this
		 *  @private
		 */
		Tone.MonoSynth.prototype._triggerEnvelopeRelease = function(time){
			this.envelope.triggerRelease(time);
			this.filterEnvelope.triggerRelease(time);
			return this;
		};


		/**
		 *  clean up
		 *  @returns {Tone.MonoSynth} this
		 */
		Tone.MonoSynth.prototype.dispose = function(){
			Tone.Monophonic.prototype.dispose.call(this);
			this._writable(["oscillator", "frequency", "detune", "filter", "filterEnvelope", "envelope"]);
			this.oscillator.dispose();
			this.oscillator = null;
			this.envelope.dispose();
			this.envelope = null;
			this.filterEnvelope.dispose();
			this.filterEnvelope = null;
			this.filter.dispose();
			this.filter = null;
			this.frequency = null;
			this.detune = null;
			return this;
		};

		return Tone.MonoSynth;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(65), __webpack_require__(46)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class Tone.FrequencyEnvelope is a Tone.ScaledEnvelope, but instead of `min` and `max`
		 *         it's got a `baseFrequency` and `octaves` parameter. 
		 *
		 *  @extends {Tone.Envelope}
		 *  @constructor
		 *  @param {Time|Object} [attack]	the attack time in seconds
		 *  @param {Time} [decay]	the decay time in seconds
		 *  @param {number} [sustain] 	a percentage (0-1) of the full amplitude
		 *  @param {Time} [release]	the release time in seconds
		 *  @example
		 *  var env = new Tone.FrequencyEnvelope({
		 *  	"attack" : 0.2,
		 *  	"baseFrequency" : "C2",
		 *  	"octaves" : 4
		 *  });
		 *  scaledEnv.connect(oscillator.frequency);
		 */
		Tone.FrequencyEnvelope = function(){

			var options = this.optionsObject(arguments, ["attack", "decay", "sustain", "release"], Tone.Envelope.defaults);
			Tone.ScaledEnvelope.call(this, options);
			options = this.defaultArg(options, Tone.FrequencyEnvelope.defaults);

			/**
			 *  Stores the octave value
			 *  @type {Positive}
			 *  @private
			 */
			this._octaves = options.octaves;

			//setup
			this.baseFrequency = options.baseFrequency;
			this.octaves = options.octaves;
		};

		Tone.extend(Tone.FrequencyEnvelope, Tone.Envelope);

		/**
		 *  the default parameters
		 *  @static
		 */
		Tone.FrequencyEnvelope.defaults = {
			"baseFrequency" : 200,
			"octaves" : 4,
			"exponent" : 2
		};

		/**
		 * The envelope's mininum output value. This is the value which it
		 * starts at. 
		 * @memberOf Tone.FrequencyEnvelope#
		 * @type {Frequency}
		 * @name baseFrequency
		 */
		Object.defineProperty(Tone.FrequencyEnvelope.prototype, "baseFrequency", {
			get : function(){
				return this._scale.min;
			},
			set : function(min){
				this._scale.min = this.toFrequency(min);
			}
		});

		/**
		 * The number of octaves above the baseFrequency that the
		 * envelope will scale to.
		 * @memberOf Tone.FrequencyEnvelope#
		 * @type {Positive}
		 * @name octaves
		 */
		Object.defineProperty(Tone.FrequencyEnvelope.prototype, "octaves", {
			get : function(){
				return this._octaves;
			},
			set : function(octaves){
				this._octaves = octaves;
				this._scale.max = this.baseFrequency * Math.pow(2, octaves);
			}
		});

		/**
		 * The envelope's exponent value. 
		 * @memberOf Tone.FrequencyEnvelope#
		 * @type {number}
		 * @name exponent
		 */
		Object.defineProperty(Tone.FrequencyEnvelope.prototype, "exponent", {
			get : function(){
				return this._exp.value;
			},
			set : function(exp){
				this._exp.value = exp;
			}
		});
		
		/**
		 *  clean up
		 *  @returns {Tone.FrequencyEnvelope} this
		 */
		Tone.FrequencyEnvelope.prototype.dispose = function(){
			Tone.ScaledEnvelope.prototype.dispose.call(this);
			return this;
		};

		return Tone.FrequencyEnvelope;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(46), __webpack_require__(66)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class Tone.ScaledEnvelop is an envelope which can be scaled 
		 *         to any range. It's useful for applying an envelope 
		 *         to a frequency or any other non-NormalRange signal 
		 *         parameter. 
		 *
		 *  @extends {Tone.Envelope}
		 *  @constructor
		 *  @param {Time|Object} [attack]	the attack time in seconds
		 *  @param {Time} [decay]	the decay time in seconds
		 *  @param {number} [sustain] 	a percentage (0-1) of the full amplitude
		 *  @param {Time} [release]	the release time in seconds
		 *  @example
		 *  var scaledEnv = new Tone.ScaledEnvelope({
		 *  	"attack" : 0.2,
		 *  	"min" : 200,
		 *  	"max" : 2000
		 *  });
		 *  scaledEnv.connect(oscillator.frequency);
		 */
		Tone.ScaledEnvelope = function(){

			//get all of the defaults
			var options = this.optionsObject(arguments, ["attack", "decay", "sustain", "release"], Tone.Envelope.defaults);
			Tone.Envelope.call(this, options);
			options = this.defaultArg(options, Tone.ScaledEnvelope.defaults);

			/** 
			 *  scale the incoming signal by an exponent
			 *  @type {Tone.Pow}
			 *  @private
			 */
			this._exp = this.output = new Tone.Pow(options.exponent);

			/**
			 *  scale the signal to the desired range
			 *  @type {Tone.Multiply}
			 *  @private
			 */
			this._scale = this.output = new Tone.Scale(options.min, options.max);

			this._sig.chain(this._exp, this._scale);
		};

		Tone.extend(Tone.ScaledEnvelope, Tone.Envelope);

		/**
		 *  the default parameters
		 *  @static
		 */
		Tone.ScaledEnvelope.defaults = {
			"min" : 0,
			"max" : 1,
			"exponent" : 1
		};

		/**
		 * The envelope's min output value. This is the value which it
		 * starts at. 
		 * @memberOf Tone.ScaledEnvelope#
		 * @type {number}
		 * @name min
		 */
		Object.defineProperty(Tone.ScaledEnvelope.prototype, "min", {
			get : function(){
				return this._scale.min;
			},
			set : function(min){
				this._scale.min = min;
			}
		});

		/**
		 * The envelope's max output value. In other words, the value
		 * at the peak of the attack portion of the envelope. 
		 * @memberOf Tone.ScaledEnvelope#
		 * @type {number}
		 * @name max
		 */
		Object.defineProperty(Tone.ScaledEnvelope.prototype, "max", {
			get : function(){
				return this._scale.max;
			},
			set : function(max){
				this._scale.max = max;
			}
		});

		/**
		 * The envelope's exponent value. 
		 * @memberOf Tone.ScaledEnvelope#
		 * @type {number}
		 * @name exponent
		 */
		Object.defineProperty(Tone.ScaledEnvelope.prototype, "exponent", {
			get : function(){
				return this._exp.value;
			},
			set : function(exp){
				this._exp.value = exp;
			}
		});
		
		/**
		 *  clean up
		 *  @returns {Tone.ScaledEnvelope} this
		 */
		Tone.ScaledEnvelope.prototype.dispose = function(){
			Tone.Envelope.prototype.dispose.call(this);
			this._scale.dispose();
			this._scale = null;
			this._exp.dispose();
			this._exp = null;
			return this;
		};

		return Tone.ScaledEnvelope;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(67), __webpack_require__(55), __webpack_require__(28)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";
		
		/**
		 *  @class  Performs a linear scaling on an input signal.
		 *          Scales a NormalRange input to between
		 *          outputMin and outputMax.
		 *
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @param {number} [outputMin=0] The output value when the input is 0. 
		 *  @param {number} [outputMax=1]	The output value when the input is 1. 
		 *  @example
		 * var scale = new Tone.Scale(50, 100);
		 * var signal = new Tone.Signal(0.5).connect(scale);
		 * //the output of scale equals 75
		 */
		Tone.Scale = function(outputMin, outputMax){

			/** 
			 *  @private
			 *  @type {number}
			 */
			this._outputMin = this.defaultArg(outputMin, 0);

			/** 
			 *  @private
			 *  @type {number}
			 */
			this._outputMax = this.defaultArg(outputMax, 1);


			/** 
			 *  @private
			 *  @type {Tone.Multiply}
			 *  @private
			 */
			this._scale = this.input = new Tone.Multiply(1);
			
			/** 
			 *  @private
			 *  @type {Tone.Add}
			 *  @private
			 */
			this._add = this.output = new Tone.Add(0);

			this._scale.connect(this._add);
			this._setRange();
		};

		Tone.extend(Tone.Scale, Tone.SignalBase);

		/**
		 * The minimum output value. This number is output when 
		 * the value input value is 0. 
		 * @memberOf Tone.Scale#
		 * @type {number}
		 * @name min
		 */
		Object.defineProperty(Tone.Scale.prototype, "min", {
			get : function(){
				return this._outputMin;
			},
			set : function(min){
				this._outputMin = min;
				this._setRange();
			}
		});

		/**
		 * The maximum output value. This number is output when 
		 * the value input value is 1. 
		 * @memberOf Tone.Scale#
		 * @type {number}
		 * @name max
		 */
		Object.defineProperty(Tone.Scale.prototype, "max", {
			get : function(){
				return this._outputMax;
			},
			set : function(max){
				this._outputMax = max;
				this._setRange();
			}
		});

		/**
		 *  set the values
		 *  @private
		 */
		Tone.Scale.prototype._setRange = function() {
			this._add.value = this._outputMin;
			this._scale.value = this._outputMax - this._outputMin;
		};

		/**
		 *  Clean up.
		 *  @returns {Tone.Scale} this
		 */
		Tone.Scale.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._add.dispose();
			this._add = null;
			this._scale.dispose();
			this._scale = null;
			return this;
		}; 

		return Tone.Scale;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(28)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class Add a signal and a number or two signals. When no value is
		 *         passed into the constructor, Tone.Add will sum <code>input[0]</code>
		 *         and <code>input[1]</code>. If a value is passed into the constructor, 
		 *         the it will be added to the input.
		 *  
		 *  @constructor
		 *  @extends {Tone.Signal}
		 *  @param {number=} value If no value is provided, Tone.Add will sum the first
		 *                         and second inputs. 
		 *  @example
		 * var signal = new Tone.Signal(2);
		 * var add = new Tone.Add(2);
		 * signal.connect(add);
		 * //the output of add equals 4
		 *  @example
		 * //if constructed with no arguments
		 * //it will add the first and second inputs
		 * var add = new Tone.Add();
		 * var sig0 = new Tone.Signal(3).connect(add, 0, 0);
		 * var sig1 = new Tone.Signal(4).connect(add, 0, 1);
		 * //the output of add equals 7. 
		 */
		Tone.Add = function(value){

			Tone.call(this, 2, 0);

			/**
			 *  the summing node
			 *  @type {GainNode}
			 *  @private
			 */
			this._sum = this.input[0] = this.input[1] = this.output = this.context.createGain();

			/**
			 *  @private
			 *  @type {Tone.Signal}
			 */
			this._param = this.input[1] = new Tone.Signal(value);

			this._param.connect(this._sum);
		};

		Tone.extend(Tone.Add, Tone.Signal);
		
		/**
		 *  Clean up.
		 *  @returns {Tone.Add} this
		 */
		Tone.Add.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			this._sum.disconnect();
			this._sum = null;
			this._param.dispose();
			this._param = null;
			return this;
		}; 

		return Tone.Add;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(25), __webpack_require__(28)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tone){

		"use strict";

		/**
		 *  @class  Tone.Filter is a filter which allows for all of the same native methods
		 *          as the [BiquadFilterNode](http://webaudio.github.io/web-audio-api/#the-biquadfilternode-interface). 
		 *          Tone.Filter has the added ability to set the filter rolloff at -12 
		 *          (default), -24 and -48. 
		 *
		 *  @constructor
		 *  @extends {Tone}
		 *  @param {Frequency|Object} [frequency] The cutoff frequency of the filter.
		 *  @param {string=} type The type of filter.
		 *  @param {number=} rolloff The drop in decibels per octave after the cutoff frequency.
		 *                            3 choices: -12, -24, and -48
		 *  @example
		 *  var filter = new Tone.Filter(200, "highpass");
		 */
		Tone.Filter = function(){
			Tone.call(this);

			var options = this.optionsObject(arguments, ["frequency", "type", "rolloff"], Tone.Filter.defaults);

			/**
			 *  the filter(s)
			 *  @type {Array}
			 *  @private
			 */
			this._filters = [];

			/**
			 *  The cutoff frequency of the filter. 
			 *  @type {Frequency}
			 *  @signal
			 */
			this.frequency = new Tone.Signal(options.frequency, Tone.Type.Frequency);

			/**
			 *  The detune parameter
			 *  @type {Cents}
			 *  @signal
			 */
			this.detune = new Tone.Signal(0, Tone.Type.Cents);

			/**
			 *  The gain of the filter, only used in certain filter types
			 *  @type {Number}
			 *  @signal
			 */
			this.gain = new Tone.Signal({
				"value" : options.gain, 
				"convert" : false
			});

			/**
			 *  The Q or Quality of the filter
			 *  @type {Positive}
			 *  @signal
			 */
			this.Q = new Tone.Signal(options.Q);

			/**
			 *  the type of the filter
			 *  @type {string}
			 *  @private
			 */
			this._type = options.type;

			/**
			 *  the rolloff value of the filter
			 *  @type {number}
			 *  @private
			 */
			this._rolloff = options.rolloff;

			//set the rolloff;
			this.rolloff = options.rolloff;
			this._readOnly(["detune", "frequency", "gain", "Q"]);
		};

		Tone.extend(Tone.Filter);

		/**
		 *  the default parameters
		 *
		 *  @static
		 *  @type {Object}
		 */
		Tone.Filter.defaults = {
			"type" : "lowpass",
			"frequency" : 350,
			"rolloff" : -12,
			"Q" : 1,
			"gain" : 0,
		};

		/**
		 * The type of the filter. Types: "lowpass", "highpass", 
		 * "bandpass", "lowshelf", "highshelf", "notch", "allpass", or "peaking". 
		 * @memberOf Tone.Filter#
		 * @type {string}
		 * @name type
		 */
		Object.defineProperty(Tone.Filter.prototype, "type", {
			get : function(){
				return this._type;
			},
			set : function(type){
				var types = ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "notch", "allpass", "peaking"];
				if (types.indexOf(type)=== -1){
					throw new Error("Tone.Filter does not have filter type "+type);
				}
				this._type = type;
				for (var i = 0; i < this._filters.length; i++){
					this._filters[i].type = type;
				}
			}
		});

		/**
		 * The rolloff of the filter which is the drop in db
		 * per octave. Implemented internally by cascading filters.
		 * Only accepts the values -12, -24, -48 and -96.
		 * @memberOf Tone.Filter#
		 * @type {number}
		 * @name rolloff
		 */
		Object.defineProperty(Tone.Filter.prototype, "rolloff", {
			get : function(){
				return this._rolloff;
			},
			set : function(rolloff){
				rolloff = parseInt(rolloff, 10);
				var possibilities = [-12, -24, -48, -96];
				var cascadingCount = possibilities.indexOf(rolloff);
				//check the rolloff is valid
				if (cascadingCount === -1){
					throw new Error("Filter rolloff can only be -12, -24, -48 or -96");
				} 
				cascadingCount += 1;
				this._rolloff = rolloff;
				//first disconnect the filters and throw them away
				this.input.disconnect();
				for (var i = 0; i < this._filters.length; i++) {
					this._filters[i].disconnect();
					this._filters[i] = null;
				}
				this._filters = new Array(cascadingCount);
				for (var count = 0; count < cascadingCount; count++){
					var filter = this.context.createBiquadFilter();
					filter.type = this._type;
					this.frequency.connect(filter.frequency);
					this.detune.connect(filter.detune);
					this.Q.connect(filter.Q);
					this.gain.connect(filter.gain);
					this._filters[count] = filter;
				}
				//connect them up
				var connectionChain = [this.input].concat(this._filters).concat([this.output]);
				this.connectSeries.apply(this, connectionChain);
			}
		});

		/**
		 *  Clean up. 
		 *  @return {Tone.Filter} this
		 */
		Tone.Filter.prototype.dispose = function(){
			Tone.prototype.dispose.call(this);
			for (var i = 0; i < this._filters.length; i++) {
				this._filters[i].disconnect();
				this._filters[i] = null;
			}
			this._filters = null;
			this._writable(["detune", "frequency", "gain", "Q"]);
			this.frequency.dispose();
			this.Q.dispose();
			this.frequency = null;
			this.Q = null;
			this.detune.dispose();
			this.detune = null;
			this.gain.dispose();
			this.gain = null;
			return this;
		};

		return Tone.Filter;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 69 */
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

/***/ })
]);