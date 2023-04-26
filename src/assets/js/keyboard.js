import { Key } from "./key"

export class Keyboard {
  board

  constructor(keys) {
    // console.log(keys)
    this.board = document.createElement("div")
    this.board.className = "keyboard"

    keys.forEach((row) => {
      const line = document.createElement("ul")
      line.className = "keyboard__row"
      this.board.append(line)
      // console.log(row)

      for (let code in row) {
        const button = new Key(code, row[code])
        line.append(button)
      }
    })
  }
}

