import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme/theme';

interface QuantitySelectorProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    disabled?: boolean;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
    value,
    onChange,
    min = 1,
    max = 99,
    disabled = false,
}) => {
    const handleDecrement = () => {
        if (!disabled && value > min) {
            onChange(value - 1);
        }
    };

    const handleIncrement = () => {
        if (!disabled && value < max) {
            onChange(value + 1);
        }
    };

    return (
        <View style={[styles.container, disabled && styles.disabledContainer]}>
            <TouchableOpacity
                onPress={handleDecrement}
                style={[styles.button, (disabled || value <= min) && styles.disabledButton]}
                disabled={disabled || value <= min}
            >
                <Minus size={16} color={disabled || value <= min ? COLORS.secondary : COLORS.text} />
            </TouchableOpacity>

            <Text style={[styles.value, disabled && styles.disabledValue]}>{value}</Text>

            <TouchableOpacity
                onPress={handleIncrement}
                style={[styles.button, (disabled || value >= max) && styles.disabledButton]}
                disabled={disabled || value >= max}
            >
                <Plus size={16} color={disabled || value >= max ? COLORS.secondary : COLORS.text} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        paddingHorizontal: 4,
        paddingVertical: 4,
        width: 100,
        backgroundColor: COLORS.surface,
    },
    button: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        backgroundColor: 'transparent',
    },
    disabledButton: {
        opacity: 0.5,
    },
    disabledContainer: {
        opacity: 0.6,
        backgroundColor: COLORS.border,
    },
    disabledValue: {
        color: COLORS.secondary,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginHorizontal: 8,
    },
});
