/**
 * @providesModule ExNavigationStackReducer
 * @flow
 */
'use strict';

var NavigationStateUtils = require('NavigationState');

import type {
  NavigationState,
  NavigationReducer,
} from 'NavigationState';

import type {
  BackAction,
} from 'NavigationRootContainer';

export type NavigationStackReducerAction = BackAction | {
  type: string,
};

export type NavigationStackVelocityParams = {
  vx: number;
  vy: number;
};

const ActionTypes = {
  GESTURE_POP: 'react-native/NavigationExperimental/stack-gesture-pop',
  PUSH: 'react-native/NavigationExperimental/stack-push',
  POP: 'react-native/NavigationExperimental/stack-pop',
  JUMP_TO: 'react-native/NavigationExperimental/stack-jumpTo',
  JUMP_TO_INDEX: 'react-native/NavigationExperimental/stack-jumpToIndex',
  RESET: 'react-native/NavigationExperimental/stack-reset',
};

const DEFAULT_KEY = 'NAV_STACK_DEFAULT_KEY';

function NavigationStackPushAction(state: NavigationState): NavigationStackReducerAction {
  return {
    type: ActionTypes.PUSH,
    state,
  };
}

function NavigationStackGesturePopAction(velocity: NavigationStackVelocityParams): NavigationStackReducerAction {
  return {
    type: ActionTypes.GESTURE_POP,
    velocity,
  };
}

function NavigationStackPopAction(): NavigationStackReducerAction {
  return {
    type: ActionTypes.POP,
  };
}

function NavigationStackJumpToAction(key: string): NavigationStackReducerAction {
  return {
    type: ActionTypes.JUMP_TO,
    key,
  };
}

function NavigationStackJumpToIndexAction(index: number): NavigationStackReducerAction {
  return {
    type: ActionTypes.JUMP_TO_INDEX,
    index,
  };
}

function NavigationStackResetAction(children: Array<NavigationState>, index: number): NavigationStackReducerAction {
  return {
    type: ActionTypes.RESET,
    index,
    children,
  };
}

type StackReducerConfig = {
  initialStates: Array<NavigationState>;
  initialIndex: ?number;
  key: ?string;
  matchAction: (action: any) => boolean;
  actionStateMap: (action: any) => NavigationState;
};

function NavigationStackReducer({initialStates, initialIndex, key, matchAction, actionStateMap}: StackReducerConfig): NavigationReducer {
  return function (lastState: ?NavigationState, action: any): NavigationState {
    if (key == null) {
      key = DEFAULT_KEY;
    }
    if (initialIndex == null) {
      initialIndex = initialStates.length - 1;
    }
    if (!lastState) {
      lastState = {
        index: initialIndex,
        children: initialStates,
        key,
      };
    }
    const lastParentState = NavigationStateUtils.getParent(lastState);
    if (!action || !lastParentState) {
      return lastState;
    }
    switch (action.type) {
      case ActionTypes.PUSH:
        return NavigationStateUtils.push(
          lastParentState,
          action.state
        );
      case ActionTypes.POP:
      case ActionTypes.GESTURE_POP:
      case 'BackAction':
        if (lastParentState.index === 0 || lastParentState.children.length === 1) {
          return lastParentState;
        }
        return NavigationStateUtils.pop(lastParentState);
      case ActionTypes.JUMP_TO:
        return NavigationStateUtils.jumpTo(
          lastParentState,
          action.key
        );
      case ActionTypes.JUMP_TO_INDEX:
        return NavigationStateUtils.jumpToIndex(
          lastParentState,
          action.index
        );
      case ActionTypes.RESET:
        return {
          ...lastParentState,
          index: action.index,
          children: action.children,
        };
    }
    if (matchAction(action)) {
      return NavigationStateUtils.push(
        lastParentState,
        actionStateMap(action)
      );
    }
    return lastParentState;
  };
}

NavigationStackReducer.PushAction = NavigationStackPushAction;
NavigationStackReducer.PopAction = NavigationStackPopAction;
NavigationStackReducer.GesturePopAction = NavigationStackGesturePopAction;
NavigationStackReducer.JumpToAction = NavigationStackJumpToAction;
NavigationStackReducer.JumpToIndexAction = NavigationStackJumpToIndexAction;
NavigationStackReducer.ResetAction = NavigationStackResetAction;

module.exports = NavigationStackReducer;
