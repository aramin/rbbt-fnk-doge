// @tcomb

import test from 'ava';
import {OverlayContentSlider} from "./ContentSlider";
import {Fixture} from "ava-browser-fixture";

test('is not a single', t => Fixture("./fixtures/overlay.html", (document) => {
  // when:
  let
    options = {
      content: '.test__image',
      overlay: '.overlay',
      extractSliderElement: function() {},
      extractCaption: function() {},
      extractHashnavToken: function(_, index) {
        return index;
      }
    },
    instance_one = new OverlayContentSlider(options),
    instance_two = new OverlayContentSlider(options);

  // then:
  t.false(instance_one === instance_two, "ContentSlider is no singleton");
}));