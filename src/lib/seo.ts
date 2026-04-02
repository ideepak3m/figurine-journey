// SEO configuration and utilities

export const SITE_URL = "https://figureit.ca";

export interface PageMetadata {
    title: string;
    description: string;
    keywords: string;
    canonicalUrl: string;
    ogType: string;
    ogImage?: string;
}

export const generateTitle = (pageTitle: string): string => {
    return `${pageTitle} | Figure It - Handcrafted Figurines`;
};

export const generateCanonicalUrl = (path: string): string => {
    return `${SITE_URL}${path}`;
};

export const getPageMetadata = (path: string): PageMetadata => {
    const metadataMap: Record<string, PageMetadata> = {
        "/": {
            title: generateTitle("Home"),
            description: "Discover handcrafted figurines that capture your precious moments. Custom orders available for special occasions.",
            keywords: "figurines, handcrafted, custom, collectibles, gifts, keepsakes",
            canonicalUrl: generateCanonicalUrl("/"),
            ogType: "website",
            ogImage: generateCanonicalUrl("/og-image.jpg"),
        },
        "/shop": {
            title: generateTitle("Shop"),
            description: "Browse our collection of handcrafted figurines. Each piece is unique and made with care.",
            keywords: "shop, figurines, buy, collectibles, handmade",
            canonicalUrl: generateCanonicalUrl("/shop"),
            ogType: "website",
        },
        "/about": {
            title: generateTitle("About Roopa"),
            description: "Learn about Roopa, the artist behind Figure It, and her passion for creating handcrafted figurines.",
            keywords: "about, Roopa, artist, handcrafted, figurines, story",
            canonicalUrl: generateCanonicalUrl("/about"),
            ogType: "website",
        },
        "/contact": {
            title: generateTitle("Contact Us"),
            description: "Get in touch with us for custom orders, inquiries, or just to say hello.",
            keywords: "contact, inquiries, custom orders, email",
            canonicalUrl: generateCanonicalUrl("/contact"),
            ogType: "website",
        },
        "/custom-orders": {
            title: generateTitle("Custom Orders"),
            description: "Create your own unique handcrafted figurine. Share your vision and we'll bring it to life.",
            keywords: "custom orders, personalized, figurines, bespoke",
            canonicalUrl: generateCanonicalUrl("/custom-orders"),
            ogType: "website",
        },
    };

    return (
        metadataMap[path] || {
            title: generateTitle("Page"),
            description: "Handcrafted figurines that capture your precious moments.",
            keywords: "figurines, handcrafted, custom",
            canonicalUrl: generateCanonicalUrl(path),
            ogType: "website",
        }
    );
};
