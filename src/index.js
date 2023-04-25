import "./assets/styles/main.scss"
import { caption } from "./assets/js/caption"
import { textarea } from "./assets/js/textarea"
import { keyboard } from "./assets/js/keyboard"

const body = document.querySelector("body")

body.append(caption)
body.append(textarea)
body.append(keyboard)

body.create
