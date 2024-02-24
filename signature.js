const canvas = document.getElementById('signatureCanvas')
const ctx = canvas.getContext('2d')
let isDrawing = false
let strokeColor = '#000000'
const bgColorInput = document.getElementById('bgColor')
const transparentBgInput = document.getElementById('transparentBg')
const formatSelect = document.getElementById('format')
const downloadLink = document.getElementById('downloadLink')
const textColorInput = document.getElementById('textColor')
const signatureSizeInput = document.getElementById('signatureSize')

const signatures = []

canvas.addEventListener('mousedown', startDrawing)
canvas.addEventListener('mousemove', draw)
canvas.addEventListener('mouseup', stopDrawing)
canvas.addEventListener('mouseout', stopDrawing)

bgColorInput.addEventListener('input', updateCanvas)
transparentBgInput.addEventListener('change', updateCanvas)
formatSelect.addEventListener('change', updateCanvas)

function startDrawing(e) {
  isDrawing = true
  const { offsetX, offsetY } = e
  ctx.strokeStyle = strokeColor
  ctx.beginPath()
  ctx.moveTo(offsetX, offsetY)
  signatures.push({ x: offsetX, y: offsetY, color: strokeColor })
}

function draw(e) {
  if (!isDrawing) return
  const { offsetX, offsetY } = e
  ctx.lineTo(offsetX, offsetY)
  ctx.stroke()
  signatures.push({ x: offsetX, y: offsetY, color: strokeColor })
}

function stopDrawing() {
  isDrawing = false
}

function updateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  if (transparentBgInput.checked) {
    canvas.style.backgroundColor = 'transparent'
  } else {
    canvas.style.backgroundColor = bgColorInput.value
  }
  redrawSignatures()
}

function redrawSignatures() {
  for (const signature of signatures) {
    ctx.strokeStyle = signature.color
    ctx.beginPath()
    ctx.moveTo(signature.x, signature.y)
    ctx.lineTo(signature.x + 1, signature.y)
    ctx.stroke()
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  signatures.length = 0
  updateCanvas()
}

function saveSignature() {
  const format = formatSelect.value
  switch (format) {
    case 'svg':
      const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="${
        canvas.width
      }" height="${canvas.height}">
                         <foreignObject width="100%" height="100%">
                           <div xmlns="http://www.w3.org/1999/xhtml">
                             <img src="${canvas.toDataURL(
                               'image/png',
                               transparentBgInput.checked ? 0 : 1,
                             )}"/>
                           </div>
                         </foreignObject>
                       </svg>`
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml' })
      downloadLink.href = URL.createObjectURL(svgBlob)
      downloadLink.download = 'signature.svg'
      break
    case 'jpg':
      downloadLink.href = canvas.toDataURL('image/jpeg')
      downloadLink.download = 'signature.jpg'
      break
    case 'png':
      downloadLink.href = canvas.toDataURL(
        'image/png',
        transparentBgInput.checked ? 0 : 1,
      )
      downloadLink.download = 'signature.png'
      break
  }
}

textColorInput.addEventListener('input', function () {
  strokeColor = this.value
  for (const signature of signatures) {
    signature.color = strokeColor // Update color of pre-drawn signatures
  }
  updateCanvas()
})

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true
  ;[lastX, lastY] = [e.offsetX, e.offsetY]
  ctx.strokeStyle = strokeColor // Set font color
  ctx.lineWidth = lineWidth // Set initial line width
})

canvas.addEventListener('mousemove', draw)
canvas.addEventListener('mouseup', () => (isDrawing = false))
canvas.addEventListener('mouseout', () => (isDrawing = false))

signatureSizeInput.addEventListener('input', function () {
  lineWidth = parseInt(this.value) // Update the line width
})
