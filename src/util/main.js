const reservedElements = ['body', 'head', 'img', 'style', 'span', 'ul', 'li', 'input', 'button', 'h1', 'h2', 'h3', 'h4', 'a', 'p', 'strong', 'svg'];

const $ELM_ELEMENT = (element) => {
  return {
    attr(type, value) {
      if (value) {
        element.setAttribute(type, value);
        return this;
      }
      return element.getAttribute(type);
    },
    html(str) {
      if (!str) return element.innerHTML;
      element.innerHTML = str;
      return this;
    },
    text(str) {
      if (!str) return element.innerHTML;
      element.innerHTML = '';
      element.appendChild(document.createTextNode(str));
      return this;
    },
    image(src) {
      element.src = src;
      return this;
    },
    href(url) {
      element.href = url;
      return this;
    },
    append(child) {
      const c = child.nodeType ? child : child.element;
      element.appendChild(c);
      return this;
    },
    appendAll(...childs) {
      return childs.map(this.append);
    },
    css(cn) {
      if (cn) {
        cn.split(' ')
          .join(',')
          .split(',')
          .forEach(c => c && element.classList.add(c.replace(/\./g, '').trim()));
      }
      return this;
    },
    style(stl) {
      Object.assign(element.style, stl);
      return this;
    },
    click(fn) {
      element.addEventListener('click', fn);
    },
    element,
  };
};

const GetElement = selector => document.querySelector(selector);

const CreateElement = (arg) => {
  const arr = arg.split(' ');
  const type = arr.reduce((acc, current) => {
    if (reservedElements.includes(current)) {
      return current;
    }
    return acc;
  }, 'div');

  const classNames = arr.filter(current => !reservedElements.includes(current)).join();
  return $ELM_ELEMENT(document.createElement(type)).css(classNames);
};

const CreateElementByObject = (type, iterable) => {
  const element = CreateElement(type);
  for (const item in iterable) {
    if (element[item]) {
      const value = iterable[item];
      if (value && value.length) {
        element[item](value);
      }
    }
  }
  return element;
}

export const $ELM = {
  create(...args) {
    if (args.length === 1) return CreateElement(args[0]);
    return args.map(arg => CreateElement(arg));
  },
  build(type, iterable) {
    return CreateElementByObject(type, iterable);
  },
  get(args) {
    if (typeof args === 'string') return $ELM_ELEMENT(GetElement(args));
    return args.map(arg => $ELM_ELEMENT(GetElement(arg)));
  },
};

export const ICACRO = () => {
  $ELM.get('body').css('cro');
  return {
    getElementContentByTagAndAttr(regexp, tag, attr) {
      const elements = document.querySelectorAll(tag);
      return this.toArray(elements).reduce((acc, element) => {
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
        .then(response => response)
        .catch(err => err);
    },
    style(styles) {
      const style = $ELM.create('style');
      style.attr('type', 'text/css');
      style.append(document.createTextNode(styles));
      $ELM.get('head').append(style);
    },
    isLoggedIn() {
      return $ELM.get('#hdnIcaState').attr('value').length === 1;
    },
    gaPush({ eventCategory = 'A/B', eventAction, eventLabel }) {
      if (ga) {
        ga('send', 'event', eventCategory, eventAction, eventLabel);
      }
    },
  };
};
