import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer, Route} from '@react-navigation/native';
import Login from '@/Screens/Auth/Login';
import {SCREENS} from '@/Constant';
import SignUp from '@/Screens/Auth/SignUp';
import {
  Alert,
  BackHandler,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Splash from '@/Screens/Splash';
import Otp from '@/Screens/Auth/Otp';
import Register from '@/Screens/Auth/Register';
import Dashboard from '@/Screens/Dashboard';
import adjust from '@/Component/adjust';
import {COLORS, FONT_FAMILIES} from '@/Configuration';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Images} from '@/Assets';
import Session from '@/Screens/Session';
import Profile from '@/Screens/Profile';
import CreateSession from '@/Screens/CreateSession';
import BattingAnalysis from '@/Screens/Analysis/BattingAnalysis';
import BowlingAnalysis from '@/Screens/Analysis/BowlingAnalysis';
import SessionDetails from '@/Screens/SessionDetails';
import UpdateProfile from '@/Screens/UpdateProfile';
import Learn from '@/Screens/Learn';
const {
  LOGIN,
  SIGNUP,
  SPLASH,
  OTP,
  REGISTER,
  MAIN,
  SESSION,
  PROFILE,
  TABS,
  CREATESESSION,
  BATTINGANALYSIS,
  BOWLINGANALYSIS,
  SESSIONDETAILS,
  UPDATEPROFILE,
  LEARN,
} = SCREENS;
const navigationRef: React.RefObject<any> = React.createRef();
const MainStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Navigator: React.FC = () => {
  const exitApp: Function = () => {
    Alert.alert(
      'Exit App',
      'Exiting the application?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => BackHandler.exitApp(),
        },
      ],
      {
        cancelable: false,
      },
    );
  };
  React.useEffect(() => {
    function handleBackButton() {
      const routeInfo: Route<string, object | undefined> =
        navigationRef.current.getCurrentRoute();
        console.log('====routeInfo===>>>>',routeInfo);
      if (
        routeInfo.name.toLowerCase() === 'login' ||
        routeInfo.name.toLowerCase() === 'dashboard'
      ) {
        exitApp();
      } else {
        if (navigationRef.current.canGoBack()) {
          navigationRef.current.goBack();
        }
      }
      return true;
    }

    // Handle when back button pressed
    const backHandler: any = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );
    return () => backHandler.remove();
  }, []);
  //=====================Tabs Customizations =====================================//
  const tabScreenOptions = ({route}: any) => ({
    headerShown: false,
    tabBarShowLabel: false,
    tabBarStyle: styles.tabBarStyle,
    tabBarIcon: (data: any) => {
      const {focused} = data;
      let iconName;
      let title;
      if (route.name === MAIN) {
        iconName = Images.homeTab;
        title = 'Dashboard';
      } else if (route.name === SESSION) {
        iconName = Images.sessionTab;
        title = 'Session';
      } else if (route.name === PROFILE) {
        iconName = Images.profileTab;
        title = 'Profile';
      }
      return (
        <View
          style={[
            styles.tabView,
            {backgroundColor: focused ? '#98fb98' : COLORS.WHITE},
          ]}>
          <Image
            source={iconName}
            style={[
              styles.img,
              {
                tintColor: focused ? COLORS.TABCOLOR : COLORS.TABUNSELECTED,
              },
            ]}
            resizeMode={'contain'}
          />
          <Text
            style={[
              styles.txt,
              {
                color: focused ? COLORS.TABCOLOR : COLORS.TABUNSELECTED,
              },
            ]}>
            {title}
          </Text>
        </View>
      );
    },
  });

  //=====================Tabs Navigator =====================================//
  const Tabs = () => {
    return (
      <Tab.Navigator screenOptions={tabScreenOptions}>
        <Tab.Screen name={MAIN} component={Dashboard} />
        <Tab.Screen name={SESSION} component={Session} />
        <Tab.Screen name={PROFILE} component={Profile} />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <MainStack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={SPLASH}>
        <MainStack.Screen name={LOGIN} component={Login} />
        <MainStack.Screen name={SIGNUP} component={SignUp} />
        <MainStack.Screen name={SPLASH} component={Splash} />
        <MainStack.Screen name={OTP} component={Otp} />
        <MainStack.Screen name={REGISTER} component={Register} />
        <MainStack.Screen name={TABS} component={Tabs} />
        <MainStack.Screen name={CREATESESSION} component={CreateSession} />
        <MainStack.Screen name={BATTINGANALYSIS} component={BattingAnalysis} />
        <MainStack.Screen name={BOWLINGANALYSIS} component={BowlingAnalysis} />
        <MainStack.Screen name={SESSIONDETAILS} component={SessionDetails} />
        <MainStack.Screen name={UPDATEPROFILE} component={UpdateProfile} />
        <MainStack.Screen name={LEARN} component={Learn} />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
const styles = StyleSheet.create({
  tabBarStyle: {
    height: Platform.OS === 'android' ? '7%' : '9%',
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  tabView: {
    alignItems: 'center',
    height: Platform.OS === 'android' ? '60%' : adjust(22),
    width: '85%',
    justifyContent: 'center',
    borderRadius: 20,
    flexDirection: 'row',
  },
  img: {
    height: adjust(15),
    width: '20%',
  },
  txt: {
    fontSize: adjust(10),
    fontFamily: FONT_FAMILIES.WORKSANS_SEMIBOLD,
  },
});
