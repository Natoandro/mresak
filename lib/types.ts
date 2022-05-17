export type Writable<T> = { -readonly [K in keyof T]: T[K]; };

// transform type T to Next.js serializable version: Date to string;
export type NextSerializable<T extends {}> = {
  [K in keyof T]: T[K] extends Date ? string : T[K];
};
