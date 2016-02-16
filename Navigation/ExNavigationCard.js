/**
 * @providesModule ExNavigationCard
 */
'use strict';

const Animated = require('Animated');
const NavigationReducer = require('NavigationReducer');
const NavigationContainer = require('NavigationContainer');
const PanResponder = require('PanResponder');
const Platform = require('Platform');
const React = require('React');
const StyleSheet = require('StyleSheet');
const View = require('View');

// note(brentvatne): yuck
const Dimensions = require('Dimensions');
const WINDOW_WIDTH = Dimensions.get('window').width;

const ENABLE_GESTURES = true;

import type {
  NavigationParentState
} from 'NavigationState';

type Layout = {
  initWidth: number,
  initHeight: number,
  width: Animated.Value;
  height: Animated.Value;
};

type Props = {
  navigationState: NavigationParentState;
  index: number;
  position: Animated.Value;
  layout: Layout;
  onNavigate: Function;
  children: Object;
};

class NavigationCard extends React.Component {
  _responder: ?Object;
  _lastHeight: number;
  _lastWidth: number;
  _widthListener: string;
  _heightListener: string;
  props: Props;
  componentWillMount() {
    if (ENABLE_GESTURES) {
      this._enableGestures();
    }
  }
  _enableGestures() {
    this._responder = PanResponder.create({
      onMoveShouldSetPanResponder: (e, {dx, dy, moveX, moveY, x0, y0}) => {
        if (this.props.navigationState.index === 0) {
          return false;
        }
        if (moveX > 30) {
          return false;
        }
        if (dx > 5 && Math.abs(dy) < 4) {
          return true;
        }
        return false;
      },
      onPanResponderGrant: (e, {dx, dy, moveX, moveY, x0, y0}) => {
      },
      onPanResponderMove: (e, {dx}) => {
        const a = (-dx / this._lastWidth) + this.props.navigationState.index;
        this.props.position.setValue(a);
      },
      onPanResponderRelease: (e, {vx, dx}) => {
        const xRatio = dx / this._lastWidth;
        const doesPop = (xRatio + vx) > 0.45;
        if (doesPop) {
          // todo: add an action which accepts velocity of the pop action/gesture, which is caught and used by NavigationAnimatedView
          this.props.onNavigate(NavigationReducer.StackReducer.PopAction());
          return;
        }
        Animated.spring(this.props.position, {
          toValue: this.props.navigationState.index,
        }).start();
      },
      onPanResponderTerminate: (e, {vx, dx}) => {
        Animated.spring(this.props.position, {
          toValue: this.props.navigationState.index,
        }).start();
      },
    });
  }
  componentDidMount() {
    this._lastHeight = this.props.layout.initHeight;
    this._lastWidth = this.props.layout.initWidth;
    this._widthListener = this.props.layout.width.addListener(({value}) => {
      this._lastWidth = value;
    });
    this._heightListener = this.props.layout.height.addListener(({value}) => {
      this._lastHeight = value;
    });
    // todo: fix listener and last layout dimensions when props change. potential bugs here
  }
  componentWillUnmount() {
    this.props.layout.width.removeListener(this._widthListener);
    this.props.layout.height.removeListener(this._heightListener);
  }
  render() {
    const cardPosition = Animated.add(this.props.position, new Animated.Value(-this.props.index));

    let { index } = this.props;
    const gestureValue = this.props.position.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [-WINDOW_WIDTH, 0, WINDOW_WIDTH / 2.5],
      extrapolate: 'clamp',
    });

    const touchResponderHandlers = this._responder ? this._responder.panHandlers : null;
    return (
      <Animated.View
        {...touchResponderHandlers}
        style={[
          styles.card,
          {
            right: gestureValue,
            left: gestureValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -1],
            })
          }
        ]}>
        {this.props.children}

        <Animated.View
          pointerEvents="none"
          style={[
            styles.overlay,
            {
              opacity: cardPosition.interpolate({
                inputRange: [0,1],
                outputRange: [0,0.6],
              }),
            }
          ]} />
      </Animated.View>
    );
  }
}

NavigationCard = NavigationContainer.create(NavigationCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E9E9EF',
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 10,
    top: 0,
    bottom: 0,
    position: 'absolute',
  },
  overlay: {
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

module.exports = NavigationCard;
