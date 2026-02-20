
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { COLORS, SPACING } from '../../../theme/theme';
import useAuthStore from '../../../zustand/useAuthStore';
import { MapPin, Plus, CheckCircle2, Circle } from 'lucide-react-native';

interface CheckoutAddressSectionProps {
    selectedAddressId: string | null;
    onSelectAddress: (id: string) => void;
}

export const CheckoutAddressSection: React.FC<CheckoutAddressSectionProps> = ({
    selectedAddressId,
    onSelectAddress
}) => {
    const { user } = useAuthStore();
    const [isAddingNew, setIsAddingNew] = useState(false);

    // Form state for new address
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');

    const addresses = user?.addresses || [];

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <MapPin size={20} color={COLORS.text} />
                <Text style={styles.sectionTitle}>Shipping Address</Text>
            </View>

            {addresses.map((addr: any) => (
                <TouchableOpacity
                    key={addr.id}
                    style={[
                        styles.addressCard,
                        selectedAddressId === addr.id && styles.selectedCard
                    ]}
                    onPress={() => onSelectAddress(addr.id)}
                >
                    <View style={styles.addressInfo}>
                        <Text style={styles.streetText}>{addr.street}</Text>
                        <Text style={styles.cityZipText}>{addr.city}, {addr.zip}</Text>
                    </View>
                    {selectedAddressId === addr.id ? (
                        <CheckCircle2 size={24} color={COLORS.primary} />
                    ) : (
                        <Circle size={24} color="#E5E7EB" />
                    )}
                </TouchableOpacity>
            ))}

            {!isAddingNew ? (
                <TouchableOpacity
                    style={styles.addNewButton}
                    onPress={() => setIsAddingNew(true)}
                >
                    <Plus size={20} color={COLORS.primary} />
                    <Text style={styles.addNewText}>Add New Address</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.newAddressForm}>
                    <Text style={styles.formTitle}>New Shipping Address</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Street Address</Text>
                        <TextInput
                            style={styles.input}
                            value={street}
                            onChangeText={setStreet}
                            placeholder="Apartment, suite, unit, etc."
                        />
                    </View>
                    <View style={styles.grid}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: SPACING.sm }]}>
                            <Text style={styles.label}>City</Text>
                            <TextInput
                                style={styles.input}
                                value={city}
                                onChangeText={setCity}
                                placeholder="City"
                            />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Zip Code</Text>
                            <TextInput
                                style={styles.input}
                                value={zip}
                                onChangeText={setZip}
                                placeholder="Zip"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                    <View style={styles.formActions}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setIsAddingNew(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() => {
                                // Logic to save and select new address
                                setIsAddingNew(false);
                            }}
                        >
                            <Text style={styles.saveButtonText}>Save Address</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
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
    addressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: SPACING.sm,
        backgroundColor: '#FFF',
    },
    selectedCard: {
        borderColor: COLORS.primary,
        backgroundColor: '#F9FAFB',
    },
    addressInfo: {
        flex: 1,
    },
    streetText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    cityZipText: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    addNewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginTop: SPACING.sm,
    },
    addNewText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    newAddressForm: {
        backgroundColor: '#F9FAFB',
        padding: SPACING.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginTop: SPACING.sm,
    },
    formTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    inputGroup: {
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: COLORS.text,
        backgroundColor: '#FFF',
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    formActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: SPACING.sm,
    },
    cancelButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 8,
    },
    cancelButtonText: {
        color: COLORS.textMuted,
        fontSize: 14,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
