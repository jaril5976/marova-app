import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { CustomerVideoReviewsEntity, VideoReview } from '../types';
import { COLORS, SPACING } from '../../../theme/theme';
import { useNavigation } from '@react-navigation/native';

interface CustomerReviewSliderProps {
    customerVideoReviews: CustomerVideoReviewsEntity;
}

const { width } = Dimensions.get('window');
const VIDEO_WIDTH = width * 0.7;
const VIDEO_HEIGHT = VIDEO_WIDTH * 1.5;

export const CustomerReviewSlider: React.FC<CustomerReviewSliderProps> = ({ customerVideoReviews }) => {
    const navigation = useNavigation();

    if (!customerVideoReviews || !customerVideoReviews.videos || customerVideoReviews.videos.length === 0) {
        return null;
    }

    const handleVideoPress = (video: VideoReview) => {
        console.log('Video pressed:', video.url);
    };

    const renderItem = ({ item }: { item: VideoReview }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={styles.cardContainer}
                onPress={() => handleVideoPress(item)}
            >
                <View style={styles.videoThumbnailContainer}>
                    {/* Placeholder for video thumbnail - utilizing product image if available, or a color block */}
                    <Image
                        source={{ uri: item.product.featuredImage.src }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                    />
                    <View style={styles.playButtonOverlay}>
                        <View style={styles.playButton}>
                            <Text style={styles.playIcon}>▶</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.productInfo}>
                    <Text style={styles.productTitle} numberOfLines={1}>{item.product.title}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.salePrice}>₹{item.product.salePrice}</Text>
                        {item.product.originalPrice && (
                            <Text style={styles.originalPrice}>₹{item.product.originalPrice}</Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.heading}>{customerVideoReviews.title || 'Customer Reviews'}</Text>
                {customerVideoReviews.description && (
                    <Text style={styles.subHeading}>{customerVideoReviews.description}</Text>
                )}
            </View>

            <FlatList
                data={customerVideoReviews.videos}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                keyExtractor={(item, index) => item.key || index.toString()}
                renderItem={renderItem}
                snapToInterval={VIDEO_WIDTH + SPACING.md}
                decelerationRate="fast"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: SPACING.lg,
    },
    header: {
        marginBottom: SPACING.md,
        paddingHorizontal: SPACING.md,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    subHeading: {
        fontSize: 14,
        color: COLORS.textMuted,
    },
    listContent: {
        paddingHorizontal: SPACING.md,
    },
    cardContainer: {
        width: VIDEO_WIDTH,
        marginRight: SPACING.md,
        borderRadius: 12,
        backgroundColor: COLORS.surface,
        overflow: 'hidden',
        // elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    videoThumbnailContainer: {
        height: VIDEO_HEIGHT,
        width: '100%',
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    playButtonOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff',
    },
    playIcon: {
        color: '#fff',
        fontSize: 20,
        marginLeft: 4,
    },
    productInfo: {
        padding: SPACING.sm,
    },
    productTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 4,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    salePrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginRight: 6,
    },
    originalPrice: {
        fontSize: 12,
        color: COLORS.textMuted,
        textDecorationLine: 'line-through',
    },
});
