/**
 * Copyright 2015-present 650 Industries. All rights reserved.
 *
 * @providesModule FadeIn
 */
'use strict';

import React, {
  StyleSheet,
  View,
} from 'react-native';

export default class FadeIn extends React.Component {

  render() {
    let image = React.Children.only(this.props.children);

    return (
      <View {...this.props}>
        <View style={styles.placeholderContainer}>
          <View style={[image.props.style, styles.placeholder]} />
        </View>

        {image}
      </View>
    );
  }
}

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
