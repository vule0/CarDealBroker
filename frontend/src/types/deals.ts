export interface Deal {
  id: number;
  make: string;
  model: string;
  year: number;
  image: string;
  leasePrice: number;
  term: number;
  downPayment: number;
  mileage: number;
  msrp: number;
  savings?: number;
  tags?: string[];
  description?: string;
}

// You can also export sample/mock data from here to use across components
export const sampleDeals: Deal[] = [
  {
    id: 1,
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    image: "./dist/images/deals/teslamodel3.webp",
    leasePrice: 499,
    term: 36,
    downPayment: 3000,
    mileage: 10000,
    msrp: 53990,
    // savings: 4500,
    tags: ["Electric", "Sedan", "Featured"],
    description: "Experience the future of driving with the Tesla Model 3. This all-electric sedan offers incredible range, performance, and advanced safety features."
  },
  {
    id: 2,
    make: "BMW",
    model: "X5",
    year: 2024,
    image: "./dist/images/deals/2024 bmw xdrive m60i.png",
    leasePrice: 699,
    term: 36,
    downPayment: 5000,
    mileage: 12000,
    msrp: 67900,
    // savings: 5200,
    tags: ["Luxury", "SUV", "Limited"],
    description: "Luxury meets performance in the new BMW X5. With its powerful engine, premium interior, and advanced technology, this SUV delivers the ultimate driving experience."
  },
  {
    id: 3,
    make: "Honda",
    model: "Accord Hybrid",
    year: 2023,
    image: "./dist/images/deals/accord_hybrid.png",
    leasePrice: 329,
    term: 36,
    downPayment: 2500,
    mileage: 12000,
    msrp: 33990,
    savings: 3000,
    tags: ["Hybrid", "Sedan", "Eco-friendly"],
    description: "The perfect balance of efficiency and performance. The Honda Accord Hybrid delivers exceptional fuel economy without sacrificing the comfort and reliability you expect."
  },
  {
    id: 4,
    make: "Mercedes-Benz",
    model: "GLE",
    year: 2024,
    image: "./dist/images/deals/2024-mercedes-benz-gle.png",
    leasePrice: 799,
    term: 36,
    downPayment: 6000,
    mileage: 10000,
    msrp: 79900,
    savings: 7200,
    tags: ["Luxury", "SUV", "Premium"],
    description: "Experience unmatched luxury and cutting-edge technology with the Mercedes-Benz GLE. This premium SUV offers superior comfort, exceptional performance, and distinctive styling."
  },
  {
    id: 5,
    make: "Toyota",
    model: "RAV4 Prime",
    year: 2023,
    image: "./dist/images/deals/2022-toyota-rav4-prime-xse.avif",
    leasePrice: 389,
    term: 36,
    downPayment: 3500,
    mileage: 10000,
    msrp: 41800,
    savings: 3800,
    tags: ["Hybrid", "SUV", "Popular"],
    description: "The best of both worlds with the Toyota RAV4 Prime. This plug-in hybrid SUV offers excellent electric range, powerful performance, and Toyota's legendary reliability."
  },
  {
    id: 6,
    make: "Audi",
    model: "Q7",
    year: 2024,
    image: "./dist/images/deals/24-Audi-Q7.png",
    leasePrice: 749,
    term: 36,
    downPayment: 5500,
    mileage: 10000,
    msrp: 72000,
    savings: 6300,
    tags: ["Luxury", "SUV", "Family"],
    description: "Experience the perfect blend of luxury and practicality with the Audi Q7. This three-row luxury SUV offers sophisticated design, cutting-edge technology, and impressive performance."
  }
]; 