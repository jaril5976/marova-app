import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    FlatList,
    Image,
    TouchableOpacity,
    Animated,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { BannerSlidesEntity } from '../types';
import { COLORS, SPACING } from '../../../theme/theme';
import { Search, User } from 'lucide-react-native';
import { useCurrentUser } from '../../User/hooks/useCurrentUser';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface HeroBannerProps {
    bannerSlides: BannerSlidesEntity[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ bannerSlides }) => {
    const { currentUserData: user } = useCurrentUser();
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const navigation = useNavigation<any>();

    useEffect(() => {
        if (bannerSlides.length > 0) {
            const interval = setInterval(() => {
                const nextIndex = (activeIndex + 1) % bannerSlides.length;
                setActiveIndex(nextIndex);
                flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            }, 4000);

            return () => clearInterval(interval);
        }
    }, [activeIndex, bannerSlides.length]);

    const renderItem = ({ item }: { item: BannerSlidesEntity }) => {
        // Basic cleanup for HTML tags if any (like <br/>)
        const cleanTitle = item.title
            ?.replace(/<br\s*\/?>\s*/gi, '\n')
            .replace(/<[^>]*>?/gm, '')
            .replace(/\n\s+/g, '\n')
            || '';


        return (
            <View style={[styles.slide, { backgroundColor: item.backgroundColor || '#E3FFE6' }]}>
                <View style={styles.contentContainer}>
                    <View style={styles.textSection}>
                        <Text style={styles.title} numberOfLines={2}>
                            {cleanTitle}
                        </Text>
                        {item.subtitle && (
                            <Text style={styles.subtitle} numberOfLines={2}>
                                {item.subtitle}
                            </Text>
                        )}
                        {item.ctaText && (
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>{item.ctaText}</Text>
                                <Search size={18} color="#FFF" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {item.image?.asset?.url && (
                        <View style={styles.imageSection}>
                            <Image
                                source={{ uri: item.image.asset.url }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>
                    )}
                </View>

                {/* Bottom Gradient Overlay */}
                <View style={styles.gradientOverlay}>
                    <Svg height="100%" width="100%">
                        <Defs>
                            <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                                <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
                            </LinearGradient>
                        </Defs>
                        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
                    </Svg>
                </View>
            </View>
        );
    };

    const handleScroll = (event: any) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);
        if (roundIndex !== activeIndex) {
            setActiveIndex(roundIndex);
        }
    };

    if (!bannerSlides || bannerSlides.length === 0) return null;

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={bannerSlides}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                keyExtractor={(_, index) => index.toString()}
            />
            <View style={styles.pagination}>
                {bannerSlides.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            {
                                width: activeIndex === index ? 32 : 8,
                                backgroundColor: activeIndex === index ? '#000000' : 'rgba(0,0,0,0.2)',
                            },
                        ]}
                    />
                ))}
            </View>
            {/* Profile Header Overlay */}
            <TouchableOpacity style={styles.profileHeader} onPress={() => navigation.navigate('MainTabs', { screen: 'Account' })}>
                <View style={styles.avatarContainer}>
                    {user?.firstName ? (
                        <Text style={styles.avatarText}>{user?.firstName?.[0]}{user?.lastName?.[0]}</Text>
                    ) : (
                        <User size={26} color='#FFFFFF' />
                    )}
                </View>
                <View style={styles.profileInfo}>
                    <Text style={styles.userName}>{user?.firstName || 'User'} {user?.lastName || ''}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'No email'}</Text>
                </View>
            </TouchableOpacity>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        height: 400,
        position: 'relative',
    },
    slide: {
        width: width,
        height: 400,
        justifyContent: 'flex-start',
        paddingHorizontal: SPACING.md,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        marginTop: 80,
    },
    textSection: {
        flex: 1.2,
        paddingRight: SPACING.md,
    },
    imageSection: {
        flex: 0.8,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        lineHeight: 20,
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: 15,
        color: '#666',
        marginBottom: SPACING.lg,
        fontWeight: '500',
        lineHeight: 18,
    },
    button: {
        backgroundColor: COLORS.text,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: SPACING.md,
        paddingVertical: 10,
        borderRadius: 6,
        gap: 8,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 14,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    pagination: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: SPACING.lg,
        alignItems: 'center',
        gap: 8,
    },
    dot: {
        height: 4,
        borderRadius: 2,
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        pointerEvents: 'none',
    },
    profileHeader: {
        position: 'absolute',
        top: 60,
        left: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    profileInfo: {

    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        textShadowColor: 'rgba(255, 255, 255, 0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    userEmail: {
        fontSize: 14,
        color: COLORS.text,
        textShadowColor: 'rgba(255, 255, 255, 0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});
