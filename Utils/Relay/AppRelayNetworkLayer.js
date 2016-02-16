/**
 * @providesModule AppRelayNetworkLayer
 */

import Relay from 'react-relay';

export default class AppRelayNetworkLayer extends Relay.DefaultNetworkLayer {
  sendMutation(mutation) {
    console.log('Mutation: ---');
    console.log(mutation.getQueryString(), mutation.getVariables(), mutation.getDebugName());
    console.log('/Mutation: ---');
    return super.sendMutation(...arguments);
  }

  sendQueries(queries) {
    console.log('Queries: ---');
    for (let q of queries) {
      console.log(q.getQueryString(), q.getVariables(), q.getID(), q.getDebugName());
    }
    console.log('/Queries: ---');
    return super.sendQueries(...arguments);
  }
}
