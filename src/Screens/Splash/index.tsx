import React, {useEffect} from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Constant from '@/Constant';
import {Images} from '@/Assets';
const {TABS, LOGIN} = Constant.SCREENS;

const Splash = (props: any) => {
  const {navigation} = props;

  useEffect(() => {
    // function execute when this screen render
    // getUserData();
  }, []);

  setTimeout(() => {
    getUserData();
  }, 1000);

  // ************************ fetch data from asyncStorage **************************
  const getUserData = async () => {
    console.log('getUSerData');
    try {
      let data: any = await AsyncStorage.getItem('userUid');
      console.log('=====data===>>>', data);
      if (data) {
        // if async storage has data app move to dashboard
        navigation.navigate(TABS);
      } else {
        // otherwise app go to login screen
        navigation.navigate(LOGIN);
      }
    } catch (error) {
      // in any error case also, app move to login screen
      navigation.navigate(LOGIN);
      console.log('==errorSplash==>>>', error);
    }
  };

  return (
    <>
      <Image source={Images.splash} style={styles.img} />
    </>
  );
};

export default Splash;

const styles = StyleSheet.create({
  img: {
    resizeMode: 'stretch',
    height: '100%',
    width: '100%',
  },
});
