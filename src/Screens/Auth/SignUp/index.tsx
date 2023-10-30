import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { COLORS, FONT_FAMILIES, REGEX } from '@/Configuration'
import adjust from '@/Component/adjust'
import TextBox from '@/Component/TextBox'
import { SCREENS, VALIDATE_FORM } from '@/Constant'
import CustomButton from '@/Component/CustomButton'
import { Images } from '@/Assets'
const { OTP, LOGIN } = SCREENS
const SignUp = (props: any) => {
  const { navigation } = props;
  const [mobile, setMobile] = useState<string>("");
  const [checkMobile, setCheckMobile] = useState<boolean>(false);
  const [errorMobile, setErrorMobile] = useState<string | null>(null);
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
    }
    else {
      return flag;
    }
  };

  const _validate = () => {
    if (isValidate()) {
      navigation.navigate(OTP, { naviName: 'SignUp' });
    }
    else {
      console.log('====not Validate====>')
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.aniView}>
          <Image source={Images.logo} style={styles.logoImage} />
      </View>
      <View style={styles.cardView}>
        <View style={styles.main}>
          <Text style={styles.signText}>Sign Up</Text>
          <TextBox placeholder='Mobile Number' num length={10} value={mobile} setValue={setMobile}
            validate={_mobileValidate} />
          {errorMobile ? (
            <Text style={styles.errortxt}>{errorMobile}</Text>
          ) : null}
          <CustomButton label='Continue' press={() => _validate()} />
          <Text style={styles.termsText}>By tapping on continue, you will accept all our
            <Text style={styles.innerText}> Privacy Policy & Terms and conditions</Text></Text>
          <View style={styles.alView}>
            <Text style={styles.termsText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate(LOGIN)}>
              <Text style={[styles.innerText, styles.innerText1]}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default SignUp

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.GREEN,
  },
  aniView: {
    backgroundColor: COLORS.GREEN,
    flex: 0.65,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardView: {
    backgroundColor: COLORS.WHITE,
    flex: 0.35,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  main: {
    margin: adjust(15)
  },
  signText: {
    fontSize: adjust(15),
    fontWeight: '400',
    fontFamily: FONT_FAMILIES.WORKSANS_SEMIBOLD,
    color: COLORS.BLACK
  },
  errortxt: {
    marginTop: adjust(-8),
    color: COLORS.RED,
    fontSize: adjust(12),
    fontFamily: FONT_FAMILIES.WORKSANS,
  },
  innerText: {
    fontWeight: 'bold'
  },
  innerText1: {
    color: '#136548',
    fontFamily: FONT_FAMILIES.WORKSANS_SEMIBOLD,
    marginTop: adjust(10),
    marginLeft: adjust(5)
  },
  termsText: {
    fontWeight: '400',
    fontSize: adjust(12),
    fontFamily: FONT_FAMILIES.WORKSANS,
    color: COLORS.BLACK,
    marginTop: adjust(10)
  },
  alView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoImage: {
    height: adjust(60),
    width: adjust(250)
  }
})