
import React from 'react';
import { StyleSheet } from 'react-native';
import { OtpView } from '../imports/Auth/components/OtpView';
import { COLORS } from '../theme/theme';
import { useNavigation } from '@react-navigation/native';

export const OtpScreen = () => {
    const navigation = useNavigation<any>();

    const handleChangeIdentifier = () => {
        navigation.navigate('Login');
    };

    const handleVerifySuccess = () => {
        // Navigation will be handled by the RootNavigator when isAuthenticated changes
        // or we can manually navigate back to Account
        navigation.navigate('MainTabs', { screen: 'Account' });
    };

    return (
        <OtpView
            onChangeIdentifier={handleChangeIdentifier}
            onVerifySuccess={handleVerifySuccess}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
});
