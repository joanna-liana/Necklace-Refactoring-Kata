import {
  JewelleryStorage,
  Necklace,
  PendantNecklace
} from "../../../jewellery";
import { ContinueChain, StorageHandler } from '../../../chainOfResponsibility/chainOfResponsibility';
import { pack } from '../../..';

export const necklaces: StorageHandler = (storage: JewelleryStorage, item: Necklace | PendantNecklace) => ({
  shouldExecute: (_storage, item) => {
    return item._kind === "Necklace";
  },
  exec: () => {
    // TODO: this could be an OR chain
    if (item.type === "Pendant") {
      pack(item.pendant, storage);
      pack(item.chain, storage);
    } else {
      storage.tree.push(item);
    }

    return ContinueChain;
  }
});
