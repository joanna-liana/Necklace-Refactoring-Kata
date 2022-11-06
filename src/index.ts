import {
  Jewellery,
  JewelleryStorage,
  Necklace,
  PendantNecklace,
} from "./jewellery";
import { StorageHandler, Result, chain } from './chainOfResponsibility';

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

const treeHandler: StorageHandler = (storage, item) => {
  const thingToStore = (item as Necklace | PendantNecklace).type === "Pendant" ? (item as PendantNecklace).chain : item;

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

export function pack(item: Jewellery, storage: JewelleryStorage) {
  const baseHandler: StorageHandler = (storage, item) => {
    if (item._kind === "Earring") {
      if (item.type === "Hoop") {
        storage.tree.push(item);
      } else if (item.stone === "Plain") {
        storage.box.mainSection.push(item);
      }
    } else if (item._kind === "Necklace") {
      if (item.type === "Pendant") {
        storage.tree.push(item.chain);
      } else {
        storage.tree.push(item);
      }
    } else {
      storage.dresserTop.push(item);
    }

    storage.travelRoll = storage.travelRoll.filter((x) => x !== item);

    return Result.Success;
  }

  const next1 = chain(packSafe, baseHandler);
  const chainRoot = chain(packTopShelf, next1);

  return chainRoot(storage, item);
}

const packTree = (storage: JewelleryStorage, item: Jewellery) => {
  if (storage.travelRoll.includes(item) && item.size() !== "Large")
    storage.box.topShelf.push(item);
  else if (item.stone === "Diamond") {
    storage.safe.push(item);
  } else if (item.size() === "Small") {
    storage.box.topShelf.push(item);
  } else if (item._kind === "Earring") {
    if (item.type === "Hoop") {
      storage.tree.push(item);
    } else if (item.stone === "Plain") {
      storage.box.mainSection.push(item);
    } else {
      storage.box.topShelf.push(item);
    }
  } else if (item._kind === "Necklace") {
    if (item.type === "Pendant") {
      storage.tree.push(item.chain);
      storage.box.topShelf.push(item.pendant);
    } else {
      storage.tree.push(item);
    }
  } else {
    storage.dresserTop.push(item);
  }

  storage.travelRoll = storage.travelRoll.filter((x) => x !== item);
}

const packMainSection = (storage: JewelleryStorage, item: Jewellery) => {
  if (storage.travelRoll.includes(item) && item.size() !== "Large")
    storage.box.topShelf.push(item);
  else if (item.stone === "Diamond") {
    storage.safe.push(item);
  } else if (item.size() === "Small") {
    storage.box.topShelf.push(item);
  } else if (item._kind === "Earring") {
    if (item.type === "Hoop") {
      storage.tree.push(item);
    } else if (item.stone === "Plain") {
      storage.box.mainSection.push(item);
    } else {
      storage.box.topShelf.push(item);
    }
  } else if (item._kind === "Necklace") {
    if (item.type === "Pendant") {
      storage.tree.push(item.chain);
      storage.box.topShelf.push(item.pendant);
    } else {
      storage.tree.push(item);
    }
  } else {
    storage.dresserTop.push(item);
  }

  storage.travelRoll = storage.travelRoll.filter((x) => x !== item);
}

const packDresserTop = (storage: JewelleryStorage, item: Jewellery) => {
  if (storage.travelRoll.includes(item) && item.size() !== "Large")
    storage.box.topShelf.push(item);
  else if (item.stone === "Diamond") {
    storage.safe.push(item);
  } else if (item.size() === "Small") {
    storage.box.topShelf.push(item);
  } else if (item._kind === "Earring") {
    if (item.type === "Hoop") {
      storage.tree.push(item);
    } else if (item.stone === "Plain") {
      storage.box.mainSection.push(item);
    } else {
      storage.box.topShelf.push(item);
    }
  } else if (item._kind === "Necklace") {
    if (item.type === "Pendant") {
      storage.tree.push(item.chain);
      storage.box.topShelf.push(item.pendant);
    } else {
      storage.tree.push(item);
    }
  } else {
    storage.dresserTop.push(item);
  }

  storage.travelRoll = storage.travelRoll.filter((x) => x !== item);
}

const packTravelRoll = (storage: JewelleryStorage, item: Jewellery) => {
  if (storage.travelRoll.includes(item) && item.size() !== "Large")
    storage.box.topShelf.push(item);
  else if (item.stone === "Diamond") {
    storage.safe.push(item);
  } else if (item.size() === "Small") {
    storage.box.topShelf.push(item);
  } else if (item._kind === "Earring") {
    if (item.type === "Hoop") {
      storage.tree.push(item);
    } else if (item.stone === "Plain") {
      storage.box.mainSection.push(item);
    } else {
      storage.box.topShelf.push(item);
    }
  } else if (item._kind === "Necklace") {
    if (item.type === "Pendant") {
      storage.tree.push(item.chain);
      storage.box.topShelf.push(item.pendant);
    } else {
      storage.tree.push(item);
    }
  } else {
    storage.dresserTop.push(item);
  }

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
