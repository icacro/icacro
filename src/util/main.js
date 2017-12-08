/*
eslint no-param-reassign: [
  "error", { "props": true, "ignorePropertyModificationsFor": ["element"] }
]
*/
/* eslint no-use-before-define: ["error", { "functions": false }] */
/* eslint-env es6 */

import { create, get, copy } from './functions';

export const ELM = {
  create,
  get,
  copy,
};

export const CROUTIL = (funcs) => {
  get('body').css('cro');
  return funcs;
};
