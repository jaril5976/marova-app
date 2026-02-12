import { useState, useEffect } from 'react';
import { getHeroBanners } from '../api/api';
import { BannerSlidesEntity } from '../types';

export const useHeroBanner = () => {
    const [bannerSlides, setBannerSlides] = useState<BannerSlidesEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                setLoading(true);
                const data = await getHeroBanners();

                if (data && data.sections) {
                    const heroBannerSection = data.sections.find(
                        (section: any) => section._type === 'heroBanner'
                    );

                    if (heroBannerSection && heroBannerSection.slides) {
                        setBannerSlides(heroBannerSection.slides);
                    }
                }
                setLoading(false);
            } catch (err: any) {
                console.error('Error fetching hero banners:', err);
                setError(err.message || 'Failed to fetch hero banners');
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    return { bannerSlides, loading, error };
};
