import { bech32 } from "bech32";
import { getCleanType, getJSType } from ".";
import { ABITypeJSON, ABITypeMap } from "../types/abi";

export function twosComplement(
  value: number,
  bitsSize: number,
  isNested = true
): string {
  if (value < 0) {
    value *= -1;
  }

  if (!isNested) {
    bitsSize = Math.ceil(Math.log2(value + 1));
    if (bitsSize % 8 !== 0) {
      bitsSize = Math.ceil(bitsSize / 8) * 8;
    }
  }

  let bits = value.toString(2);
  bits = bits.padStart(bitsSize, "0");

  let complement = "";

  //invert bytes
  for (let i = 0; i < bitsSize; i++) {
    complement += bits[i] === "0" ? "1" : "0";
  }

  //add 1
  for (let i = bitsSize - 1; i >= 0; i--) {
    if (complement[i] === "0") {
      complement = complement.slice(0, i) + "1" + complement.slice(i + 1);
      break;
    } else {
      complement = complement.slice(0, i) + "0" + complement.slice(i + 1);
    }
  }

  let hexComplement = parseInt(complement.slice(0, bitsSize / 2), 2).toString(
    16
  );
  hexComplement += parseInt(
    complement.slice(bitsSize / 2, bitsSize),
    2
  ).toString(16);

  return hexComplement;
}

export function encodeBigNumber(value: number, isNested = true) {
  let hex = value.toString(16);
  if (value < 0) {
    hex = twosComplement(value, hex.length * 4);
  }
  if (hex.length % 2 !== 0) {
    hex = "0" + hex;
  }

  if (value > 0) {
    let bits = value.toString(2);
    if (bits.length % 8 !== 0) {
      bits = "0".repeat(8 - (bits.length % 8)) + bits;
    }
    if (bits[0] === "1") {
      hex = "00" + hex;
    }
  }

  if (!isNested) {
    return hex;
  }

  const length = (hex.length / 2).toString(16).padStart(8, "0");

  return length + hex;
}

export function encodeLengthPlusData(
  value: string | any[],
  innerType: string,
  isNested = true
): string | string[] {
  let data;
  if (typeof value !== "string") {
    data = value
      .map((v) => {
        return encodeABIValue(v, innerType, true);
      })
      .join("");

    const length = value.length.toString(16).padStart(8, "0");

    if (!isNested) {
      return data;
    }

    return length + data;
  } else {
    data = toByteArray(value as string);

    if (data.length === 0) {
      return "";
    }

    const dataHex = Array.from(data)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    if (!isNested) {
      return dataHex;
    }

    const length = data.length.toString(16).padStart(8, "0");
    return length + dataHex;
  }
}

export function toByteArray(str: string) {
  const byteArray = [];
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    byteArray.push(code & 0xff);
  }
  return byteArray;
}

const padValue = (value: string, length: number, isNested = true) => {
  if (isNested) {
    return value.padStart(length, "0");
  } else if (value.length % 2 !== 0) {
    return "0" + value;
  }
  return value;
};

export const encodeWithABI = (
  abi: ABITypeJSON,
  value: any,
  type: string
): string => {
  return encodeWithABIRecursive(abi, value, type, "");
};

const encodeWithABIRecursive = (
  abi: ABITypeJSON,
  value: any,
  type: string,
  curr: string
): string => {
  const abiType = abi.types[type] || null;
  if (!abiType) {
    return "";
  }

  let result = curr;

  abiType.fields.map((item: { name: string; type: string }) => {
    if (item.type.startsWith("Option<")) {
      const not = value[item.name] == null || value[item.name] == undefined;

      if (not) {
        result += "00";
        return;
      }

      const convertedType = item.type.slice(7, -1);

      if (isCustomType(convertedType)) {
        result = encodeWithABIRecursive(
          abi,
          value[item.name],
          item.type,
          result + "01"
        );
        return;
      }

      result += "01" + encodeABIValue(value[item.name], item.type, true);

      return;
    }

    if (item.type.startsWith("List<")) {
      const convertedType = item.type.slice(5, -1);

      if (isCustomType(convertedType)) {
        result += encodeHexLen(value[item.name].length || 0);

        value[item.name].map((item: any) => {
          result = encodeWithABIRecursive(abi, item, convertedType, result);
        });
        return;
      }

      result += encodeABIValue(value[item.name], item.type, true);

      return;
    }

    if (isCustomType(item.type)) {
      result = encodeWithABIRecursive(abi, value[item.name], item.type, result);
      return;
    }

    result += encodeABIValue(value[item.name], item.type, true);
  });

  return result;
};

const encodeHexLen = (size: number): string => {
  return size.toString(16).padStart(8, "0");
};

export const isCustomType = (type: string): boolean => {
  switch (type) {
    case "u64":
    case "i64":
    case "u32":
    case "i32":
    case "usize":
    case "isize":
    case "u16":
    case "i16":
    case "u8":
    case "i8":
    case "BigUint":
    case "BigInt":
    case "bool":
    case "ManagedBuffer":
    case "BoxedBytes":
    case "&[u8]":
    case "Vec":
    case "String":
    case "&str":
    case "bytes":
    case "TokenIdentifier":
    case "List":
    case "Array":
    case "Address":
    case "variadic":
    case "multi":
      return false;
    default:
      return true;
  }
};

export const encodeABIValue = (
  value: any,
  type: string,
  isNested = true
): string => {
  const outerType = getCleanType(type, false).split("<")[0];
  const innerType = type.slice(type.indexOf("<") + 1, type.length - 1);

  let typeParsedValue = value;
  const jsType = getJSType(type);
  if (jsType === "number") {
    typeParsedValue = Number(typeParsedValue);

    if (isNaN(typeParsedValue)) {
      return "";
    }
  }

  let hexNumber;

  switch (outerType) {
    case "u64":
    case "i64":
      if (typeParsedValue < 0) {
        return twosComplement(typeParsedValue, 64, isNested);
      }
      hexNumber = typeParsedValue.toString(16);
      return padValue(hexNumber, 16, isNested);
    case "u32":
    case "i32":
    case "usize":
    case "isize":
      if (typeParsedValue < 0) {
        return twosComplement(typeParsedValue, 32, isNested);
      }
      hexNumber = typeParsedValue.toString(16);
      return padValue(hexNumber, 8, isNested);
    case "u16":
    case "i16":
      if (typeParsedValue < 0) {
        return twosComplement(typeParsedValue, 16, isNested);
      }
      hexNumber = typeParsedValue.toString(16);
      return padValue(hexNumber, 4, isNested);
    case "u8":
    case "i8":
      if (typeParsedValue < 0) {
        return twosComplement(typeParsedValue, 8, isNested);
      }
      hexNumber = typeParsedValue.toString(16);
      return padValue(hexNumber, 2, isNested);
    case "BigUint":
    case "BigInt":
      return encodeBigNumber(typeParsedValue, isNested);
    case "bool":
      return typeParsedValue ? "01" : "00";
    case "ManagedBuffer":
    case "BoxedBytes":
    case "&[u8]":
    case "Vec":
    case "String":
    case "&str":
    case "bytes":
    case "TokenIdentifier":
    case "List":
    case "Array":
      return encodeLengthPlusData(
        typeParsedValue,
        innerType,
        isNested
      ) as string;
    case "Address":
      return encodeAddress(typeParsedValue);
    case "variadic":
    case "multi":
      return encodeVariadic(typeParsedValue, innerType);
    default:
      return typeParsedValue;
  }
};

export function encodeAddress(value: string) {
  let decoded;

  try {
    decoded = bech32.decode(value);
  } catch (err: any) {
    return value;
  }

  const prefix = decoded.prefix;
  if (prefix != "klv") {
    return value;
  }

  const pubkey = Buffer.from(bech32.fromWords(decoded.words));
  if (pubkey.length != 32) {
    return value;
  }

  return pubkey.toString("hex");
}
export function encodeVariadic(value: any[], type: string) {
  let hasInnerType = false;
  if (type.includes("<")) {
    const types = type.split(",");
    const innerType = types.find((item) => item.includes("<"));

    hasInnerType = !!Object.values(ABITypeMap)
      .flat()
      .find((item) => {
        return item === innerType?.toLowerCase();
      });
  }

  if ((type.includes("<") && hasInnerType) || !type.includes("<")) {
    const types = type.split(",");
    const values = types.map((type, index) =>
      encodeABIValue(value[index], type, false)
    );
    return values.join("@");
  }
  const encodedValues = value.map((item, index) =>
    encodeABIValue(value[index], type, false)
  );

  return encodedValues.join("@");
}

const abiEncoder = {
  encodeABIValue,
  encodeWithABI,
  encodeLengthPlusData,
  toByteArray,
  encodeBigNumber,
  twosComplement,
  encodeAddress,
};

export default abiEncoder;
