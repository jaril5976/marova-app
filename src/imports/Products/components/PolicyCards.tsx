import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Truck, RotateCcw, Globe, DollarSign } from 'lucide-react-native';
import { COLORS, SPACING } from '../../../theme/theme';

const POLICIES = [
    {
        name: 'Free shipping',
        desc: 'On orders over ₹500',
        icon: Truck,
        color: '#FEF2F2', // Light red
        borderColor: '#FECACA',
    },
    {
        name: 'Easy returns',
        desc: 'Just phone number',
        icon: RotateCcw,
        color: '#F0F9FF', // Light blue
        borderColor: '#BAE6FD',
    },
    {
        name: 'Nationwide Delivery',
        desc: 'Fast delivery nationwide',
        icon: Globe,
        color: '#F0FDF4', // Light green
        borderColor: '#BBF7D0',
    },
    {
        name: 'Refunds policy',
        desc: '60 days return policy',
        icon: DollarSign,
        color: '#FFFBEB', // Light amber
        borderColor: '#FEF3C7',
    },
];

export const PolicyCards: React.FC = () => {
    return (
        <View style={styles.container}>
            {POLICIES.map((item, index) => (
                <View
                    key={index}
                    style={[
                        styles.card,
                        { backgroundColor: item.color, borderColor: item.borderColor }
                    ]}
                >
                    <item.icon size={24} color={COLORS.text} />
                    <View style={styles.textContainer}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.desc}>{item.desc}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: SPACING.xl,
        gap: SPACING.md,
    },
    card: {
        width: '47%',
        padding: SPACING.md,
        borderRadius: 12,
        borderWidth: 1,
    },
    textContainer: {
        marginTop: SPACING.sm,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    desc: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 2,
    },
});
