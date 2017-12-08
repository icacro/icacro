import { ReservedElements, proxyTest } from './utils';

class Element {
  constructor(element) {
    this.name = 'ELEMENT';
    this.element = element;
    // this.func = proxyTest(this);
  }
  attr(...args) {
    if (this.element) {
      const [attr, value] = args.length === 2 ? [...args] : args[0].split(':');
      if (value) {
        this.element.setAttribute(attr, value);
        return this;
      }
      return this.element.getAttribute(attr);
    }
    throw new Error(`${args} Element does not exist! Function 'attr'`);
  }
  rect(arg) {
    return this.element.getBoundingClientRect()[arg];
  }
  height() {
    return this.rect('height');
  }
  remove() {
    this.element.parentNode.removeChild(this.element);
  }
  click(callback) {
    if (this.element) {
      this.element.addEventListener('click', callback);
      return this;
    }
    throw new Error(`${callback} Element does not exist! Function 'click'`);
  }
  value() {
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
      this.element.parentNode.insertBefore(target.element, this.element.nextSibling);
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
  removeClass(className) {
    if (this.element) {
      this.element.classList.remove(className);
      return this;
    }
    throw new Error(`${className} Element does not exist! Function 'removeClass'`);
  }
  appendFirst(child) {
    const c = child.nodeType ? child : child.element;
    if (this.element) {
      this.element.insertBefore(c, this.element.childNodes[0]);
      return this;
    }
    throw new Error(`${child} Element does not exist! Function 'append'`);
  }
  append(child) {
    const c = child.nodeType ? child : child.element;
    if (this.element) {
      this.element.appendChild(c);
      return this;
    }
    throw new Error(`${child} Element does not exist! Function 'append'`);
  }
  appendAll(...childs) {
    return childs.map(this.append.bind(this));
  }
  css(...cn) {
    if (cn) {
      cn.forEach(c => c && this.element && this.element.classList.add(c.replace(/\./g, '').trim()));
    }
    return this;
  }
  toggle(cn) {
    if (cn) {
      this.element.classList.toggle(cn);
    }
    return this;
  }
  get(...args) {
    if (this.element) {
      if (args.length === 1) return Element(this.element.querySelector(args[0]));
      return args.map(arg => Element(this.element.querySelector(arg)));
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
    throw new Error(`${arg} Element does not exist! Function 'children'`);
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
  data(key, value) {
    if (this.element) {
      if (!value) return this.element.dataset[key];
      this.element.dataset[key] = value;
      return this;
    }
    throw new Error(`${key} ${value} Element does not exist! Function 'data'`);
  }
}

export default Element;
