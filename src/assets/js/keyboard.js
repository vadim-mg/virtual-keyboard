import { Key } from "./key"

export class Keyboard {
  _board
  _keys
  _alternativeKeys
  _enLocale
  _pressedKeys
  _capslockIsOn
  _textarea

  constructor(keys, alternativeKeys, textarea) {
    this._pressedKeys = new Set()
    this._enLocale = localStorage.getItem("locale") === "en" ? true : false
    this._keys = {}
    this._alternativeKeys = alternativeKeys
    this._board = document.createElement("div")
    this._board.className = "keyboard"
    this.capslockIsOn = false
    this._textarea = textarea

    keys.forEach((row) => {
      const line = document.createElement("ul")
      line.className = "keyboard__row"
      this._board.append(line)

      for (let code in row) {
        const button = new Key(code, row[code])
        this._keys[code] = button
        if (this._alternativeKeys[code]) {
          this._alternativeKeys[code].button = button
          button.addAlternativeChars(this._alternativeKeys[code])
        }
        line.append(button.getElement())
      }
    })
    console.log(this._keys) 
    if (!this._enLocale) this._setLocale()

    this._board.addEventListener("mousedown", this.handleMouseEvent)
    this._board.addEventListener("mouseout", this.handleMouseEvent)
    this._board.addEventListener("mouseup", this.handleMouseEvent)

    window.addEventListener("keydown", this.handleKeyboardEvent)
    window.addEventListener("keyup", this.handleKeyboardEvent)
  }

  handleMouseEvent = (event) => {
    const supportEventTypesUnpressed = ["mousedown"]
    const supportEventTypesPressed = ["mouseup", "mouseout"]
    if (
      (event.target.classList.contains("keyboard__key") &&
        supportEventTypesUnpressed.includes(event.type)) ||
      (event.target.classList.contains("keyboard__key_pressed") &&
        supportEventTypesPressed.includes(event.type))
    ) {
      this._handleVirtualKeyboardEvent(
        event,
        "mousedown",
        event.target.dataset.code,
        event.target
      )
    }
    event.preventDefault()
  }

  handleKeyboardEvent = (event) => {
    const supportEventTypes = ["keydown", "keyup"]

    if (
      !event.repeat &&
      this._keys[event.code] &&
      supportEventTypes.includes(event.type)
    ) {
      this._handleVirtualKeyboardEvent(
        event,
        "keydown",
        event.code,
        this._keys[event.code].getElement()
      )
    }
  }

  /**
   *
   * @param {Event} event
   * @param {string} eventTypeDown - for mouseEvent "mousedown", for keyboard "keydown"
   * @param {*} code  - key kode from event
   * @param {*} eventTarget - dom element of keys for changing styles
   */
  _handleVirtualKeyboardEvent = (event, eventTypeDown, code, eventTarget) => {
    const pressedDown = event.type === eventTypeDown
    const pressedKeyClass = "keyboard__key_pressed"
    const eventKey = this._keys[code].getProperties().key

    if (pressedDown) {
      this._pressedKeys.add(code)
      eventTarget.classList.add(pressedKeyClass)

      const virtualKeydownEvent = new KeyboardEvent("virtualKeydown", {
        key: eventKey,
        code: code,
        bubbles: true,
        // "composed": true,
        // "cancelable": true
      })
      virtualKeydownEvent.specDetails = this._keys[code].getProperties()

      this._textarea.dispatchEvent(virtualKeydownEvent)
    } else {
      this._pressedKeys.delete(code)
      eventTarget.classList.remove(pressedKeyClass)
    }

    //change view all keys which depends of "shift"
    if (eventKey === "Shift") {
      for (let key in this._alternativeKeys) {
        this._alternativeKeys[key].button.pressShift(pressedDown)
      }
    }

    //change locale handler
    if (this._pressedKeys.size === 2) {
      if (this._pressedKeys.has("AltLeft") && this._pressedKeys.has("ControlLeft")) {
        this._enLocale = !this._enLocale
        this._setLocale()
        localStorage.setItem("locale", this._enLocale ? "en" : " ru")
      }
    }
  }

  _setLocale = () => {
    for (let key in this._alternativeKeys) {
      this._alternativeKeys[key].button.setLocale(this._enLocale)
    }
  }

  board = () => {
    return this._board
  }
}
