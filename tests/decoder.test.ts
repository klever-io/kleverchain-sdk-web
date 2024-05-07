import {
  decodeStruct,
  decodeList,
  decodeValue,
  decode,
} from "../lib/utils/abi_decoder";

describe("decodeStruct: should decode simple structure", () => {
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

describe("decodeStruct: should decode simple structure with default and zeros", () => {
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

describe("decodeStruct: should decode value with managed vec (List<>)", () => {
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

describe("decodeStruct: should decode value with managed vec empty (List<>)", () => {
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

describe("decodeStruct: should decode value with managed vec of managed vec (List<List<>>)", () => {
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

describe("decodeValue: should decode all values", () => {
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
    {
      purpose:
        "Should decode 01000000055465737465 to Teste as Option<ManagedBuffer>",
      hexValue: "01000000055465737465",
      type: "Option<ManagedBuffer>",
      expected: "Teste",
    },
    {
      purpose: "Should decode '' to null as Option<ManagedBuffer>",
      hexValue: "",
      type: "Option<ManagedBuffer>",
      expected: null,
    },
  ];

  values.map((value) => {
    it(value.purpose, () => {
      const result = decodeValue(value.hexValue, value.type);
      expect(result).toBe(value.expected);
    });
  });
});

describe("decodeStruct: should decode struct of numbers", () => {
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

describe("decodeList: should decode list of numbers", () => {
  let decoded = decodeList("000000020304", "List<i8>", "");
  expect(decoded.length).toBe(1);
  expect(decoded[0].length).toBe(2);
  expect(decoded[0][0]).toBe(3);
  expect(decoded[0][1]).toBe(4);

  let decoded2 = decodeList(
    "00000002000000024b4c000000014b00000001000000034b4c56",
    "List<ManagedBuffer>",
    ""
  );

  expect(decoded2.length).toBe(2);
  expect(decoded2[0].length).toBe(2);
  expect(decoded2[0][0]).toBe("KL");
  expect(decoded2[0][1]).toBe("K");
  expect(decoded2[1].length).toBe(1);
  expect(decoded2[1][0]).toBe("KLV");
});

describe("decodeStruct: should struct with option types", () => {
  let abi = JSON.stringify({
    types: {
      Testing: {
        type: "struct",
        fields: [
          {
            name: "opt_1",
            type: "Option<bytes>",
          },
          {
            name: "opt_2",
            type: "Option<bytes>",
          },
          {
            name: "m_opt_1",
            type: "Option<bytes>",
          },
          {
            name: "m_opt_2",
            type: "Option<bytes>",
          },
        ],
      },
    },
  });

  let hex = "0001000000055465737465000100000006546573746532";
  let type = "Testing";
  let result = decodeStruct(hex, type, abi);

  expect(result.opt_1).toBe(null);
  expect(result.opt_2).toBe("Teste");
  expect(result.m_opt_1).toBe(null);
  expect(result.m_opt_2).toBe("Teste2");
});

describe("decodeList: should decode struct with Optionals and List", () => {
  const abi = JSON.stringify({
    types: {
      CrowdfundingData: {
        type: "struct",
        fields: [
          {
            name: "id",
            type: "bytes",
          },
          {
            name: "title",
            type: "bytes",
          },
          {
            name: "logo",
            type: "bytes",
          },
          {
            name: "description",
            type: "bytes",
          },
          {
            name: "owner",
            type: "Address",
          },
          {
            name: "token",
            type: "TokenIdentifier",
          },
          {
            name: "balance",
            type: "BigUint",
          },
          {
            name: "claimed",
            type: "BigUint",
          },
          {
            name: "target",
            type: "BigUint",
          },
          {
            name: "donators",
            type: "u64",
          },
          {
            name: "deadline",
            type: "u64",
          },
        ],
      },
    },
  });

  const hex =
    "000000107072696d656972612d76616b696e6861000000105072696d656972612056616b696e68610000003b66696e746563682e636f6d2e62722f6170702f75706c6f6164732f323031392f30382f6f2d7175652d652d63726f776466756e64696e672e6a706700000015756d612064657363726963616f206d616e65697261f64e21227e8df59be638d00acfafdeb70d6a678d6eee4d929cbb143bb1edc3e6000000034b4c5600000000000000000000000502540be40000000000000000000000000065ecfd9f";

  const type = "CrowdfundingData";
  const result = decodeList(hex, type, abi);

  expect(result.length).toBe(1);

  const hex2 =
    "000000107072696d656972612d76616b696e6861000000105072696d656972612056616b696e68610000003b66696e746563682e636f6d2e62722f6170702f75706c6f6164732f323031392f30382f6f2d7175652d652d63726f776466756e64696e672e6a706700000015756d612064657363726963616f206d616e65697261f64e21227e8df59be638d00acfafdeb70d6a678d6eee4d929cbb143bb1edc3e6000000034b4c5600000000000000000000000502540be40000000000000000000000000065ecfd9f0000000f736567756e64612d76616b696e68610000000f536567756e64612056616b696e68610000003b66696e746563682e636f6d2e62722f6170702f75706c6f6164732f323031392f30382f6f2d7175652d652d63726f776466756e64696e672e6a706700000015756d612064657363726963616f206d616e65697261f64e21227e8df59be638d00acfafdeb70d6a678d6eee4d929cbb143bb1edc3e6000000034b4c5600000000000000000000000502540be40000000000000000000000000065ecfd9f";
  const type2 = "CrowdfundingData";
  const result2 = decodeList(hex2, type2, abi);

  expect(result2.length).toBe(2);
});

describe("decodeList: decode default types on List", () => {
  const abi = JSON.stringify({
    types: {
      CrowdfundingData: {
        type: "struct",
        fields: [
          {
            name: "id",
            type: "bytes",
          },
          {
            name: "title",
            type: "bytes",
          },
          {
            name: "logo",
            type: "bytes",
          },
          {
            name: "description",
            type: "bytes",
          },
          {
            name: "owner",
            type: "Address",
          },
          {
            name: "token",
            type: "TokenIdentifier",
          },
          {
            name: "balance",
            type: "BigUint",
          },
          {
            name: "claimed",
            type: "BigUint",
          },
          {
            name: "target",
            type: "BigUint",
          },
          {
            name: "donators",
            type: "u64",
          },
          {
            name: "deadline",
            type: "u64",
          },
        ],
      },
    },
  });

  const hex =
    "000000107072696d656972612d76616b696e6861000000105072696d656972612056616b696e68610000003b66696e746563682e636f6d2e62722f6170702f75706c6f6164732f323031392f30382f6f2d7175652d652d63726f776466756e64696e672e6a706700000015756d612064657363726963616f206d616e65697261f64e21227e8df59be638d00acfafdeb70d6a678d6eee4d929cbb143bb1edc3e6000000034b4c5600000000000000000000000502540be40000000000000000000000000065ecfd9f";

  const type = "CrowdfundingData";
  const result = decodeList(hex, type, abi);

  expect(result.length).toBe(1);

  const hex2 =
    "000000107072696d656972612d76616b696e6861000000105072696d656972612056616b696e68610000003b66696e746563682e636f6d2e62722f6170702f75706c6f6164732f323031392f30382f6f2d7175652d652d63726f776466756e64696e672e6a706700000015756d612064657363726963616f206d616e65697261f64e21227e8df59be638d00acfafdeb70d6a678d6eee4d929cbb143bb1edc3e6000000034b4c5600000000000000000000000502540be40000000000000000000000000065ecfd9f0000000f736567756e64612d76616b696e68610000000f536567756e64612056616b696e68610000003b66696e746563682e636f6d2e62722f6170702f75706c6f6164732f323031392f30382f6f2d7175652d652d63726f776466756e64696e672e6a706700000015756d612064657363726963616f206d616e65697261f64e21227e8df59be638d00acfafdeb70d6a678d6eee4d929cbb143bb1edc3e6000000034b4c5600000000000000000000000502540be40000000000000000000000000065ecfd9f";
  const type2 = "CrowdfundingData";
  const result2 = decodeList(hex2, type2, abi);

  expect(result2.length).toBe(2);
});

describe("decode: should decode variadic List", () => {
  const abi = JSON.stringify({
    endpoints: [
      {
        name: "winnersInfo",
        mutability: "readonly",
        outputs: [
          {
            type: "variadic<WinnerInfo>",
            multi_result: true,
          },
        ],
      },
      {
        name: "variadic_i64",
        mutability: "readonly",
        outputs: [
          {
            type: "variadic<i64>",
            multi_result: true,
          },
        ],
      },
    ],
    types: {
      WinnerInfo: {
        type: "struct",
        fields: [
          {
            name: "drawn_ticket_number",
            type: "u32",
          },
          {
            name: "winner_address",
            type: "Address",
          },
          {
            name: "prize",
            type: "BigUint",
          },
        ],
      },
    },
  });

  it("should decode WinnersInfo Struct inside a variadic", () => {
    const hex =
    "00000003667fd274481cf5b07418b2fdc5d8baa6ae717239357f338cde99c2f612a96a9e0000000403938700";

    const result = decode(abi,hex,"winnersInfo");

    expect(result?.drawn_ticket_number).toBe(3);
    expect(result?.winner_address).toBe("klv1velayazgrn6mqaqckt7utk9656h8zu3ex4ln8rx7n8p0vy4fd20qmwh4p5");
    expect(result?.prize).toBe(BigInt(60000000));

  })

  it("should decode i64 inside a variadic", () => {
    const hex =
    "049075ea";

    const result = decode(abi,hex,"variadic_i64");

    expect(result).toBe(BigInt(76576234));
  })
});

describe("decode: should struct with option types", () => {
  let abi = JSON.stringify({
    endpoints: [
      {
        name: "getTesting",
        mutability: "readonly",
        outputs: [
          {
            type: "Testing",
          },
        ],
      },
    ],
    types: {
      Testing: {
        type: "struct",
        fields: [
          {
            name: "opt_1",
            type: "Option<bytes>",
          },
          {
            name: "opt_2",
            type: "Option<bytes>",
          },
          {
            name: "m_opt_1",
            type: "Option<bytes>",
          },
          {
            name: "m_opt_2",
            type: "Option<bytes>",
          },
        ],
      },
    },
  });

  let hex = "0001000000055465737465000100000006546573746532";
  let result = decode(abi, hex, "getTesting");

  expect(result.opt_1).toBe(null);
  expect(result.opt_2).toBe("Teste");
  expect(result.m_opt_1).toBe(null);
  expect(result.m_opt_2).toBe("Teste2");
});

describe("decode: should decode all values", () => {
  const abi = JSON.stringify({
    endpoints: [
      {
        name: "getu64",
        mutability: "readonly",
        outputs: [
          {
            type: "u64",
          },
        ],
      },
      {
        name: "getu32",
        mutability: "readonly",
        outputs: [
          {
            type: "u32",
          },
        ],
      },
      {
        name: "getu16",
        mutability: "readonly",
        outputs: [
          {
            type: "u16",
          },
        ],
      },
      {
        name: "getu8",
        mutability: "readonly",
        outputs: [
          {
            type: "u8",
          },
        ],
      },
      {
        name: "geti64",
        mutability: "readonly",
        outputs: [
          {
            type: "i64",
          },
        ],
      },
      {
        name: "getBigUint",
        mutability: "readonly",
        outputs: [
          {
            type: "BigUint",
          },
        ],
      },
      {
        name: "getBigInt",
        mutability: "readonly",
        outputs: [
          {
            type: "BigInt",
          },
        ],
      },
      {
        name: "getManagedBuffer",
        mutability: "readonly",
        outputs: [
          {
            type: "ManagedBuffer",
          },
        ],
      },
      {
        name: "getTokenIdentifier",
        mutability: "readonly",
        outputs: [
          {
            type: "TokenIdentifier",
          },
        ],
      },
      {
        name: "getBool",
        mutability: "readonly",
        outputs: [
          {
            type: "bool",
          },
        ],
      },
      {
        name: "getOptionManagedBuffer",
        mutability: "readonly",
        outputs: [
          {
            type: "Option<ManagedBuffer>",
          },
        ],
      },
    ],
  });

  let values = [
    {
      purpose: "Should decode 0a to 10 as u64",
      hexValue: "0a",
      endpoint: "getu64",
      expected: BigInt(10),
    },
    {
      purpose: "Should decode 0a to 10 as u32",
      hexValue: "0a",
      endpoint: "getu32",
      expected: 10,
    },
    {
      purpose: "Should decode 0a to 10 as u16",
      hexValue: "0a",
      endpoint: "getu16",
      expected: 10,
    },
    {
      purpose: "Should decode 0a to 10 as u8",
      hexValue: "0a",
      endpoint: "getu8",
      expected: 10,
    },
    {
      purpose: "Should decode 0a to 10 as i64",
      hexValue: "0a",
      endpoint: "geti64",
      expected: BigInt(10),
    },
    {
      purpose: "Should decode f6 to -10 as i64",
      hexValue: "f6",
      endpoint: "geti64",
      expected: BigInt(-10),
    },
    {
      purpose: "Should decode 03e8 to 1000 as biguint",
      hexValue: "03e8",
      endpoint: "getBigUint",
      expected: BigInt(1000),
    },
    {
      purpose: "Should decode 64 to 100 as bigint",
      hexValue: "64",
      endpoint: "getBigInt",
      expected: BigInt(100),
    },
    {
      purpose: "Should decode ae to -82 as bigint",
      hexValue: "ae",
      endpoint: "getBigInt",
      expected: BigInt(-82),
    },
    {
      purpose: "Should decode 52 to 82 as bigint",
      hexValue: "52",
      endpoint: "getBigInt",
      expected: BigInt(82),
    },
    {
      purpose: "Should decode dede to -8482 as bigint",
      hexValue: "dede",
      endpoint: "getBigInt",
      expected: BigInt(-8482),
    },
    {
      purpose: "Should decode 2122 to 8482 as bigint",
      hexValue: "2122",
      endpoint: "getBigInt",
      expected: BigInt(8482),
    },
    {
      purpose: "Should decode 05F5E100 to 100000000 as bigint",
      hexValue: "05F5E100",
      endpoint: "getBigInt",
      expected: BigInt("100000000"),
    },
    {
      purpose: "Should decode FA0A1F00 to -100000000 as bigint",
      hexValue: "FA0A1F00",
      endpoint: "getBigInt",
      expected: BigInt(-100000000),
    },
    {
      purpose: "Should decode C91131A14FC23DAC to -3958328028584329812 as bigint",
      hexValue: "C91131A14FC23DAC",
      endpoint: "getBigInt",
      expected: BigInt("-3958328028584329812"),
    },
    {
      purpose: "Should decode 36EECE5EB03DC254 to 3958328028584329812 as bigint",
      hexValue: "36EECE5EB03DC254",
      endpoint: "getBigInt",
      expected: BigInt("3958328028584329812"),
    },
    {
      purpose: "Should decode 9c to -100 as bigint",
      hexValue: "9c",
      endpoint: "getBigInt",
      expected: BigInt(-100),
    },
    {
      purpose: "Should decode 3130 to 10 as bigint - string",
      hexValue: "3130",
      endpoint: "getBigInt",
      expected: BigInt(10),
    },
    {
      purpose: "Should decode 2D3130 to -10 as bigint - string",
      hexValue: "2D3130",
      endpoint: "getBigInt",
      expected: BigInt(-10),
    },
    {
      purpose: "Should decode 393833343735393337343536383932343739363738383930313736393831393038353637383935373639303738353132393836373938323537 to 983475937456892479678890176981908567895769078512986798257 as bigint - string",
      hexValue: "393833343735393337343536383932343739363738383930313736393831393038353637383935373639303738353132393836373938323537",
      endpoint: "getBigInt",
      expected: BigInt("983475937456892479678890176981908567895769078512986798257"),
    },
    {
      purpose: "Should decode 2d393833343735393337343536383932343739363738383930313736393831393038353637383935373639303738353132393836373938323537 to -983475937456892479678890176981908567895769078512986798257 as bigint - string",
      hexValue: "2d393833343735393337343536383932343739363738383930313736393831393038353637383935373639303738353132393836373938323537",
      endpoint: "getBigInt",
      expected: BigInt("-983475937456892479678890176981908567895769078512986798257"),
    },
    {
      purpose: "Should decode 5465737465 to 'Teste' as string",
      hexValue: "5465737465",
      endpoint: "getManagedBuffer",
      expected: "Teste",
    },
    {
      purpose: "Should decode 4b4c56 to 'KLV' as string",
      hexValue: "4b4c56",
      endpoint: "getTokenIdentifier",
      expected: "KLV",
    },
    {
      purpose: "Should decode 01 to true as bool",
      hexValue: "01",
      endpoint: "getBool",
      expected: true,
    },
    {
      purpose:
        "Should decode 8000000000000000 to -9223372036854775808 as BigInt",
      hexValue: "8000000000000000",
      endpoint: "getBigInt",
      expected: BigInt("-9223372036854775808"),
    },
    {
      purpose:
        "Should decode 01000000055465737465 to Teste as Option<ManagedBuffer>",
      hexValue: "01000000055465737465",
      endpoint: "getOptionManagedBuffer",
      expected: "Teste",
    },
    {
      purpose: "Should decode '' to null as Option<ManagedBuffer>",
      hexValue: "",
      endpoint: "getOptionManagedBuffer",
      expected: null,
    },
  ];

  values.map((value) => {
    it(value.purpose, () => {
      const result = decode(abi, value.hexValue, value.endpoint);
      expect(result).toBe(value.expected);
    });
  });
});

describe("decode: should decode a tuple", () => {
  const abi = JSON.stringify({
    endpoints: [
      {
        name: "getTuple",
        mutability: "readonly",
        inputs: [],
        outputs: [
          {
            type: "tuple<BigUint,bytes,Address>",
          },
        ],
      },
    ],
  });

  const hex =
    "0000000203e80000000474657374000000000000000005002e8ba478ded59c31ddea4f6f3a8c39dd5942d167c3e6";

  const result = decode(abi, hex, "getTuple");

  expect(result._0).toBe(BigInt(1000));
  expect(result._1).toBe("test");
  expect(result._2).toBe(
    "klv1qqqqqqqqqqqqqpgq9696g7x76kwrrh02fahn4rpem4v595t8c0nqgxzpmu"
  );
});

describe("decode: should decode a tuple with a list inside", () => {
  const abi = JSON.stringify({
    endpoints: [
      {
        name: "getTuple",
        mutability: "readonly",
        inputs: [],
        outputs: [
          {
            type: "tuple<BigUint,List<bytes>,Address>",
          },
        ],
      },
    ],
  });

  const hex =
    "0000000203e8000000020000000474657374000000057465737432000000000000000005002e8ba478ded59c31ddea4f6f3a8c39dd5942d167c3e6";

  const result = decode(abi, hex, "getTuple");

  expect(result._0).toBe(BigInt(1000));
  expect(result._1).toBeInstanceOf(Array);
  expect(result._1.length).toBe(2);
  expect(result._1[0]).toBe("test");
  expect(result._1[1]).toBe("test2");
  expect(result._2).toBe(
    "klv1qqqqqqqqqqqqqpgq9696g7x76kwrrh02fahn4rpem4v595t8c0nqgxzpmu"
  );
});