const generateBtn =
  document.getElementById('generateBtn')

const preview =
  document.getElementById('preview')

const downloadBtn =
  document.getElementById('downloadBtn')

generateBtn.addEventListener(
  'click',
  async () => {

    const script =
      document
        .getElementById('scriptInput')
        .value

    if (!script) {

      alert('台本を入力してください')

      return

    }

    generateBtn.innerText =
      '生成中...'

    const scenes =
      splitScenes(script)

    const images =
      await fetchImages(scenes)

    const videoBlob =
      await generateFakeVideo(
        scenes,
        images
      )

    const url =
      URL.createObjectURL(videoBlob)

    preview.src = url

    downloadBtn.href = url

    generateBtn.innerText =
      '動画生成'

  }
)

function splitScenes(script) {

  return script
    .split('\n')
    .map(v => v.trim())
    .filter(Boolean)

}

async function fetchImages(scenes) {

  const result = []

  for (const scene of scenes) {

    const image =
      `https://picsum.photos/1080/1920?random=${Math.random()}`

    result.push(image)

  }

  return result

}

async function generateFakeVideo(
  scenes,
  images
) {

  const canvas =
    document.createElement('canvas')

  canvas.width = 1080
  canvas.height = 1920

  const ctx =
    canvas.getContext('2d')

  const img =
    await loadImage(images[0])

  ctx.drawImage(
    img,
    0,
    0,
    1080,
    1920
  )

  ctx.fillStyle =
    'rgba(0,0,0,0.4)'

  ctx.fillRect(
    0,
    0,
    1080,
    1920
  )

  ctx.fillStyle =
    'white'

  ctx.font =
    'bold 80px sans-serif'

  ctx.strokeStyle =
    'black'

  ctx.lineWidth = 8

  ctx.strokeText(
    scenes[0],
    100,
    1400
  )

  ctx.fillText(
    scenes[0],
    100,
    1400
  )

  const blob =
    await canvasToBlob(canvas)

  return blob

}

function loadImage(src) {

  return new Promise(resolve => {

    const img = new Image()

    img.crossOrigin =
      'anonymous'

    img.src = src

    img.onload =
      () => resolve(img)

  })

}

function canvasToBlob(canvas) {

  return new Promise(resolve => {

    canvas.toBlob(resolve)

  })

}
