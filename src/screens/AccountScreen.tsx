
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../theme/theme';
import { useAuth } from '../hooks/useAuth';
import { LoginView } from '../imports/Auth/components/LoginView';
import { OtpView } from '../imports/Auth/components/OtpView';
import { User, LogOut, Settings, Package, Heart, MapPin, ChevronRight } from 'lucide-react-native';

export const AccountScreen = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [authStep, setAuthStep] = useState<'login' | 'otp'>('login');

    if (!isAuthenticated) {
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
                    onVerifySuccess={() => { }} //isAuthenticated logic will handle the transition
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        {user?.firstName ? (
                            <Text style={styles.avatarText}>{user.firstName[0]}{user?.lastName?.[0]}</Text>
                        ) : (
                            <User size={40} color={COLORS.textMuted} />
                        )}
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.userName}>{user?.firstName || 'User'} {user?.lastName || ''}</Text>
                        <Text style={styles.userEmail}>{user?.email || 'No email'}</Text>
                    </View>
                </View>

                {/* Account Sections */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>My Account</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Package size={20} color={COLORS.text} />
                            <Text style={styles.menuItemText}>My Orders</Text>
                        </View>
                        <ChevronRight size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <MapPin size={20} color={COLORS.text} />
                            <Text style={styles.menuItemText}>Shipping Addresses</Text>
                        </View>
                        <ChevronRight size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Heart size={20} color={COLORS.text} />
                            <Text style={styles.menuItemText}>Wishlist</Text>
                        </View>
                        <ChevronRight size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Settings size={20} color={COLORS.text} />
                            <Text style={styles.menuItemText}>Account Settings</Text>
                        </View>
                        <ChevronRight size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <LogOut size={20} color="#D16060" />
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
    scrollContent: {
        padding: SPACING.lg,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 16,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: COLORS.textMuted,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: 16,
        color: COLORS.text,
        marginLeft: 12,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        marginTop: 8,
    },
    logoutText: {
        color: '#D16060',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
});
