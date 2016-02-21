/**
 * Copyright 2015-present 650 Industries. All rights reserved.
 *
 * @providesModule Layout
 */
'use strict';

import {
  Dimensions,
  PixelRatio,
  Platform,
  NativeModules,
} from 'react-native';

const { ExponentConstants } = NativeModules;

let windowDimensions = Dimensions.get('window');
let isSmallDevice = (windowDimensions.width <= 320);

let Layout = {
  isSmallDevice,
  pixel: 1 / PixelRatio.get(),
  tabBarHeight: 49,
  navigationBarDisplacement: 0,
  marginHorizontal: isSmallDevice ? 10 : 15,
  statusBarHeight: 20, //ExponentConstants.statusBarHeight,
  window: windowDimensions,
};

let platformDependentLayout = {};

if (Platform.OS === 'ios') {
  platformDependentLayout = {
    navigationBarHeight: 44,
  };
} else {
  platformDependentLayout = {
    navigationBarHeight: 56,
    navigationBarDisplacement: Layout.statusBarHeight,
  };
}

platformDependentLayout.headerHeight = Layout.statusBarHeight + platformDependentLayout.navigationBarHeight;

Object.assign(Layout, platformDependentLayout);

export default Layout;
