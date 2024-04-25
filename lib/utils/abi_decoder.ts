import { bech32 } from "bech32";

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
  if (hexValue.length < 40) {
    return {
      error: `Invalid address: ${hexValue}`,
      data: null,
      newHex: hexValue,
    };
  }

  const words = bech32.toWords(Buffer.from(hexValue.slice(0, 64), "hex"));

  const data = bech32.encode("klv", words);
  const newHex = hexValue.slice(64);

  return { data, newHex };
};

const decodeUint = (hexValue: string, len: number): DecodeResult => {
  let value = hexValue.slice(0, len);
  const newHex = hexValue.slice(len);

  if (len === 16) {
    return { data: hexToBigInt(value), newHex };
  }

  return { data: parseInt(hexValue.slice(0, len), 16), newHex };
};

const decodeInt16 = (hexValue: string): DecodeResult => {
  let data = parseInt(hexValue.slice(0, 4), 16);  
  const newHex = hexValue.slice(4);  

  if (data & 0x8000) {  
    data = data - 0x10000;  
  }

  return { data, newHex };
};

const decodeInt8 = (hexValue: string): DecodeResult => {
  let data = parseInt(hexValue.slice(0, 2), 16);  
  const newHex = hexValue.slice(2); 

  if (data & 0x80) {  
    data = data - 0x100;
  }

  return { data, newHex };
};

const decodeInt32 = (hexValue: string): DecodeResult => {
  let data = parseInt(hexValue.slice(0, 8), 16);
  if (data & 0x80000000) {
    data = data - 0x100000000; 
  }
  const newHex = hexValue.slice(8);
  return { data, newHex };
};


const decodeInt64 = (hexValue: string): DecodeResult => {
  let data = hexToBigInt(hexValue.slice(0, 16));
  const newHex = hexValue.slice(16);  

  if (data & BigInt(0x8000000000000000)) {  
    data = data - BigInt(0x10000000000000000); 
  }

  return { data, newHex };
};

const decodeInt = (
  hexValue: string,
  len: number,
  direct: boolean
): DecodeResult => {
  if (hexValue.length < len) {
    return decodeInt(hexValue, len / 2, direct);
  }

  switch (len) {
    case 2:
      return decodeInt8(hexValue);
    case 4:
      return decodeInt16(hexValue);
    case 8:
      return decodeInt32(hexValue);
    case 16:
      return decodeInt64(hexValue);
    case 32:
      return decodeBigInt(hexValue, direct);
    default:
      return {
        error: `Invalid int length: ${len}`,
        data: null,
        newHex: hexValue,
      };
  }
};

const decodeBigUint = (hexValue: string, direct: boolean): DecodeResult => {
  let hex = hexValue;
  let newHex = "";

  if (!direct) {
    const length = parseInt(hexValue.slice(0, 8), 16);
    if (length === 0) {
      return { data: BigInt(0), newHex: hexValue.slice(8) };
    }

    hex = hexValue.slice(8, 8 + length * 2);
    newHex = hexValue.slice(8 + length * 2);
  }

  const data = hexToBigInt(hex);

  return { data, newHex };
};

const decodeBigInt = (hexValue: string, direct: boolean): DecodeResult => {
  let hex = hexValue;
  let newHex = "";

  if (!direct) {
    const length = parseInt(hexValue.slice(0, 8), 16);
    if (length === 0) {
      return { data: BigInt(0), newHex: hexValue.slice(8) };
    }

    newHex = hexValue.slice(8 + length * 2);
    hex = hexValue.slice(8, 8 + length * 2);
  }

  let data = hexToBigInt(hex);

  let maxValue = (BigInt(1) << (BigInt(64) - BigInt(1))) - BigInt(1);
  if (data > maxValue) {
    data -= BigInt(1) << BigInt(64);
  }

  return { data, newHex };
};

const hexToBigInt = (hex: string): bigint => {
  return BigInt(`0x${hex}`);
};

const decodeString = (hexValue: string, direct: boolean): DecodeResult => {
  let hex = hexValue;
  let newHex = "";

  if (!direct) {
    const length = parseInt(hexValue.slice(0, 8), 16);
    newHex = hexValue.slice(8 + length * 2);
    hex = hexValue.slice(8, 8 + length * 2);
  }

  const data = hexToString(hex);

  return { data, newHex };
};

const hexToString = (hex: string): string => {
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }

  return str;
};

export const decode = (
  abi: string,
  hexValue: string,
  endpoint: string
): any => {
  if (endpoint === "") {
    throw new Error("Invalid endpoint provided");
  }

  if (!abi || abi === undefined || abi === "" || abi === "{}") {
    throw new Error("Invalid ABI");
  }

  const abiJson = JSON.parse(abi);
  if (!abiJson.endpoints) {
    throw new Error("Invalid ABI");
  }

  const endpointDef = abiJson.endpoints.find((t: any) => t.name === endpoint);
  if (!endpointDef) {
    throw new Error("Invalid endpoint");
  }

  if (endpointDef.mutability !== "readonly") {
    throw new Error("Invalid mutability");
  }

  if (!endpointDef.outputs || endpointDef.outputs.length === 0) {
    throw new Error("Invalid output length");
  }

  if (endpointDef.outputs.length !== 1) {
    throw new Error("Invalid output length");
  }

  let type = endpointDef.outputs[0].type;

  return selectDecode(abi, abiJson, hexValue, type);
};

const selectDecode = (
  abi: string,
  abiJSON: any,
  hexValue: string,
  type: string
): any => {
  if (type.startsWith("tuple<")) {
    type = type.slice(6, -1);
    return decodeTuple(abiJSON, hexValue, type);
  }

  if (type.startsWith("variadic<")) {
    type = type.slice(9, -1);
    return selectDecode(abi,abiJSON,hexValue,type);
  }

  if (type.startsWith("List<")) {
    type = type.slice(5, -1);
    return decodeList(hexValue, type, abi);
  }

  if (!abiJSON.types) {
    return decodeValue(hexValue, type);
  }

  const abiType = abiJSON.types[type];
  if (!abiType) {
    return decodeValue(hexValue, type);
  }

  if (abiType.type === "struct") {
    return decodeStruct(hexValue, type, abi);
  }

  throw new Error(`Invalid type: ${type}`);
};

export const decodeTuple = (
  abiJSON: any,
  hexValue: string,
  type: string
): DecodeResult => {
  const types = type.split(",");

  if (!abiJSON.types) {
    abiJSON["types"] = {};
  }

  abiJSON.types["generated_custom_type"] = generateTupleType(types);

  const result: any = {};

  return decodeStruct(
    hexValue,
    "generated_custom_type",
    JSON.stringify(abiJSON)
  );
};

const generateTupleType = (types: string[]): any => {
  let tuppleType: { [key: string]: any } = {
    type: "struct",
    fields: [],
  };

  types.map((type, index) => {
    tuppleType.fields.push({ name: `_${index}`, type });
  });

  return tuppleType;
};

const decodeSingleValue = (
  hexValue: string,
  direct: boolean,
  type: string
): DecodeResult => {
  if (type.startsWith("Option<")) {
    const some = hexValue.slice(0, 2) === "01";
    hexValue = hexValue.slice(2);

    if (!some) {
      return { data: null, newHex: hexValue };
    }

    type = type.slice(7, -1);

    direct = false;
  }

  switch (type) {
    case "u64":
      return decodeUint(hexValue, 16);
    case "i64":
      var decoded = decodeInt(hexValue, 16, direct);
      decoded.data = BigInt(decoded.data);

      return decoded;
    case "u32":
    case "usize":
      return decodeUint(hexValue, 8);
    case "isize":
    case "i32":
      return decodeInt(hexValue, 8, direct);
    case "u16":
      return decodeUint(hexValue, 4);
    case "i16":
      return decodeInt(hexValue, 4, direct);
    case "u8":
      return decodeUint(hexValue, 2);
    case "i8":
      return decodeInt(hexValue, 2, direct);
    case "BigUint":
      return decodeBigUint(hexValue, direct);
    case "BigInt":
      try {
        const stringResult = decodeString(hexValue,direct)
        return { newHex: stringResult.newHex, data: BigInt(stringResult.data)}
      }catch {
          if (!direct) {
            return decodeBigInt(hexValue, false);
          }
    
          var decoded = decodeInt(hexValue, 32, direct);
          decoded.data = BigInt(decoded.data);
          return decoded;
      }
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
      return decodeString(hexValue, direct);
    default:
      return { error: `Invalid type: ${type}`, data: null, newHex: hexValue };
  }
};

const decodeListHandle = (
  abiJson: any,
  newHex: string,
  type: string
): DecodeResult => {
  if (type.startsWith("List<")) {
    const decoded = decodeListValue(abiJson, newHex, type);
    if (decoded.error) {
      return {
        error: decoded.error,
        newHex: newHex,
      };
    }

    newHex = decoded.newHex;

    return { dataArr: decoded.dataArr, newHex };
  }

  const typeDef = abiJson.types[type];

  let decodedValue;

  if (!typeDef || typeDef.type !== "struct") {
    decodedValue = decodeSingleValue(newHex, false, typeDef?.type || type);
    if (decodedValue.error) {
      return {
        error: decodedValue.error,
        newHex: newHex,
      };
    }

    newHex = decodedValue.newHex;
    return { data: decodedValue.data, newHex };
  }

  const result: any = {};

  typeDef.fields.map((item: IAbiItem) => {
    decodedValue = decodeSingleValue(newHex, false, item.type);
    if (decodedValue.error) {
      throw new Error(decodedValue.error);
    }

    result[item.name] = decodedValue.data;
    newHex = decodedValue.newHex;
  });

  return { data: result, newHex };
};

const decodeListValue = (
  abiJson: any,
  hexValue: string,
  type: string
): DecodeResult => {
  if (type.startsWith("Option<")) {
    const some = hexValue.slice(0, 2) === "01";
    hexValue = hexValue.slice(2);

    if (!some) {
      return { data: null, newHex: hexValue };
    }

    type = type.slice(7, -1);
  }

  const len = parseInt(hexValue.slice(0, 8), 16);
  const list = [];
  type = type.slice(5, -1);

  let newHex = hexValue.slice(8);

  for (let i = 0; i < len; i++) {
    let decoded = decodeListHandle(abiJson, newHex, type);

    if (decoded.dataArr) {
      list.push(decoded.dataArr);
    } else {
      list.push(decoded.data);
    }

    newHex = decoded.newHex;
  }

  return { dataArr: list, newHex };
};

export const decodeList = (
  hexValue: string,
  type: string,
  abi: string,
): any => {


  if (type.startsWith("Option<")) {
    const some = hexValue.slice(0, 2) === "01";
    hexValue = hexValue.slice(2);

    if (!some) {
      return { data: null, newHex: hexValue };
    }

    type = type.slice(7, -1);
  }

  if (abi === "") {
    abi = `{"types":{}}`;
  }

  const abiJson = JSON.parse(abi);
  if (!abiJson.types) {
    throw new Error("Invalid ABI");
  }

  let res = [];

  do {
    const decoded = decodeListHandle(abiJson, hexValue, type);
    if (decoded.dataArr) {
      res.push(decoded.dataArr);
    } else {
      res.push(decoded.data);
    }
    hexValue = decoded.newHex;
  } while (hexValue.length > 0);

  return res;
};

export const decodeValue = (hexValue: string, type: string): any => {
  return decodeSingleValue(hexValue, true, type).data;
};

export const decodeStruct = (
  hexValue: string,
  type: string,
  abi: string
): any => {
  if (type.startsWith("Option<")) {
    const some = hexValue.slice(0, 2) === "01";
    hexValue = hexValue.slice(2);

    if (!some) {
      return { data: null, newHex: hexValue };
    }

    type = type.slice(7, -1);
  }

  const abiJson = JSON.parse(abi);
  if (!abiJson.types) {
    throw new Error("Invalid ABI");
  }

  const typeDef = abiJson.types[type];

  if (!typeDef) {
    throw new Error("Invalid type");
  }

  if (typeDef.type !== "struct") {
    return decodeSingleValue(hexValue, false, typeDef.type);
  }

  const result: any = {};

  typeDef.fields.map((item: IAbiItem) => {
    if (item.type.startsWith("List<")) {
      const decoded = decodeListValue(abiJson, hexValue, item.type);
      if (decoded.error) {
        throw new Error(decoded.error);
      }

      result[item.name] = decoded.dataArr;
      hexValue = decoded.newHex;
      return;
    }

    const decoded = decodeSingleValue(hexValue, false, item.type);
    if (decoded.error) {
      throw new Error(decoded.error);
    }

    result[item.name] = decoded.data;
    hexValue = decoded.newHex;
  });

  return result;
};

const abiDecoder = {
  decodeValue,
  decodeList,
  decodeStruct,
};

export default abiDecoder;
