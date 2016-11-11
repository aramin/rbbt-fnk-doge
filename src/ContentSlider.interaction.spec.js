// @tcomb

import test from 'ava';
import {OverlayContentSlider} from "./ContentSlider";
import {Fixture} from "./testHelper";

test.beforeEach('setup fixture', t => Fixture("./fixtures/overlay.html", (document) => {
  t.context.document = document;
}));

test.beforeEach('setup slider', t => {
  t.context.slider = new OverlayContentSlider({
    content: '.content-slider__image',
    overlay: '.overlay',
    extractSliderElement: function() {
      return document.createElement("div");
    },
    extractCaption: function() {},
    extractHashnavToken: function(_, index) {
      return index;
    }
  });
});
 
test("click on the image opens the overlay", t => {
  const {document, slider} = t.context;

  t.false(slider.elements.overlay.classList.contains("content-slider__overlay--is-visible"));
  slider.elements.content[0].click();
  t.true(slider.elements.overlay.classList.contains("content-slider__overlay--is-visible"));
});


test("click on the close icon closes the overlay", t => {
  const {document, slider} = t.context;

  slider.openOverlay();
  t.true(slider.elements.overlay.classList.contains("content-slider__overlay--is-visible"));

  slider.elements.closeIcon.click();
  t.false(slider.elements.overlay.classList.contains("content-slider__overlay--is-visible"));
});

test.cb("[toggleCaption] click on caption icon shows the caption", t => {
  const {document, slider} = t.context;

  t.false(slider.elements.caption.classList.contains(slider.cssClasses.captionModVisible));
  t.false(slider.elements.toggleCaptionIcon.classList.contains(slider.cssClasses.toggleCaptionIconModActive));

  // open caption
  slider.elements.toggleCaptionIcon.click();

  // need async, as captionModVisible class is set with timeout
  setTimeout(() => {
    t.true(slider.elements.caption.classList.contains(slider.cssClasses.captionModVisible));
    t.true(slider.elements.toggleCaptionIcon.classList.contains(slider.cssClasses.toggleCaptionIconModActive));

    t.end();
  }, 1);
});

test.cb("[toggleCaption] click on caption again hides the caption", t => {
  const {document, slider} = t.context;

  slider.toggleCaption();
  setTimeout(() => {
    slider.toggleCaption();

    setTimeout(() => {
      t.false(slider.elements.caption.classList.contains(slider.cssClasses.captionModVisible));
      t.false(slider.elements.toggleCaptionIcon.classList.contains(slider.cssClasses.toggleCaptionIconModActive));

      t.end();
    }, 1);
  }, 1);
});

test.skip("click on next changes the slider and update the nav position", t => {
  const {document, slider} = t.context;

  slider.openOverlay();
  // TODO
  // click next, check position
  // click prev, check position
});

