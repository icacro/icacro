import Element from './element';

const reservedElements = ['div', 'body', 'head', 'img', 'style', 'span', 'ul', 'li', 'input', 'button', 'h1', 'h2', 'h3', 'h4', 'a', 'p', 'strong', 'svg'];

function getType(arr) {
  return arr.reduce((acc, current) => {
    const type = reservedElements.find(element => element === current);
    if (type) acc.type = type;
    else acc.classes.push(current);
    return acc;
  }, { type: 'div', classes: [] });
}

export default function (arg, options) {
  if (arg instanceof HTMLElement) return new Element(arg);
  const arr = arg.split(' ');
  const { type, classes } = getType(arr);
  const dom = document.createElement(type);
  if (options) {
    Object.keys(options).forEach((option) => {
      const value = options[option];
      dom[option] = value;
    });
  }
  return new Element(dom).css(...classes);
}
