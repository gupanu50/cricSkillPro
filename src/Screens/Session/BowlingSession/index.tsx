import {
  FlatList,
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import adjust from '@/Component/adjust';
import {COLORS, FONT_FAMILIES} from '@/Configuration';
import {Images} from '@/Assets';
import {useNavigation} from '@react-navigation/native';
import useFirestore from '@/Hooks/useFirestore';
import moment from 'moment';
import {SCREENS} from '@/Constant';
const {SESSIONDETAILS} = SCREENS;
const BowlingSession = (props: any) => {
  const {date} = props;
  const navigation: any = useNavigation();
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const {getDashboardData, dashboardData, userId} = useFirestore('sessions');

  useEffect(() => {
    if (userId) {
      getDashboardData(userId, 'balling');
      setIsRefresh(false);
    }
  }, [userId, date, isRefresh]);

  const filteredData = dashboardData.filter((item:any) => {
    if (item?.createdAt) {
      const createdAtDate = item?.createdAt.toDate();
      const selectDate = moment(createdAtDate).format('DDMMYYYY');
      return date === selectDate;
    }
    return false;
  });

  const renderActive = (item: any) => {
    const {sessionName, sessionTime, createdAt, balls} = item.item;
    const jsDate = new Date(createdAt.seconds * 1000);
    const selectDate = moment(jsDate).format('DDMMYYYY');

    const formattedDate = moment(jsDate).format('MMMDoYYYYhmm');
    const ball = balls ?? [];
    function countPerformance() {
      let percentage: number = 0;
      let COLOR: string = '';
      let count = 0;
      let pr: number | any = 0;
      for (const item of ball) {
        if (item?.performance === 'Perfect') {
          count = count + 1;
        } else if (item?.performance === 'Average') {
          count = count + 0.5;
        } else {
          count = count + 0;
        }
      }
      pr = (count / ball.length).toFixed(1);
      if (pr !== 0 && !isNaN(pr)) {
        percentage = pr * 100;
      }
      if (percentage < 50) {
        COLOR = 'red';
      } else {
        COLOR = 'green';
      }
      return {percentage, COLOR};
    }

    const {percentage, COLOR} = countPerformance();
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(SESSIONDETAILS, {
            type: 1,
            createdAt: formattedDate,
            isBack: true,
          })
        }>
        <View style={styles.renderView}>
          <Image source={Images.sessionGreenBat} style={styles.renderImage} />
          <View style={styles.renderView1}>
            <Text style={styles.renderText}>{sessionName}</Text>
            <View style={styles.flexView}>
              <Image source={Images.time} style={styles.renderImage1} />
              <Text style={[styles.renderText, {fontSize: adjust(12)}]}>
                {sessionTime}
              </Text>
            </View>
          </View>
          <View style={styles.renderView4}>
            <Image source={Images.progress} />
            <Text
              style={[
                styles.renderText,
                {fontSize: adjust(12), marginLeft: adjust(5), color: COLOR},
              ]}>
              {percentage} %
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <Text style={styles.activeText}>Completed</Text>
      <View style={styles.flatStyle}>
        {filteredData.length > 0 ? (
          <FlatList
            data={filteredData}
            refreshControl={
              <RefreshControl
                refreshing={isRefresh}
                onRefresh={() => setIsRefresh(true)}
              />
            }
            // @ts-ignore
            renderItem={renderActive}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTxt}>{'No Sessions Yet'}</Text>
          </View>
        )}
      </View>
    </>
  );
};

export default BowlingSession;

const styles = StyleSheet.create({
  flatStyle: {
    height: adjust(320),
  },
  flatStyle1: {
    flex: 1,
  },
  activeText: {
    fontSize: adjust(15),
    fontFamily: FONT_FAMILIES.WORKSANS_SEMIBOLD,
    color: COLORS.BLACK,
    fontWeight: '400',
  },
  renderView: {
    height: adjust(80),
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    flexDirection: 'row',
    marginVertical: adjust(5),
  },
  renderView1: {
    margin: adjust(15),
  },
  renderText: {
    fontSize: adjust(14),
    fontFamily: FONT_FAMILIES.WORKSANS,
    color: COLORS.BLACK,
    fontWeight: '400',
  },
  renderImage: {
    marginLeft: adjust(15),
    marginTop: adjust(15),
    height: adjust(50),
    width: adjust(50),
  },
  flexView: {
    flexDirection: 'row',
    marginTop: adjust(10),
  },
  renderImage1: {
    alignSelf: 'center',
    marginRight: adjust(5),
  },
  renderView2: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  renderView3: {
    flexDirection: 'row',
  },
  renderView4: {
    flex: 0.8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  progressImage: {
    alignSelf: 'center',
  },
  touchStyle: {
    alignSelf: 'flex-end',
    position: 'absolute',
    top: Platform.OS === 'android' ? adjust(350) : adjust(250),
  },
  emptyContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  emptyTxt: {
    fontSize: 22,
    color: 'lightgrey',
    fontFamily: FONT_FAMILIES.WORKSANS,
    fontWeight: '500',
  },
});
