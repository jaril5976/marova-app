import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../theme/theme';

import useAuthStore from '../zustand/useAuthStore';
import { LoginView } from '../imports/Auth/components/LoginView';
import { OtpView } from '../imports/Auth/components/OtpView';

export const AccountScreen = () => {
    const { token, logout } = useAuthStore();
    const [authStep, setAuthStep] = useState<'login' | 'otp'>('login');

    if (!token) {
        if (authStep === 'login') {
            return (
                <SafeAreaView style={styles.container}>
                    <LoginView onLoginPress={() => setAuthStep('otp')} />
                </SafeAreaView>
            );
        }
        return (
            <SafeAreaView style={styles.container}>
                <OtpView
                    onChangeIdentifier={() => setAuthStep('login')}
                    onVerifySuccess={() => { }} // Store update is handled inside OtpView
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView contentContainerStyle={styles.centerContent}>
                <Text style={styles.title}>Logged In Successfully!</Text>
                <Text style={styles.subtitle}>Your profile details will appear here.</Text>

                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textMuted,
        marginBottom: 32,
        textAlign: 'center',
    },
    logoutButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#D16060',
        borderRadius: 8,
    },
    logoutText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
