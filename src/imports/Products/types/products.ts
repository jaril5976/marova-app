export interface ProductsEntity {
    _id: string
    id?: string
    title: string
    originalPrice: number
    salePrice?: number
    isInStock?: boolean
    stockQuantity: number
    images?: string[]
    category?: string
    sizes?: string[]
    tags?: string[]
    scentProfile?: string[]
    isExpertChoice?: boolean
    isBestSeller?: boolean
    isNewArrival?: boolean
    accordionInfo?: {
        name: string
        content: string
    }[]
    longevity?: string
    projection?: string
    season?: string[]
    gender?: string
    metaTitle: string
    metaDescription: string
    relevantProducts?: any
    featuredImage?: any
    averageRating: number
    reviewCount: number
}
