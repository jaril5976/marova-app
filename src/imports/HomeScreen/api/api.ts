import { client } from '../../../../lib/sanity';

export const HOMEPAGE_QUERY = `*[_type == "homePage"][0]{
    title,
    slug,
    sections[] {
      ...,
  
      _type == "heroBanner" => {
        _type,
        sectionTitle,
        slides[] {
          title,
          subtitle,
          // description,
          ctaText,
          ctaLink,
          // discount,
          // label,
          backgroundColor,
          image {
            asset-> {
              _id,
              url
            }
          }
        }
      },
  
      _type == "promoBanner" => {
        _type,
        sectionTitle,
        banners[] {
          title,
          subtitle,
          buttonText,
          buttonLink,
          backgroundColor,
          image {
            asset-> {
              _id,
              url
            }
          }
        }
      },
  
      _type == "promoProductSection" => {
        _type,
        sectionTitle,
        products[] {
          title,
          subtitle,
          buttonText,
          buttonLink,
          backgroundColor,
          price,
          image {
            asset-> {
              _id,
              url
            }
          }
        }
      },
  
      _type == "dealOfTheDayBanner" => {
        _type,
        title,
        description,
        discount,
        label,
        ctaText,
        ctaLink,
        countdownEndDate,
        image {
          asset-> {
            _id,
            url
          }
        }
      },
  
      _type == "promoSection" => {
        _type,
        title,
        subtitle,
        description,
        buttonText,
        buttonLink,
        features[] {
          text,
          icon {
            asset-> {
              _id,
              url
            }
          }
        },
        image {
          asset-> {
            _id,
            url
          }
        }
      },
  
      _type == "sellingBanner" => {
        _type,
        title,
        subtitle,
        price,
        originalPrice,
        buttonText,
        buttonLink,
        image {
          asset-> {
            _id,
            url
          }
        }
      }
    }
  }`

export async function getHeroBanners() {
  const data = await client.fetch(HOMEPAGE_QUERY);
  return data;
}

export async function getAnnouncementBar() {
  const query = `*[_type == "announcementBar"]{ ... }`
  return await client.fetch(query)
}

export async function getCustomerVideoReviews() {
  const query = `
  *[_type == "videoReviews"][0]{
    ...,
    videos[]{
      "url": asset->url,
      product->{
        _id,
        title,
        description,
        id,
        originalPrice,
        salePrice,

        "featuredImage": {
          "src": images[0].asset->url,
          "alt": images[0].alt,
          "width": images[0].asset->metadata.dimensions.width,
          "height": images[0].asset->metadata.dimensions.height
        },

         "images": images[].asset->url,
      }
    }
  }
  `
  return await client.fetch(query)
}