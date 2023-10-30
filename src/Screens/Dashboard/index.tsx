import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, FONT_FAMILIES} from '@/Configuration';
import adjust from '@/Component/adjust';
import Header from '@/ReuseableComponent/Header';
import {Images} from '@/Assets';
import CustomButton from '@/Component/CustomButton';
import Batting from './Batting';
import Bowling from './Bowling';
import {SCREENS} from '@/Constant';
import useFirestore from '@/Hooks/useFirestore';
import {useIsFocused} from '@react-navigation/native';
import Loader from '@/ReuseableComponent/Loader';

const {CREATESESSION} = SCREENS;

const Dashboard = (props: any) => {
  const [selected, setSelected] = useState<number>(0);
  const [empty, setEmpty] = useState<boolean | null>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const isFocus = useIsFocused();

  const {getDashboard, userId} = useFirestore('sessions');

  const isEmpty = async () => {
    try {
      const res = await getDashboard(
        userId!,
        selected == 0 ? 'batting' : 'balling',
      );
      setLoading(false);
      setEmpty(res?.empty!);
    } catch (error) {
      console.log('====error>>>', error);
      setEmpty(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (userId) {
      isEmpty();
    }
  }, [userId, isFocus, selected]);

  return (
    <SafeAreaView style={styles.container}>
      <Header type isRightAction />
      <View style={styles.aniView}>
        <View style={styles.mainButtonView}>
          <TouchableOpacity
            style={[
              styles.mainButton,
              {
                backgroundColor:
                  selected == 0 ? COLORS.SELECTION : COLORS.WHITE,
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
                backgroundColor:
                  selected == 1 ? COLORS.SELECTION : COLORS.WHITE,
                marginLeft: adjust(15),
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
        <Text style={styles.overViewText}>Overview</Text>
        {empty && (
          <View style={styles.cardView}>
            <View style={styles.insideCardMainView}>
              <Image source={Images.noDataBatting} />
              <Text style={styles.noFoundText}>No records found!</Text>
              <Text style={styles.pleaseText}>
                Please start a session to get insights about your game.
              </Text>
              <CustomButton
                label="Start Session"
                image={Images.batIcon}
                press={() => props.navigation.navigate(CREATESESSION)}
                containerStyle={styles.startContainerStyle}
                style={styles.startStyle}
              />
            </View>
          </View>
        )}
      </View>
      {!empty && (
        <View style={styles.battingBowlingComponent}>
          {selected == 0 ? <Batting /> : <Bowling />}
        </View>
      )}
      <Loader loading={loading} />
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  aniView: {
    backgroundColor: COLORS.MAIN,
    flex: 0.3,
  },
  mainButtonView: {
    flexDirection: 'row',
    marginTop: adjust(10),
    justifyContent: 'center',
  },
  mainButton: {
    height: adjust(30),
    width: '30%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonText: {
    fontSize: adjust(15),
    fontFamily: FONT_FAMILIES.WORKSANS,
    fontWeight: '400',
  },
  overViewText: {
    fontSize: adjust(15),
    fontFamily: FONT_FAMILIES.WORKSANS_SEMIBOLD,
    fontWeight: '400',
    color: COLORS.WHITE,
    marginLeft: adjust(15),
    marginTop: adjust(15),
  },
  cardView: {
    margin: adjust(15),
    borderRadius: 10,
    backgroundColor: COLORS.WHITE,
    height: adjust(350),
  },
  insideCardMainView: {
    margin: adjust(35),
    alignItems: 'center',
  },
  noFoundText: {
    fontSize: adjust(18),
    fontFamily: FONT_FAMILIES.WORKSANS_SEMIBOLD,
    fontWeight: '400',
    color: COLORS.BLACK,
    marginTop: adjust(10),
  },
  pleaseText: {
    fontSize: adjust(12),
    fontFamily: FONT_FAMILIES.WORKSANS,
    fontWeight: '400',
    color: COLORS.BLACK,
    textAlign: 'center',
  },
  startContainerStyle: {
    height: adjust(50),
    justifyContent: 'center',
  },
  startStyle: {
    width: '100%',
  },
  battingBowlingComponent: {
    position: 'absolute',
    top: Platform.OS === 'android' ? '25%' : '37%',
    width: '100%',
  },
});
