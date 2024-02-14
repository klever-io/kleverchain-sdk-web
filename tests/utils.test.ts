import { decode } from "../lib/utils";

describe("decode simple structure", () => {
  const mockAbi = JSON.stringify({
    types: {
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
        ],
      },
    },
  });

  const mockHexValue =
    "000000055465737465010000000a0000000000000014000000011e485d212a35410fdef731419f9380a9a2984d885388a807c297d3c2cb2c467cde000000034b4c56";
  const mockType = "Teste";

  it("should decode the hex value", () => {
    const result = decode(mockHexValue, mockType, mockAbi);

    expect(result.title).toBe("Teste");
    expect(result.ok).toBe(true);
    expect(result.u32_val).toBe(10);
    expect(result.u64_val).toBe(20);
    expect(result.biguint_val).toBe(BigInt(30));
    expect(result.address_val).toBe(
      "485d212a35410fdef731419f9380a9a2984d885388a807c297d3c2cb2c467cde"
    );
    expect(result.token_val).toBe("KLV");
  });
});

describe("decode simple structure with default and zeros", () => {
  const mockAbi = JSON.stringify({
    types: {
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
        ],
      },
    },
  });

  const mockHexValue =
    "000000000000000000000000000000000000000000485d212a35410fdef731419f9380a9a2984d885388a807c297d3c2cb2c467cde000000034b4c56";
  const mockType = "Teste";

  it("should decode the hex value", () => {
    const result = decode(mockHexValue, mockType, mockAbi);

    expect(result.title).toBe("");
    expect(result.ok).toBe(false);
    expect(result.u32_val).toBe(0);
    expect(result.u64_val).toBe(0);
    expect(result.biguint_val).toBe(BigInt(0));
    expect(result.address_val).toBe(
      "485d212a35410fdef731419f9380a9a2984d885388a807c297d3c2cb2c467cde"
    );
    expect(result.token_val).toBe("KLV");
  });
});

describe("decode value with managed vec (List<>)", () => {
  const mockAbi = JSON.stringify({
    types: {
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
        ],
      },
      Teste2: {
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
            name: "values",
            type: "List<Teste>",
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
        ],
      },
    },
  });

  const mockHexValue =
    "0000000c466174686572205465737465010000006400000000000000c8000000020000000a5a65726f20546573746500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034b4c560000000b56616c7565205465737465010000000a0000000000000014000000011e485d212a35410fdef731419f9380a9a2984d885388a807c297d3c2cb2c467cde000000034b4c5600000002012c485d212a35410fdef731419f9380a9a2984d885388a807c297d3c2cb2c467cde000000034b4c56";
  const mockType = "Teste2";

  it("should decode the hex value", () => {
    const result = decode(mockHexValue, mockType, mockAbi);

    expect(result.title).toBe("Father Teste");
    expect(result.ok).toBe(true);
    expect(result.u32_val).toBe(100);
    expect(result.u64_val).toBe(200);
    expect(result.biguint_val).toBe(BigInt(300));
    expect(result.address_val).toBe(
      "485d212a35410fdef731419f9380a9a2984d885388a807c297d3c2cb2c467cde"
    );
    expect(result.token_val).toBe("KLV");
    expect(result.values.length).toBe(2);
    expect(result.values[0].title).toBe("Zero Teste");
    expect(result.values[0].ok).toBe(false);
    expect(result.values[0].u32_val).toBe(0);
    expect(result.values[0].u64_val).toBe(0);
    expect(result.values[0].biguint_val).toBe(BigInt(0));
    expect(result.values[0].address_val).toBe("0".repeat(64));
    expect(result.values[0].token_val).toBe("KLV");

    expect(result.values[1].title).toBe("Value Teste");
    expect(result.values[1].ok).toBe(true);
    expect(result.values[1].u32_val).toBe(10);
    expect(result.values[1].u64_val).toBe(20);
    expect(result.values[1].biguint_val).toBe(BigInt(30));
    expect(result.values[1].address_val).toBe(
      "485d212a35410fdef731419f9380a9a2984d885388a807c297d3c2cb2c467cde"
    );
    expect(result.values[1].token_val).toBe("KLV");
  });
});

describe("decode value with managed vec empty (List<>)", () => {
  const mockAbi = JSON.stringify({
    types: {
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
        ],
      },
      Teste2: {
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
            name: "values",
            type: "List<Teste>",
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
        ],
      },
    },
  });

  const mockHexValue =
    "0000000c466174686572205465737465010000006400000000000000c80000000000000002012c485d212a35410fdef731419f9380a9a2984d885388a807c297d3c2cb2c467cde000000034b4c56";
  const mockType = "Teste2";

  it("should decode the hex value", () => {
    const result = decode(mockHexValue, mockType, mockAbi);

    expect(result.title).toBe("Father Teste");
    expect(result.ok).toBe(true);
    expect(result.u32_val).toBe(100);
    expect(result.u64_val).toBe(200);
    expect(result.biguint_val).toBe(BigInt(300));
    expect(result.address_val).toBe(
      "485d212a35410fdef731419f9380a9a2984d885388a807c297d3c2cb2c467cde"
    );
    expect(result.token_val).toBe("KLV");
    expect(result.values.length).toBe(0);
  });
});

describe("decode value with managed vec of managed vec (List<List<>>)", () => {
  const mockAbi = JSON.stringify({
    types: {
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
        ],
      },
      Teste2: {
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
            name: "values",
            type: "List<List<Teste>>",
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
        ],
      },
    },
  });

  const mockHexValue =
    "0000000c466174686572205465737465010000006400000000000000c800000001000000020000000a5a65726f20546573746500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034b4c560000000b56616c7565205465737465010000000a0000000000000014000000011e485d212a35410fdef731419f9380a9a2984d885388a807c297d3c2cb2c467cde000000034b4c5600000002012c485d212a35410fdef731419f9380a9a2984d885388a807c297d3c2cb2c467cde000000034b4c56";
  const mockType = "Teste2";

  it("should decode the hex value", () => {
    const result = decode(mockHexValue, mockType, mockAbi);

    expect(result.title).toBe("Father Teste");
    expect(result.ok).toBe(true);
    expect(result.u32_val).toBe(100);
    expect(result.u64_val).toBe(200);
    expect(result.biguint_val).toBe(BigInt(300));
    expect(result.address_val).toBe(
      "485d212a35410fdef731419f9380a9a2984d885388a807c297d3c2cb2c467cde"
    );
    expect(result.token_val).toBe("KLV");
    expect(result.values.length).toBe(1);
    expect(result.values[0].length).toBe(2);
    expect(result.values[0][0].title).toBe("Zero Teste");
    expect(result.values[0][0].ok).toBe(false);
    expect(result.values[0][0].u32_val).toBe(0);
    expect(result.values[0][0].u64_val).toBe(0);
    expect(result.values[0][0].biguint_val).toBe(BigInt(0));
    expect(result.values[0][0].address_val).toBe("0".repeat(64));
    expect(result.values[0][0].token_val).toBe("KLV");

    expect(result.values[0][1].title).toBe("Value Teste");
    expect(result.values[0][1].ok).toBe(true);
    expect(result.values[0][1].u32_val).toBe(10);
    expect(result.values[0][1].u64_val).toBe(20);
    expect(result.values[0][1].biguint_val).toBe(BigInt(30));
    expect(result.values[0][1].address_val).toBe(
      "485d212a35410fdef731419f9380a9a2984d885388a807c297d3c2cb2c467cde"
    );
    expect(result.values[0][1].token_val).toBe("KLV");
  });
});
