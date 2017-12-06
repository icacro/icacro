export default class {
  constructor(element) {
    this.element = element;
  }
  attr(...args) {
    if (this.element) {
      const [attr, value] = args.length === 2 ? [...args] : args[0].split(':');
      if (value) {
        this.dom.setAttribute(attr, value);
        return this;
      }
      return this.dom.getAttribute(attr);
    }
    throw new Error(`${args} Element does not exist! Function 'attr'`);
  }
  rect(arg) {
    return this.dom.getBoundingClientRect()[arg];
  }
  height() {
    return this.rect('height');
  }
  click(callback) {
    if (this.element) {
      this.element.addEventListener('click', callback);
      return this;
    }
    throw new Error(`${callback} Element does not exist! Function 'click'`);
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
    return childs.map(this.append);
  }
  css(cn) {
    if (cn) {
      cn.split(' ')
        .join(',')
        .split(',')
        .forEach(c => c && this.element && this.element.classList.add(c.replace(/\./g, '').trim()));
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
    if (arg) {
      const list = Array.from(this.element.getElementsByTagName(arg));
      return list.map(child => Element(child));
    }
    const list = Array.from(this.element.childNodes);
    return list.map(child => Element(child));
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
      this.element.dataset[key] = value;
      return this;
    }
    throw new Error(`${key} ${value} Element does not exist! Function 'data'`);
  }
}
