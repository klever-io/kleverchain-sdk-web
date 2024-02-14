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

interface IAbiItem {
  name: string;
  type: string;
}

interface DecodeResult {
  data?: any;
  dataArr?: any[];
  newHex: string;
  error?: string;
}

const decodeAddress = (hexValue: string): DecodeResult => {
  const data = hexValue.slice(0, 64);
  const newHex = hexValue.slice(64);

  return { data, newHex };
};

const decode64BitNumber = (hexValue: string): DecodeResult => {
  const data = parseInt(hexValue.slice(0, 16), 16);
  const newHex = hexValue.slice(16);

  return { data, newHex };
};

const decode32BitNumber = (hexValue: string): DecodeResult => {
  const data = parseInt(hexValue.slice(0, 8), 16);
  const newHex = hexValue.slice(8);

  return { data, newHex };
};

const decodeBigNumber = (hexValue: string): DecodeResult => {
  const length = parseInt(hexValue.slice(0, 8), 16);
  if (length === 0) {
    return { data: BigInt(0), newHex: hexValue.slice(8) };
  }

  const data = hexToBigInt(hexValue.slice(8, 8 + length * 2));
  const newHex = hexValue.slice(8 + length * 2);

  return { data, newHex };
};

const hexToBigInt = (hex: string): bigint => {
  return BigInt(`0x${hex}`);
};

const decodeString = (hexValue: string): DecodeResult => {
  const length = parseInt(hexValue.slice(0, 8), 16);
  const data = hexToString(hexValue.slice(8, 8 + length * 2));
  const newHex = hexValue.slice(8 + length * 2);

  return { data, newHex };
};

const hexToString = (hex: string): string => {
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
};

const decodeValue = (hexValue: string, type: string): DecodeResult => {
  switch (type) {
    case "u64":
    case "i64":
      return decode64BitNumber(hexValue);
    // if (value < 0) {
    //   return twosComplement(value, 64);
    // }
    // const parsedValue = value.toString(16).padStart(16, "0");
    // return parsedValue;
    case "u32":
    case "i32":
    case "usize":
    case "isize":
      return decode32BitNumber(hexValue);
    // if (value < 0) {
    //   return twosComplement(value, 32);
    // }
    // return value.toString(16).padStart(8, "0");
    case "u16":
    case "i16":
    // if (value < 0) {
    //   return twosComplement(value, 16);
    // }
    // return value.toString(16).padStart(4, "0");
    case "u8":
    case "i8":
    // if (value < 0) {
    //   return twosComplement(value, 8);
    // }
    // return value.toString(16).padStart(2, "0");
    case "BigUint":
    case "BigInt":
      return decodeBigNumber(hexValue);
    case "Address":
      return decodeAddress(hexValue);
    case "bool":
      return { data: hexValue.slice(0, 2) === "01", newHex: hexValue.slice(2) };
    case "ManagedBuffer":
    case "BoxedBytes":
    case "&[u8]":
    case "Vec<u8>":
    case "String":
    case "&str":
    case "bytes":
    case "TokenIdentifier":
      return decodeString(hexValue);
    // return encodeLengthPlusData(value);
    default:
      return { error: `Invalid type: ${type}`, data: null, newHex: hexValue };
  }
};

const decodeList = (
  abiJson: any,
  hexValue: string,
  type: string
): DecodeResult => {
  const len = parseInt(hexValue.slice(0, 8), 16);
  const list = [];
  type = type.slice(5, -1);

  let newHex = hexValue.slice(8);

  if (type.includes("List<")) {
    const decoded = decodeList(abiJson, newHex, type);
    if (decoded.error) {
      return {
        error: decoded.error,
        newHex: newHex,
      };
    }

    list.push(decoded.dataArr);
    newHex = decoded.newHex;

    return { dataArr: list, newHex };
  }

  for (let i = 0; i < len; i++) {
    const typeDef = abiJson.types[type];

    if (!typeDef) {
      return {
        error: `Invalid type: ${type}`,
        newHex: newHex,
      };
    }

    let decodedValue;
    if (typeDef.type !== "struct") {
      decodedValue = decodeValue(newHex, typeDef.type);
      if (decodedValue.error) {
        return {
          error: decodedValue.error,
          newHex: newHex,
        };
      }

      list.push(decodedValue.data);
      newHex = decodedValue.newHex;
      continue;
    }

    const result: any = {};

    typeDef.fields.map((item: IAbiItem) => {
      decodedValue = decodeValue(newHex, item.type);
      if (decodedValue.error) {
        throw new Error(decodedValue.error);
      }

      result[item.name] = decodedValue.data;
      newHex = decodedValue.newHex;
    });

    list.push(result);
  }

  return { dataArr: list, newHex };
};

export const decode = (hexValue: string, type: string, abi: string): any => {
  const abiJson = JSON.parse(abi);
  if (!abiJson.types) {
    throw new Error("Invalid ABI");
  }

  const typeDef = abiJson.types[type];

  if (!typeDef) {
    throw new Error("Invalid type");
  }

  if (typeDef.type !== "struct") {
    return decodeValue(hexValue, typeDef.type);
  }

  const result: any = {};

  typeDef.fields.map((item: IAbiItem) => {
    if (item.type.includes("List<")) {
      const decoded = decodeList(abiJson, hexValue, item.type);
      if (decoded.error) {
        throw new Error(decoded.error);
      }

      result[item.name] = decoded.dataArr;
      hexValue = decoded.newHex;
      return;
    }

    const decoded = decodeValue(hexValue, item.type);
    if (decoded.error) {
      throw new Error(decoded.error);
    }

    result[item.name] = decoded.data;
    hexValue = decoded.newHex;
  });

  return result;
};

const utils = {
  waitForKleverWeb,
};

export default utils;
