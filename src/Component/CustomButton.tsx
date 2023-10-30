import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {COLORS, FONT_FAMILIES} from '@/Configuration';
import React from 'react';
import adjust from '@/Component/adjust';
import {customButtonProps} from 'types';
import LinearGradient from 'react-native-linear-gradient';

export default function CustomButton(
  props: React.PropsWithChildren<customButtonProps>,
) {
  const {press, style, label, txtStyle, containerStyle, image, color, disable} =
    props;
  const START = {x: 0, y: 0};
  const END = {x: 1, y: 0};
  return (
    <View style={containerStyle}>
      <TouchableOpacity onPress={press} disabled={disable ? disable : false}>
        <LinearGradient
          colors={color ? color : COLORS.PRE_COLOR}
          start={START}
          end={END}
          style={[styles.btn, style]}>
          {/* @ts-ignore */}
          {image && <Image source={image} />}
          <Text style={[styles.txt, txtStyle]}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: '2%',
    borderRadius: adjust(15),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    color: COLORS.WHITE,
    fontSize: adjust(15),
    fontFamily: FONT_FAMILIES.WORKSANS,
  },
});
