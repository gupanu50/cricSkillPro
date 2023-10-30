import {BackHandler, Platform, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '@/ReuseableComponent/Header';
import {COLORS, FONT_FAMILIES} from '@/Configuration';
import adjust from '@/Component/adjust';
import {Bar} from 'react-native-progress';
import BattingDetails from './BattingDetails';
import useFirestore from '@/Hooks/useFirestore';
import Loader from '@/ReuseableComponent/Loader';
import BowlingDetails from './BowlingDetails';
import {Route, useNavigation} from '@react-navigation/native';
import {SCREENS} from '@/Constant';
const {MAIN} = SCREENS;
const SessionDetails = (props: any) => {
  const {route} = props;
  const {params} = route;
  const [loading, setLoading] = useState<boolean>(true);
  const {getSessionData, sessionData} = useFirestore('session');
  const navigation = useNavigation();

  const balls = sessionData?.balls ?? [];

  useEffect(() => {
    function handleBackButton() {
      if (!params?.isBack) {
        // @ts-ignore
        navigation.navigate(MAIN);
      } else {
        navigation.goBack();
      }
      return true;
    }

    // Handle when back button pressed
    const backHandler: any = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );
    return () => backHandler.remove();
  }, []);

  setTimeout(() => {
    getSessionData(params?.type, params?.createdAt);
    countPerformance();
  }, 2000);

  let pr: any = 0;
  const [per, setPer] = useState<number>(0);
  function countPerformance() {
    let count = 0;
    for (const item of balls) {
      if (item?.performance === 'Perfect') {
        count = count + 1;
      } else if (item?.performance === 'Average') {
        count = count + 0.5;
      } else {
        count = count + 0;
      }
    }
    pr = (count / balls.length).toFixed(1);
    if (pr !== 0 && !isNaN(pr)) {
      setPer(pr);
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Header title="Session Details" isBack close={!params?.isBack} />
      <View style={styles.backView}>
        <View style={styles.mainView}>
          <Text style={styles.overText}>Overrall Performance</Text>
          <Bar
            progress={per}
            width={null}
            height={30}
            color="#1BCA18"
            style={styles.barStyle}
            unfilledColor="white"
            animationType="spring"
          />
          <Text style={styles.perText}>{per * 100} %</Text>
        </View>
      </View>
      <View style={styles.scrollingView}>
        {params.type == 0 ? (
          <BattingDetails data={sessionData} />
        ) : (
          <BowlingDetails data={sessionData} />
        )}
      </View>
      <Loader loading={loading} />
    </View>
  );
};

export default SessionDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backView: {
    backgroundColor: COLORS.MAIN,
    flex: 0.3,
  },
  mainView: {
    margin: adjust(15),
    flex: 1,
  },
  overText: {
    fontFamily: FONT_FAMILIES.WORKSANS_SEMIBOLD,
    fontSize: adjust(15),
    color: COLORS.WHITE,
    fontWeight: '500',
  },
  barStyle: {
    marginTop: adjust(10),
    borderRadius: 20,
  },
  perText: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: adjust(36.5),
    right: adjust(10),
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILIES.WORKSANS,
    fontWeight: '500',
  },
  scrollingView: {
    position: 'absolute',
    top: Platform.OS === 'android' ? '24%' : adjust(155),
    width: '100%',
    height: '77%'
  },
});
