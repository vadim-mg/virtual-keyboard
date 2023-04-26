export class Key{
  _button

  constructor(code, props){
    this._button = document.createElement("li")
    this._button.className = "keyboard__key"

    this._button.dataset.key = props.key
    this._button.dataset.code = code
    if(props.withShiftKey && props.withShiftKey !== props.key){
      this._button.dataset.withShiftKey = props.withShiftKey
    }else{
      this._button.classList.add('keyboard__key_system')
    }

    this._button.textContent = props.name ? props.name : props.key
    if(props.width){
      this._button.style.width = props.width
    }

    return this._button
  }


  getElement = () => this._button
}