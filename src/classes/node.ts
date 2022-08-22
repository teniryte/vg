import { isPlainObject } from 'is-plain-object';
import { each, get, omit, set, trim } from 'lodash';
import { flatten } from '../util/flatten';
import { hideProperties } from '../util/define-properties';

export class Node {
  [name: string]: any;

  private _parent: Node;
  private _name: string;
  private _data: { [name: string]: any };

  constructor(parent: Node, name: string, data: any = {}) {
    this._parent = parent || this;
    this._name = name;
    this._data = data;

    hideProperties(this, ['_parent', '_name', '_data', '_path']);

    this.inject(this.data);
  }

  // Getters & Setters ===========================================================

  get parent() {
    return this._parent;
  }

  get path(): string {
    const parent = this._parent;
    return parent && parent.path
      ? `${this._parent._path}.${this._name}`
      : this._parent._path;
  }

  get name(): string {
    return this._name;
  }

  get data(): any {
    return this._data;
  }

  // Paths =======================================================================

  resolve(path: string): string {
    if (!path) {
      return path;
    }
    path = trim(path.replace(/\.\./gim, '.parent.'), '.').replace(
      /\.\./gim,
      '.'
    );
    path = path.trim().startsWith('root') ? `root.${path}.` : path;
    return path;
  }

  resolveUpper(path: string): string {
    const items = path.split('.').map(p => p.trim());
    if (items.length === 1) {
      return items[0];
    }
    items.pop();
    return items.join('.');
  }

  // Properties ==================================================================

  has(path: string): boolean {
    return !!this.get(path);
  }

  get(path: string): any {
    if (path === 'root') {
      return this;
    }
    return get(this, this.resolve(path));
  }

  set(path: string, value: any): Node {
    if (isPlainObject(value)) {
      value = this.inject(value);
    }
    set(this, path, value);
    return this;
  }

  remove(path: string): Node {
    const flat = this.flatten();
    each(flat, (_: any, key: string) => {
      if (flat.hasOwnProperty(key) && path === key) {
        delete this[key];
      }
    });
    return this;
  }

  // Data ========================================================================

  getFields(): object {
    return omit(this, ['_parent', '_name', '_path', '_data']);
  }

  flatten(): { [name: string]: any } {
    const flat = flatten(this.getFields(), true);
    return flat;
  }

  inject(data: any): Node {
    const fl = omit(data, ['_parent', '_name', '_path', '_data']);
    if (!data || typeof data !== 'object') {
      return this;
    }
    const flattened = flatten(fl, true);
    each(flattened, (value: any, name: string) => {
      return set(this, name, value);
    });
    each(flatten(fl, true), (value: any, key: string) => {
      const parentPath = key.split('.').filter(k => k.trim());
      parentPath.pop();
      if (!parentPath.length) return;
      const node = new Node(this, key, value);
      this.set(parentPath.join('.'), node);
    });
    return this;
  }

  toPlain(): object | null {
    console.log('TO_PLAIN');
    return null;
  }
}
