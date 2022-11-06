import {
  Jewellery,
  JewelleryStorage,
  Necklace,
  PendantNecklace,
} from "./jewellery";
import { StorageHandler, Result, LeafStorageHandler, chain } from './chainOfResponsibility';

const topShelfHandler: StorageHandler = (storage, item) => {
  if (item.size() === "Small") {
    storage.box.topShelf.push(item);

    return Result.Success;
  }

  // TODO: maybe the handler should not be concerned with item type
  // storing each part of the jewellery could be the responsibility of
  // a higher-level component
  storage.box.topShelf.push((item as PendantNecklace).pendant);

  // TODO: temp fix; the result is not accurate
  // the handler was successful, but the pendant is only partially stored;
  return Result.Skipped;
};

const treeHandler: LeafStorageHandler = (storage, item) => {
  const thingToStore = item.type === "Pendant" ? item.chain : item;

  storage.tree.push(thingToStore);

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
  } else if (item._kind === "Earring") {
    if (item.type === "Hoop") {
      storage.tree.push(item);
    } else if (
      item.type === "Drop" &&
      item.stone !== "Plain"
    ) {
      storage.box.topShelf.push(item);
    } else if (item.type === "Drop") {
      storage.box.mainSection.push(item);
    }
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
