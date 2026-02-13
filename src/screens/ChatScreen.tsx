import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../theme/theme';


export const ChatScreen = () => (
    <SafeAreaView style={styles.container}>

        <ScrollView contentContainerStyle={styles.centerContent}>
            <Text style={styles.text}>Chat Screen</Text>
        </ScrollView>
    </SafeAreaView>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
});
