// ==UserScript==
// @name         testName
// @path         testPath
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL, ELM } from '../util/main';
import {
  // rect,
  // removeClass,
  // href,
  // image,
  // insertAfter,
  // placeholder,
  // attr,
  // view,
  // text,
  // find,
  // html,
  // value,
  // hide,
  // get,
  // children,
  // appendFirst,
  // appendAll,
  // click,
  // copy,
  // data,
  // remove,
  // toggle,
} from '../util/element-functions';

import './style.css';

if (hj) hjf;// eslint-disable-line

function init() {
  const test = {
    manipulateDom() {},
  };
  Object.assign(test, ICACRO());
  ELM.push(
    // rect,
    // removeClass,
    // href,
    // image,
    // insertAfter,
    // placeholder,
    // attr,
    // view,
    // text,
    // find,
    // html,
    // value,
    // hide,
    // get,
    // children,
    // appendFirst,
    // appendAll,
    // click,
    // copy,
    // data,
    // remove,
    // toggle,
  );
  test.manipulateDom();
}

init();
