(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/Suggestable.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Suggestable.js":
/*!****************************!*\
  !*** ./src/Suggestable.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable no-case-declarations */


/**
 * Up Key code.
 *
 * @type {number}
 */
var KEY_UP = 38;

/**
 * Down rey code.
 *
 * @type {number}
 */
var KEY_DOWN = 40;

/**
 * Enter key code.
 *
 * @type {number}
 */
var KEY_ENTER = 13;

/**
 * Enter key code (numeric keyboard).
 *
 * @type {number}
 */
var KEY_NUMENTER = 108;

/**
 * Escape key code.
 *
 * @type {number}
 */
var KEY_ESCAPE = 27;

/**
 * Calculate outer height of given element with margins.
 *
 * @param  {HTMLElement} element
 * @return {number}
 */
var outerHeight = exports.outerHeight = function outerHeight(element) {
    var style = getComputedStyle(element);
    var height = parseInt(style.height, 10) || 0;

    height += (parseInt(style.paddingTop, 10) || 0) + (parseInt(style.paddingBottom, 10) || 0);
    height += (parseInt(style.marginTop, 10) || 0) + (parseInt(style.marginBottom, 10) || 0);
    height += (parseInt(style.borderTopWidth, 10) || 0) + (parseInt(style.borderBottomWidth, 10) || 0);

    return height;
};

var isVisible = exports.isVisible = function isVisible(element) {
    return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
};

var Suggestable = function () {

    /**
     * Constructor.
     *
     * @param {*}      element
     * @param {Object} options
     */


    /**
     * Term for suggestions search.
     *
     * @type {string}
     */


    /**
     * Input element.
     *
     * @type {HTMLInputElement}
     */


    /**
     * Cache object.
     *
     * @type {Object}
     */

    /**
     * Default options.
     *
     * @type {Object}
     */
    function Suggestable(element) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Suggestable);

        this.options = {
            'data-url': 'suggestableUrl',
            'container-class': 'suggestable-container',
            'item-class': 'suggestable-item',
            'item-active-class': 'suggestable-item-active',
            'term-class': 'suggestable-term',
            'suggest-class': 'suggestable-suggest',
            'delimiter-text': ' — ',
            'delimiter-class': 'suggestable-delimiter',
            'text-class': 'suggestable-text',
            'term-min-length': 3
        };
        this.hoverIndex = -1;
        this.cache = {};
        this.itemSelector = '';
        this.term = '';

        Object.assign(this.options, options);

        this.inputElement = element;
        this.containerElement = this.getContainer(this.inputElement);
        this.itemSelector = '.' + this.options['item-class'];
        this.url = this.inputElement.dataset[this.options['data-url']];

        this.init();
    }

    /**
     * Initialization of main events.
     */


    /**
     * Url for suggestions request.
     *
     * @type {string}
     */


    /**
     * Main container element for suggestions.
     *
     * @type {HTMLElement}
     */


    /**
     * Selector for item with suggestion.
     *
     * @type {string}
     */


    /**
     * Hovered element index.
     *
     * @type {number}
     */


    _createClass(Suggestable, [{
        key: 'init',
        value: function init() {
            document.addEventListener('mouseup', this.handlerMouseUp.bind(this), false);
            document.addEventListener('suggestable-hide', this.handlerSuggestableHide.bind(this), false);
            document.addEventListener('suggestable-show', this.handlerSuggestableShow.bind(this), false);
            document.addEventListener('suggestable-item-select', this.handlerSuggestableItemSelect.bind(this), false);
            document.addEventListener('suggestable-item-unselect', this.handlerSuggestableItemUnselect.bind(this), false);

            this.inputElement.setAttribute('autocomplete', 'off');
            this.inputElement.addEventListener('keydown', this.handlerKeyDown.bind(this), false);
            this.inputElement.addEventListener('keyup', this.handlerKeyUp.bind(this), false);
        }

        /**
         * Returns container element.
         *
         * @param  {HTMLElement} element
         * @return {HTMLElement}
         */

    }, {
        key: 'getContainer',
        value: function getContainer(element) {
            var id = element.id || 'sb' + Math.round(Math.random() * 9999) + 1;
            var containerId = id + '__container';
            var selector = '#' + containerId;
            var containerElement = document.querySelector(selector);

            if (!containerElement) {
                containerElement = document.createElement('ul');

                containerElement.classList.add(this.options['container-class']);
                containerElement.id = containerId;
                containerElement.style.marginTop = outerHeight(element) + 'px';
                containerElement.style.display = 'none';

                if (element.parentNode) {
                    element.parentNode.insertBefore(containerElement, element.nextSibling);
                }
            }

            return containerElement;
        }

        /**
         * Returns all suggestions elements in DOM.
         *
         * @return {NodeList<HTMLElement>}
         */

    }, {
        key: 'getItems',
        value: function getItems() {
            return this.containerElement.querySelectorAll(this.itemSelector);
        }

        /**
         * Returns cached suggestions values.
         *
         * @param  {string}             key
         * @return {Array<Object>|null}
         */

    }, {
        key: 'getCachedValue',
        value: function getCachedValue(key) {
            if (!Object.prototype.hasOwnProperty.call(this.cache, key)) {
                return null;
            }

            return this.cache[key];
        }

        /**
         * Returns suggestions from remote API.
         *
         * @return {Promise<Array<Object>>}
         */

    }, {
        key: 'fetchResults',
        value: function fetchResults() {
            /**
             * Checks response status.
             *
             * @param  {Response}     response
             * @return {Promise<any>}
             */
            var status = function status(response) {
                if (response.status < 200 || response.status >= 300) {
                    return Promise.reject(new Error(response.statusText));
                }

                return Promise.resolve(response);
            };
            /**
             * Returns JSON data from response.
             *
             * @param  {Response}               response
             * @return {Promise<Array<Object>>}
             */
            var json = function json(response) {
                return response.json();
            };

            return fetch(this.url + '?term=' + encodeURIComponent(this.term), {
                method: 'GET'
            }).then(status).then(json);
        }

        /**
         * Process results from remote API.
         *
         * @param {Array<Object>} items
         */

    }, {
        key: 'processResults',
        value: function processResults(items) {
            if (items.length === 0) {
                return;
            }

            this.cleanResults();

            items.forEach(this.createSuggestableItem.bind(this));

            document.dispatchEvent(new CustomEvent('suggestable-show'));
        }

        /**
         * Creates suggestion item and append it into DOM.
         *
         * @param {Object} item
         * @param {number} index
         */

    }, {
        key: 'createSuggestableItem',
        value: function createSuggestableItem(item, index) {
            var itemElement = document.createElement('li');
            var termElement = document.createElement('span');
            var suggestElement = document.createElement('span');

            itemElement.style.display = 'none';
            itemElement.classList.add(this.options['item-class']);

            termElement.classList.add(this.options['term-class']);
            termElement.textContent = this.term;

            suggestElement.classList.add(this.options['suggest-class']);
            suggestElement.textContent = item.query.substr(this.term.length);

            itemElement.appendChild(termElement);
            itemElement.appendChild(suggestElement);
            itemElement.dataset.suggestData = item.query;
            itemElement.dataset.suggestIndex = index.toString();
            itemElement.dataset.suggestUrl = item['suggest-url'];

            if (item['suggest-text'] !== '') {
                var delimiterElement = document.createElement('span');
                var delimiterTextElement = document.createElement('span');

                delimiterElement.classList.add(this.options['delimiter-class']);
                delimiterTextElement.classList.add(this.options['text-class']);

                delimiterElement.textContent = this.options['delimiter-text'];
                delimiterTextElement.textContent = item['suggest-text'];

                itemElement.appendChild(delimiterElement);
                itemElement.appendChild(delimiterTextElement);
            }

            itemElement.style.display = 'block';

            itemElement.addEventListener('mouseover', this.handlerMouseOver.bind(this), false);
            itemElement.addEventListener('mouseout', this.handlerMouseOut.bind(this), false);
            itemElement.addEventListener('click', this.handlerClick.bind(this), false);

            this.containerElement.appendChild(itemElement);
        }

        /**
         * Removes suggestions results from DOM.
         */

    }, {
        key: 'cleanResults',
        value: function cleanResults() {
            Array.prototype.forEach.call(this.getItems(), function (itemsElement) {
                itemsElement.remove();
            });
        }

        /**
         * Handles the event on mouse over suggestion in DOM.
         *
         * @param {MouseEvent} event
         */

    }, {
        key: 'handlerMouseOver',
        value: function handlerMouseOver(event) {
            var targetElement = event.currentTarget;

            if (!(targetElement instanceof HTMLElement)) {
                return;
            }

            this.hoverIndex = parseInt(targetElement.dataset.suggestIndex, 10);

            document.dispatchEvent(new CustomEvent('suggestable-item-select', {
                detail: { element: targetElement }
            }));
        }

        /**
         * Handles an event when the cursor leaves the element.
         *
         * @param {MouseEvent} event
         */

    }, {
        key: 'handlerMouseOut',
        value: function handlerMouseOut(event) {
            var targetElement = event.currentTarget;

            if (!(targetElement instanceof HTMLElement)) {
                return;
            }

            this.hoverIndex = -1;

            document.dispatchEvent(new CustomEvent('suggestable-item-unselect', {
                detail: { element: targetElement }
            }));
        }

        /**
         * Handles the mouse up button event.
         *
         * @param {MouseEvent} event
         */

    }, {
        key: 'handlerMouseUp',
        value: function handlerMouseUp(event) {
            var eventTarget = event.target;

            if (!(eventTarget instanceof HTMLElement)) {
                return;
            }

            if (this.containerElement.contains(eventTarget)) {
                return;
            }

            document.dispatchEvent(new CustomEvent('suggestable-hide'));
        }

        /**
         * Handles the click event on suggestion in DOM.
         *
         * @param {Event} event
         */

    }, {
        key: 'handlerClick',
        value: function handlerClick(event) {
            var targetElement = event.currentTarget;

            if (!(targetElement instanceof HTMLElement)) {
                return;
            }

            this.inputElement.value = targetElement.dataset.suggestData;

            document.dispatchEvent(new CustomEvent('suggestable-hide'));
            document.dispatchEvent(new CustomEvent('suggestable-click', {
                detail: { item: targetElement }
            }));
        }

        /**
         * Handles "hide suggestion" event.
         */

    }, {
        key: 'handlerSuggestableHide',
        value: function handlerSuggestableHide() {
            this.containerElement.style.display = 'none';
        }

        /**
         * Handles "show suggestion" event.
         */

    }, {
        key: 'handlerSuggestableShow',
        value: function handlerSuggestableShow() {
            this.hoverIndex = -1;
            this.containerElement.style.display = 'block';
        }

        /**
         * Handles "select suggestion" event.
         *
         * @param {CustomEvent} event
         */

    }, {
        key: 'handlerSuggestableItemSelect',
        value: function handlerSuggestableItemSelect(event) {
            var _this = this;

            var detail = event.detail;


            if (!detail) {
                return;
            }

            var element = detail.element;


            if (!(element instanceof HTMLElement)) {
                return;
            }

            Array.prototype.forEach.call(this.getItems(), function (item) {
                item.classList.remove(_this.options['item-active-class']);
            });

            element.classList.add(this.options['item-active-class']);
        }

        /**
         * Handles "deselect suggestion" event.
         *
         * @param {CustomEvent} event
         */

    }, {
        key: 'handlerSuggestableItemUnselect',
        value: function handlerSuggestableItemUnselect(event) {
            var detail = event.detail;


            if (!detail) {
                return;
            }

            var element = detail.element;


            if (!(element instanceof HTMLElement)) {
                return;
            }

            element.classList.remove(this.options['item-active-class']);
        }

        /**
         * Handles key down event on input field.
         *
         * @param  {KeyboardEvent} event
         * @return {boolean}
         */

    }, {
        key: 'handlerKeyDown',
        value: function handlerKeyDown(event) {
            var keyCode = event.keyCode || event.which;

            if ([KEY_DOWN, KEY_UP].includes(keyCode)) {
                event.preventDefault();
            }

            if (isVisible(this.containerElement)) {
                switch (keyCode) {
                    case KEY_ENTER || KEY_NUMENTER:
                        this.pressEnterKey(event);
                        break;

                    case KEY_UP:
                        this.pressArrowUpKey();
                        break;

                    case KEY_DOWN:
                        this.pressArrowDownKey();
                        break;

                    default:
                        break;
                }
            }
        }

        /**
         * "Enter" key press action.
         *
         * @param {KeyboardEvent} event
         */

    }, {
        key: 'pressEnterKey',
        value: function pressEnterKey(event) {
            var items = this.getItems();

            if (!items.length) {
                return;
            }

            var suggestElement = items[this.hoverIndex];

            if (!suggestElement) {
                return;
            }

            event.preventDefault();

            suggestElement.dispatchEvent(new Event('click'));
        }

        /**
         * "Arrow up" key press action.
         */

    }, {
        key: 'pressArrowUpKey',
        value: function pressArrowUpKey() {
            var items = this.getItems();

            if (!items.length) {
                return;
            }

            if (this.hoverIndex === -1 || this.hoverIndex <= 0) {
                this.hoverIndex = items.length - 1;
            } else {
                this.hoverIndex -= 1;
            }

            var suggestElement = items[this.hoverIndex];

            if (!suggestElement) {
                return;
            }

            suggestElement.dispatchEvent(new Event('mouseover'));
            this.inputElement.value = suggestElement.dataset.suggestData;
        }

        /**
         * "Arrow down" key press action.
         */

    }, {
        key: 'pressArrowDownKey',
        value: function pressArrowDownKey() {
            var items = this.getItems();

            if (!items.length) {
                return;
            }

            if (this.hoverIndex === -1 || this.hoverIndex >= items.length - 1) {
                this.hoverIndex = 0;
            } else {
                this.hoverIndex += 1;
            }

            var suggestElement = items[this.hoverIndex];

            if (!suggestElement) {
                return;
            }

            suggestElement.dispatchEvent(new Event('mouseover'));
            this.inputElement.value = suggestElement.dataset.suggestData;
        }

        /**
         * Handles key up event on input field.
         *
         * @param {KeyboardEvent} event
         */

    }, {
        key: 'handlerKeyUp',
        value: function handlerKeyUp(event) {
            var _this2 = this;

            this.term = this.inputElement.value.trim();

            var keyCode = event.keyCode || event.which;
            var cacheKey = this.url + ':' + this.term;

            if ([KEY_DOWN, KEY_UP, KEY_ENTER, KEY_NUMENTER, KEY_ESCAPE].indexOf(keyCode) === -1) {
                if (this.term.length >= this.options['term-min-length']) {
                    var cachedValue = this.getCachedValue(cacheKey);

                    if (!cachedValue) {
                        this.fetchResults().then(function (data) {
                            _this2.cache[cacheKey] = data;
                            _this2.processResults(data);
                        });
                    } else {
                        this.processResults(cachedValue);
                    }
                } else {
                    document.dispatchEvent(new CustomEvent('suggestable-hide'));
                }
            }

            if (isVisible(this.containerElement) && keyCode === KEY_ESCAPE) {
                document.dispatchEvent(new CustomEvent('suggestable-hide'));
            }
        }
    }]);

    return Suggestable;
}();

exports.default = Suggestable;

/***/ })

/******/ });
});
//# sourceMappingURL=Suggestable.js.map