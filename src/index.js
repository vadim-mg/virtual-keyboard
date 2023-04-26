import "./assets/styles/main.scss"
import { caption } from "./assets/js/caption"
import { textarea } from "./assets/js/textarea"
import { Keyboard } from "./assets/js/keyboard"
import primaryKeys from "./assets/keys.json"

const body = document.querySelector("body")

body.append(caption)
body.append(textarea)
body.append(new Keyboard(primaryKeys).board)
