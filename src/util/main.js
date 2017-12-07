/*
eslint no-param-reassign: [
  "error", { "props": true, "ignorePropertyModificationsFor": ["element"] }
]
*/
/* eslint no-use-before-define: ["error", { "functions": false }] */
/* eslint-env es6 */
import Storage from './modules/storage';

const reservedElements = ['div', 'body', 'head', 'img', 'style', 'span', 'ul', 'li', 'input', 'button', 'h1', 'h2', 'h3', 'h4', 'a', 'p', 'strong', 'svg'];
const GetElement = selector => document.querySelector(selector);

function $ELM_ELEMENT(element) {
  const rect = arg => element.getBoundingClientRect()[arg];
  return {
    name: 'ELM_ELEMENT',
    attr(...args) {
      if (element) {
        const [attr, value] = args.length === 2 ? [...args] : args[0].split(':');
        if (value) {
          element.setAttribute(attr, value);
          return this;
        }
        return element.getAttribute(attr);
      }
      throw new Error(`${args} Element does not exist! Function 'attr'`);
    },
    height() {
      return rect('height');
    },
    click(callback) {
      if (element) {
        element.addEventListener('click', callback);
        return this;
      }
      throw new Error(`${callback} Element does not exist! Function 'click'`);
    },
    html(str) {
      if (element) {
        if (!str) return element.innerHTML;
        element.innerHTML = str;
        return this;
      }
      throw new Error(`${str} Element does not exist! Function 'html'`);
    },
    text(str) {
      if (element) {
        if (!str) return element.innerText || element.textContent;
        element.innerHTML = '';
        element.appendChild(document.createTextNode(str));
        return this;
      }
      throw new Error(`${str} Element does not exist! Function 'text'`);
    },
    image(src) {
      if (element) {
        element.src = src;
        return this;
      }
      throw new Error(`${src} Element does not exist! Function 'image'`);
    },
    href(url) {
      if (element) {
        element.href = url;
        return this;
      }
      throw new Error(`${url} Element does not exist! Function 'href'`);
    },
    removeClass(className) {
      if (element) {
        element.classList.remove(className);
        return this;
      }
      throw new Error(`${className} Element does not exist! Function 'removeClass'`);
    },
    appendFirst(child) {
      const c = child.nodeType ? child : child.element;
      if (element) {
        element.insertBefore(c, element.childNodes[0]);
        return this;
      }
      throw new Error(`${child} Element does not exist! Function 'append'`);
    },
    append(child) {
      const c = child.nodeType ? child : child.element;
      if (element) {
        element.appendChild(c);
        return this;
      }
      throw new Error(`${child} Element does not exist! Function 'append'`);
    },
    appendAll(...childs) {
      return childs.map(this.append);
    },
    css(cn) {
      if (cn) {
        cn.split(' ')
          .join(',')
          .split(',')
          .forEach(c => c && element && element.classList.add(c.replace(/\./g, '').trim()));
      }
      return this;
    },
    toggle(cn) {
      if (cn) {
        element.classList.toggle(cn);
      }
      return this;
    },
    get(...args) {
      if (element) {
        if (args.length === 1) return new $ELM_ELEMENT(element.querySelector(args[0]));
        return args.map(arg => new $ELM_ELEMENT(element.querySelector(arg)));
      }
      throw new Error(`${args} Element does not exist! Function 'get'`);
    },
    children(arg) {
      if (arg) {
        const func = reservedElements.some(elm => elm === arg) ? ['getElementsByTagName'] : ['querySelectorAll'];
        const list = Array.from(element[func](arg));
        return list.map(child => new $ELM_ELEMENT(child));
      }
      const list = Array.from(element.childNodes);
      return list.map(child => new $ELM_ELEMENT(child));
    },
    style(stl) {
      if (element) {
        Object.assign(element.style, stl);
        return this;
      }
      throw new Error(`${stl} Element does not exist! Function 'style'`);
    },
    insertAfter(targetName) {
      if (element) {
        const target = (targetName.name === this.name) ?
          targetName : new $ELM_ELEMENT(GetElement(targetName));
        element.parentNode.insertBefore(target.element, element.nextSibling);
        return this;
      }
      throw new Error(`${targetName} Element does not exist! Function 'insertAfter'`);
    },
    hide() {
      this.style({
        display: 'none',
      });
    },
    remove() {
      element.parentNode.removeChild(element);
    },
    copy(selector) {
      const child = element.querySelector(selector);
      if (child) {
        return CreateElement(child.cloneNode(true));
      }
      throw new Error(`${selector} Element does not exist! Function 'copy'`);
    },
    data(key, value) {
      if (element) {
        if (!value) return element.dataset[key];
        element.dataset[key] = value;
        return this;
      }
      throw new Error(`${key} ${value} Element does not exist! Function 'data'`);
    },
    element,
  };
}

const CreateElement = (arg, options) => {
  if (arg instanceof HTMLElement) return new $ELM_ELEMENT(arg);
  const arr = arg.split(' ');
  const type = arr.reduce((acc, current) => {
    if (reservedElements.includes(current)) {
      return current;
    }
    return acc;
  }, 'div');
  const classNames = arr.filter(current => !reservedElements.includes(current)).join();
  const dom = document.createElement(type);
  if (options) {
    Object.keys(options).forEach((option) => {
      const value = options[option];
      dom[option] = value;
    });
  }
  return new $ELM_ELEMENT(dom).css(classNames);
};

const CreateElementByObject = (type, iterable) => {
  const element = CreateElement(type);
  Object.keys(iterable).forEach((item) => {
    const func = element[item];
    if (func) {
      const value = iterable[item];
      if (value && value.length) {
        func(value);
      }
    }
  });
  return element;
};

export const $ELM = {
  elms: {},
  create(args, options = {}) {
    if (Array.isArray(args)) return args.map(arg => CreateElement(arg));
    return CreateElement(args, options);
  },
  build(type, iterable) {
    return CreateElementByObject(type, iterable);
  },
  get(...args) {
    if (args.length === 1) {
      const key = Number.isInteger(parseInt(args[0], 10)) ? parseInt(args[0], 10) : args[0];
      return this.elms[key] || new $ELM_ELEMENT(GetElement(key));
    }
    return args.map((arg) => {
      const key = Number.isInteger(parseInt(arg, 10)) ? parseInt(arg, 10) : arg;
      return this.elms[key] || new $ELM_ELEMENT(GetElement(key));
    });
  },
  save(id, element) {
    this.elms[id] = this.elms[id] || {};
    this.elms[id] = element;
  },
  copy(selector) {
    const child = GetElement(selector);
    if (child) {
      return CreateElement(child.cloneNode(true));
    }
    throw new Error(`${selector} Element does not exist! Function 'copy'`);
  },
};

export const ICACRO = () => {
  $ELM.get('body').css('cro');
  return {
    getElementContentByTagAndAttr(regexp, tag, attr) {
      const qsa = document.querySelectorAll(tag);
      return this.toArray(qsa).reduce((acc, element) => {
        if (new RegExp(regexp).test(element[attr])) {
          acc.push(element[attr]);
        }
        return acc;
      }, []);
    },
    removeElements(classNames) {
      classNames.forEach((className) => {
        const elm = document.querySelector(className);
        if (elm instanceof HTMLElement) elm.parentNode.removeChild(elm);
      });
    },
    toArray(list) { return Array.prototype.slice.call(list); },
    load(...args) {
      const [url, options] = args;
      const ops = Object.assign({}, { method: 'get' }, options);
      return fetch(url, ops)
        .then(response => response.json())
        .catch(err => err);
    },
    // style(styles) {
    //   console.log('style is deprecated... use css and require.');
    //   const style = $ELM.create('style');
    //   style.attr('type', 'text/css');
    //   style.append(document.createTextNode(styles));
    //   $ELM.get('head').append(style);
    // },
    isLoggedIn() {
      return $ELM.get('#hdnIcaState').attr('value').length > 1;
    },
    gaPush({ eventCategory = 'A/B', eventAction, eventLabel }) {
      if (ga) {
        ga('send', 'event', eventCategory, eventAction, eventLabel);
      }
    },
    storage: {
      set(key, value) {
        Storage.set(key, value);
      },
      get(key) {
        return Storage.get(key);
      },
      remove(key) {
        Storage.remove(key);
      },
    },
  };
};
