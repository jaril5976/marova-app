
import React from 'react';
import { StyleSheet } from 'react-native';
import { LoginView } from '../imports/Auth/components/LoginView';
import { COLORS } from '../theme/theme';
import { useNavigation } from '@react-navigation/native';

export const LoginScreen = () => {
    const navigation = useNavigation<any>();

    const handleLoginPress = () => {
        navigation.navigate('Otp');
    };

    const handleClose = () => {
        navigation.navigate('MainTabs', { screen: 'Home' });
    };

    return (
        <LoginView onLoginPress={handleLoginPress} onClose={handleClose} />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
});
