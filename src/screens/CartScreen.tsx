
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../theme/theme';
import { useUnifiedCart } from '../hooks/useUnifiedCart';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export const CartScreen = () => {
    const { cart, isLoading, updateQuantity, removeFromCart } = useUnifiedCart();
    const tabBarHeight = useBottomTabBarHeight();
    const subtotal = cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            </SafeAreaView>
        );
    }

    if (cart.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContainer}>
                    <ShoppingBag size={64} color={COLORS.textMuted} style={{ marginBottom: 16 }} />
                    <Text style={styles.emptyTitle}>Your cart is empty</Text>
                    <Text style={styles.emptySubtitle}>Looks like you haven't added anything to your cart yet.</Text>
                    <TouchableOpacity style={styles.browseButton}>
                        <Text style={styles.browseButtonText}>Browse Products</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Shopping Bag</Text>
                <Text style={styles.itemCount}>{cart.length} {cart.length === 1 ? 'item' : 'items'}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {cart.map((item) => (
                    <View key={item.id || item.productId} style={styles.cartItem}>
                        <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                        <View style={styles.itemDetails}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                                <TouchableOpacity onPress={() => removeFromCart(item.id || item.productId!)}>
                                    <Trash2 size={18} color="#D16060" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.itemVariant}>{item.size}{item.color ? ` / ${item.color}` : ''}</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.itemPrice}>₹{(item.price || 0).toLocaleString()}</Text>
                                <View style={styles.quantitySelector}>
                                    <TouchableOpacity
                                        style={styles.qtyButton}
                                        onPress={() => updateQuantity(item.id || item.productId!, (item.quantity || 1) - 1)}
                                    >
                                        <Minus size={14} color={COLORS.text} />
                                    </TouchableOpacity>
                                    <Text style={styles.qtyText}>{item.quantity}</Text>
                                    <TouchableOpacity
                                        style={styles.qtyButton}
                                        onPress={() => updateQuantity(item.id || item.productId!, (item.quantity || 1) + 1)}
                                    >
                                        <Plus size={14} color={COLORS.text} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Sticky Footer */}
            <View style={[styles.footer, { paddingBottom: tabBarHeight }]}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>₹{subtotal.toLocaleString()}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Shipping</Text>
                    <Text style={styles.summaryValue}>Calculated at checkout</Text>
                </View>
                <View style={[styles.summaryRow, { marginTop: 8 }]}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>₹{subtotal.toLocaleString()}</Text>
                </View>

                <TouchableOpacity style={styles.checkoutButton}>
                    <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                    <ArrowRight size={20} color="#FFF" />
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
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
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    itemCount: {
        fontSize: 14,
        color: COLORS.textMuted,
    },
    scrollContent: {
        padding: SPACING.lg,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginBottom: 24,
    },
    browseButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    browseButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    cartItem: {
        flexDirection: 'row',
        marginBottom: 24,
        backgroundColor: '#FFF',
        borderRadius: 12,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    itemImage: {
        width: 100,
        height: 120,
        backgroundColor: '#F9F9F9',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
    },
    itemDetails: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        flex: 1,
        marginRight: 8,
    },
    itemVariant: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 4,
    },
    qtyButton: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginHorizontal: 12,
        color: COLORS.text,
    },
    footer: {
        padding: SPACING.lg,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#888383ff',
        marginBottom: Platform.OS === 'ios' ? 0 : 15,
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
        fontWeight: '500',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    checkoutButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 16,
    },
    checkoutText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
});
