(function() {
  // Check for IE9+
  if (!window.addEventListener) return

  const ASSET_PATH = "//s3.amazonaws.com/clippy.js/Agents/"
  const GOTCHA_DELAY = 1000 * 5
  let agent
  let gotchaTimeout
  let options = INSTALL_OPTIONS

  function unmountNode(node) {
    if (node && node.parentNode) node.parentNode.removeChild(node)
  }

  function updateMessage(){
    if (options.message){
      agent.show()

      balloon = document.querySelector('.clippy-balloon')
      console.log('balloon', balloon)
      if (!balloon){
        agent.speak(options.message)
      } else {
        balloon.querySelector('.clippy-content').innerHTML = options.message
        balloon.style.display = 'block'
      }
    }

    if (gotchaTimeout)
      clearTimeout(gotchaTimeout)

    console.log('y')
    gotchaTimeout = setTimeout(() => {
      console.log('x', agent)
      agent.closeBalloon()
      agent.stop()
      agent.speak(options.gotchaMessage)
    },
    GOTCHA_DELAY)
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
      options = nextOptions

      updateMessage()
    }
  }
}())
