import React, { useState, useEffect, useContext, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  LogBox,
  ScrollView,
  useWindowDimensions,
} from 'react-native';

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state.']);

import { Colors } from './src/theme';
import { UserContext } from './src/context';
import { loadSession } from './src/userStore';
import Icon from './src/components/Icon';

import HomeScreen from './src/screens/HomeScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ProfileEditScreen from './src/screens/ProfileEditScreen';
import WorkoutDetailScreen from './src/screens/WorkoutDetailScreen';
import PlanScreen from './src/screens/PlanScreen';
import AuthScreen from './src/screens/AuthScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';

const Stack = createStackNavigator();

const TABS = [
  { name: 'Home', label: 'Главная', icon: 'home' },
  { name: 'Workouts', label: 'Тренировки', icon: 'workouts' },
  { name: 'Progress', label: 'Прогресс', icon: 'chart' },
  { name: 'Profile', label: 'Профиль', icon: 'profile' },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const { setUser: setContextUser } = useContext(UserContext);

  useEffect(() => {
    loadSession().then((u) => {
      setUser(u);
      setBooting(false);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <UserContext.Provider value={{ user, setUser }}>
        {booting ? (
          <SplashScreen />
        ) : user ? (
          user.goal ? (
            <AppNavigator />
          ) : (
            <OnboardingScreen user={user} onComplete={(u) => setUser(u)} />
          )
        ) : (
          <AuthNavigator onAuth={setUser} />
        )}
      </UserContext.Provider>
    </SafeAreaProvider>
  );
}

function SplashScreen() {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: Colors.bg }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 32, fontWeight: '900', color: Colors.white, letterSpacing: 1 }}>
          PULSE
        </Text>
      </View>
    </SafeAreaView>
  );
}

function AuthNavigator({ onAuth }) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth">
          {(props) => <AuthScreen {...props} onAuth={onAuth} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Корневой стек: «Main» = пейджер вкладок + нижний таб-бар,
// детали (WorkoutDetail/ProfileEdit) открываются поверх фулл-скрином.
function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main">
          {(props) => <MainScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
        <Stack.Screen name="Plan" component={PlanScreen} />
        <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// «Главный» экран: горизонтальный пейджер вкладок со свайпом + нижний таб-бар.
function MainScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);

  const pages = [
    <HomeScreen key="home" navigation={navigation} />,
    <WorkoutScreen key="workouts" navigation={navigation} />,
    <ProgressScreen key="progress" navigation={navigation} />,
    <ProfileScreen key="profile" navigation={navigation} />,
  ];

  const indexFromOffset = (x) =>
    Math.max(0, Math.min(TABS.length - 1, Math.round(x / width)));

  const onMomentumScrollEnd = (e) => setIndex(indexFromOffset(e.nativeEvent.contentOffset.x));
  const onScrollEndDrag = (e) => setIndex(indexFromOffset(e.nativeEvent.contentOffset.x));

  const jumpTo = (i) => {
    scrollRef.current?.scrollTo({ x: i * width, animated: true });
  };

  return (
    <View style={styles.main}>
      <ScrollView
        ref={scrollRef}
        style={styles.pager}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollEndDrag={onScrollEndDrag}
      >
        {pages.map((page, i) => (
          <View key={i} style={{ width }}>
            {page}
          </View>
        ))}
      </ScrollView>
      <BottomTabBar index={index} onTab={jumpTo} />
    </View>
  );
}

function BottomTabBar({ index, onTab }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.tabRow}>
        {TABS.map((t, i) => {
          const active = index === i;
          return (
            <TouchableOpacity
              key={t.name}
              style={styles.tabItem}
              activeOpacity={0.9}
              onPress={() => onTab(i)}
            >
              <Icon name={t.icon} size={24} color={active ? Colors.green : '#9A9A9A'} />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = {
  main: { flex: 1, backgroundColor: Colors.bg },
  pager: { flex: 1 },
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  tabRow: { flexDirection: 'row' },
  tabItem: { flex: 1, alignItems: 'center', paddingTop: 10, paddingBottom: 4 },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9A9A9A',
    marginTop: 3,
  },
  tabLabelActive: {
    color: Colors.green,
    fontWeight: '800',
  },
};
