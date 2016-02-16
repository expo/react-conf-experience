/**
 * @providesModule ExNavigationHeader
 */
'use strict';

import React, {
  Animated,
  Image,
  NavigationExperimental,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const {
  Container: NavigationContainer,
  Reducer: NavigationReducer,
} = NavigationExperimental;

import ExIcon from 'ExIcon';
import ExText from 'ExText';
import WithFreightSansFont from 'WithFreightSansFont';

const AnimatedExText = Animated.createAnimatedComponent(ExText);
const AnimatedExIcon = Animated.createAnimatedComponent(ExIcon);

class ExNavigationHeader extends React.Component {

  componentWillMount() {
    this._handleBackPress = this._handleBackPress.bind(this);
  }

  render() {
    var state = this.props.navigationState;
    return (
      <Animated.View
        style={[
          styles.header,
          this.props.headerStyle,
        ]}>
        {state.children.map(this._renderTitle, this)}
        {state.children.map(this._renderBackButton, this)}
      </Animated.View>
    );
  }

  _renderBackButton(childState, index) {
    if (index === 0) {
      return null;
    }

    return (
      <Animated.View
        style={[
          styles.backButtonWrapper,
          {
            opacity: this.props.position.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [0, 1, 0],
            }),
          },
        ]}>
        <TouchableOpacity onPress={this._handleBackPress}>
          <ExIcon imageName="carat" style={styles.backButtonImage} />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  _renderTitle(childState, index) {
    return (
      <AnimatedExText
        key={childState.key}
        style={[
          styles.title,
          this.props.titleStyle,
          {
            opacity: this.props.position.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [0, 1, 0],
            }),
          },
        ]}>
        {this.props.getTitle(childState)}
      </AnimatedExText>
    );
  }

  _handleBackPress() {
    this.props.onNavigate(NavigationReducer.StackReducer.PopAction());
  }
}

ExNavigationHeader = NavigationContainer.create(ExNavigationHeader);

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 21,
    color: '#0A0A0A',
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 12,
    left: 0,
    right: 0,
  },
  header: {
    backgroundColor: '#F3F5F5',
    paddingTop: 20,
    top: 0,
    height: 64,
    right: 0,
    left: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D2D2D2',
    position: 'absolute',
  },
  backButtonWrapper: {
    width: 29,
    height: 37,
    bottom: 10,
    left: 2,
    padding: 8,
    position: 'absolute',
  },
  backButtonImage: {
    tintColor: '#000',
    width: 13,
    height: 21,
    transform: [{rotate: '180deg'}],
  },
});

module.exports = ExNavigationHeader;
