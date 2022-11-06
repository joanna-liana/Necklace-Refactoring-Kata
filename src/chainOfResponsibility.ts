import {
  Jewellery,
  JewelleryStorage
} from "./jewellery";

export type ShouldContinueChain = boolean;

export const ContinueChain = true;
export const BreakChain = false;

export type StorageHandler = (
  storage: JewelleryStorage,
  item: Jewellery
) => ShouldContinueChain;

export const chain = (currentHandler: StorageHandler, nextHandler: StorageHandler): StorageHandler => (...args) => {
  const shouldContinueChain = currentHandler(...args);

  if (shouldContinueChain) {
    return nextHandler(...args);
  }

  return shouldContinueChain;
};
