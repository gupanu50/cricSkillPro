import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import adjust from '@/Component/adjust';
import Header from '@/ReuseableComponent/Header';
import {COLORS, FONT_FAMILIES} from '@/Configuration';
import CustomButton from '@/Component/CustomButton';
import {balls} from '@/Types';
import useFirestore from '@/Hooks/useFirestore';
import StopModal from '@/Component/StopModal';
import Loader from '@/ReuseableComponent/Loader';
import {MESSAGES, SCREENS} from '@/Constant';
import {errorMessage, successMessage} from '@/Component/commonFunctions';
const {SESSIONDETAILS} = SCREENS;

const BattingAnalysis = (props: any) => {
  const {route, navigation} = props;

  useEffect(() => {
    function handleBackButton() {
      setStopVisible(true);
      return true;
    }

    // Handle when back button pressed
    const backHandler: any = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );
    return () => backHandler.remove();
  }, []);

  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [wicket, setWicket] = useState<boolean>(false);
  const [wide, setWide] = useState<boolean>(false);
  const [stopVisible, setStopVisible] = useState<boolean>(false);
  const [formattedTime, setFormattedTime] = useState<string>('00:00:00');
  const toggleSwitch = (type: string) => {
    if (type == 'miss') {
      setIsEnabled(previousState => !previousState);
      setBtn(2);
      setBtn(2);
    } else if (type == 'wicket') {
      setWicket(prev => !prev);
      setBtn(2);
      setBtn(2);
    } else if (type == 'wide') {
      setWide(prev => !prev);
    }
  };

  const [startBall, setStartBall] = useState<number>(1);
  const [balls, setBalls] = useState([]);
  const [visibleBalls, setVisibleBalls] = useState([]);
  const [startIndex, setStartIndex] = useState<number>(0);
  const MAX_VISIBLE_BALLS: number = 9;
  const [active, setActive] = useState<boolean>(false);
  const [shot, setShot] = useState<number | null>(null);
  const [btn, setBtn] = useState<number | null>(null);

  const generateBalls = () => {
    let newBalls: balls[] = [];
    for (let i = 1; i <= 500; i++) {
      newBalls.push({id: i, balls: i});
    }
    // @ts-ignore
    setBalls(newBalls);
  };

  useEffect(() => {
    generateBalls();
  }, []);

  useEffect(() => {
    setVisibleBalls(balls.slice(startIndex, startIndex + MAX_VISIBLE_BALLS));
  }, [balls, startIndex]);

  const handleButtonClick = () => {
    const nextStartIndex = startIndex + MAX_VISIBLE_BALLS;

    if (nextStartIndex < balls.length) {
      setStartIndex(nextStartIndex);
    }
  };

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

  function nextBall() {
    setStartBall(prev => prev + 1);
    if (startBall % MAX_VISIBLE_BALLS === 0) {
      handleButtonClick();
    } else if (startBall === 500) {
      setActive(true);
    }
  }

  const {updateSession, usersCollection, userId} = useFirestore('sessions');

  function next() {
    if (_validate()) {
      let shotName: string;
      let btnName: string;
      let analysis: string | null;
      if (shot !== null) {
        shotName =
          shot == 0
            ? 'Straight Drive'
            : shot == 1
            ? 'Cover Drive'
            : shot == 2
            ? 'On Drive'
            : shot == 3
            ? 'Cut'
            : shot == 4
            ? 'Square Cut'
            : shot == 5
            ? 'Pull'
            : shot == 6
            ? 'Forward Defensive'
            : shot == 7
            ? 'Backfoot Defensive'
            : shot == 8
            ? 'Flick'
            : shot == 10
            ? 'Sweep Shot'
            : shot == 11
            ? 'Reverse Sweep'
            : 'Leg Glance';
      }
      if (btn !== null) {
        btnName = btn == 0 ? 'Perfect' : btn == 1 ? 'Average' : 'Bad';
      }
      if (isEnabled || wicket || wide) {
        analysis = isEnabled
          ? 'Miss ball'
          : wicket
          ? 'wicket'
          : wide
          ? 'wide'
          : null;
      }
      const body: object = {
        sessionName: route?.params?.sessionName,
        balls: {
          ball: startBall,
          shot: shotName!,
          performance: btnName!,
          ...(analysis! !== undefined ? {analysis} : {}),
        },
        createdAt: route?.params?.sessionDate,
      };
      console.log('===body==>>>', body);
      updateSession(body, route?.params?.sessionType);
      nextBall();
      setShot(null);
      setBtn(null);
      setIsEnabled(false);
      setWicket(false);
      setWide(false);
    } else {
      alert('Please select all fields first!!');
    }
  }

  function _validate() {
    let flag: boolean = true;
    if (shot == null || btn == null) {
      flag = false;
    }
    return flag;
  }

  const [isBack, setIsBack] = useState<boolean>(false);
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

  const [loading, setLoading] = useState<boolean>(false);
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
      .collection('batting')
      .doc(route?.params?.sessionDate);

    try {
      const sessionCollection = await sessionRef.get();
      const sessionData: object | undefined = sessionCollection.data();
      if (sessionData && sessionData?.hasOwnProperty('balls')) {
        isNull = false;
        console.log('===1>>>', isNull);
        del();
      } else {
        isNull = true;
        await sessionRef
          .delete()
          .then(() => {
            console.log('Document successfully deleted');
            console.log('===2>>>', isNull);
            del();
          })
          .catch(error => {
            console.error('Error deleting document: ', error);
          });
      }
    } catch (error) {
      console.error('Error fetching session data: ', error);
      console.log('===3>>>', isNull);
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
        <View style={{marginVertical: '1%'}}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={visibleBalls}
            horizontal={true}
            scrollEnabled={false}
            renderItem={renderBalls}
            keyExtractor={(item: any) => item?.id.toString()}
          />
        </View>
        <Text style={styles.txt}>Front Foot</Text>
        <View style={styles.mainButtonView}>
          <TouchableOpacity
            style={[
              styles.mainButton,
              {backgroundColor: shot == 0 ? COLORS.SELECTION : COLORS.WHITE},
            ]}
            onPress={() => {
              setShot(0);
            }}>
            <Text
              style={[
                styles.ButtonText,
                {color: shot == 0 ? COLORS.WHITE : COLORS.BLACK},
              ]}>
              Straight Drive
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.mainButton,
              {
                backgroundColor: shot == 1 ? COLORS.SELECTION : COLORS.WHITE,
                marginLeft: adjust(15),
              },
            ]}
            onPress={() => {
              setShot(1);
            }}>
            <Text
              style={[
                styles.ButtonText,
                {color: shot == 1 ? COLORS.WHITE : COLORS.BLACK},
              ]}>
              Cover Drive
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.mainButton,
              {
                backgroundColor: shot == 2 ? COLORS.SELECTION : COLORS.WHITE,
                marginLeft: adjust(15),
              },
            ]}
            onPress={() => {
              setShot(2);
            }}>
            <Text
              style={[
                styles.ButtonText,
                {color: shot == 2 ? COLORS.WHITE : COLORS.BLACK},
              ]}>
              On Drive
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mainButtonView}>
          <TouchableOpacity
            style={[
              styles.mainButton,
              {backgroundColor: shot == 10 ? COLORS.SELECTION : COLORS.WHITE},
            ]}
            onPress={() => {
              setShot(10);
            }}>
            <Text
              style={[
                styles.ButtonText,
                {color: shot == 10 ? COLORS.WHITE : COLORS.BLACK},
              ]}>
              Sweep Shot
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.mainButton,
              {
                backgroundColor: shot == 11 ? COLORS.SELECTION : COLORS.WHITE,
                marginLeft: adjust(15),
                width: '38%',
              },
            ]}
            onPress={() => {
              setShot(11);
            }}>
            <Text
              style={[
                styles.ButtonText,
                {color: shot == 11 ? COLORS.WHITE : COLORS.BLACK},
              ]}>
              Reverse Sweep
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.txt}>Back Foot</Text>
        <View style={styles.mainButtonView}>
          <TouchableOpacity
            style={[
              styles.mainButton,
              {
                backgroundColor: shot == 3 ? COLORS.SELECTION : COLORS.WHITE,
                width: '20%',
              },
            ]}
            onPress={() => {
              setShot(3);
            }}>
            <Text
              style={[
                styles.ButtonText,
                {color: shot == 3 ? COLORS.WHITE : COLORS.BLACK},
              ]}>
              Cut
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.mainButton,
              {
                backgroundColor: shot == 4 ? COLORS.SELECTION : COLORS.WHITE,
                marginLeft: adjust(15),
                width: '28%',
              },
            ]}
            onPress={() => {
              setShot(4);
            }}>
            <Text
              style={[
                styles.ButtonText,
                {color: shot == 4 ? COLORS.WHITE : COLORS.BLACK},
              ]}>
              Square Cut
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.mainButton,
              {
                backgroundColor: shot == 5 ? COLORS.SELECTION : COLORS.WHITE,
                marginLeft: adjust(15),
                width: '25%',
              },
            ]}
            onPress={() => {
              setShot(5);
            }}>
            <Text
              style={[
                styles.ButtonText,
                {color: shot == 5 ? COLORS.WHITE : COLORS.BLACK},
              ]}>
              Pull
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.txt}>Defensive</Text>
        <View style={styles.mainButtonView}>
          <TouchableOpacity
            style={[
              styles.mainButton,
              {
                backgroundColor: shot == 6 ? COLORS.SELECTION : COLORS.WHITE,
                width: '45%',
              },
            ]}
            onPress={() => {
              setShot(6);
            }}>
            <Text
              style={[
                styles.ButtonText,
                {color: shot == 6 ? COLORS.WHITE : COLORS.BLACK},
              ]}>
              Forward Defensive
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.mainButton,
              {
                backgroundColor: shot == 7 ? COLORS.SELECTION : COLORS.WHITE,
                marginLeft: adjust(15),
                width: '45%',
              },
            ]}
            onPress={() => {
              setShot(7);
            }}>
            <Text
              style={[
                styles.ButtonText,
                {color: shot == 7 ? COLORS.WHITE : COLORS.BLACK},
              ]}>
              Backfoot Defensive
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.txt}>Flick and Glance</Text>
        <View style={styles.mainButtonView}>
          <TouchableOpacity
            style={[
              styles.mainButton,
              {
                backgroundColor: shot == 8 ? COLORS.SELECTION : COLORS.WHITE,
                width: '20%',
              },
            ]}
            onPress={() => {
              setShot(8);
            }}>
            <Text
              style={[
                styles.ButtonText,
                {color: shot == 8 ? COLORS.WHITE : COLORS.BLACK},
              ]}>
              Flick
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.mainButton,
              {
                backgroundColor: shot == 9 ? COLORS.SELECTION : COLORS.WHITE,
                marginLeft: adjust(15),
              },
            ]}
            onPress={() => {
              setShot(9);
            }}>
            <Text
              style={[
                styles.ButtonText,
                {color: shot == 9 ? COLORS.WHITE : COLORS.BLACK},
              ]}>
              Leg Glance
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.ballsView,
            {
              justifyContent: 'space-between',
              marginTop: adjust(20),
            },
          ]}>
          <TouchableOpacity
            style={[
              styles.perBut,
              {
                backgroundColor: btn == 0 ? '#00A524' : 'white',
                borderWidth: btn == 0 ? 0 : 1,
              },
            ]}
            disabled={isEnabled || wicket}
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
            disabled={isEnabled || wicket}
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

      <View style={[styles.cardView]}>
        <View style={styles.main2}>
          <View style={styles.main1}>
            <Text style={styles.txt1}>Analysis</Text>
            <View
              style={[
                styles.ballsView,
                {
                  marginTop: adjust(8),
                  justifyContent: 'space-between',
                },
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
                  true: Platform.OS === 'android' ? '#00A524' : '#00A524',
                }}
                thumbColor={isEnabled ? 'white' : '#f4f3f4'}
                ios_backgroundColor={isEnabled ? 'white' : '#f4f3f4'}
                onValueChange={() => toggleSwitch('miss')}
                style={styles.switch}
                value={isEnabled}
              />
            </View>

            <View
              style={[
                styles.ballsView,
                {
                  marginTop: adjust(8),
                  justifyContent: 'space-between',
                },
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
                  true: Platform.OS === 'android' ? '#00A524' : '#00A524',
                }}
                thumbColor={isEnabled ? 'white' : '#f4f3f4'}
                ios_backgroundColor={isEnabled ? 'white' : '#f4f3f4'}
                onValueChange={() => toggleSwitch('wicket')}
                style={styles.switch}
                value={wicket}
              />
            </View>
            <View
              style={[
                styles.ballsView,
                {marginTop: adjust(8), justifyContent: 'space-between'},
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
                  true: Platform.OS === 'android' ? '#00A524' : '#00A524',
                }}
                thumbColor={isEnabled ? 'white' : '#f4f3f4'}
                ios_backgroundColor={isEnabled ? 'white' : '#f4f3f4'}
                onValueChange={() => toggleSwitch('wide')}
                style={styles.switch}
                value={wide}
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
            color={active ? COLORS.INACTIVE : COLORS.PRE_COLOR}
            press={next}
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

export default BattingAnalysis;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    margin: adjust(15),
    flex: 0.7,
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
    color: COLORS.BLACK,
  },
  ballsView: {
    flexDirection: 'row',
  },
  mainButtonView: {
    flexDirection: 'row',
    marginTop: adjust(5),
  },
  mainButton: {
    height: adjust(25),
    width: '30%',
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
    flex: Platform.OS === 'ios' ? 0.5 : 0.4,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  switch: {
    transform: [{scaleX: 0.8}, {scaleY: 0.7}],
  },
  perBut: {
    height: adjust(25),
    width: '30%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.BLACK,
  },
  aveBut: {
    height: adjust(25),
    width: '30%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.BLACK,
  },
  porBut: {
    height: adjust(25),
    width: '30%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.BLACK,
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
});
