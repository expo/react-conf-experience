/**
 * @providesModule ViewerQuery
 */

import Relay from 'react-relay';

export default {
  queries: {
    viewer: Component => Relay.QL`
      query ViewerQuery {
        viewer {
          ${Component.getFragment('viewer')}
        }
      }`,
  },
};
