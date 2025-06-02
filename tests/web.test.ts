import { describe, expect, it } from "vitest";
import { web } from "../lib";

describe("web", () => {
  it('should return "true" for valid KLV address, when called without chain', () => {
    const validKlvAddress =
      "klv1fpwjz234gy8aaae3gx0e8q9f52vymzzn3z5q0s5h60pvktzx0n0qwvtux5";

    expect(web.isKleverAccount(validKlvAddress)).toBe(true);
  });

  it('should return "false" for invalid KLV address, when called without chain', () => {
    const invalidKlvAddress_start =
      "eth1fpwjz234gy8aaae3gx0e8q9f52vymzzn3z5q0s5h60pvktzx0n0qwvtux5";
    const invalidKlvAddress_length =
      "klv1fpwjz234gy8aaae3gx0e8q9f52vymzzn3z5q0s5h60pvktzx0n0qwvtux";
    const invalidKlvAddress_invalidChars =
      "klv1fpwjz234gy8aaae3gx0e8q9f52vymzzn3z5q0s5h60pvktzx0n0qwvtux5!";

    expect(web.isKleverAccount(invalidKlvAddress_start)).toBe(false);
    expect(web.isKleverAccount(invalidKlvAddress_length)).toBe(false);
    expect(web.isKleverAccount(invalidKlvAddress_invalidChars)).toBe(false);
  });

  it('should return "true" for valid KLV address, when called with chain "KLV" or 1', () => {
    const validKlvAddress =
      "klv1fpwjz234gy8aaae3gx0e8q9f52vymzzn3z5q0s5h60pvktzx0n0qwvtux5";

    expect(web.isKleverAccount(validKlvAddress, "KLV")).toBe(true);
    expect(web.isKleverAccount(validKlvAddress, 1)).toBe(true);
  });
});
