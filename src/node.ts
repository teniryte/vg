import { isPlainObject } from 'is-plain-object';
import { get, trim } from 'lodash';
import { flatten } from './util';

export class Node {
  [name: string]: any;

  constructor(parentNode: Node | null, data: { [name: string]: any }) {
    Object.defineProperty(this, '_meta', {
      get() {
        return {
          parentNode,
          data,
        };
      },
    });
    Object.keys(data).forEach((key: string) => {
      const value = data[key];
      if (isPlainObject(value)) {
        this[key] = new Node(this, value);
        return;
      }
      this[key] = value;
    });
  }

  get parent(): Node {
    return this._meta.parentNode || this;
  }

  get isRoot(): boolean {
    return this.parent === this;
  }

  get root(): Node {
    let node: Node = this;
    while (!node.isRoot) {
      node = node.parent;
    }
    return node;
  }

  flatten(path = '.'): { [key: string]: any } {
    const value = this.get(path);
    return flatten(value);
  }

  resolve(path: string): string {
    return trim(path.replace(/\.\./gim, 'parent.'), '.');
  }

  get(path: string): any {
    if (path === '.') {
      return this;
    }
    return get(this, this.resolve(path));
  }
}
