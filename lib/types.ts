export type Writable<T> = { -readonly [K in keyof T]: T[K]; };

// transform type T to Next.js serializable version: Date to number;
export type NextSerializable<T extends {}> = {
  [K in keyof T]: T[K] extends Date ? number : T[K];
};
