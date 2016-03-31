(function () {
  // Check for IE9+
  if (!window.addEventListener) return;

  const ASSET_PATH = "//s3.amazonaws.com/clippy.js/Agents/";
  const GOTCHA_DELAY = 1000 * 8;
  const UPDATE_DELAY = 1500;

  let agent;
  let gotchaTimeout;
  let updateTimeout;
  let options = INSTALL_OPTIONS;

  function unmountNode(node) {
    if (node && node.parentNode) node.parentNode.removeChild(node);
  }

  function updateMessage() {
    clearTimeout(gotchaTimeout);

    if (options.message) {
      agent.stop();

      agent.speak(options.message);
    }

    if (options.gotchaMessage) {
      gotchaTimeout = setTimeout(() => {
        agent.closeBalloon();
        agent.stop();
        agent.speak(options.gotchaMessage);
      }, GOTCHA_DELAY);
    }
  }

  function updateElement() {
    clippy.load(options.agentName, nextAgent => {
      agent = nextAgent;
      agent.show();

      updateMessage();
    }, () => null, ASSET_PATH);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateElement);
  } else {
    updateElement();
  }

  INSTALL_SCOPE = {
    setAgent(nextOptions) {
      clearTimeout(updateTimeout);
      clearTimeout(gotchaTimeout);

      options = nextOptions;
      agent._el.remove();

      // The animation queue is slow repaint balloons. This speeds things up.
      Array.from(document.querySelector(".clippy-balloon")).forEach(unmountNode);

      updateElement();
    },
    setMessage(nextOptions) {
      clearTimeout(updateTimeout);

      options = nextOptions;
      updateTimeout = setTimeout(updateMessage, UPDATE_DELAY);
    }
  };
})();