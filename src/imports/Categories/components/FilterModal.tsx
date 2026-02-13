import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    ScrollView,
    TextInput,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { COLORS, SPACING } from '../../../theme/theme';
import useProductStore from '../../../zustand/useProductStore';
import { SafeAreaView } from 'react-native-safe-area-context';

const GENDER_OPTIONS = ['Men', 'Women', 'Unisex'];
const SIZE_OPTIONS = ['30 ML', '50 ML', '100 ML'];
const DEFAULT_PRICE: [number, number] = [0, 1500];

export const FilterModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    const { filters, setFilters } = useProductStore();

    const [tempGender, setTempGender] = useState<string[]>(filters.gender);
    const [tempSize, setTempSize] = useState<string[]>(filters.size);
    const [minPrice, setMinPrice] = useState(filters.price[0].toString());
    const [maxPrice, setMaxPrice] = useState(filters.price[1].toString());

    useEffect(() => {
        if (visible) {
            setTempGender(filters.gender);
            setTempSize(filters.size);
            setMinPrice(filters.price[0].toString());
            setMaxPrice(filters.price[1].toString());
        }
    }, [visible, filters]);

    const toggleGender = (gender: string) => {
        setTempGender((prev) =>
            prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender]
        );
    };

    const toggleSize = (size: string) => {
        setTempSize((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        );
    };

    const handleApply = () => {
        setFilters({
            gender: tempGender,
            size: tempSize,
            price: [parseInt(minPrice) || 0, parseInt(maxPrice) || 1500],
        });
        onClose();
    };

    const handleClear = () => {
        setTempGender([]);
        setTempSize([]);
        setMinPrice('0');
        setMaxPrice('1500');
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Filters</Text>
                    <TouchableOpacity onPress={handleClear}>
                        <Text style={styles.clearText}>Clear All</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Gender</Text>
                        <View style={styles.optionsGrid}>
                            {GENDER_OPTIONS.map((gender) => (
                                <TouchableOpacity
                                    key={gender}
                                    style={[
                                        styles.option,
                                        tempGender.includes(gender) && styles.selectedOption,
                                    ]}
                                    onPress={() => toggleGender(gender)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            tempGender.includes(gender) && styles.selectedOptionText,
                                        ]}
                                    >
                                        {gender}
                                    </Text>
                                    {tempGender.includes(gender) && (
                                        <Check size={14} color="#FFF" style={styles.checkIcon} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Size</Text>
                        <View style={styles.optionsGrid}>
                            {SIZE_OPTIONS.map((size) => (
                                <TouchableOpacity
                                    key={size}
                                    style={[
                                        styles.option,
                                        tempSize.includes(size) && styles.selectedOption,
                                    ]}
                                    onPress={() => toggleSize(size)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            tempSize.includes(size) && styles.selectedOptionText,
                                        ]}
                                    >
                                        {size}
                                    </Text>
                                    {tempSize.includes(size) && (
                                        <Check size={14} color="#FFF" style={styles.checkIcon} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Price Range</Text>
                        <View style={styles.priceRow}>
                            <View style={styles.priceInputContainer}>
                                <Text style={styles.priceLabel}>Min</Text>
                                <TextInput
                                    style={styles.priceInput}
                                    value={minPrice}
                                    onChangeText={setMinPrice}
                                    keyboardType="numeric"
                                    placeholder="0"
                                />
                            </View>
                            <View style={styles.priceInputContainer}>
                                <Text style={styles.priceLabel}>Max</Text>
                                <TextInput
                                    style={styles.priceInput}
                                    value={maxPrice}
                                    onChangeText={setMaxPrice}
                                    keyboardType="numeric"
                                    placeholder="1500"
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                        <Text style={styles.applyButtonText}>Apply Filters</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    closeButton: {
        padding: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    clearText: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: SPACING.lg,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.background,
    },
    selectedOption: {
        backgroundColor: COLORS.text,
        borderColor: COLORS.text,
    },
    optionText: {
        fontSize: 14,
        color: COLORS.text,
    },
    selectedOptionText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    checkIcon: {
        marginLeft: 8,
    },
    priceRow: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    priceInputContainer: {
        flex: 1,
    },
    priceLabel: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginBottom: 4,
    },
    priceInput: {
        height: 48,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        color: COLORS.text,
    },
    footer: {
        padding: SPACING.lg,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    applyButton: {
        backgroundColor: COLORS.text,
        height: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
    },
    applyButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
