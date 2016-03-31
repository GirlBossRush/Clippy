(function() {
  // Check for IE9+
  if (!window.addEventListener) return

  const ASSET_PATH = "//s3.amazonaws.com/clippy.js/Agents/"
  const GOTCHA_DELAY = 1000 * 8
  const UPDATE_DELAY = 1500

  let agent
  let gotchaTimeout
  let updateTimeout
  let options = INSTALL_OPTIONS

  function updateMessage(){
    clearTimeout(gotchaTimeout)

    if (options.message) {
      agent.stop()

      agent.speak(options.message)
    }

    if (options.gotchaMessage) {
      gotchaTimeout = setTimeout(() => {
        agent.closeBalloon()
        agent.stop()
        agent.speak(options.gotchaMessage)
      },
      GOTCHA_DELAY)
    }
  }

  function updateElement() {
    clippy.load("Clippy", nextAgent => {
      agent = nextAgent
      agent.show()

      updateMessage()
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

  INSTALL_SCOPE = {
    setOptions(nextOptions) {
      clearTimeout(updateTimeout)

      options = nextOptions
      updateTimeout = setTimeout(updateMessage, UPDATE_DELAY)
    }
  }
}())
