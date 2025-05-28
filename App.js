import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './src/Home';
import Settings from './src/Settings';
import MaterialCommunityIcons from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused}) => {
            if (route.name === 'Home') {
              return (
                <MaterialCommunityIcons
                  name="home"
                  size={20}
                  color={focused ? '#6347EB' : '#000'}
                />
              );
            } else if (route.name === 'Settings') {
              return (
                <Ionicons
                  name="settings-sharp"
                  size={20}
                  color={focused ? '#6347EB' : '#000'}
                />
              );
            }
          },
          tabBarActiveTintColor: '#6347EB',
          tabBarInactiveTintColor: 'black',
        })}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
