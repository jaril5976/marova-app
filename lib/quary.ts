import { client } from './sanity';

interface Filters {
  gender?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  sizes?: string[];
  gender?: string;
}

export async function getAllProducts(): Promise<Product[]> {
  return await client.fetch(`*[_type == "product"]`);
}

export async function getAllGenders(): Promise<string[]> {
  const genders: string[] = await client.fetch(
    `*[_type == "product" && defined(gender)].gender`,
  );

  return Array.from(new Set(genders)).filter(Boolean);
}

export async function getAllSizes(): Promise<string[]> {
  const sizesArray: { sizes?: string[] }[] = await client.fetch(
    `*[_type == "product"]{sizes}`,
  );

  const sizes = sizesArray.flatMap(p => p.sizes || []);

  return Array.from(new Set(sizes)).filter(Boolean);
}

export async function getFilteredProducts(
  filters: Filters = {},
  page = 1,
  pageSize = 6,
) {
  const { gender, size, minPrice, maxPrice } = filters;

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  let query = `*[_type == "product"`;
  const params: Record<string, any> = {};

  if (gender) {
    const genderArray = gender.split(',');
    if (genderArray.length > 0) {
      query += ` && gender in $genderArray`;
      params.genderArray = genderArray;
    }
  }

  if (size) {
    const sizeArray = size.split(',');
    if (sizeArray.length > 0) {
      query += ` && count((sizes)[@ in $sizeArray]) > 0`;
      params.sizeArray = sizeArray;
    }
  }

  if (minPrice !== undefined && maxPrice !== undefined) {
    query += ` && coalesce(salePrice, originalPrice) >= $minPrice && coalesce(salePrice, originalPrice) <= $maxPrice`;
    params.minPrice = minPrice;
    params.maxPrice = maxPrice;
  }

  query += `] {
    _id,
    title,
    "price": coalesce(salePrice, originalPrice),
    "featuredImage": {
      "src": images[0].asset->url,
      "alt": images[0].alt,
      "width": images[0].asset->metadata.dimensions.width,
      "height": images[0].asset->metadata.dimensions.height
    },
    sizes,
    gender
  }`;

  const countQuery = query.replace(/\[.*\] {.*}$/, ']');

  const totalCount: number = await client.fetch(`count(${countQuery})`, params);

  const paginatedQuery = `${query}[${start}...${end}]`;

  const products = await client.fetch(paginatedQuery, params);

  return {
    products,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
    hasNextPage: end < totalCount,
    hasPrevPage: start > 0,
  };
}

export async function getPriceRange(): Promise<{ min: number; max: number }> {
  try {
    const products: {
      effectivePrice?: number;
    }[] = await client.fetch(`
      *[_type == "product"] {
        originalPrice,
        salePrice,
        "effectivePrice": coalesce(salePrice, originalPrice)
      }
    `);

    const prices = products
      .map(p => p.effectivePrice)
      .filter((price): price is number => price != null);

    if (prices.length === 0) {
      return { min: 0, max: 0 };
    }

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return { min, max };
  } catch (error) {
    console.error('Error fetching price range:', error);
    return { min: 0, max: 0 };
  }
}

export async function getProductCards() {
  return await client.fetch(`
    *[_type == "product"]{
      _id,
      title,
      "price": coalesce(salePrice, originalPrice),
      "featuredImage": {
        "src": images[0].asset->url,
        "alt": images[0].alt,
        "width": images[0].asset->metadata.dimensions.width,
        "height": images[0].asset->metadata.dimensions.height
      },
      isBestSeller,
      isNewArrival,
      "images": images[].asset->url,
      gender,
      sizes,
      _createdAt,
      stockQuantity
    }
  `);
}
