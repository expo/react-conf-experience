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
import ExIcon from 'ExIcon';
import ExText from 'ExText';
import Layout from 'Layout';
import Schedule from 'Schedule';
import ExTabNavigator from 'ExTabNavigator';

class TabIcon extends React.Component {
  render() {
    let imageName, style;
    let { tab, selected } = this.props;

    if (tab === 'Schedule') {
      imageName = 'ScheduleIcon';
      style = { width: 25, height: 28 }
    } else if (tab === 'People') {
      imageName = 'PeopleIcon';
      style = { width: 45, height: 24 }
    } else if (tab === 'Event Info') {
      imageName = 'EventInfoIcon';
      style = { width: 20, height: 28 }
    } else {
      imageName = 'MeIcon';
      style = { width: 35, height: 25 }
    }

    style.tintColor = selected ? Colors.tint : '#fff';

    return (
      <ExIcon
        imageName={imageName}
        style={style}
      />
    );
  }
}

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
    if (!navigationState) {
      return null;
    }

    return (
      <ExTabNavigator
        tabBarStyle={styles.tabBar}
        renderScene={this._renderTabScene}
        renderTabItem={this._renderTabItem}
        navigationState={navigationState}>
      </ExTabNavigator>
    );
  }

  _renderTabItem(key, isSelected) {
    return (
      <ExTabNavigator.Item
        title={key}
        renderIcon={() => <TabIcon tab={key} />}
        renderSelectedIcon={() => <TabIcon tab={key} selected />}
        selectedTitleStyle={{color: Colors.tint}}
        selected={isSelected}
      />
    );
  }

  _renderTabScene(tabState, index) {
    if (tabState.type === 'SchedulePage') {
      return <Schedule />;
    } else {
      return (
        <View style={{flex: 1}}>
          <Text>{tabState.type}</Text>
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
  },
  tabBar: {
    backgroundColor: '#1B1D24',
  },
});

AppRegistry.registerComponent('main', () => App);
