import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { COLORS, FONT_FAMILIES } from '@/Configuration';
import adjust from '@/Component/adjust';
import CustomButton from '@/Component/CustomButton';
import OTPTextView from 'react-native-otp-textinput';
import '@react-native-firebase/firestore';
import { SCREENS, VALIDATE_FORM } from '@/Constant';
import { Images } from '@/Assets';
import useFirestore from '@/Hooks/useFirestore';
import auth, { firebase } from '@react-native-firebase/auth';
import Loader from '@/ReuseableComponent/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { TABS, REGISTER } = SCREENS;
const Otp = (props: any) => {
  const { navigation, route } = props;
  const { confirm, mobile } = route.params;
  const [otp, setOtp] = useState<string>('123456');
  const [errorOtp, setErrorOtp] = useState<string | null>(null);
  const [active, setActive] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef: any = useRef(null);
  const { createNewUser, user } = useFirestore('auth');

  function extractPhone(mob: string) {
    const firstTwoDigits = mob.slice(0, 2);
    const lastTwoDigits = mob.slice(-2);
    const maskedDigits = '*'.repeat(mob.length - 4);
    const formattedNumber = `${firstTwoDigits}${maskedDigits}${lastTwoDigits}`;
    return formattedNumber;
  }

  async function confirmCode(confirm: any) {
    setLoading(true);
    try {
      const credential = auth.PhoneAuthProvider.credential(confirm, otp);
      const result = await auth().signInWithCredential(credential);
      if (result?.user?.uid) {
        create(result?.user?.uid);
        clear();
        Keyboard.dismiss();
      }
    } catch (error) {
      setLoading(false);
      console.log('Invalid code.');
      setErrorOtp(VALIDATE_FORM.WRONG_OTP);
    }
  }

  async function create(uid: string) {
    createNewUser({ uid: uid, mobile: mobile });
    navigate(uid);
  }

  async function navigate(uid: string) {
    try {
      const db = firebase.firestore();
      const usersCollection = db.collection('users');
      const userDocument = usersCollection.doc(uid);
      const docSnapshot = await userDocument.get();
      if (docSnapshot.exists) {
        const userData = docSnapshot.data();
        if (userData && userData?.name === '') {
          setLoading(false);
          navigation.navigate(REGISTER, { mobile: mobile });
        } else {
          setLoading(false);
          AsyncStorage.setItem('userUid', uid);
          navigation.navigate(TABS);
        }
      } else {
        create(uid);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error checking the name field: ', error);
    }
  }

  const [count, setCount] = useState<boolean>(false);
  const [time, setTime] = useState<string>('');
  const timer = () => {
    setCount(false);
    var sec: number = 60;
    var timer = setInterval(function () {
      // @ts-ignore
      setTime(`${sec.toString().length < 2 ? '0' : ''}` + sec);
      sec--;
      if (sec < 0) {
        clearInterval(timer);
        setCount(true);
      }
    }, 1000);
  };

  useEffect(() => {
    timer();
  }, []);

  // *********************clear***************************
  const clear = () => {
    inputRef.current.clear();
  };

  const _validate = (txt: string) => {
    let flag = true;
    if (txt.length !== 6) {
      flag = false;
      setActive(true);
    } else {
      setActive(false);
    }
    return flag;
  };

  async function resend() {
    try {
      timer();
      const mob = `+91 ${mobile}`;
      await auth().signInWithPhoneNumber(mob, true);
    } catch (error) {
      setCount(true);
      console.log('===errorInResending==>>>', error);
    }
  }

  function _resend() {
    clear();
    resend();
    Keyboard.dismiss();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.aniView}>
        <Image source={Images.bg} style={styles.bg} />
        <Image
          source={Images.logo}
          style={[styles.logoImage, { position: 'absolute' }]}
        />
      </View>
      <View style={styles.cardView}>
        <View style={styles.main}>
          <Text style={styles.signText}>Enter OTP</Text>
          <Text style={styles.termsText}>
            Please enter the 6-digit OTP code that sent to
            <Text style={styles.innerText}> {extractPhone(mobile)}</Text>
          </Text>
          <KeyboardAvoidingView>
            <View style={styles.input}>
              <OTPTextView
                handleTextChange={(txt: string) => {
                  setOtp(txt);
                  setErrorOtp(null);
                  _validate(txt);
                }}
                containerStyle={styles.otpinput}
                textInputStyle={styles.otp}
                inputCount={6}
                //   @ts-ignore
                secureTextEntry={true}
                ref={inputRef}
                tintColor={COLORS.BORDER_COLOR}
              />
            </View>
            {errorOtp ? <Text style={styles.errorTxt}>{errorOtp}</Text> : null}
          </KeyboardAvoidingView>
          <Text style={styles.secText}>
            You will get an
            <Text style={styles.innerText}> {`OTP in ${time} seconds`}</Text>
          </Text>
          <CustomButton
            label="Verify Otp"
            press={() => confirmCode(confirm)}
            disable={active}
            // @ts-ignore
            color={active ? [COLORS.GRAYBUTTON, COLORS.GRAYBUTTON] : ''}
            containerStyle={styles.containerStyle}
          />
          <View style={styles.alView}>
            <Text style={[styles.termsText, { marginTop: adjust(0) }]}>
              Didn't received an OTP yet?
            </Text>
            <TouchableOpacity disabled={!count} onPress={_resend}>
              <Text
                style={[
                  styles.innerText,
                  styles.innerText1,
                  { color: !count ? COLORS.GRAYBUTTON : COLORS.RESEND },
                ]}>
                Resend
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Loader loading={loading} />
      </View>
    </SafeAreaView>
  );
};

export default Otp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.MAIN,
  },
  aniView: {
    backgroundColor: COLORS.MAIN,
    flex: 0.65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardView: {
    backgroundColor: COLORS.WHITE,
    flex: 0.35,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  main: {
    margin: adjust(15),
  },
  signText: {
    fontSize: adjust(15),
    fontWeight: '400',
    fontFamily: FONT_FAMILIES.WORKSANS_SEMIBOLD,
    color: COLORS.BLACK,
  },
  errortxt: {
    marginTop: adjust(-8),
    color: COLORS.RED,
    fontSize: adjust(12),
    fontFamily: FONT_FAMILIES.WORKSANS,
  },
  innerText: {
    fontWeight: 'bold',
  },
  innerText1: {
    color: '#136548',
    fontFamily: FONT_FAMILIES.WORKSANS_SEMIBOLD,
    marginLeft: adjust(5),
  },
  termsText: {
    fontWeight: '400',
    fontSize: adjust(12.5),
    fontFamily: FONT_FAMILIES.WORKSANS,
    marginTop: adjust(1),
    color: COLORS.BLACK,
  },
  secText: {
    fontWeight: '400',
    textAlign: 'center',
    fontSize: adjust(12),
    fontFamily: FONT_FAMILIES.WORKSANS,
    color: COLORS.BLACK,
    marginTop: adjust(10),
  },
  alView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    marginTop: adjust(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpinput: {
  },
  otp: {
    color: 'black',
    borderBottomWidth: 0.5,
    height: adjust(35),
    verticalAlign: 'middle',
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
    borderColor: COLORS.BORDER_COLOR,
    borderWidth: 0.5,
    backgroundColor: COLORS.WHITE,
    borderRadius: 5,
    elevation: 10,
    fontSize: adjust(15),
    fontFamily: FONT_FAMILIES.WORKSANS,
  },
  errorTxt: {
    fontSize: adjust(12),
    color: 'red',
    fontFamily: FONT_FAMILIES.WORKSANS,
  },
  containerStyle: {
    height: adjust(40),
    justifyContent: 'center',
  },
  logoImage: {
    height: adjust(60),
    width: adjust(250),
  },
  bg: { opacity: 0.4, width: '100%', resizeMode: 'stretch' },
});
