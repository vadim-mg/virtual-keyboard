import "./assets/styles/main.scss"
import { caption } from "./assets/js/caption"
import { textarea } from "./assets/js/textarea"
import { Keyboard } from "./assets/js/keyboard"
import keys from "./assets/keys.json"
import keysRu from "./assets/keys-ru.json"

const body = document.querySelector("body")

body.append(caption)
body.append(textarea)
const keyboard = new Keyboard(keys, keysRu)
body.append(keyboard.board())

const text = document.createElement("p")
text.textContent = "Для переключения языка: левыe ctrl + alt"
body.append(text)