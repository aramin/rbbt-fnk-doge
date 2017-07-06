// @flow

import test from 'ava';
import {OverlayContentSlider} from "./ContentSlider";
import {Fixture} from "ava-browser-fixture";
import sinon from "sinon";

test.beforeEach('setup document', t => Fixture("./src/fixtures/overlay.html", (document) => {
    t.context.document = document;
}));

test.beforeEach('setup slider', t => {
    t.context.slider = new OverlayContentSlider({
        content: '.content-slider__image',
        overlay: '.overlay',
        extractSliderElement: function () {
            return document.createElement("div");
        },
        extractCaption: function () {
        },
        extractHashnavToken: function (_, index) {
            return index;
        }
    });
});

test.todo("bemCssClass change name of the css classes");

test.todo("cssClasses can be overwritten");


test('[_setupContent] must setup all UI elements', t => Fixture("./src/fixtures/overlay.html", (document) => {
    const slider = t.context.slider;

    t.truthy(slider.elements.overlay);
    t.truthy(slider.elements.elementsContainer);
    t.truthy(slider.elements.caption);
    t.truthy(slider.elements.toggleCaptionIcon);
    t.truthy(slider.elements.closeIcon);
    t.truthy(slider.elements.navPosition);
}));

test('[_setupCSSClasses] must have one image and correct defaults', t => {
    const slider = t.context.slider;

    t.true(slider.elements.content.length === 1, "initialized with one image");
    t.true(slider.elements.content[0].classList.contains("content-slider__image"), "has default element class set");
});

test('[refresh] must destroy the swiper', t => {
    t.context.slider._initSwiper();

    const destroySpy = sinon.spy(t.context.slider, "_destroySwiper");

    t.context.slider.refresh();
    t.true(destroySpy.called);
});

test('[refresh] must re-init the swiper', t => {
    t.context.slider._initSwiper();

    const initSpy = sinon.spy(t.context.slider, "_initSwiper");

    t.context.slider.refresh();
    t.true(initSpy.called);
});

test('[refresh] must update the caption', t => {
    t.context.slider._initSwiper();

    const updateCaptionSpy = sinon.spy(t.context.slider, "_updateCaption");

    t.context.slider.refresh();
    t.true(updateCaptionSpy.called);
});

test.skip("check that swiper has been initialized correctly", t => {
    t.is(slider.swiper.slides.length, 1, "Swiper has been initialized with one slide");
});

