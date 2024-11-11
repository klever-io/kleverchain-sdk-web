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

describe("custom encode", () => {
  const mockAbi = JSON.stringify({
    types: {
      Foo: {
        type: "struct",
        fields: [
          {
            name: "bar",
            type: "bytes",
          },
        ],
      },
      Teste: {
        type: "struct",
        fields: [
          {
            name: "title",
            type: "bytes",
          },
          {
            name: "ok",
            type: "bool",
          },
          {
            name: "u32_val",
            type: "u32",
          },
          {
            name: "u64_val",
            type: "u64",
          },
          {
            name: "biguint_val",
            type: "BigUint",
          },
          {
            name: "address_val",
            type: "Address",
          },
          {
            name: "token_val",
            type: "TokenIdentifier",
          },
          {
            name: "opt_val",
            type: "Option<bool>",
          },
          {
            name: "opt_val2",
            type: "Option<bool>",
          },
          {
            name: "opt_val3",
            type: "Option<bool>",
          },
          {
            name: "list",
            type: "List<bool>",
          },
          {
            name: "custom_list",
            type: "List<Foo>",
          },
          {
            name: "custom_type",
            type: "Foo",
          },
        ],
      },
    },
  });

  it("should encode custom struct correctly", () => {
    const value = {
      title: "Teste",
      ok: true,
      u32_val: 10,
      u64_val: BigInt(20),
      biguint_val: BigInt(30),
      address_val:
        "klv1fpwjz234gy8aaae3gx0e8q9f52vymzzn3z5q0s5h60pvktzx0n0qwvtux5",
      token_val: "KLV",
      opt_val: undefined,
      opt_val2: false,
      opt_val3: null,
      list: [true, false, true],
      custom_list: [{ bar: "KLV" }],
      custom_type: { bar: "KLV" },
    };

    expect(abiEncoder.encodeWithABI(JSON.parse(mockAbi), value, "Teste")).toBe(
      "000000055465737465010000000a0000000000000014000000011e485d212a35410fdef731419f9380a9a2984d885388a807c297d3c2cb2c467cde000000034b4c56000100000000000301000100000001000000034b4c56000000034b4c56"
    );
  });
});

describe("address encoder", () => {
  it("should encode address correctly", () => {
    const address =
      "klv1fpwjz234gy8aaae3gx0e8q9f52vymzzn3z5q0s5h60pvktzx0n0qwvtux5";
    const encoded = abiEncoder.encodeAddress(address);
    expect(encoded).toBe(
      "485d212a35410fdef731419f9380a9a2984d885388a807c297d3c2cb2c467cde"
    );
  });
});

describe("nested encoder", () => {
  it("should encode number correctly", () => {
    const value = 1;
    const type = "u64";
    expect(abiEncoder.encodeABIValue(value, type, true)).toBe(
      "0000000000000001"
    );
  });
  it("should encode negative number correctly", () => {
    const value = -1;
    const type = "i64";
    expect(abiEncoder.encodeABIValue(value, type, true)).toBe(
      "ffffffffffffffff"
    );
  });
  it("should encode negative number correctly", () => {
    const value = -17;
    const type = "i64";
    expect(abiEncoder.encodeABIValue(value, type, true)).toBe(
      "ffffffffffffffef"
    );
  });
  it("should encode negative number correctly", () => {
    const value = -287454020;
    const type = "i64";
    expect(abiEncoder.encodeABIValue(value, type, true)).toBe(
      "ffffffffeeddccbc"
    );
  });
  it("should encode string correctly", () => {
    const value = "hello";
    const type = "String";
    expect(abiEncoder.encodeABIValue(value, type, true)).toBe(
      "0000000568656c6c6f"
    );
  });
  it("should encode big number correctly", () => {
    const value = 255;
    const type = "u64";
    expect(abiEncoder.encodeABIValue(value, type, true)).toBe(
      "00000000000000ff"
    );
  });
});

describe("recursive encoding", () => {
  it("should encode top level nested array correctly", () => {
    const array = [
      [
        ["CHIPS-N89A", "KLV", "KFI"],
        ["TFT-786J", "SJA-LK9H", "QKU-7HH1"],
      ],
    ];
    const encoded = abiEncoder.encodeABIValue(
      array,
      "List<List<List<TokenIdentifier>>>",
      false
    );

    expect(encoded).toBe(
      "00000002000000030000000a43484950532d4e383941000000034b4c56000000034b464900000003000000085446542d3738364a00000008534a412d4c4b394800000008514b552d37484831"
    );
  });
  it("should encode nested nested array correctly", () => {
    const array = [
      [
        ["CHIPS-N89A", "KLV", "KFI"],
        ["TFT-786J", "SJA-LK9H", "QKU-7HH1"],
      ],
    ];
    const encoded = abiEncoder.encodeABIValue(
      array,
      "List<List<List<TokenIdentifier>>>",
      true
    );

    expect(encoded).toBe(
      "0000000100000002000000030000000a43484950532d4e383941000000034b4c56000000034b464900000003000000085446542d3738364a00000008534a412d4c4b394800000008514b552d37484831"
    );
  });
});

describe("top level encoder", () => {
  it("should encode number correctly", () => {
    const value = 1;
    const type = "u64";
    expect(abiEncoder.encodeABIValue(value, type, false)).toBe("01");
  });
  it("should encode negative number correctly", () => {
    const value = -1;
    const type = "i64";
    expect(abiEncoder.encodeABIValue(value, type, false)).toBe("ff");
  });
  it("should encode negative number correctly", () => {
    const value = -17;
    const type = "i64";
    expect(abiEncoder.encodeABIValue(value, type, false)).toBe("ef");
  });
  it("should encode negative number correctly", () => {
    const value = -287454020;
    const type = "i64";
    expect(abiEncoder.encodeABIValue(value, type, false)).toBe("eeddccbc");
  });
  it("should encode string correctly", () => {
    const value = "hello";
    const type = "String";
    expect(abiEncoder.encodeABIValue(value, type, false)).toBe("68656c6c6f");
  });
  it("should encode big number correctly", () => {
    const value = 255;
    const type = "u64";
    expect(abiEncoder.encodeABIValue(value, type, false)).toBe("ff");
  });
  it("should encode arrays correctly", () => {
    const value = [
      ["klv1velayazgrn6mqaqckt7utk9656h8zu3ex4ln8rx7n8p0vy4fd20qmwh4p5", "KLV"],
      ["klv1velayazgrn6mqaqckt7utk9656h8zu3ex4ln8rx7n8p0vy4fd20qmwh4p5", "KFI"],
    ];
    const type = "variadic<multi<Address,TokenIdentifier>>";

    expect(abiEncoder.encodeABIValue(value, type, false)).toBe(
      "667fd274481cf5b07418b2fdc5d8baa6ae717239357f338cde99c2f612a96a9e@4b4c56@667fd274481cf5b07418b2fdc5d8baa6ae717239357f338cde99c2f612a96a9e@4b4649"
    );
  });
  it("should encode arrays correctly", () => {
    const value = [
      ["klv1velayazgrn6mqaqckt7utk9656h8zu3ex4ln8rx7n8p0vy4fd20qmwh4p5", "KLV"],
      ["klv1velayazgrn6mqaqckt7utk9656h8zu3ex4ln8rx7n8p0vy4fd20qmwh4p5", "KFI"],
    ];
    const type = "variadic<multi<Address,Vec<u8>>>";

    expect(abiEncoder.encodeABIValue(value, type, false)).toBe(
      "667fd274481cf5b07418b2fdc5d8baa6ae717239357f338cde99c2f612a96a9e@4b4c56@667fd274481cf5b07418b2fdc5d8baa6ae717239357f338cde99c2f612a96a9e@4b4649"
    );
  });
});
