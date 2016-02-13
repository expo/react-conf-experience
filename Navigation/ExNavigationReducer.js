/**
 * @providesModule ExNavigationReducer
 */

import { NavigationExperimental } from 'react-native';
const { Reducer: NavigationReducer } = NavigationExperimental;

function makeSimpleStackReducer(tabName) {
  return (
    NavigationReducer.StackReducer({
      initialStates: [
        {type: `${tabName}Page`, key: 'base'},
      ],
      key: tabName.toLowerCase(),
      matchAction: () => false,
    })
  );
}

export default NavigationReducer.TabsReducer({
  tabReducers: [
    makeSimpleStackReducer('Schedule'),
    makeSimpleStackReducer('People'),
    makeSimpleStackReducer('EventInfo'),
    makeSimpleStackReducer('Me'),
  ],
});
