import React, { useState } from 'react';
import {
  StatusBar,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Svg, { Rect, Path, Circle, Line, Text as SvgText } from 'react-native-svg';

import { Colors, radius } from '../theme';
import { RECORDS } from '../data';

const { width } = Dimensions.get('window');

const TABS = ['Неделя', 'Месяц', 'Год', 'Все время'];

const WEIGHT_POINTS = [82, 80, 79, 78.5, 79, 78, 77.5, 78.4];
const WEIGHT_LABELS = ['21 сен', '07 окт', '10 окт', '14 окт', '17 окт', '20 окт', '24 окт', '28 окт'];

const VOLUME_LABELS = ['Н1', 'Н2', 'Н3', 'Н4'];
const VOLUME_VALUES = [7, 10, 12, 15];

export default function ProgressScreen() {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <View style={styles.header}>
        <Text style={styles.headerSub}>КАКОЕ УДОБИЕ В СЧЁТ</Text>
        <Text style={styles.headerTitle}>ТВОЙ ПРОГРЕСС.</Text>
        <TouchableOpacity style={styles.calendar} onPress={() => {}}>
          <Text style={styles.calendarIcon}>📅</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Тэбы */}
        <View style={styles.tabsWrap}>
          {TABS.map((t, i) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, activeTab === i && styles.tabActive]}
              onPress={() => setActiveTab(i)}
            >
              <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Вес тела */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>ВЕС ТЕЛА</Text>
            <Text style={styles.cardDelta}>↘ -1,6 кг за месяц</Text>
          </View>
          <View style={styles.weightBig}>
            <Text style={styles.weightValue}>78,4</Text>
            <Text style={styles.weightUnit}>кг</Text>
          </View>
          <WeightChart points={WEIGHT_POINTS} labels={WEIGHT_LABELS} />
        </View>

        {/* Объём тренировок */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>ОБЪЁМ ТРЕНИРОВОК</Text>
            <Text style={styles.cardDelta}>↗ +18%</Text>
          </View>
          <View style={styles.volumeBig}>
            <Text style={styles.weightValue}>12,8</Text>
            <Text style={styles.weightUnit}>т</Text>
          </View>
          <View style={styles.volumeSub}>
            Полноценных недель за 12 тренировок
          </View>
          <VolumeChart values={VOLUME_VALUES} labels={VOLUME_LABELS} />
        </View>

        {/* Личные рекорды */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>ЛИЧНЫЕ РЕКОРДЫ</Text>
            <Text style={styles.trophy}>🏆</Text>
          </View>
          <View style={styles.recordsList}>
            {RECORDS.map((r) => (
              <TouchableOpacity key={r.id} style={styles.recordItem} activeOpacity={0.9}>
                <View style={styles.recordIcon}>{r.icon}</View>
                <View style={styles.recordInfo}>
                  <Text style={styles.recordTitle}>{r.title}</Text>
                  <Text style={styles.recordSub}>{r.sub}</Text>
                </View>
                <Text style={styles.recordValue}>{r.value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function WeightChart({ points, labels }) {
  const padding = { left: 32, right: 16, top: 10, bottom: 24 };
  const chartWidth = width - 64 - padding.left - padding.right;
  const chartHeight = 170;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const stepX = chartWidth / (points.length - 1);
  const path = points.map((p, i) => {
    const x = padding.left + i * stepX;
    const y = padding.top + chartHeight - ((p - min) / range) * (chartHeight - 20);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <View style={styles.chartWrap}>
      <Svg width={width - 64} height={chartHeight + 40}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={Colors.green} stopOpacity="0.35" />
            <Stop offset="100%" stopColor={Colors.green} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Path
          d={`M ${padding.left} ${padding.top + chartHeight} ${path} L ${padding.left + (points.length - 1) * stepX} ${padding.top + chartHeight} Z`}
          fill="url(#grad)"
        />
        <Path d={path} stroke={Colors.green} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <Circle
            key={i}
            cx={padding.left + i * stepX}
            cy={padding.top + chartHeight - ((p - min) / range) * (chartHeight - 20)}
            r={4}
            fill={i === points.length - 1 ? Colors.green : Colors.surface2}
            stroke={Colors.green}
            strokeWidth={2.5}
          />
        ))}
        {labels.map((label, i) => (
          <SvgText
            key={label}
            x={padding.left + i * stepX}
            y={padding.top + chartHeight + 20}
            fontSize={10}
            fill={Colors.gray}
            textAnchor="middle"
          >
            {label}
          </SvgText>
        ))}
        <SvgText
          x={padding.left}
          y={padding.top}
          fontSize={11}
          fill={Colors.grayDark}
          fontWeight="700"
        >
          {max.toFixed(1)}
        </SvgText>
        <SvgText
          x={padding.left}
          y={padding.top + chartHeight - 6}
          fontSize={11}
          fill={Colors.grayDark}
          fontWeight="700"
        >
          {min.toFixed(1)}
        </SvgText>
      </Svg>
    </View>
  );
}

function VolumeChart({ values, labels }) {
  const padding = { left: 44, right: 16, top: 8, bottom: 22 };
  const chartWidth = width - 64 - padding.left - padding.right;
  const chartHeight = 130;

  const max = Math.max(...values);
  const gap = 14;
  const barWidth = (chartWidth - gap * (values.length - 1)) / values.length;

  return (
    <View style={styles.chartWrap}>
      <Svg width={width - 64} height={chartHeight + 36}>
        {values.map((v, i) => {
          const barHeight = (v / max) * (chartHeight - 16);
          const x = padding.left + i * (barWidth + gap);
          const y = padding.top + chartHeight - barHeight;
          const isLast = i === values.length - 1;
          return (
            <React.Fragment key={i}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={6}
                fill={isLast ? Colors.green : Colors.surface2}
              />
              <SvgText
                x={x + barWidth / 2}
                y={padding.top + chartHeight + 18}
                fontSize={11}
                fill={Colors.grayDark}
                fontWeight="700"
                textAnchor="middle"
              >
                {labels[i]}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = {
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerSub: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.gray,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  calendar: { padding: 6 },
  calendarIcon: { fontSize: 22 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  tabsWrap: { flexDirection: 'row', marginBottom: 14 },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 10,
    backgroundColor: Colors.surface2,
  },
  tabActive: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.gray,
  },
  tabTextActive: { color: Colors.bg },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: radius,
    padding: 18,
    marginBottom: 16,
  },
  cardHeader: { marginBottom: 14 },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 2,
  },
  cardDelta: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.green,
  },
  weightBig: { marginBottom: 10 },
  weightValue: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: -1,
  },
  weightUnit: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.gray,
  },
  volumeBig: { marginBottom: 6 },
  volumeSub: {
    fontSize: 13,
    color: Colors.gray,
    marginBottom: 14,
  },
  chartWrap: { marginBottom: 4 },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  trophy: { fontSize: 16 },
  recordsList: { gap: 10 },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface2,
    borderRadius: radius,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recordIcon: { fontSize: 20, width: 32, textAlign: 'center' },
  recordInfo: { flex: 1, marginHorizontal: 10 },
  recordTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.white,
  },
  recordSub: {
    fontSize: 11,
    color: Colors.gray,
    marginTop: 2,
  },
  recordValue: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.white,
  },
};
