import { bech32 } from "bech32";
import { getCleanType } from ".";

export const twosComplement = (value: number, bitsSize: number): string => {
  if (value < 0) {
    value *= -1;
  }

  const bits = value.toString(2).padStart(bitsSize, "0");

  let complement = "";

  for (let i = 0; i < bitsSize; i++) {
    complement += bits[i] === "0" ? "1" : "0";
  }

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
};

export function encodeBigNumber(value: number) {
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

  const length = (hex.length / 2).toString(16).padStart(8, "0");

  return length + hex;
}

export function encodeLengthPlusData(value: string | any[]) {
  let data;
  if (typeof value === "string") {
    data = toByteArray(value);
  } else {
    data = value;
  }

  const length = data.length.toString(16).padStart(8, "0");

  const dataHex = Array.from(data)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return length + dataHex;
}

export function toByteArray(str: string) {
  const byteArray = [];
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    byteArray.push(code & 0xff);
  }
  return byteArray;
}

export const encodeABIValue = (value: any, type: string) => {
  const outerType = getCleanType(type, false).split("<")[0];

  switch (outerType) {
    case "u64":
    case "i64":
      if (value < 0) {
        return twosComplement(value, 64);
      }
      const parsedValue = value.toString(16).padStart(16, "0");
      return parsedValue;
    case "u32":
    case "i32":
    case "usize":
    case "isize":
      if (value < 0) {
        return twosComplement(value, 32);
      }
      return value.toString(16).padStart(8, "0");
    case "u16":
    case "i16":
      if (value < 0) {
        return twosComplement(value, 16);
      }
      return value.toString(16).padStart(4, "0");
    case "u8":
    case "i8":
      if (value < 0) {
        return twosComplement(value, 8);
      }
      return value.toString(16).padStart(2, "0");
    case "BigUint":
    case "BigInt":
      return encodeBigNumber(value);
    case "bool":
      return value ? "01" : "00";
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
      return encodeLengthPlusData(value);
    case "Address":
      return encodeAddress(value);
    default:
      return value;
  }
};

export function encodeAddress(value: string) {
  let decoded;

  try {
    decoded = bech32.decode(value);
  } catch (err: any) {
    throw new Error(err);
  }

  const prefix = decoded.prefix;
  if (prefix != "klv") {
    throw new Error("Invalid prefix");
  }

  const pubkey = Buffer.from(bech32.fromWords(decoded.words));
  if (pubkey.length != 32) {
    throw new Error("Invalid pubkey length");
  }

  return pubkey.toString("hex");
}
