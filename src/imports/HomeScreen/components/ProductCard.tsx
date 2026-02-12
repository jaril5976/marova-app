import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { COLORS, SPACING } from '../../../theme/theme';
import { Product } from '../../../zustand/useProductStore';
import { ShoppingBag } from 'lucide-react-native';

interface ProductCardProps {
    product: Product;
    onPress?: (product: Product) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.45; // 45% of screen width

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
    const { title, price, featuredImage, isNewArrival, sizes } = product;

    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress?.(product)}>
            <View style={styles.imageContainer}>
                {featuredImage?.src ? (
                    <Image source={{ uri: featuredImage.src }} style={styles.image} resizeMode="cover" />
                ) : (
                    <View style={[styles.image, styles.placeholder]} />
                )}
                {isNewArrival && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>New In</Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <Text style={styles.brandText}>PARFUM FOR {product.gender || 'All'}</Text>
                <Text style={styles.title} numberOfLines={1}>
                    {title}
                </Text>

                <View style={styles.priceRow}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.currency}>₹</Text>
                        <Text style={styles.price}>{price?.toFixed(2)}</Text>
                    </View>
                    {sizes && sizes.length > 0 && (
                        <View style={styles.sizeBadge}>
                            <Text style={styles.sizeText}>{sizes[0]}</Text>
                        </View>
                    )}
                </View>

                {product.stockQuantity < 1 ? (
                    <View style={[styles.button, styles.outOfStock]}>
                        <Text style={styles.buttonText}>Out Of Stock</Text>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.button}>
                        <ShoppingBag size={16} color="#FFF" style={{ marginRight: 4 }} />
                        <Text style={styles.buttonText}>Add to cart</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        backgroundColor: COLORS.background,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
        marginRight: SPACING.md,
        marginBottom: SPACING.sm,
    },
    imageContainer: {
        position: 'relative',
        height: CARD_WIDTH * 1.2,
        width: '100%',
        backgroundColor: COLORS.surface,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        backgroundColor: COLORS.surface,
    },
    badge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#000',
    },
    content: {
        padding: SPACING.sm,
    },
    brandText: {
        fontSize: 10,
        color: COLORS.textMuted,
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    currency: {
        fontSize: 10,
        color: COLORS.text,
        marginRight: 1,
    },
    price: {
        fontSize: 12,
        fontWeight: '500',
        color: COLORS.text,
    },
    sizeBadge: {
        backgroundColor: COLORS.surface,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    sizeText: {
        fontSize: 10,
        color: COLORS.text,
        fontWeight: '500',
    },
    button: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 4,
        width: '100%',
    },
    outOfStock: {
        backgroundColor: '#A69B8F', // Use accent color for out of stock or muted
        opacity: 0.7,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
});
