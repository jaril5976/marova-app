
import React, { useState } from 'react';
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
import { X } from 'lucide-react-native';
import GoogleIcon from '../../../assets/GoogleIcon';

const { width } = Dimensions.get('window');

interface LoginScreenProps {
    onLoginPress: () => void;
    onClose?: () => void;
}

export const LoginView: React.FC<LoginScreenProps> = ({ onLoginPress, onClose }) => {
    const { identifier: storedIdentifier, setIdentifier } = useAuthStore();
    const { sendOtp, isSendingOtp } = useAuth();
    const [inputValue, setInputValue] = useState(storedIdentifier || '');

    const validateInput = (text: string) => {
        const trimmed = text.trim();
        if (trimmed.includes('@')) {
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(trimmed);
        } else {
            // Mobile number validation (10 digits)
            const phoneRegex = /^\d{10}$/;
            return phoneRegex.test(trimmed);
        }
    };

    const isValid = validateInput(inputValue);

    const handleLogin = async () => {
        const trimmedValue = inputValue.trim();
        if (!trimmedValue) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please enter an email or phone number',
                position: 'top',
            });
            return;
        }

        setIdentifier(trimmedValue);

        const isEmail = trimmedValue.includes('@');
        const payload = isEmail ? { email: trimmedValue } : { phone: trimmedValue };

        try {
            sendOtp(payload);
            onLoginPress();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to send OTP. Please try again.',
                position: 'top',
            });
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                {onClose && (
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                        activeOpacity={0.7}
                    >
                        <X color="#FFF" size={20} />
                    </TouchableOpacity>
                )}
                <View style={styles.card}>
                    <Text style={styles.title}>Welcome</Text>
                    <Text style={styles.subtitle}>Enter your email or phone number</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Email or phone number"
                        placeholderTextColor={COLORS.textMuted}
                        value={inputValue}
                        onChangeText={setInputValue}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!isSendingOtp}
                    />

                    <TouchableOpacity
                        style={[
                            styles.loginButton,
                            (!isValid || isSendingOtp) && styles.disabledButton,
                        ]}
                        onPress={handleLogin}
                        disabled={!isValid || isSendingOtp}
                    >
                        {isSendingOtp ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.loginButtonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.googleButton}>
                        <View style={styles.googleIconContainer}>
                            <GoogleIcon />
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
    closeButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        zIndex: 10,
        padding: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
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
        fontSize: 28,
        fontWeight: '900',
        color: '#1A1A1A',
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: 16,
        color: '#4B5563',
        marginBottom: SPACING.xl,
    },
    input: {
        width: '100%',
        height: 48,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#1A1A1A',
        marginBottom: 16,
    },
    loginButton: {
        width: '100%',
        height: 48,
        backgroundColor: '#000',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    loginButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.5,
        backgroundColor: '#969697',
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
    googleButtonText: {
        color: '#1A1A1A',
        fontSize: 16,
        fontWeight: '600',
    },
});
