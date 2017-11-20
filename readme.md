To create a new project:
  - npm run create name-of-project

To build a project
  - npm run dev name-of-project

To build and watch a project
  - npm run dev name-of-project -- --watch

Util library is in folder icacro.

Util git repo: https://github.com/Banzaci/icacro

In Chrome
  - chrome://extensions/
  - Find tampermonkey
  - allowed to access local file URIs

In Tampermonkey

// ==UserScript==
// @name            Template
// @author          Acecool
// @namespace       Acecool
// @version         0.0.1
// @description     Replaces encoded-links with decoded direct-links on episode finder sites.
// @description     Automatically click the "continue" button, and attempt to skip the countdown if any, on video watching sites.
// @description     Remove ad panels on video watching sites.
// @match           https://www.ica.se/*
// @require         file:///C:/path_to_project/src/project_name/variant.min.js
// @grant           GM_xmlhttpRequest
// ==/UserScript==
