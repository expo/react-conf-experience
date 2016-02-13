/**
 * @providesModule ReactConfApp
 */

import React, {
  AppRegistry,
  NavigationExperimental,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const {
  Container: NavigationContainer,
  RootContainer: NavigationRootContainer,
} = NavigationExperimental;

import Colors from 'Colors';
import ExNavigationReducer from 'ExNavigationReducer';
import ExText from 'ExText';
import Layout from 'Layout';
import Schedule from 'Schedule';
import ExTabNavigator from 'ExTabNavigator';

class App extends React.Component {

  render() {
    return (
      <NavigationRootContainer
        reducer={ExNavigationReducer}
        renderNavigation={this._renderApp.bind(this)}
      />
    );
  }

  _renderApp(navigationState) {
    return (
      <ExTabNavigator
        renderScene={this._renderTabScene}
        navigationState={navigationState}
      />
    );
  }

  _renderTabScene(tabState, index) {
    if (index === 0) {
      return <Schedule />;
    } else {
      return (
        <View>
          <Text>{index}</Text>
        </View>
      );
    }
  }

  _renderHeader() {
    return (
      <View style={styles.headerContainer}>
        <ExText style={{fontSize: 20}}>
          Schedule
        </ExText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.backgroundGray,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 28,
    borderBottomWidth: Layout.pixel,
    borderBottomColor: Colors.separator,
  }
});

AppRegistry.registerComponent('main', () => App);
