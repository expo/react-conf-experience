/**
 * @providesModule Schedule
 */

import React, {
  Image,
  ListView,
  NavigationExperimental,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import Immutable from 'immutable';

const {
  Container: NavigationContainer,
  Reducer: NavigationReducer,
} = NavigationExperimental;

const {
  PushAction,
} = NavigationReducer.StackReducer;

import {
  AsRelayContainer,
  AsRelayRenderer,
  Relay,
} from 'AppRelay';
import Colors from 'Colors';
import ExIcon from 'ExIcon';
import ExText from 'ExText';
import Layout from 'Layout';
import ViewerQuery from 'ViewerQuery';
import WithFreightSansFont from 'WithFreightSansFont';

const Events = Immutable.fromJS([
  {
    time: new Date('Mon Feb 22 2016 09:30:00 GMT-0800 (PST)'),
    title: 'How To Use React In A Wedding Gift Without Being A Bad Friend',
    speaker: 'Keith Poplawski',
    speakerPhotoUri: 'http://conf.reactjs.com/img/keith-poplawski.jpg',
    description: 'As a belated gift, I’ve created a physical, standalone version of Jeopardy. Featuring React as the project’s interface, an Arduino and a node app running on a Raspberry Pi create an engaging and unique user experience. The presentation highlights React’s potential to respond to input beyond the mouse, including touch, physical buttons, and speech recognition.',
  },
  {
    time: new Date('Mon Feb 22 2016 10:00:00 GMT-0800 (PST)'),
    title: 'Team × Technology',
    speaker: 'James Ide',
    speakerPhotoUri: 'http://conf.reactjs.com/img/james-ide.jpg',
    description: `With React Native, mobile developers are able to increase both their productivity and scope of work. The cross-platform technology is fantastic for teams building for Android and iOS, and developers can take ownership of products & features instead of single-platform implementations. At Exponent we've extended this idea to include both products and infrastructure. I'll talk a bit about how we apply this to our software development and the benefits and challenges of growing full-stack developers into cross-stack mobile developers who are responsible for Android and iOS.`,
  },
  {
    time: new Date('Tue Feb 23 2016 09:30:00 GMT-0800 (PST)'),
    title: 'Redux, Re-frame, Relay, Om/next, oh my!',
    speaker: 'Jared Forsyth',
    speakerPhotoUri: 'http://conf.reactjs.com/img/jared-forsyth.jpg',
    description: 'Managing client-side state is pretty easy for TodoMVC, but soon after you move beyond that, your app can quickly get brittle, discouraging re-use and significantly complicating maintenance. I will give an overview of a few of the libraries/frameworks that have appeared recently that try to address this problem, show how each of them looks when used in the React context, and then discuss advantages, disadvantages, common patterns, and what we can learn.',
  },
  {
    time: new Date('Mon Feb 22 2016 09:00:00 GMT-0800 (PST)'),
    title: 'Breakfast',
  },
  {
    time: new Date('Tue Feb 23 2016 09:00:00 GMT-0800 (PST)'),
    title: 'Breakfast',
  },
]);

function dayOfWeekAsString(dayNumber) {
  return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dayNumber - 1];
}

class Schedule extends React.Component {

  static relay = {
    queries: { ...ViewerQuery.queries },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          id
          days: schedule {
            date
            slots(first: 1000) {
              edges {
                node {
                  ${SlotPreview.getFragment('slot')}
                }
              }
            }
          }
        }
      `,
    },
  };

  constructor(props) {
    super(props);

    let dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this.state = {
      dataSource,
    };
  }

  _computeSlotsByDay() {
    const { days } = this.props.viewer;

    return days.reduce((result, day) => {
      let dayOfWeek = dayOfWeekAsString(new Date(day.date).getDay());
      result[dayOfWeek] = result[dayOfWeek] || [];
      result[dayOfWeek].push(...day.slots.edges.map(e => e.node));
      return result;
    }, {});
  }

  render() {
    if (this.props.relayLoading || !this.props.viewer) {
      return <View />;
    }

    let slotsByDay = this._computeSlotsByDay();

    let dataSource = this.state.dataSource
      .cloneWithRowsAndSections(slotsByDay, Object.keys(slotsByDay));

    return (
      <ListView
        style={{marginTop: 64}}
        dataSource={dataSource}
        renderRow={this._renderRow.bind(this)}
        renderSeparator={this._renderSeparator.bind(this)}
        renderSectionHeader={this._renderSectionHeader}
      />
    );
  }

  _renderRow(slot) {
    return (
      <SlotPreview slot={slot} onNavigate={this.getNavigationHandler()} />
    );
  }

  _renderSeparator(sectionId, rowId) {
    return (
      <View key={`sep-${sectionId}-${rowId}`} style={styles.rowSeparator} />
    );
  }

  _renderSectionHeader(sectionData, day) {
    return (
      <View style={styles.sectionHeaderContainer}>
        <WithFreightSansFont>
          <ExText style={styles.sectionHeaderText}>
            {day.toUpperCase()}
          </ExText>
        </WithFreightSansFont>
      </View>
    );
  }

  getNavigationHandler() {
    return this.props.onNavigate || this.context.onNavigate;
  }

  getChildContext() {
    return {
      onNavigate: this.getNavigationHandler(),
    };
  }
}

Schedule.contextTypes = {
  onNavigate: React.PropTypes.func,
};

Schedule.childContextTypes = {
  onNavigate: React.PropTypes.func,
};

export default AsRelayRenderer(Schedule);

const startTimeEndTimeFragment = Relay.QL`
  fragment on ScheduleSlotInterface {
    startTime
    endTime
  }
`;

class SlotPreview extends React.Component {

  static relay = {
    fragments: {
      slot: () => Relay.QL`
        fragment on ScheduleSlot {
          __typename
          ${startTimeEndTimeFragment}
          ...on ActivitySlot {
            title
          }
          ...on TalkSlot {
            talk{
              title
              speaker {
                name
                avatarUrl
              }
            }
          }
          ...on LightningTalksSlot {
            id
          }
        }
      `,
    },
  };

  render() {
    let { slot } = this.props;
    console.log(slot);
    let isSpecial = slot.__typename !== 'TalkSlot';
    console.log(slot, isSpecial);

    if (isSpecial) {
      return this._renderSpecial();
    } else {
      return (
        <TouchableHighlight
          onPress={() => {
            this.props.onNavigate(PushAction({type: 'ActivityInfo', event: this.props.slot, title: 'Activity Info!'}))
          }}>
          <View style={styles.SlotPreviewContainer}>
            <View style={styles.SlotPreviewLeftColumn}>
              <ExText style={styles.titleDetailsText}>
                {get12HourTime(new Date(slot.startTime))} - {slot.talk.speaker.name}
              </ExText>

              <ExText style={styles.titleText}>
                {slot.talk.title}
              </ExText>
            </View>
            <View style={styles.SlotPreviewRightColumn}>
              <Image
                style={styles.speakerPhoto}
                source={{uri: slot.talk.speaker.avatarUrl }} />
            </View>
            <View style={styles.SlotPreviewCaratColumn}>
              <ExIcon
                imageName="carat"
                style={styles.SlotPreviewCarat} />
            </View>
          </View>
        </TouchableHighlight>
      );
    }
  }

  _renderSpecial() {
    let { slot } = this.props;

    return (
      <View style={styles.SlotPreviewContainer}>
        <View style={styles.SlotPreviewLeftColumn}>
          <ExText style={styles.titleDetailsText}>
            {get12HourTime(new Date(slot.startTime))} - {slot.title}
          </ExText>
        </View>
      </View>
    );
  }
}

SlotPreview = AsRelayContainer(SlotPreview);

function get12HourTime(date) {
  let hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  let amPm = date.getHours() >= 12 ? "PM" : "AM";
  let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  return hours + ":" + minutes + amPm;
}

const styles = StyleSheet.create({
  sectionHeaderContainer: {
    backgroundColor: Colors.backgroundGray,
    borderBottomWidth: Layout.pixel,
    borderBottomColor: Colors.separator,
    paddingTop: 15,
    paddingBottom: 5,
    paddingLeft: 12,
  },
  sectionHeaderText: {
    fontSize: 14,
  },

  speakerPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  titleDetailsText: {
    color: Colors.slightlyFaded,
  },

  titleText: {
    fontSize: 18,
  },

  rowSeparator: {
    height: Layout.pixel,
    backgroundColor: Colors.separator,
    flex: 1,
  },

  SlotPreviewContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundWhite,
    padding: 15,
  },
  SlotPreviewLeftColumn: {
    flex: 1,
    paddingRight: 40,
  },
  SlotPreviewRightColumn: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  SlotPreviewCaratColumn: {
    width: 20,
    paddingTop: 15,
    justifyContent: 'center',
  },
  SlotPreviewCarat: {
    alignSelf: 'center',
    width: 8,
    height: 13,
  },
});
