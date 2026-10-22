import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import Svg, {
  Rect,
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { Colors, radius } from '../theme';
import { dateKey, addDays } from '../data';
import * as store from '../store';
import Icon from '../components/Icon';

const TABS = ['Неделя', 'Месяц', 'Год', 'Всё время'];
const WINDOW_DAYS = [7, 30, 365, 9999];
const PERIOD_WORD = ['за неделю', 'за месяц', 'за год', 'за всё время'];
const MONTHS_SHORT_CAP = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
const MONTHS_ACC = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const DAY_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function ruNum(v, digits = 1) {
  return v.toFixed(digits).replace('.', ',');
}

function fmtTimePR(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function fmtDateFull(key) {
  if (!key) return '';
  const d = new Date(`${key}T12:00:00`);
  return `${d.getDate()} ${MONTHS_ACC[d.getMonth()]}`;
}

export default function ProgressScreen({ navigation }) {
  const data = store.useAppData();
  const [activeTab, setActiveTab] = useState(1);
  const [weightModal, setWeightModal] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [weightError, setWeightError] = useState('');

  const winDays = WINDOW_DAYS[activeTab];
  const now = new Date();
  const todayKey = dateKey(now);
  const fromKey = dateKey(addDays(now, -(winDays - 1)));
  const prevFromKey = dateKey(addDays(now, -(winDays * 2 - 1)));

  const sessions = data?.sessions || [];
  const weights = data?.weights || [];

  const inWin = sessions.filter((s) => s.date >= fromKey && s.date <= todayKey);
  const inPrev = sessions.filter((s) => s.date >= prevFromKey && s.date < fromKey);

  // ─── Вес тела ──────────────────────────────────────────────────────────────
  const weightsWin = weights.filter((w) => w.date >= fromKey && w.date <= todayKey);
  const lastWeight = weightsWin.length ? weightsWin[weightsWin.length - 1] : weights[weights.length - 1] || null;
  const weightPoints = weightsWin.map((w) => w.kg);
  const weightLabels = weightsWin.map((w) => {
    const d = new Date(`${w.date}T12:00:00`);
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const weightDelta = weightsWin.length >= 2
    ? weightsWin[weightsWin.length - 1].kg - weightsWin[0].kg
    : null;

  // ─── Объём ─────────────────────────────────────────────────────────────────
  const volumeCur = inWin.reduce((acc, s) => acc + (s.volumeKg || 0), 0);
  const volumePrev = inPrev.reduce((acc, s) => acc + (s.volumeKg || 0), 0);
  const volumeDeltaPct = volumePrev > 0
    ? Math.round(((volumeCur - volumePrev) / volumePrev) * 100)
    : null;

  const bins = buildVolumeBins(inWin, activeTab, now);

  // ─── Рекорды ──────────────────────────────────────────────────────────────
  const prs = store.getPRs(data);

  const openWeightModal = () => {
    setWeightInput(lastWeight ? String(lastWeight.kg).replace('.', ',') : '');
    setWeightError('');
    setWeightModal(true);
  };

  const submitWeight = () => {
    const v = parseFloat(weightInput.replace(',', '.'));
    if (!v || v < 30 || v > 250 || Number.isNaN(v)) {
      setWeightError('Введите вес 30–250 кг');
      return;
    }
    store.addWeight(Math.round(v * 10) / 10);
    setWeightModal(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerSub}>КАЖДОЕ УСИЛИЕ В СЧЁТ</Text>
          <TouchableOpacity style={styles.calendar} onPress={() => {}}>
            <Icon name="calendar" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>ТВОЙ ПРОГРЕСС.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Периоды */}
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
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>ВЕС ТЕЛА</Text>
            <TouchableOpacity style={styles.addWeightBtn} onPress={openWeightModal} activeOpacity={0.8}>
              <Icon name="edit" size={13} color={Colors.green} />
              <Text style={styles.addWeightText}>ВЕС</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.weightBig}>
            <Text style={styles.weightValue}>
              {lastWeight ? ruNum(lastWeight.kg) : '—'}
            </Text>
            <Text style={styles.weightUnit}>кг</Text>
          </View>
          {weightDelta != null && (
            <View style={styles.deltaRowAbs}>
              <View style={styles.deltaRow}>
                <Icon
                  name={weightDelta <= 0 ? 'arrowDownRight' : 'arrowUpRight'}
                  size={12}
                  color={weightDelta <= 0 ? Colors.green : Colors.danger}
                />
                <Text style={styles.cardDelta}>
                  {`${weightDelta <= 0 ? '−' : '+'}${ruNum(Math.abs(weightDelta))} кг ${PERIOD_WORD[activeTab]}`}
                </Text>
              </View>
            </View>
          )}
          {weightPoints.length >= 2 ? (
            <WeightChart points={weightPoints} labels={weightLabels} />
          ) : (
            <Text style={styles.emptyNote}>
              {weights.length === 0
                ? 'Запишите первый вес — график появится здесь'
                : 'Нужно минимум 2 измерения за период'}
            </Text>
          )}
        </View>

        {/* Объём тренировок */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>ОБЪЁМ ТРЕНИРОВОК</Text>
            {volumeDeltaPct != null && (
              <View style={styles.deltaRow}>
                <Icon
                  name={volumeDeltaPct >= 0 ? 'arrowUpRight' : 'arrowDownRight'}
                  size={12}
                  color={volumeDeltaPct >= 0 ? Colors.green : Colors.danger}
                />
                <Text style={styles.cardDelta}>
                  {`${volumeDeltaPct >= 0 ? '+' : '−'}${Math.abs(volumeDeltaPct)}%`}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.volumeBig}>
            <Text style={styles.weightValue}>
              {volumeCur >= 1000 ? ruNum(volumeCur / 1000) : String(volumeCur)}
            </Text>
            <Text style={styles.weightUnit}>{volumeCur >= 1000 ? 'т' : 'кг'}</Text>
          </View>
          <View style={styles.volumeSub}>
            <Text style={styles.volumeSubText}>
              {`Поднято веса за ${inWin.length} ${pluralTrain(inWin.length)} ${PERIOD_WORD[activeTab]}`}
            </Text>
          </View>
          {volumeCur > 0 ? (
            <VolumeChart values={bins.values} labels={bins.labels} />
          ) : (
            <Text style={styles.emptyNote}>Нет тренировок за период</Text>
          )}
        </View>

        {/* Личные рекорды */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>ЛИЧНЫЕ РЕКОРДЫ</Text>
            <Icon name="trophy" size={18} color={Colors.green} />
          </View>
          {prs.length === 0 ? (
            <Text style={styles.emptyNote}>Рекорды появятся после первых тренировок</Text>
          ) : (
            <View style={styles.recordsList}>
              {prs.map((r) => (
                <View key={r.name} style={[styles.recordItem, r.isNew && styles.recordItemNew]}>
                  <View style={styles.recordIcon}>
                    <Icon name={r.icon} size={16} color={r.isNew ? Colors.green : Colors.gray} />
                  </View>
                  <View style={styles.recordInfo}>
                    <Text style={[styles.recordTitle, r.isNew && styles.recordNewTitle]}>{r.name}</Text>
                    <Text style={styles.recordSub}>
                      {`${
                        r.isNew ? 'НОВЫЙ РЕКОРД · ' : ''
                      }${fmtDateFull(r.date)}`}
                    </Text>
                  </View>
                  <Text style={[styles.recordValue, r.isNew && styles.recordValueNew]}>
                    {r.kind === 'weight' ? `${ruNum(r.value)} кг` : fmtTimePR(r.value)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Модалка ввода веса */}
      <Modal visible={weightModal} transparent animationType="fade" onRequestClose={() => setWeightModal(false)}>
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>ВЕС ТЕЛА СЕГОДНЯ</Text>
            <TextInput
              style={styles.modalInput}
              value={weightInput}
              onChangeText={(t) => {
                setWeightInput(t);
                setWeightError('');
              }}
              keyboardType="numeric"
              placeholder="Например: 78,4"
              placeholderTextColor={Colors.grayDark}
              maxLength={6}
            />
            {!!weightError && <Text style={styles.modalError}>{weightError}</Text>}
            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setWeightModal(false)}>
                <Text style={styles.modalBtnText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSave} onPress={submitWeight}>
                <Text style={styles.modalBtnSaveText}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Бины объёма: значения по бинам выбранного периода ───────────────────────
function buildVolumeBins(winSessions, activeTab, now) {
  const values = [];
  const labels = [];

  if (activeTab === 0) {
    // Неделя: по дням, Пн..Вс
    const monday = addDays(now, -((now.getDay() + 6) % 7));
    for (let i = 0; i < 7; i++) {
      const key = dateKey(addDays(monday, i));
      const kg = winSessions
        .filter((s) => s.date === key)
        .reduce((acc, s) => acc + (s.volumeKg || 0), 0);
      values.push(kg);
      labels.push(DAY_SHORT[i]);
    }
  } else if (activeTab === 1) {
    // Месяц: по неделям Н1..Н5
    const monday0 = addDays(now, -((now.getDay() + 6) % 7) - 28);
    for (let i = 0; i < 5; i++) {
      const from = dateKey(addDays(monday0, i * 7));
      const to = dateKey(addDays(monday0, i * 7 + 6));
      const kg = winSessions
        .filter((s) => s.date >= from && s.date <= to)
        .reduce((acc, s) => acc + (s.volumeKg || 0), 0);
      values.push(kg);
      labels.push(`Н${i + 1}`);
    }
  } else {
    // Год / Всё время: 12 последних месяцев
    const curM = now.getMonth();
    const monthsBackOf = (s) => {
      const d = new Date(`${s.date}T12:00:00`);
      return (curM - d.getMonth()) + (now.getFullYear() - d.getFullYear()) * 12;
    };
    for (let i = 11; i >= 0; i--) {
      const kg = winSessions
        .filter((s) => monthsBackOf(s) === i)
        .reduce((acc, s) => acc + (s.volumeKg || 0), 0);
      values.push(kg);
      labels.push(MONTHS_SHORT_CAP[(curM - i + 12) % 12]);
    }
  }

  return { values, labels };
}

function pluralTrain(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'тренировки';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'тренировок';
  return 'тренировок';
}

// ─── График веса (линейный) ───────────────────────────────────────────────────
function WeightChart({ points, labels }) {
  const chartW = 300;
  const padding = { left: 32, right: 16, top: 12, bottom: 24 };
  const chartWidth = chartW - padding.left - padding.right;
  const chartHeight = 150;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const stepX = chartWidth / Math.max(1, points.length - 1);
  const yOf = (p) => padding.top + chartHeight - ((p - min) / range) * (chartHeight - 24);
  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${padding.left + i * stepX} ${yOf(p)}`)
    .join(' ');

  return (
    <View style={styles.chartWrap}>
      <Svg width={chartW} height={chartHeight + 44}>
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
            cy={yOf(p)}
            r={4}
            fill={i === points.length - 1 ? Colors.green : Colors.surface2}
            stroke={Colors.green}
            strokeWidth={2.5}
          />
        ))}
        {labels.map((label, i) => (
          <SvgText
            key={`${label}-${i}`}
            x={padding.left + i * stepX}
            y={padding.top + chartHeight + 20}
            fontSize={9}
            fill={Colors.gray}
            textAnchor="middle"
          >
            {label}
          </SvgText>
        ))}
        <SvgText x={4} y={padding.top + 4} fontSize={10} fill={Colors.grayDark} fontWeight="700">
          {points[points.length - 1].toFixed(1)}
        </SvgText>
      </Svg>
    </View>
  );
}

// ─── Гистограмма объёма ───────────────────────────────────────────────────────
function VolumeChart({ values, labels }) {
  const chartW = 300;
  const padding = { left: 44, right: 16, top: 10, bottom: 22 };
  const chartWidth = chartW - padding.left - padding.right;
  const chartHeight = 120;
  const inTonnes = Math.max(...values) >= 1000;

  const max = Math.max(...values, 1);
  const gap = 10;
  const barWidth = (chartWidth - gap * (values.length - 1)) / values.length;

  return (
    <View style={styles.chartWrap}>
      <Svg width={chartW} height={chartHeight + 34}>
        {values.map((v, i) => {
          const barHeight = (v / max) * (chartHeight - 12);
          const x = padding.left + i * (barWidth + gap);
          const y = padding.top + chartHeight - barHeight;
          const isLast = i === values.length - 1;
          const label = inTonnes ? `${(v / 1000).toFixed(1).replace('.', ',')}` : String(Math.round(v));
          return (
            <React.Fragment key={i}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(2, barHeight)}
                rx={5}
                fill={isLast ? Colors.green : Colors.surface2}
              />
              {barHeight > 18 && (
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 4}
                  fontSize={8}
                  fill={Colors.gray}
                  textAnchor="middle"
                >
                  {label}
                </SvgText>
              )}
              <SvgText
                x={x + barWidth / 2}
                y={padding.top + chartHeight + 16}
                fontSize={10}
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginTop: 6,
  },
  calendar: { padding: 6 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  tabsWrap: { flexDirection: 'row', marginBottom: 14 },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
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
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.white,
  },
  addWeightBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addWeightText: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.green,
    letterSpacing: 0.5,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  weightBig: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
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
    paddingBottom: 6,
  },
  deltaRowAbs: { marginTop: 2 },
  cardDelta: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.green,
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  emptyNote: {
    fontSize: 13,
    color: Colors.gray,
    textAlign: 'center',
    paddingVertical: 30,
  },
  volumeBig: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  volumeSub: { marginTop: 4 },
  volumeSubText: {
    fontSize: 13,
    color: Colors.gray,
  },
  chartWrap: { alignItems: 'center', marginTop: 8 },
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
  recordItemNew: {
    backgroundColor: Colors.greenDim,
    borderColor: Colors.green,
  },
  recordIcon: {
    width: 32,
    alignItems: 'center',
  },
  recordInfo: { flex: 1, marginHorizontal: 10 },
  recordTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.white,
  },
  recordNewTitle: { color: Colors.green },
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
  recordValueNew: { color: Colors.green },
  modalWrap: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: radius + 4,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
  },
  modalTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 1,
    textAlign: 'center',
  },
  modalInput: {
    marginTop: 14,
    backgroundColor: Colors.surface2,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.white,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    paddingVertical: 12,
  },
  modalError: {
    fontSize: 11,
    color: Colors.danger,
    textAlign: 'center',
    marginTop: 6,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  modalBtn: {
    flex: 1,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 13,
    alignItems: 'center',
  },
  modalBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.gray,
  },
  modalBtnSave: {
    flex: 1,
    borderRadius: radius,
    backgroundColor: Colors.green,
    paddingVertical: 13,
    alignItems: 'center',
  },
  modalBtnSaveText: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.bg,
  },
};
