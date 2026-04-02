// Structured Data for schema.org markup

import { SITE_URL } from "./seo";

export interface ProductSchema {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl?: string;
    isAvailable: boolean;
}

export interface BreadcrumbItem {
    label: string;
    url: string;
}

export const generateLocalBusinessSchema = () => {
    return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Figure It",
        description: "Handcrafted figurines that capture your precious moments",
        url: SITE_URL,
        telephone: "+1-888-FIGUREIT", // Update with actual phone
        address: {
            "@type": "PostalAddress",
            streetAddress: "", // Add actual address if available
            addressLocality: "Toronto",
            addressRegion: "ON",
            postalCode: "",
            addressCountry: "CA",
        },
    };
};

export const generateProductSchema = (product: ProductSchema) => {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.description,
        image: product.imageUrl,
        offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "CAD",
            availability: product.isAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: `${SITE_URL}/shop/${product.id}`,
        },
    };
};

export const generateBreadcrumbSchema = (breadcrumbs: BreadcrumbItem[]) => {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.label,
            item: crumb.url,
        })),
    };
};

export const getSchemaScriptContent = (schema: object): string => {
    return JSON.stringify(schema);
};
