export const hideProperties = (target: object, names: string[]) => {
  names.forEach((name: string) => {
    Object.defineProperty(target, name, { enumerable: false });
  });
};

export const defineProperties = (
  target: object,
  properties: {
    name: string;
    get?: (() => any) | undefined;
    set?: (() => any) | undefined;
    value?: any;
    configurable?: boolean;
    enumerable?: boolean;
    writable?: boolean;
  }[]
) => {
  properties.forEach(item => {
    Object.defineProperty(target, item.name, {
      get: item.get,
      set: item.set,
      value: item.value,
      configurable: item.configurable,
      enumerable: item.enumerable,
      writable: item.writable,
    });
  });
};
