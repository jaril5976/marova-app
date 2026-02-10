import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Grid, Tag, User, MessageCircle } from 'lucide-react-native';
import { HomeScreen } from '../screens/HomeScreen';
import {
    CategoriesScreen,
    AccountScreen,
    ChatScreen
} from '../screens/PlaceholderScreens';
import { COLORS } from '../theme/theme';
import { DealScreen } from '../screens/DealScreen';

const Tab = createBottomTabNavigator();

export const RootNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#E5E5EA',
                    height: 80,
                    paddingBottom: 30,
                    paddingTop: 5,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                },
                tabBarActiveTintColor: COLORS.text,
                tabBarInactiveTintColor: COLORS.secondary,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color }) => <Home color={color} size={24} />,
                }}
            />
            <Tab.Screen
                name="Categories"
                component={CategoriesScreen}
                options={{
                    tabBarIcon: ({ color }) => <Grid color={color} size={24} />,
                }}
            />
            <Tab.Screen
                name="Deals"
                component={DealScreen}
                options={{
                    tabBarIcon: ({ color }) => <Tag color={color} size={24} />,
                }}
            />
            <Tab.Screen
                name="Account"
                component={AccountScreen}
                options={{
                    tabBarIcon: ({ color }) => <User color={color} size={24} />,
                }}
            />
            <Tab.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                    tabBarIcon: ({ color }) => <MessageCircle color={color} size={24} />,
                }}
            />
        </Tab.Navigator>
    );
};
