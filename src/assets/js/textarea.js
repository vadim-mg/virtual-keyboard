/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */
export class Textarea {
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
  };
}
