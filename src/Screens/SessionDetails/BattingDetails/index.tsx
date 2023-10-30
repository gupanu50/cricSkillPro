import {
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import adjust from '@/Component/adjust';
import {COLORS, FONT_FAMILIES} from '@/Configuration';
import CustomButton from '@/Component/CustomButton';
import DropDown from '@/Component/Dropdown';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryPie,
  VictoryTheme,
} from 'victory-native';
import {graphData} from '@/Types';
const {height, width} = Dimensions.get('screen');
const BattingDetails = (props: any) => {
  const {data} = props;
  const balls = data?.balls ?? [];
  const [shot, setShot] = useState<string>('front');
  const [colorMapping, setColorMapping] = useState<Record<string, string>>({});

  useEffect(() => {
    // Function to get a random color
    function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    const newColorMapping: Record<string, string> = {};
    for (const shots of shotType) {
      newColorMapping[shots] = getRandomColor();
    }
    setColorMapping(newColorMapping);
  }, []);

  const renderTopDisplay = (item: any, type: string) => {
    const {x, y} = item.item;
    return (
      <View style={styles.renderView}>
        <View style={styles.renderView1}>
          <View
            style={[
              styles.dotView,
              {
                backgroundColor:
                  type == 'perfect'
                    ? COLORS.PERFECT_COLOR[item.index]
                    : COLORS.WORST_COLOR[item.index],
                marginRight: adjust(5),
              },
            ]}></View>
          <Text style={styles.renderText}>{x}</Text>
        </View>
        <View style={styles.renderView2}>
          <Text style={styles.renderText}>{y}</Text>
        </View>
      </View>
    );
  };

  function countMissBalls(balls: any) {
    let count = 0;
    for (const item of balls) {
      if (item?.analysis === 'Miss ball') {
        count++;
      }
    }
    return count;
  }

  function calculatePerfect() {
    let shots: any = [];
    let perfectPieData: any = [];
    for (const item of balls) {
      if (item?.performance === 'Perfect') {
        shots.push(item.shot);
      }
    }
    const shotFrequency: any = {};
    shots.forEach((shot: any) => {
      if (shotFrequency[shot]) {
        shotFrequency[shot]++;
      } else {
        shotFrequency[shot] = 1;
      }
    });

    const sortedShots = Object.keys(shotFrequency).sort(
      (a, b) => shotFrequency[b] - shotFrequency[a],
    );

    const topShots = sortedShots.slice(0, 5);

    const perfectShots = shots.length;
    perfectPieData = topShots.map(shot => 
      ({
      x: `${shot} (${shotFrequency[shot]})`,
      y: ((shotFrequency[shot] / perfectShots) * 100).toFixed(0) + ' %',
    })
    );
    return {perfectPieData, perfectShots};
  }

  function calculateWorst() {
    let shots: any = [];
    let worstPieChart: any = [];
    for (const item of balls) {
      if (item?.performance === 'Bad') {
        shots.push(item.shot);
      }
    }
    const shotFrequency: any = {};
    shots.forEach((shot: any) => {
      if (shotFrequency[shot]) {
        shotFrequency[shot]++;
      } else {
        shotFrequency[shot] = 1;
      }
    });

    const sortedShots = Object.keys(shotFrequency).sort(
      (a, b) => shotFrequency[b] - shotFrequency[a],
    );

    const topShots = sortedShots.slice(0, 5);

    const worstShots = shots.length;
    worstPieChart = topShots.map(shot => ({
      x: `${shot} (${shotFrequency[shot]})`,
      y: ((shotFrequency[shot] / worstShots) * 100).toFixed(0) + ' %',
    }));
    return {worstPieChart, worstShots};
  }

  const {perfectShots, perfectPieData} = calculatePerfect();
  const {worstPieChart, worstShots} = calculateWorst();

  function countShots() {
    const shotCounts: object | any = {
      'Straight Drive': 0,
      'Cover Drive': 0,
      'On Drive': 0,
      Cut: 0,
      'Square Cut': 0,
      Pull: 0,
      'Forward Defensive': 0,
      'Backfoot Defensive': 0,
      Flick: 0,
      'Leg Glance': 0,
      'Sweep Shot': 0,
      'Reverse Sweep': 0,
    };

    for (const item of balls) {
      const shot = item?.shot;
      if (shot && shotCounts.hasOwnProperty(shot)) {
        shotCounts[shot]++;
      }
    }
    return shotCounts;
  }

  const shotCounts = countShots();

  const frontFootData: graphData[] = [
    {x: 'Straight Drive', y: shotCounts['Straight Drive']},
    {x: 'Cover Drive', y: shotCounts['Cover Drive']},
    {x: 'On Drive', y: shotCounts['On Drive']},
    {x: 'Sweep Shot', y: shotCounts['Sweep Shot']},
    {x: 'Reverse Shot', y: shotCounts['Reverse Sweep']},
  ].filter(item => item.y !== 0);
  const backFootData: graphData[] = [
    {x: 'Cut', y: shotCounts['Cut']},
    {x: 'Square Cut', y: shotCounts['Square Cut']},
    {x: 'Pull', y: shotCounts['Pull']},
  ].filter(item => item.y !== 0);
  const defensiveData: graphData[] = [
    {x: 'Forward Defensive', y: shotCounts['Forward Defensive']},
    {x: 'Backfoot Defensive', y: shotCounts['Backfoot Defensive']},
  ].filter(item => item.y !== 0);
  const flickData: graphData[] = [
    {x: 'Flick', y: shotCounts['Flick']},
    {x: 'Leg Glance', y: shotCounts['Leg Glance']},
  ].filter(item => item.y !== 0);

  const shotType: string[] = [
    'On Drive',
    'Cover Drive',
    'Straight Drive',
    'Cut',
    'Square Cut',
    'Pull',
    'Forward Defensive',
    'Backfoot Defensive',
    'Flick',
    'Leg Glance',
    'Sweep Shot',
    'Reverse Sweep',
  ];

  return (
    <ScrollView style={styles.scrollStyle} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.cardView}>
          <View style={styles.innerCardView}>
            <Text style={styles.txt}>No. of balls Played</Text>
            <Text style={styles.txt1}>{balls.length}</Text>
          </View>
          <View style={styles.innerCardView}>
            <Text style={styles.txt}>Missed Balls</Text>
            <Text style={styles.txt1}>{countMissBalls(balls)}</Text>
          </View>
          <View style={[styles.innerCardView, {borderBottomWidth: 0}]}>
            <Text style={styles.txt}>Time Taken</Text>
            <Text style={styles.txt1}>
              {data?.sessionTime ? data?.sessionTime : '00:00:00'}
            </Text>
          </View>
        </View>
        <View style={styles.overviewChartsView}>
          <View style={styles.insideOverviewChartsView}>
            <Text style={styles.txt2}>Shots</Text>
            <DropDown select={shot} setSelect={setShot} type={'batting'} />
          </View>
          <View style={styles.chartView}>
            <VictoryChart
              domainPadding={{x: 30}}
              height={height / 3.7}
              width={width / 1.02}>
              <VictoryBar
                data={
                  shot == 'front'
                    ? frontFootData
                    : shot == 'back'
                    ? backFootData
                    : shot == 'defensive'
                    ? defensiveData
                    : shot == 'flick'
                    ? flickData
                    : []
                }
                style={{
                  data: {
                    fill: ({datum}) => colorMapping[datum.x] || '#EFAE06',
                  },
                }}
              />
              <VictoryAxis
                style={{
                  tickLabels: {
                    fill: 'black',
                    angle: 10,
                    fontSize: adjust(10),
                    fontFamily: FONT_FAMILIES.WORKSANS,
                  },
                }}
              />
              <VictoryAxis dependentAxis={true} />
            </VictoryChart>
          </View>
        </View>
        <View style={styles.topChartsView}>
          <View style={styles.insideTopChartsView}>
            <Text style={styles.txt2}>Top 5 Best Shots</Text>
          </View>
          <Text style={styles.totalBallsTxt}>Total Balls</Text>
          <Text style={styles.totalBallsTxt}>{perfectShots}</Text>
          <View style={styles.pieView}>
            <VictoryPie
              data={perfectPieData}
              colorScale={[...COLORS.PERFECT_COLOR].reverse()}
              width={width / 1.1}
              height={height / 7.3}
              padding={0}
              labels={({datum}) => null}
              labelRadius={({innerRadius}: any) => innerRadius + 35}
              innerRadius={35}
            />
            <FlatList
              data={perfectPieData}
              renderItem={item => renderTopDisplay(item, 'perfect')}
              showsVerticalScrollIndicator={false}
              style={styles.flatListStyle}
            />
          </View>
        </View>
        <View style={styles.topChartsView}>
          <View style={styles.insideTopChartsView}>
            <Text style={styles.txt2}>Worst Shots</Text>
          </View>
          <Text style={styles.totalBallsTxt}>Total Balls</Text>
          <Text style={styles.totalBallsTxt}>{worstShots}</Text>
          <View style={styles.pieView}>
            <VictoryPie
              data={worstPieChart}
              colorScale={[...COLORS.WORST_COLOR].reverse()}
              width={width / 1.1}
              height={height / 7.3}
              padding={0}
              labels={({datum}) => null}
              labelRadius={({innerRadius}: any) => innerRadius + 35}
              innerRadius={35}
            />
            <FlatList
              data={worstPieChart}
              renderItem={item => renderTopDisplay(item, 'worst')}
              showsVerticalScrollIndicator={false}
              style={styles.flatListStyle}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default BattingDetails;

const styles = StyleSheet.create({
  container: {
    margin: adjust(15),
  },
  cardView: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    height: adjust(110),
  },
  innerCardView: {
    flexDirection: 'row',
    height: adjust(35),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: adjust(15),
    paddingRight: adjust(15),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY,
  },
  txt: {
    fontSize: adjust(10),
    fontFamily: FONT_FAMILIES.WORKSANS,
    color: COLORS.BLACK,
    fontWeight: '400',
  },
  txt1: {
    fontSize: adjust(10),
    fontFamily: FONT_FAMILIES.WORKSANS_SEMIBOLD,
    color: COLORS.BLACK,
    fontWeight: '400',
  },
  txt2: {
    fontSize: adjust(12),
    fontFamily: FONT_FAMILIES.WORKSANS_SEMIBOLD,
    color: COLORS.BLACK,
    fontWeight: '400',
  },
  startContainerStyle: {
    height: adjust(60),
    justifyContent: 'center',
    alignSelf: 'center',
    marginLeft: adjust(30),
  },
  startStyle: {
    width: '90%',
  },
  overviewChartsView: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    marginVertical: adjust(10),
  },
  topChartsView: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    marginVertical: adjust(10),
  },
  insideOverviewChartsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: adjust(15),
  },
  insideTopChartsView: {
    margin: adjust(15),
  },
  scrollStyle: {
    height: Platform.OS === 'android' ? adjust(475) : adjust(405),
  },
  chartView: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
  },
  pieView: {
    flex: 1,
    marginTop: adjust(5),
  },
  renderView: {
    flexDirection: 'row',
    height: adjust(25),
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY,
    justifyContent: 'space-between',
  },
  dotView: {
    borderRadius: 100 / 2,
    height: adjust(10),
    width: adjust(10),
  },
  renderText: {
    fontSize: adjust(10),
    fontFamily: FONT_FAMILIES.WORKSANS,
    color: COLORS.BLACK,
    fontWeight: '400',
  },
  renderView1: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: adjust(10),
    padding:'1%'
  },
  renderView2: {
    width: '15%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: adjust(10),
  },
  totalBallsTxt: {
    fontSize: adjust(15),
    textAlign: 'center',
    fontFamily: FONT_FAMILIES.WORKSANS_SEMIBOLD,
    fontWeight: '400',
    color: COLORS.BLACK,
  },
  flatListStyle: {
    marginVertical: adjust(10),
  },
});
