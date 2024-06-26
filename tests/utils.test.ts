import { ABITypeMap } from "../lib/types/abi";
import { getJSType } from "../lib/utils";

describe("getJSType", () => {
  it('should return "number" for ABI types mapped to number', () => {
    const numberTypes = ABITypeMap.number;
    numberTypes.forEach((type) => {
      expect(getJSType(type)).toEqual("number");
    });
  });

  it('should return "string" for ABI types mapped to string', () => {
    const stringTypes = ABITypeMap.string;
    stringTypes.forEach((type) => {
      expect(getJSType(type)).toEqual("string");
    });
  });

  it('should return "array" for ABI types mapped to array', () => {
    const arrayTypes = ABITypeMap.array;
    arrayTypes.forEach((type) => {
      expect(getJSType(type)).toEqual("array");
    });
  });

  it('should return "checkbox" for ABI type "bool"', () => {
    expect(getJSType("bool")).toEqual("checkbox");
  });

  it("should return the original ABI type if it does not match any key in ABITypeMap", () => {
    const unknownType = "customType";
    expect(getJSType(unknownType)).toEqual(unknownType);
  });
});
