/**
 * @providesModule WithFreightSansBoldFont
 */
'use strict';

import { createCustomFontComponent } from '@exponent/with-custom-font';

import Constants from 'Constants';

export default createCustomFontComponent({
  fontFamily: 'FreightSansLFPro',
  fontWeight: 'bold',
  fontFamilyAndroid: 'FreightSansLFPro',
  fontStyleAndroid: 'bold',
  uri: `${Constants.cdnHost}FreigSanLFProBol.otf`,
});
