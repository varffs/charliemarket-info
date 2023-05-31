/* jshint esversion: 6, browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */

import '../styl/site.styl'; // import styl for webpack

import $ from 'jquery';

function l(data) {
  'use strict';
  console.log(data);
}

function getTotalWidth(items) {
  let width = 0;
  
  items.each(function (index, item) {
    width += $(item).outerWidth(true);
  });

  return width;
}

function layout() {
  'use strict';

  $('.cm-gallery').each(function (index, item) {
    l($(item).data('length'));

    const totalWidth = getTotalWidth($(item).find('.wp-block-image'));

    $(item)
      .find('.cm-gallery__inner')
      .css('width', totalWidth + 'px');
  });
}

$(document).ready(function () {
  'use strict';

  layout(); 

  $(window).resize(function () {
    layout();
  });
});
