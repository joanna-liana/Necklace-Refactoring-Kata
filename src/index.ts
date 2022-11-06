import {
  Jewellery,
  JewelleryStorage,
  Necklace,
  PendantNecklace,
} from "./jewellery";

enum Result {
  Success = 'Success',
  Skipped = 'Skipped'
  // TODO: later Failure can be added to enhance error reporting
}

type LeafStorageHandler = (
  storage: JewelleryStorage,
  item: Necklace | PendantNecklace,
) => Result;

type StorageHandler = (
  storage: JewelleryStorage,
  item: Necklace | PendantNecklace,
) => Result;


const chain = (currentHandler: StorageHandler, nextHandler: StorageHandler): StorageHandler => (...args) => {
  const result = currentHandler(...args);

  if (result === Result.Skipped) {
    return nextHandler(...args);
  }

  return result;
};
const topShelfHandler: StorageHandler = (storage, item) => {
  if (item.size() === "Small") {
    storage.box.topShelf.push(item);

    return Result.Success;
  }

  // TODO: this path skips futher processing of the necklace
  // even though just the pendant has been stored
  if (item.type === "Pendant") {
    storage.box.topShelf.push(item.pendant);

    // TODO: tmep fix; the result is not accurate
    // the handler was successful, but the pendant is only partially stored;
    return Result.Skipped;
  }

  return Result.Skipped;
};

const treeHandler: LeafStorageHandler = (storage, item) => {
  if (item.type === "Pendant") {
    storage.tree.push(item.chain);
  } else {
    storage.tree.push(item);
  }

  return Result.Success
}

const safeHandler: StorageHandler = (storage, item) => {
  if (item.stone !== "Diamond") {
    return Result.Skipped;
  }

  storage.safe.push(item);

  return Result.Success;
};

export function packNecklace(
  item: Necklace | PendantNecklace,
  storage: JewelleryStorage
) {
  const lastInChain = chain(topShelfHandler, treeHandler);
  const chainRoot = chain(safeHandler, lastInChain);

  chainRoot(storage, item);
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
