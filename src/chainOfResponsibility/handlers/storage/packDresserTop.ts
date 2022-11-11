import {
  Jewellery,
  JewelleryStorage
} from "../../../jewellery";
import { ContinueChain, StorageHandler } from '../../chainOfResponsibility';

export const packDresserTop: StorageHandler = (storage: JewelleryStorage, item: Jewellery) => ({
  shouldExecute: () => true,
  exec: () => {
    storage.dresserTop.push(item);

    return ContinueChain;
  }
});
