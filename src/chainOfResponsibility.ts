import {
  Jewellery,
  JewelleryStorage
} from "./jewellery";

export type ShouldContinueChain = boolean;

export const ContinueChain = true;
export const BreakChain = false;

type StorageHandlerExec = () => ShouldContinueChain;

export type StorageHandler = (storage: JewelleryStorage, item: Jewellery) => (
  {
    shouldExecute: (storage: JewelleryStorage, item: Jewellery) => boolean;
    exec: StorageHandlerExec
  }
);

type Chain = StorageHandlerExec[];

export const buildChain = (handlers: StorageHandler[]) => (storage: JewelleryStorage, item: Jewellery): Chain => {
  return handlers
    .map(handler => handler(storage, item))
    .filter(({ shouldExecute }) => shouldExecute(storage, item))
    .map(({ exec }) => exec)
}

export const executeChain = (chain: Chain) => chain.forEach(exec => exec());
