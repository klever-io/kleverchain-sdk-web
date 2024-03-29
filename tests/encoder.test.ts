import abiEncoder from "../lib/utils/abi_encoder";

describe("utils", () => {
  it("should return 2 complement of number 1", () => {
    const value = 1;
    const bitsSize = 16;
    expect(abiEncoder.twosComplement(value, bitsSize)).toBe("ffff");
  });

  it("should return 2 complement of number 2", () => {
    const value = 2;
    const bitsSize = 64;
    expect(abiEncoder.twosComplement(value, bitsSize)).toBe("fffffffffffffffe");
  });
  it("should return 2 complement of number 10", () => {
    const value = 10;
    const bitsSize = 64;
    expect(abiEncoder.twosComplement(value, bitsSize)).toBe("fffffffffffffff6");
  });
  it("should encode BigInt negative correctly", () => {
    const value = -1;
    expect(abiEncoder.encodeBigNumber(value)).toBe("00000001ff");
  });
  it("should encode BigInt positive correctly", () => {
    const value = 1;
    expect(abiEncoder.encodeBigNumber(value)).toBe("0000000101");
  });
  it("should encode BigInt positive and larger than half max correctly", () => {
    const value = 255;
    expect(abiEncoder.encodeBigNumber(value)).toBe("0000000200ff");
  });
});

describe("encoder", () => {
  it("should encode number correctly", () => {
    const value = 1;
    const type = "u64";
    expect(abiEncoder.encodeABIValue(value, type)).toBe("0000000000000001");
  });
  it("should encode negative number correctly", () => {
    const value = -1;
    const type = "i64";
    expect(abiEncoder.encodeABIValue(value, type)).toBe("ffffffffffffffff");
  });
  it("should encode string correctly", () => {
    const value = "hello";
    const type = "String";
    expect(abiEncoder.encodeABIValue(value, type)).toBe("0000000568656c6c6f");
  });
  it("should encode big number correctly", () => {
    const value = 255;
    const type = "u64";
    expect(abiEncoder.encodeABIValue(value, type)).toBe("00000000000000ff");
  });

  it("should encode address correctly", () => {
    const address =
      "klv1fpwjz234gy8aaae3gx0e8q9f52vymzzn3z5q0s5h60pvktzx0n0qwvtux5";
    const encoded = abiEncoder.encodeAddress(address);
    expect(encoded).toBe(
      "485d212a35410fdef731419f9380a9a2984d885388a807c297d3c2cb2c467cde"
    );
  });
});
