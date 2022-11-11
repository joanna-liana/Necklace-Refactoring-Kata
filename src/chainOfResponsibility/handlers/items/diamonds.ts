import {
  Jewellery,
  JewelleryStorage
} from "../../../jewellery";
import { BreakChain, StorageHandler } from '../../chainOfResponsibility';

export const diamonds: StorageHandler = (storage: JewelleryStorage, item: Jewellery) => ({
  shouldExecute: (_storage, item) => {
    return item.stone === "Diamond";
  },
  exec: () => {
    storage.safe.push(item);

    return BreakChain;
  }
});
