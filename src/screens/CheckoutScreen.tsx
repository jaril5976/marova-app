
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../theme/theme';
import useAuthStore from '../zustand/useAuthStore';
import { useUnifiedCart } from '../hooks/useUnifiedCart';
import { User, MapPin, ShoppingBag, ChevronRight, AlertCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { CheckoutContactSection } from '../imports/Cart/components/CheckoutContactSection';
import { CheckoutAddressSection } from '../imports/Cart/components/CheckoutAddressSection';
import { CheckoutSummarySection } from '../imports/Cart/components/CheckoutSummarySection';

export const CheckoutScreen = () => {
    const { isAuthenticated, user } = useAuthStore();
    const { cart } = useUnifiedCart();
    const navigation = useNavigation<any>();

    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (user?.addresses && user?.addresses?.length > 0 && !selectedAddressId) {
            setSelectedAddressId(user.addresses[0].id);
        }
    }, [user, selectedAddressId]);

    const handlePlaceOrder = async () => {
        if (!isAuthenticated) return;

        setIsProcessing(true);
        try {
            // Logic to create order will go here
            console.log('Placing order with address:', selectedAddressId);
            // After success: navigation.navigate('OrderSuccess');
        } catch (error) {
            console.error('Order creation failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Back</Text>
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
                        <CheckoutContactSection isGuest={true} />
                    </View>
                ) : (
                    <View style={styles.authContainer}>
                        <CheckoutContactSection isGuest={false} />
                        <View style={styles.divider} />
                        <CheckoutAddressSection
                            selectedAddressId={selectedAddressId}
                            onSelectAddress={setSelectedAddressId}
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
});
