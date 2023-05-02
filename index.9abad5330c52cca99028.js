/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/assets/styles/main.scss":
/*!*************************************!*\
  !*** ./src/assets/styles/main.scss ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/assets/js/caption.js":
/*!**********************************!*\
  !*** ./src/assets/js/caption.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "caption": () => (/* binding */ caption)
/* harmony export */ });
// eslint-disable-next-line import/prefer-default-export
const caption = document.createElement('h1');
caption.innerText = 'RSS Virtual Keyboard';
caption.className = 'caption';


/***/ }),

/***/ "./src/assets/js/key.js":
/*!******************************!*\
  !*** ./src/assets/js/key.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Key": () => (/* binding */ Key)
/* harmony export */ });
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */
class Key {
  _button; // DOM element

  _props; //

  _enLocale;

  _system;

  _code;

  _isLetter;

  _isCapsLocked;

  constructor(code, props) {
    this._props = props;
    this._code = code;
    this._enLocale = true;
    this._isLetter = /[a-z]/.test(props.key);
    this._isCapsLocked = false;

    this._button = document.createElement('li');
    this._button.className = 'keyboard__key';

    this._button.dataset.code = code;
    if ((props.withShiftKey && props.withShiftKey !== props.key) || code === 'Space') {
      this._system = false;
    } else {
      this._button.classList.add('keyboard__key_system');
      this._system = true;
    }

    this._button.textContent = props.name ? props.name : props.key;

    if (props.width) {
      this._button.style.width = props.width;
    }
  }

  /**
   *
   * @param {boolean} pressed
   */
  shift = (pressed = true) => {
    if (this._props.withShiftKey) {
      this.render(pressed);
    }
  };

  capsLock = () => {
    if (this._isLetter) {
      this._isCapsLocked = !this._isCapsLocked;
      const p = this._props;
      const ap = this._alternativeProps;
      [p.key, p.withShiftKey] = [p.withShiftKey, p.key];
      [ap.key, ap.withShiftKey] = [ap.withShiftKey, ap.key];
      this.render();
    }
  };

  setLocale = () => {
    if (this._props.withShiftKey) {
      this._enLocale = !this._enLocale;
      this.render();
    }
  };

  render = (shiftPressed = false) => {
    const locateDependence = this._enLocale ? '_props' : '_alternativeProps';
    const shiftDependence = shiftPressed ? 'withShiftKey' : 'key';
    this._button.textContent = this[locateDependence][shiftDependence];
  };

  addAlternativeChars = (val) => {
    this._alternativeProps = val;
  };

  getElement = () => this._button;

  getKey = () => this._props.key;

  getWithShiftKey = () => this._props.withShiftKey;

  getProperties = (isEnLocale = true) => ({
    code: this._code,
    system: this._system,
    key: isEnLocale ? this._props.key : this._alternativeProps?.key ?? this._props.key,
    withShiftKey: isEnLocale
      ? this._props.withShiftKey
      : this._alternativeProps?.withShiftKey ?? this._props.withShiftKey,
  });
}


/***/ }),

/***/ "./src/assets/js/keyboard.js":
/*!***********************************!*\
  !*** ./src/assets/js/keyboard.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Keyboard": () => (/* binding */ Keyboard)
/* harmony export */ });
/* harmony import */ var _key__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./key */ "./src/assets/js/key.js");
/* eslint-disable import/named */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-underscore-dangle */


// eslint-disable-next-line import/prefer-default-export
class Keyboard {
  _board;

  _keys;

  _alternativeKeys;

  _isEnLocale;

  _pressedKeys;

  _capsLockIsOn;

  _textarea;

  constructor(keys, alternativeKeys, textarea) {
    this._pressedKeys = new Set();
    this._isEnLocale = localStorage.getItem('locale') === 'en';
    this._keys = {};
    this._alternativeKeys = alternativeKeys;
    this._board = document.createElement('div');
    this._board.className = 'keyboard';
    this._capsLockIsOn = false;
    this._textarea = textarea;

    keys.forEach((row) => {
      const line = document.createElement('ul');
      line.className = 'keyboard__row';
      this._board.append(line);

      for (const code in row) {
        const button = new _key__WEBPACK_IMPORTED_MODULE_0__.Key(code, row[code]);
        this._keys[code] = button;
        if (this._alternativeKeys[code]) {
          this._alternativeKeys[code].button = button;
          button.addAlternativeChars(this._alternativeKeys[code]);
        }
        line.append(button.getElement());
      }
    });
    if (!this._isEnLocale) this._setLocale();

    this._board.addEventListener('mousedown', this._handleMouseEvent);
    this._board.addEventListener('mouseout', this._handleMouseEvent);
    this._board.addEventListener('mouseup', this._handleMouseEvent);

    const html = document.querySelector('body');
    html.addEventListener('keydown', this._handleKeyboardEvent);
    html.addEventListener('keyup', this._handleKeyboardEvent);
  }

  _handleMouseEvent = (event) => {
    const supportEventTypesUnpressed = ['mousedown'].includes(event.type);
    const supportEventTypesPressed = ['mouseup'].includes(event.type);
    const unpressedKey = () => event.target.classList.contains('keyboard__key');
    const pressedKey = () => event.target.classList.contains('keyboard__key_pressed');
    if (
      (unpressedKey() && supportEventTypesUnpressed)
      || (pressedKey() && supportEventTypesPressed)
    ) {
      const handleKeyboardEvent = () => this._handleVirtualKeyboardEvent(
        event,
        'mousedown',
        event.target.dataset.code,
        event.target,
      );
      handleKeyboardEvent();
      setTimeout(() => {
        if (pressedKey()) {
          const repeater = setInterval(() => {
            if (pressedKey()) {
              handleKeyboardEvent();
            } else {
              clearInterval(repeater);
            }
          }, 30);
        }
      }, 200);
      event.preventDefault();
    }
  };

  _handleKeyboardEvent = (event) => {
    const supportEventTypesUnpressed = ['keydown'].includes(event.type);
    const supportEventTypesPressed = ['keyup'].includes(event.type);

    if (
      this._keys[event.code]
      && (supportEventTypesUnpressed || supportEventTypesPressed)
    ) {
      this._handleVirtualKeyboardEvent(
        event,
        'keydown',
        event.code,
        this._keys[event.code].getElement(),
      );
    }
  };

  /**
   *
   * @param {Event} event
   * @param {string} eventTypeDown - for mouseEvent "mousedown", for keyboard "keydown"
   * @param {*} code  - key kode from event
   * @param {*} eventTarget - dom element of keys for changing styles
   */
  _handleVirtualKeyboardEvent = (event, eventTypeDown, code, eventTarget) => {
    const pressedDown = event.type === eventTypeDown;
    const pressedKeyClass = 'keyboard__key_pressed';
    const keyProps = this._keys[code].getProperties(this._isEnLocale);
    const shiftPressed = event.shiftKey
      || this._pressedKeys.has('ShiftLeft')
      || this._pressedKeys.has('ShiftRight');

    if (pressedDown) {
      // the Alt, Ctrl keys should work as on a real keyboard
      if ((this._pressedKeys.has('ControlLeft') && !this._pressedKeys.has('AltLeft'))
      || this._pressedKeys.has('ControlRight')
      || (this._pressedKeys.has('AltLeft') && !this._pressedKeys.has('ControlLeft'))
      || this._pressedKeys.has('AltRight')
      || this._pressedKeys.has('MetalLeft')
      || this._pressedKeys.has('MetaRight')
      || this._pressedKeys.has('CapsLock')
      || code === 'ArrowLeft'
      || code === 'ArrowRight'
      || code === 'ArrowUp'
      || code === 'ArrowDown'
      || code === 'Backspace'
      || code === 'Delete'
      || code === 'Enter'
      ) {
        this._pressedKeys.add(code);
        // change locale handler
        if (this._pressedKeys.size > 1) {
          if (this._pressedKeys.has('AltLeft') && this._pressedKeys.has('ControlLeft')) {
            this._isEnLocale = !this._isEnLocale;
            this._setLocale();
            localStorage.setItem('locale', this._isEnLocale ? 'en' : ' ru');
          } else {
            return;
          }
        } else {
          return;
        }
      }

      this._pressedKeys.add(code);
      eventTarget.classList.add(pressedKeyClass);

      const virtualKeydownEvent = new KeyboardEvent('virtualKeydown', {
        key: keyProps.key,
        code,
        bubbles: true,
      });
      virtualKeydownEvent.specDetails = keyProps;
      virtualKeydownEvent.specDetails.shiftPressed = shiftPressed;

      this._textarea.dispatchEvent(virtualKeydownEvent);
    } else if (this._pressedKeys.has(code)) {
      eventTarget.classList.remove(pressedKeyClass);
      this._pressedKeys.delete(code);
    }
    event.preventDefault();

    // change view all keys which depends of "shift"
    if (keyProps.key === 'Shift') {
      for (const key in this._alternativeKeys) {
        this._alternativeKeys[key].button.shift(pressedDown);
      }
    }

    // change view all keys which depends of "shift"
    if (keyProps.key === 'CapsLock' && pressedDown) {
      this._capsLockIsOn = !this._capsLockIsOn;
      eventTarget.classList[this._capsLockIsOn ? 'add' : 'remove'](
        'keyboard__key_lighted',
      );
      for (const key in this._alternativeKeys) {
        this._alternativeKeys[key].button.capsLock(this._capsLockIsOn);
      }
    }
  };

  _setLocale = () => {
    for (const key in this._alternativeKeys) {
      this._alternativeKeys[key].button.setLocale(this._isEnLocale);
    }
  };

  board = () => this._board;
}


/***/ }),

/***/ "./src/assets/js/textarea.js":
/*!***********************************!*\
  !*** ./src/assets/js/textarea.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Textarea": () => (/* binding */ Textarea)
/* harmony export */ });
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */
class Textarea {
  _textField;

  _wrapper;

  constructor(cols, rows, className) {
    this._wrapper = document.createElement('div');
    this._info = document.createElement('p');
    this._wrapper.append(this._info);

    this._textField = document.createElement('textarea');
    this._textField.className = className;
    this._textField.cols = cols;
    this._textField.rows = rows;
    this._textField.autofocus = true;
    this._textField.value = '';

    this._wrapper.append(this._textField);

    this._wrapper.addEventListener('virtualKeydown', this._handlerKeydown);
    this._wrapper.addEventListener('focusout', this.focus);
  }

  get = () => this._wrapper;

  focus = () => {
    this._textField.focus();
  };

  _handlerKeydown = (event) => {
    const keyProps = event.specDetails;

    const printedChar = !keyProps.system && keyProps.shiftPressed && keyProps.withShiftKey
      ? keyProps.withShiftKey
      : keyProps.key;

    let insertingText;

    this.focus();
    const startPos = this._textField.selectionStart;
    const endPos = this._textField.selectionEnd;
    switch (keyProps.code) {
      case 'ShiftLeft':
        break;
      case 'ShiftRight':
        break;
      case 'AltLeft':
        break;
      case 'AltRight':
        break;
      case 'ControlLeft':
        break;
      case 'ControlRight':
        break;
      case 'MetaLeft':
        break;
      case 'MetaRight':
        break;
      case 'Tab':
        insertingText = '\t';
        break;
      case 'Shift':
        break;
      default:
        insertingText = !keyProps.system ? printedChar : '';
    }

    if (insertingText === undefined) {
      this._textField.selectionStart = startPos;
      this._textField.selectionEnd = endPos;
    } else {
      this._textField.value = this._textField.value.substring(0, startPos)
        + insertingText
        + this._textField.value.substring(endPos, this._textField.value.length);
      this._textField.selectionStart = startPos + insertingText.length;
      this._textField.selectionEnd = startPos + insertingText.length;
    }
  };
}


/***/ }),

/***/ "./src/assets/keys-ru.json":
/*!*********************************!*\
  !*** ./src/assets/keys-ru.json ***!
  \*********************************/
/***/ ((module) => {

module.exports = JSON.parse('{"Backquote":{"key":"ё","withShiftKey":"Ё"},"Digit1":{"key":"1","withShiftKey":"!"},"Digit2":{"key":"2","withShiftKey":"\\""},"Digit3":{"key":"3","withShiftKey":"№"},"Digit4":{"key":"4","withShiftKey":";"},"Digit5":{"key":"5","withShiftKey":"%"},"Digit6":{"key":"6","withShiftKey":":"},"Digit7":{"key":"7","withShiftKey":"?"},"Digit8":{"key":"8","withShiftKey":"*"},"Digit9":{"key":"9","withShiftKey":"("},"Digit0":{"key":"0","withShiftKey":")"},"Minus":{"key":"-","withShiftKey":"_"},"Equal":{"key":"=","withShiftKey":"+"},"KeyQ":{"key":"й","withShiftKey":"Й"},"KeyW":{"key":"ц","withShiftKey":"Ц"},"KeyE":{"key":"у","withShiftKey":"У"},"KeyR":{"key":"к","withShiftKey":"К"},"KeyT":{"key":"е","withShiftKey":"Е"},"KeyY":{"key":"н","withShiftKey":"Н"},"KeyU":{"key":"г","withShiftKey":"Г"},"KeyI":{"key":"ш","withShiftKey":"Ш"},"KeyO":{"key":"щ","withShiftKey":"Щ"},"KeyP":{"key":"з","withShiftKey":"З"},"BracketLeft":{"key":"х","withShiftKey":"Х"},"BracketRight":{"key":"ъ","withShiftKey":"Ъ"},"Backslash":{"key":"\\\\","withShiftKey":"/"},"KeyA":{"key":"ф","withShiftKey":"Ф"},"KeyS":{"key":"ы","withShiftKey":"Ы"},"KeyD":{"key":"в","withShiftKey":"В"},"KeyF":{"key":"а","withShiftKey":"А"},"KeyG":{"key":"п","withShiftKey":"П"},"KeyH":{"key":"р","withShiftKey":"Р"},"KeyJ":{"key":"о","withShiftKey":"О"},"KeyK":{"key":"л","withShiftKey":"Л"},"KeyL":{"key":"д","withShiftKey":"Д"},"Semicolon":{"key":"ж","withShiftKey":"Ж"},"Quote":{"key":"э","withShiftKey":"Э"},"KeyZ":{"key":"я","withShiftKey":"Я"},"KeyX":{"key":"ч","withShiftKey":"Ч"},"KeyC":{"key":"с","withShiftKey":"С"},"KeyV":{"key":"м","withShiftKey":"М"},"KeyB":{"key":"и","withShiftKey":"И"},"KeyN":{"key":"т","withShiftKey":"Т"},"KeyM":{"key":"ь","withShiftKey":"Ь"},"Comma":{"key":"б","withShiftKey":"Б"},"Period":{"key":"ю","withShiftKey":"Ю"},"Slash":{"key":".","withShiftKey":","}}');

/***/ }),

/***/ "./src/assets/keys.json":
/*!******************************!*\
  !*** ./src/assets/keys.json ***!
  \******************************/
/***/ ((module) => {

module.exports = JSON.parse('[{"Backquote":{"key":"`","withShiftKey":"~"},"Digit1":{"key":"1","withShiftKey":"!"},"Digit2":{"key":"2","withShiftKey":"@"},"Digit3":{"key":"3","withShiftKey":"#"},"Digit4":{"key":"4","withShiftKey":"$"},"Digit5":{"key":"5","withShiftKey":"%"},"Digit6":{"key":"6","withShiftKey":"^"},"Digit7":{"key":"7","withShiftKey":"&"},"Digit8":{"key":"8","withShiftKey":"*"},"Digit9":{"key":"9","withShiftKey":"("},"Digit0":{"key":"0","withShiftKey":")"},"Minus":{"key":"-","withShiftKey":"_"},"Equal":{"key":"=","withShiftKey":"+"},"Backspace":{"key":"Backspace","width":"8.6rem"}},{"Tab":{"key":"Tab","width":"4rem"},"KeyQ":{"key":"q","withShiftKey":"Q"},"KeyW":{"key":"w","withShiftKey":"W"},"KeyE":{"key":"e","withShiftKey":"E"},"KeyR":{"key":"r","withShiftKey":"R"},"KeyT":{"key":"t","withShiftKey":"T"},"KeyY":{"key":"y","withShiftKey":"Y"},"KeyU":{"key":"u","withShiftKey":"U"},"KeyI":{"key":"i","withShiftKey":"I"},"KeyO":{"key":"o","withShiftKey":"O"},"KeyP":{"key":"p","withShiftKey":"P"},"BracketLeft":{"key":"[","withShiftKey":"{"},"BracketRight":{"key":"]","withShiftKey":"}"},"Backslash":{"key":"\\\\","withShiftKey":"|"},"Delete":{"key":"Delete","name":"Del","width":"4rem"}},{"CapsLock":{"key":"CapsLock","width":"6rem"},"KeyA":{"key":"a","withShiftKey":"A"},"KeyS":{"key":"s","withShiftKey":"S"},"KeyD":{"key":"d","withShiftKey":"D"},"KeyF":{"key":"f","withShiftKey":"F"},"KeyG":{"key":"g","withShiftKey":"G"},"KeyH":{"key":"h","withShiftKey":"H"},"KeyJ":{"key":"j","withShiftKey":"J"},"KeyK":{"key":"k","withShiftKey":"K"},"KeyL":{"key":"l","withShiftKey":"L"},"Semicolon":{"key":";","withShiftKey":":"},"Quote":{"key":"\'","withShiftKey":"\\""},"Enter":{"key":"Enter","width":"9rem"}},{"ShiftLeft":{"key":"Shift","width":"8rem"},"KeyZ":{"key":"z","withShiftKey":"Z"},"KeyX":{"key":"x","withShiftKey":"X"},"KeyC":{"key":"c","withShiftKey":"C"},"KeyV":{"key":"v","withShiftKey":"V"},"KeyB":{"key":"b","withShiftKey":"B"},"KeyN":{"key":"n","withShiftKey":"N"},"KeyM":{"key":"m","withShiftKey":"M"},"Comma":{"key":",","withShiftKey":"<"},"Period":{"key":".","withShiftKey":">"},"Slash":{"key":"/","withShiftKey":"?"},"ArrowUp":{"key":"ArrowUp","name":"▲"},"ShiftRight":{"key":"Shift","width":"7rem"}},{"ControlLeft":{"key":"Control","name":"Ctrl"},"MetaLeft":{"key":"Meta","name":"Win"},"AltLeft":{"key":"Alt"},"Space":{"key":" ","width":"26.2rem"},"AltRight":{"key":"AltGraph","name":"Alt"},"ArrowLeft":{"key":"ArrowLeft","name":"◄"},"ArrowDown":{"key":"ArrowDown","name":"▼"},"ArrowRight":{"key":"ArrowRight","name":"►"},"ControlRight":{"key":"Control","name":"Ctrl","width":"3rem"}}]');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assets_styles_main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assets/styles/main.scss */ "./src/assets/styles/main.scss");
/* harmony import */ var _assets_js_caption__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assets/js/caption */ "./src/assets/js/caption.js");
/* harmony import */ var _assets_js_textarea__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./assets/js/textarea */ "./src/assets/js/textarea.js");
/* harmony import */ var _assets_js_keyboard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./assets/js/keyboard */ "./src/assets/js/keyboard.js");
/* harmony import */ var _assets_keys_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./assets/keys.json */ "./src/assets/keys.json");
/* harmony import */ var _assets_keys_ru_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./assets/keys-ru.json */ "./src/assets/keys-ru.json");
/* eslint-disable import/named */







const body = document.querySelector('body');

body.append(_assets_js_caption__WEBPACK_IMPORTED_MODULE_1__.caption);

const textarea = new _assets_js_textarea__WEBPACK_IMPORTED_MODULE_2__.Textarea(100, 10, 'text-field');
const ta = textarea.get();
body.append(ta);

const keyboard = new _assets_js_keyboard__WEBPACK_IMPORTED_MODULE_3__.Keyboard(_assets_keys_json__WEBPACK_IMPORTED_MODULE_4__, _assets_keys_ru_json__WEBPACK_IMPORTED_MODULE_5__, ta);
body.append(keyboard.board());

const text = document.createElement('p');
text.textContent = 'Для переключения языка: левыe ctrl + alt';
body.append(text);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztVQ2hGQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOQTtBQUNtQztBQUNXO0FBQ0U7QUFDQTtBQUNWO0FBQ0s7O0FBRTNDOztBQUVBLFlBQVksdURBQU87O0FBRW5CLHFCQUFxQix5REFBUTtBQUM3QjtBQUNBOztBQUVBLHFCQUFxQix5REFBUSxDQUFDLDhDQUFJLEVBQUUsaURBQU07QUFDMUM7O0FBRUE7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdmlydHVhbC1rZXlib2FyZC8uL3NyYy9hc3NldHMvc3R5bGVzL21haW4uc2Nzcz80ZmVkIiwid2VicGFjazovL3ZpcnR1YWwta2V5Ym9hcmQvLi9zcmMvYXNzZXRzL2pzL2NhcHRpb24uanMiLCJ3ZWJwYWNrOi8vdmlydHVhbC1rZXlib2FyZC8uL3NyYy9hc3NldHMvanMva2V5LmpzIiwid2VicGFjazovL3ZpcnR1YWwta2V5Ym9hcmQvLi9zcmMvYXNzZXRzL2pzL2tleWJvYXJkLmpzIiwid2VicGFjazovL3ZpcnR1YWwta2V5Ym9hcmQvLi9zcmMvYXNzZXRzL2pzL3RleHRhcmVhLmpzIiwid2VicGFjazovL3ZpcnR1YWwta2V5Ym9hcmQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdmlydHVhbC1rZXlib2FyZC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdmlydHVhbC1rZXlib2FyZC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3ZpcnR1YWwta2V5Ym9hcmQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly92aXJ0dWFsLWtleWJvYXJkLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvcHJlZmVyLWRlZmF1bHQtZXhwb3J0XG5leHBvcnQgY29uc3QgY2FwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gxJyk7XG5jYXB0aW9uLmlubmVyVGV4dCA9ICdSU1MgVmlydHVhbCBLZXlib2FyZCc7XG5jYXB0aW9uLmNsYXNzTmFtZSA9ICdjYXB0aW9uJztcbiIsIi8qIGVzbGludC1kaXNhYmxlIGltcG9ydC9wcmVmZXItZGVmYXVsdC1leHBvcnQgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVyc2NvcmUtZGFuZ2xlICovXG5leHBvcnQgY2xhc3MgS2V5IHtcbiAgX2J1dHRvbjsgLy8gRE9NIGVsZW1lbnRcblxuICBfcHJvcHM7IC8vXG5cbiAgX2VuTG9jYWxlO1xuXG4gIF9zeXN0ZW07XG5cbiAgX2NvZGU7XG5cbiAgX2lzTGV0dGVyO1xuXG4gIF9pc0NhcHNMb2NrZWQ7XG5cbiAgY29uc3RydWN0b3IoY29kZSwgcHJvcHMpIHtcbiAgICB0aGlzLl9wcm9wcyA9IHByb3BzO1xuICAgIHRoaXMuX2NvZGUgPSBjb2RlO1xuICAgIHRoaXMuX2VuTG9jYWxlID0gdHJ1ZTtcbiAgICB0aGlzLl9pc0xldHRlciA9IC9bYS16XS8udGVzdChwcm9wcy5rZXkpO1xuICAgIHRoaXMuX2lzQ2Fwc0xvY2tlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5fYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICB0aGlzLl9idXR0b24uY2xhc3NOYW1lID0gJ2tleWJvYXJkX19rZXknO1xuXG4gICAgdGhpcy5fYnV0dG9uLmRhdGFzZXQuY29kZSA9IGNvZGU7XG4gICAgaWYgKChwcm9wcy53aXRoU2hpZnRLZXkgJiYgcHJvcHMud2l0aFNoaWZ0S2V5ICE9PSBwcm9wcy5rZXkpIHx8IGNvZGUgPT09ICdTcGFjZScpIHtcbiAgICAgIHRoaXMuX3N5c3RlbSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9idXR0b24uY2xhc3NMaXN0LmFkZCgna2V5Ym9hcmRfX2tleV9zeXN0ZW0nKTtcbiAgICAgIHRoaXMuX3N5c3RlbSA9IHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5fYnV0dG9uLnRleHRDb250ZW50ID0gcHJvcHMubmFtZSA/IHByb3BzLm5hbWUgOiBwcm9wcy5rZXk7XG5cbiAgICBpZiAocHJvcHMud2lkdGgpIHtcbiAgICAgIHRoaXMuX2J1dHRvbi5zdHlsZS53aWR0aCA9IHByb3BzLndpZHRoO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHByZXNzZWRcbiAgICovXG4gIHNoaWZ0ID0gKHByZXNzZWQgPSB0cnVlKSA9PiB7XG4gICAgaWYgKHRoaXMuX3Byb3BzLndpdGhTaGlmdEtleSkge1xuICAgICAgdGhpcy5yZW5kZXIocHJlc3NlZCk7XG4gICAgfVxuICB9O1xuXG4gIGNhcHNMb2NrID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLl9pc0xldHRlcikge1xuICAgICAgdGhpcy5faXNDYXBzTG9ja2VkID0gIXRoaXMuX2lzQ2Fwc0xvY2tlZDtcbiAgICAgIGNvbnN0IHAgPSB0aGlzLl9wcm9wcztcbiAgICAgIGNvbnN0IGFwID0gdGhpcy5fYWx0ZXJuYXRpdmVQcm9wcztcbiAgICAgIFtwLmtleSwgcC53aXRoU2hpZnRLZXldID0gW3Aud2l0aFNoaWZ0S2V5LCBwLmtleV07XG4gICAgICBbYXAua2V5LCBhcC53aXRoU2hpZnRLZXldID0gW2FwLndpdGhTaGlmdEtleSwgYXAua2V5XTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9O1xuXG4gIHNldExvY2FsZSA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5fcHJvcHMud2l0aFNoaWZ0S2V5KSB7XG4gICAgICB0aGlzLl9lbkxvY2FsZSA9ICF0aGlzLl9lbkxvY2FsZTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9O1xuXG4gIHJlbmRlciA9IChzaGlmdFByZXNzZWQgPSBmYWxzZSkgPT4ge1xuICAgIGNvbnN0IGxvY2F0ZURlcGVuZGVuY2UgPSB0aGlzLl9lbkxvY2FsZSA/ICdfcHJvcHMnIDogJ19hbHRlcm5hdGl2ZVByb3BzJztcbiAgICBjb25zdCBzaGlmdERlcGVuZGVuY2UgPSBzaGlmdFByZXNzZWQgPyAnd2l0aFNoaWZ0S2V5JyA6ICdrZXknO1xuICAgIHRoaXMuX2J1dHRvbi50ZXh0Q29udGVudCA9IHRoaXNbbG9jYXRlRGVwZW5kZW5jZV1bc2hpZnREZXBlbmRlbmNlXTtcbiAgfTtcblxuICBhZGRBbHRlcm5hdGl2ZUNoYXJzID0gKHZhbCkgPT4ge1xuICAgIHRoaXMuX2FsdGVybmF0aXZlUHJvcHMgPSB2YWw7XG4gIH07XG5cbiAgZ2V0RWxlbWVudCA9ICgpID0+IHRoaXMuX2J1dHRvbjtcblxuICBnZXRLZXkgPSAoKSA9PiB0aGlzLl9wcm9wcy5rZXk7XG5cbiAgZ2V0V2l0aFNoaWZ0S2V5ID0gKCkgPT4gdGhpcy5fcHJvcHMud2l0aFNoaWZ0S2V5O1xuXG4gIGdldFByb3BlcnRpZXMgPSAoaXNFbkxvY2FsZSA9IHRydWUpID0+ICh7XG4gICAgY29kZTogdGhpcy5fY29kZSxcbiAgICBzeXN0ZW06IHRoaXMuX3N5c3RlbSxcbiAgICBrZXk6IGlzRW5Mb2NhbGUgPyB0aGlzLl9wcm9wcy5rZXkgOiB0aGlzLl9hbHRlcm5hdGl2ZVByb3BzPy5rZXkgPz8gdGhpcy5fcHJvcHMua2V5LFxuICAgIHdpdGhTaGlmdEtleTogaXNFbkxvY2FsZVxuICAgICAgPyB0aGlzLl9wcm9wcy53aXRoU2hpZnRLZXlcbiAgICAgIDogdGhpcy5fYWx0ZXJuYXRpdmVQcm9wcz8ud2l0aFNoaWZ0S2V5ID8/IHRoaXMuX3Byb3BzLndpdGhTaGlmdEtleSxcbiAgfSk7XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvbmFtZWQgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXJlc3RyaWN0ZWQtc3ludGF4ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBndWFyZC1mb3ItaW4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVyc2NvcmUtZGFuZ2xlICovXG5pbXBvcnQgeyBLZXkgfSBmcm9tICcuL2tleSc7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvcHJlZmVyLWRlZmF1bHQtZXhwb3J0XG5leHBvcnQgY2xhc3MgS2V5Ym9hcmQge1xuICBfYm9hcmQ7XG5cbiAgX2tleXM7XG5cbiAgX2FsdGVybmF0aXZlS2V5cztcblxuICBfaXNFbkxvY2FsZTtcblxuICBfcHJlc3NlZEtleXM7XG5cbiAgX2NhcHNMb2NrSXNPbjtcblxuICBfdGV4dGFyZWE7XG5cbiAgY29uc3RydWN0b3Ioa2V5cywgYWx0ZXJuYXRpdmVLZXlzLCB0ZXh0YXJlYSkge1xuICAgIHRoaXMuX3ByZXNzZWRLZXlzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuX2lzRW5Mb2NhbGUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbG9jYWxlJykgPT09ICdlbic7XG4gICAgdGhpcy5fa2V5cyA9IHt9O1xuICAgIHRoaXMuX2FsdGVybmF0aXZlS2V5cyA9IGFsdGVybmF0aXZlS2V5cztcbiAgICB0aGlzLl9ib2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuX2JvYXJkLmNsYXNzTmFtZSA9ICdrZXlib2FyZCc7XG4gICAgdGhpcy5fY2Fwc0xvY2tJc09uID0gZmFsc2U7XG4gICAgdGhpcy5fdGV4dGFyZWEgPSB0ZXh0YXJlYTtcblxuICAgIGtleXMuZm9yRWFjaCgocm93KSA9PiB7XG4gICAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgIGxpbmUuY2xhc3NOYW1lID0gJ2tleWJvYXJkX19yb3cnO1xuICAgICAgdGhpcy5fYm9hcmQuYXBwZW5kKGxpbmUpO1xuXG4gICAgICBmb3IgKGNvbnN0IGNvZGUgaW4gcm93KSB7XG4gICAgICAgIGNvbnN0IGJ1dHRvbiA9IG5ldyBLZXkoY29kZSwgcm93W2NvZGVdKTtcbiAgICAgICAgdGhpcy5fa2V5c1tjb2RlXSA9IGJ1dHRvbjtcbiAgICAgICAgaWYgKHRoaXMuX2FsdGVybmF0aXZlS2V5c1tjb2RlXSkge1xuICAgICAgICAgIHRoaXMuX2FsdGVybmF0aXZlS2V5c1tjb2RlXS5idXR0b24gPSBidXR0b247XG4gICAgICAgICAgYnV0dG9uLmFkZEFsdGVybmF0aXZlQ2hhcnModGhpcy5fYWx0ZXJuYXRpdmVLZXlzW2NvZGVdKTtcbiAgICAgICAgfVxuICAgICAgICBsaW5lLmFwcGVuZChidXR0b24uZ2V0RWxlbWVudCgpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIXRoaXMuX2lzRW5Mb2NhbGUpIHRoaXMuX3NldExvY2FsZSgpO1xuXG4gICAgdGhpcy5fYm9hcmQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5faGFuZGxlTW91c2VFdmVudCk7XG4gICAgdGhpcy5fYm9hcmQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCB0aGlzLl9oYW5kbGVNb3VzZUV2ZW50KTtcbiAgICB0aGlzLl9ib2FyZC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5faGFuZGxlTW91c2VFdmVudCk7XG5cbiAgICBjb25zdCBodG1sID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xuICAgIGh0bWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuX2hhbmRsZUtleWJvYXJkRXZlbnQpO1xuICAgIGh0bWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLl9oYW5kbGVLZXlib2FyZEV2ZW50KTtcbiAgfVxuXG4gIF9oYW5kbGVNb3VzZUV2ZW50ID0gKGV2ZW50KSA9PiB7XG4gICAgY29uc3Qgc3VwcG9ydEV2ZW50VHlwZXNVbnByZXNzZWQgPSBbJ21vdXNlZG93biddLmluY2x1ZGVzKGV2ZW50LnR5cGUpO1xuICAgIGNvbnN0IHN1cHBvcnRFdmVudFR5cGVzUHJlc3NlZCA9IFsnbW91c2V1cCddLmluY2x1ZGVzKGV2ZW50LnR5cGUpO1xuICAgIGNvbnN0IHVucHJlc3NlZEtleSA9ICgpID0+IGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2tleWJvYXJkX19rZXknKTtcbiAgICBjb25zdCBwcmVzc2VkS2V5ID0gKCkgPT4gZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygna2V5Ym9hcmRfX2tleV9wcmVzc2VkJyk7XG4gICAgaWYgKFxuICAgICAgKHVucHJlc3NlZEtleSgpICYmIHN1cHBvcnRFdmVudFR5cGVzVW5wcmVzc2VkKVxuICAgICAgfHwgKHByZXNzZWRLZXkoKSAmJiBzdXBwb3J0RXZlbnRUeXBlc1ByZXNzZWQpXG4gICAgKSB7XG4gICAgICBjb25zdCBoYW5kbGVLZXlib2FyZEV2ZW50ID0gKCkgPT4gdGhpcy5faGFuZGxlVmlydHVhbEtleWJvYXJkRXZlbnQoXG4gICAgICAgIGV2ZW50LFxuICAgICAgICAnbW91c2Vkb3duJyxcbiAgICAgICAgZXZlbnQudGFyZ2V0LmRhdGFzZXQuY29kZSxcbiAgICAgICAgZXZlbnQudGFyZ2V0LFxuICAgICAgKTtcbiAgICAgIGhhbmRsZUtleWJvYXJkRXZlbnQoKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAocHJlc3NlZEtleSgpKSB7XG4gICAgICAgICAgY29uc3QgcmVwZWF0ZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAocHJlc3NlZEtleSgpKSB7XG4gICAgICAgICAgICAgIGhhbmRsZUtleWJvYXJkRXZlbnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwocmVwZWF0ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIDMwKTtcbiAgICAgICAgfVxuICAgICAgfSwgMjAwKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9O1xuXG4gIF9oYW5kbGVLZXlib2FyZEV2ZW50ID0gKGV2ZW50KSA9PiB7XG4gICAgY29uc3Qgc3VwcG9ydEV2ZW50VHlwZXNVbnByZXNzZWQgPSBbJ2tleWRvd24nXS5pbmNsdWRlcyhldmVudC50eXBlKTtcbiAgICBjb25zdCBzdXBwb3J0RXZlbnRUeXBlc1ByZXNzZWQgPSBbJ2tleXVwJ10uaW5jbHVkZXMoZXZlbnQudHlwZSk7XG5cbiAgICBpZiAoXG4gICAgICB0aGlzLl9rZXlzW2V2ZW50LmNvZGVdXG4gICAgICAmJiAoc3VwcG9ydEV2ZW50VHlwZXNVbnByZXNzZWQgfHwgc3VwcG9ydEV2ZW50VHlwZXNQcmVzc2VkKVxuICAgICkge1xuICAgICAgdGhpcy5faGFuZGxlVmlydHVhbEtleWJvYXJkRXZlbnQoXG4gICAgICAgIGV2ZW50LFxuICAgICAgICAna2V5ZG93bicsXG4gICAgICAgIGV2ZW50LmNvZGUsXG4gICAgICAgIHRoaXMuX2tleXNbZXZlbnQuY29kZV0uZ2V0RWxlbWVudCgpLFxuICAgICAgKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGVEb3duIC0gZm9yIG1vdXNlRXZlbnQgXCJtb3VzZWRvd25cIiwgZm9yIGtleWJvYXJkIFwia2V5ZG93blwiXG4gICAqIEBwYXJhbSB7Kn0gY29kZSAgLSBrZXkga29kZSBmcm9tIGV2ZW50XG4gICAqIEBwYXJhbSB7Kn0gZXZlbnRUYXJnZXQgLSBkb20gZWxlbWVudCBvZiBrZXlzIGZvciBjaGFuZ2luZyBzdHlsZXNcbiAgICovXG4gIF9oYW5kbGVWaXJ0dWFsS2V5Ym9hcmRFdmVudCA9IChldmVudCwgZXZlbnRUeXBlRG93biwgY29kZSwgZXZlbnRUYXJnZXQpID0+IHtcbiAgICBjb25zdCBwcmVzc2VkRG93biA9IGV2ZW50LnR5cGUgPT09IGV2ZW50VHlwZURvd247XG4gICAgY29uc3QgcHJlc3NlZEtleUNsYXNzID0gJ2tleWJvYXJkX19rZXlfcHJlc3NlZCc7XG4gICAgY29uc3Qga2V5UHJvcHMgPSB0aGlzLl9rZXlzW2NvZGVdLmdldFByb3BlcnRpZXModGhpcy5faXNFbkxvY2FsZSk7XG4gICAgY29uc3Qgc2hpZnRQcmVzc2VkID0gZXZlbnQuc2hpZnRLZXlcbiAgICAgIHx8IHRoaXMuX3ByZXNzZWRLZXlzLmhhcygnU2hpZnRMZWZ0JylcbiAgICAgIHx8IHRoaXMuX3ByZXNzZWRLZXlzLmhhcygnU2hpZnRSaWdodCcpO1xuXG4gICAgaWYgKHByZXNzZWREb3duKSB7XG4gICAgICAvLyB0aGUgQWx0LCBDdHJsIGtleXMgc2hvdWxkIHdvcmsgYXMgb24gYSByZWFsIGtleWJvYXJkXG4gICAgICBpZiAoKHRoaXMuX3ByZXNzZWRLZXlzLmhhcygnQ29udHJvbExlZnQnKSAmJiAhdGhpcy5fcHJlc3NlZEtleXMuaGFzKCdBbHRMZWZ0JykpXG4gICAgICB8fCB0aGlzLl9wcmVzc2VkS2V5cy5oYXMoJ0NvbnRyb2xSaWdodCcpXG4gICAgICB8fCAodGhpcy5fcHJlc3NlZEtleXMuaGFzKCdBbHRMZWZ0JykgJiYgIXRoaXMuX3ByZXNzZWRLZXlzLmhhcygnQ29udHJvbExlZnQnKSlcbiAgICAgIHx8IHRoaXMuX3ByZXNzZWRLZXlzLmhhcygnQWx0UmlnaHQnKVxuICAgICAgfHwgdGhpcy5fcHJlc3NlZEtleXMuaGFzKCdNZXRhbExlZnQnKVxuICAgICAgfHwgdGhpcy5fcHJlc3NlZEtleXMuaGFzKCdNZXRhUmlnaHQnKVxuICAgICAgfHwgdGhpcy5fcHJlc3NlZEtleXMuaGFzKCdDYXBzTG9jaycpXG4gICAgICB8fCBjb2RlID09PSAnQXJyb3dMZWZ0J1xuICAgICAgfHwgY29kZSA9PT0gJ0Fycm93UmlnaHQnXG4gICAgICB8fCBjb2RlID09PSAnQXJyb3dVcCdcbiAgICAgIHx8IGNvZGUgPT09ICdBcnJvd0Rvd24nXG4gICAgICB8fCBjb2RlID09PSAnQmFja3NwYWNlJ1xuICAgICAgfHwgY29kZSA9PT0gJ0RlbGV0ZSdcbiAgICAgIHx8IGNvZGUgPT09ICdFbnRlcidcbiAgICAgICkge1xuICAgICAgICB0aGlzLl9wcmVzc2VkS2V5cy5hZGQoY29kZSk7XG4gICAgICAgIC8vIGNoYW5nZSBsb2NhbGUgaGFuZGxlclxuICAgICAgICBpZiAodGhpcy5fcHJlc3NlZEtleXMuc2l6ZSA+IDEpIHtcbiAgICAgICAgICBpZiAodGhpcy5fcHJlc3NlZEtleXMuaGFzKCdBbHRMZWZ0JykgJiYgdGhpcy5fcHJlc3NlZEtleXMuaGFzKCdDb250cm9sTGVmdCcpKSB7XG4gICAgICAgICAgICB0aGlzLl9pc0VuTG9jYWxlID0gIXRoaXMuX2lzRW5Mb2NhbGU7XG4gICAgICAgICAgICB0aGlzLl9zZXRMb2NhbGUoKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsb2NhbGUnLCB0aGlzLl9pc0VuTG9jYWxlID8gJ2VuJyA6ICcgcnUnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5fcHJlc3NlZEtleXMuYWRkKGNvZGUpO1xuICAgICAgZXZlbnRUYXJnZXQuY2xhc3NMaXN0LmFkZChwcmVzc2VkS2V5Q2xhc3MpO1xuXG4gICAgICBjb25zdCB2aXJ0dWFsS2V5ZG93bkV2ZW50ID0gbmV3IEtleWJvYXJkRXZlbnQoJ3ZpcnR1YWxLZXlkb3duJywge1xuICAgICAgICBrZXk6IGtleVByb3BzLmtleSxcbiAgICAgICAgY29kZSxcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgIH0pO1xuICAgICAgdmlydHVhbEtleWRvd25FdmVudC5zcGVjRGV0YWlscyA9IGtleVByb3BzO1xuICAgICAgdmlydHVhbEtleWRvd25FdmVudC5zcGVjRGV0YWlscy5zaGlmdFByZXNzZWQgPSBzaGlmdFByZXNzZWQ7XG5cbiAgICAgIHRoaXMuX3RleHRhcmVhLmRpc3BhdGNoRXZlbnQodmlydHVhbEtleWRvd25FdmVudCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9wcmVzc2VkS2V5cy5oYXMoY29kZSkpIHtcbiAgICAgIGV2ZW50VGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUocHJlc3NlZEtleUNsYXNzKTtcbiAgICAgIHRoaXMuX3ByZXNzZWRLZXlzLmRlbGV0ZShjb2RlKTtcbiAgICB9XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIC8vIGNoYW5nZSB2aWV3IGFsbCBrZXlzIHdoaWNoIGRlcGVuZHMgb2YgXCJzaGlmdFwiXG4gICAgaWYgKGtleVByb3BzLmtleSA9PT0gJ1NoaWZ0Jykge1xuICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5fYWx0ZXJuYXRpdmVLZXlzKSB7XG4gICAgICAgIHRoaXMuX2FsdGVybmF0aXZlS2V5c1trZXldLmJ1dHRvbi5zaGlmdChwcmVzc2VkRG93bik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY2hhbmdlIHZpZXcgYWxsIGtleXMgd2hpY2ggZGVwZW5kcyBvZiBcInNoaWZ0XCJcbiAgICBpZiAoa2V5UHJvcHMua2V5ID09PSAnQ2Fwc0xvY2snICYmIHByZXNzZWREb3duKSB7XG4gICAgICB0aGlzLl9jYXBzTG9ja0lzT24gPSAhdGhpcy5fY2Fwc0xvY2tJc09uO1xuICAgICAgZXZlbnRUYXJnZXQuY2xhc3NMaXN0W3RoaXMuX2NhcHNMb2NrSXNPbiA/ICdhZGQnIDogJ3JlbW92ZSddKFxuICAgICAgICAna2V5Ym9hcmRfX2tleV9saWdodGVkJyxcbiAgICAgICk7XG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLl9hbHRlcm5hdGl2ZUtleXMpIHtcbiAgICAgICAgdGhpcy5fYWx0ZXJuYXRpdmVLZXlzW2tleV0uYnV0dG9uLmNhcHNMb2NrKHRoaXMuX2NhcHNMb2NrSXNPbik7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIF9zZXRMb2NhbGUgPSAoKSA9PiB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5fYWx0ZXJuYXRpdmVLZXlzKSB7XG4gICAgICB0aGlzLl9hbHRlcm5hdGl2ZUtleXNba2V5XS5idXR0b24uc2V0TG9jYWxlKHRoaXMuX2lzRW5Mb2NhbGUpO1xuICAgIH1cbiAgfTtcblxuICBib2FyZCA9ICgpID0+IHRoaXMuX2JvYXJkO1xufVxuIiwiLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L3ByZWZlci1kZWZhdWx0LWV4cG9ydCAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZXJzY29yZS1kYW5nbGUgKi9cbmV4cG9ydCBjbGFzcyBUZXh0YXJlYSB7XG4gIF90ZXh0RmllbGQ7XG5cbiAgX3dyYXBwZXI7XG5cbiAgY29uc3RydWN0b3IoY29scywgcm93cywgY2xhc3NOYW1lKSB7XG4gICAgdGhpcy5fd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuX2luZm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgdGhpcy5fd3JhcHBlci5hcHBlbmQodGhpcy5faW5mbyk7XG5cbiAgICB0aGlzLl90ZXh0RmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuICAgIHRoaXMuX3RleHRGaWVsZC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgdGhpcy5fdGV4dEZpZWxkLmNvbHMgPSBjb2xzO1xuICAgIHRoaXMuX3RleHRGaWVsZC5yb3dzID0gcm93cztcbiAgICB0aGlzLl90ZXh0RmllbGQuYXV0b2ZvY3VzID0gdHJ1ZTtcbiAgICB0aGlzLl90ZXh0RmllbGQudmFsdWUgPSAnJztcblxuICAgIHRoaXMuX3dyYXBwZXIuYXBwZW5kKHRoaXMuX3RleHRGaWVsZCk7XG5cbiAgICB0aGlzLl93cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3ZpcnR1YWxLZXlkb3duJywgdGhpcy5faGFuZGxlcktleWRvd24pO1xuICAgIHRoaXMuX3dyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNvdXQnLCB0aGlzLmZvY3VzKTtcbiAgfVxuXG4gIGdldCA9ICgpID0+IHRoaXMuX3dyYXBwZXI7XG5cbiAgZm9jdXMgPSAoKSA9PiB7XG4gICAgdGhpcy5fdGV4dEZpZWxkLmZvY3VzKCk7XG4gIH07XG5cbiAgX2hhbmRsZXJLZXlkb3duID0gKGV2ZW50KSA9PiB7XG4gICAgY29uc3Qga2V5UHJvcHMgPSBldmVudC5zcGVjRGV0YWlscztcblxuICAgIGNvbnN0IHByaW50ZWRDaGFyID0gIWtleVByb3BzLnN5c3RlbSAmJiBrZXlQcm9wcy5zaGlmdFByZXNzZWQgJiYga2V5UHJvcHMud2l0aFNoaWZ0S2V5XG4gICAgICA/IGtleVByb3BzLndpdGhTaGlmdEtleVxuICAgICAgOiBrZXlQcm9wcy5rZXk7XG5cbiAgICBsZXQgaW5zZXJ0aW5nVGV4dDtcblxuICAgIHRoaXMuZm9jdXMoKTtcbiAgICBjb25zdCBzdGFydFBvcyA9IHRoaXMuX3RleHRGaWVsZC5zZWxlY3Rpb25TdGFydDtcbiAgICBjb25zdCBlbmRQb3MgPSB0aGlzLl90ZXh0RmllbGQuc2VsZWN0aW9uRW5kO1xuICAgIHN3aXRjaCAoa2V5UHJvcHMuY29kZSkge1xuICAgICAgY2FzZSAnU2hpZnRMZWZ0JzpcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdTaGlmdFJpZ2h0JzpcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdBbHRMZWZ0JzpcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdBbHRSaWdodCc6XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnQ29udHJvbExlZnQnOlxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0NvbnRyb2xSaWdodCc6XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnTWV0YUxlZnQnOlxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ01ldGFSaWdodCc6XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnVGFiJzpcbiAgICAgICAgaW5zZXJ0aW5nVGV4dCA9ICdcXHQnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ1NoaWZ0JzpcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpbnNlcnRpbmdUZXh0ID0gIWtleVByb3BzLnN5c3RlbSA/IHByaW50ZWRDaGFyIDogJyc7XG4gICAgfVxuXG4gICAgaWYgKGluc2VydGluZ1RleHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fdGV4dEZpZWxkLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnRQb3M7XG4gICAgICB0aGlzLl90ZXh0RmllbGQuc2VsZWN0aW9uRW5kID0gZW5kUG9zO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90ZXh0RmllbGQudmFsdWUgPSB0aGlzLl90ZXh0RmllbGQudmFsdWUuc3Vic3RyaW5nKDAsIHN0YXJ0UG9zKVxuICAgICAgICArIGluc2VydGluZ1RleHRcbiAgICAgICAgKyB0aGlzLl90ZXh0RmllbGQudmFsdWUuc3Vic3RyaW5nKGVuZFBvcywgdGhpcy5fdGV4dEZpZWxkLnZhbHVlLmxlbmd0aCk7XG4gICAgICB0aGlzLl90ZXh0RmllbGQuc2VsZWN0aW9uU3RhcnQgPSBzdGFydFBvcyArIGluc2VydGluZ1RleHQubGVuZ3RoO1xuICAgICAgdGhpcy5fdGV4dEZpZWxkLnNlbGVjdGlvbkVuZCA9IHN0YXJ0UG9zICsgaW5zZXJ0aW5nVGV4dC5sZW5ndGg7XG4gICAgfVxuICB9O1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvbmFtZWQgKi9cbmltcG9ydCAnLi9hc3NldHMvc3R5bGVzL21haW4uc2Nzcyc7XG5pbXBvcnQgeyBjYXB0aW9uIH0gZnJvbSAnLi9hc3NldHMvanMvY2FwdGlvbic7XG5pbXBvcnQgeyBUZXh0YXJlYSB9IGZyb20gJy4vYXNzZXRzL2pzL3RleHRhcmVhJztcbmltcG9ydCB7IEtleWJvYXJkIH0gZnJvbSAnLi9hc3NldHMvanMva2V5Ym9hcmQnO1xuaW1wb3J0IGtleXMgZnJvbSAnLi9hc3NldHMva2V5cy5qc29uJztcbmltcG9ydCBrZXlzUnUgZnJvbSAnLi9hc3NldHMva2V5cy1ydS5qc29uJztcblxuY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcblxuYm9keS5hcHBlbmQoY2FwdGlvbik7XG5cbmNvbnN0IHRleHRhcmVhID0gbmV3IFRleHRhcmVhKDEwMCwgMTAsICd0ZXh0LWZpZWxkJyk7XG5jb25zdCB0YSA9IHRleHRhcmVhLmdldCgpO1xuYm9keS5hcHBlbmQodGEpO1xuXG5jb25zdCBrZXlib2FyZCA9IG5ldyBLZXlib2FyZChrZXlzLCBrZXlzUnUsIHRhKTtcbmJvZHkuYXBwZW5kKGtleWJvYXJkLmJvYXJkKCkpO1xuXG5jb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xudGV4dC50ZXh0Q29udGVudCA9ICfQlNC70Y8g0L/QtdGA0LXQutC70Y7Rh9C10L3QuNGPINGP0LfRi9C60LA6INC70LXQstGLZSBjdHJsICsgYWx0JztcbmJvZHkuYXBwZW5kKHRleHQpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9