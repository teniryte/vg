import { keys, set } from 'lodash';

export function flatten(
  obj: any,
  skipArrays = true,
  parentName: any = null,
  maxLevel = Infinity
) {
  const data: any = {};
  if (Array.isArray(obj)) return flattenArray(obj);
  if (!obj || typeof obj !== 'object') return obj;
  parentName = parentName || '';
  Object.keys(obj).forEach(name => {
    const val = obj[name];
    name = parentName ? parentName + '.' + name : name;
    if (
      !val ||
      typeof val !== 'object' ||
      (skipArrays && Array.isArray(val)) ||
      name.split('.').length >= maxLevel
    ) {
      data[name] = val;
      return;
    }
    Object.assign(data, flatten(val, skipArrays, name, maxLevel));
  });
  return data;
}

export function flattenArray(arr: any[]) {
  let items: any[] = [];
  Array.from(arr, item => {
    if (!item || typeof item !== 'object') {
      return items.push(item);
    }
    if ((item as []).length !== undefined) {
      item = Array.from(item as []);
    }
    items = items.concat(flattenArray(item));
  });
  return items;
}

export function unflatten(obj: any) {
  if (Array.isArray(obj)) return obj;
  const data = {};
  keys(obj).forEach(name => {
    set(data, name, obj[name]);
  });
  return data;
}
