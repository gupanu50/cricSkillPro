import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS, FONT_FAMILIES, REGEX} from '@/Configuration';
import adjust from '@/Component/adjust';
import Header from '@/ReuseableComponent/Header';
import TextBox from '@/Component/TextBox';
import {SCREENS, VALIDATE_FORM} from '@/Constant';
import moment from 'moment';
import {Images} from '@/Assets';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomButton from '@/Component/CustomButton';
import useFirestore from '@/Hooks/useFirestore';
import Loader from '@/ReuseableComponent/Loader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {delay} from '@/Component/commonFunctions';

const {LOGIN, TABS} = SCREENS;
const Register = (props: any) => {
  const {navigation, route} = props;
  const [name, setName] = useState<string>('');
  const [errorName, seterrorName] = useState<string | null>(null);
  const [checkName, setcheckName] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [checkEmail, setCheckEmail] = useState<boolean>(false);
  const [errorEmail, setErrorEmail] = useState<string | null>(null);
  const [errorMobile, setErrorMobile] = useState<string | null>(null);
  const [checkMobile, setCheckMobile] = useState<boolean>(false);
  const [mobile, setMobile] = useState<string>(route?.params?.mobile);
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weightError, setWeightError] = useState<string | null>(null);
  const [heightError, setHeightError] = useState<string | null>(null);
  const [genSelected, setGenSelected] = useState<number>(0);
  const [errorGender, setErrorGender] = useState<string | null>(null);
  const dob = new Date();
  const year1 = dob.getFullYear();
  const month1 = dob.getMonth();
  const day = dob.getDate();
  const [date, setDate] = useState<string>('DD');
  const [month, setMonth] = useState<string>('MM');
  const [year, setYear] = useState<string>('YYYY');
  const [errorDob, setErrorDob] = useState<string | null>(null);
  const updateDate = (selectedDate: any) => {
    setDate(moment(selectedDate).format('DD'));
    setMonth(moment(selectedDate).format('MM'));
    setYear(moment(selectedDate).format('YYYY'));
  };
  const [loading, setLoading] = useState<boolean>(false);

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

  // *********************************** name validation ********************************
  const _namevalidate = (mail: string) => {
    var nameRegex = REGEX.NAME;
    if (mail === '') {
      seterrorName(VALIDATE_FORM.NAME);
      setcheckName(true);
    } else if (!nameRegex.test(mail)) {
      seterrorName(VALIDATE_FORM.VALID_NAME);
      setcheckName(true);
    } else {
      seterrorName(null);
      setcheckName(false);
    }
  };
  // *********************************** email validation ********************************
  const _emailvalidate = (mail: string) => {
    var emailRegex = REGEX.EMAIL;
    if (mail === '') {
      setErrorEmail(VALIDATE_FORM.EMAIL);
      setCheckEmail(true);
    } else if (!emailRegex.test(mail)) {
      setErrorEmail(VALIDATE_FORM.EMAIL_VALID);
      setCheckEmail(true);
    } else {
      setErrorEmail(null);
      setCheckEmail(false);
    }
  };

  // *********************************** mobile validation ********************************
  const _mobileValidate = (PhoneNumber: number | string) => {
    var phoneNumberRegex = REGEX.MOBILE;
    if (PhoneNumber === '') {
      setErrorMobile(VALIDATE_FORM.MOBILE);
      setCheckMobile(true);
      // @ts-ignore
    } else if (!phoneNumberRegex.test(PhoneNumber)) {
      setErrorMobile(VALIDATE_FORM.MOBILE_VALID);
      setCheckMobile(true);
    } else {
      setErrorMobile(null);
      setCheckMobile(false);
    }
  };

  const _weightValidate = (weight: string) => {
    if (weight === '') {
      setWeightError(VALIDATE_FORM.WEIGHT);
    } else if (Number(weight) > 150) {
      setWeightError(VALIDATE_FORM.VALID_WEIGHT);
    } else {
      setWeightError(null);
    }
  };

  const isValidate = () => {
    let flag: boolean = true;
    if (name === '' || checkName) {
      seterrorName(errorName ? errorName : VALIDATE_FORM.NAME);
      flag = false;
    }
    if (email === '' || checkEmail) {
      setErrorEmail(errorEmail ? errorEmail : VALIDATE_FORM.EMAIL);
      flag = false;
    }
    if (weight === '') {
      setWeightError(VALIDATE_FORM.WEIGHT);
      flag = false;
    }
    if (height === '') {
      setHeightError(VALIDATE_FORM.HEIGHT);
      flag = false;
    }
    if (date == 'DD') {
      setErrorDob(VALIDATE_FORM.DOB);
      flag = false;
    }
    if (genSelected === 0) {
      setErrorGender(VALIDATE_FORM.GENDER);
      flag = false;
    } else {
      return flag;
    }
  };

  const {updateData} = useFirestore('auth');

  async function createAccount() {
    if (isValidate()) {
      setLoading(true);
      const data = {
        name: name,
        email: email,
        dob: `${date}/${month}/${year}`,
        gender:
          genSelected === 1 ? 'male' : genSelected === 2 ? 'female' : 'other',
        weight: weight,
        height: height,
      };
      updateData(data);
      delay({func: () => navigate(), time: 2000});
    }
  }

  const navigate = () => {
    setLoading(false);
    navigation.navigate(TABS);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.aniView}></View>
      <Header title="Create account" isBack bc />
      <View style={styles.cardView}>
        <KeyboardAwareScrollView>
          <View style={styles.main}>
            <Text style={styles.headingText}>Create your profile</Text>
            <TextBox
              placeholder="Name"
              value={name}
              setValue={setName}
              validate={_namevalidate}
              style={{height: '70%'}}
            />
            {errorName ? (
              <Text style={styles.errorTxt}>{errorName}</Text>
            ) : null}
            <TextBox
              placeholder="Email"
              value={email}
              setValue={setEmail}
              validate={_emailvalidate}
              style={{height: '70%'}}
            />
            {errorEmail ? (
              <Text style={styles.errorTxt}>{errorEmail}</Text>
            ) : null}
            <TextBox
              value={mobile}
              setValue={setMobile}
              validate={_mobileValidate}
              edit
              style={{height: '70%'}}
            />
            {errorMobile ? (
              <Text style={styles.errorTxt}>{errorMobile}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.dob}
              onPress={() => {
                showDatePicker(), setErrorDob(null);
              }}>
              <Text
                style={[
                  styles.txt,
                  {color: COLORS.BLACK, paddingLeft: 0, fontSize: adjust(13)},
                ]}>
                {date}-{month}-{year}
              </Text>
            </TouchableOpacity>
            {errorDob ? (
              <Text style={[styles.errorTxt, {top: -8}]}>{errorDob}</Text>
            ) : null}
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              maximumDate={new Date(year1 - 12, month1, day)}
            />
            <TextBox
              placeholder="Weight (Kgs)"
              value={weight}
              setValue={setWeight}
              validate={_weightValidate}
              num
              length={3}
              style={{height: '70%'}}
            />
            {weightError ? (
              <Text style={styles.errorTxt}>{weightError}</Text>
            ) : null}
            <TextBox
              placeholder="Height (cms)"
              value={height}
              setValue={setHeight}
              validate={() => setHeightError(null)}
              num
              length={3}
              style={{height: '70%'}}
            />
            {heightError ? (
              <Text style={styles.errorTxt}>{heightError}</Text>
            ) : null}
            <View style={styles.genView}>
              <TouchableOpacity
                style={[
                  styles.genButtonTouch,
                  {
                    borderWidth: genSelected == 1 ? 0 : 1,
                    backgroundColor:
                      genSelected == 1 ? COLORS.SELECTION : 'white',
                  },
                ]}
                onPress={() => {
                  setGenSelected(1), setErrorGender(null);
                }}>
                <Image
                  source={Images.male}
                  style={{tintColor: genSelected == 1 ? 'white' : COLORS.GRAY}}
                />
                <Text
                  style={[
                    styles.buttonText,
                    {color: genSelected == 1 ? 'white' : 'black'},
                  ]}>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genButtonTouch,
                  {
                    borderWidth: genSelected == 2 ? 0 : 1,
                    backgroundColor:
                      genSelected == 2 ? COLORS.SELECTION : 'white',
                  },
                ]}
                onPress={() => {
                  setGenSelected(2), setErrorGender(null);
                }}>
                <Image
                  source={Images.female}
                  style={{tintColor: genSelected == 2 ? 'white' : COLORS.GRAY}}
                />
                <Text
                  style={[
                    styles.buttonText,
                    {color: genSelected == 2 ? 'white' : 'black'},
                  ]}>
                  Female
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genButtonTouch,
                  {
                    borderWidth: genSelected == 3 ? 0 : 1,
                    backgroundColor:
                      genSelected == 3 ? COLORS.SELECTION : 'white',
                  },
                ]}
                onPress={() => {
                  setGenSelected(3), setErrorGender(null);
                }}>
                <Image
                  source={Images.other}
                  style={{tintColor: genSelected == 3 ? 'white' : COLORS.GRAY}}
                />
                <Text
                  style={[
                    styles.buttonText,
                    {color: genSelected == 3 ? 'white' : 'black'},
                  ]}>
                  Other
                </Text>
              </TouchableOpacity>
            </View>
            {errorGender ? (
              <Text style={[styles.errorTxt, {top: 0}]}>{errorGender}</Text>
            ) : null}
            <CustomButton
              label="Create Account"
              press={() => createAccount()}
              containerStyle={styles.containerStyle}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
      <Loader loading={loading} />
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.MAIN,
  },
  aniView: {
    backgroundColor: COLORS.MAIN,
    flex: 0,
  },
  cardView: {
    backgroundColor: 'white',
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  main: {
    margin: adjust(15),
  },
  headingText: {
    fontFamily: FONT_FAMILIES.WORKSANS_SEMIBOLD,
    fontSize: adjust(15),
    color: COLORS.BLACK,
    fontWeight: '500',
  },
  errorTxt: {
    color: COLORS.RED,
    fontSize: adjust(10),
    top: adjust(-10),
    fontFamily: FONT_FAMILIES.WORKSANS,
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
    marginVertical: '2%',
  },
  txt: {
    color: COLORS.WHITE,
    fontSize: adjust(14),
    fontFamily: FONT_FAMILIES.WORKSANS,
    padding: adjust(12),
  },
  genView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genButtonTouch: {
    height: adjust(35),
    width: '30%',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.GRAY,
    marginTop: '2%',
  },
  buttonText: {
    color: COLORS.GREY,
    fontSize: adjust(10),
    fontFamily: FONT_FAMILIES.WORKSANS,
    paddingLeft: adjust(5),
  },
  containerStyle: {
    height: adjust(70),
    justifyContent: 'center',
  },
  innerText1: {
    color: '#136548',
    fontFamily: FONT_FAMILIES.WORKSANS_SEMIBOLD,
    marginLeft: adjust(5),
  },
  termsText: {
    fontWeight: '400',
    fontSize: adjust(12),
    fontFamily: FONT_FAMILIES.WORKSANS,
    color: COLORS.BLACK,
  },
  alView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerText: {
    fontWeight: 'bold',
  },
});
