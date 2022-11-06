import {
  JewelleryStorage,
  Necklace,
  PendantNecklace
} from "./jewellery";

export enum Result {
  Success = 'Success',
  Skipped = 'Skipped'
  // TODO: later Failure can be added to enhance error reporting
}

type ShouldContinueChain = boolean;

export type LeafStorageHandler = (
  storage: JewelleryStorage,
  item: Necklace | PendantNecklace
) => Result;

export type StorageHandler = (
  storage: JewelleryStorage,
  item: Necklace | PendantNecklace
) => Result;

export const chain = (currentHandler: StorageHandler, nextHandler: StorageHandler): StorageHandler => (...args) => {
  const result = currentHandler(...args);

  if (result === Result.Skipped) {
    return nextHandler(...args);
  }

  return result;
};
