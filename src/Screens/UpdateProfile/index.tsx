import {
  FlatList,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState, useReducer} from 'react';
import Header from '@/ReuseableComponent/Header';
import adjust from '@/Component/adjust';
import {Images} from '@/Assets';
import TextBox from '@/Component/TextBox';
import {COLORS, FONT_FAMILIES, REGEX} from '@/Configuration';
import {SCREENS, VALIDATE_FORM} from '@/Constant';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomButton from '@/Component/CustomButton';
import {openCamera} from 'react-native-image-crop-picker';
import * as ImagePicker from 'react-native-image-picker';
import useFirestore from '@/Hooks/useFirestore';
import Loader from '@/ReuseableComponent/Loader';
import RNFS from 'react-native-fs';
import {Image as img} from 'react-native-compressor';
import {delay} from '@/Component/commonFunctions';
import { useNavigation } from '@react-navigation/native';
const{PROFILE} = SCREENS;

function profileReducer(state: any, action: any) {
  switch (action.type) {
    case 'updateUser':
      const {name, height, weight, email, mobile, gender, dob} = action.payload;
      return {
        ...state,
        name,
        height,
        weight,
        email,
        mobile,
        gender,
        dob,
      };
    default:
      return state;
  }
}

const initialState = {
  name: '',
  height: '',
  weight: '',
  email: '',
  mobile: '',
  gender: '',
  dob: '',
};

const UpdateProfile = () => {
  const navigation:any = useNavigation();
  const {user, updateData} = useFirestore('auth');
  const [profileState, dispatch] = useReducer(profileReducer, initialState);

  useEffect(() => {
    recall();
  }, [user]);

  const recall = () => {
    if (user === null) {
      try {
        // getUser();
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    } else {
      const {name, height, weight, email, mobile, gender, dob, profilePic} =
        user;
      dispatch({type: 'updateUser', payload: user});
      if (gender == 'male') {
        setGenSelected(0);
      } else if (gender == 'female') {
        setGenSelected(1);
      } else {
        setGenSelected(2);
      }
      setDate(dob.split('/')[0]);
      setMonth(dob.split('/')[1]);
      setYear(dob.split('/')[2]);
      setName(name);
      setEmail(email);
      setMobile(mobile);
      setHeight(height);
      setWeight(weight);
      setProfile(profilePic);
      setLoading(false);
    }
  };

  const [name, setName] = useState<string>('');
  const [errorName, seterrorName] = useState<string | null>(null);
  const [checkName, setcheckName] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [checkEmail, setCheckEmail] = useState<boolean>(false);
  const [errorEmail, setErrorEmail] = useState<string | null>(null);
  const [errorMobile, setErrorMobile] = useState<string | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [checkMobile, setCheckMobile] = useState<boolean>(false);
  const [mobile, setMobile] = useState<string>(profileState.mobile);
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weightError, setWeightError] = useState<string | null>(null);
  const [heightError, setHeightError] = useState<string | null>(null);
  const [genSelected, setGenSelected] = useState<number>();
  const [errorGenSelected, setErrorGenselected] = useState<string | null>(null);
  const [profileModal, setProfileModal] = useState<boolean>(false);
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
  const [profile, setProfile] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

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
      setErrorEmail(VALIDATE_FORM.EMAILMOBILE);
      setCheckEmail(true);
    } else if (!emailRegex.test(mail)) {
      setErrorEmail(VALIDATE_FORM.VALIDEMAILMOBILE);
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
      setWeightError('*Please enter your weight.');
    } else if (Number(weight) > 150) {
      setWeightError('*Please enter valid data');
    } else {
      setWeightError(null);
    }
  };
  const validate = () => {
    let flag = true;
    if (name === '' || checkName) {
      seterrorName(VALIDATE_FORM.VALID_NAME);
      flag = false;
    }
    if (email === '' || checkEmail) {
      setErrorEmail(VALIDATE_FORM.EMAIL_VALID);
      flag = false;
    }
    if (weight === '') {
      setWeightError('Please Enter weight');
      flag = false;
    }
    if (height === '') {
      setHeightError('Please Enter height');
      flag = false;
    }
    if (date == 'DD') {
      setErrorDob(VALIDATE_FORM.DOB);
      flag = false;
    }
    if (genSelected == null || undefined) {
      setErrorGenselected(VALIDATE_FORM.GENDER);
      flag = false;
    } else {
      return flag;
    }
  };
  const updateProfile = () => {
    if (validate()) {
      setLoading(true);
      const data = {
        name: name,
        email: email,
        dob: `${date}/${month}/${year}`,
        gender:
          genSelected === 0 ? 'male' : genSelected === 1 ? 'female' : 'other',
        weight: weight,
        height: height,
        ...(profile ? {profilePic: profile} : {}),
      };
      updateData(data);
      delay({func: () => {setLoading(false);navigation.navigate(PROFILE,{profilePic:profile})}, time: 1000});
    }
  };

  const removeProfile = () => {
    setProfile(Images.dummyBase64);
    setProfileModal(false);
  }

  const openCameraLib = () => {
    let SET: any;
    SET = setProfile;
    openCamera({cropping: false, useFrontCamera: true})
      .then(response => {
        setProfileModal(false);
        const split = response?.path.split('/');
        convertImageToBase64(response?.path);
      })
      .catch(err => {
        console.log('message', err);
        setProfileModal(false);
      });
  };

  // **********************launchImageLibrary******************************************
  const launchImageLibrary = async () => {
    let SET: any;
    SET = setProfile;
    let options: any = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    await ImagePicker.launchImageLibrary(options, (response: any) => {
      setProfileModal(false);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = {uri: response.assets[0].uri};
        console.log('response', JSON.stringify(response));
        convertImageToBase64(source.uri);
      }
    });
  };

  const compress = async (url: string) => {
    const result = await img.compress(url);
    console.log('====resize>>>>', result);
    convertImageToBase64(result);
  };

  const convertImageToBase64 = async (imageUri: any) => {
    try {
      const base64 = await RNFS.readFile(imageUri, 'base64');
      const size: number = (base64.length * 3) / 4;
      if (size < 1048487) {
        setProfile(base64);
      } else {
        compress(imageUri);
      }
      return base64;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };

  const SORT = [
    { key: 1, img: Images.cameraModal, name: 'Capture Image' },
    { key: 2, img: Images.upload_img, name: 'From Gallery' },
    { key: 3, img: Images.removeUser, name: 'Remove Photo' },
  ];

  const renderSort = (item: any) => {
    const {key, img, name} = item.item;
    return (
      <TouchableOpacity
        onPress={() => (key == 1 ? openCameraLib() : key == 3 ? removeProfile() : launchImageLibrary())}>
        <View style={styles.sortcontainer}>
          <View style={styles.left}>
            <Image source={img} style={key == 3 ? styles.removeIcon : null} />
          </View>
          <View style={styles.right}>
            <Text
              style={[
                styles.txt,
                {
                  fontSize: adjust(12),
                  textAlign: 'left',
                  padding: 0,
                  color: COLORS.GRAYBUTTON,
                },
              ]}>
              {name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const profilePicModal = () => {
    return (
      <Modal animationType={'slide'} transparent={true} visible={profileModal}>
        <View style={styles.modalview}>
          <View style={[styles.modal, {}]}>
            <View style={styles.cross}>
              <TouchableOpacity
                onPress={() => setProfileModal(false)}
                style={styles.crossbtn}>
                <Image style={styles.close} source={Images.close} />
              </TouchableOpacity>
            </View>
            <View style={styles.upload}>
              <Image source={Images.upload} />
              <Text
                style={[
                  styles.txt,
                  {fontSize: adjust(12), padding: 0, color: COLORS.BLACK},
                ]}>
                {'Upload Photo'}
              </Text>
            </View>
            <View style={[styles.sortflatlist, {justifyContent: 'center'}]}>
              <FlatList
                data={SORT}
                renderItem={renderSort}
                scrollEnabled={false}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Account" isBack />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.main}>
          <View style={styles.campicView}>
            <Image
              source={
                profile
                  ? { uri: `data:image/png;base64,${profile}` }
                  : Images.dummyUser
              }
              style={profile ? styles.profileImg : styles.profileImg}
            />
            <TouchableOpacity
              onPress={() => setProfileModal(true)}
              style={styles.camPic}>
              <Image source={Images.camera} />
            </TouchableOpacity>
          </View>
          <View style={styles.entryFieldView}>
            <TextBox
              placeholder="Name"
              value={name}
              setValue={setName}
              validate={_namevalidate}
              containerStyle={styles.containerStyle}
              style={{height: '80%'}}
            />
            {errorName ? (
              <Text style={styles.errorTxt}>{errorName}</Text>
            ) : null}
            <TextBox
              placeholder="Email"
              value={email}
              setValue={setEmail}
              validate={_emailvalidate}
              containerStyle={styles.containerStyle}
              style={{height: '80%'}}
            />
            {errorEmail ? (
              <Text style={styles.errorTxt}>{errorEmail}</Text>
            ) : null}
            <TextBox
              value={mobile}
              setValue={setMobile}
              validate={_mobileValidate}
              edit
              containerStyle={styles.containerStyle}
              style={{height: '80%'}}
            />
            <TouchableOpacity
              style={styles.dob}
              onPress={() => {
                showDatePicker(), setErrorDob(null);
              }}>
              <Text
                style={[
                  styles.txt,
                  {color: COLORS.BLACK, paddingLeft: 0, fontSize: adjust(10)},
                ]}>
                {date}/{month}/{year}
              </Text>
              <Image source={Images.calender} />
            </TouchableOpacity>
            {errorDob ? (
              <Text style={[styles.errorTxt, {top: 0}]}>{errorDob}</Text>
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
              validate={() => _weightValidate}
              num
              length={3}
              containerStyle={[styles.containerStyle, {marginTop: '2%'}]}
              style={{height: '80%'}}
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
              containerStyle={styles.containerStyle}
              style={{height: '80%'}}
            />
            {heightError ? (
              <Text style={styles.errorTxt}>{heightError}</Text>
            ) : null}
            <View style={styles.genView}>
              <TouchableOpacity
                style={[
                  styles.genButtonTouch,
                  {
                    borderColor: genSelected == 0 ? '' : COLORS.GRAY,
                    backgroundColor:
                      genSelected == 0 ? COLORS.SELECTION : 'white',
                  },
                ]}
                onPress={() => setGenSelected(0)}>
                <Image
                  source={Images.male}
                  style={{tintColor: genSelected == 0 ? 'white' : COLORS.GRAY}}
                />
                <Text
                  style={[
                    styles.buttonText,
                    {color: genSelected == 0 ? 'white' : 'black'},
                  ]}>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genButtonTouch,
                  {
                    borderColor: genSelected == 1 ? '' : COLORS.GRAY,
                    backgroundColor:
                      genSelected == 1 ? COLORS.SELECTION : 'white',
                  },
                ]}
                onPress={() => setGenSelected(1)}>
                <Image
                  source={Images.female}
                  style={{tintColor: genSelected == 1 ? 'white' : COLORS.GRAY}}
                />
                <Text
                  style={[
                    styles.buttonText,
                    {color: genSelected == 1 ? 'white' : 'black'},
                  ]}>
                  Female
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genButtonTouch,
                  {
                    borderColor: genSelected == 2 ? '' : COLORS.GRAY,
                    backgroundColor:
                      genSelected == 2 ? COLORS.SELECTION : 'white',
                  },
                ]}
                onPress={() => setGenSelected(2)}>
                <Image
                  source={Images.other}
                  style={{tintColor: genSelected == 2 ? 'white' : COLORS.GRAY}}
                />
                <Text
                  style={[
                    styles.buttonText,
                    {color: genSelected == 2 ? 'white' : 'black'},
                  ]}>
                  Other
                </Text>
              </TouchableOpacity>
            </View>
            {errorGenSelected ? (
              <Text style={[styles.errorTxt, {marginTop: adjust(10)}]}>
                {errorGenSelected}
              </Text>
            ) : null}
            <CustomButton
              label="Update"
              press={() => updateProfile()}
              containerStyle={[styles.containerStyle, {height: adjust(60)}]}
            />
          </View>
        </View>
      </ScrollView>
      <Loader loading={loading} />
      {profilePicModal()}
    </View>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  entryFieldView: {
    marginTop: adjust(15),
  },
  main: {
    flex: 1,
    margin: adjust(15),
  },
  campicView: {
    alignSelf: 'center',
    marginBottom: adjust(10),
    height: adjust(90),
    width: adjust(90)
  },
  camPic: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: '60%'
  },
  errorTxt: {
    color: COLORS.RED,
    fontSize: adjust(10),
    top: adjust(-5),
    fontFamily: FONT_FAMILIES.WORKSANS,
  },
  containerStyle: {
    justifyContent: 'center',
    height: adjust(50),
  },
  dob: {
    backgroundColor: 'white',
    height: adjust(40),
    borderWidth: 0.5,
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
  },
  genView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '2%',
  },
  genButtonTouch: {
    height: adjust(35),
    width: '30%',
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  buttonText: {
    color: COLORS.GREY,
    fontSize: adjust(10),
    fontFamily: FONT_FAMILIES.WORKSANS,
    paddingLeft: adjust(5),
  },
  changeText: {
    color: COLORS.RED,
    fontSize: adjust(10),
    fontFamily: FONT_FAMILIES.WORKSANS_SEMIBOLD,
    fontWeight: '500',
  },
  changeTouch: {
    position: 'absolute',
    top: Platform.OS === 'android' ? '44%' : '45.5%',
    marginRight: '5%',
    alignSelf: 'flex-end',
  },
  sortcontainer: {
    height: adjust(35),
    width: adjust(200),
    marginVertical: adjust(3),
    borderRadius: 8,
    borderColor: '#E2E2E2',
    borderWidth: 1,
    flexDirection: 'row',
  },
  left: {
    width: adjust(37),
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    width: adjust(90),
    justifyContent: 'center',
  },
  modalview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    backgroundColor: COLORS.WHITE,
    width: adjust(220),
    borderRadius: 8,
    elevation: 10,
    borderColor: COLORS.BORDER_COLOR,
    borderWidth: 1,
  },
  cross: {
    height: adjust(25),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  crossbtn: {
    height: adjust(25),
    width: adjust(27),
    justifyContent: 'center',
    alignItems: 'center',
  },
  close: {
    tintColor: 'black',
  },
  sortflatlist: {
    alignItems: 'center',
  },
  upload: {
    alignItems: 'center',
  },
  bottom: {
    backgroundColor: COLORS.MAIN,
    flex: 0.08,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileImg: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: 'contain',
    borderRadius: adjust(90 / 2),
  },
  sendcircle: {
    height: adjust(90),
    width: adjust(90),
    borderRadius: adjust(90 / 2),
    marginTop: '-15%',
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: 'contain',
    borderRadius: adjust(90 / 2),
  },
  removeIcon: {
    height: adjust(20),
    width: adjust(20),
    resizeMode: 'contain'
  }
});
