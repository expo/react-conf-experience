/**
 * @providesModule ExText
 */
'use strict';

import React, {
  Platform,
  StyleSheet,
  Text,
} from 'react-native';

export default class ExText extends React.Component {
  render() {
    return (
      <Text
        ref={this._setTextRef.bind(this)}
        {...this.props}
        style={[styles.base, this.props.style]}>
        {this.props.children}
      </Text>
    );
  }

  setNativeProps(nativeProps) {
    this._textRef.setNativeProps(nativeProps);
  }

  _setTextRef(component) {
    this._textRef = component;

    if (typeof this.props.textRef === 'function') {
      this.props.textRef(component);
    }
  }
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'FreightSansLFPro',
  },
});
