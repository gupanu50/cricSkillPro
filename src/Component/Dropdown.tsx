import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import adjust from './adjust';
import {COLORS, FONT_FAMILIES} from '@/Configuration';
import {dropDown} from '@/Types';

export default function DropDown(props: any) {
  const {select, setSelect, style, type} = props;

  const DATA: dropDown[] =
    type == 'batting'
      ? [
          {
            label: 'Front Foot',
            value: 'front',
          },
          {
            label: 'Back Foot',
            value: 'back',
          },
          {
            label: 'Defensive',
            value: 'defensive',
          },
          {
            label: 'Flick and Glance',
            value: 'flick',
          },
        ]
      : [
          {
            label: 'Fast Bowl',
            value: 'fast',
          },
          {
            label: 'Spinner',
            value: 'spin',
          },
          {
            label: 'Medium Pacer',
            value: 'medium',
          },
        ];

  return (
    <>
      <Dropdown
        style={[styles.dropdown, style]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        itemTextStyle={{
          color: COLORS.BLACK,
          fontFamily: FONT_FAMILIES.WORKSANS_MEDIUM,
        }}
        containerStyle={{backgroundColor: COLORS.WHITE}}
        activeColor={'#136548'}
        dropdownPosition={'bottom'}
        data={DATA}
        placeholder={'Select Shot'}
        maxHeight={adjust(100)}
        labelField="label"
        valueField="value"
        value={select}
        onChange={(item: any) => {
          setSelect(item.value);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    width: '40%',
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    paddingHorizontal: adjust(5),
    borderColor: COLORS.DROPDOWNBORDERCOLOR,
    borderWidth: 1.4,
    padding: 5,
  },
  placeholderStyle: {
    fontSize: adjust(11),
    color: 'grey',
    fontFamily: FONT_FAMILIES.WORKSANS,
  },
  selectedTextStyle: {
    fontSize: adjust(12),
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILIES.WORKSANS,
    fontWeight: '400',
  },
});
