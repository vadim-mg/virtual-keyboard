export class Key {
  _button //DOM element
  _props //
  _enLocale
  _system
  _code

  constructor(code, props) {
    this._props = props
    this._code = code
    this._enLocale = true

    this._button = document.createElement("li")
    this._button.className = "keyboard__key"

    this._button.dataset.code = code
    if (props.withShiftKey && props.withShiftKey !== props.key || code === 'Space') {
      this._system = false
    } else {
      this._button.classList.add("keyboard__key_system")
      this._system = true
    }

    this._button.textContent = props.name ? props.name : props.key

    if (props.width) {
      this._button.style.width = props.width
    }
  }

  pressShift = (pressed = true) => {
    if (this._props.withShiftKey) {
      this.render(pressed)
    }
  }

  setLocale = (enLocale = true) => {
    if (this._props.withShiftKey) {
      this._enLocale = !this._enLocale
      this.render()
    }
  }

  render = (shiftPressed = false) => {
    const locateDependence = this._enLocale ? '_props' : '_alternativeProps'
    const shiftDependence = shiftPressed ? 'withShiftKey' : 'key'
    this._button.textContent = this[locateDependence][shiftDependence]
  }

  addAlternativeChars = (val) => {
    this._alternativeProps = val
  }

  getElement = () => this._button

  getKey = () => this._props.key

  getWithShiftKey = () => this._props.withShiftKey

  getProperties = () => ({
    code: this._code,
    system: this._system,
    key: this._props.key,
    withShiftKey: this._props.withShiftKey,
    alternativeKey: this._alternativeProps?.key,
    alternativeWithShiftKey:  this._alternativeProps?.withShiftKey,
  })
}
