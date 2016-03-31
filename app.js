(function() {
  // Check for IE9+
  if (!window.addEventListener) return

  let options = INSTALL_OPTIONS
  let agent

  function updateElement() {
    clippy.load(options.agent, nextAgent => {
      agent = nextAgent
      agent.show()
    },
    () => null,
    "//s3.amazonaws.com/clippy.js/Agents/")
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateElement)
  }
  else {
    updateElement()
  }

  INSTALL_SCOPE = { // eslint-disable-line no-undef
    setOptions(nextOptions) {
      options = nextOptions

      agent.hide(true, updateElement)
    }
  }
}())
