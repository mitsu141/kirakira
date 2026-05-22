import {
  createFFmpeg,
  fetchFile
} from 'https://unpkg.com/@ffmpeg/ffmpeg@0.12.6/dist/ffmpeg.min.js'

import {
  searchImage
} from './api/image.js'

const ffmpeg = createFFmpeg({
  log: true,
})

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
      await generateVideo(
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
      await searchImage(scene)

    result.push(image)

  }

  return result

}

async function generateVideo(
  scenes,
  images
) {

  if (!ffmpeg.isLoaded()) {

    await ffmpeg.load()

  }

  const canvas =
    document.createElement('canvas')

  canvas.width = 1080
  canvas.height = 1920

  const ctx =
    canvas.getContext('2d')

  const frames = []

  for (let i = 0; i < scenes.length; i++) {

    const img =
      await loadImage(images[i])

    ctx.clearRect(
      0,
      0,
      1080,
      1920
    )

    ctx.drawImage(
      img,
      0,
      0,
      1080,
      1920
    )

    drawDarkOverlay(ctx)

    drawSubtitle(
      ctx,
      scenes[i]
    )

    const blob =
      await canvasToBlob(canvas)

    frames.push(blob)

  }

  for (let i = 0; i < frames.length; i++) {

    ffmpeg.FS(
      'writeFile',
      `frame${i}.png`,
      await fetchFile(frames[i])
    )

  }

  await ffmpeg.run(
    '-framerate', '1',
    '-i', 'frame%d.png',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    'output.mp4'
  )

  const data =
    ffmpeg.FS(
      'readFile',
      'output.mp4'
    )

  return new Blob(
    [data.buffer],
    {
      type: 'video/mp4'
    }
  )

}

function drawDarkOverlay(ctx) {

  ctx.fillStyle =
    'rgba(0,0,0,0.35)'

  ctx.fillRect(
    0,
    0,
    1080,
    1920
  )

}

function drawSubtitle(
  ctx,
  text
) {

  ctx.font =
    'bold 90px sans-serif'

  ctx.fillStyle =
    'white'

  ctx.strokeStyle =
    'black'

  ctx.lineWidth = 10

  const maxWidth = 900

  const lineHeight = 110

  const x = 90

  let y = 1450

  const chars =
    text.split('')

  let line = ''

  for (let i = 0; i < chars.length; i++) {

    const testLine =
      line + chars[i]

    const width =
      ctx.measureText(testLine).width

    if (width > maxWidth) {

      ctx.strokeText(
        line,
        x,
        y
      )

      ctx.fillText(
        line,
        x,
        y
      )

      line = chars[i]

      y += lineHeight

    }
    else {

      line = testLine

    }

  }

  ctx.strokeText(
    line,
    x,
    y
  )

  ctx.fillText(
    line,
    x,
    y
  )

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
