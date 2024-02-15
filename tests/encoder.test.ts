import {
  encodeBigNumber,
  twosComplement,
  encodeABIValue,
} from "../lib/utils/abi_encoder";

describe("utils", () => {
  it("should return 2 complement of number 1", () => {
    const value = 1;
    const bitsSize = 16;
    expect(twosComplement(value, bitsSize)).toBe("ffff");
  });

  it("should return 2 complement of number 2", () => {
    const value = 2;
    const bitsSize = 64;
    expect(twosComplement(value, bitsSize)).toBe("fffffffffffffffe");
  });
  it("should return 2 complement of number 10", () => {
    const value = 10;
    const bitsSize = 64;
    expect(twosComplement(value, bitsSize)).toBe("fffffffffffffff6");
  });
  it("should encode BigInt negative correctly", () => {
    const value = -1;
    expect(encodeBigNumber(value)).toBe("00000001ff");
  });
  it("should encode BigInt positive correctly", () => {
    const value = 1;
    expect(encodeBigNumber(value)).toBe("0000000101");
  });
  it("should encode BigInt positive and larger than half max correctly", () => {
    const value = 255;
    expect(encodeBigNumber(value)).toBe("0000000200ff");
  });
});

describe("encoder", () => {
  it("should encode number correctly", () => {
    const value = 1;
    const type = "u64";
    expect(encodeABIValue(value, type)).toBe("0000000000000001");
  });
  it("should encode negative number correctly", () => {
    const value = -1;
    const type = "i64";
    expect(encodeABIValue(value, type)).toBe("ffffffffffffffff");
  });
  it("should encode string correctly", () => {
    const value = "hello";
    const type = "String";
    expect(encodeABIValue(value, type)).toBe("0000000568656c6c6f");
  });
  it("should encode big number correctly", () => {
    const value = 255;
    const type = "u64";
    expect(encodeABIValue(value, type)).toBe("00000000000000ff");
  });
});