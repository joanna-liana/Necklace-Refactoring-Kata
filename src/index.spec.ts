import { makeStorage, pack, packNecklace } from ".";
import {
  JewelleryStorage,
  makeEarring,
  makeNecklace,
  makePendantNecklace,
  makeRing,
} from "./jewellery";

describe("The packer", () => {
  const ANY_STONE = "Amber";

  const LARGE_TYPE = "Beads";
  const SMALL_TYPE = "Chain";
  const ANY_TYPE = SMALL_TYPE;

  let storage: JewelleryStorage;

  beforeEach(() => {
    storage = makeStorage();
  });

  it("When packing a ring", () => {
    const ring = makeRing(ANY_STONE);
    expect(ring.size()).toBe("Small");
  });

  describe("when packing a necklace", () => {


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

  describe("when packing a jewellery item", () => {

    describe("given the travel roll already includes an item", () => {
      it("a small item", () => {
        const smallItem = makeRing(ANY_STONE);
        storage.travelRoll.push(smallItem);

        pack(smallItem, storage);

        expect(storage.box.topShelf[0]).toStrictEqual(smallItem);
      });

      it("a large item", () => {
        const largeItem = makePendantNecklace(ANY_STONE, LARGE_TYPE);
        storage.travelRoll.push(largeItem);
        expect(storage.travelRoll[0]).toStrictEqual(largeItem);

        pack(largeItem, storage);

        expect(storage.travelRoll).toHaveLength(0);
      });
    });

    it("with diamond", () => {
      const smallItem = makeRing("Diamond");

      pack(smallItem, storage);

      expect(storage.safe[0]).toStrictEqual(smallItem);
    });

    describe("with other stones", () => {
      it("a small item", () => {
        const smallItem = makeRing(ANY_STONE);

        pack(smallItem, storage);

        expect(storage.box.topShelf[0]).toStrictEqual(smallItem);
      });

      describe("a large item", () => {
        describe("earring", () => {
          it("of type hoop", () => {
            const item = makeEarring(ANY_STONE, "Hoop");

            pack(item, storage);

            expect(storage.tree[0]).toStrictEqual(item);
          })
        })
      })
    });
  })
});
