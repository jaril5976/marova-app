import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { Menu, Search, ShoppingCart, User, Bell, SlidersHorizontal, Plus } from 'lucide-react-native';
import { COLORS, SPACING } from '../theme/theme';

const { width } = Dimensions.get('window');
const PRODUCT_WIDTH = (width - SPACING.md * 3) / 2;

export const DealScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/* Promo Bar */}
            <View style={styles.promoBar}>
                <Text style={styles.promoText}>LAUNCHES | BUY MORE, SAVE MORE | 25% PURE PERFUMES</Text>
            </View>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Menu color={COLORS.text} size={24} />
                </TouchableOpacity>
                <Text style={styles.logo}>MAROVA</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Search color={COLORS.text} size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <User color={COLORS.text} size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <ShoppingCart color={COLORS.text} size={24} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Title Section */}
                <View style={styles.titleSection}>
                    <Text style={styles.title}>All products</Text>
                    <View style={styles.divider} />
                </View>

                {/* Filters */}
                <TouchableOpacity style={styles.filterButton}>
                    <SlidersHorizontal color={COLORS.text} size={18} />
                    <Text style={styles.filterText}>All filters</Text>
                    <View style={styles.chevron} />
                </TouchableOpacity>

                {/* Products Grid */}
                <View style={styles.productsGrid}>
                    {PRODUCTS.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const ProductCard = ({ product }: { product: any }) => (
    <View style={styles.productCard}>
        <View style={styles.imageContainer}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
            {product.isNew && (
                <View style={styles.newBadge}>
                    <Plus size={12} color={COLORS.text} />
                    <Text style={styles.newBadgeText}>New In</Text>
                </View>
            )}
        </View>
        <View style={styles.productInfo}>
            <Text style={styles.productCategory}>{product.category}</Text>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.priceRow}>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>₹{product.price.toFixed(2)}</Text>
                </View>
                <View style={styles.sizeContainer}>
                    <Text style={styles.sizeText}>{product.size}</Text>
                </View>
            </View>

            {product.inStock ? (
                <TouchableOpacity style={styles.addToCartButton}>
                    <ShoppingCart size={16} color={COLORS.background} />
                    <Text style={styles.addToCartText}>Add to cart</Text>
                </TouchableOpacity>
            ) : (
                <View style={[styles.addToCartButton, styles.outOfStockButton]}>
                    <Text style={styles.outOfStockText}>Out Of Stock</Text>
                </View>
            )}
        </View>
    </View>
);

const PRODUCTS = [
    {
        id: '1',
        name: 'IVORYN',
        category: 'PARFUM FOR Women',
        price: 899,
        size: '50 ML',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80',
        inStock: true,
        isNew: false,
    },
    {
        id: '2',
        name: 'BOURNE',
        category: 'PARFUM FOR Men',
        price: 899,
        size: '50 ML',
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80',
        inStock: false,
        isNew: true,
    },
    {
        id: '3',
        name: 'IVORYN',
        category: 'PARFUM FOR Women',
        price: 899,
        size: '50 ML',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80',
        inStock: true,
        isNew: false,
    },
    {
        id: '4',
        name: 'BOURNE',
        category: 'PARFUM FOR Men',
        price: 899,
        size: '50 ML',
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80',
        inStock: true,
        isNew: false,
    },
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    promoBar: {
        backgroundColor: '#2D1E1E',
        paddingVertical: SPACING.sm,
        alignItems: 'center',
    },
    promoText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    logo: {
        fontSize: 22,
        fontWeight: '700',
        letterSpacing: 2,
        color: COLORS.text,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginLeft: SPACING.sm,
    },
    scrollContent: {
        paddingBottom: 100, // For tab bar
    },
    titleSection: {
        padding: SPACING.md,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        width: '100%',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginHorizontal: SPACING.md,
        marginVertical: SPACING.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 25,
    },
    filterText: {
        marginLeft: SPACING.sm,
        fontSize: 16,
        color: COLORS.text,
    },
    chevron: {
        marginLeft: SPACING.sm,
        width: 0,
        height: 0,
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderTopWidth: 5,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: COLORS.text,
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: SPACING.md,
        justifyContent: 'space-between',
    },
    productCard: {
        width: PRODUCT_WIDTH,
        marginBottom: SPACING.lg,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    imageContainer: {
        width: '100%',
        height: PRODUCT_WIDTH * 1.2,
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    newBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    newBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        marginLeft: 2,
        color: COLORS.text,
    },
    productInfo: {
        padding: SPACING.sm,
    },
    productCategory: {
        fontSize: 10,
        color: COLORS.secondary,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    priceContainer: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginRight: 8,
    },
    price: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    sizeContainer: {
        backgroundColor: '#F7F7F7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    sizeText: {
        fontSize: 12,
        color: COLORS.text,
        fontWeight: '600',
    },
    addToCartButton: {
        backgroundColor: '#1A1A1A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 6,
    },
    addToCartText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
        marginLeft: 8,
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
