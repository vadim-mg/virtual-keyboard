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

    this._wrapper.append(this._textField)

    this._wrapper.addEventListener("keydown", (event) => event.preventDefault())
    this._wrapper.addEventListener("virtualKeydown", this._handlerKeydown)
    this._wrapper.addEventListener("focusout", this.focus)

    return this._wrapper
  }

  focus = () => {
    this._textField.focus()
  }

  _handlerKeydown = (event) => {
    if (event.isTrusted) event.preventDefault()

    const keyProps = event.specDetails

    console.log("-----------------------------------------------")
    console.log(keyProps)
    console.dir(event.target)

    const insertingText = !keyProps.system ? keyProps.key : ""

    this.focus()
    const startPos = this._textField.selectionStart
    const endPos = this._textField.selectionEnd
    this._info.textContent = `
      startPos: ${startPos}
      endPos: ${endPos}
      `

    this._textField.value =
      this._textField.value.substring(0, startPos) +
      insertingText +
      this._textField.value.substring(endPos, this._textField.value.length)
    this._textField.selectionStart = this._textField.selectionEnd =
      startPos + insertingText.length

    this._info.textContent += ` |||||   
      selectionStart: ${this._textField.selectionStart}
      selectionEnd: ${this._textField.selectionEnd}
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
