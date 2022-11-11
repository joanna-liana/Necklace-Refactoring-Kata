import {
  Jewellery,
  JewelleryStorage
} from "../../../jewellery";
import { BreakChain, StorageHandler } from '../../../chainOfResponsibility/chainOfResponsibility';

export const packTravelRoll: StorageHandler = (storage: JewelleryStorage, item: Jewellery) => ({
  shouldExecute: () => true,
  exec: () => {
    storage.travelRoll = storage.travelRoll.filter((x) => x !== item);

    return BreakChain;
  }
});
