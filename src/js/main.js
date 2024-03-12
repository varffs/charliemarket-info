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
    // height logic: take the full height of the footer and the top margin of main content and the height of post title and also the bottom margin of the gallery, sum and set gallery height as window minus that.
    const footerHeight = $('#footer').outerHeight(true);
    const mainContentTopMargin = $('#main-content').css('margin-top');
    const postTitleHeight = $('.post__title').outerHeight(true);
    const galleryBottomMargin = $(item).css('margin-bottom');
    const galleryHeight = $(window).height() - footerHeight - parseInt(mainContentTopMargin) - postTitleHeight - parseInt(galleryBottomMargin);

    $(item).css('height', galleryHeight + 'px').addClass('cm-gallery--loaded');

    $(item).find('.cm-gallery__item').each(function (index, item) {
      const yesIKnowThisHasGotAwkwardThereHaveBeenALotOfIterationsAndItIsAFavor = true;

      const imageHeight = $(item).find('.cm-gallery__image').attr('height');
      const aspectRatio = $(item).find('.cm-gallery__image').attr('width') / imageHeight;
      const galleryHeight = $(item).outerHeight(true);

      if (yesIKnowThisHasGotAwkwardThereHaveBeenALotOfIterationsAndItIsAFavor && aspectRatio > 1) { // landscape image
        if (imageHeight < galleryHeight) { // if the original image is vertically smaller than the gallery
          $(item).css(
            'width',
            $(item).find('.cm-gallery__image').attr('width') + 'px'
          );
        } else { 
          $(item).css('width', 'auto');
            
          const trueImageWidth = $(item).find('.cm-gallery__image').outerWidth(true);

          $(item).css('width', trueImageWidth + 'px');        
        }
      } else { // portrait image
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
    const $nextUnloaded = $(event.currentTarget)
      .closest('.cm-gallery')
      .find('.cm-gallery__image[loading="lazy"]')
      .first();

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

  let imagesLoaded = 0;

  $('.cm-gallery__image')
    .one('load', (event) => {
      imagesLoaded += 1;

      if (imagesLoaded > 4 && imagesLoaded % 4 === 0) {
        const element = event.target;
        const $gallery = $(element).closest('.cm-gallery');

        const $nextUnloaded = $gallery.find(
          '.cm-gallery__image[loading="lazy"]'
        ).slice(0, 3);

        if ($nextUnloaded.length) {
          $nextUnloaded.attr('loading', 'eager');
        }
      }

      layout();
    })
    .each(function () {
      if (this.complete) {
        $(this).trigger('load');
      }
    });
});
