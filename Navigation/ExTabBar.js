/**
 * @providesModule ExTabBar
 */
'use strict';

import React, {
  NavigationExperimental,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const {
  Container: NavigationContainer,
  Reducer: NavigationReducer,
} = NavigationExperimental;

const {
  JumpToAction,
} = NavigationReducer.TabsReducer;

import ExBadge from 'ExBadge';
import ExTab from 'ExTab';
import Layout from 'Layout';

class ExTabBar extends React.Component {

  static propTypes = {
    ...View.propTypes,
    shadowStyle: View.propTypes.style,
  };

  render() {
    return (
      <View style={[styles.tabBar, this.props.style]}>
        {this.props.tabs.map(this._renderTab.bind(this))}
        <View style={[styles.shadow, this.props.shadowStyle]} />
      </View>
    );
  }

  _navigateToTab(index) {
    this.props.onNavigate(JumpToAction(index));
  }

  _renderTab(tabState, i) {
    let isSelected = i === this.props.index;
    let focusTab = () => this._navigateToTab(i);
    let item = this.props.renderTabItem(
      tabState.key,
      isSelected,
      focusTab,
    );


    let icon;
    if (isSelected) {
      if (item.props.renderSelectedIcon) {
        icon = item.props.renderSelectedIcon();
      } else if (item.props.renderIcon) {
        let defaultIcon = item.props.renderIcon();
        icon = React.cloneElement(defaultIcon, {
          style: [defaultIcon.props.style, styles.defaultSelectedIcon],
        });
      }
    } else if (!isSelected && item.props.renderIcon) {
      icon = item.props.renderIcon();
    }

    let badge;
    if (item.props.renderBadge) {
      badge = item.props.renderBadge();
    } else if (item.props.badgeText) {
      badge = <ExBadge>{item.props.badgeText}</ExBadge>;
    }

    return (
      <ExTab
        title={item.props.title}
        allowFontScaling={item.props.allowFontScaling}
        titleStyle={[
          item.props.titleStyle,
          item.props.selected ? [
            styles.defaultSelectedTitle,
            item.props.selectedTitleStyle,
          ] : null,
        ]}
        badge={badge}
        onPress={item.props.onPress || focusTab}
        hidesTabTouch={this.props.hidesTabTouch}>
        {icon}
      </ExTab>
    );
  }
};

export default NavigationContainer.create(ExTabBar);

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
  shadow: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    height: Layout.pixel,
    position: 'absolute',
    left: 0,
    right: 0,
    top: Platform.OS === 'android' ? 0 : -Layout.pixel,
  },
});
