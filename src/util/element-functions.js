import { ReservedElements } from './utils';
import Element from './element';

export function hide() {
  if (this.element) {
    Object.assign(this.element.style, {
      display: 'none',
    });
    return this;
  }
  throw new Error(`Element does not exist! Function 'style'`);
}

export function view() {
  if (this.element) {
    Object.assign(this.element.style, {
      display: 'visible',
    });
    return this;
  }
  throw new Error(`Element does not exist! Function 'style'`);
}

export function attr(...args) {
  if (this.element) {
    const [key, val] = args.length === 2 ? [...args] : args[0].split(':');
    if (val) {
      this.element.setAttribute(key, val);
      return this;
    }
    return this.element.getAttribute(key);
  }
  throw new Error(`${args} Element does not exist! Function 'attr'`);
}

export function remove() {
  if (this.element) {
    this.element.parentNode.removeChild(this.element);
    return this;
  }
  throw new Error(`Element does not exist! Function 'remove'`);
}

export function click(callback) {
  if (this.element) {
    this.element.addEventListener('click', callback);
    return this;
  }
  throw new Error(`${callback} Element does not exist! Function 'click'`);
}

export function value() {
  return this.element.value;
}

export function placeholder() {
  return this.element.placeholder;
}

export function copy(selector) {
  if (this.element) {
    const child = this.element.querySelector(selector);
    if (child) {
      return new Element(child.cloneNode(true));
    }
  }
  throw new Error(`${selector} Element does not exist! Function 'copy'`);
}

export function insertAfter(targetName) {
  if (this.element) {
    const target = (targetName.name === this.name) ?
      targetName :
      new Element(document.querySelector(targetName));
    this.element.parentNode.insertBefore(target.element, this.element.nextSibling);
    return this;
  }
  throw new Error(`${targetName} Element does not exist! Function 'insertAfter'`);
}

export function html(str) {
  if (this.element) {
    if (!str) return this.element.innerHTML;
    this.element.innerHTML = str;
    return this;
  }
  throw new Error(`${str} Element does not exist! Function 'html'`);
}

export function text(str) {
  if (this.element) {
    if (!str) return this.element.innerText || this.element.textContent;
    this.element.innerHTML = '';
    this.element.appendChild(document.createTextNode(str));
    return this;
  }
  throw new Error(`${str} Element does not exist! Function 'text'`);
}

export function image(src) {
  if (this.element) {
    this.element.src = src;
    return this;
  }
  throw new Error(`${src} Element does not exist! Function 'image'`);
}

export function href(url) {
  if (this.element) {
    this.element.href = url;
    return this;
  }
  throw new Error(`${url} Element does not exist! Function 'href'`);
}

export function removeClass(className) {
  if (this.element) {
    this.element.classList.remove(className);
    return this;
  }
  throw new Error(`${className} Element does not exist! Function 'removeClass'`);
}

export function appendFirst(child) {
  const c = child.nodeType ? child : child.element;
  if (this.element) {
    this.element.insertBefore(c, this.element.childNodes[0]);
    return this;
  }
  throw new Error(`${child} Element does not exist! Function 'append'`);
}

export function appendAll(...childs) {
  return childs.map(this.append.bind(this));
}

export function toggle(cn) {
  if (cn) {
    this.element.classList.toggle(cn);
  }
  return this;
}

export function get(...args) {
  if (this.element) {
    if (args.length === 1) return Element(this.element.querySelector(args[0]));
    return args.map(arg => Element(this.element.querySelector(arg)));
  }
  throw new Error(`${args} Element does not exist! Function 'get'`);
}

export function children(arg) {
  if (this.element) {
    if (arg) {
      const func = ReservedElements.some(elm => elm === arg) ? ['getElementsByTagName'] : ['querySelectorAll'];
      const list = Array.from(this.element[func](arg));
      return list.map(child => new Element(child));
    }
    const list = Array.from(this.element.childNodes);
    return list.map(child => new Element(child));
  }
  return [];
}

export function find(classname) {
  return new Element(this.element.querySelector(classname));
}

export function style(stl) {
  if (this.element) {
    Object.assign(this.element.style, stl);
    return this;
  }
  throw new Error(`${stl} Element does not exist! Function 'style'`);
}

export function data(key, val) {
  if (this.element) {
    if (!val) return this.element.dataset[key];
    this.element.dataset[key] = val;
    return this;
  }
  throw new Error(`${key} ${value} Element does not exist! Function 'data'`);
}

export function rect(arg) {
  return this.element.getBoundingClientRect()[arg];
}
