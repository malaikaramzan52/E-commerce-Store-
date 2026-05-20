import prod1 from '../assets/l1.webp';
import prod1_2 from '../assets/l1(2).webp';
import prod1_3 from '../assets/l1(3).webp';
import prod1_4 from '../assets/l1(4).webp';
import prod2 from '../assets/l2.webp';
import prod2_2 from '../assets/l2(2).webp';
import prod2_3 from '../assets/l2(3).webp';
import prod2_4 from '../assets/l2(4).webp';
import prod3 from '../assets/l3.webp';
import prod3_2 from '../assets/l3(1).webp';
import prod3_3 from '../assets/l3(2).webp';
import prod3_4 from '../assets/l3(3).webp';
import prod4 from '../assets/l4.webp';
import prod4_2 from '../assets/l4(1).webp';
import prod4_3 from '../assets/l4(2).webp';
import prod4_4 from '../assets/l4(3).webp';
import prod5 from '../assets/l5.webp';
import prod5_2 from '../assets/l5(1).webp';
import prod5_3 from '../assets/l5(2).jpg';
import prod5_4 from '../assets/l5(4).jpg';
import prod6 from '../assets/l6.webp';
import prod6_2 from '../assets/l6(1).webp';
import prod6_3 from '../assets/l6(2).webp';
import prod6_4 from '../assets/l6(3).webp';

export const PRODUCTS = [
  {
    id: 1,
    name: "Intricate Formal Lawn",
    price: 12500,
    category: "Pret Wear",
    fabric: "Lawn",
    image: prod1,
    images: [prod1, prod1_2, prod1_3, prod1_4],
    badge: "Limited",
    description: "Indulge in the finest ethnic craftsmanship. This piece from our Pret Wear collection is intricately designed with premium fabrics and traditional patterns, ensuring you stand out with elegance and grace. Perfect for festive occasions and formal gatherings."
  },
  {
    id: 2,
    name: "Gold Threaded Velvet",
    price: 15500,
    category: "Luxury Winter",
    fabric: "Velvet",
    image: prod2,
    images: [prod2, prod2_2, prod2_3, prod2_4],
    badge: "New",
    description: "Experience the royal warmth of our Gold Threaded Velvet piece. Meticulously crafted for cold-weather elegance, featuring rich textures and timeless gold embroidery."
  },
  {
    id: 3,
    name: "Embroidered Organza",
    price: 22000,
    category: "Festive Couture",
    fabric: "Organza",
    image: prod3,
    images: [prod3, prod3_2, prod3_3, prod3_4],
    badge: "Limited",
    description: "A ethereal vision in Embroidered Organza. This festive masterpiece combines delicate floral patterns with a structured silhouette for a truly sophisticated look."
  },
  {
    id: 4,
    name: "Classic Silk Suit",
    price: 11000,
    category: "Daily Pret",
    fabric: "Silk",
    image: prod4,
    images: [prod4, prod4_2, prod4_3, prod4_4],
    badge: null,
    description: "Effortless grace for everyday wear. Our Classic Silk Suit is breathable, luxurious, and features a subtle sheen that transitions perfectly from morning to evening."
  },
  {
    id: 5,
    name: "Midnight Aura Chiffon",
    price: 13500,
    category: "Evening Unstitched",
    fabric: "Chiffon",
    image: prod5,
    images: [prod5, prod5_2, prod5_3, prod5_4],
    badge: "Bestseller",
    description: "Make a statement with our Midnight Aura Chiffon ensemble. Designed for elegant evening affairs, it features delicate detailed borders, ensuring a look that exudes effortless glamour."
  },
  {
    id: 6,
    name: "Emerald Silk Drapery",
    price: 14500,
    category: "Luxury Pret",
    fabric: "Silk",
    image: prod6,
    images: [prod6, prod6_2, prod6_3, prod6_4],
    badge: "New",
    description: "A masterpiece in rich silk, the Emerald Silk Drapery features intricate hand-embroidery and a silhouette that flows with unparalleled grace. Part of our exclusive home collection."
  }
];
