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


type StorageHandlerV2Exec = () => ShouldContinueChain;

export type StorageHandlerV2 = (storage: JewelleryStorage, item: Jewellery) => (
  {
    shouldExecute: (storage: JewelleryStorage, item: Jewellery) => boolean;
    exec: StorageHandlerV2Exec
  }
);

export const chain = (currentHandler: StorageHandler, nextHandler: StorageHandler): StorageHandler => (...args) => {
  const shouldContinueChain = currentHandler(...args);

  if (shouldContinueChain) {
    return nextHandler(...args);
  }

  return shouldContinueChain;
};


type Chain = StorageHandlerV2Exec[];

export const buildChain = (handlers: StorageHandlerV2[]) => (storage: JewelleryStorage, item: Jewellery): Chain => {
  return handlers
    .map(handler => handler(storage, item))
    .filter(({ shouldExecute }) => shouldExecute(storage, item))
    .map(({ exec }) => exec)
}

export const executeChain = (chain: Chain) => chain.forEach(exec => exec());
