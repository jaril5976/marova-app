import { client } from "../../../../lib/sanity"
import { ProductsEntity } from "../types/products"

export async function getProductById(id: string): Promise<ProductsEntity | null> {
    const query = `
    *[_type == "product" && _id == $id][0]{
      _id,
      title,
      originalPrice,
      salePrice,
      isInStock,
      stockQuantity,
      sizes,
      tags,
      scentProfile,
      longevity,
      projection,
      gender,
      season,
      "images": images[].asset->url,
      "category": category->title,
      accordionInfo[]{ name, content },
      metaTitle,
      metaDescription,
      "featuredImage": {
        "src": images[0].asset->url,
        "alt": images[0].alt,
        "width": images[0].asset->metadata.dimensions.width,
        "height": images[0].asset->metadata.dimensions.height
      },
      "relevantProducts": relevantProducts[]->{
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
      sizes
      
      }
    }

    
  `
    return await client.fetch(query, { id })
}