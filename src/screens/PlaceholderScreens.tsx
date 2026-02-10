import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/theme';

const ScreenPlaceholder = ({ title }: { title: string }) => (
    <View style={styles.container}>
        <Text style={styles.text}>{title} Screen</Text>
    </View>
);

export const CategoriesScreen = () => <ScreenPlaceholder title="Categories" />;
export const AccountScreen = () => <ScreenPlaceholder title="Account" />;
export const ChatScreen = () => <ScreenPlaceholder title="Chat" />;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
});
