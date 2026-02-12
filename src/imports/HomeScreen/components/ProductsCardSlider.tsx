import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Product } from '../../../zustand/useProductStore';
import { ProductCard } from './ProductCard';
import { COLORS, SPACING } from '../../../theme/theme';

interface ProductsCardSliderProps {
    heading: string;
    subHeading?: string;
    products: Product[];
}

export const ProductsCardSlider: React.FC<ProductsCardSliderProps> = ({ heading, subHeading, products }) => {
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.heading}>
                    {heading}
                    {subHeading && <Text style={styles.subHeading}>. {subHeading}</Text>}
                </Text>
            </View>

            <FlatList
                data={products}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <ProductCard product={item} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: SPACING.md,
    },
    header: {
        marginBottom: SPACING.md,
        paddingHorizontal: SPACING.md,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    subHeading: {
        fontSize: 18,
        fontWeight: '400',
        color: COLORS.textMuted,
    },
    listContent: {
        paddingHorizontal: SPACING.md,
    },
});
