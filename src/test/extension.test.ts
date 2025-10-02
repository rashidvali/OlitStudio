import * as assert from "assert";
import { n } from "../olitcore";
import { q } from "../olitql";

suite("Olit Core Parser Tests", () => {
  test("Can parse simple object with n``", () => {
    const result = n`
	user:
		name: "Alice"
		age: 30
    `;

    assert.strictEqual(result["user"]?.name, "Alice");
    assert.strictEqual(result["user"]?.age, 30);
  });
});


suite("OlitQL Tests", () => {
  test("Can parse simple OlitQL query", () => {
    const query = q`
      from: users
      where:
        age > 21
        country == "US"
    `;

    assert.strictEqual(query.from, "users");
    assert.strictEqual(query.where?.age, "> 21");
    assert.strictEqual(query.where?.country, "US");
  });
});
