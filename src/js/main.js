/* jshint esversion: 6, browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */

import '../styl/site.styl'; // import styl for webpack

import $ from 'jquery';

function l(data) {
  'use strict';
  console.log(data);
}

$(document).ready(function () {
  'use strict';
  l('Hola Globie');
});
