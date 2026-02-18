import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../theme/theme';
import { useAuth } from '../hooks/useAuth';
import { useCurrentUser } from '../imports/User/hooks/useCurrentUser';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const FormInput = ({ label, value, onChangeText, placeholder, icon: Icon, keyboardType = 'default' }: any) => (
    <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={styles.inputWrapper}>
            {Icon && <Icon size={20} color={COLORS.textMuted} style={styles.inputIcon} />}
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={COLORS.textMuted}
                keyboardType={keyboardType}
                autoCapitalize={label === 'Zip Code' ? 'none' : 'words'}
            />
        </View>
    </View>
);

export const ShippingAddressScreen = () => {
    const { currentUserData } = useCurrentUser();
    const { updateUser, isUpdatingProfile } = useAuth();
    const navigation = useNavigation<any>();

    const defaultAddress = currentUserData?.addresses?.[0] || { street: '', city: '', zip: '' };
    const [street, setStreet] = useState(defaultAddress.street);
    const [city, setCity] = useState(defaultAddress.city);
    const [zip, setZip] = useState(defaultAddress.zip);

    useEffect(() => {
        if (currentUserData) {
            const addr = currentUserData.addresses?.[0] || { street: '', city: '', zip: '' };
            setStreet(addr.street);
            setCity(addr.city);
            setZip(addr.zip);
        }
    }, [currentUserData]);

    const isFormValid = street.trim() !== '' && city.trim() !== '' && zip.trim() !== '';

    const handleUpdate = () => {
        const payload = {
            ...currentUserData,
            addresses: [
                {
                    ...defaultAddress,
                    street,
                    city,
                    zip
                }
            ]
        };
        updateUser(payload, {
            onSuccess: () => {
                navigation.navigate('MainTabs', { screen: 'Account' });
            }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.viewHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.viewTitle}>Shipping Address</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <FormInput
                    label="Street"
                    value={street}
                    onChangeText={setStreet}
                    placeholder="House No, Street, Area"
                />

                <FormInput
                    label="City"
                    value={city}
                    onChangeText={setCity}
                    placeholder="City"
                />

                <FormInput
                    label="Zip Code"
                    value={zip}
                    onChangeText={setZip}
                    placeholder="Zip"
                    keyboardType="numeric"
                />

                <TouchableOpacity
                    style={[
                        styles.updateButton,
                        (isUpdatingProfile || !isFormValid) && styles.disabledButton
                    ]}
                    onPress={handleUpdate}
                    disabled={isUpdatingProfile || !isFormValid}
                >
                    {isUpdatingProfile ? (
                        <ActivityIndicator color={COLORS.background} />
                    ) : (
                        <Text style={styles.updateButtonText}>Update Address</Text>
                    )}
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
    viewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
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
    scrollContent: {
        padding: SPACING.lg,
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
});
