import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '@/ReuseableComponent/Header';
import adjust from '@/Component/adjust';
import {COLORS, FONT_FAMILIES} from '@/Configuration';
import CalendarStrip from 'react-native-calendar-strip';
import BattingSession from './BattingSession';
import BowlingSession from './BowlingSession';
import {Images} from '@/Assets';
import {SCREENS} from '@/Constant';
import moment from 'moment';
import useFirestore from '@/Hooks/useFirestore';
import Loader from '@/ReuseableComponent/Loader';
import {useIsFocused} from '@react-navigation/native';
const {CREATESESSION} = SCREENS;
const Session = (props: any) => {
  const {navigation} = props;
  const isFocus: boolean = useIsFocused();
  const today: Date = new Date();
  const [selected, setSelected] = useState<number>(0);
  const [date, setDate] = useState<Date>(today);
  const [loading, setLoading] = useState<boolean>(true);
  const [minDate, setMinDate] = useState<Date>(today);
  const [selectedDate, setSelectedDate] = useState<Date | string>(
    moment(today).format('DDMMYYYY'),
  );

  const handleDateSelected = (date: Date) => {
    const dt: Date = new Date(date);
    const dtt: string = moment(dt).format('DDMMYYYY');
    setDate(date);
    setSelectedDate(dtt);
  };
  let dateWhiteList = [
    {start: minDate, end: today}
  ]
  const {user} = useFirestore('auth');

  useEffect(() => {
    if (user !== null) {
      setLoading(false);
      // @ts-ignore
      setMinDate(new Date(user?.createdAt._seconds * 1000));
    }
  }, [user, isFocus]);

  return (
    <View style={styles.container}>
      <Header title="Sessions" isBackArrowHide />
      <View style={styles.aniView}></View>
      <View style={styles.cardView}>
     {/* @ts-ignore */}
        <CalendarStrip
          calendarAnimation={{type: 'sequence', duration: 30}}
          daySelectionAnimation={{
            type: 'border',
            duration: 200,
            borderWidth: 1,
            borderHighlightColor: 'black',
          }}
          style={{
            height: 100,
            paddingTop: 20,
            paddingBottom: 10,
            borderRadius: 10,
          }}
          selectedDate={date}
          // @ts-ignore
          onDateSelected={handleDateSelected}
          calendarHeaderStyle={{color: 'black'}}
          calendarColor={'white'}
          dateNumberStyle={{color: 'black'}}
          dateNameStyle={{color: 'black'}}
          highlightDateNumberStyle={{color: COLORS.SELECTION}}
          highlightDateNameStyle={{color: COLORS.SELECTION}}
          disabledDateNameStyle={{color: 'grey'}}
          disabledDateNumberStyle={{color: 'grey'}}
          iconContainer={{flex: 0.1}}
          datesWhitelist={dateWhiteList}
          maxDate={today}
          minDate={minDate}
        />
      </View>
      <View style={styles.mainButtonView}>
        <TouchableOpacity
          style={[
            styles.mainButton,
            {
              backgroundColor: selected == 0 ? COLORS.SELECTION : COLORS.WHITE,
              borderWidth: selected == 0 ? 0 : 1,
            },
          ]}
          onPress={() => setSelected(0)}>
          <Text
            style={[
              styles.ButtonText,
              {color: selected == 0 ? COLORS.WHITE : COLORS.BLACK},
            ]}>
            Batting
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.mainButton,
            {
              backgroundColor: selected == 1 ? COLORS.SELECTION : COLORS.WHITE,
              marginLeft: adjust(15),
              borderWidth: selected == 1 ? 0 : 1,
            },
          ]}
          onPress={() => setSelected(1)}>
          <Text
            style={[
              styles.ButtonText,
              {color: selected == 1 ? COLORS.WHITE : COLORS.BLACK},
            ]}>
            Bowling
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.main}>
        {selected == 0 ? (
          <BattingSession date={selectedDate} />
        ) : (
          <BowlingSession date={selectedDate} />
        )}
      </View>
      <View style={styles.plusStyle}>
        <TouchableOpacity onPress={() => navigation.navigate(CREATESESSION)}>
          <Image source={Images.plusButton} />
        </TouchableOpacity>
      </View>
      <Loader loading={loading} />
    </View>
  );
};

export default Session;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  aniView: {
    backgroundColor: '#006641',
    flex: 0.1,
  },
  main: {
    margin: adjust(15),
    flex: 1,
  },
  cardView: {
    height: adjust(80),
    borderRadius: 10,
    backgroundColor: COLORS.WHITE,
    position: 'absolute',
    alignSelf: 'center',
    top: Platform.OS === 'android' ? adjust(85) : adjust(70),
    width: '90%',
  },
  mainButtonView: {
    flexDirection: 'row',
    marginTop: Platform.OS === 'android' ? adjust(80) : adjust(85),
    justifyContent: 'center',
  },
  mainButton: {
    height: adjust(30),
    width: '30%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.GRAY,
  },
  ButtonText: {
    fontSize: adjust(15),
    fontFamily: FONT_FAMILIES.WORKSANS,
    fontWeight: '400',
  },
  activeTxt: {
    fontSize: adjust(15),
    fontFamily: FONT_FAMILIES.WORKSANS_SEMIBOLD,
    fontWeight: '400',
    color: COLORS.BLACK,
  },
  battingBowlingComponent: {
    margin: adjust(15),
    flex: 1,
  },
  plusStyle: {
    alignItems: 'flex-end',
    margin: adjust(10),
  },
});
