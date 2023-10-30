import {Modal, StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {Images} from '@/Assets';
import CustomButton from './CustomButton';
import {COLORS, FONT_FAMILIES} from '@/Configuration';
import adjust from './adjust';

export default function StopModal(props: any) {
  const {visible, setvisible, stop} = props;
  return (
    <>
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalView}>
          <View style={styles.innerModalView}>
            <View style={styles.innerModalView1}>
              <Image source={Images.sessionRedBat} />
              <Text style={styles.modalTxt1}>
                Do you want to stop the session?
              </Text>
            </View>
            <View style={styles.innerModalView2}>
              <CustomButton
                label="Not Now"
                txtStyle={styles.buttonText}
                color={[COLORS.TABUNSELECTED, COLORS.TABUNSELECTED]}
                style={styles.modalCancel}
                press={() => setvisible(false)}
              />
              <CustomButton
                label="Yes"
                txtStyle={styles.buttonText}
                style={styles.modalStart}
                press={stop}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  innerModalView: {
    backgroundColor: COLORS.WHITE,
    height: adjust(130),
    width: adjust(260),
    borderRadius: 15,
    elevation: 10,
    borderColor: COLORS.BORDER_COLOR,
    borderWidth: 1,
  },
  innerModalView1: {
    flex: 0.6,
    margin: adjust(15),
    alignItems: 'center',
  },
  modalTxt1: {
    marginTop: adjust(4),
    fontSize: adjust(10),
    fontFamily: FONT_FAMILIES.WORKSANS,
    fontWeight: '400',
    color: COLORS.BLACK,
  },
  innerModalView2: {
    flex: 0.25,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  modalCancel: {
    height: adjust(25),
    width: adjust(90),
  },
  modalStart: {
    height: adjust(25),
    width: adjust(90),
    marginLeft: adjust(10),
  },
  buttonText: {
    fontSize: adjust(12),
  },
});
