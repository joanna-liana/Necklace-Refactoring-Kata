import {
  Jewellery,
  JewelleryStorage,
  Necklace,
  PendantNecklace,
} from "./jewellery";
import { StorageHandler, chain, BreakChain, ContinueChain } from './chainOfResponsibility';


const smallItems: StorageHandler = (storage: JewelleryStorage, item: Jewellery) => {
  if (item.size() === "Small") {
    storage.box.topShelf.push(item);

    if (storage.travelRoll.includes(item)) {
      return BreakChain;
    }
  }

  return ContinueChain;
}

const earrings: StorageHandler = (storage: JewelleryStorage, item: Jewellery) => {
  if (item._kind !== "Earring") {
    return ContinueChain;
  }

  if (item.type === "Hoop") {
    storage.tree.push(item);

    return BreakChain;
  }

  if (item.stone !== "Plain") {
    storage.box.topShelf.push(item);
  }

  return ContinueChain;
}

const necklaces: StorageHandler = (storage: JewelleryStorage, item: Jewellery) => {
  if (item._kind === "Necklace" && item.type === "Pendant") {
    storage.box.topShelf.push(item.pendant);
  }

  return ContinueChain;
}

const diamonds: StorageHandler = (storage: JewelleryStorage, item: Jewellery) => {
  if (item.stone !== "Diamond") {
    return ContinueChain;
  }

  storage.safe.push(item);

  return BreakChain;
}

const packTree: StorageHandler = (storage: JewelleryStorage, item: Jewellery) => {
  if (item._kind === "Necklace") {
    if (item.type === "Pendant") {
      storage.tree.push(item.chain);

      return ContinueChain;
    } else {
      storage.tree.push(item);

      return BreakChain;
    }
  }

  return ContinueChain;
}

const packMainSection: StorageHandler = (storage: JewelleryStorage, item: Jewellery) => {
  if (item._kind === "Earring" && item.stone === "Plain") {
    storage.box.mainSection.push(item);

    return BreakChain;
  }

  return ContinueChain;
}

const packDresserTop = (storage: JewelleryStorage, item: Jewellery) => {
  storage.dresserTop.push(item);

  return ContinueChain;
}

const packTravelRoll = (storage: JewelleryStorage, item: Jewellery) => {
  storage.travelRoll = storage.travelRoll.filter((x) => x !== item);

  return BreakChain;
}

// TODO: defactor/refactor to make the CoR focused on item instead of storage
export function pack(item: Jewellery, storage: JewelleryStorage) {
  const next4 = chain(packDresserTop, packTravelRoll);
  const next3 = chain(packMainSection, next4);
  const next2 = chain(packTree, next3);
  const next1 = chain(diamonds, next2);
  const chainRoot = chain(chain(smallItems, chain(earrings, necklaces)), next1);

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
