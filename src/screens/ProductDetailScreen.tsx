import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { COLORS, SPACING } from '../theme/theme';
import { QuantitySelector } from '../core/components/QuantitySelector';
import { Accordion } from '../core/components/Accordion';
import { ProductsCardSlider } from '../imports/HomeScreen/components/ProductsCardSlider';
import { ProductImageGallery } from '../imports/Products/components/ProductImageGallery';
import { ProductInfoHeader } from '../imports/Products/components/ProductInfoHeader';
import { PolicyCards } from '../imports/Products/components/PolicyCards';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getProductById } from '../imports/Products/api/api';

export const ProductDetailScreen = ({ route, navigation }: any) => {
    const { productId } = route.params;

    const [product, setProduct] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        try {
            const data = await getProductById(productId);
            setProduct(data);
        } catch (error) {
            console.log('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !product) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.headerAbsolute}>
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => navigation.goBack()}
                    >
                        <ChevronLeft size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <ProductImageGallery
                    images={product.images || []}
                    gender={product.gender}
                    season={product.season}
                />

                <View style={styles.detailsContainer}>
                    <ProductInfoHeader product={product} />

                    <View style={styles.quantityRow}>
                        <QuantitySelector
                            value={quantity}
                            onChange={setQuantity}
                            disabled={product.stockQuantity < 1}
                        />
                        <View style={[
                            styles.stockInfo,
                            { backgroundColor: product.stockQuantity > 1 ? '#E8F5E9' : '#FFEBEE' }
                        ]}>
                            <Text style={[
                                styles.stockText,
                                { color: product.stockQuantity > 1 ? '#2E7D32' : '#C62828' }
                            ]}>
                                {product.stockQuantity > 1 ? 'In Stock' : 'Out of Stock'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.scentProfileContainer}>
                        {product.scentProfile?.map((scent: string, index: number) => (
                            <View key={index} style={styles.scentItem}>
                                <Text style={styles.scentText}>{scent}</Text>
                                {index < product.scentProfile.length - 1 && (
                                    <View style={styles.scentDivider} />
                                )}
                            </View>
                        ))}
                    </View>

                    <View style={styles.attributeGrid}>
                        {product.longevity && (
                            <View style={styles.attributeBox}>
                                <Text style={styles.attributeValue}>{product.longevity}</Text>
                                <Text style={styles.attributeLabel}>Longevity</Text>
                            </View>
                        )}
                        {product.projection && (
                            <View style={styles.attributeBox}>
                                <Text style={styles.attributeValue}>{product.projection}</Text>
                                <Text style={styles.attributeLabel}>Projection</Text>
                            </View>
                        )}
                    </View>

                    {product.season?.length > 0 && (
                        <View style={styles.bestWornBox}>
                            <Text style={styles.bestWornText}>
                                Best Worn In{' '}
                                <Text style={styles.boldText}>
                                    {product.season.join(', ')}
                                </Text>
                            </Text>
                        </View>
                    )}

                    <View style={styles.accordionGroup}>
                        {product.accordionInfo?.map((info: any, index: number) => (
                            <Accordion key={index} title={info.name}>
                                <Text style={styles.accordionContent}>
                                    {info.content?.replace(/<[^>]*>?/gm, '')}
                                </Text>
                            </Accordion>
                        ))}
                    </View>

                    <PolicyCards />
                </View>

                {product.relevantProducts?.length > 0 && (
                    <ProductsCardSlider
                        heading="You Might Also Like"
                        subHeading="Related Products"
                        products={product.relevantProducts}
                    />
                )}
            </ScrollView>

            <View style={styles.footer}>
                {product.stockQuantity < 1 ? (
                    <View style={[styles.addToCartButton, styles.outOfStockButton]}>
                        <Text style={styles.outOfStockText}>
                            Out of Stock
                        </Text>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.addToCartButton}>
                        <Text style={styles.addToCartText}>
                            Add to cart - ₹
                            {(product.salePrice || product.originalPrice || 0) * quantity}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    headerAbsolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
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
    scrollContent: {
        paddingBottom: 100, // For footer
    },
    detailsContainer: {
        padding: SPACING.md,
    },
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.lg,
        marginBottom: SPACING.md,
    },
    stockInfo: {
        marginLeft: SPACING.md,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    stockText: {
        fontSize: 12,
        fontWeight: '700',
    },
    scentProfileContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginVertical: SPACING.sm,
    },
    scentItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scentText: {
        fontSize: 14,
        color: COLORS.text,
    },
    scentDivider: {
        width: 1,
        height: 14,
        backgroundColor: COLORS.border,
        marginHorizontal: SPACING.sm,
    },
    attributeGrid: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginTop: SPACING.md,
    },
    attributeBox: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
    },
    attributeValue: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
    },
    attributeLabel: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    bestWornBox: {
        marginTop: SPACING.md,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    bestWornText: {
        fontSize: 14,
        color: COLORS.text,
    },
    boldText: {
        fontWeight: '700',
    },
    accordionGroup: {
        marginTop: SPACING.xl,
        borderTopWidth: 1,
        borderColor: COLORS.border,
    },
    accordionContent: {
        fontSize: 14,
        lineHeight: 20,
        color: COLORS.textMuted,
        paddingBottom: SPACING.sm,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.background,
        padding: SPACING.md,
        paddingBottom: 30,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    addToCartButton: {
        backgroundColor: COLORS.primary,
        height: 54,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addToCartText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    outOfStockButton: {
        backgroundColor: '#B4A69A',
    },
    outOfStockText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
});
