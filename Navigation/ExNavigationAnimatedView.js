/**
 * @providesModule ExNavigationAnimatedView
 */
'use strict';

var Animated = require('Animated');
var Map = require('Map');
var NavigationStateUtils = require('NavigationState');
var NavigationContainer = require('NavigationContainer');
var React = require('react-native');
var View = require('View');

const USE_NATIVE_ANIMATIONS = true;

import type {
  NavigationState,
  NavigationParentState,
} from 'NavigationState';

type NavigationScene = {
  index: number,
  state: NavigationState,
  isStale: boolean,
};

/**
 * Helper function to compare route keys (e.g. "9", "11").
 */
function compareKey(one: string, two: string): number {
  var delta = one.length - two.length;
  if (delta > 0) {
    return 1;
  }
  if (delta < 0) {
    return -1;
  }
  return one > two ? 1 : -1;
}

/**
 * Helper function to sort scenes based on their index and view key.
 */
function compareScenes(
  one: NavigationScene,
  two: NavigationScene
): number {
  if (one.index > two.index) {
    return 1;
  }
  if (one.index < two.index) {
    return -1;
  }

  return compareKey(
    one.state.key,
    two.state.key
  );
}

type Layout = {
  initWidth: number,
  initHeight: number,
  width: Animated.Value;
  height: Animated.Value;
};

type OverlayRenderer = (
  position: Animated.Value,
  layout: Layout
) => ReactElement;

type SceneRenderer = (
  state: NavigationState,
  index: number,
  position: Animated.Value,
  layout: Layout
) => ReactElement

type Props = {
  navigationState: NavigationParentState;
  renderScene: SceneRenderer;
  renderOverlay: ?OverlayRenderer;
  style: any;
};

class NavigationAnimatedView extends React.Component {
  _animatedHeight: Animated.Value;
  _animatedWidth: Animated.Value;
  _lastHeight: number;
  _lastWidth: number;
  props: Props;
  constructor(props) {
    super(props);
    this._animatedHeight = new Animated.Value(0);
    this._animatedWidth = new Animated.Value(0);
    this.state = {
      position: new Animated.Value(this.props.navigationState.index, USE_NATIVE_ANIMATIONS),
      scenes: new Map(),
    };
  }
  componentWillMount() {
    this.setState({
      scenes: this._reduceScenes(this.state.scenes, this.props.navigationState),
    });
  }
  componentDidMount() {
    this.postionListener = this.state.position.addListener(this._onProgressChange.bind(this));
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.navigationState !== this.props.navigationState) {
      this.setState({
        scenes: this._reduceScenes(this.state.scenes, nextProps.navigationState, this.props.navigationState),
      });
    }
  }
  componentDidUpdate(lastProps) {
    if (lastProps.navigationState.index !== this.props.navigationState.index) {
      this._isTransitioning = true;

      Animated.spring(this.state.position, {
        toValue: this.props.navigationState.index,
        bounciness: 0,
        speed: 15,
        restDisplacementThreshold: 0.1,
        restSpeedThreshold: 0.1,
        overshootClamping: true,
      }).start(({finished}) => {
        if (finished) {
          this._isTransitioning = false;
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.postionListener) {
      this.state.position.removeListener(this.postionListener);
      this.postionListener = null;
    }
  }

  onNavigate(action) {
    if (action.velocity) {
      this._isTransitioning = true;

      Animated.spring(this.state.position, {
        toValue: this.props.navigationState.index - 1,
        bounciness: 0,
        speed: 15,
        velocity: -action.velocity.cx,
        restDisplacementThreshold: 0.05,
        restSpeedThreshold: 0.05,
        overshootClamping: true,
      }).start(() => {
        this._isTransitioning = false;
        this.props.onNavigate(action);
      });
    } else {
      if (!this._isTransitioning) {
        this.props.onNavigate(action);
      }
    }

  }

  getNavigationHandler() {
    return this.onNavigate.bind(this);
  }

  getChildContext() {
    return {
      onNavigate: this.getNavigationHandler(),
    };
  }

  _onProgressChange(data: Object): void {
    console.log(data);
    if (Math.abs(data.value - this.props.navigationState.index) > Number.EPSILON) {
      return;
    }
    this.state.scenes.forEach((scene, index) => {
      if (scene.isStale) {
        const scenes = this.state.scenes.slice();
        scenes.splice(index, 1);
        this.setState({ scenes, });
      }
    });
  }
  _reduceScenes(
    scenes: Array<NavigationScene>,
    nextState: NavigationParentState,
    lastState: ?NavigationParentState
  ): Array<NavigationScene> {
    let nextScenes = nextState.children.map((child, index) => {
      return {
        index,
        state: child,
        isStale: false,
      };
    });

    if (lastState) {
      lastState.children.forEach((child, index) => {
        if (!NavigationStateUtils.get(nextState, child.key)) {
          nextScenes.push({
            index,
            state: child,
            isStale: true,
          });
        }
      });
    }

    nextScenes = nextScenes.sort(compareScenes);

    return nextScenes;
  }
  render() {
    return (
      <View
        onLayout={(e) => {
          const {height, width} = e.nativeEvent.layout;
          this._animatedHeight &&
            this._animatedHeight.setValue(height);
          this._animatedWidth &&
            this._animatedWidth.setValue(width);
          this._lastHeight = height;
          this._lastWidth = width;
        }}
        style={this.props.style}>
        {this.state.scenes.map(this._renderScene, this)}
        {this._renderOverlay(this._renderOverlay, this)}
      </View>
    );
  }
  _getLayout() {
    return {
      height: this._animatedHeight,
      width: this._animatedWidth,
      initWidth: this._lastWidth,
      initHeight: this._lastHeight,
    };
  }
  _renderScene(scene: NavigationScene) {
    return this.props.renderScene(
      scene.state,
      scene.index,
      this.state.position,
      this._getLayout()
    );
  }
  _renderOverlay() {
    const {renderOverlay} = this.props;
    if (renderOverlay) {
      return renderOverlay(
        this.state.position,
        this._getLayout()
      );
    }
    return null;
  }
}

NavigationAnimatedView.contextTypes = {
  onNavigate: React.PropTypes.func,
};

NavigationAnimatedView.childContextTypes = {
  onNavigate: React.PropTypes.func,
};

NavigationAnimatedView = NavigationContainer.create(NavigationAnimatedView);

module.exports = NavigationAnimatedView;
