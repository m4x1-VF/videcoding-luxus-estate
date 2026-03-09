const en = {
  // Navbar
  nav: {
    buy: "Buy",
    rent: "Rent",
    sell: "Sell",
    savedHomes: "Saved Homes",
  },

  // Home page sections
  home: {
    featuredTitle: "Featured Collections",
    featuredSubtitle: "Curated properties for the discerning eye.",
    viewAll: "View all",
    newInMarketTitle: "New in Market",
    newInMarketSubtitle: "Fresh opportunities added this week.",
  },

  // Search section
  search: {
    headline: "Find your",
    headlineAccent: "sanctuary",
    placeholder: "Search by city, neighborhood, or address...",
    button: "Search",
    filterChips: {
      all: "All",
      house: "House",
      apartment: "Apartment",
      villa: "Villa",
      penthouse: "Penthouse",
    },
  },

  // Filters modal
  filters: {
    title: "Filters",
    location: "Location",
    locationPlaceholder: "City, neighborhood, or address",
    priceRange: "Price Range",
    minPrice: "Min Price",
    maxPrice: "Max Price",
    propertyType: "Property Type",
    anyType: "Any Type",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    any: "Any",
    amenities: "Amenities & Features",
    amenityList: {
      pool: "Swimming Pool",
      gym: "Gym",
      parking: "Parking",
      ac: "Air Conditioning",
      wifi: "High-speed Wifi",
      patio: "Patio / Terrace",
    },
    clearAll: "Clear all filters",
    showHomes: "Show Homes",
  },

  // Status tabs
  status: {
    all: "All",
    buy: "Buy",
    rent: "Rent",
  },

  // Pagination
  pagination: {
    showing: "Showing page",
    of: "of",
    properties: "properties",
    prev: "Prev",
    next: "Next",
  },

  // Property card
  property: {
    beds: "Beds",
    baths: "Baths",
    perMonth: "/mo",
  },

  // Property details page
  details: {
    featured: "Featured",
    viewPhotos: "View All Photos",
    topRated: "Top Rated Agent",
    scheduleVisit: "Schedule Visit",
    contactAgent: "Contact Agent",
    propertyFeatures: "Property Features",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    garage: "Garage",
    aboutHome: "About this home",
    amenities: "Amenities",
    estPayment: "Estimated Payment",
    startingFrom: "Starting from",
    downPayment: "with 20% down",
    calcMortgage: "Calculate Mortgage",
    readMore: "Read more",
    copyright: "© 2026 LuxeEstate Inc. All rights reserved.",
  },
} as const;

type DeepString<T> = T extends string
  ? string
  : T extends object
  ? { [K in keyof T]: DeepString<T[K]> }
  : T;

export type Translations = DeepString<typeof en>;
export default en;
