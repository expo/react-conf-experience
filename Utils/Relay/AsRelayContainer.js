/**
 * @providesModule AsRelayContainer
 */

import invariant from 'invariant';
import Relay from 'react-relay';

export default function AsRelayContainer(Component) {
  invariant(
    Component.relay,
    'Relay components must specify Relay container properties in `relay` static property.',
    Component.displayName || Component.name
  );

  const RelayComponent = Relay.createContainer(Component, {
    initialVariables: Component.relay.initialVariables,
    fragments: Component.relay.fragments,
    prepareVariables: Component.relay.prepareVariables,
  });

  RelayComponent.__proto__ = Component;

  return RelayComponent;
}
