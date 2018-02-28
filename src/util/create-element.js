import Element from './element';
import { ReservedElements } from './utils';

function getType(arr) {
  return arr.reduce((acc, current) => {
    const type = ReservedElements.find(element => element === current);
    if (type) acc.type = type;
    else acc.classes.push(current);
    return acc;
  }, { type: 'div', classes: [] });
}

export default function CreateElement(arg, options) {
  if (arg instanceof HTMLElement) return new Element(arg);
  const arr = arg.split(' ').filter(a => a.length > 0);
  const { type, classes } = getType(arr);
  const element = document.createElement(type);
  if (options) {
    Object.keys(options).forEach((option) => {
      const value = options[option];
      element[option] = value;
    });
  }
  return new Element(element).css(...classes);
}
