import { functions } from './utils';

class Element {
  constructor(element) {
    this.name = 'ELEMENT';
    this.element = element;
    Object.assign(this, functions(this));
  }
  css(...cn) {
    if (cn) {
      cn.forEach(c => c && this.element && this.element.classList.add(c.replace(/\./g, '').trim()));
    }
    return this;
  }
  append(child) {
    const c = child.nodeType ? child : child.element;
    if (this.element) {
      this.element.appendChild(c);
      return this;
    }
    throw new Error(`${child} Element does not exist! Function 'append'`);
  }
}

export default Element;
