/**
 * Copyright 2015-present 650 Industries. All rights reserved.
 *
 * @providesModule FadeIn
 */
'use strict';

import React, {
  Animated,
  StyleSheet,
  View,
} from 'react-native';
import TimerMixin from 'react-timer-mixin';

import reactMixin from 'react-mixin';
import cloneReferencedElement from 'react-native-clone-referenced-element';

export default class FadeIn extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      placeholderContainerOpacity: new Animated.Value(1),
    };
  }

  render() {
    let image = cloneReferencedElement(React.Children.only(this.props.children), {
      ref: component => { this._image = component; },
      onLoadEnd: this._onLoadEnd.bind(this),
    });

    return (
      <View {...this.props}>
        {image}

        <Animated.View style={[
          styles.placeholderContainer,
          {opacity: this.state.placeholderContainerOpacity}
        ]}>
          <View style={[image.props.style, styles.placeholder]} />
        </Animated.View>
      </View>
    );
  }

  _onLoadEnd() {

    /* NOTE(brentvatne): If we animate in immediately when the onLoadEvent event
       fires, there are two unwanted consequences:
     1. Animation feels janky - not entirely sure why that is
       (handled with minimumWait)
     2. Many images finish loading in the same frame for some reason, and in my
       opinion it looks better when the images fade in separately
       (handled with staggerNonce) */

    const minimumWait = 100;
    const staggerNonce = 200 * Math.random();

    this.setTimeout(() => {
      Animated.timing(this.state.placeholderContainerOpacity, {
        toValue: 0,
        duration: 350,
      }).start();
    }, minimumWait + staggerNonce);
  }
}

reactMixin(FadeIn.prototype, TimerMixin);

let styles = StyleSheet.create({
  placeholderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  placeholder: {
    backgroundColor: '#F1F1F1',
  },
});
