import Storage from './modules/storage';
import CreateElement from './create-element';
import Element from './element';

export const ReservedElements = ['svg', 'article', 'label', 'div', 'body', 'head', 'img', 'style', 'span', 'ul', 'li', 'input', 'button', 'h1', 'h2', 'h3', 'h4', 'a', 'p', 'strong', 'svg'];

const GetElement = (selector) => {
  if (selector instanceof HTMLElement) return selector;
  return document.querySelector(selector);
};

const GetElements = selector => document.querySelectorAll(selector);

const elementStore = [];

export function get(...args) {
  if (args.length === 1) {
    const key = Number.isInteger(parseInt(args[0], 10)) ? parseInt(args[0], 10) : args[0];
    return new Element(GetElement(key));
  }
  return args.map((arg) => {
    const key = Number.isInteger(parseInt(arg, 10)) ? parseInt(arg, 10) : arg;
    return new Element(GetElement(key));
  });
}

export function svg(icon, classname = '', symbol = '/v2-symbols.svg') {
  const element = CreateElement(`div ${classname}`);
  element.html(`<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/${symbol}#${icon}"></use></svg>`);
  return element;
}

export function elements(arg) {
  return Array.from(GetElements(arg)).map(elm => new Element(elm));
}

export function create(args, options) {
  if (Array.isArray(args)) return args.map(arg => CreateElement(arg));
  return CreateElement(args, options);
}

export function copy(selector) {
  const child = GetElement(selector);
  if (child) {
    return CreateElement(child.cloneNode(true));
  }
  throw new Error(`${selector} Element does not exist! Function 'copy'`);
}

export function getElementContentByTagAndAttr(regexp, tag, attr) {
  const qsa = document.querySelectorAll(tag);
  return Array.from(qsa).reduce((acc, element) => {
    if (new RegExp(regexp).test(element[attr])) {
      acc.push(element[attr]);
    }
    return acc;
  }, []);
}

export function removeElements(...classNames) {
  classNames.forEach((className) => {
    const [...elms] = document.querySelectorAll(className);
    elms.forEach((elm) => {
      if (elm instanceof HTMLElement) elm.parentNode.removeChild(elm);
    });
  });
}

export function save(id, element) {
  elementStore[id] = elementStore[id] || {};
  elementStore[id] = element;
}

function checkForChildren(resolve, reject, element, selector, counter = 0) {
  const children = element.children(selector);
  if (children.length > 0) return resolve(children);
  return setTimeout(() => {
    const check = counter + 1;
    if (check > 100) reject();
    return checkForChildren(resolve, reject, element, selector, check);
  }, 100);
}

export async function waitForContent(element, selector) {
  return new Promise((resolve, reject) => checkForChildren(resolve, reject, element, selector));
}

export function ajax(...args) {
  const [url, options] = args;
  const ops = Object.assign({}, { method: 'get' }, options);
  return fetch(url, ops)
    .then(response => response.json())
    .catch(err => err);
}

export function gaPush({ eventCategory = 'A/B', eventAction, eventLabel }) {
  if (ga) {
    ga('send', 'event', eventCategory, eventAction, eventLabel);
  }
}

export const storage = {
  set(key, value) {
    Storage.set(key, value);
  },
  get(key) {
    return Storage.get(key);
  },
  remove(key) {
    Storage.remove(key);
  },
};

export function isLoggedIn() {
  return get('#hdnIcaState').attr('value').length > 1;
}

export function triggerHotJar(triggerName) {
  // Handle if hj is not yet loaded, taken from
  // https://help.hotjar.com/hc/en-us/articles/115015712548-Using-JavaScript-Triggers-to-Start-Recordings)
  window.hj = window.hj || function () { (hj.q = hj.q || []).push(arguments); }; // eslint-disable-line

  hj('trigger', triggerName);
}
