/**
 * @providesModule WithFreightSansFont
 */
'use strict';

import { createCustomFontComponent } from '@exponent/with-custom-font';

import Constants from 'Constants';

export default createCustomFontComponent({
  fontFamily: 'FreightSansLFPro',
  fontWeight: 'normal',
  fontFamilyAndroid: 'FreightSansLFPro',
  fontStyleAndroid: 'regular',
  uri: `${Constants.cdnHost}FreigSanLFProBoo.otf`,
});
