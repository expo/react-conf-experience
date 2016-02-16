/**
 * @providesModule ExTabNavigator
 */
'use strict';

import React, {
  NavigationExperimental,
  StyleSheet,
  View,
} from 'react-native';

const {
  AnimatedView: NavigationAnimatedView,
  Card: NavigationCard,
  Container: NavigationContainer,
  View: NavigationView,
} = NavigationExperimental;

import ExNavigationHeader from 'ExNavigationHeader';
import ExTabItem from 'ExTabItem';
import ExTabBar from 'ExTabBar';

class ExTabNavigator extends React.Component {

  static Item = ExTabItem;

  render() {
    return (
      <View style={styles.container}>
        {/* Takes the current navigationState and renders a scene for each tab.
          * It also hides and shows these tabs depending on which index is selected
          * in the navigationState. */}
        <NavigationView
          navigationState={this.props.navigationState}
          style={styles.tabNavigator}
          renderScene={this._renderTabScene.bind(this)}
        />

        {/* This actually renders the tab bar view (buttons etc) */ }
        <ExTabBar
          style={this.props.tabBarStyle}
          tabs={this.props.navigationState.children}
          renderTabItem={this.props.renderTabItem}
          index={this.props.navigationState.index}
        />
      </View>
    );
  }

  _renderTabScene(tabState, tabIndex) {
    { /* Each tab scene has its own stack, and we want transitions between
       * scenes in this substack to be animated, so we use AnimatedView
       * along with NavigationHeader and NavigationCard */ }
    return (
      <NavigationAnimatedView
        style={{flex: 1, marginTop: 25}}
        key={tabIndex}
        navigationState={tabState}
        renderOverlay={(position, layout) => {
          return (
            <ExNavigationHeader
              navigationState={tabState}
              position={position}
              layout={layout}
              getTitle={state => tabState.children[0].type}
            />
          );
        }}
        renderScene={(child, index, position, layout) => {
          return (
            <NavigationCard
              key={child.key}
              index={index}
              childState={child}
              navigationState={tabState}
              position={position}
              layout={layout}>
              {this.props.renderScene(child, index)}
            </NavigationCard>
          );
        }}
      />
    );
  }
}

export default NavigationContainer.create(ExTabNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabNavigator: {
    flex: 1,
  },
});
