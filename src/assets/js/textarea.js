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
    this._textField.value = '';

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
    const startPos = this._textField.selectionStart;
    const endPos = this._textField.selectionEnd;
    switch (keyProps.code) {
      case 'ShiftLeft':
        break;
      case 'ShiftRight':
        break;
      case 'AltLeft':
        break;
      case 'AltRight':
        break;
      case 'ControlLeft':
        break;
      case 'ControlRight':
        break;
      case 'MetaLeft':
        break;
      case 'MetaRight':
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
