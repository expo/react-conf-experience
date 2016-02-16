/**
 * @providesModule AsRelayRenderer
 */

import _ from 'lodash';

import React, {
  Alert,
  PropTypes,
} from 'react-native';

import RelayRenderer from 'react-relay/lib/RelayRenderer';

import AsRelayContainer from 'AsRelayContainer';

/**
 * Builds a Relay root container from static properties defined on the wrapped component.
 * The return component will accept a special prop, "routeParams", that will pass the appropriate
 * parameters to the Relay root.
 */
export default function AsRelayRenderer(Component) {

  if (Component.relay && !Component.relay.queries) {
    throw new Error('Relay component must define queries for Relay Root Container.');
  }

  const RelayComponent = AsRelayContainer(Component);

  // Global failure component

  class FailedComponent extends React.Component {
    componentDidMount() {
      if (__DEV__) {
        console.error(this.props.error);
      }

      Alert.alert('Network Request Failed', null, [
        { text: 'Retry', onPress: () => {
          this.props.retry();
        }},
        { text: 'Cancel' },
      ]);
      return;
    }

    render() {
      return <RelayComponent relayFailure {...this.props} />;
    }
  }

  class RelayRendererWrapper extends React.Component {
    static propTypes = {
      routeParams: PropTypes.object,
    };

    static defaultProps = {
      routeParams: {},
    };

    constructor(props, ...args) {
      super(props, ...args);
      this.state = {
        queryConfig: this._computeQueryConfig(props),
      };
    }

    render() {
      const emptyFragments = _.zipObject(RelayComponent.getFragmentNames().map(name => ([name, null])));

      return (
        <RelayRenderer
          Container={RelayComponent}
          forceFetch={RelayComponent.relay.forceFetch || false}
          queryConfig={this.state.queryConfig}
          render={({ done, error, props, retry, stale }) => {
            if (error) { // error
              return <FailedComponent {...this.props} retry={retry} error={error} {...emptyFragments} {...props} />;
            } else if (props) { // fetched
              return <RelayComponent {...this.props} {...props} />;
            } else { // loading
              return <RelayComponent {...this.props} relayLoading {...emptyFragments} {...props} />;
            }
          }}
        />
      );
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.routeParams !== nextProps.routeParams) {
        this.setState({
          queryConfig: this._computeQueryConfig(nextProps),
        });
      }
    }

    _computeQueryConfig(props) {
      let queryConfig = {
        name: `relay-route-${RelayComponent.displayName}`,
        queries: { ...RelayComponent.relay.queries },
        params: {},
      };

      /*
        Allows us to define:

        static relay = {
          ...
          paramDefinitions: ...
        }

        on the component being wrapped and we ensure these allow
        our given route params.
      */

      const { relay: { paramDefinitions } } = RelayComponent;

      if (paramDefinitions) {
        queryConfig.params = _.reduce(paramDefinitions, (final, val, key) => {
          if (props.routeParams[key]) {
            final[key] = props.routeParams[key];
          }
          return final;
        }, {});
      }

      return queryConfig;
    }
  }

  return RelayRendererWrapper;
}
