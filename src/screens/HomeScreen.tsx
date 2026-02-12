import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Platform,
} from 'react-native';
import { COLORS, SPACING } from '../theme/theme';
import { HeroBanner } from '../imports/HomeScreen/components/HeroBanner';
import { ProductsCardSlider } from '../imports/HomeScreen/components/ProductsCardSlider';
import { useHeroBanner } from '../imports/HomeScreen/hooks/useHeroBanner';
import { CustomerReviewSlider } from '../imports/HomeScreen/components/CustomerReviewSlider';
import { getCustomerVideoReviews } from '../imports/HomeScreen/api/api';
import useProductStore, { Product } from '../zustand/useProductStore';
import { CustomerVideoReviewsEntity } from '../imports/HomeScreen/types';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../core/components/Header/Header';

const { width } = Dimensions.get('window');
const PRODUCT_WIDTH = (width - SPACING.md * 3) / 2;

export const HomeScreen = () => {
    const { bannerSlides, loading, error } = useHeroBanner();
    const { products, fetchProducts, isLoading } = useProductStore();
    const [videoReviews, setVideoReviews] = React.useState<CustomerVideoReviewsEntity | null>(null);

    useEffect(() => {
        fetchProducts();

        const fetchVideoReviews = async () => {
            try {
                const data = await getCustomerVideoReviews();
                setVideoReviews(data);
            } catch (error) {
                console.error("Error fetching video reviews:", error);
            }
        };

        fetchVideoReviews();
    }, []);

    const bestSelling = products.filter((item: Product) => item.isBestSeller);
    const newArrivals = products.filter((item: Product) => item.isNewArrival);

    return (
        <SafeAreaView style={styles.container}>
            <Header />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : (
                    <>
                        <HeroBanner bannerSlides={bannerSlides} />
                        <ProductsCardSlider
                            heading="Latest Drops"
                            subHeading="Fresh scents, just launched"
                            products={newArrivals}
                        />
                        <ProductsCardSlider
                            heading="Our Most Loved Scents"
                            subHeading="everyone loves"
                            products={bestSelling}
                        />
                        {videoReviews && <CustomerReviewSlider customerVideoReviews={videoReviews} />}
                    </>
                )}

            </ScrollView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        paddingBottom: Platform.OS === 'ios' ? 45 : 60,
    },
    loadingContainer: {
        height: 450,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
    },
    errorContainer: {
        height: 450,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.md,
    },
    errorText: {
        color: COLORS.error,
        textAlign: 'center',
    },
});
