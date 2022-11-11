import {
  Jewellery,
  JewelleryStorage,
  Necklace,
  PendantNecklace,
  Earring
} from "./jewellery";
import { StorageHandler, chain, BreakChain, ContinueChain, StorageHandlerV2, buildChain, executeChain } from './chainOfResponsibility';


const smallItems: StorageHandler = (storage: JewelleryStorage, item: Jewellery) => {
  if (item.size() !== "Small") {
    return ContinueChain;
  }

  storage.box.topShelf.push(item);

  if (storage.travelRoll.includes(item)) {
    return BreakChain;
  }

  return ContinueChain;
}

const earringsV2: StorageHandlerV2 = (storage: JewelleryStorage, item: Earring) => ({
  shouldExecute: (_storage, item) => {
    return item._kind === "Earring"
  },
  exec: () => {
    if (item.type === "Hoop") {
      storage.tree.push(item);

      return BreakChain;
    }

    if (item.stone === "Plain") {
      storage.box.mainSection.push(item);

      return BreakChain;
    }

    storage.box.topShelf.push(item);

    return ContinueChain;
  }
});

const necklacesV2: StorageHandlerV2 = (storage: JewelleryStorage, item: Necklace | PendantNecklace) => ({
  shouldExecute: (_storage, item) => {
    return item._kind === "Necklace"
  },
  exec: () => {
    if (item.type === "Pendant") {
      storage.box.topShelf.push(item.pendant);
      storage.tree.push(item.chain);
    } else {
      storage.tree.push(item);
    }

    return ContinueChain;
  }
})

const diamondsV2: StorageHandlerV2 = (storage: JewelleryStorage, item: Jewellery) => ({
  shouldExecute: (_storage, item) => {
    return item.stone === "Diamond"
  },
  exec: () => {
    storage.safe.push(item);

    return BreakChain;
  }
})

const packDresserTopV2: StorageHandlerV2 = (storage: JewelleryStorage, item: Jewellery) => ({
  shouldExecute: () => true,
  exec: () => {
    storage.dresserTop.push(item);

    return ContinueChain;
  }
})

const packTravelRollV2: StorageHandlerV2 = (storage: JewelleryStorage, item: Jewellery) => ({
  shouldExecute: () => true,
  exec: () => {
    storage.travelRoll = storage.travelRoll.filter((x) => x !== item);

    return BreakChain;
  }
})

export function pack(item: Jewellery, storage: JewelleryStorage) {
  smallItems(storage, item);

  executeChain(
    buildChain([earringsV2, necklacesV2, diamondsV2, packDresserTopV2, packTravelRollV2])(storage, item)
  );

  return;
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
