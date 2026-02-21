
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, SPACING } from '../../../theme/theme';
import useAuthStore from '../../../zustand/useAuthStore';
import { useAuth } from '../../../hooks/useAuth';
import Toast from 'react-native-toast-message';
import { User, Phone, Mail } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

interface CheckoutContactSectionProps {
    isGuest: boolean;
    onChange?: (data: { firstName: string; lastName: string; email: string; phone: string }) => void;
    onClearError?: (field: string) => void;
    errors?: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
    };
}

const capitalizeFirstLetter = (text: string) => {
    return text.replace(/\b\w/g, char => char.toUpperCase());
};

export const CheckoutContactSection: React.FC<CheckoutContactSectionProps> = ({ isGuest, onChange, onClearError, errors }) => {
    const { user, setIdentifier } = useAuthStore();
    const { sendOtp, isSendingOtp } = useAuth();
    const navigation = useNavigation<any>();

    const [phone, setPhone] = useState(user?.phone || '');
    const [email, setEmail] = useState(user?.email || '');
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');

    useEffect(() => {
        if (onChange) {
            onChange({ firstName, lastName, email, phone });
        }
    }, [firstName, lastName, email, phone]);

    const handleSendOtp = () => {
        if (phone.length !== 10) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Phone',
                text2: 'Please enter a valid 10-digit phone number.',
            });
            return;
        }
        setIdentifier(phone);
        sendOtp({ phone });
        // Navigate to OTP screen after sending OTP
        navigation.navigate('Otp', { returnTo: 'Checkout' });
    };

    if (isGuest) {
        return (
            <>
                <View style={styles.sectionHeader}>
                    <User size={20} color={COLORS.text} />
                    <Text style={styles.sectionTitle}>Contact Information</Text>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone Number</Text>
                    <View style={styles.phoneInputContainer}>
                        <TextInput
                            style={[styles.input, errors?.phone && styles.inputError, { flex: 1 }]}
                            placeholder="Enter 10-digit phone number"
                            value={phone}
                            onChangeText={(text) => {
                                setPhone(text);
                                if (onClearError) onClearError('phone');
                            }}
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                        <TouchableOpacity
                            style={[styles.verifyButton, (phone.length !== 10 || isSendingOtp) && styles.disabledButton]}
                            onPress={handleSendOtp}
                            disabled={phone.length !== 10 || isSendingOtp}
                        >
                            {isSendingOtp ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <Text style={styles.verifyButtonText}>Verify</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    {errors?.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                </View>
            </>
        );
    }

    return (
        <>
            <View style={styles.sectionHeader}>
                <User size={20} color={COLORS.text} />
                <Text style={styles.sectionTitle}>Contact Information</Text>
            </View>

            <View style={styles.grid}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: SPACING.sm }]}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        style={[styles.input, errors?.firstName && styles.inputError]}
                        value={firstName}
                        onChangeText={(text) => {
                            setFirstName(capitalizeFirstLetter(text));
                            if (onClearError) onClearError('firstName');
                        }}
                        placeholder="First Name"
                    />
                    {errors?.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                        style={[styles.input, errors?.lastName && styles.inputError]}
                        value={lastName}
                        onChangeText={(text) => {
                            setLastName(capitalizeFirstLetter(text));
                            if (onClearError) onClearError('lastName');
                        }}
                        placeholder="Last Name"
                    />
                    {errors?.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={[styles.input, errors?.email && styles.inputError]}
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        if (onClearError) onClearError('email');
                    }}
                    placeholder="Email Address"
                    keyboardType="email-address"
                />
                {errors?.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    editable={false} // Phone is usually verified and not editable here
                />
                {errors?.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>
        </>
    );
};

const styles = StyleSheet.create({

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: SPACING.sm,
        color: COLORS.text,
    },
    inputGroup: {
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: COLORS.text,
        backgroundColor: '#FFF',
    },
    inputError: {
        borderColor: '#FF3B30',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    verifyButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        marginLeft: SPACING.sm,
        height: 48,
        justifyContent: 'center',
    },
    verifyButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#E5E7EB',
    },
});
