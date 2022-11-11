import {
  Jewellery,
  JewelleryStorage
} from "../../../jewellery";
import { BreakChain, ContinueChain, StorageHandler } from '../../../chainOfResponsibility/chainOfResponsibility';

export const smallItems: StorageHandler = (storage: JewelleryStorage, item: Jewellery) => ({
  shouldExecute: (_storage, item) => {
    return item.size() === "Small";
  },
  exec: () => {
    storage.box.topShelf.push(item);

    if (storage.travelRoll.includes(item)) {
      return BreakChain;
    }

    return ContinueChain;
  }
});
