import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Platform,
  Modal,
} from 'react-native';
import { Header } from 'react-native-elements';
import { Images } from '../Assets';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILIES } from '@/Configuration';
import adjust from '@/Component/adjust';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
// import MonthPicker from "react-native-month-picker";
import { SCREENS } from '@/Constant';
// import MonthPicker from 'react-native-month-year-picker';
const { MAIN } = SCREENS;
const NavHeader = (props: any) => {
  const {
    bc,
    isBack,
    isBackHide,
    title,
    isRightAction,
    titleStyle,
    isSubTitle,
    type,
    isStop,
    setVisible,
    formattedTime,
    setFormattedTime,
    back,
    close,
    isBackArrowHide,
  } = props;
  const navigation: any = useNavigation();
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  // ************************** drawer function *****************************************
  const onDateChange = (event: any, newDate: any) => {
    const selectedDate = newDate || date;
    setDatePickerVisibility(false)
    setDate(selectedDate)
  }

  const openDrawer = () => {
    if (isStop) {
      setVisible(true);
      back(true);
    } else if (close) {
      navigation.navigate(MAIN);
    } else {
      navigation.goBack();
      return;
    }
  };

  const leftComponent = () => {
    if (isBack && !isBackHide) {
      return (
        <TouchableOpacity onPress={openDrawer} style={styles.leftComponent}>
          <Image
            source={close ? Images.close : Images.back}
            style={[
              styles.menubar,
              {
                height: close ? 17 : 25,
                width: close ? 18 : 25,
                tintColor: 'white',
              },
            ]}
          />
          <Text style={styles.text}>{` ${title}`}</Text>
        </TouchableOpacity>
      );
    } else if (isBackHide) {
      return null;
    } else if (isBackArrowHide) {
      return (
        <View style={styles.leftComponent}>
          <Text style={styles.text}>{` ${title}`}</Text>
        </View>
      );
    } else {
      return (
        <TouchableOpacity style={styles.leftComponent} onPress={openDrawer}>
          <Image source={Images.menu} style={styles.menubar} />
        </TouchableOpacity>
      );
    }
  };

  const leftComponent1 = () => {
    return (
      <View style={styles.first}>
        <Image source={Images.logo} style={styles.chargerImg} />
      </View>
    );
  };
  // const modalMonth = () => {
  //   return (
  //     <Modal visible={isDatePickerVisible} animationType='slide' transparent={true}>
  //       <View style={styles.modalview}>
  //         <View style={[styles.modal, {}]}>
  //           <MonthPicker
  //             selectedDate={date}
  //             onMonthChange={setDate}
  //           />
  //         </View>
  //       </View>
  //     </Modal>
  //   )
  // }
  const rightComponent = () => {
    if (isRightAction === undefined) {
      return (
        <View style={styles.rightComponent}>
          <TouchableOpacity />
        </View>
      );
    }
    if (isRightAction === 'search') {
      return (
        <View style={styles.rightSearchComponent}>
          <TouchableOpacity>
            <Image source={Images.search} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={Images.filter} style={styles.filterImage} />
          </TouchableOpacity>
        </View>
      );
    }

    if (isRightAction === 'timer') {

      useEffect(() => {
        let seconds = 0;
        let minutes = 0;
        let hours = 0;

        function updateTimer() {
          seconds++;
          if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
              minutes = 0;
              hours++;
            }
          }

          const newFormattedTime = `${String(hours).padStart(2, '0')}:${String(
            minutes,
          ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
          setFormattedTime(newFormattedTime);
        }

        // Update the timer every 1000 milliseconds (1 second)
        const timerInterval = setInterval(updateTimer, 1000);

        return () => {
          // Clean up the interval when the component unmounts
          clearInterval(timerInterval);
        };
      }, []);

      return (
        <View
          style={[
            styles.rightComponent,
            { height: 50, width: '140%', flexDirection: 'row' },
          ]}>
          <Image
            source={Images.time}
            style={{
              marginRight: 2,
              tintColor: 'white',
              resizeMode: 'contain',
              height: '35%',
              width: '35%',
            }}
          />
          <Text style={[styles.text, { color: 'white' }]}>{formattedTime}</Text>
        </View>
      );
    }

    return (
      <View style={styles.rightComponent}>
        {/* <TouchableOpacity
          style={styles.dob}
          onPress={() => {
            setDatePickerVisibility(true)
          }}>
          <Image source={Images.calender} style={styles.calenderImage} />
          <Text style={styles.txt}>
            {moment(date).format("MMM YYYY")}
          </Text>
        </TouchableOpacity> */}
        {/* {isDatePickerVisible &&
          <MonthPicker
            onChange={onDateChange}
            value={date}
          />
          // <MonthPicker 
          // selectedDate={date}
          // onMonthChange={setDate}
          
          // />
          } */}
      </View>
    );
  };

  const centerComponent = () => {
    return (
      <View
        style={{ height: 50, justifyContent: 'center', backgroundColor: 'red' }}>
        <Text style={[styles.text]}>{title}</Text>
      </View>
    );
  };
  return (
    <View style={{ marginTop: Platform.OS === 'ios' ? 0 : 0 }}>
      {/* @ts-ignore */}
      <Header
        statusBarProps={{
          barStyle: 'light-content',
          translucent: true,
        }}
        containerStyle={styles.container}
        placement={'center'}
        leftComponent={type ? leftComponent1 : leftComponent}
        rightComponent={rightComponent}
        backgroundColor={bc ? 'transparent' : '#136548'}
      />
      {/* {modalMonth()} */}
    </View>
  );
};
export default NavHeader;
const styles = StyleSheet.create({
  container: {
    borderBottomColor: 'transparent',
  },
  leftComponent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    width: '300%',
  },
  centerComponent: {
    flex: 1,
    backgroundColor: 'red',
  },
  menuImage: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  profileImage: {
    height: 30,
    width: 40,
    borderRadius: 15,
    borderColor: 'white',
    borderWidth: 2,
    marginTop: 3,
  },
  backbar: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  menubar: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  text: {
    fontSize: adjust(15),
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.WORKSANS,
  },
  rightComponent: {
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  subTitle: {
    color: COLORS.WHITE,
    textAlign: 'center',
  },
  rightSearchComponent: {
    alignItems: 'center',
    width: '200%',
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'flex-end',
  },
  calenderImage: {
    tintColor: COLORS.WHITE,
  },
  filterImage: {
    marginLeft: adjust(15),
  },
  dob: {
    height: adjust(20),
    width: '250%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  txt: {
    color: COLORS.WHITE,
    fontSize: adjust(11),
    marginLeft: adjust(5),
    textAlignVertical: 'center',
    fontFamily: FONT_FAMILIES.WORKSANS,
  },
  first: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    width: '260%',
  },
  chargerImg: {
    height: '100%',
    width: '100%',
  },
  modalview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modal: {
    backgroundColor: COLORS.WHITE,
    width: adjust(250),
    height: adjust(220),
    borderRadius: 8,
    elevation: 10,
    borderColor: COLORS.BORDER_COLOR,
    borderWidth: 1
  },
});
