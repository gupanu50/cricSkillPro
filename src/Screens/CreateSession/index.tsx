import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '@/ReuseableComponent/Header';
import adjust from '@/Component/adjust';
import moment from 'moment';
import {COLORS, FONT_FAMILIES} from '@/Configuration';
import {Images} from '@/Assets';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import TextBox from '@/Component/TextBox';
import CustomButton from '@/Component/CustomButton';
import {SCREENS, VALIDATE_FORM} from '@/Constant';
import useFirestore from '@/Hooks/useFirestore';
import Loader from '@/ReuseableComponent/Loader';
import {delay} from '@/Component/commonFunctions';
const {BATTINGANALYSIS, BOWLINGANALYSIS} = SCREENS;
const CreateSession = (props: any) => {
  const {navigation} = props;
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [selectedSessionType, setSelectedSessionType] = useState<number>(0);
  const [sessionName, setSessionName] = useState<string>();
  const [errorSession, setErrorSession] = useState<string | null>(null);
  const [date, setDate] = useState<string>('DD');
  const [month, setMonth] = useState<string>('MM');
  const [year, setYear] = useState<string>('YYYY');
  const [errorDob, setErrorDob] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dob = new Date();
  useEffect(() => {
    updateDate(dob);
  }, []);
  const updateDate = (selectedDate: any) => {
    setDate(moment(selectedDate).format('DD'));
    setMonth(moment(selectedDate).format('MMM'));
    setYear(moment(selectedDate).format('YYYY'));
  };

  // *********************************DatePicker***********************************************
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    updateDate(date);
    hideDatePicker();
  };

  const {createSession, getDashboardData, dashboardData, userId} =
    useFirestore('session');

  function del(body: object | any) {
    setLoading(false);
    navigation.navigate(
      selectedSessionType == 0 ? BATTINGANALYSIS : BOWLINGANALYSIS,
      {
        sessionName: sessionName,
        sessionType: selectedSessionType,
        sessionDate: body?.createdAt,
      },
    );
    setSessionName('');
  }

  function _session() {
    setModalVisible(false);
    setLoading(true);
    const body: object = {
      sessionName: sessionName,
      createdAt: moment(dob).format('MMMDoYYYYhmm'),
      sessionType: selectedSessionType,
    };
    createSession(body);
    delay({func: () => del(body), time: 2000});
  }

  const successModal = () => {
    return (
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalView}>
          <View style={styles.innerModalView}>
            <View style={styles.innerModalView1}>
              <Image source={Images.sessionGreenBat} />
              <Text style={styles.modalTxt}>Session created successfully!</Text>
              {/* <Text style={styles.modalTxt1}>
                Do you want to start analysis now?
              </Text> */}
            </View>
            <View style={styles.innerModalView2}>
              <CustomButton
                label="Not Now"
                txtStyle={styles.buttonText}
                color={[COLORS.TABUNSELECTED, COLORS.TABUNSELECTED]}
                style={styles.modalCancel}
                press={() => setModalVisible(false)}
              />
              <CustomButton
                label="Start Session"
                txtStyle={styles.buttonText}
                style={styles.modalStart}
                press={_session}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  if (userId) {
    getDashboardData(userId, selectedSessionType === 0 ? 'batting' : 'balling');
  }

  function isValidate() {
    let flag: boolean = true;
    if (sessionName === '') {
      setErrorSession(VALIDATE_FORM.SESSION);
      flag = false;
    } else {
      if (dashboardData) {
        dashboardData.forEach((item: any) => {
          if (item?.sessionName == sessionName) {
            setErrorSession(VALIDATE_FORM.VALID_SESSION);
            flag = false;
          } else {
            setErrorSession(null);
            flag = true;
          }
        });
      }
    }
    return flag;
  }

  function _createSession() {
    if (isValidate()) {
      setModalVisible(true);
    }
  }

  return (
    <View style={styles.container}>
      <Header isBack title="Create Session" />
      <View style={styles.main}>
        <Text style={styles.headingText}>Session Date</Text>
        <TextBox
          placeholder="Session Name"
          value={`${date} ${month} ${year}`}
          setValue={setSessionName}
          containerStyle={styles.containerStyle}
          validate={isValidate}
          edit
          style={{height: '85%', backgroundColor: 'white'}}
        />
        {errorDob ? (
          <Text style={[styles.errorTxt, {top: 0}]}>{errorDob}</Text>
        ) : null}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <Text style={[styles.headingText, {marginTop: adjust(10)}]}>
          Session Name
        </Text>
        <TextBox
          placeholder="Session Name"
          value={sessionName}
          setValue={setSessionName}
          containerStyle={styles.containerStyle}
          validate={isValidate}
          style={{height: '85%', backgroundColor: 'white'}}
        />
        {errorSession && <Text style={styles.errorTxt}>{errorSession}</Text>}
        <Text style={[styles.headingText, {marginTop: adjust(5)}]}>
          Session Type
        </Text>
        <View style={styles.mainButtonView}>
          <TouchableOpacity
            style={[
              styles.mainButton,
              {
                backgroundColor:
                  selectedSessionType == 0 ? COLORS.SELECTION : COLORS.WHITE,
                borderWidth: selectedSessionType == 0 ? 0 : 1,
              },
            ]}
            onPress={() => setSelectedSessionType(0)}>
            <Text
              style={[
                styles.ButtonText,
                {color: selectedSessionType == 0 ? COLORS.WHITE : COLORS.BLACK},
              ]}>
              Batting
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.mainButton,
              {
                backgroundColor:
                  selectedSessionType == 1 ? COLORS.SELECTION : COLORS.WHITE,
                marginLeft: adjust(15),
                borderWidth: selectedSessionType == 1 ? 0 : 1,
              },
            ]}
            onPress={() => setSelectedSessionType(1)}>
            <Text
              style={[
                styles.ButtonText,
                {color: selectedSessionType == 1 ? COLORS.WHITE : COLORS.BLACK},
              ]}>
              Bowling
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomButtonView}>
          <CustomButton label="Create Session" press={_createSession} />
        </View>
      </View>
      {successModal()}
      <Loader loading={loading} />
    </View>
  );
};

export default CreateSession;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    margin: adjust(15),
    flex: 1,
  },
  dob: {
    backgroundColor: COLORS.WHITE,
    height: adjust(40),
    borderWidth: 1,
    borderRadius: adjust(5),
    borderColor: COLORS.GRAY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: adjust(10),
    marginTop: adjust(5),
  },
  txt: {
    color: COLORS.WHITE,
    fontSize: adjust(14),
    fontFamily: FONT_FAMILIES.WORKSANS,
    padding: adjust(12),
  },
  errorTxt: {
    color: COLORS.RED,
    fontSize: adjust(10),
    top: adjust(-5),
    fontFamily: FONT_FAMILIES.WORKSANS,
  },
  headingText: {
    fontSize: adjust(15),
    fontWeight: '400',
    fontFamily: FONT_FAMILIES.WORKSANS_SEMIBOLD,
    color: COLORS.BLACK,
  },
  containerStyle: {
    height: adjust(45),
    justifyContent: 'center',
  },
  dropDownStyle: {
    height: adjust(30),
    width: '100%',
  },
  mainButtonView: {
    flexDirection: 'row',
    marginTop: adjust(10),
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
  bottomButtonView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  innerModalView: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 15,
    elevation: 10,
    borderColor: COLORS.BORDER_COLOR,
    borderWidth: 1,
  },
  innerModalView1: {
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
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: '4%',
  },
  modalCancel: {
    height: adjust(25),
    width: adjust(75),
  },
  modalStart: {
    height: adjust(25),
    width: adjust(105),
    marginLeft: adjust(10),
  },
  buttonText: {
    fontSize: adjust(12),
  },
});
