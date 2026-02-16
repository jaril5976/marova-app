import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../theme/theme';
import { useAuth } from '../hooks/useAuth';
import { User, LogOut, Settings, Package, MapPin, ChevronRight, Mail, Calendar, Smartphone, ChevronDown, ChevronLeft } from 'lucide-react-native';

import { useNavigation, useFocusEffect } from '@react-navigation/native';

export const AccountScreen = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigation = useNavigation<any>();

    useFocusEffect(
        React.useCallback(() => {
            if (!isAuthenticated) {
                navigation.navigate('Login');
            }
        }, [isAuthenticated, navigation])
    );

    if (!isAuthenticated) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, backgroundColor: COLORS.background }} />
            </SafeAreaView>
        );
    }

    const renderMenu = () => (
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

                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ShippingAddress')}>
                    <View style={styles.menuItemLeft}>
                        <MapPin size={20} color={COLORS.text} />
                        <Text style={styles.menuItemText}>Shipping Addresses</Text>
                    </View>
                    <ChevronRight size={20} color={COLORS.textMuted} />
                </TouchableOpacity>

            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Settings</Text>

                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AccountSettings')}>
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
    );

    return (
        <SafeAreaView style={styles.container}>
            {renderMenu()}
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
    viewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    backButton: {
        padding: 4,
        marginLeft: -4,
    },
    viewTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 8,
        fontWeight: '500',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
        backgroundColor: COLORS.background,
    },
    inputIcon: {
        marginRight: 10,
    },
    inputIconRight: {
        marginLeft: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: COLORS.text,
        height: '100%',
    },
    updateButton: {
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    disabledButton: {
        opacity: 0.7,
    },
    updateButtonText: {
        color: COLORS.background,
        fontSize: 16,
        fontWeight: 'bold',
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
