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
} from 'react-native';
import { COLORS, SPACING } from '../../../theme/theme';
import useAuthStore from '../../../zustand/useAuthStore';

const { width } = Dimensions.get('window');

interface LoginScreenProps {
    onLoginPress: () => void;
}

export const LoginView: React.FC<LoginScreenProps> = ({ onLoginPress }) => {
    const { identifier, setIdentifier } = useAuthStore();
    const [inputValue, setInputValue] = useState(identifier || '');

    const handleLogin = () => {
        if (inputValue.trim()) {
            setIdentifier(inputValue.trim());
            onLoginPress();
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>

                {/* Login Card */}
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
                    />

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.googleButton}>
                        <View style={styles.googleIconContainer}>
                            {/* Small Google Color-like dots or simple SVG placeholder */}
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
    activeDot: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#999',
    },
    card: {
        width: '100%',
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: SPACING.xl,
        alignItems: 'center',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        // Shadow for Android
        elevation: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#1A1A1A',
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: 14,
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
        fontSize: 14,
        color: '#1A1A1A',
        marginBottom: 16,
    },
    loginButton: {
        width: '100%',
        height: 48,
        backgroundColor: '#9CA3AF', // Grayish button from image
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
