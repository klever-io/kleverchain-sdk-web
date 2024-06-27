import { ABITypeMap } from "../types/abi";

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

export const getCleanType = (abiType: string, toLower = true) => {
  const isOptional = abiType.toLowerCase().startsWith("option");

  if (isOptional) {
    let matches = abiType.match(/<(.*)>/);
    if (matches && matches.length > 1) abiType = matches[1];
  }

  if (!Object.values(ABITypeMap).flat().includes(abiType)) {
    abiType = abiType.split("<")[0]; // Remove
  }

  if (toLower) {
    abiType = abiType.toLowerCase();
  }
  return abiType;
};

export const getJSType = (abiType: string): string => {
  const cleanType = getCleanType(abiType, true);

  for (const [key, values] of Object.entries(ABITypeMap)) {
    if (values.includes(cleanType)) {
      return key;
    }
  }

  return abiType;
};

const utils = {
  waitForKleverWeb,
  getCleanType,
  getJSType,
};

export default utils;
