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

type ChainableStorageHandler = (nextHandler: StorageHandler | LeafStorageHandler) => StorageHandler;


const chain = (currentHandler: StorageHandler, nextHandler: StorageHandler): StorageHandler => (...args) => {
  const result = currentHandler(...args);

  if (result === Result.Skipped) {
    return nextHandler(...args);
  }

  return result;
};

const safeHandler: ChainableStorageHandler = (nextHandler) => (storage, item) => {
  if (item.stone !== "Diamond") {
    return nextHandler(storage, item);
  }

  storage.safe.push(item);
};

const topShelfHandler: ChainableStorageHandler = (nextHandler) => (storage, item) => {
  if (item.size() === "Small") {
    storage.box.topShelf.push(item);
  }

  if (item.type === "Pendant") {
    storage.box.topShelf.push(item.pendant);
  }

  return nextHandler(storage, item);
};

const treeHandler: LeafStorageHandler = (storage, item) => {
  if (item.type === "Pendant") {
    storage.tree.push(item.chain);
  } else {
    storage.tree.push(item);
  }

  return Result.Success
}

const safeHandlerV2: StorageHandler = (storage, item) => {
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
  const next1 = topShelfHandler(treeHandler);
  const chainRoot = chain(safeHandlerV2, next1);

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
