/*
eslint no-param-reassign: [
  "error", { "props": true, "ignorePropertyModificationsFor": ["element"] }
]
*/
/* eslint no-use-before-define: ["error", { "functions": false }] */
/* eslint-env es6 */

import { create, get, copy } from './functions';
import { ajax } from './utils';

export const ELM = {
  create,
  get,
  copy,
};

export const CROUTIL = () => {
  get('body').css('cro');
  return {
    ajax,
  };
};
