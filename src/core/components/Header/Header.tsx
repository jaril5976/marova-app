import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu, Search, ShoppingCart, ShoppingCartIcon, User, UserCircle } from 'lucide-react-native';
import { COLORS, SPACING } from '../../../theme/theme';

export const Header = () => {
    return (
        <View style={styles.header}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../../../assets/images/LogoBW-02.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.headerActions}>
                <TouchableOpacity style={styles.iconButton}>
                    <ShoppingCartIcon color={COLORS.text} size={24} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        height: 40,
        // borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        backgroundColor: COLORS.background,
        paddingBottom: 10,
    },
    logoContainer: {
        flex: 1,
    },
    logoImage: {
        width: 120,
        height: 45,
    },
    headerActions: {
        width: '20%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    iconButton: {
        marginRight: SPACING.xs,
    },
});
