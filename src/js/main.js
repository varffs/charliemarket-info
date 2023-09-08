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

function bind() {
  $('.cm-gallery .wp-block-image').on('click', (event) => {
    const $target = $(event.currentTarget);
    const $gallery = $target.closest('.cm-gallery');
    const $galleryInnerWrapper = $gallery.find('.cm-gallery__inner-wrapper');
    const $galleryItems = $galleryInnerWrapper.find('.wp-block-image');

    const galleryLength = $galleryItems.length;

    let targetIndex = $target.index();
    let currentIndex = $gallery.data('current-index');

    console.log(currentIndex);

    if (currentIndex === undefined) {
      $gallery.data('current-index', 0);
      currentIndex = 0;
    }

    // work out which we want to scroll to based on current index and target index

    if (targetIndex === currentIndex && targetIndex !== galleryLength - 1) {
      // if the target is actually already active scroll to the next
      targetIndex += 1;
    } else if (
      // unless it's the last one, in which case scroll to the first
      targetIndex === currentIndex &&
      targetIndex === galleryLength - 1
    ) {
      targetIndex = 0;
    }

    // scroll to that element with one function call

    const targetLeft = $galleryItems.eq(targetIndex).offset().left;
    const baseLeft = $galleryInnerWrapper.offset().left;
    const wrapperScrollLeft = $galleryInnerWrapper[0].scrollLeft;

    $galleryInnerWrapper[0].scroll({
      left: targetLeft - baseLeft + wrapperScrollLeft,
      behavior: 'smooth',
    });

    $gallery.data('current-index', targetIndex);
  });
}

$(document).ready(function () {
  'use strict';

  layout(); 

  bind();

  $(window).on('resize', () => {
    layout();
  });
});
