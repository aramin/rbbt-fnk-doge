// @tcomb

import test from 'ava';
import {OverlayContentSlider} from "./ContentSlider";
import {Fixture, window} from "./testHelper";
import sinon from "sinon";

test.serial.beforeEach('setup fixture', t => Fixture("./fixtures/overlay.html", (document) => {
  t.context.document = document;
  t.context.window = window;
}));

test.serial.beforeEach('setup slider', t => {
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

test.serial.beforeEach('setup history mock', t => {
  const {window} = t.context;

  t.context.pushStateSpy = sinon.stub(window.history, "pushState");
  t.context.backSpy = sinon.spy(window.history, "back");
});

test.serial.afterEach.always("restore history functions", t => {
  const {window} = t.context;

  window.history.pushState.restore();
  window.history.back.restore();
});
 
test.serial("click on the image opens the overlay", t => {
  const {document, slider} = t.context;

  t.false(slider.elements.overlay.classList.contains("content-slider__overlay--is-visible"));
  slider.elements.content[0].click();
  t.true(slider.elements.overlay.classList.contains("content-slider__overlay--is-visible"));
});


test.serial("click on the close icon closes the overlay", t => {
  const {document, slider, window, pushStateSpy, backSpy} = t.context;

  t.is(backSpy.callCount, 0);

  slider.openOverlay(false);
  t.true(slider.elements.overlay.classList.contains("content-slider__overlay--is-visible"));
  
  slider.elements.closeIcon.click();
  t.false(slider.elements.overlay.classList.contains("content-slider__overlay--is-visible"));

  t.is(backSpy.callCount, 1);


});

test.serial.cb("[toggleCaption] click on caption icon shows the caption", t => {
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

test.serial.cb("[toggleCaption] click on caption again hides the caption", t => {
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

test.serial.skip("click on next changes the slider and update the nav position", t => {
  const {document, slider} = t.context;

  slider.openOverlay();
  // TODO
  // click next, check position
  // click prev, check position
});

