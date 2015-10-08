import { AcceptBus, Bus, BufferedBus } from "..";
import sift from "sift";
import co from "co";
import expect from "expect.js";

describe(__filename + "#", function() {

  it("is a bus", function() {
    expect(new AcceptBus()).to.be.an(Bus);
  });

  it("can redirect an operation according to the accept bus filter", co.wrap(function*() {
    var bus = new AcceptBus(
      sift({ name: "op1" }),
      new BufferedBus(void 0, "a"),
      new BufferedBus(void 0, "b")
    );

    expect((yield bus.execute({ name: "op1" }).read()).value).to.be("a");
    expect((yield bus.execute({ name: "op2" }).read()).value).to.be("b");
  }));

  it("no-ops the accept bus if it's null", co.wrap(function*() {
    var bus = new AcceptBus(
      sift({ name: "op1" }),
      void 0,
      new BufferedBus(void 0, "b")
    );

    var chunk = yield bus.execute({ name: "op1" }).read();

    expect(chunk.value).to.be(void 0);
    expect(chunk.done).to.be(true);
  }));

  it("no-ops the reject bus if it's null", co.wrap(function*() {
    var bus = new AcceptBus(
      sift({ name: "op1" })
    );

    var chunk = yield bus.execute({ name: "op2" }).read();

    expect(chunk.value).to.be(void 0);
    expect(chunk.done).to.be(true);
  }));
});