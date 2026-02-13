import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { COLORS, SPACING } from '../../../theme/theme';
import { Product } from '../../../zustand/useProductStore';

interface ProductInfoHeaderProps {
    product: Product;
}

export const ProductInfoHeader: React.FC<ProductInfoHeaderProps> = ({ product }) => {
    const { title, salePrice, originalPrice, gender, averageRating, reviewCount } = product;
    const price = salePrice || originalPrice || 0;

    return (
        <View style={styles.container}>
            <Text style={styles.brandText}>Parfume for {gender || 'All'}</Text>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.ratingRow}>
                <Star size={16} color="#FFB800" fill="#FFB800" />
                <Text style={styles.ratingText}>
                    {averageRating || 0} <Text style={styles.reviewCount}>({reviewCount || 0})</Text>
                </Text>
            </View>

            <View style={styles.priceRow}>
                <View style={styles.priceBadge}>
                    <Text style={styles.priceText}>₹{price.toFixed(2)}</Text>
                </View>
                {salePrice && originalPrice && (
                    <Text style={styles.originalPrice}>₹{originalPrice.toFixed(2)}</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
    },
    brandText: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginBottom: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginLeft: 4,
    },
    reviewCount: {
        color: COLORS.textMuted,
        fontWeight: '400',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.sm,
    },
    priceBadge: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.text,
    },
    priceText: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
    },
    originalPrice: {
        fontSize: 16,
        color: COLORS.secondary,
        textDecorationLine: 'line-through',
        marginLeft: SPACING.md,
    },
});
