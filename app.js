import { createFFmpeg, fetchFile } from 'https://unpkg.com/@ffmpeg/ffmpeg@0.12.6/dist/ffmpeg.min.js'

const ffmpeg = createFFmpeg({
  log: true,
})

const button = document.getElementById('generateBtn')
const preview = document.getElementById('preview')
const downloadBtn = document.getElementById('downloadBtn')

button.addEventListener('click', async () => {

  const script = document.getElementById('scriptInput').value

  if (!script) {
    alert('台本を入力してください')
    return
  }

  button.innerText = '生成中...'

  const scenes = splitScenes(script)

  const images = await fetchImages(scenes)

  const audio = await generateVoice(script)

  const videoBlob = await generateVideo(
    scenes,
    images,
    audio
  )

  const url = URL.createObjectURL(videoBlob)

  preview.src = url

  downloadBtn.href = url

  button.innerText = '動画生成'

})

function splitScenes(script) {

  return script
    .split('。')
    .filter(Boolean)

}

async function fetchImages(scenes) {

  const result = []

  for (const scene of scenes) {

    const imageUrl = `https://picsum.photos/1080/1920?random=${Math.random()}`

    result.push(imageUrl)

  }

  return result

}

async function generateVoice(text) {

  const utterance = new SpeechSynthesisUtterance(text)

  utterance.lang = 'ja-JP'

  speechSynthesis.speak(utterance)

  return null

}

async function generateVideo(scenes, images, audio) {

  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load()
  }

  const canvas = document.createElement('canvas')

  canvas.width = 1080
  canvas.height = 1920

  const ctx = canvas.getContext('2d')

  const frames = []

  for (let i = 0; i < scenes.length; i++) {

    const img = await loadImage(images[i])

    ctx.drawImage(img, 0, 0, 1080, 1920)

    ctx.fillStyle = 'white'
    ctx.font = 'bold 80px sans-serif'

    wrapText(
      ctx,
      scenes[i],
      100,
      1400,
      900,
      100
    )

    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, 'image/png')
    })

    frames.push(blob)

  }

  for (let i = 0; i < frames.length; i++) {

    ffmpeg.FS(
      'writeFile',
      `frame${i}.png`,
      await fetchFile(frames[i])
    )

  }

}
