export class Key {
  _button //DOM element
  _props //
  _enLocale

  constructor(code, props) {
    this._props = props
    this._enLocale = true

    this._button = document.createElement("li")
    this._button.className = "keyboard__key"

    this._button.dataset.key = props.key
    this._button.dataset.code = code
    if (props.withShiftKey && props.withShiftKey !== props.key) {
      this._button.dataset.withShiftKey = props.withShiftKey
    } else {
      this._button.classList.add("keyboard__key_system")
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
}
