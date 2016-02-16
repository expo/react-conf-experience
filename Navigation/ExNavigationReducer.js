/**
 * @providesModule ExNavigationReducer
 */

import { NavigationExperimental } from 'react-native';
const { Reducer: NavigationReducer } = NavigationExperimental;

function makeSimpleStackReducer(tabName) {
  return (
    NavigationReducer.StackReducer({
      initialStates: [
        {type: `${tabName}Page`, key: 'base', title: tabName},
      ],
      key: tabName,
      matchAction: () => false,
    })
  );
}

export default NavigationReducer.TabsReducer({
  tabReducers: [
    makeSimpleStackReducer('Schedule'),
    makeSimpleStackReducer('People'),
    makeSimpleStackReducer('Event Info'),
    makeSimpleStackReducer('Me'),
  ],
});
