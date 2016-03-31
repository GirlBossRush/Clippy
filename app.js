(function() {
  // Check for IE9+
  if (!window.addEventListener) return

  const ASSET_PATH = "//s3.amazonaws.com/clippy.js/Agents/"
  const RATE_LIMIT = 1500
  let agent
  let options = INSTALL_OPTIONS
  let rateTimeout

  function unmountNode(node) {
    if (node && node.parentNode) node.parentNode.removeChild(node)
  }

  function updateElement() {
    const {askQuestion, choices, question} = options

    clippy.load(options.agent, nextAgent => {
      agent = nextAgent
      agent.show()

      if (askQuestion && question && choices.length) {
        const choicesTexts = choices.map(choice => choice.text)

        agent.ask(question, choicesTexts, choiceIndex => {
          agent.stop()
          agent.speak(choices[choiceIndex].answer)
        })
      }
    },
    () => null,
    ASSET_PATH)
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateElement)
  }
  else {
    updateElement()
  }

  INSTALL_SCOPE = { // eslint-disable-line no-native-reassign
    setOptions(nextOptions) {
      clearTimeout(rateTimeout)

      options = nextOptions

      rateTimeout = setTimeout(() => {
        agent.hide(true, () => {
          agent._el.remove()

          // The animation queue is slow repaint balloons. This speeds things up.
          Array.from(document.querySelector(".clippy-balloon")).forEach(unmountNode)

          updateElement()
        })
      }, RATE_LIMIT)
    }
  }
}())
