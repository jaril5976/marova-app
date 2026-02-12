export interface BannerSlidesEntity {
    backgroundColor: string;
    ctaLink: string;
    ctaText: string;
    image: {
        asset: {
            url: string;
            _id: string;
            // ... any other properties you need
        };
    };
    subtitle: string;
    title: string;
}

export interface BannerSectionsEntity {
    sectionTitle: string;
    slides: BannerSlidesEntity[];
    _key: string;
    _type: string;
}

export interface BannersEntity {
    sections: BannerSectionsEntity[];
    slug: string | null;
    title: string;
}

export interface VideoReview {
    key: string;
    url: string;
    product: {
        _id: string;
        title: string;
        description: string;
        originalPrice?: number;
        salePrice: number;
        featuredImage: {
            src: string;
            alt?: string;
            width: number;
            height: number;
        };
        images: string[];
    };
}

export interface CustomerVideoReviewsEntity {
    title: string;
    description: string;
    videos: VideoReview[];
}
