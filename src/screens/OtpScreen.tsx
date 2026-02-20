
import React from 'react';
import { StyleSheet } from 'react-native';
import { OtpView } from '../imports/Auth/components/OtpView';
import { COLORS } from '../theme/theme';
import { useNavigation, useRoute } from '@react-navigation/native';

export const OtpScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { returnTo } = route.params || {};

    const handleChangeIdentifier = () => {
        navigation.navigate('Login');
    };

    const handleVerifySuccess = () => {
        if (returnTo === 'Checkout') {
            navigation.navigate('Checkout');
        } else {
            navigation.navigate('MainTabs', { screen: 'Account' });
        }
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
