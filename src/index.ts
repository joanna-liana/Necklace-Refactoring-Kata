import {
  Jewellery,
  JewelleryStorage,
  Necklace,
  PendantNecklace
} from "./jewellery";
import { buildChain, executeChain } from './chainOfResponsibility/chainOfResponsibility';
import { smallItems } from './chainOfResponsibility/handlers/items/smallItems';
import { earrings } from './chainOfResponsibility/handlers/items/earrings';
import { necklaces } from './chainOfResponsibility/handlers/items/necklaces';
import { diamonds } from './chainOfResponsibility/handlers/items/diamonds';
import { packDresserTop } from './chainOfResponsibility/handlers/storage/packDresserTop';
import { packTravelRoll } from './chainOfResponsibility/handlers/storage/packTravelRoll';


export function pack(item: Jewellery, storage: JewelleryStorage) {
  const itemHandlers = [
    smallItems,
    earrings,
    necklaces,
    diamonds,
  ];

  const storageHandlers = [
    packDresserTop,
    packTravelRoll
  ];

  executeChain(
    buildChain([...itemHandlers, ...storageHandlers])(storage, item)
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
