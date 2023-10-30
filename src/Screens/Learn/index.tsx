import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Header from '@/ReuseableComponent/Header'
import { COLORS, FONT_FAMILIES } from '@/Configuration';
import adjust from '@/Component/adjust';
import { Images } from '@/Assets';

const Learn = () => {
    const [selected, setSelected] = useState<number>(0);
    const [click, setClick] = useState<boolean>(false);
    const [Id, setId] = useState<string>('');
    const [click1, setClick1] = useState<boolean>(false);
    const [Id1, setId1] = useState<string>('');
    const frontData = [
        {
            id: 1,
            name: 'Straight Drive',
            ans: "It is played with straight bat when ball is piched in off stump and leg stump",
        },
        {
            id: 2,
            name: 'Cover Drive',
            ans: "It is played when ball is pitched outside off stump.",
        },
        {
            id: 3,
            name: 'On Drive',
            ans: "It is played when ball is pitched on or outside leg stump",
        },
    ];
    const backData = [
        {
            id: 1,
            name: 'Cut',
            ans: "It is played when ball is played on a short length and outside off stump.",
        },
        {
            id: 2,
            name: 'Square Cut',
            ans: "It is played when ball is played on a short length and outside off stump.",
        },
        {
            id: 3,
            name: 'Pull',
            ans: "Ii is played when ball is short of length and at a very high height",
        },
    ];
    const fastData = [
        {
            id: 1,
            name: 'Yorker',
            ans: "It is bowled at the batsman's feet or the base of the stumps, just short of the batsman.",
        },
        {
            id: 2,
            name: 'Bouncer',
            ans: "It is bowled above the batsman's body.",
        }
    ];
    const mediumData = [
        {
            id: 1,
            name: 'Slow Ball',
            ans: "It is bowled at the batsman's at a slower speed by twist fingers",
        },
        {
            id: 2,
            name: 'Good length',
            ans: "It is bowled at the batsman's at a good length and line.",
        }
    ];
    const renderItem = (item: any) => {
        const { id, name, ans } = item.item;
        return click == true && Id === id ? (
            <TouchableOpacity onPress={() => { setClick(false), setId(id) }} style={styles.renderBoxExpand}>
                <View style={[styles.main, { margin: adjust(20) }]}>
                    <View style={styles.renderBoxExpInnerView}>
                        <Text style={styles.renderInnerCollText}>{name}</Text>
                        <Image source={Images.topArrow} />
                    </View>
                    <Text style={[styles.renderInnerCollText, { fontSize: adjust(12) }]}>{ans}</Text>
                </View>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity onPress={() => { setClick(true), setId(id) }} style={styles.renderBoxCollapse}>
                <View style={styles.renderBoxCollInnerView}>
                    <Text style={styles.renderInnerCollText}>{name}</Text>
                    <Image source={Images.rightArrow} />
                </View>
            </TouchableOpacity>
        )
    }
    const renderItem1 = (item: any) => {
        const { id, name, ans } = item.item;
        return click1 == true && Id1 === id ? (
            <TouchableOpacity onPress={() => { setClick1(false), setId1(id) }} style={styles.renderBoxExpand}>
                <View style={[styles.main, { margin: adjust(20) }]}>
                    <View style={styles.renderBoxExpInnerView}>
                        <Text style={styles.renderInnerCollText}>{name}</Text>
                        <Image source={Images.topArrow} />
                    </View>
                    <Text style={[styles.renderInnerCollText, { fontSize: adjust(12) }]}>{ans}</Text>
                </View>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity onPress={() => { setClick1(true), setId1(id) }} style={styles.renderBoxCollapse}>
                <View style={styles.renderBoxCollInnerView}>
                    <Text style={styles.renderInnerCollText}>{name}</Text>
                    <Image source={Images.rightArrow} />
                </View>
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.container}>
            <Header title='Learn' isBack />
            <View style={styles.main}>
                <View style={styles.mainButtonView}>
                    <TouchableOpacity style={[styles.mainButton, { backgroundColor: selected == 0 ? COLORS.SELECTION : COLORS.WHITE }]} onPress={() => setSelected(0)}>
                        <Text style={[styles.ButtonText, { color: selected == 0 ? COLORS.WHITE : COLORS.BLACK }]}>Batting</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.mainButton, { backgroundColor: selected == 1 ? COLORS.SELECTION : COLORS.WHITE, marginLeft: adjust(15) }]} onPress={() => setSelected(1)}>
                        <Text style={[styles.ButtonText, { color: selected == 1 ? COLORS.WHITE : COLORS.BLACK }]}>Bowling</Text>
                    </TouchableOpacity>
                </View>
                {selected == 0 ?
                <>
                <Text style={styles.fronTxt}>Front Foot</Text>
                <View style={{ height: click === true ? adjust(230) : adjust(190) }}>
                    <FlatList
                        data={frontData}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
                <Text style={styles.fronTxt}>Back Foot</Text>
                <FlatList
                    data={backData}
                    renderItem={renderItem1}
                    showsVerticalScrollIndicator={false}
                />
                </> : 
                <>
                <Text style={styles.fronTxt}>Fast Bowler</Text>
                <View style={{ height: click === true ? adjust(180) : adjust(140)}}>
                    <FlatList
                        data={fastData}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
                <Text style={styles.fronTxt}>Medium Pacer</Text>
                <FlatList
                    data={mediumData}
                    renderItem={renderItem1}
                    showsVerticalScrollIndicator={false}
                />
                </>
                }
            </View>
        </View>
    )
}

export default Learn

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    main: {
        margin: adjust(15),
        flex: 1
    },
    mainButtonView: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    mainButton: {
        height: adjust(30),
        width: '30%',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ButtonText: {
        fontSize: adjust(15),
        fontFamily: FONT_FAMILIES.WORKSANS,
        fontWeight: '400',
    },
    fronTxt: {
        fontSize: adjust(15),
        fontFamily: FONT_FAMILIES.WORKSANS,
        fontWeight: '400',
        color: COLORS.BLACK,
        marginTop: adjust(10)
    },
    renderBoxCollapse: {
        backgroundColor: COLORS.WHITE,
        height: adjust(55),
        borderRadius: 10,
        marginVertical: adjust(5),
        justifyContent: 'center'
    },
    renderBoxCollInnerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: adjust(20),
        paddingRight: adjust(20)
    },
    renderBoxExpInnerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    renderInnerCollText: {
        fontSize: adjust(15),
        fontFamily: FONT_FAMILIES.WORKSANS,
        fontWeight: '400',
        color: COLORS.BLACK
    },
    renderBoxExpand: {
        backgroundColor: COLORS.WHITE,
        height: adjust(95),
        borderRadius: 10,
        marginVertical: adjust(5),
    },
})