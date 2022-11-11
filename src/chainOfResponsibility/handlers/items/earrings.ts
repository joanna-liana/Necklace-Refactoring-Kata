import { JewelleryStorage, Earring } from "../../../jewellery";
import { BreakChain, ContinueChain, StorageHandler } from '../../../chainOfResponsibility/chainOfResponsibility';

export const earrings: StorageHandler = (storage: JewelleryStorage, item: Earring) => ({
  shouldExecute: (_storage, item) => {
    return item._kind === "Earring";
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
