import {
  Jewellery,
  JewelleryStorage,
  Necklace,
  PendantNecklace,
} from "./jewellery";
import { StorageHandler, Result, chain } from './chainOfResponsibility';


const packTopShelf: StorageHandler = (storage: JewelleryStorage, item: Jewellery) => {
  if (storage.travelRoll.includes(item) && item.size() !== "Large") {
    storage.box.topShelf.push(item);

    return Result.Success;
  }

  if (item.size() === "Small" || item._kind === "Earring" && item.type !== "Hoop" && item.stone !== "Plain") {
    storage.box.topShelf.push(item);

    // TODO: temp fix; the result is not accurate
    // the handler was successful, but the item is only partially stored;
    return Result.Skipped;
  }

  if (item._kind === "Necklace" && item.type === "Pendant") {
    storage.box.topShelf.push(item.pendant);

    // TODO: temp fix; the result is not accurate
    // the handler was successful, but the item is only partially stored;
    return Result.Skipped;
  }

  return Result.Skipped;
}

const packSafe: StorageHandler = (storage: JewelleryStorage, item: Jewellery) => {
  if (item.stone !== "Diamond") {
    return Result.Skipped;
  }

  storage.safe.push(item);

  return Result.Success;
}

const packTree: StorageHandler = (storage: JewelleryStorage, item: Jewellery) => {
  if (item._kind === "Earring" && item.type === "Hoop") {
    storage.tree.push(item);

    return Result.Success;
  } else if (item._kind === "Necklace") {
    if (item.type === "Pendant") {
      storage.tree.push(item.chain);

      // TODO: temp fix; the result is not accurate
      // the handler was successful, but the pendant is only partially stored;
      return Result.Skipped;
    } else {
      storage.tree.push(item);

      return Result.Success;
    }
  }

  return Result.Skipped;
}

const packMainSection: StorageHandler = (storage: JewelleryStorage, item: Jewellery) => {
  if (item._kind === "Earring" && item.stone === "Plain") {
    storage.box.mainSection.push(item);

    return Result.Success;
  }

  return Result.Skipped;
}

const packDresserTop = (storage: JewelleryStorage, item: Jewellery) => {
  storage.dresserTop.push(item);

  // TODO: temp fix; the result is not accurate
  // the item was stored, but further handlers still need to be called;
  return Result.Skipped;
}

const packTravelRoll = (storage: JewelleryStorage, item: Jewellery) => {
  storage.travelRoll = storage.travelRoll.filter((x) => x !== item);

  return Result.Success;
}

// TODO: defactor/refactor to make the CoR focused on item instead of storage
export function pack(item: Jewellery, storage: JewelleryStorage) {
  const next4 = chain(packDresserTop, packTravelRoll);
  const next3 = chain(packMainSection, next4);
  const next2 = chain(packTree, next3);
  const next1 = chain(packSafe, next2);
  const chainRoot = chain(packTopShelf, next1);

  return chainRoot(storage, item);
}

export function packNecklace(
  item: Necklace | PendantNecklace,
  storage: JewelleryStorage
) {
  return pack(item, storage)
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
