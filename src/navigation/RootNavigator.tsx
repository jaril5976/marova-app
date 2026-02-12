import { View, StyleSheet, Dimensions, Platform, TouchableOpacity, Text, Animated } from 'react-native';
import { useRef, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { Home, Grid, Tag, User, MessageCircle } from 'lucide-react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { COLORS } from '../theme/theme';
import { DealsScreen } from '../screens/DealsScreen';
import { CategoriesScreen } from '../screens/CategoriesScreen';
import { AccountScreen } from '../screens/AccountScreen';
import { ChatScreen } from '../screens/ChatScreen';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
    const { width } = Dimensions.get('window');
    const tabWidth = width / state.routes.length;
    const translateX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(translateX, {
            toValue: state.index * tabWidth,
            useNativeDriver: true,
            bounciness: 5,
            speed: 10,
        }).start();
    }, [state.index, tabWidth]);

    return (
        <View style={styles.tabBarContainer}>
            <Animated.View
                style={[
                    styles.indicatorContainer,
                    {
                        width: tabWidth,
                        transform: [{ translateX }],
                    },
                ]}
            >
                <View style={styles.indicatorCircle} />
            </Animated.View>
            <View style={styles.tabItemsContainer}>
                {state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const IconComponent = options.tabBarIcon;

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={onPress}
                            activeOpacity={0.7}
                            style={styles.tabItem}
                        >
                            <View style={styles.iconWrapper}>
                                {IconComponent && (
                                    typeof IconComponent === 'function'
                                        ? IconComponent({ color: isFocused ? '#000' : '#A69B8F', focused: isFocused, size: 24 })
                                        : <IconComponent color={isFocused ? '#000' : '#A69B8F'} size={24} />
                                )}
                            </View>
                            {!isFocused && (
                                <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                                    {label}
                                </Text>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export const RootNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                animation: 'fade',
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: (props) => <Home {...props} />,
                }}
            />
            <Tab.Screen
                name="Categories"
                component={CategoriesScreen}
                options={{
                    tabBarIcon: (props) => <Grid {...props} />,
                }}
            />
            <Tab.Screen
                name="Deals"
                component={DealsScreen}
                options={{
                    tabBarIcon: (props) => <Tag {...props} />,
                }}
            />
            <Tab.Screen
                name="Account"
                component={AccountScreen}
                options={{
                    tabBarIcon: (props) => <User {...props} />,
                }}
            />
            <Tab.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                    tabBarIcon: (props) => <MessageCircle {...props} />,
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: 'row',
        backgroundColor: '#000000',
        height: Platform.OS === 'ios' ? 95 : 95,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
    },
    tabItemsContainer: {
        flexDirection: 'row',
        flex: 1,
        paddingBottom: Platform.OS === 'ios' ? 25 : 20,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
    },
    iconWrapper: {
        height: 54,
        width: 54,
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicatorContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 20 : 23,
        height: 54,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    indicatorCircle: {
        width: 54,
        height: 54,
        borderRadius: 28,
        backgroundColor: '#FFFFFF',
        marginTop: -35,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#A69B8F',
        marginTop: -5,
    },
    tabLabelActive: {
        color: '#FFFFFF',
    }
});
