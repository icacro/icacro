import CreateElement from './create-element';
import Element from './element';

const GetElement = (selector) => {
  if (selector instanceof HTMLElement) return selector;
  return document.querySelector(selector);
};

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
  return this.toArray(qsa).reduce((acc, element) => {
    if (new RegExp(regexp).test(element[attr])) {
      acc.push(element[attr]);
    }
    return acc;
  }, []);
}

export function removeElements(classNames) {
  classNames.forEach((className) => {
    const elm = document.querySelector(className);
    if (elm instanceof HTMLElement) elm.parentNode.removeChild(elm);
  });
}
