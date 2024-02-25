/* jshint esversion: 6, browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */

import '../styl/site.styl'; // import styl for webpack

import $ from 'jquery';

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
    $(item).find('.cm-gallery__item').each(function (index, item) {
      const yesIKnowThisHasGotAwkward = true;
      const imageHeight = $(item).find('.cm-gallery__image').attr('height');
      const aspectRatio = $(item).find('.cm-gallery__image').attr('width') / imageHeight;
      const galleryHeight = $(item).outerHeight(true);

      if (yesIKnowThisHasGotAwkward && aspectRatio > 1) {
        const trueImageWidth = $(item)
          .find('.cm-gallery__image')
          .outerWidth(true);
        $(item).css('width', trueImageWidth + 'px');
      } else {
        $(item).css('width', galleryHeight * aspectRatio + 'px');
      }
    });

    $(item).find('.cm-gallery__inner').css('width', '10000%');

    const totalWidth = getTotalWidth($(item).find('.cm-gallery__item'));

    $(item)
      .find('.cm-gallery__inner')
      .css('width', totalWidth + 'px');
  });
}

function bind() {
  $('.cm-gallery .cm-gallery__item').on('click', (event) => {
    // trigger the next image to load
    const $nextUnloaded = $('.cm-gallery__image[loading="lazy"]').first();

    if ($nextUnloaded.length) {
      $nextUnloaded.attr('loading', 'eager');
    }

    // work out indexes
    const $target = $(event.currentTarget);
    const $gallery = $target.closest('.cm-gallery');
    const $galleryInnerWrapper = $gallery.find('.cm-gallery__inner-wrapper');
    const $galleryItems = $galleryInnerWrapper.find('.cm-gallery__item');

    const galleryLength = $galleryItems.length;

    let targetIndex = $target.index();
    let currentIndex = $gallery.data('current-index');

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

$(() => {
  'use strict';

  layout(); 

  bind();

  $(window).on('resize', () => {
    layout();
  });

  $('.cm-gallery__image')
    .one('load', function () {
      layout();
    })
    .each(function () {
      if (this.complete) {
        $(this).load();
      }
    });
});
