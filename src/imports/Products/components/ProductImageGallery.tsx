import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { COLORS, SPACING } from '../../../theme/theme';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = width * 1.25;

interface ProductImageGalleryProps {
    images: string[];
    gender?: string;
    season?: string[];
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
    images,
    gender,
    season,
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const onScroll = (event: any) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);
        setActiveIndex(roundIndex);
    };

    const renderItem = ({ item }: { item: string }) => (
        <View style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={images}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                keyExtractor={(_, index) => index.toString()}
            />

            {/* Badges */}
            <View style={styles.badgesContainer}>
                {gender && (
                    <View style={styles.badgeGender}>
                        <Text style={styles.badgeTextWhite}>{gender}</Text>
                    </View>
                )}
                {season && season.length > 0 && (
                    <View style={styles.badgeSeason}>
                        <Text style={styles.badgeTextBlack}>{season[0]}</Text>
                    </View>
                )}
            </View>

            {/* Pagination Dots */}
            {images.length > 1 && (
                <View style={styles.pagination}>
                    {images.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                activeIndex === index && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>
            )}

            {/* Thumbnails */}
            {images.length > 1 && (
                <View style={styles.thumbnailContainer}>
                    {images.map((img, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                flatListRef.current?.scrollToIndex({ index });
                                setActiveIndex(index);
                            }}
                            style={[
                                styles.thumbnailWrap,
                                activeIndex === index && styles.activeThumbnail,
                            ]}
                        >
                            <Image source={{ uri: img }} style={styles.thumbnail} />
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        backgroundColor: COLORS.surface,
    },
    imageContainer: {
        width: width,
        height: IMAGE_HEIGHT,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    badgesContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 80 : 65,
        right: SPACING.md,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    badgeGender: {
        backgroundColor: '#000',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 6,
    },
    badgeSeason: {
        backgroundColor: COLORS.accent,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    badgeTextBlack: {
        color: '#000',
        fontSize: 12,
        fontWeight: '600',
    },
    badgeTextWhite: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 80,
        alignSelf: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(0,0,0,0.2)',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#000',
        width: 20,
    },
    thumbnailContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.background,
    },
    thumbnailWrap: {
        width: 60,
        height: 60,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'transparent',
        marginHorizontal: 6,
        overflow: 'hidden',
    },
    activeThumbnail: {
        borderColor: COLORS.primary,
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
});
