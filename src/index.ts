import {
  Jewellery,
  JewelleryStorage,
  Necklace,
  PendantNecklace,
} from "./jewellery";

type StorageHandler = (
  storage: JewelleryStorage,
  item: Necklace | PendantNecklace,
) => void;

const safeHandler =
  (storage: JewelleryStorage, item: Necklace | PendantNecklace) =>
    (nextHandler: StorageHandler) => {
      if (item.stone !== "Diamond") {
        return nextHandler(storage, item);
      }

      storage.safe.push(item);
    };

export function packNecklace(
  item: Necklace | PendantNecklace,
  storage: JewelleryStorage
) {

  const chainRoot = safeHandler(storage, item);

  chainRoot((storage, item) => {
    if (item.size() !== "Large") {
      storage.box.topShelf.push(item);
    } else if (item.type === "Pendant") {
      storage.tree.push(item.chain);
      storage.box.topShelf.push(item.pendant);
    } else {
      storage.tree.push(item);
    }
  });
}

export function pack(item: Jewellery, storage: JewelleryStorage) {
  if (storage.travelRoll.includes(item) && item.size() !== "Large")
    storage.box.topShelf.push(item);
  else if (item.stone === "Diamond") {
    storage.safe.push(item);
  } else if (item.size() === "Small") {
    storage.box.topShelf.push(item);
  } else if (item._kind === "Earring" && item.type === "Hoop") {
    storage.tree.push(item);
  } else if (
    item._kind === "Earring" &&
    item.type === "Drop" &&
    item.stone !== "Plain"
  ) {
    storage.box.topShelf.push(item);
  } else if (item._kind === "Earring" && item.type === "Drop") {
    storage.box.mainSection.push(item);
  } else if (item._kind === "Necklace" && item.type === "Pendant") {
    storage.tree.push(item.chain);
    storage.box.topShelf.push(item.pendant);
  } else if (item._kind === "Necklace") {
    storage.tree.push(item);
  } else {
    storage.dresserTop.push(item);
  }

  if (storage.travelRoll.includes(item))
    storage.travelRoll = storage.travelRoll.filter((x) => x !== item);
}

export function makeStorage(): JewelleryStorage {
  return {
    box: {
      mainSection: [],
      topShelf: [],
      ringCompartment: [],
    },

    safe: [],
    tree: [],
    dresserTop: [],
    travelRoll: [],
  };
}
