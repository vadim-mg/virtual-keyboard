export const textarea = document.createElement("textarea")
textarea.className = "text-field"
textarea.cols = 100
textarea.rows = 10
textarea.addEventListener('keydown', (event) => {
  console.log(event.code)
  console.log(event)
}) 