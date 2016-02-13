/**
 * @providesModule ExTabNavigator
 */
'use strict';

import React, {
  NavigationExperimental,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const {
  Container: NavigationContainer,
  Reducer: NavigationReducer,
  View: NavigationView,
} = NavigationExperimental;

const {
  JumpToAction,
} = NavigationReducer.TabsReducer;

class ExTabBar extends React.Component {

  render() {
    return (
      <View style={styles.tabBar}>
        {this.props.tabs.map(this._renderTab.bind(this))}
      </View>
    );
  }

  _renderTab(tab, index) {
    let textStyle = [styles.tabButtonText];

    if (this.props.index === index) {
      textStyle.push(styles.selectedTabButtonText);
    }

    return (
      <TouchableOpacity
        style={styles.tabButton}
        key={tab.key}
        onPress={() => { this.props.onNavigate(JumpToAction(index)); }}>
        <Text style={textStyle}>
          {tab.key}
        </Text>
      </TouchableOpacity>
    );
  }
};

ExTabBar = NavigationContainer.create(ExTabBar);

class ExTabNavigator extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <NavigationView
          navigationState={this.props.navigationState}
          style={styles.tabNavigator}
          renderScene={this.props.renderScene}
        />
        <ExTabBar
          tabs={this.props.navigationState.children}
          index={this.props.navigationState.index}
        />
      </View>
    );
  }

}

export default ExTabNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    height: 50,
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
  },
  tabButtonText: {
    paddingTop: 20,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '500',
  },
  selectedTabButtonText: {
    color: 'blue',
  },
  tabNavigator: {
    flex: 1,
  },
});
