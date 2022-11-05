import { makeStorage, packNecklace } from ".";
import {
  JewelleryStorage,
  makeNecklace,
  makePendantNecklace,
  makeRing,
} from "./jewellery";

describe("The packer", () => {
  const ANY_STONE = "Amber";

  let storage: JewelleryStorage;

  beforeEach(() => {
    storage = makeStorage();
  });

  it("When packing a ring", () => {
    const ring = makeRing(ANY_STONE);
    expect(ring.size()).toBe("Small");
  });

  describe("when packing a necklace", () => {
    const SMALL_TYPE = "Chain";
    const ANY_TYPE = SMALL_TYPE;

    it("with diamond", () => {
      const necklace = makeNecklace("Diamond", ANY_TYPE);

      packNecklace(necklace, storage);

      expect(storage.safe[0]).toStrictEqual(necklace);
    });

    describe("with other stones", () => {
      it("small", () => {
        const necklace = makeNecklace(ANY_STONE, SMALL_TYPE);

        packNecklace(necklace, storage);

        expect(storage.box.topShelf[0]).toStrictEqual(necklace);
      });

      describe("large", () => {
        const LARGE_TYPE = "Beads";

        it("pendant", () => {
          const necklace = makePendantNecklace(ANY_STONE, LARGE_TYPE);

          packNecklace(necklace, storage);

          expect(storage.tree[0]).toStrictEqual(necklace.chain);
          expect(storage.box.topShelf[0]).toStrictEqual(necklace.pendant);
        });

        it("others", () => {
          const necklace = makeNecklace(ANY_STONE, LARGE_TYPE);

          packNecklace(necklace, storage);

          expect(storage.tree[0]).toStrictEqual(necklace);
        });
      });
    });
  });
});
