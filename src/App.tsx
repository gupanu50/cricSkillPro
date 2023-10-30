import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import React from 'react';
import Navigator from '@/Navigator';
import FlashMessage from 'react-native-flash-message';
import SplashScreen from 'react-native-splash-screen';
const App = () => {
  SplashScreen.hide();
  return (
    <View style={styles.container}>
      <Navigator />
      <FlashMessage
        type={'danger'}
        duration={5000}
        position={Platform.OS === 'ios' ? 'top' : styles.position}
        floating={Platform.OS !== 'ios'}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  position: {
    top: StatusBar.currentHeight,
    left: 0,
    right: 0,
  },
});
