/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _swearwords = __webpack_require__(1);
	
	var Swearwords = _interopRequireWildcard(_swearwords);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var FACEBOOK_EMOTICON_URL_PATTERN = /^https:\/\/www\.facebook\.com\/images\/emoji\.php.*/i;
	
	function getRandomSwearword() {
	  var englishSwearwords = Swearwords.en;
	  var randomIndex = Math.floor(Math.random() * englishSwearwords.length);
	  var randomEnglishSwearword = englishSwearwords[randomIndex];
	
	  return randomEnglishSwearword;
	}
	
	function emoticonNodeFilter(node) {
	  var tagName = node.tagName.toLowerCase();
	  if (tagName !== 'img') return NodeFilter.FILTER_SKIP;
	
	  var src = node.getAttribute('src');
	  if (!FACEBOOK_EMOTICON_URL_PATTERN.test(src)) return NodeFilter.FILTER_SKIP;
	
	  return NodeFilter.FILTER_ACCEPT;
	}
	
	function replaceEmoticon(node, swearword) {
	  if (!node || !node.parentNode) return;
	
	  var replacement = document.createTextNode(swearword);
	  node.parentNode.insertBefore(replacement, node);
	  node.parentNode.removeChild(node);
	}
	
	function replaceEmoticons(node) {
	  var walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, {
	    acceptNode: emoticonNodeFilter
	  }, false);
	
	  while (walker.nextNode()) {
	    replaceEmoticon(walker.currentNode, getRandomSwearword());
	  }
	}
	
	var observer = new WebKitMutationObserver(function (mutations) {
	  mutations.forEach(function (mutation) {
	    mutation.addedNodes.forEach(replaceEmoticons);
	  });
	});
	
	observer.observe(document.body, {
	  childList: true,
	  subtree: true
	});
	
	replaceEmoticons(document.body);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _en = __webpack_require__(2);
	
	Object.defineProperty(exports, 'en', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_en).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = ['fuck', 'shit', 'piss', 'cunt', 'cock', 'cocksucker', 'motherfucker', 'fucking hell'];

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map