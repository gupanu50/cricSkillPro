import {
  Image,
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native';
import React, {useState} from 'react';
import TextBox from '@/Component/TextBox';
import CustomButton from '@/Component/CustomButton';
import {COLORS, FONT_FAMILIES, REGEX} from '@/Configuration';
import {MESSAGES, SCREENS, VALIDATE_FORM} from '@/Constant';
import adjust from '@/Component/adjust';
import {Images} from '@/Assets';
import auth from '@react-native-firebase/auth';
import Loader from '@/ReuseableComponent/Loader';
import {errorMessage} from '@/Component/commonFunctions';
const {OTP, SIGNUP} = SCREENS;
const Login = ({navigation}: any) => {
  const [mobile, setMobile] = useState<string>('');
  const [checkMobile, setCheckMobile] = useState<boolean>(false);
  const [errorMobile, setErrorMobile] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const _mobileValidate = (mail: string) => {
    var mobileRegex = REGEX.MOBILE;
    if (mail === '') {
      setErrorMobile(VALIDATE_FORM.MOBILE);
      setCheckMobile(true);
    } else if (!mobileRegex.test(mail)) {
      setErrorMobile(VALIDATE_FORM.MOBILE_VALID);
      setCheckMobile(true);
    } else {
      setErrorMobile(null);
      setCheckMobile(false);
    }
  };
  const isValidate = () => {
    let flag: boolean = true;
    if (mobile === '' || checkMobile) {
      setErrorMobile(errorMobile ? errorMobile : VALIDATE_FORM.MOBILE);
      flag = false;
    } else {
      return flag;
    }
  };

  const _validate = () => {
    Keyboard.dismiss();
    if (isValidate()) {
      setLoading(true);
      signInWithPhoneNumber(mobile);
    } else {
      setLoading(false);
      console.log('====not Validate====>');
    }
  };

  async function signInWithPhoneNumber(phoneNumber: string) {
    try {
      const mob = `+91 ${phoneNumber}`;
      console.log('=======>>>', mob);
      const confirmation: any = await auth().signInWithPhoneNumber(mob);
      if (confirmation) {
        setLoading(false);
        setMobile('')
        navigation.navigate(OTP, {
          confirm: confirmation?.verificationId,
          mobile: phoneNumber,
        });
      }
    } catch (error) {
      setLoading(false);
      console.log('====error====>>>', error);
      errorMessage({message: MESSAGES.ERROR_LOGIN});
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.aniView}>
        <Image source={Images.bg} style={styles.bg} />
        <Image
          source={Images.logo}
          style={[styles.logoImage, {position: 'absolute'}]}
        />
      </View>
      <View style={styles.cardView}>
        <KeyboardAvoidingView>
          <View style={styles.main}>
            <Text style={styles.signText}>Sign In</Text>
            <TextBox
              placeholder="Mobile Number"
              num
              length={10}
              value={mobile}
              setValue={setMobile}
              validate={_mobileValidate}
              style={{height: '70%'}}
            />
            {errorMobile ? (
              <Text style={styles.errortxt}>{errorMobile}</Text>
            ) : null}
            <CustomButton label="Continue" press={() => _validate()} />
            <Text style={styles.termsText}>
              By tapping on continue, you will accept all our
              <Text style={styles.innerText}>
                {' '}
                Privacy Policy & Terms and conditions
              </Text>
            </Text>
          </View>
        </KeyboardAvoidingView>
        <Loader loading={loading} />
      </View>
    </SafeAreaView>
  );
};

export default Login;

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
    marginTop: adjust(-10),
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
    marginTop: adjust(10),
    marginLeft: adjust(5),
  },
  termsText: {
    fontWeight: '400',
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
  logoImage: {
    height: adjust(60),
    width: adjust(250),
  },
  bg: {opacity: 0.4, width: '100%', resizeMode: 'stretch'},
});
