import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { COLORS, SPACING } from '../../../theme/theme';
import useAuthStore from '../../../zustand/useAuthStore';
import { MapPin, Pencil, Check } from 'lucide-react-native';

interface CheckoutAddressSectionProps {
    onAddressChange?: (address: { street: string; city: string; zip: string }) => void;
}

export const CheckoutAddressSection: React.FC<CheckoutAddressSectionProps> = ({
    onAddressChange
}) => {
    const { user } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);

    const firstAddress = user?.addresses && user.addresses.length > 0 ? user.addresses[0] : null;

    // Form state
    const [street, setStreet] = useState(firstAddress?.street || '');
    const [city, setCity] = useState(firstAddress?.city || '');
    const [zip, setZip] = useState(firstAddress?.zip || '');

    useEffect(() => {
        if (onAddressChange) {
            onAddressChange({ street, city, zip });
        }
    }, [street, city, zip]);

    const handleToggleEdit = () => {
        setIsEditing(!isEditing);
    };

    return (
        <>
            <View style={styles.sectionHeader}>
                <View style={styles.titleContainer}>
                    <MapPin size={20} color={COLORS.text} />
                    <Text style={styles.sectionTitle}>Shipping Address</Text>
                </View>
                {!isEditing && (
                    <TouchableOpacity onPress={handleToggleEdit} style={styles.editButton}>
                        <Pencil size={16} color={COLORS.primary} />
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                )}
            </View>

            {isEditing ? (
                <View style={styles.addressForm}>
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
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleToggleEdit}
                    >
                        <Text style={styles.saveButtonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.addressDisplay}>
                    <Text style={styles.streetText}>{street || 'No street set'}</Text>
                    <Text style={styles.cityZipText}>
                        {city}{city && zip ? ', ' : ''}{zip}
                        {!city && !zip && 'No city/zip set'}
                    </Text>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: SPACING.sm,
        color: COLORS.text,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButtonText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    addressDisplay: {
        backgroundColor: '#F9FAFB',
        padding: SPACING.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    streetText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    cityZipText: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginTop: 4,
    },
    addressForm: {
        backgroundColor: '#F9FAFB',
        padding: SPACING.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    inputGroup: {
        marginBottom: SPACING.sm,
    },
    label: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginBottom: 4,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 10,
        fontSize: 15,
        color: COLORS.text,
        backgroundColor: '#FFF',
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: SPACING.sm,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
});
