import {
  BackHandler,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import adjust from '@/Component/adjust';
import Header from '@/ReuseableComponent/Header';
import {COLORS, FONT_FAMILIES} from '@/Configuration';
import CustomButton from '@/Component/CustomButton';
import {balls} from '@/Types';
import useFirestore from '@/Hooks/useFirestore';
import Loader from '@/ReuseableComponent/Loader';
import StopModal from '@/Component/StopModal';
import {MESSAGES, SCREENS} from '@/Constant';
import {successMessage, errorMessage} from '@/Component/commonFunctions';
const {SESSIONDETAILS} = SCREENS;

const BowlingAnalysis = (props: any) => {
  const {route, navigation} = props;
  const [startBall, setStartBall] = useState<number>(1);
  const [selectBall, setSelectBall] = useState<number | null>(null);
  const [balls, setBalls] = useState<any>([]);
  const [startIndex, setStartIndex] = useState<number>(0);
  const MAX_VISIBLE_BALLS: number = 9;
  const [active, setActive] = useState<boolean>(false);
  const [isEnabledWide, setIsEnabledWide] = useState<boolean>(false);
  const [isEnabledNB, setIsEnableNB] = useState<boolean>(false);
  const [isEnabledMB, setIsEnableMB] = useState<boolean>(false);
  const [isEnabledWicket, setIsEnableWicket] = useState<boolean>(false);
  const [visibleBalls, setVisibleBalls] = useState([]);
  const [btn, setBtn] = useState<number | null>(null);

  const handleBackButton = () => {
    setStopVisible(true);
    return true;
  };

  useEffect(() => {
    // Attach the back handler when the component mounts
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );

    return () => {
      // Remove the back handler when the component unmounts
      backHandler.remove();
    };
  }, []);

  const handleButtonClick = () => {
    const nextStartIndex = startIndex + MAX_VISIBLE_BALLS;
    if (nextStartIndex < balls.length) {
      setStartIndex(nextStartIndex);
    }
  };
  function nextBall() {
    setStartBall(prev => prev + 1);
    if (startBall % MAX_VISIBLE_BALLS === 0) {
      handleButtonClick();
    } else if (startBall === 500) {
      setActive(true);
    }
  }
  useEffect(() => {
    setVisibleBalls(balls.slice(startIndex, startIndex + MAX_VISIBLE_BALLS));
  }, [balls, startIndex]);
  const generateBalls = () => {
    let newBalls: balls[] = [];
    for (let i = 1; i <= 500; i++) {
      newBalls.push({id: i, balls: i});
    }
    setBalls(newBalls);
  };

  useEffect(() => {
    generateBalls();
  }, []);

  const toggleSwitchWide = () => {
    setIsEnabledWide(previousState => !previousState);
    setBtn(2);
  };
  const toggleSwitchNB = () => {
    setIsEnableNB(previousState => !previousState);
    setBtn(2);
  };
  const toggleSwitchMB = () => setIsEnableMB(previousState => !previousState);
  const toggleSwitchWicket = () =>
    setIsEnableWicket(previousState => !previousState);

  function _validate() {
    let flag: boolean = true;
    if (selectBall == null || btn == null) {
      flag = false;
    }
    return flag;
  }

  const {updateSession, userId, usersCollection} = useFirestore('sessions');

  function _next() {
    if (_validate()) {
      let ballType: string;
      let btnName: string;
      let analysis: string | null;
      if (selectBall !== null) {
        ballType =
          selectBall == 0
            ? 'FastBall'
            : selectBall == 1
            ? 'Yorker'
            : selectBall == 2
            ? 'Bouncer'
            : selectBall == 3
            ? 'InSwinger'
            : selectBall == 4
            ? 'OutSwinger'
            : selectBall == 5
            ? 'OffSpin'
            : selectBall == 6
            ? 'LegSpin'
            : selectBall == 7
            ? 'TopSpin'
            : selectBall == 8
            ? 'Googly'
            : selectBall == 9
            ? 'Slider'
            : selectBall == 10
            ? 'ArmBall'
            : selectBall == 11
            ? 'Flipper'
            : selectBall == 12
            ? 'SlowerBall'
            : selectBall == 13
            ? 'LegCutter'
            : selectBall == 14
            ? 'OffCutter'
            : 'CrossSeam';
      }
      if (btn !== null) {
        btnName = btn == 0 ? 'Perfect' : btn == 1 ? 'Average' : 'Bad';
      }
      if (isEnabledWide || isEnabledWicket || isEnabledNB || isEnabledMB) {
        analysis = isEnabledMB
          ? 'missBall'
          : isEnabledWicket
          ? 'wicket'
          : isEnabledWide
          ? 'wide'
          : isEnabledNB
          ? 'noBall'
          : null;
      }
      const body: object = {
        sessionName: route?.params?.sessionName,
        balls: {
          ball: startBall,
          ballType: ballType!,
          performance: btnName!,
          ...(analysis! !== undefined ? {analysis} : {}),
        },
        createdAt: route?.params?.sessionDate,
      };
      console.log('===body==>>>', body);
      updateSession(body, route?.params?.sessionType);
      nextBall();
      setSelectBall(null);
      setBtn(null);
      setIsEnabledWide(false);
      setIsEnableMB(false);
      setIsEnableNB(false);
      setIsEnableWicket(false);
    } else {
      alert('Please select all fields first!!');
    }
  }

  function _stop() {
    setLoading(true);
    const body: object = {
      sessionTime: formattedTime,
      createdAt: route?.params?.sessionDate,
    };
    const dataWithDefaultBalls = {
      ...body,
      balls: {},
    };
    updateSession(dataWithDefaultBalls, route?.params?.sessionType);
    setStopVisible(false);
    handleNullBalls();
  }

  const [formattedTime, setFormattedTime] = useState<string>('00:00:00');
  const [loading, setLoading] = useState<boolean>(false);
  const [stopVisible, setStopVisible] = useState<boolean>(false);
  const [isBack, setIsBack] = useState<boolean>(false);

  function renderBalls(item: any) {
    const {id, balls} = item.item;

    return (
      <View
        style={[
          styles.balls,
          {
            backgroundColor:
              startBall == id
                ? '#B80808'
                : startBall > id
                ? 'lightgrey'
                : 'white',
            borderColor:
              startBall == id ? 'white' : startBall > id ? 'grey' : 'black',
          },
        ]}>
        <Text
          style={[
            styles.ballsTxt,
            {
              color:
                startBall == id ? 'white' : startBall > id ? 'grey' : 'black',
            },
          ]}>
          {balls}
        </Text>
      </View>
    );
  }

  var isNull: boolean | null = null;

  const del = () => {
    setLoading(false);
    if (isNull !== null) {
      isNull
        ? errorMessage({message: MESSAGES.SINGLE_BALL})
        : successMessage({message: MESSAGES.SESSION});
      isBack || isNull
        ? navigation.goBack()
        : navigation.navigate(SESSIONDETAILS, {
            type: route?.params?.sessionType,
            createdAt: route?.params?.sessionDate,
            isBack: isBack,
          });
    } else {
      console.log('isNullCall', isNull);
    }
  };

  const handleNullBalls = async () => {
    const sessionRef = usersCollection
      .doc(userId!)
      .collection('balling')
      .doc(route?.params?.sessionDate);

    try {
      const sessionCollection = await sessionRef.get();
      const sessionData: object | undefined = sessionCollection.data();
      if (sessionData && sessionData?.hasOwnProperty('balls')) {
        isNull = false;
        del();
      } else {
        isNull = true;
        await sessionRef
          .delete()
          .then(() => {
            console.log('Document successfully deleted');
            del();
          })
          .catch(error => {
            console.error('Error deleting document: ', error);
          });
      }
    } catch (error) {
      console.error('Error fetching session data: ', error);
      isNull = null;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Analysis"
        isBack
        isRightAction={'timer'}
        isStop
        setVisible={setStopVisible}
        formattedTime={formattedTime}
        setFormattedTime={setFormattedTime}
        back={setIsBack}
      />
      <View style={styles.main}>
        <Text style={styles.txt}>No. of Balls</Text>
        <View style={styles.ballsSelView}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={visibleBalls}
            horizontal={true}
            scrollEnabled={false}
            renderItem={renderBalls}
            keyExtractor={(item: any) => item?.id.toString()}
          />
        </View>
        <ScrollView
          style={styles.scrollMainView}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.txt}>Fast Bowling</Text>
          <View style={styles.mainButtonView}>
            <TouchableOpacity
              style={[
                styles.mainButton,
                {
                  backgroundColor:
                    selectBall == 0 ? COLORS.SELECTION : COLORS.WHITE,
                },
              ]}
              onPress={() => setSelectBall(0)}>
              <Text
                style={[
                  styles.ButtonText,
                  {color: selectBall == 0 ? COLORS.WHITE : COLORS.BLACK},
                ]}>
                Fast Ball
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.mainButton,
                {
                  backgroundColor:
                    selectBall == 1 ? COLORS.SELECTION : COLORS.WHITE,
                  marginLeft: adjust(7),
                  width: '20%',
                },
              ]}
              onPress={() => setSelectBall(1)}>
              <Text
                style={[
                  styles.ButtonText,
                  {color: selectBall == 1 ? COLORS.WHITE : COLORS.BLACK},
                ]}>
                Yorker
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.mainButton,
                {
                  backgroundColor:
                    selectBall == 2 ? COLORS.SELECTION : COLORS.WHITE,
                  marginLeft: adjust(7),
                },
              ]}
              onPress={() => setSelectBall(2)}>
              <Text
                style={[
                  styles.ButtonText,
                  {color: selectBall == 2 ? COLORS.WHITE : COLORS.BLACK},
                ]}>
                Bouncer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.mainButton,
                {
                  backgroundColor:
                    selectBall == 3 ? COLORS.SELECTION : COLORS.WHITE,
                  marginLeft: adjust(7),
                  width: '28%',
                },
              ]}
              onPress={() => setSelectBall(3)}>
              <Text
                style={[
                  styles.ButtonText,
                  {color: selectBall == 3 ? COLORS.WHITE : COLORS.BLACK},
                ]}>
                In Swinger
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.mainButtonView, {marginTop: adjust(10)}]}>
            <TouchableOpacity
              style={[
                styles.mainButton,
                {
                  backgroundColor:
                    selectBall == 4 ? COLORS.SELECTION : COLORS.WHITE,
                  width: '30%',
                },
              ]}
              onPress={() => setSelectBall(4)}>
              <Text
                style={[
                  styles.ButtonText,
                  {color: selectBall == 4 ? COLORS.WHITE : COLORS.BLACK},
                ]}>
                Out Swinger
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.txt}>Spinner</Text>
          <View style={styles.mainButtonView}>
            <TouchableOpacity
              style={[
                styles.mainButton,
                {
                  backgroundColor:
                    selectBall == 5 ? COLORS.SELECTION : COLORS.WHITE,
                },
              ]}
              onPress={() => setSelectBall(5)}>
              <Text
                style={[
                  styles.ButtonText,
                  {color: selectBall == 5 ? COLORS.WHITE : COLORS.BLACK},
                ]}>
                Off Spin
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.mainButton,
                {
                  backgroundColor:
                    selectBall == 6 ? COLORS.SELECTION : COLORS.WHITE,
                  marginLeft: adjust(7),
                },
              ]}
              onPress={() => setSelectBall(6)}>
              <Text
                style={[
                  styles.ButtonText,
                  {color: selectBall == 6 ? COLORS.WHITE : COLORS.BLACK},
                ]}>
                Leg Spin
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.mainButton,
                {
                  backgroundColor:
                    selectBall == 7 ? COLORS.SELECTION : COLORS.WHITE,
                  marginLeft: adjust(7),
                },
              ]}
              onPress={() => setSelectBall(7)}>
              <Text
                style={[
                  styles.ButtonText,
                  {color: selectBall == 7 ? COLORS.WHITE : COLORS.BLACK},
                ]}>
                Top Spin
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.mainButton,
                {
                  backgroundColor:
                    selectBall == 8 ? COLORS.SELECTION : COLORS.WHITE,
                  marginLeft: adjust(7),
                },
              ]}
              onPress={() => setSelectBall(8)}>
              <Text
                style={[
                  styles.ButtonText,
                  {color: selectBall == 8 ? COLORS.WHITE : COLORS.BLACK},
                ]}>
                Googly
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.mainButtonView, {marginTop: adjust(10)}]}>
            <TouchableOpacity
              style={[
                styles.mainButton,
                {
                  backgroundColor:
                    selectBall == 9 ? COLORS.SELECTION : COLORS.WHITE,
                },
              ]}
              onPress={() => setSelectBall(9)}>
              <Text
                style={[
                  styles.ButtonText,
                  {color: selectBall == 9 ? COLORS.WHITE : COLORS.BLACK},
                ]}>
                Slider
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.mainButton,
                {
                  backgroundColor:
                    selectBall == 10 ? COLORS.SELECTION : COLORS.WHITE,
                  marginLeft: adjust(7),
                },
              ]}
              onPress={() => setSelectBall(10)}>
              <Text
                style={[
                  styles.ButtonText,
                  {color: selectBall == 10 ? COLORS.WHITE : COLORS.BLACK},
                ]}>
                Arm Ball
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.mainButton,
                {
                  backgroundColor:
                    selectBall == 11 ? COLORS.SELECTION : COLORS.WHITE,
                  marginLeft: adjust(7),
                },
              ]}
              onPress={() => setSelectBall(11)}>
              <Text
                style={[
                  styles.ButtonText,
                  {color: selectBall == 11 ? COLORS.WHITE : COLORS.BLACK},
                ]}>
                Flipper
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.txt}>Medium Pacer</Text>
          <View style={styles.mainButtonView}>
            <TouchableOpacity
              style={[
                styles.mainButton,
                {
                  backgroundColor:
                    selectBall == 12 ? COLORS.SELECTION : COLORS.WHITE,
                  width: '25%',
                },
              ]}
              onPress={() => setSelectBall(12)}>
              <Text
                style={[
                  styles.ButtonText,
                  {color: selectBall == 12 ? COLORS.WHITE : COLORS.BLACK},
                ]}>
                Slower Ball
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.mainButton,
                {
                  backgroundColor:
                    selectBall == 13 ? COLORS.SELECTION : COLORS.WHITE,
                  marginLeft: adjust(7),
                },
              ]}
              onPress={() => setSelectBall(13)}>
              <Text
                style={[
                  styles.ButtonText,
                  {color: selectBall == 13 ? COLORS.WHITE : COLORS.BLACK},
                ]}>
                Leg Cutter
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.mainButton,
                {
                  backgroundColor:
                    selectBall == 14 ? COLORS.SELECTION : COLORS.WHITE,
                  marginLeft: adjust(7),
                },
              ]}
              onPress={() => setSelectBall(14)}>
              <Text
                style={[
                  styles.ButtonText,
                  {color: selectBall == 14 ? COLORS.WHITE : COLORS.BLACK},
                ]}>
                Off Cutter
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.mainButton,
              {
                backgroundColor:
                  selectBall == 15 ? COLORS.SELECTION : COLORS.WHITE,
                marginTop: adjust(7),
                width: '30%',
              },
            ]}
            onPress={() => setSelectBall(15)}>
            <Text
              style={[
                styles.ButtonText,
                {color: selectBall == 15 ? COLORS.WHITE : COLORS.BLACK},
              ]}>
              Cross Seam
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <View
          style={[
            styles.ballsView,
            {justifyContent: 'space-between', marginTop: adjust(20)},
          ]}>
          <TouchableOpacity
            style={[
              styles.perBut,
              {
                backgroundColor: btn == 0 ? '#00A524' : 'white',
                borderWidth: btn == 0 ? 0 : 1,
              },
            ]}
            disabled={isEnabledNB || isEnabledWide}
            onPress={() => setBtn(0)}>
            <Text style={[styles.txt2, {color: btn == 0 ? 'white' : 'black'}]}>
              Perfect
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.aveBut,
              {
                backgroundColor: btn == 1 ? '#FF8A00' : 'white',
                borderWidth: btn == 1 ? 0 : 1,
              },
            ]}
            disabled={isEnabledNB || isEnabledWide}
            onPress={() => setBtn(1)}>
            <Text style={[styles.txt2, {color: btn == 1 ? 'white' : 'black'}]}>
              Average
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.porBut,
              {
                backgroundColor: btn == 2 ? '#D81206' : 'white',
                borderWidth: btn == 2 ? 0 : 1,
              },
            ]}
            onPress={() => setBtn(2)}>
            <Text style={[styles.txt2, {color: btn == 2 ? 'white' : 'black'}]}>
              Bad
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.cardView}>
        <View style={styles.main2}>
          <View style={styles.main1}>
            <Text style={styles.txt1}>Analysis</Text>
            <View
              style={[
                styles.ballsView,
                {marginTop: adjust(10), justifyContent: 'space-between'},
              ]}>
              <Text
                style={[
                  styles.txt1,
                  {fontFamily: FONT_FAMILIES.WORKSANS_MEDIUM},
                ]}>
                Wide
              </Text>
              <Switch
                trackColor={{
                  false: '#767577',
                  true: Platform.OS === 'android' ? 'grey' : 'black',
                }}
                thumbColor={isEnabledWide ? COLORS.SELECTION : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchWide}
                style={styles.switch}
                value={isEnabledWide}
              />
            </View>
            <View
              style={[
                styles.ballsView,
                {marginTop: adjust(10), justifyContent: 'space-between'},
              ]}>
              <Text
                style={[
                  styles.txt1,
                  {fontFamily: FONT_FAMILIES.WORKSANS_MEDIUM},
                ]}>
                No Ball
              </Text>
              <Switch
                trackColor={{
                  false: '#767577',
                  true: Platform.OS === 'android' ? 'grey' : 'black',
                }}
                thumbColor={isEnabledNB ? COLORS.SELECTION : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchNB}
                style={styles.switch}
                value={isEnabledNB}
              />
            </View>
            <View
              style={[
                styles.ballsView,
                {marginTop: adjust(10), justifyContent: 'space-between'},
              ]}>
              <Text
                style={[
                  styles.txt1,
                  {fontFamily: FONT_FAMILIES.WORKSANS_MEDIUM},
                ]}>
                Missed ball
              </Text>
              <Switch
                trackColor={{
                  false: '#767577',
                  true: Platform.OS === 'android' ? 'grey' : 'black',
                }}
                thumbColor={isEnabledMB ? COLORS.SELECTION : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchMB}
                style={styles.switch}
                value={isEnabledMB}
              />
            </View>
            <View
              style={[
                styles.ballsView,
                {marginTop: adjust(10), justifyContent: 'space-between'},
              ]}>
              <Text
                style={[
                  styles.txt1,
                  {fontFamily: FONT_FAMILIES.WORKSANS_MEDIUM},
                ]}>
                Wicket
              </Text>
              <Switch
                trackColor={{
                  false: '#767577',
                  true: Platform.OS === 'android' ? 'grey' : 'black',
                }}
                thumbColor={isEnabledWicket ? COLORS.SELECTION : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchWicket}
                style={styles.switch}
                value={isEnabledWicket}
              />
            </View>
          </View>
        </View>
        <View style={[styles.ballsView, {margin: adjust(15)}]}>
          <CustomButton
            label="Stop"
            color={[COLORS.TABUNSELECTED, COLORS.TABUNSELECTED]}
            style={styles.stopBut}
            press={() => setStopVisible(true)}
          />
          <CustomButton
            label="Next"
            style={styles.nextBut}
            color={active ? ['lightgrey', 'lightgrey'] : COLORS.PRE_COLOR}
            press={_next}
            disable={active}
          />
        </View>
      </View>
      <Loader loading={loading} />
      <StopModal
        visible={stopVisible}
        setvisible={setStopVisible}
        stop={_stop}
      />
    </View>
  );
};

export default BowlingAnalysis;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    margin: adjust(15),
    flex: 0.6,
  },
  main1: {
    margin: adjust(15),
    flex: 1,
  },
  main2: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY,
    flex: 1,
  },
  txt: {
    fontSize: adjust(10),
    marginTop: adjust(5),
    fontWeight: '400',
    fontFamily: FONT_FAMILIES.WORKSANS_SEMIBOLD,
    color: COLORS.BLACK,
  },
  txt1: {
    fontSize: adjust(15),
    fontWeight: '400',
    fontFamily: FONT_FAMILIES.WORKSANS_SEMIBOLD,
    color: COLORS.BLACK,
  },
  txt2: {
    fontSize: adjust(10),
    fontWeight: '400',
    fontFamily: FONT_FAMILIES.WORKSANS_MEDIUM,
    color: COLORS.WHITE,
  },
  ballsView: {
    flexDirection: 'row',
  },
  ballsSelView: {
    marginVertical: '1%',
  },
  mainButtonView: {
    flexDirection: 'row',
    marginTop: adjust(5),
  },
  mainButton: {
    height: adjust(25),
    width: '23%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonText: {
    fontSize: adjust(11),
    fontFamily: FONT_FAMILIES.WORKSANS,
    fontWeight: '400',
  },
  cardView: {
    backgroundColor: COLORS.WHITE,
    flex: Platform.OS === 'android' ? 0.45 : 0.58,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  switch: {
    borderColor: COLORS.SELECTION,
    borderWidth: 2,
    transform: [{scaleX: 0.8}, {scaleY: 0.7}],
  },
  perBut: {
    height: adjust(25),
    width: '30%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:COLORS.BLACK
  },
  aveBut: {
    height: adjust(25),
    width: '30%',
    backgroundColor: '#FF8A00',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:COLORS.BLACK
  },
  porBut: {
    height: adjust(25),
    width: '30%',
    backgroundColor: '#D81206',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:COLORS.BLACK
  },
  stopBut: {
    width: '90%',
  },
  nextBut: {
    width: '90%',
  },
  balls: {
    borderRadius: adjust(35 / 2),
    height: 35,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  ballsTxt: {
    textAlign: 'center',
    fontSize: adjust(12),
    fontFamily: FONT_FAMILIES.WORKSANS_MEDIUM,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  innerModalView: {
    backgroundColor: COLORS.WHITE,
    height: adjust(130),
    width: adjust(260),
    borderRadius: 15,
    elevation: 10,
    borderColor: COLORS.BORDER_COLOR,
    borderWidth: 1,
  },
  innerModalView1: {
    flex: 0.6,
    margin: adjust(15),
    alignItems: 'center',
  },
  modalTxt: {
    marginTop: adjust(10),
    fontSize: adjust(12),
    fontFamily: FONT_FAMILIES.WORKSANS_SEMIBOLD,
    fontWeight: '400',
    color: COLORS.BLACK,
  },
  modalTxt1: {
    marginTop: adjust(4),
    fontSize: adjust(10),
    fontFamily: FONT_FAMILIES.WORKSANS,
    fontWeight: '400',
    color: COLORS.BLACK,
  },
  innerModalView2: {
    flex: 0.25,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  modalCancel: {
    height: adjust(25),
    width: adjust(90),
  },
  modalStart: {
    height: adjust(25),
    width: adjust(90),
    marginLeft: adjust(10),
  },
  buttonText: {
    fontSize: adjust(12),
  },
  scrollMainView: {
    height: adjust(10),
  },
});
