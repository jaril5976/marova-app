import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react-native';
import { COLORS, SPACING } from '../theme/theme';

import useProductStore from '../zustand/useProductStore';
import { ProductCard } from '../imports/HomeScreen/components/ProductCard';
import { SortBySelector } from '../imports/Categories/components/SortBySelector';
import { FilterModal } from '../imports/Categories/components/FilterModal';

const { width } = Dimensions.get('window');

export const DealsScreen = () => {
    const {
        fetchProducts,
        isLoading,
        paginatedProducts,
        currentPage,
        totalPages,
        goToPage,
        products,
        filters,
    } = useProductStore();

    const [filterModalVisible, setFilterModalVisible] = useState(false);

    const activeFilterCount =
        filters.gender.length +
        filters.size.length +
        (filters.price[0] !== 0 || filters.price[1] !== 1500 ? 1 : 0);

    useEffect(() => {
        if (products.length === 0) {
            fetchProducts();
        }
    }, []);

    const currentProducts = paginatedProducts();

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        return (
            <View style={styles.pagination}>
                <TouchableOpacity
                    style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                    onPress={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft size={20} color={currentPage === 1 ? '#CCC' : COLORS.text} />
                </TouchableOpacity>

                <View style={styles.pageNumbers}>
                    {[...Array(totalPages)].map((_, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[styles.pageNumber, currentPage === i + 1 && styles.activePageNumber]}
                            onPress={() => goToPage(i + 1)}
                        >
                            <Text
                                style={[
                                    styles.pageText,
                                    currentPage === i + 1 && styles.activePageText,
                                ]}
                            >
                                {i + 1}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
                    onPress={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight size={20} color={currentPage === totalPages ? '#CCC' : COLORS.text} />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>


            <View style={styles.content}>
                <Text style={styles.title}>All Collections</Text>

                <View style={styles.filterRow}>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setFilterModalVisible(true)}
                    >
                        <Text style={styles.filterButtonText}>All Filters</Text>
                        <SlidersHorizontal size={16} color={COLORS.text} />
                        {activeFilterCount > 0 && (
                            <View style={styles.filterBadge}>
                                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <SortBySelector />
                </View>

                <View style={styles.divider} />

                {isLoading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                ) : (
                    <FlatList
                        data={currentProducts}
                        numColumns={2}
                        renderItem={({ item }) => (
                            <View style={styles.cardWrapper}>
                                <ProductCard product={item} />
                            </View>
                        )}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={styles.gridContent}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No Products Found..</Text>
                            </View>
                        )}
                        ListFooterComponent={renderPagination}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>

            <FilterModal
                visible={filterModalVisible}
                onClose={() => setFilterModalVisible(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: SPACING.md,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
        marginVertical: SPACING.md,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: 8,
        position: 'relative', // Necessary for badge positioning
    },
    filterButtonText: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '600',
    },
    filterBadge: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#000000',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#FFFFFF',
    },
    filterBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginBottom: SPACING.lg,
    },
    gridContent: {
        paddingBottom: 100, // Extra space for tabBar
    },
    cardWrapper: {
        flex: 0.5,
        // Remove fixed width from ProductCard if needed or ensure it fits
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.textMuted,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.xl,
        marginBottom: 40,
        gap: SPACING.sm,
    },
    pageNumbers: {
        flexDirection: 'row',
        gap: SPACING.xs,
    },
    pageNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activePageNumber: {
        backgroundColor: COLORS.text,
    },
    pageText: {
        fontSize: 14,
        color: COLORS.text,
    },
    activePageText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    pageButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: COLORS.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
});
