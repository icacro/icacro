import { ReservedElements } from './utils';

const childElement = (element, child) => {
  if (child instanceof HTMLElement) return element.appendChild(child);
  if (typeof child === 'string') {
    element.innerHTML = child;
    return element;
  }
  return element.appendChild(child.element);
};

class Element {
  constructor(element) {
    this.name = 'ELEMENT';
    this.element = element;
  }
  removeClass(cn) {
    if (this.element) {
      if (cn) {
        cn.forEach((classname) => {
          if (classname.length > 0) {
            this.element.classList.remove(classname.replace(/\./g, '').trim());
          }
        });
      }
      return this;
    }
    throw new Error(`Element does not exist! Function 'removeClass'`);
  }
  parent() {
    if (this.element) {
      return new Element(this.element.parentNode);
    }
    throw new Error(`Element does not exist! Function 'parent'`);
  }
  css(...cn) {
    if (this.element) {
      if (cn) {
        cn.forEach((classname) => {
          if (classname.length > 0) {
            this.element.classList.add(classname.replace(/\./g, '').trim());
          }
        });
      }
      return this;
    }
    throw new Error(`Element does not exist! Function 'css'`);
  }
  append(child) {
    if (this.element) {
      childElement(this.element, child);
      return this;
    }
    throw new Error(`${child} Element does not exist! Function 'append'`);
  }
  hide() {
    if (this.element) {
      Object.assign(this.element.style, {
        display: 'none',
      });
      return this;
    }
    throw new Error(`Element does not exist! Function 'style'`);
  }
  view() {
    if (this.element) {
      Object.assign(this.element.style, {
        display: 'visible',
      });
      return this;
    }
    throw new Error(`Element does not exist! Function 'style'`);
  }
  removeAttr(attr) {
    if (this.element) {
      this.element.removeAttribute(attr);
      return this;
    }
    throw new Error(`${attr} Element does not exist! Function 'removeAttr'`);
  }
  attr(...args) {
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
  remove() {
    if (this.element) {
      this.element.parentNode.removeChild(this.element);
      return this;
    }
    throw new Error(`Element does not exist! Function 'remove'`);
  }
  change(callback) {
    if (this.element) {
      this.element.addEventListener('change', callback);
      return this;
    }
    throw new Error(`Element does not exist! Function 'change'`);
  }
  click(callback) {
    if (this.element) {
      this.element.addEventListener('click', callback);
      return this;
    }
    throw new Error(`${callback} Element does not exist! Function 'click'`);
  }
  value(str) {
    if (str) {
      this.element.value = str;
      return this;
    }
    return this.element.value;
  }
  placeholder() {
    return this.element.placeholder;
  }
  copy(selector) {
    if (this.element) {
      const child = this.element.querySelector(selector);
      if (child) {
        return new Element(child.cloneNode(true));
      }
    }
    throw new Error(`${selector} Element does not exist! Function 'copy'`);
  }
  insertAfter(targetName) {
    if (this.element) {
      const target = (targetName.name === this.name) ?
        targetName :
        new Element(document.querySelector(targetName));
      target.element.parentNode.insertBefore(this.element, target.element.nextSibling);
      return this;
    }
    throw new Error(`${targetName} Element does not exist! Function 'insertAfter'`);
  }
  html(str) {
    if (this.element) {
      if (!str) return this.element.innerHTML;
      this.element.innerHTML = str;
      return this;
    }
    throw new Error(`${str} Element does not exist! Function 'html'`);
  }
  text(str) {
    if (this.element) {
      if (!str) return this.element.innerText || this.element.textContent;
      this.element.innerHTML = '';
      this.element.appendChild(document.createTextNode(str));
      return this;
    }
    throw new Error(`${str} Element does not exist! Function 'text'`);
  }
  image(src) {
    if (this.element) {
      this.element.src = src;
      return this;
    }
    throw new Error(`${src} Element does not exist! Function 'image'`);
  }
  href(url) {
    if (this.element) {
      this.element.href = url;
      return this;
    }
    throw new Error(`${url} Element does not exist! Function 'href'`);
  }
  // removeClass(className) {
  //   if (this.element) {
  //     this.element.classList.remove(className);
  //     return this;
  //   }
  //   throw new Error(`${className} Element does not exist! Function 'removeClass'`);
  // }
  appendFirst(child) {
    const c = child.nodeType ? child : child.element;
    if (this.element) {
      this.element.insertBefore(c, this.element.childNodes[0]);
      return this;
    }
    throw new Error(`${child} Element does not exist! Function 'append'`);
  }
  appendAll(childs) {
    return childs.map(this.append.bind(this));
  }
  toggle(cn) {
    if (cn) {
      this.element.classList.toggle(cn);
    }
    return this;
  }
  get(...args) {
    if (this.element) {
      if (args.length === 1) return new Element(this.element.querySelector(args[0]));
      return args.map(arg => new Element(this.element.querySelector(arg)));
    }
    throw new Error(`${args} Element does not exist! Function 'get'`);
  }
  children(arg) {
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
  find(classname) {
    return new Element(this.element.querySelector(classname));
  }
  style(stl) {
    if (this.element) {
      Object.assign(this.element.style, stl);
      return this;
    }
    throw new Error(`${stl} Element does not exist! Function 'style'`);
  }
  exist() {
    return this.element !== null;
  }
  data(arg, val) {
    if (this.element) {
      if (typeof arg === 'object') {
        Object.keys(arg).forEach((key) => {
          this.element.dataset[key] = arg[key];
        });
      } else {
        if (!val) return this.element.dataset[arg];
        this.element.dataset[arg] = val;
      }
      return this;
    }
    throw new Error(`Element does not exist! Function 'data'`);
  }
  rect(arg) {
    return this.element.getBoundingClientRect()[arg];
  }
  listenTo(type, cb) {
    this.element.addEventListener(type, cb);
    return this;
  }
}

export default Element;
