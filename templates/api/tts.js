export async function speak(text) {

  const utterance =
    new SpeechSynthesisUtterance(text)

  utterance.lang =
    'ja-JP'

  speechSynthesis.speak(
    utterance
  )

}
