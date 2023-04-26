export const textarea = document.createElement("textarea")
textarea.className = "text-field"
textarea.cols = 100
textarea.rows = 10
const rowKeys = {}
let number = 0
const keysArray = []


textarea.addEventListener("keydown", (event) => {
})

/* YOu can click all phisical keyboard and then copy json from console */
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


