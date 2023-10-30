import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '@/ReuseableComponent/Header';
import adjust from '@/Component/adjust';
import {COLORS, FONT_FAMILIES} from '@/Configuration';
import {Images} from '@/Assets';
import {MESSAGES, SCREENS} from '@/Constant';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useFirestore from '@/Hooks/useFirestore';
import Loader from '@/ReuseableComponent/Loader';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {successMessage} from '@/Component/commonFunctions';
const {UPDATEPROFILE, LEARN, LOGIN} = SCREENS;
const Profile = (props: any) => {
  const {navigation} = props;
  const isFocus = useIsFocused();
  const route:any = useRoute();
  const profilePic:string = route.params?.profilePic?route.params?.profilePic:'';

  const [loading, setLoading] = useState<boolean>(true);
  const {user} = useFirestore('auth');

  const [date, setDate] = useState<string>('');

  useEffect(() => {
    callApi();
  }, [user, isFocus, profilePic]);

  const callApi = () => {
    try {
      if (user !== null) {
        setLoading(false);
        // @ts-ignore
        const yr = user?.createdAt.toDate();
        setDate(yr.getFullYear());
        return;
      }
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  };

  const logoutApi = async () => {
    try {
      await auth()
        .signOut()
        .then(() => console.log('User signed out!'));
      navigation.replace(LOGIN);
      AsyncStorage.removeItem('userUid');
      successMessage({message: MESSAGES.LOGOUT});
    } catch (error) {
      console.log('error', error);
    }
  };
  const logoutModal = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Ok',
          onPress: () => logoutApi(),
        },
      ],
      {cancelable: false},
    );
  };
  return (
    <View style={styles.container}>
      <Header title="Profile" isBackArrowHide />
      <View style={styles.backView}>
        <View
          style={[
            styles.backView,
            {margin: adjust(15), marginTop: adjust(60)},
          ]}>
          <View style={styles.cardView}>
            <View style={styles.camproView}>
              <View style={styles.sendcircle}>
                <Image
                  source={
                    profilePic !== ''
                      ? {uri: `data:image/png;base64,${profilePic}`}
                      : user?.profilePic
                      ? {uri: `data:image/png;base64,${user?.profilePic}`}
                      : Images.dummyUser
                  }
                  style={styles.image}
                />
              </View>
            </View>
            <Text style={styles.txt}>{user?.name}</Text>
            <Text style={styles.txt2}>Member since {date}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(UPDATEPROFILE)}>
              <View style={styles.detView}>
                <Image source={Images.profileTab} />
                <Text style={styles.txt3}>Account</Text>
                <Image source={Images.rightArrow} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate(LEARN)}>
              <View style={[styles.detView, {marginTop: adjust(0)}]}>
                <Image source={Images.learn} style={styles.imageStyle} />
                <Text style={[styles.txt3, {paddingRight: adjust(12)}]}>
                  Learn
                </Text>
                <Image source={Images.rightArrow} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => logoutModal()}>
              <View style={[styles.detView, {marginTop: adjust(0)}]}>
                <Image
                  source={Images.logout}
                  style={[styles.imageStyle, {marginLeft: adjust(3)}]}
                />
                <Text style={[styles.txt3, {paddingRight: adjust(7)}]}>
                  Logout
                </Text>
                <Image source={Images.rightArrow} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Loader loading={loading} />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backView: {
    flex: 0.2,
    backgroundColor: COLORS.MAIN,
  },
  cardView: {
    height: adjust(240),
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
  },
  profile: {},
  camproView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cam: {
    position: 'absolute',
    left: '50%',
    bottom: '110%',
  },
  txt: {
    marginTop: adjust(10),
    fontSize: adjust(15),
    fontFamily: FONT_FAMILIES.WORKSANS_SEMIBOLD,
    color: COLORS.BLACK,
    fontWeight: '500',
    textAlign: 'center',
  },
  txt1: {
    marginTop: '1%',
    fontSize: adjust(12),
    fontFamily: FONT_FAMILIES.WORKSANS,
    color: COLORS.BLACK,
    fontWeight: '500',
    textAlign: 'center',
  },
  txt2: {
    marginTop: '1%',
    fontSize: adjust(10),
    fontFamily: FONT_FAMILIES.WORKSANS_LIGHT,
    color: COLORS.BLACK,
    fontWeight: '500',
    textAlign: 'center',
  },
  txt3: {
    fontSize: adjust(13),
    fontFamily: FONT_FAMILIES.WORKSANS,
    color: COLORS.BLACK,
    fontWeight: '500',
    marginRight: '55%',
  },
  detView: {
    marginTop: adjust(10),
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY,
    height: adjust(35),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: adjust(10),
    paddingLeft: adjust(10),
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
  imageStyle: {
    marginLeft: adjust(1),
  },
});
