export const defaultPackages = [
  { title: "Upper Mustang", details: "11 Days", price: "$2,455", originalPrices: null },
  { title: "Everest View from Patale", details: "Scenic mountain viewpoint tour", price: "$1,595", originalPrices: JSON.stringify(["$1,600", "$1,599"]) },
  { title: "Ruby Valley", details: "Full offroad", price: "$1,565", originalPrices: null },
  { title: "Everest Base Camp", details: "Motorbike tour", price: "$4,495", originalPrices: null },
  { title: "Manang Motorbike Tour", details: "6 Days", price: "$1,625", originalPrices: null },
];

export const defaultDestinations = [
  { name: "Upper Mustang", description: "Premium treks, lodges, permits and local expertise." },
  { name: "Everest View (Patale)", description: "Premium treks, lodges, permits and local expertise." },
  { name: "Ruby Valley", description: "Premium treks, lodges, permits and local expertise." },
  { name: "Everest Base Camp", description: "Premium treks, lodges, permits and local expertise." },
  { name: "Manang", description: "Premium treks, lodges, permits and local expertise." },
  { name: "Mustang Region", description: "Premium treks, lodges, permits and local expertise." },
  { name: "Annapurna Region", description: "Premium treks, lodges, permits and local expertise." },
  { name: "Everest Region", description: "Premium treks, lodges, permits and local expertise." },
];

export const defaultBikes = [
  { title: "Royal Enfield Himalayan Rental", price: "$45/day", features: "ABS · Luggage rack · Road support" },
  { title: "Dirt Bike Rental", price: "$65/day", features: "Trail ready · Helmet · Protective gear" },
  { title: "Guided Nepal Bike Expedition", price: "$190/day", features: "Lead rider · Mechanic · Permits" },
  { title: "Mustang Off-road Bike Tour", price: "$1,290", features: "7 days · High passes · Boutique stays" },
  { title: "Kathmandu Valley Ride", price: "$120/day", features: "Culture loop · Guide · Lunch stop" },
];

export const defaultTrekkingMenu = [
  {
    region: "Everest Region",
    items: [
      "Everest Base Camp Trek",
      "Everest Base Camp Trek with Helicopter Return",
      "EBC Premium Trek",
      "Everest Base Camp Short Trek",
      "Shortest Everest Base Camp Trek",
      "Everest Base Camp and Kala Patthar Trek",
      "Everest Base Camp Trek 12 Days",
      "Everest Base Camp Luxury Trek",
      "Everest Panorama Trek",
      "Everest View Trek",
      "EBC and Gokyo Valley Trek",
      "Everest Three Passes Trek",
      "EBC Trek with Island Peak Climb",
      "Everest Base Camp Trek by Road",
      "Everest Base Camp Budget Trek",
    ],
  },
  {
    region: "Annapurna Region",
    items: [
      "Annapurna Base Camp Trek",
      "Annapurna Circuit Trek",
      "Annapurna Base Camp Short Trek",
      "Ghorepani Poon Hill Trek",
      "Mardi Himal Trek",
      "Khopra Danda Trek",
      "Nar Phu Valley Trek",
    ],
  },
  {
    region: "Langtang & Manaslu",
    items: [
      "Langtang Trek",
      "Langtang Valley Group Join Trek",
      "Kyanjin Gompa Trek",
      "Langtang Helambu Trekking",
      "Helambu Trek",
      "Langtang Trek with Helicopter Return",
      "Manaslu Circuit Trek",
      "Manaslu Short Trek",
      "Manaslu Circuit Group Join Trek",
      "Manaslu Trek",
      "Manaslu Tsum Valley Trek",
      "Ganesh Himal Trek",
      "Manaslu Circuit Trek with Jeep Return",
      "Manaslu Circuit Trekking Nepal",
    ],
  },
  {
    region: "Remote Frontiers",
    items: [
      "Lower Dolpo Trek",
      "Upper Dolpo Trek",
      "Mugu to Mustang via Upper Dolpo",
      "Shey Phoksundo Trek",
      "Kanchenjunga Trekking",
      "Makalu Base Camp Trekking",
      "Upper Mustang Trek",
      "Lower Mustang Tour",
    ],
  },
];

export const defaultFeatures = [
  { icon: "✦", title: "Professional Guides", description: "Thoughtfully planned logistics, reliable people, and premium service details from arrival to farewell." },
  { icon: "◆", title: "Safe & Trusted", description: "Thoughtfully planned logistics, reliable people, and premium service details from arrival to farewell." },
  { icon: "◈", title: "Best Price Guarantee", description: "Thoughtfully planned logistics, reliable people, and premium service details from arrival to farewell." },
  { icon: "✧", title: "Customized Trips", description: "Thoughtfully planned logistics, reliable people, and premium service details from arrival to farewell." },
  { icon: "●", title: "24/7 Support", description: "Thoughtfully planned logistics, reliable people, and premium service details from arrival to farewell." },
  { icon: "◇", title: "Luxury Experience", description: "Thoughtfully planned logistics, reliable people, and premium service details from arrival to farewell." },
];

export const defaultTestimonials = [
  { quote: "A flawless Everest journey with luxury pacing and a guide who felt like family.", author: "Guest 1" },
  { quote: "The Mustang bike expedition was wild, safe, and beautifully organized.", author: "Guest 2" },
  { quote: "Every transfer, permit, lodge and surprise detail was handled with calm professionalism.", author: "Guest 3" },
];

export const defaultBlogPosts = [
  { title: "Trekking Tips", summary: "Practical advice for confident, comfortable, high-altitude travel." },
  { title: "Nepal Travel Guide", summary: "Practical advice for confident, comfortable, high-altitude travel." },
  { title: "Best Time to Visit Everest", summary: "Practical advice for confident, comfortable, high-altitude travel." },
];

export const defaultSettings: Record<string, string> = {
  company_name: "Everest Moto Tours & Travels",
  hero_eyebrow: "Luxury Nepal Adventures",
  hero_title: "Explore Nepal Beyond Limits",
  hero_subtitle: "Luxury Treks, Bike Adventures, Helicopter Tours & Lifetime Memories",
  about_title: "About Everest Moto Tours & Travels",
  about_description:
    "Trusted travel company specializing in trekking, luxury adventures, bike rentals, Nepal tours, helicopter returns, jungle safari, cultural journeys and customized holidays.",
  phone: "+977 980-000-0000",
  email: "hello@everestmototours.com",
  address: "Thamel, Kathmandu, Nepal",
  whatsapp: "9779800000000",
  stat_years: "30+",
  stat_travelers: "5000+",
  stat_packages: "100+",
  stat_support: "24/7",
};
