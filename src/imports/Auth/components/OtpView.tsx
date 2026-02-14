
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { COLORS, SPACING } from '../../../theme/theme';
import { useAuth } from '../../../hooks/useAuth';
import useAuthStore from '../../../zustand/useAuthStore';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

interface OtpViewProps {
    onChangeIdentifier: () => void;
    onVerifySuccess: () => void;
}

export const OtpView: React.FC<OtpViewProps> = ({ onChangeIdentifier, onVerifySuccess }) => {
    const { identifier } = useAuthStore();
    const { verifyOtp, isVerifyingOtp, sendOtp, isSendingOtp, isAuthenticated } = useAuth();
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(30);
    const inputs = useRef<Array<TextInput | null>>([]);

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    // Handle authentication success
    useEffect(() => {
        if (isAuthenticated) {
            onVerifySuccess();
        }
    }, [isAuthenticated, onVerifySuccess]);

    const handleOtpChange = (value: string, index: number) => {
        if (value.length > 1) {
            value = value[value.length - 1];
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            inputs.current[index + 1]?.focus();
        }

        if (newOtp.every((digit) => digit !== '') && newOtp.join('').length === 4) {
            const isEmail = identifier?.includes('@');
            const payload = isEmail
                ? { email: identifier!, otp: newOtp.join('') }
                : { phone: identifier!, otp: newOtp.join('') };

            verifyOtp(payload);
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleResend = () => {
        if (timer > 0 || !identifier) return;

        const isEmail = identifier.includes('@');
        const payload = isEmail ? { email: identifier } : { phone: identifier };

        sendOtp(payload);
        setTimer(30);
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'A new OTP has been sent.',
            position: 'top',
        });
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Verify Account</Text>
                    <Text style={styles.subtitle}>Enter the 4-digit code sent to</Text>
                    <Text style={styles.identifier}>{identifier}</Text>

                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(el) => {
                                    inputs.current[index] = el;
                                }}
                                style={[styles.otpInput, digit !== '' && styles.activeOtpInput]}
                                value={digit}
                                onChangeText={(val) => handleOtpChange(val, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                editable={!isVerifyingOtp}
                            />
                        ))}
                    </View>

                    {isVerifyingOtp && <ActivityIndicator size="small" color={COLORS.primary} style={{ marginBottom: 16 }} />}

                    <TouchableOpacity onPress={handleResend} disabled={timer > 0 || isSendingOtp}>
                        <Text style={[styles.resendText, timer === 0 && { color: COLORS.primary, fontWeight: 'bold' }]}>
                            {isSendingOtp ? 'Sending...' : timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onChangeIdentifier} disabled={isVerifyingOtp}>
                        <Text style={styles.changeLink}>Change email or phone</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.googleButton}>
                        <View style={styles.googleIconContainer}>
                            <Image
                                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png' }}
                                style={styles.googleIcon}
                            />
                        </View>
                        <Text style={styles.googleButtonText}>Login with Google</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9F9F9',
        paddingHorizontal: SPACING.xl,
    },
    card: {
        width: '100%',
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: SPACING.xl,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1A1A1A',
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: 12,
        color: '#4B5563',
        marginBottom: 4,
    },
    identifier: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 20,
        textAlign: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 16,
    },
    otpInput: {
        width: 48,
        height: 48,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    activeOtpInput: {
        borderColor: COLORS.primary || '#6366F1',
        borderWidth: 2,
    },
    resendText: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 8,
    },
    changeLink: {
        fontSize: 12,
        color: '#374151',
        textDecorationLine: 'underline',
        marginBottom: 20,
    },
    googleButton: {
        width: '100%',
        height: 48,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    googleIconContainer: {
        marginRight: 10,
    },
    googleIcon: {
        width: 18,
        height: 18,
    },
    googleButtonText: {
        color: '#1A1A1A',
        fontSize: 14,
        fontWeight: '600',
    },
});
