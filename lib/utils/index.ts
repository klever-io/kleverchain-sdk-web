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

export const reverseHexBytes = (hex: string): string => {
  let paddedHex = hex;
  if (paddedHex.length % 2 !== 0) {
    paddedHex = "0" + paddedHex;
  }

  let newHex = "";
  for (let i = 0; i < paddedHex.length; i += 2) {
    newHex = paddedHex.slice(i, i + 2) + newHex;
  }

  return newHex;
};

export const parseAccountPermissionBinaryOperations = (
  binary: string
): string => {
  const hex = Number(`0b${binary}`).toString(16);
  return reverseHexBytes(hex);
};

export const getCleanType = (abiType: string) => {
  const isOptional = abiType.toLowerCase().startsWith("option");
  let cleanType = isOptional ? (abiType.match(/<(.*)>/) || [])[1] : abiType;

  cleanType = cleanType.toLowerCase();

  cleanType = cleanType.split("<")[0];

  return cleanType;
};

const utils = {
  waitForKleverWeb,
};

export default utils;
