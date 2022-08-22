//@ts-nocheck
import { isPlainObject } from 'is-plain-object';
import { get, min, set, trim } from 'lodash';
import { flatten } from '../util/flatten';

export class Node {
  [name: string]: any;

  constructor(parent: Node, path: string, data: { [name: string]: any } = {}) {
    this._parent = parent || this;
    this._path = path || '.';
    this._data = data || {};
  }

  injectData(parent: Node, path: string, data: any) {
    Object.keys(data).forEach((key: string) => {
      const value = data[key];
      if (isPlainObject(value)) {
        this[key] = new Node(
          this,
          this._parent._path + '/' + this._path,
          value
        );
        return;
      }
      this[key] = value;
    });
  }

  // Getters & Setters ===========================================================

  get parent(): Node {
    return this._parent;
  }

  get isRoot(): boolean {
    return this._parent === this;
  }

  get root(): Node {
    let node: Node = this;
    while (!node.isRoot) {
      node = node._parent;
    }
    return node;
  }

  get plain(): { [key: string]: any } {
    return this.toPlainObject();
  }

  // Methods =====================================================================

  getChain() {
    const items = [this as Node];
    let node = this as Node;
    while (node !== node._parent) {
      items.push(node);
      node = node._parent;
    }
    return items;
  }

  getParentPath(path = '.'): string | null {
    if (path === '.') {
      return null;
    }
    const nodes = path.split('.').filter((p: string) => p !== path);
    // if (!nodes.length) {
    //   return '';
    // }
    return nodes.map(node => ({ id: node })).join('.');
  }

  // delete(path: string): Node {
  //   path = this.resolve(path);
  //
  //   const parentPath;
  // }

  stringify(): string {
    return JSON.stringify(this.toPlainObject(), null, 2);
  }

  toPlainObject(): object {
    return JSON.parse(JSON.stringify(this));
  }

  flatten(path = '.'): { [key: string]: any } {
    const value = this.get(path);
    return flatten(value);
  }

  set(path: string, value: any): Node {
    path = this.resolve(path);
    if (isPlainObject(value)) {
      value = this.injectData(this, this._parent._path + '/' + path, value);
    }
    set(this, path, value);
    return this;
  }

  resolve(path: string): string {
    return trim(path.replace(/\.\./gim, '.parent.'), '.').replace(
      /\.\./gim,
      '.'
    );
  }

  has(path: string): boolean {
    return !!this.get(path);
  }

  get(path: string): any {
    if (path === '.') {
      return this;
    }
    return get(this, this.resolve(path));
  }
}

import { isPlainObject } from 'is-plain-object';
import { get, min, set, trim } from 'lodash';
import { flatten } from '../util/flatten';
export class Node {
  [name: string]: any;

  constructor(parent: Node, path: string, data: { [name: string]: any } = {}) {
    this._parent = parent || this;
    this._path = path || '.';
    this._data = data || {};

    this.injectData(this._parent, this._path, data);
  }

  injectData(parent: Node, path: string, data: any) {
    Object.keys(data).forEach((key: string) => {
      const value = data[key];
      if (isPlainObject(value)) {
        this[key] = new Node(
          this,
          this._parent._path + '/' + this._path,
          value
        );
        return;
      }
      this[key] = value;
    });
  }

  // Getters & Setters ===========================================================

  get parent(): Node {
    return this._parent;
  }

  get isRoot(): boolean {
    return this._parent === this;
  }

  get root(): Node {
    let node: Node = this;
    while (!node.isRoot) {
      node = node.parent;
    }
    return node;
  }

  get plain(): { [key: string]: any } {
    return this.toPlainObject();
  }

  // Methods =====================================================================

  getChain() {
    const items = [this as Node];
    let node = this as Node;
    while (node !== node._parent) {
      items.push(node);
      node = node._parent;
    }
    return items;
  }

  getParentPath(path = '.'): string | null {
    if (path === '.') {
      return null;
    }
    const nodes = path.split('.').filter((p: string) => p !== path);
    // if (!nodes.length) {
    //   return '';
    // }
    return nodes.map(node => ({ id: node })).join('.');
  }

  // delete(path: string): Node {
  //   path = this.resolve(path);
  //
  //   const parentPath;
  // }

  stringify(): string {
    return JSON.stringify(this.toPlainObject(), null, 2);
  }

  toPlainObject(): object {
    return JSON.parse(JSON.stringify(this));
  }

  flatten(path = '.'): { [key: string]: any } {
    const value = this.get(path);
    return flatten(value);
  }

  set(path: string, value: any): Node {
    path = this.resolve(path);
    if (isPlainObject(value)) {
      value = this.injectData(this, this._parent._path + '/' + path, value);
    }
    set(this, path, value);
    return this;
  }

  resolve(path: string): string {
    return trim(path.replace(/\.\./gim, '.parent.'), '.').replace(
      /\.\./gim,
      '.'
    );
  }

  has(path: string): boolean {
    return !!this.get(path);
  }

  get(path: string): any {
    if (path === '.') {
      return this;
    }
    return get(this, this.resolve(path));
  }
}
