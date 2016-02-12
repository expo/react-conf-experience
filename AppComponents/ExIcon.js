/**
 * @providesModule ExIcon
 */
'use strict';

import React, {
  PropTypes,
} from 'react-native';
import ResponsiveImage from '@exponent/react-native-responsive-image';

import Constants from 'Constants';

export default class ExIcon extends React.Component {

  static propTypes = {
    ...ResponsiveImage.propTypes,
    imageName: PropTypes.string,
  };

  static sources(imageName, options = {}) {
    let baseUrl = `${Constants.cdnHost}${imageName}`;

    return {
      2: {uri: `${baseUrl}@2x.png`},
      // 3: {uri: `${baseUrl}@3x.png`},
    };
  }

  setNativeProps(nativeProps) {
    this._image.setNativeProps(nativeProps);
  }

  render() {
    return (
      <ResponsiveImage
        ref={image => { this._image = image; }}
        sources={ExIcon.sources(this.props.imageName, this.props)}
        fadeDuration={0}
        {...this.props}
      />
    );
  }
}
