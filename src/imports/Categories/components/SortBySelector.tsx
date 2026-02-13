import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    FlatList,
    TouchableWithoutFeedback,
} from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { COLORS, SPACING } from '../../../theme/theme';
import useProductStore from '../../../zustand/useProductStore';

const SORT_OPTIONS = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
    { label: 'Price: Low to High', value: 'price-low-to-high' },
    { label: 'Price: High to Low', value: 'price-high-to-low' },
    { label: 'A to Z', value: 'a-to-z' },
    { label: 'Z to A', value: 'z-to-a' },
];

export const SortBySelector = () => {
    const { sortBy, setSortBy } = useProductStore();
    const [modalVisible, setModalVisible] = useState(false);

    const currentOption = SORT_OPTIONS.find((opt) => opt.value === sortBy) || SORT_OPTIONS[0];

    const handleSelect = (value: string) => {
        setSortBy(value);
        setModalVisible(false);
    };

    return (
        <View>
            <TouchableOpacity
                style={styles.selector}
                onPress={() => setModalVisible(true)}
            >
                <ChevronDown size={16} color={COLORS.text} style={styles.iconLeft} />
                <Text style={styles.label}>{currentOption.label}</Text>
                <ChevronDown size={16} color={COLORS.text} style={styles.iconRight} />
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Sort By</Text>
                                <FlatList
                                    data={SORT_OPTIONS}
                                    keyExtractor={(item) => item.value}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.optionItem}
                                            onPress={() => handleSelect(item.value)}
                                        >
                                            <Text
                                                style={[
                                                    styles.optionText,
                                                    item.value === sortBy && styles.selectedOptionText,
                                                ]}
                                            >
                                                {item.label}
                                            </Text>
                                            {item.value === sortBy && (
                                                <Check size={18} color={COLORS.primary} />
                                            )}
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.background,
    },
    label: {
        fontSize: 14,
        color: COLORS.text,
        marginHorizontal: 8,
    },
    iconLeft: {
        // In the image it looks like a sort icon, but lucide doesn't have an exact match for that specific one easily.
        // ChevronDown is fine for now as a placeholder for the dropdown behavior.
    },
    iconRight: {
        marginLeft: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        backgroundColor: COLORS.background,
        borderRadius: 16,
        padding: 20,
        maxHeight: '60%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: COLORS.text,
        textAlign: 'center',
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    optionText: {
        fontSize: 16,
        color: COLORS.text,
    },
    selectedOptionText: {
        fontWeight: 'bold',
        color: COLORS.primary,
    },
});
