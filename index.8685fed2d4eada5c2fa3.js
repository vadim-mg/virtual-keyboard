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
      event.preventDefault();
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
      if (
        this._pressedKeys.has(code)
        && [
          'CapsLock',
          'ShiftLeft',
          'ShiftRight',
          'ControlLeft',
          'ControlRight',
          'MetaLeft',
          'MetaRight',
          'AltLeft',
          'AltRight',
        ].includes(code)
        && !(['ShiftLeft'].includes(code) && ['ShiftRight'].includes(code))
      ) {
        return; // don't need repeat this keys
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

    // change locale handler
    if (this._pressedKeys.size === 2) {
      if (this._pressedKeys.has('AltLeft') && this._pressedKeys.has('ControlLeft')) {
        this._isEnLocale = !this._isEnLocale;
        this._setLocale();
        localStorage.setItem('locale', this._isEnLocale ? 'en' : ' ru');
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
    this._info.textContent = 'info';
    this._wrapper.append(this._info);

    this._textField = document.createElement('textarea');
    this._textField.className = className;
    this._textField.cols = cols;
    this._textField.rows = rows;
    this._textField.autofocus = true;
    this._textField.value = '0123456789012345678901234567890123456789012345678901234567890123456789';

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
    let startPos = this._textField.selectionStart;
    let endPos = this._textField.selectionEnd;
    this._info.textContent = `
      startPos: ${startPos}
      endPos: ${endPos}
      `;

    let currentRow;

    switch (keyProps.code) {
      case 'ShiftLeft':
        break;
      case 'ShiftRight':
        break;
      case 'AltLeft':
        break;
      case 'AltRight':
        break;
      case 'Backspace':
        insertingText = '';
        if (startPos === endPos && startPos > 0) {
          startPos -= 1;
        }
        break;
      case 'Delete':
        insertingText = '';
        if (startPos === endPos && startPos < this._textField.value.length) {
          endPos += 1;
        }
        break;
      case 'ArrowLeft':
        if (startPos > 0) {
          startPos -= 1;
          if (!keyProps.shiftPressed) endPos = startPos;
        }
        break;
      case 'ArrowRight':
        if (startPos < this._textField.value.length) {
          endPos += 1;
          if (!keyProps.shiftPressed) startPos = endPos;
        }
        break;
      case 'ArrowUp':
        currentRow = Math.ceil(startPos / this._textField.cols);
        if (currentRow > 0) {
          startPos -= this._textField.cols;
          if (startPos < 0) startPos = 0;
          if (!keyProps.shiftPressed) endPos = startPos;
        }
        break;
      case 'ArrowDown':
        currentRow = Math.ceil(startPos / this._textField.cols);
        if (currentRow < Math.ceil(this._textField.value.length / this._textField.cols)) {
          endPos = startPos + this._textField.cols;
          if (!keyProps.shiftPressed) startPos = endPos;
        }
        break;
      case 'Enter':
        insertingText = '\n';
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

    this._info.textContent += ` |||||   
      selectionStart: ${this._textField.selectionStart}
      selectionEnd: ${this._textField.selectionEnd}
      cols: ${this._textField.cols}
      rows: ${this._textField.rows}
      `;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdCQUF3QjtBQUN4QixzQkFBc0I7QUFDdEIsY0FBYztBQUNkLGNBQWM7QUFDZDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztVQ2pJQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOQTtBQUNtQztBQUNXO0FBQ0U7QUFDQTtBQUNWO0FBQ0s7O0FBRTNDOztBQUVBLFlBQVksdURBQU87QUFDbkIscUJBQXFCLHlEQUFRO0FBQzdCO0FBQ0E7QUFDQSxxQkFBcUIseURBQVEsQ0FBQyw4Q0FBSSxFQUFFLGlEQUFNO0FBQzFDOztBQUVBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3ZpcnR1YWwta2V5Ym9hcmQvLi9zcmMvYXNzZXRzL3N0eWxlcy9tYWluLnNjc3M/NGZlZCIsIndlYnBhY2s6Ly92aXJ0dWFsLWtleWJvYXJkLy4vc3JjL2Fzc2V0cy9qcy9jYXB0aW9uLmpzIiwid2VicGFjazovL3ZpcnR1YWwta2V5Ym9hcmQvLi9zcmMvYXNzZXRzL2pzL2tleS5qcyIsIndlYnBhY2s6Ly92aXJ0dWFsLWtleWJvYXJkLy4vc3JjL2Fzc2V0cy9qcy9rZXlib2FyZC5qcyIsIndlYnBhY2s6Ly92aXJ0dWFsLWtleWJvYXJkLy4vc3JjL2Fzc2V0cy9qcy90ZXh0YXJlYS5qcyIsIndlYnBhY2s6Ly92aXJ0dWFsLWtleWJvYXJkL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3ZpcnR1YWwta2V5Ym9hcmQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3ZpcnR1YWwta2V5Ym9hcmQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly92aXJ0dWFsLWtleWJvYXJkL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdmlydHVhbC1rZXlib2FyZC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L3ByZWZlci1kZWZhdWx0LWV4cG9ydFxuZXhwb3J0IGNvbnN0IGNhcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpO1xuY2FwdGlvbi5pbm5lclRleHQgPSAnUlNTIFZpcnR1YWwgS2V5Ym9hcmQnO1xuY2FwdGlvbi5jbGFzc05hbWUgPSAnY2FwdGlvbic7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvcHJlZmVyLWRlZmF1bHQtZXhwb3J0ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlcnNjb3JlLWRhbmdsZSAqL1xuZXhwb3J0IGNsYXNzIEtleSB7XG4gIF9idXR0b247IC8vIERPTSBlbGVtZW50XG5cbiAgX3Byb3BzOyAvL1xuXG4gIF9lbkxvY2FsZTtcblxuICBfc3lzdGVtO1xuXG4gIF9jb2RlO1xuXG4gIF9pc0xldHRlcjtcblxuICBfaXNDYXBzTG9ja2VkO1xuXG4gIGNvbnN0cnVjdG9yKGNvZGUsIHByb3BzKSB7XG4gICAgdGhpcy5fcHJvcHMgPSBwcm9wcztcbiAgICB0aGlzLl9jb2RlID0gY29kZTtcbiAgICB0aGlzLl9lbkxvY2FsZSA9IHRydWU7XG4gICAgdGhpcy5faXNMZXR0ZXIgPSAvW2Etel0vLnRlc3QocHJvcHMua2V5KTtcbiAgICB0aGlzLl9pc0NhcHNMb2NrZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuX2J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgdGhpcy5fYnV0dG9uLmNsYXNzTmFtZSA9ICdrZXlib2FyZF9fa2V5JztcblxuICAgIHRoaXMuX2J1dHRvbi5kYXRhc2V0LmNvZGUgPSBjb2RlO1xuICAgIGlmICgocHJvcHMud2l0aFNoaWZ0S2V5ICYmIHByb3BzLndpdGhTaGlmdEtleSAhPT0gcHJvcHMua2V5KSB8fCBjb2RlID09PSAnU3BhY2UnKSB7XG4gICAgICB0aGlzLl9zeXN0ZW0gPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2tleWJvYXJkX19rZXlfc3lzdGVtJyk7XG4gICAgICB0aGlzLl9zeXN0ZW0gPSB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMuX2J1dHRvbi50ZXh0Q29udGVudCA9IHByb3BzLm5hbWUgPyBwcm9wcy5uYW1lIDogcHJvcHMua2V5O1xuXG4gICAgaWYgKHByb3BzLndpZHRoKSB7XG4gICAgICB0aGlzLl9idXR0b24uc3R5bGUud2lkdGggPSBwcm9wcy53aWR0aDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBwcmVzc2VkXG4gICAqL1xuICBzaGlmdCA9IChwcmVzc2VkID0gdHJ1ZSkgPT4ge1xuICAgIGlmICh0aGlzLl9wcm9wcy53aXRoU2hpZnRLZXkpIHtcbiAgICAgIHRoaXMucmVuZGVyKHByZXNzZWQpO1xuICAgIH1cbiAgfTtcblxuICBjYXBzTG9jayA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5faXNMZXR0ZXIpIHtcbiAgICAgIHRoaXMuX2lzQ2Fwc0xvY2tlZCA9ICF0aGlzLl9pc0NhcHNMb2NrZWQ7XG4gICAgICBjb25zdCBwID0gdGhpcy5fcHJvcHM7XG4gICAgICBjb25zdCBhcCA9IHRoaXMuX2FsdGVybmF0aXZlUHJvcHM7XG4gICAgICBbcC5rZXksIHAud2l0aFNoaWZ0S2V5XSA9IFtwLndpdGhTaGlmdEtleSwgcC5rZXldO1xuICAgICAgW2FwLmtleSwgYXAud2l0aFNoaWZ0S2V5XSA9IFthcC53aXRoU2hpZnRLZXksIGFwLmtleV07XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfTtcblxuICBzZXRMb2NhbGUgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuX3Byb3BzLndpdGhTaGlmdEtleSkge1xuICAgICAgdGhpcy5fZW5Mb2NhbGUgPSAhdGhpcy5fZW5Mb2NhbGU7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfTtcblxuICByZW5kZXIgPSAoc2hpZnRQcmVzc2VkID0gZmFsc2UpID0+IHtcbiAgICBjb25zdCBsb2NhdGVEZXBlbmRlbmNlID0gdGhpcy5fZW5Mb2NhbGUgPyAnX3Byb3BzJyA6ICdfYWx0ZXJuYXRpdmVQcm9wcyc7XG4gICAgY29uc3Qgc2hpZnREZXBlbmRlbmNlID0gc2hpZnRQcmVzc2VkID8gJ3dpdGhTaGlmdEtleScgOiAna2V5JztcbiAgICB0aGlzLl9idXR0b24udGV4dENvbnRlbnQgPSB0aGlzW2xvY2F0ZURlcGVuZGVuY2VdW3NoaWZ0RGVwZW5kZW5jZV07XG4gIH07XG5cbiAgYWRkQWx0ZXJuYXRpdmVDaGFycyA9ICh2YWwpID0+IHtcbiAgICB0aGlzLl9hbHRlcm5hdGl2ZVByb3BzID0gdmFsO1xuICB9O1xuXG4gIGdldEVsZW1lbnQgPSAoKSA9PiB0aGlzLl9idXR0b247XG5cbiAgZ2V0S2V5ID0gKCkgPT4gdGhpcy5fcHJvcHMua2V5O1xuXG4gIGdldFdpdGhTaGlmdEtleSA9ICgpID0+IHRoaXMuX3Byb3BzLndpdGhTaGlmdEtleTtcblxuICBnZXRQcm9wZXJ0aWVzID0gKGlzRW5Mb2NhbGUgPSB0cnVlKSA9PiAoe1xuICAgIGNvZGU6IHRoaXMuX2NvZGUsXG4gICAgc3lzdGVtOiB0aGlzLl9zeXN0ZW0sXG4gICAga2V5OiBpc0VuTG9jYWxlID8gdGhpcy5fcHJvcHMua2V5IDogdGhpcy5fYWx0ZXJuYXRpdmVQcm9wcz8ua2V5ID8/IHRoaXMuX3Byb3BzLmtleSxcbiAgICB3aXRoU2hpZnRLZXk6IGlzRW5Mb2NhbGVcbiAgICAgID8gdGhpcy5fcHJvcHMud2l0aFNoaWZ0S2V5XG4gICAgICA6IHRoaXMuX2FsdGVybmF0aXZlUHJvcHM/LndpdGhTaGlmdEtleSA/PyB0aGlzLl9wcm9wcy53aXRoU2hpZnRLZXksXG4gIH0pO1xufVxuIiwiLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L25hbWVkICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1yZXN0cmljdGVkLXN5bnRheCAqL1xuLyogZXNsaW50LWRpc2FibGUgZ3VhcmQtZm9yLWluICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlcnNjb3JlLWRhbmdsZSAqL1xuaW1wb3J0IHsgS2V5IH0gZnJvbSAnLi9rZXknO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L3ByZWZlci1kZWZhdWx0LWV4cG9ydFxuZXhwb3J0IGNsYXNzIEtleWJvYXJkIHtcbiAgX2JvYXJkO1xuXG4gIF9rZXlzO1xuXG4gIF9hbHRlcm5hdGl2ZUtleXM7XG5cbiAgX2lzRW5Mb2NhbGU7XG5cbiAgX3ByZXNzZWRLZXlzO1xuXG4gIF9jYXBzTG9ja0lzT247XG5cbiAgX3RleHRhcmVhO1xuXG4gIGNvbnN0cnVjdG9yKGtleXMsIGFsdGVybmF0aXZlS2V5cywgdGV4dGFyZWEpIHtcbiAgICB0aGlzLl9wcmVzc2VkS2V5cyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLl9pc0VuTG9jYWxlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xvY2FsZScpID09PSAnZW4nO1xuICAgIHRoaXMuX2tleXMgPSB7fTtcbiAgICB0aGlzLl9hbHRlcm5hdGl2ZUtleXMgPSBhbHRlcm5hdGl2ZUtleXM7XG4gICAgdGhpcy5fYm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLl9ib2FyZC5jbGFzc05hbWUgPSAna2V5Ym9hcmQnO1xuICAgIHRoaXMuX2NhcHNMb2NrSXNPbiA9IGZhbHNlO1xuICAgIHRoaXMuX3RleHRhcmVhID0gdGV4dGFyZWE7XG5cbiAgICBrZXlzLmZvckVhY2goKHJvdykgPT4ge1xuICAgICAgY29uc3QgbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICBsaW5lLmNsYXNzTmFtZSA9ICdrZXlib2FyZF9fcm93JztcbiAgICAgIHRoaXMuX2JvYXJkLmFwcGVuZChsaW5lKTtcblxuICAgICAgZm9yIChjb25zdCBjb2RlIGluIHJvdykge1xuICAgICAgICBjb25zdCBidXR0b24gPSBuZXcgS2V5KGNvZGUsIHJvd1tjb2RlXSk7XG4gICAgICAgIHRoaXMuX2tleXNbY29kZV0gPSBidXR0b247XG4gICAgICAgIGlmICh0aGlzLl9hbHRlcm5hdGl2ZUtleXNbY29kZV0pIHtcbiAgICAgICAgICB0aGlzLl9hbHRlcm5hdGl2ZUtleXNbY29kZV0uYnV0dG9uID0gYnV0dG9uO1xuICAgICAgICAgIGJ1dHRvbi5hZGRBbHRlcm5hdGl2ZUNoYXJzKHRoaXMuX2FsdGVybmF0aXZlS2V5c1tjb2RlXSk7XG4gICAgICAgIH1cbiAgICAgICAgbGluZS5hcHBlbmQoYnV0dG9uLmdldEVsZW1lbnQoKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCF0aGlzLl9pc0VuTG9jYWxlKSB0aGlzLl9zZXRMb2NhbGUoKTtcblxuICAgIHRoaXMuX2JvYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX2hhbmRsZU1vdXNlRXZlbnQpO1xuICAgIHRoaXMuX2JvYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgdGhpcy5faGFuZGxlTW91c2VFdmVudCk7XG4gICAgdGhpcy5fYm9hcmQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX2hhbmRsZU1vdXNlRXZlbnQpO1xuXG4gICAgY29uc3QgaHRtbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcbiAgICBodG1sLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLl9oYW5kbGVLZXlib2FyZEV2ZW50KTtcbiAgICBodG1sLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5faGFuZGxlS2V5Ym9hcmRFdmVudCk7XG4gIH1cblxuICBfaGFuZGxlTW91c2VFdmVudCA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IHN1cHBvcnRFdmVudFR5cGVzVW5wcmVzc2VkID0gWydtb3VzZWRvd24nXS5pbmNsdWRlcyhldmVudC50eXBlKTtcbiAgICBjb25zdCBzdXBwb3J0RXZlbnRUeXBlc1ByZXNzZWQgPSBbJ21vdXNldXAnXS5pbmNsdWRlcyhldmVudC50eXBlKTtcbiAgICBjb25zdCB1bnByZXNzZWRLZXkgPSAoKSA9PiBldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdrZXlib2FyZF9fa2V5Jyk7XG4gICAgY29uc3QgcHJlc3NlZEtleSA9ICgpID0+IGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2tleWJvYXJkX19rZXlfcHJlc3NlZCcpO1xuICAgIGlmIChcbiAgICAgICh1bnByZXNzZWRLZXkoKSAmJiBzdXBwb3J0RXZlbnRUeXBlc1VucHJlc3NlZClcbiAgICAgIHx8IChwcmVzc2VkS2V5KCkgJiYgc3VwcG9ydEV2ZW50VHlwZXNQcmVzc2VkKVxuICAgICkge1xuICAgICAgY29uc3QgaGFuZGxlS2V5Ym9hcmRFdmVudCA9ICgpID0+IHRoaXMuX2hhbmRsZVZpcnR1YWxLZXlib2FyZEV2ZW50KFxuICAgICAgICBldmVudCxcbiAgICAgICAgJ21vdXNlZG93bicsXG4gICAgICAgIGV2ZW50LnRhcmdldC5kYXRhc2V0LmNvZGUsXG4gICAgICAgIGV2ZW50LnRhcmdldCxcbiAgICAgICk7XG4gICAgICBoYW5kbGVLZXlib2FyZEV2ZW50KCk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKHByZXNzZWRLZXkoKSkge1xuICAgICAgICAgIGNvbnN0IHJlcGVhdGVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHByZXNzZWRLZXkoKSkge1xuICAgICAgICAgICAgICBoYW5kbGVLZXlib2FyZEV2ZW50KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjbGVhckludGVydmFsKHJlcGVhdGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCAzMCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDIwMCk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfTtcblxuICBfaGFuZGxlS2V5Ym9hcmRFdmVudCA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IHN1cHBvcnRFdmVudFR5cGVzVW5wcmVzc2VkID0gWydrZXlkb3duJ10uaW5jbHVkZXMoZXZlbnQudHlwZSk7XG4gICAgY29uc3Qgc3VwcG9ydEV2ZW50VHlwZXNQcmVzc2VkID0gWydrZXl1cCddLmluY2x1ZGVzKGV2ZW50LnR5cGUpO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5fa2V5c1tldmVudC5jb2RlXVxuICAgICAgJiYgKHN1cHBvcnRFdmVudFR5cGVzVW5wcmVzc2VkIHx8IHN1cHBvcnRFdmVudFR5cGVzUHJlc3NlZClcbiAgICApIHtcbiAgICAgIHRoaXMuX2hhbmRsZVZpcnR1YWxLZXlib2FyZEV2ZW50KFxuICAgICAgICBldmVudCxcbiAgICAgICAgJ2tleWRvd24nLFxuICAgICAgICBldmVudC5jb2RlLFxuICAgICAgICB0aGlzLl9rZXlzW2V2ZW50LmNvZGVdLmdldEVsZW1lbnQoKSxcbiAgICAgICk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZURvd24gLSBmb3IgbW91c2VFdmVudCBcIm1vdXNlZG93blwiLCBmb3Iga2V5Ym9hcmQgXCJrZXlkb3duXCJcbiAgICogQHBhcmFtIHsqfSBjb2RlICAtIGtleSBrb2RlIGZyb20gZXZlbnRcbiAgICogQHBhcmFtIHsqfSBldmVudFRhcmdldCAtIGRvbSBlbGVtZW50IG9mIGtleXMgZm9yIGNoYW5naW5nIHN0eWxlc1xuICAgKi9cbiAgX2hhbmRsZVZpcnR1YWxLZXlib2FyZEV2ZW50ID0gKGV2ZW50LCBldmVudFR5cGVEb3duLCBjb2RlLCBldmVudFRhcmdldCkgPT4ge1xuICAgIGNvbnN0IHByZXNzZWREb3duID0gZXZlbnQudHlwZSA9PT0gZXZlbnRUeXBlRG93bjtcbiAgICBjb25zdCBwcmVzc2VkS2V5Q2xhc3MgPSAna2V5Ym9hcmRfX2tleV9wcmVzc2VkJztcbiAgICBjb25zdCBrZXlQcm9wcyA9IHRoaXMuX2tleXNbY29kZV0uZ2V0UHJvcGVydGllcyh0aGlzLl9pc0VuTG9jYWxlKTtcbiAgICBjb25zdCBzaGlmdFByZXNzZWQgPSBldmVudC5zaGlmdEtleVxuICAgICAgfHwgdGhpcy5fcHJlc3NlZEtleXMuaGFzKCdTaGlmdExlZnQnKVxuICAgICAgfHwgdGhpcy5fcHJlc3NlZEtleXMuaGFzKCdTaGlmdFJpZ2h0Jyk7XG5cbiAgICBpZiAocHJlc3NlZERvd24pIHtcbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5fcHJlc3NlZEtleXMuaGFzKGNvZGUpXG4gICAgICAgICYmIFtcbiAgICAgICAgICAnQ2Fwc0xvY2snLFxuICAgICAgICAgICdTaGlmdExlZnQnLFxuICAgICAgICAgICdTaGlmdFJpZ2h0JyxcbiAgICAgICAgICAnQ29udHJvbExlZnQnLFxuICAgICAgICAgICdDb250cm9sUmlnaHQnLFxuICAgICAgICAgICdNZXRhTGVmdCcsXG4gICAgICAgICAgJ01ldGFSaWdodCcsXG4gICAgICAgICAgJ0FsdExlZnQnLFxuICAgICAgICAgICdBbHRSaWdodCcsXG4gICAgICAgIF0uaW5jbHVkZXMoY29kZSlcbiAgICAgICAgJiYgIShbJ1NoaWZ0TGVmdCddLmluY2x1ZGVzKGNvZGUpICYmIFsnU2hpZnRSaWdodCddLmluY2x1ZGVzKGNvZGUpKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybjsgLy8gZG9uJ3QgbmVlZCByZXBlYXQgdGhpcyBrZXlzXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3ByZXNzZWRLZXlzLmFkZChjb2RlKTtcbiAgICAgIGV2ZW50VGFyZ2V0LmNsYXNzTGlzdC5hZGQocHJlc3NlZEtleUNsYXNzKTtcblxuICAgICAgY29uc3QgdmlydHVhbEtleWRvd25FdmVudCA9IG5ldyBLZXlib2FyZEV2ZW50KCd2aXJ0dWFsS2V5ZG93bicsIHtcbiAgICAgICAga2V5OiBrZXlQcm9wcy5rZXksXG4gICAgICAgIGNvZGUsXG4gICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICB9KTtcbiAgICAgIHZpcnR1YWxLZXlkb3duRXZlbnQuc3BlY0RldGFpbHMgPSBrZXlQcm9wcztcbiAgICAgIHZpcnR1YWxLZXlkb3duRXZlbnQuc3BlY0RldGFpbHMuc2hpZnRQcmVzc2VkID0gc2hpZnRQcmVzc2VkO1xuXG4gICAgICB0aGlzLl90ZXh0YXJlYS5kaXNwYXRjaEV2ZW50KHZpcnR1YWxLZXlkb3duRXZlbnQpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fcHJlc3NlZEtleXMuaGFzKGNvZGUpKSB7XG4gICAgICBldmVudFRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKHByZXNzZWRLZXlDbGFzcyk7XG4gICAgICB0aGlzLl9wcmVzc2VkS2V5cy5kZWxldGUoY29kZSk7XG4gICAgfVxuXG4gICAgLy8gY2hhbmdlIHZpZXcgYWxsIGtleXMgd2hpY2ggZGVwZW5kcyBvZiBcInNoaWZ0XCJcbiAgICBpZiAoa2V5UHJvcHMua2V5ID09PSAnU2hpZnQnKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLl9hbHRlcm5hdGl2ZUtleXMpIHtcbiAgICAgICAgdGhpcy5fYWx0ZXJuYXRpdmVLZXlzW2tleV0uYnV0dG9uLnNoaWZ0KHByZXNzZWREb3duKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjaGFuZ2UgdmlldyBhbGwga2V5cyB3aGljaCBkZXBlbmRzIG9mIFwic2hpZnRcIlxuICAgIGlmIChrZXlQcm9wcy5rZXkgPT09ICdDYXBzTG9jaycgJiYgcHJlc3NlZERvd24pIHtcbiAgICAgIHRoaXMuX2NhcHNMb2NrSXNPbiA9ICF0aGlzLl9jYXBzTG9ja0lzT247XG4gICAgICBldmVudFRhcmdldC5jbGFzc0xpc3RbdGhpcy5fY2Fwc0xvY2tJc09uID8gJ2FkZCcgOiAncmVtb3ZlJ10oXG4gICAgICAgICdrZXlib2FyZF9fa2V5X2xpZ2h0ZWQnLFxuICAgICAgKTtcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuX2FsdGVybmF0aXZlS2V5cykge1xuICAgICAgICB0aGlzLl9hbHRlcm5hdGl2ZUtleXNba2V5XS5idXR0b24uY2Fwc0xvY2sodGhpcy5fY2Fwc0xvY2tJc09uKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjaGFuZ2UgbG9jYWxlIGhhbmRsZXJcbiAgICBpZiAodGhpcy5fcHJlc3NlZEtleXMuc2l6ZSA9PT0gMikge1xuICAgICAgaWYgKHRoaXMuX3ByZXNzZWRLZXlzLmhhcygnQWx0TGVmdCcpICYmIHRoaXMuX3ByZXNzZWRLZXlzLmhhcygnQ29udHJvbExlZnQnKSkge1xuICAgICAgICB0aGlzLl9pc0VuTG9jYWxlID0gIXRoaXMuX2lzRW5Mb2NhbGU7XG4gICAgICAgIHRoaXMuX3NldExvY2FsZSgpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbG9jYWxlJywgdGhpcy5faXNFbkxvY2FsZSA/ICdlbicgOiAnIHJ1Jyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIF9zZXRMb2NhbGUgPSAoKSA9PiB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5fYWx0ZXJuYXRpdmVLZXlzKSB7XG4gICAgICB0aGlzLl9hbHRlcm5hdGl2ZUtleXNba2V5XS5idXR0b24uc2V0TG9jYWxlKHRoaXMuX2lzRW5Mb2NhbGUpO1xuICAgIH1cbiAgfTtcblxuICBib2FyZCA9ICgpID0+IHRoaXMuX2JvYXJkO1xufVxuIiwiLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L3ByZWZlci1kZWZhdWx0LWV4cG9ydCAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZXJzY29yZS1kYW5nbGUgKi9cbmV4cG9ydCBjbGFzcyBUZXh0YXJlYSB7XG4gIF90ZXh0RmllbGQ7XG5cbiAgX3dyYXBwZXI7XG5cbiAgY29uc3RydWN0b3IoY29scywgcm93cywgY2xhc3NOYW1lKSB7XG4gICAgdGhpcy5fd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuX2luZm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgdGhpcy5faW5mby50ZXh0Q29udGVudCA9ICdpbmZvJztcbiAgICB0aGlzLl93cmFwcGVyLmFwcGVuZCh0aGlzLl9pbmZvKTtcblxuICAgIHRoaXMuX3RleHRGaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XG4gICAgdGhpcy5fdGV4dEZpZWxkLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcbiAgICB0aGlzLl90ZXh0RmllbGQuY29scyA9IGNvbHM7XG4gICAgdGhpcy5fdGV4dEZpZWxkLnJvd3MgPSByb3dzO1xuICAgIHRoaXMuX3RleHRGaWVsZC5hdXRvZm9jdXMgPSB0cnVlO1xuICAgIHRoaXMuX3RleHRGaWVsZC52YWx1ZSA9ICcwMTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5JztcblxuICAgIHRoaXMuX3dyYXBwZXIuYXBwZW5kKHRoaXMuX3RleHRGaWVsZCk7XG5cbiAgICB0aGlzLl93cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3ZpcnR1YWxLZXlkb3duJywgdGhpcy5faGFuZGxlcktleWRvd24pO1xuICAgIHRoaXMuX3dyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNvdXQnLCB0aGlzLmZvY3VzKTtcbiAgfVxuXG4gIGdldCA9ICgpID0+IHRoaXMuX3dyYXBwZXI7XG5cbiAgZm9jdXMgPSAoKSA9PiB7XG4gICAgdGhpcy5fdGV4dEZpZWxkLmZvY3VzKCk7XG4gIH07XG5cbiAgX2hhbmRsZXJLZXlkb3duID0gKGV2ZW50KSA9PiB7XG4gICAgY29uc3Qga2V5UHJvcHMgPSBldmVudC5zcGVjRGV0YWlscztcblxuICAgIGNvbnN0IHByaW50ZWRDaGFyID0gIWtleVByb3BzLnN5c3RlbSAmJiBrZXlQcm9wcy5zaGlmdFByZXNzZWQgJiYga2V5UHJvcHMud2l0aFNoaWZ0S2V5XG4gICAgICA/IGtleVByb3BzLndpdGhTaGlmdEtleVxuICAgICAgOiBrZXlQcm9wcy5rZXk7XG5cbiAgICBsZXQgaW5zZXJ0aW5nVGV4dDtcblxuICAgIHRoaXMuZm9jdXMoKTtcbiAgICBsZXQgc3RhcnRQb3MgPSB0aGlzLl90ZXh0RmllbGQuc2VsZWN0aW9uU3RhcnQ7XG4gICAgbGV0IGVuZFBvcyA9IHRoaXMuX3RleHRGaWVsZC5zZWxlY3Rpb25FbmQ7XG4gICAgdGhpcy5faW5mby50ZXh0Q29udGVudCA9IGBcbiAgICAgIHN0YXJ0UG9zOiAke3N0YXJ0UG9zfVxuICAgICAgZW5kUG9zOiAke2VuZFBvc31cbiAgICAgIGA7XG5cbiAgICBsZXQgY3VycmVudFJvdztcblxuICAgIHN3aXRjaCAoa2V5UHJvcHMuY29kZSkge1xuICAgICAgY2FzZSAnU2hpZnRMZWZ0JzpcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdTaGlmdFJpZ2h0JzpcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdBbHRMZWZ0JzpcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdBbHRSaWdodCc6XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnQmFja3NwYWNlJzpcbiAgICAgICAgaW5zZXJ0aW5nVGV4dCA9ICcnO1xuICAgICAgICBpZiAoc3RhcnRQb3MgPT09IGVuZFBvcyAmJiBzdGFydFBvcyA+IDApIHtcbiAgICAgICAgICBzdGFydFBvcyAtPSAxO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnRGVsZXRlJzpcbiAgICAgICAgaW5zZXJ0aW5nVGV4dCA9ICcnO1xuICAgICAgICBpZiAoc3RhcnRQb3MgPT09IGVuZFBvcyAmJiBzdGFydFBvcyA8IHRoaXMuX3RleHRGaWVsZC52YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICBlbmRQb3MgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XG4gICAgICAgIGlmIChzdGFydFBvcyA+IDApIHtcbiAgICAgICAgICBzdGFydFBvcyAtPSAxO1xuICAgICAgICAgIGlmICgha2V5UHJvcHMuc2hpZnRQcmVzc2VkKSBlbmRQb3MgPSBzdGFydFBvcztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0Fycm93UmlnaHQnOlxuICAgICAgICBpZiAoc3RhcnRQb3MgPCB0aGlzLl90ZXh0RmllbGQudmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgZW5kUG9zICs9IDE7XG4gICAgICAgICAgaWYgKCFrZXlQcm9wcy5zaGlmdFByZXNzZWQpIHN0YXJ0UG9zID0gZW5kUG9zO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnQXJyb3dVcCc6XG4gICAgICAgIGN1cnJlbnRSb3cgPSBNYXRoLmNlaWwoc3RhcnRQb3MgLyB0aGlzLl90ZXh0RmllbGQuY29scyk7XG4gICAgICAgIGlmIChjdXJyZW50Um93ID4gMCkge1xuICAgICAgICAgIHN0YXJ0UG9zIC09IHRoaXMuX3RleHRGaWVsZC5jb2xzO1xuICAgICAgICAgIGlmIChzdGFydFBvcyA8IDApIHN0YXJ0UG9zID0gMDtcbiAgICAgICAgICBpZiAoIWtleVByb3BzLnNoaWZ0UHJlc3NlZCkgZW5kUG9zID0gc3RhcnRQb3M7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdBcnJvd0Rvd24nOlxuICAgICAgICBjdXJyZW50Um93ID0gTWF0aC5jZWlsKHN0YXJ0UG9zIC8gdGhpcy5fdGV4dEZpZWxkLmNvbHMpO1xuICAgICAgICBpZiAoY3VycmVudFJvdyA8IE1hdGguY2VpbCh0aGlzLl90ZXh0RmllbGQudmFsdWUubGVuZ3RoIC8gdGhpcy5fdGV4dEZpZWxkLmNvbHMpKSB7XG4gICAgICAgICAgZW5kUG9zID0gc3RhcnRQb3MgKyB0aGlzLl90ZXh0RmllbGQuY29scztcbiAgICAgICAgICBpZiAoIWtleVByb3BzLnNoaWZ0UHJlc3NlZCkgc3RhcnRQb3MgPSBlbmRQb3M7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdFbnRlcic6XG4gICAgICAgIGluc2VydGluZ1RleHQgPSAnXFxuJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdUYWInOlxuICAgICAgICBpbnNlcnRpbmdUZXh0ID0gJ1xcdCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnU2hpZnQnOlxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGluc2VydGluZ1RleHQgPSAha2V5UHJvcHMuc3lzdGVtID8gcHJpbnRlZENoYXIgOiAnJztcbiAgICB9XG5cbiAgICBpZiAoaW5zZXJ0aW5nVGV4dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl90ZXh0RmllbGQuc2VsZWN0aW9uU3RhcnQgPSBzdGFydFBvcztcbiAgICAgIHRoaXMuX3RleHRGaWVsZC5zZWxlY3Rpb25FbmQgPSBlbmRQb3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3RleHRGaWVsZC52YWx1ZSA9IHRoaXMuX3RleHRGaWVsZC52YWx1ZS5zdWJzdHJpbmcoMCwgc3RhcnRQb3MpXG4gICAgICAgICsgaW5zZXJ0aW5nVGV4dFxuICAgICAgICArIHRoaXMuX3RleHRGaWVsZC52YWx1ZS5zdWJzdHJpbmcoZW5kUG9zLCB0aGlzLl90ZXh0RmllbGQudmFsdWUubGVuZ3RoKTtcbiAgICAgIHRoaXMuX3RleHRGaWVsZC5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0UG9zICsgaW5zZXJ0aW5nVGV4dC5sZW5ndGg7XG4gICAgICB0aGlzLl90ZXh0RmllbGQuc2VsZWN0aW9uRW5kID0gc3RhcnRQb3MgKyBpbnNlcnRpbmdUZXh0Lmxlbmd0aDtcbiAgICB9XG5cbiAgICB0aGlzLl9pbmZvLnRleHRDb250ZW50ICs9IGAgfHx8fHwgICBcbiAgICAgIHNlbGVjdGlvblN0YXJ0OiAke3RoaXMuX3RleHRGaWVsZC5zZWxlY3Rpb25TdGFydH1cbiAgICAgIHNlbGVjdGlvbkVuZDogJHt0aGlzLl90ZXh0RmllbGQuc2VsZWN0aW9uRW5kfVxuICAgICAgY29sczogJHt0aGlzLl90ZXh0RmllbGQuY29sc31cbiAgICAgIHJvd3M6ICR7dGhpcy5fdGV4dEZpZWxkLnJvd3N9XG4gICAgICBgO1xuICB9O1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvbmFtZWQgKi9cbmltcG9ydCAnLi9hc3NldHMvc3R5bGVzL21haW4uc2Nzcyc7XG5pbXBvcnQgeyBjYXB0aW9uIH0gZnJvbSAnLi9hc3NldHMvanMvY2FwdGlvbic7XG5pbXBvcnQgeyBUZXh0YXJlYSB9IGZyb20gJy4vYXNzZXRzL2pzL3RleHRhcmVhJztcbmltcG9ydCB7IEtleWJvYXJkIH0gZnJvbSAnLi9hc3NldHMvanMva2V5Ym9hcmQnO1xuaW1wb3J0IGtleXMgZnJvbSAnLi9hc3NldHMva2V5cy5qc29uJztcbmltcG9ydCBrZXlzUnUgZnJvbSAnLi9hc3NldHMva2V5cy1ydS5qc29uJztcblxuY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcblxuYm9keS5hcHBlbmQoY2FwdGlvbik7XG5jb25zdCB0ZXh0YXJlYSA9IG5ldyBUZXh0YXJlYSgxMDAsIDEwLCAndGV4dC1maWVsZCcpO1xuY29uc3QgdGEgPSB0ZXh0YXJlYS5nZXQoKTtcbmJvZHkuYXBwZW5kKHRhKTtcbmNvbnN0IGtleWJvYXJkID0gbmV3IEtleWJvYXJkKGtleXMsIGtleXNSdSwgdGEpO1xuYm9keS5hcHBlbmQoa2V5Ym9hcmQuYm9hcmQoKSk7XG5cbmNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG50ZXh0LnRleHRDb250ZW50ID0gJ9CU0LvRjyDQv9C10YDQtdC60LvRjtGH0LXQvdC40Y8g0Y/Qt9GL0LrQsDog0LvQtdCy0YtlIGN0cmwgKyBhbHQnO1xuYm9keS5hcHBlbmQodGV4dCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=