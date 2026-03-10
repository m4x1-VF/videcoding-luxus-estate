import { Translations } from "./en";

const fr: Translations = {
  // Navbar
  nav: {
    buy: "Acheter",
    rent: "Louer",
    sell: "Vendre",
    savedHomes: "Maisons Sauvegardées",
    signIn: "Se connecter",
    signOut: "Se déconnecter",
  },

  // Home page sections
  home: {
    featuredTitle: "Collections en Vedette",
    featuredSubtitle: "Des propriétés sélectionnées pour l'œil averti.",
    viewAll: "Voir tout",
    newInMarketTitle: "Nouveaux sur le Marché",
    newInMarketSubtitle: "De nouvelles opportunités ajoutées cette semaine.",
  },

  // Search section
  search: {
    headline: "Trouvez votre",
    headlineAccent: "sanctuaire",
    placeholder: "Rechercher par ville, quartier ou adresse...",
    button: "Rechercher",
    filterChips: {
      all: "Tout",
      house: "Maison",
      apartment: "Appartement",
      villa: "Villa",
      penthouse: "Penthouse",
    },
  },

  // Filters modal
  filters: {
    title: "Filtres",
    location: "Localisation",
    locationPlaceholder: "Ville, quartier ou adresse",
    priceRange: "Fourchette de Prix",
    minPrice: "Prix Minimum",
    maxPrice: "Prix Maximum",
    propertyType: "Type de Propriété",
    anyType: "Tout Type",
    bedrooms: "Chambres",
    bathrooms: "Salles de Bain",
    any: "Indifférent",
    amenities: "Commodités & Caractéristiques",
    amenityList: {
      pool: "Piscine",
      gym: "Salle de Sport",
      parking: "Parking",
      ac: "Climatisation",
      wifi: "Wifi Haut Débit",
      patio: "Patio / Terrasse",
    },
    clearAll: "Effacer tous les filtres",
    showHomes: "Afficher les Biens",
  },

  // Status tabs
  status: {
    all: "Tout",
    buy: "Acheter",
    rent: "Louer",
  },

  // Pagination
  pagination: {
    showing: "Affichage de la page",
    of: "sur",
    properties: "propriétés",
    prev: "Précédent",
    next: "Suivant",
  },

  // Property card
  property: {
    beds: "Chambres",
    baths: "Salles de Bain",
    perMonth: "/mois",
  },

  // Property details page
  details: {
    featured: "En Vedette",
    viewPhotos: "Voir Toutes les Photos",
    viewPhotosCount: "Voir toutes les {count} photos",
    topRated: "Agent de Premier Plan",
    scheduleVisit: "Planifier une Visite",
    contactAgent: "Contacter l'Agent",
    propertyFeatures: "Caractéristiques",
    bedrooms: "Chambres",
    bathrooms: "Salles de Bain",
    garage: "Garage",
    aboutHome: "À propos de cette maison",
    amenities: "Commodités",
    estPayment: "Paiement Estimé",
    startingFrom: "À partir de",
    downPayment: "avec 20% d'acompte",
    calcMortgage: "Calculer l'Hypothèque",
    readMore: "Lire plus",
    copyright: "© 2026 LuxeEstate Inc. Tous droits réservés.",
    descriptionP1: "Découvrez le luxe moderne dans cette maison à l'architecture époustouflante située à {location}. Conçue en mettant l'accent sur la vie intérieure-extérieure, la résidence dispose d'espaces immaculés qui inondent les intérieurs de lumière naturelle.",
    descriptionP2: "{title} représente une opportunité unique pour les acheteurs exigeants à la recherche de {beds} chambres et {baths} salles de bain de pur confort, s'étendant sur plus de {area}. La cuisine à aire ouverte est équipée d'appareils haut de gamme et d'armoires sur mesure, parfaites pour les passionnés de cuisine.",
  },
};

export default fr;
