import {
  JewelleryStorage,
  Necklace,
  PendantNecklace
} from "../../../jewellery";
import { ContinueChain, StorageHandler } from '../../../chainOfResponsibility/chainOfResponsibility';

export const necklaces: StorageHandler = (storage: JewelleryStorage, item: Necklace | PendantNecklace) => ({
  shouldExecute: (_storage, item) => {
    return item._kind === "Necklace";
  },
  exec: () => {
    // TODO: this could be an OR chain
    if (item.type === "Pendant") {
      storage.box.topShelf.push(item.pendant);
      storage.tree.push(item.chain);
    } else {
      storage.tree.push(item);
    }

    return ContinueChain;
  }
});
