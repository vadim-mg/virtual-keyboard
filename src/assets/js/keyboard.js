/* eslint-disable import/named */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-underscore-dangle */
import { Key } from './key';

// eslint-disable-next-line import/prefer-default-export
export class Keyboard {
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
        const button = new Key(code, row[code]);
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
