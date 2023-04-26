import { Key } from "./key"

export class Keyboard {
  _board
  _keys
  _alternativeKeys
  _enLocale
  _pressedKeys

  constructor(keys, alternativeKeys) {
    this._pressedKeys = new Set()
    this._enLocale = true
    this._keys = {}
    this._alternativeKeys = alternativeKeys
    this._board = document.createElement("div")
    this._board.className = "keyboard"

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




    this._board.addEventListener("mousedown", this.handleMouseEvent)
    this._board.addEventListener("mouseout", this.handleMouseEvent)
    this._board.addEventListener("mouseup", this.handleMouseEvent)

    window.addEventListener("keydown", this.handleKeyboardEvent)
    window.addEventListener("keyup", this.handleKeyboardEvent)
  }

  handleMouseEvent = (event) => {
    const supportEventTypes = ["mousedown", "mouseup", "mouseout"]
    
    if (
      event.target.classList.contains("keyboard__key") &&
      supportEventTypes.includes(event.type)
    ) {
      this._handleVirtualKeyboardEvent(
        event.type,
        "mousedown",
        event.target.dataset.code,
        event.target,
        event.target.dataset.key
      )
    }
  }

  handleKeyboardEvent = (event) => {
    const supportEventTypes = ["keydown", "keyup"]

    if (
      !event.repeat &&
      this._keys[event.code] &&
      supportEventTypes.includes(event.type)
    ) {
      this._handleVirtualKeyboardEvent(
        event.type,
        "keydown",
        event.code,
        this._keys[event.code].getElement(),
        event.key
      )
    }
  }

  /**
   * 
   * @param {string} eventType - type of event
   * @param {string} eventTypeDown - for mouseEvent "mousedown", for keyboard "keydown"
   * @param {*} code  - key kode from event
   * @param {*} eventTarget - dom element of keys for changing styles
   * @param {*} eventKey - key from event
   */
  _handleVirtualKeyboardEvent = (
    eventType,
    eventTypeDown,
    code,
    eventTarget,
    eventKey
  ) => {
    const pressedDown = eventType === eventTypeDown
    const pressedKeyClass = "keyboard__key_pressed"

    if (pressedDown) {
      this._pressedKeys.add(code)
      eventTarget.classList.add(pressedKeyClass)
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
        for (let key in this._alternativeKeys) {
          this._alternativeKeys[key].button.setLocale(this._enLocale)
        }
      }
    }
  }

  board = () => {
    return this._board
  }
}
