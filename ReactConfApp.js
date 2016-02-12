/**
 * @providesModule ReactConfApp
 */

import React, {
  AppRegistry,
  StyleSheet,
  View,
} from 'react-native';

import Colors from 'Colors';
import ExText from 'ExText';
import Layout from 'Layout';
import Schedule from 'Schedule';

class App extends React.Component {
  render() {
    return (
      <View style={{flex: 1}}>
        {this._renderHeader()}
        <Schedule />
      </View>
    );
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
  }
});

AppRegistry.registerComponent('main', () => App);
