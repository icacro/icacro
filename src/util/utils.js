import Storage from './modules/storage';
import { get } from './functions';
import { hide, view } from './element-functions';

export const ReservedElements = ['label', 'div', 'body', 'head', 'img', 'style', 'span', 'ul', 'li', 'input', 'button', 'h1', 'h2', 'h3', 'h4', 'a', 'p', 'strong', 'svg'];

export function toArray(list) {
  return Array.prototype.slice.call(list);
}

export function proxyTest(element) {
  const arr = {};
  [hide, view].forEach((func) => {
    arr[func.name] = func.bind(element);
  });
  return arr;
}

export function ajax(...args) {
  const [url, options] = args;
  const ops = Object.assign({}, { method: 'get' }, options);
  console.log(url);
  console.log(ops);
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
