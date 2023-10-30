import { StyleSheet, View, TextInput, ViewStyle, StyleProp } from 'react-native';
import React from 'react';
import { COLORS, FONT_FAMILIES } from '@/Configuration';
import adjust from '@/Component/adjust';
import { textBoxProps } from 'types';

export default function TextBox(props: textBoxProps) {
    const {
        style,
        placeholder,
        value,
        setValue,
        validate,
        secure,
        num,
        length,
        containerStyle,
        edit
    } = props;

    return (
        <View style={[styles.container, containerStyle]}>
            <TextInput
                style={[styles.input, style]}
                placeholder={placeholder}
                keyboardType={num ? 'phone-pad' : 'default'}
                placeholderTextColor={COLORS.PLACEHOLDER}
                maxLength={length ? length : 100}
                secureTextEntry={secure ? true : false}
                value={value}
                autoCapitalize="none"
                cursorColor={'#3B68FF'}
                editable={edit ? false : true}
                onChangeText={txt => {
                    setValue(txt), validate ? validate(txt) : null;
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: adjust(55),
        justifyContent: 'center',
    },
    input: {
        height: adjust(30),
        borderColor: COLORS.GRAY,
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 8,
        color: 'black',
        fontSize: adjust(10.2),
        fontFamily: FONT_FAMILIES.WORKSANS,
        backgroundColor:'white'
    },
});
