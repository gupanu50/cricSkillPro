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
  const [shot, setShot] = useState<string>('fast');
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
    for (const ballType of ballTypes) {
      newColorMapping[ballType] = getRandomColor();
    }
    setColorMapping(newColorMapping);
  }, []);

  function calculatePerfect() {
    let shots: any = [];
    let perfectPieData: any = [];
    for (const item of balls) {
      if (item?.performance === 'Perfect') {
        shots.push(item.ballType);
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
    perfectPieData = topShots.map(shot => ({
      x: `${shot} (${shotFrequency[shot]})`,
      y: ((shotFrequency[shot] / perfectShots) * 100).toFixed(0) + ' %',
    }));
    return {perfectPieData, perfectShots};
  }

  function calculateWorst() {
    let shots: any = [];
    let worstPieChart: any = [];
    for (const item of balls) {
      if (item?.performance === 'Bad') {
        shots.push(item.ballType);
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

  function countBalls(type: string) {
    let count = 0;
    for (const item of balls) {
      if (item?.analysis === type) {
        count++;
      }
    }
    return count;
  }

  function countShots() {
    const shotCounts: object | any = {
      FastBall: 0,
      Yorker: 0,
      Bouncer: 0,
      InSwinger: 0,
      OutSwinger: 0,
      OffSpin: 0,
      LegSpin: 0,
      TopSpin: 0,
      Googly: 0,
      Slider: 0,
      ArmBall: 0,
      Flipper: 0,
      SlowerBall: 0,
      LegCutter: 0,
      OffCutter: 0,
      CrossSeam: 0,
    };

    for (const item of balls) {
      const ballType = item?.ballType;
      if (ballType && shotCounts.hasOwnProperty(ballType)) {
        shotCounts[ballType]++;
      }
    }
    return shotCounts;
  }

  const shotCounts = countShots();

  const fastData: graphData[] = [
    {x: 'Fast Ball', y: shotCounts['FastBall']},
    {x: 'Yorker', y: shotCounts['Yorker']},
    {x: 'Bouncer', y: shotCounts['Bouncer']},
    {x: 'In Swinger', y: shotCounts['InSwinger']},
    {x: 'Out Swinger', y: shotCounts['OutSwinger']},
  ].filter(item => item.y !== 0);
  const spinData: graphData[] = [
    {x: 'Off Spin', y: shotCounts['OffSpin']},
    {x: 'Leg Spin', y: shotCounts['LegSpin']},
    {x: 'Top Spin', y: shotCounts['TopSpin']},
    {x: 'Googly', y: shotCounts['Googly']},
    {x: 'Slider', y: shotCounts['Slider']},
    {x: 'Arm Ball', y: shotCounts['ArmBall']},
    {x: 'Flipper', y: shotCounts['Flipper']},
  ].filter(item => item.y !== 0);
  const mediumData: graphData[] = [
    {x: 'Slower Ball', y: shotCounts['SlowerBall']},
    {x: 'Leg Cutter', y: shotCounts['LegCutter']},
    {x: 'Off Cutter', y: shotCounts['OffCutter']},
    {x: 'Cross Seam', y: shotCounts['CrossSeam']},
  ].filter(item => item.y !== 0);

  const ballTypes: string[] = [
    'Fast Ball',
    'Yorker',
    'Bouncer',
    'In Swinger',
    'Out Swinger',
    'Off Spin',
    'Leg Spin',
    'Top Spin',
    'Googly',
    'Slider',
    'Arm Ball',
    'Flipper',
    'Slower Ball',
    'Leg Cutter',
    'Off Cutter',
    'Cross Seam',
  ];

  return (
    <ScrollView style={styles.scrollStyle} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.cardView}>
          <View style={styles.innerCardView}>
            <Text style={styles.txt}>No. of balls bowled</Text>
            <Text style={styles.txt1}>{balls.length}</Text>
          </View>
          <View style={styles.innerCardView}>
            <Text style={styles.txt}>Wickets</Text>
            <Text style={styles.txt1}>{countBalls('wicket')}</Text>
          </View>
          <View style={styles.innerCardView}>
            <Text style={styles.txt}>Missed Balls</Text>
            <Text style={styles.txt1}>{countBalls('missBall')}</Text>
          </View>
          <View style={styles.innerCardView}>
            <Text style={styles.txt}>Wide Balls</Text>
            <Text style={styles.txt1}>{countBalls('wide')}</Text>
          </View>
          <View style={styles.innerCardView}>
            <Text style={styles.txt}>No Balls</Text>
            <Text style={styles.txt1}>{countBalls('noBall')}</Text>
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
            <Text style={styles.txt2}>Bowling Overview</Text>
            <DropDown select={shot} setSelect={setShot} type={'balling'} />
          </View>
          <View style={styles.chartView}>
            <VictoryChart
              domainPadding={{x: 30}}
              height={height / 3.7}
              width={width / 1.02}>
              <VictoryBar
                data={
                  shot == 'fast'
                    ? fastData
                    : shot == 'spin'
                    ? spinData
                    : shot == 'medium'
                    ? mediumData
                    : []
                }
                style={{
                  data: {
                    fill: ({datum}) => colorMapping[datum.x],
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
            <Text style={styles.txt2}>Top 5 Best Deliveries</Text>
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
            <Text style={styles.txt2}>Worst Deliveries</Text>
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
