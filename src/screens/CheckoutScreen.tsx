
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../theme/theme';
import useAuthStore from '../zustand/useAuthStore';
import { useUnifiedCart } from '../hooks/useUnifiedCart';
import { User, MapPin, ShoppingBag, ChevronRight, AlertCircle, ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { CheckoutContactSection } from '../imports/Cart/components/CheckoutContactSection';
import { CheckoutAddressSection } from '../imports/Cart/components/CheckoutAddressSection';
import { CheckoutSummarySection } from '../imports/Cart/components/CheckoutSummarySection';
import { useUpdateUserMutation } from '../hooks/useUpdateUserMutation';

export const CheckoutScreen = () => {
    const { isAuthenticated, user } = useAuthStore();
    const { cart } = useUnifiedCart();
    const navigation = useNavigation<any>();
    const { updateUserMutation } = useUpdateUserMutation();

    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [contactDetails, setContactDetails] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });
    const [errors, setErrors] = useState<any>({});
    const [isProcessing, setIsProcessing] = useState(false);

    const validate = () => {
        const newErrors: any = {};
        if (!contactDetails.firstName.trim()) {
            newErrors.firstName = 'First Name is required';
        }
        if (!contactDetails.lastName.trim()) {
            newErrors.lastName = 'Last Name is required';
        }
        if (!contactDetails.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(contactDetails.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!contactDetails.phone.trim()) {
            newErrors.phone = 'Phone Number is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClearError = (field: string) => {
        if (errors[field]) {
            setErrors((prev: any) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handlePlaceOrder = async () => {
        if (!isAuthenticated) return;

        if (!validate()) {
            return;
        }

        setIsProcessing(true);
        try {
            // Check if profile needs update
            const hasChanged =
                contactDetails.firstName !== user?.firstName ||
                contactDetails.lastName !== user?.lastName ||
                contactDetails.email !== user?.email ||
                selectedAddress?.street !== user?.addresses?.[0]?.street ||
                selectedAddress?.city !== user?.addresses?.[0]?.city ||
                selectedAddress?.zip !== user?.addresses?.[0]?.zip;

            if (hasChanged) {
                const updatedAddresses = [...(user?.addresses || [])];
                const newAddress = {
                    ...selectedAddress,
                    id: user?.addresses?.[0]?.id || Math.random().toString(36).substr(2, 9)
                };

                if (updatedAddresses.length > 0) {
                    updatedAddresses[0] = newAddress;
                } else {
                    updatedAddresses.push(newAddress);
                }

                await updateUserMutation.mutateAsync({
                    ...contactDetails,
                    gender: user?.gender || '',
                    dateOfBirth: user?.dateOfBirth || '',
                    addresses: updatedAddresses
                });
            }

            // Logic to create order will go here
            console.log('Placing order with address:', selectedAddress);
            // After success: navigation.navigate('OrderSuccess');
        } catch (error) {
            console.error('Order creation/Profile update failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.goBack()}
                >
                    <ChevronLeft size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {!isAuthenticated ? (
                    <View style={styles.guestContainer}>
                        <View style={styles.infoCard}>
                            <AlertCircle size={24} color={COLORS.primary} />
                            <Text style={styles.infoText}>
                                Please verify your phone number to proceed with the checkout.
                            </Text>
                        </View>
                        <CheckoutContactSection
                            isGuest={true}
                            errors={errors}
                            onChange={setContactDetails}
                            onClearError={handleClearError}
                        />
                    </View>
                ) : (
                    <View style={styles.authContainer}>
                        <CheckoutContactSection
                            isGuest={false}
                            errors={errors}
                            onChange={setContactDetails}
                            onClearError={handleClearError}
                        />
                        <View style={styles.divider} />
                        <CheckoutAddressSection
                            onAddressChange={setSelectedAddress}
                        />
                    </View>
                )}

                <View style={styles.divider} />
                <CheckoutSummarySection />
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.placeOrderButton, (!isAuthenticated || isProcessing) && styles.disabledButton]}
                    onPress={handlePlaceOrder}
                    disabled={!isAuthenticated || isProcessing}
                >
                    {isProcessing ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <>
                            <Text style={styles.placeOrderText}>Place Order</Text>
                            <ShoppingBag size={20} color="#FFF" />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    backButton: {
        padding: 5,
    },
    backButtonText: {
        color: COLORS.primary,
        fontSize: 16,
    },
    scrollContent: {
        padding: SPACING.lg,
    },
    guestContainer: {
        marginBottom: SPACING.xl,
    },
    authContainer: {
        marginBottom: SPACING.xl,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        padding: SPACING.md,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    infoText: {
        flex: 1,
        marginLeft: SPACING.sm,
        fontSize: 14,
        color: COLORS.text,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: SPACING.xl,
    },
    footer: {
        padding: SPACING.lg,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    placeOrderButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 12,
    },
    disabledButton: {
        backgroundColor: '#A69B8F',
    },
    placeOrderText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 1)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});
