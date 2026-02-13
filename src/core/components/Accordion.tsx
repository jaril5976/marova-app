import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme/theme';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

interface AccordionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const toggleAccordion = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsOpen(!isOpen);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={toggleAccordion}
                activeOpacity={0.7}
                style={styles.header}
            >
                <Text style={styles.title}>{title}</Text>
                {isOpen ? (
                    <ChevronUp size={20} color={COLORS.text} />
                ) : (
                    <ChevronDown size={20} color={COLORS.text} />
                )}
            </TouchableOpacity>
            {isOpen && (
                <View style={styles.content}>
                    {children}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.md,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    content: {
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.md,
    },
});
