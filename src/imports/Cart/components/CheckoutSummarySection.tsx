
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, SPACING } from '../../../theme/theme';
import { useUnifiedCart } from '../../../hooks/useUnifiedCart';
import { ShoppingBag, Tag, Ticket } from 'lucide-react-native';

export const CheckoutSummarySection = () => {
    const { cart } = useUnifiedCart();
    const [couponCode, setCouponCode] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const [discount, setDiscount] = useState(0);

    const subtotal = cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
    const shipping = 0; // Or fetch from config
    const total = subtotal + shipping - discount;

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) return;

        setIsApplying(true);
        // Simulate API call
        setTimeout(() => {
            setIsApplying(false);
            // Example logic: if code is "SAVE10", apply 10% discount
            if (couponCode.toUpperCase() === 'SAVE10') {
                setDiscount(subtotal * 0.1);
            } else {
                setDiscount(0);
            }
        }, 1000);
    };

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <ShoppingBag size={20} color={COLORS.text} />
                <Text style={styles.sectionTitle}>Order Summary</Text>
            </View>

            <View style={styles.itemsList}>
                {cart.map((item) => (
                    <View key={item.id || item.productId} style={styles.itemRow}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                            <View style={styles.quantityBadge}>
                                <Text style={styles.quantityText}>{item.quantity}</Text>
                            </View>
                        </View>
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.itemVariant}>{item.size}{item.color ? ` / ${item.color}` : ''}</Text>
                        </View>
                        <Text style={styles.itemPrice}>₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.couponContainer}>
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                    <Tag size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Discount code"
                        value={couponCode}
                        onChangeText={setCouponCode}
                        autoCapitalize="characters"
                    />
                </View>
                <TouchableOpacity
                    style={[styles.applyButton, (!couponCode.trim() || isApplying) && styles.disabledButton]}
                    onPress={handleApplyCoupon}
                    disabled={!couponCode.trim() || isApplying}
                >
                    {isApplying ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <Text style={styles.applyButtonText}>Apply</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.summaryTable}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>₹{subtotal.toLocaleString()}</Text>
                </View>
                {discount > 0 && (
                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, { color: '#10B981' }]}>Discount</Text>
                        <Text style={[styles.summaryValue, { color: '#10B981' }]}>-₹{discount.toLocaleString()}</Text>
                    </View>
                )}
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Shipping</Text>
                    <Text style={styles.summaryValue}>{shipping === 0 ? 'Free' : `₹${shipping}`}</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>₹{total.toLocaleString()}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: SPACING.lg,
    },
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
    itemsList: {
        marginBottom: SPACING.lg,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    imageContainer: {
        position: 'relative',
    },
    itemImage: {
        width: 54,
        height: 64,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    quantityBadge: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: '#1A1A1A',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    quantityText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    itemInfo: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    itemVariant: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    couponContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
        backgroundColor: '#FFF',
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
    },
    applyButton: {
        backgroundColor: '#1A1A1A',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        marginLeft: SPACING.sm,
        height: 48,
        justifyContent: 'center',
    },
    applyButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.5,
    },
    summaryTable: {
        backgroundColor: '#F9FAFB',
        padding: SPACING.md,
        borderRadius: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: COLORS.textMuted,
    },
    summaryValue: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '600',
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
});
