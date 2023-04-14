async function waitForKleverWeb(timeout = 5000) {
  const startTime = Date.now();
  while (!window.kleverWeb) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (Date.now() - startTime > timeout) {
      throw new Error("Timed out waiting for kleverWeb!");
    }
  }
  // kleverWeb is now available on the window object!
}

const utils = {
  waitForKleverWeb,
};

export default utils;
