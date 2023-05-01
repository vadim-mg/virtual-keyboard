/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */
export class Key {
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
