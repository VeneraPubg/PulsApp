import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Svg, {
  Circle,
  Path,
  Rect,
  Line,
  Polyline,
  G,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

import { Colors } from './src/theme';

import HomeScreen from './src/screens/HomeScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import WorkoutDetailScreen from './src/screens/WorkoutDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function WorkoutStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="WorkoutList" component={WorkoutScreen} />
      <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'Workouts') iconName = 'fitness';
            else if (route.name === 'Progress') iconName = 'chart';
            else if (route.name === 'Profile') iconName = 'user';
            return (
              <SVGIcon name={iconName} focused={focused} size={size} color={color} />
            );
          },
          tabBarActiveTintColor: Colors.green,
          tabBarInactiveTintColor: Colors.gray,
          tabBarStyle: {
            backgroundColor: Colors.surface,
            borderTopColor: Colors.border,
            borderTopWidth: 1,
            height: 64,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            color: Colors.gray,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Workouts" component={WorkoutStack} />
        <Tab.Screen name="Progress" component={ProgressScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function SVGIcon({ name, size = 24, color }) {
  const stroke = color || Colors.white;
  const width = size;
  const height = size;

  const home = (
    <>
      <Line x1={width * 0.5} y1={height * 0.2} x2={width * 0.5} y2={height * 0.8} stroke={stroke} strokeWidth={2.2} strokeLinecap="round" />
      <Polyline points={[width * 0.2, height * 0.5, width * 0.5, height * 0.2, width * 0.8, height * 0.5].join(' ')} stroke={stroke} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );

  const fitness = (
    <>
      <Circle cx={width * 0.5} cy={height * 0.5} r={height * 0.35} stroke={stroke} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <Line x1={width * 0.5} y1={height * 0.18} x2={width * 0.5} y2={height * 0.5} stroke={stroke} strokeWidth={2.2} strokeLinecap="round" />
      <Polyline points={[width * 0.2, height * 0.82, width * 0.5, height * 0.5, width * 0.8, height * 0.82].join(' ')} stroke={stroke} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );

  const chart = (
    <>
      <Polyline points={[width * 0.15, height * 0.55, width * 0.35, height * 0.3, width * 0.55, height * 0.5, width * 0.75, height * 0.2, width * 0.9, height * 0.4].join(' ')} stroke={stroke} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={width * 0.35} cy={height * 0.3} r={2.4} fill={stroke} />
      <Circle cx={width * 0.75} cy={height * 0.2} r={2.4} fill={stroke} />
    </>
  );

  const user = (
    <>
      <Circle cx={width * 0.5} cy={height * 0.35} r={height * 0.25} stroke={stroke} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <Path d={`M ${width * 0.18} ${height * 0.72} Q ${width * 0.5} ${height * 0.72} ${width * 0.82} ${height * 0.72}`} stroke={stroke} strokeWidth={2.2} fill="none" strokeLinecap="round" />
    </>
  );

  const icons = { home, fitness, chart, user };
  return <Svg width={width} height={height}>{icons[name]}</Svg>;
}
