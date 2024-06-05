import { Listenable } from '../../listenable';

export type ListenerArray<T extends unknown[]> = {
  [key in keyof T]: Listenable<T[key]>;
};
