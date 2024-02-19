import {
  decodeStruct,
  decodeList,
  decodeValue,
} from "../lib/utils/abi_decoder";

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
    const result = decodeStruct(mockHexValue, mockType, mockAbi);

    expect(result.title).toBe("Teste");
    expect(result.ok).toBe(true);
    expect(result.u32_val).toBe(10);
    expect(result.u64_val).toBe(BigInt(20));
    expect(result.biguint_val).toBe(BigInt(30));
    expect(result.address_val).toBe(
      "klv1fpwjz234gy8aaae3gx0e8q9f52vymzzn3z5q0s5h60pvktzx0n0qwvtux5"
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
    const result = decodeStruct(mockHexValue, mockType, mockAbi);

    expect(result.title).toBe("");
    expect(result.ok).toBe(false);
    expect(result.u32_val).toBe(0);
    expect(result.u64_val).toBe(BigInt(0));
    expect(result.biguint_val).toBe(BigInt(0));
    expect(result.address_val).toBe(
      "klv1fpwjz234gy8aaae3gx0e8q9f52vymzzn3z5q0s5h60pvktzx0n0qwvtux5"
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
    const result = decodeStruct(mockHexValue, mockType, mockAbi);

    expect(result.title).toBe("Father Teste");
    expect(result.ok).toBe(true);
    expect(result.u32_val).toBe(100);
    expect(result.u64_val).toBe(BigInt(200));
    expect(result.biguint_val).toBe(BigInt(300));
    expect(result.address_val).toBe(
      "klv1fpwjz234gy8aaae3gx0e8q9f52vymzzn3z5q0s5h60pvktzx0n0qwvtux5"
    );
    expect(result.token_val).toBe("KLV");
    expect(result.values.length).toBe(2);
    expect(result.values[0].title).toBe("Zero Teste");
    expect(result.values[0].ok).toBe(false);
    expect(result.values[0].u32_val).toBe(0);
    expect(result.values[0].u64_val).toBe(BigInt(0));
    expect(result.values[0].biguint_val).toBe(BigInt(0));
    expect(result.values[0].address_val).toBe(
      "klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z"
    ); // zero-address
    expect(result.values[0].token_val).toBe("KLV");

    expect(result.values[1].title).toBe("Value Teste");
    expect(result.values[1].ok).toBe(true);
    expect(result.values[1].u32_val).toBe(10);
    expect(result.values[1].u64_val).toBe(BigInt(20));
    expect(result.values[1].biguint_val).toBe(BigInt(30));
    expect(result.values[1].address_val).toBe(
      "klv1fpwjz234gy8aaae3gx0e8q9f52vymzzn3z5q0s5h60pvktzx0n0qwvtux5"
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
    const result = decodeStruct(mockHexValue, mockType, mockAbi);

    expect(result.title).toBe("Father Teste");
    expect(result.ok).toBe(true);
    expect(result.u32_val).toBe(100);
    expect(result.u64_val).toBe(BigInt(200));
    expect(result.biguint_val).toBe(BigInt(300));
    expect(result.address_val).toBe(
      "klv1fpwjz234gy8aaae3gx0e8q9f52vymzzn3z5q0s5h60pvktzx0n0qwvtux5"
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
    const result = decodeStruct(mockHexValue, mockType, mockAbi);

    expect(result.title).toBe("Father Teste");
    expect(result.ok).toBe(true);
    expect(result.u32_val).toBe(100);
    expect(result.u64_val).toBe(BigInt(200));
    expect(result.biguint_val).toBe(BigInt(300));
    expect(result.address_val).toBe(
      "klv1fpwjz234gy8aaae3gx0e8q9f52vymzzn3z5q0s5h60pvktzx0n0qwvtux5"
    );
    expect(result.token_val).toBe("KLV");
    expect(result.values.length).toBe(1);
    expect(result.values[0].length).toBe(2);
    expect(result.values[0][0].title).toBe("Zero Teste");
    expect(result.values[0][0].ok).toBe(false);
    expect(result.values[0][0].u32_val).toBe(0);
    expect(result.values[0][0].u64_val).toBe(BigInt(0));
    expect(result.values[0][0].biguint_val).toBe(BigInt(0));
    expect(result.values[0][0].address_val).toBe(
      "klv1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpgm89z" // zero-address
    );
    expect(result.values[0][0].token_val).toBe("KLV");

    expect(result.values[0][1].title).toBe("Value Teste");
    expect(result.values[0][1].ok).toBe(true);
    expect(result.values[0][1].u32_val).toBe(10);
    expect(result.values[0][1].u64_val).toBe(BigInt(20));
    expect(result.values[0][1].biguint_val).toBe(BigInt(30));
    expect(result.values[0][1].address_val).toBe(
      "klv1fpwjz234gy8aaae3gx0e8q9f52vymzzn3z5q0s5h60pvktzx0n0qwvtux5"
    );
    expect(result.values[0][1].token_val).toBe("KLV");
  });
});

describe("decode single values tests", () => {
  let values = [
    {
      purpose: "Should decode 0a to 10 as u64",
      hexValue: "0a",
      type: "u64",
      expected: BigInt(10),
    },
    {
      purpose: "Should decode 0a to 10 as u32",
      hexValue: "0a",
      type: "u32",
      expected: 10,
    },
    {
      purpose: "Should decode 0a to 10 as u16",
      hexValue: "0a",
      type: "u16",
      expected: 10,
    },
    {
      purpose: "Should decode 0a to 10 as u8",
      hexValue: "0a",
      type: "u8",
      expected: 10,
    },
    {
      purpose: "Should decode 0a to 10 as i64",
      hexValue: "0a",
      type: "i64",
      expected: BigInt(10),
    },
    {
      purpose: "Should decode f6 to -10 as i64",
      hexValue: "f6",
      type: "i64",
      expected: BigInt(-10),
    },
    {
      purpose: "Should decode 03e8 to 1000 as biguint",
      hexValue: "03e8",
      type: "BigUint",
      expected: BigInt(1000),
    },
    {
      purpose: "Should decode 64 to 100 as bigint",
      hexValue: "64",
      type: "BigInt",
      expected: BigInt(100),
    },
    {
      purpose: "Should decode 9c to -100 as bigint",
      hexValue: "9c",
      type: "BigInt",
      expected: BigInt(-100),
    },
    {
      purpose: "Should decode 5465737465 to 'Teste' as string",
      hexValue: "5465737465",
      type: "ManagedBuffer",
      expected: "Teste",
    },
    {
      purpose: "Should decode 4b4c56 to 'KLV' as string",
      hexValue: "4b4c56",
      type: "TokenIdentifier",
      expected: "KLV",
    },
    {
      purpose: "Should decode 01 to true as bool",
      hexValue: "01",
      type: "bool",
      expected: true,
    },
    {
      purpose:
        "Should decode 8000000000000000 to -9223372036854775808 as BigInt",
      hexValue: "8000000000000000",
      type: "BigInt",
      expected: BigInt("-9223372036854775808"),
    },
  ];

  values.map((value) => {
    it(value.purpose, () => {
      const result = decodeValue(value.hexValue, value.type);
      expect(result).toBe(value.expected);
    });
  });
});

describe("decode struct of numbers", () => {
  const mockAbi = JSON.stringify({
    types: {
      Teste3: {
        type: "struct",
        fields: [
          {
            name: "u32_val",
            type: "u32",
          },
          {
            name: "i32_max_val",
            type: "i32",
          },
          {
            name: "i32_min_val",
            type: "i32",
          },
          {
            name: "u64_val",
            type: "u64",
          },
          {
            name: "i64_max_val",
            type: "i64",
          },
          {
            name: "i64_min_val",
            type: "i64",
          },
          {
            name: "u16_val",
            type: "u16",
          },
          {
            name: "i16_max_val",
            type: "i16",
          },
          {
            name: "i16_min_val",
            type: "i16",
          },
          {
            name: "u8_val",
            type: "u8",
          },
          {
            name: "i8_max_val",
            type: "i8",
          },
          {
            name: "i8_min_val",
            type: "i8",
          },
          {
            name: "usize_val",
            type: "u32",
          },
          {
            name: "isize_max_val",
            type: "i32",
          },
          {
            name: "isize_min_val",
            type: "i32",
          },
          {
            name: "biguint_val",
            type: "BigUint",
          },
          {
            name: "bigint_max_val",
            type: "BigInt",
          },
          {
            name: "bigint_min_val",
            type: "BigInt",
          },
        ],
      },
    },
  });

  const mockHexValue =
    "ffffffff7fffffff80000000ffffffffffffffff7fffffffffffffff8000000000000000ffff7fff8000ff7f80ffffffff7fffffff80000000000000087fffffffffffffff000000087fffffffffffffff000000088000000000000000";
  const mockType = "Teste3";

  it("should decode the hex value", () => {
    const result = decodeStruct(mockHexValue, mockType, mockAbi);

    expect(result.u32_val).toBe(4294967295);
    expect(result.i32_max_val).toBe(2147483647);
    expect(result.i32_min_val).toBe(-2147483648);
    expect(result.u64_val).toBe(BigInt("18446744073709551615"));
    expect(result.i64_max_val).toBe(BigInt("9223372036854775807"));
    expect(result.i64_min_val).toBe(BigInt("-9223372036854775808"));
    expect(result.u16_val).toBe(65535);
    expect(result.i16_max_val).toBe(32767);
    expect(result.i16_min_val).toBe(-32768);
    expect(result.u8_val).toBe(255);
    expect(result.i8_max_val).toBe(127);
    expect(result.i8_min_val).toBe(-128);
    expect(result.usize_val).toBe(4294967295);
    expect(result.isize_max_val).toBe(2147483647);
    expect(result.isize_min_val).toBe(-2147483648);
    expect(result.biguint_val).toBe(BigInt("9223372036854775807"));
    expect(result.bigint_max_val).toBe(BigInt("9223372036854775807"));
    expect(result.bigint_min_val).toBe(BigInt("-9223372036854775808"));
  });
});

describe("decode list of numbers", () => {
  let decoded = decodeList("00000001000000020304", "List<List<i8>>", "");
  expect(decoded.length).toBe(1);
  expect(decoded[0].length).toBe(2);
  expect(decoded[0][0]).toBe(3);
  expect(decoded[0][1]).toBe(4);

  let decoded2 = decodeList(
    "0000000200000002000000024b4c000000014b00000001000000034b4c56",
    "List<List<ManagedBuffer>>",
    ""
  );

  expect(decoded2.length).toBe(2);
  expect(decoded2[0].length).toBe(2);
  expect(decoded2[0][0]).toBe("KL");
  expect(decoded2[0][1]).toBe("K");
  expect(decoded2[1].length).toBe(1);
  expect(decoded2[1][0]).toBe("KLV");
});
