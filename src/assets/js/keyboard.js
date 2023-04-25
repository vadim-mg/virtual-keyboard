const keys = [
  [
    {
      key: "q",
      code: "KeyQ",
    },
    {
      key: "r",
      code: "KeyR",
    },
  ],
  [
    {
      key: "A",
      code: "KeyA",
    },
    {
      key: "c",
      code: "KeyC",
    },
  ],
]

export const keyboard = document.createElement("div")
keyboard.className = "keyboard"

keys.forEach((row) => {
  const line = document.createElement("ul")
  line.className = "keyboard__row"
  keyboard.append(line)
  row.forEach((key) => {
    const button = document.createElement("li")
    button.className = "keyboard__key"
    button.textContent = key.key
    line.append(button)
  })
})
