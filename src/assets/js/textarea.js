export class Textarea {
  _textField
  _wrapper

  constructor(cols, rows, className) {
    this._wrapper = document.createElement("div")
    this._info = document.createElement("p")
    this._info.textContent = "info"
    this._wrapper.append(this._info)

    this._textField = document.createElement("textarea")
    this._textField.className = className
    this._textField.cols = cols
    this._textField.rows = rows
    this._textField.autofocus = true
    this._textField.value =
      "0123456789012345678901234567890123456789012345678901234567890123456789"

    this._wrapper.append(this._textField)

    this._wrapper.addEventListener("virtualKeydown", this._handlerKeydown)
    this._wrapper.addEventListener("focusout", this.focus)

    return this._wrapper
  }

  focus = () => {
    this._textField.focus()
  }

  _handlerKeydown = (event) => {
    const keyProps = event.specDetails

    console.log("-----------------------------------------------")
    console.log(keyProps)
    console.dir(event)
    console.dir(event.target)

    const printedChar =
      !keyProps.system && keyProps.shiftPressed && keyProps.withShiftKey
        ? keyProps.withShiftKey
        : keyProps.key

    let insertingText

    console.log(`insertingText: ${insertingText}`)

    this.focus()
    let startPos = this._textField.selectionStart
    let endPos = this._textField.selectionEnd
    this._info.textContent = `
      startPos: ${startPos}
      endPos: ${endPos}
      `

    let currentRow

    switch (keyProps.code) {
      case "ShiftLeft":
        console.log('ShiftLeft')
        break
      case "ShiftRight":
        console.log('ShiftRight')
        break
      case "AltLeft":
        console.log('AltLeft')
        break
      case "ShiftLeft":
        console.log('ShiftLeft')
        // if (startPos === endPos && startPos > 0) {
        //   startPos--
        // }
        return
        break
      case "Backspace":
        insertingText = ""
        if (startPos === endPos && startPos > 0) {
          startPos--
        }
        break
      case "Delete":
        insertingText = ""
        if (startPos === endPos && startPos < this._textField.value.length) {
          endPos++
        }
        break
      case "ArrowLeft":
        if (startPos > 0) {
          startPos--
          if (!keyProps.shiftPressed) endPos = startPos
        }
        break
      case "ArrowRight":
        if (startPos < this._textField.value.length) {
          endPos++
          if (!keyProps.shiftPressed) startPos = endPos
        }
        break
      case "ArrowUp":
        currentRow = Math.ceil(startPos / this._textField.cols)
        if (currentRow > 0) {
          startPos = startPos - this._textField.cols
          if (startPos < 0) startPos = 0
          if (!keyProps.shiftPressed) endPos = startPos
        }
        break
      case "ArrowDown":
        currentRow = Math.ceil(startPos / this._textField.cols)
        if (currentRow < Math.ceil(this._textField.value.length / this._textField.cols)) {
          endPos = startPos + this._textField.cols
          if (!keyProps.shiftPressed) startPos = endPos
        }
        break
      case "Enter":
        insertingText = "\n"
        break
      case "Tab":
        insertingText = "\t"
        break
      case "Shift":
        break
      default:
        insertingText = !keyProps.system ? printedChar : ""
    }

    if (insertingText === undefined) {
      this._textField.selectionStart = startPos
      this._textField.selectionEnd = endPos
    } else {
      this._textField.value =
        this._textField.value.substring(0, startPos) +
        insertingText +
        this._textField.value.substring(endPos, this._textField.value.length)
      this._textField.selectionStart = this._textField.selectionEnd =
        startPos + insertingText.length
    }
    console.log('zasada')

    this._info.textContent += ` |||||   
      selectionStart: ${this._textField.selectionStart}
      selectionEnd: ${this._textField.selectionEnd}
      cols: ${this._textField.cols}
      rows: ${this._textField.rows}
      `
  }
}

/* YOu can click all physical keyboard and then copy json from console */
// textarea.addEventListener("keydown", (event) => {
//   if (event.repeat) return

//   if (!rowKeys[event.code]) {
//     rowKeys[event.code] = {}
//     number++
//   }

//   if (event.shiftKey) {
//     rowKeys[event.code].withShiftKey = event.key
//   } else {
//     rowKeys[event.code].key = event.key
//   }
//   console.log(JSON.stringify(rowKeys))
// })
