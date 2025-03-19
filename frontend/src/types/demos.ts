// import image1 from "../assets/demos/teslamodelY.webp";
// import image2 from "../assets/demos/2024bmwi7.avif"
// import image3 from "../assets/demos/2024-Honda-CR-V-hybrid.avif"
// import image4 from "../assets/demos/2024 benz eqs.png"
// import image5 from "../assets/demos/2024 prius prime.jpg"
// import image6 from "../assets/demos/2023-audi-e-tron-gt-rs-4wd-sedan-angular-front.avif"

export interface Demo {
  id: number;
  make: string;
  model: string;
  year: number;
  image_url: string;
  lease_price: number;
  term: number;
  down_payment: number;
  mileage: number;
  msrp: number;
  savings?: number;
  tags?: string[];
  description?: string;
}

// // Mock data for demo vehicles
// export const sampleDemos: Demo[] = [
//   {
//     id: 1,
//     make: "Tesla",
//     model: "Model Y",
//     year: 2024,
//     image_url: image1,
//     lease_price: 549,
//     term: 36,
//     down_payment: 3500,
//     mileage: 10000,
//     msrp: 56990,
//     savings: 5000,
//     tags: ["Electric", "SUV", "Featured"],
//     description: "Experience the future of driving with the Tesla Model Y. This all-electric SUV offers incredible range, performance, and advanced autopilot features."
//   },
//   {
//     id: 2,
//     make: "BMW",
//     model: "i7",
//     year: 2024,
//     image_url: image2,
//     lease_price: 899,
//     term: 36,
//     down_payment: 6000,
//     mileage: 12000,
//     msrp: 105700,
//     savings: 7500,
//     tags: ["Luxury", "Electric", "Limited"],
//     description: "Luxury meets sustainability in the all-electric BMW i7. Experience cutting-edge technology, premium interior, and impressive performance in BMW's flagship electric sedan."
//   },
//   {
//     id: 3,
//     make: "Honda",
//     model: "CR-V Hybrid",
//     year: 2024,
//     image_url: image3,
//     lease_price: 389,
//     term: 36,
//     down_payment: 2800,
//     mileage: 12000,
//     msrp: 37990,
//     savings: 3200,
//     tags: ["Hybrid", "SUV", "Eco-friendly"],
//     description: "Experience efficient SUV driving with the Honda CR-V Hybrid. Perfect for families, this spacious hybrid offers excellent fuel economy without sacrificing comfort or utility."
//   },
//   {
//     id: 4,
//     make: "Mercedes-Benz",
//     model: "EQS",
//     year: 2024,
//     image_url: image4,
//     lease_price: 999,
//     term: 36,
//     down_payment: 7000,
//     mileage: 10000,
//     msrp: 104400,
//     savings: 8000,
//     tags: ["Luxury", "Electric", "Premium"],
//     description: "Discover the pinnacle of electric luxury with the Mercedes-Benz EQS. This flagship electric sedan offers unmatched comfort, impressive range, and revolutionary technology."
//   },
//   {
//     id: 5,
//     make: "Toyota",
//     model: "Prius Prime",
//     year: 2024,
//     image_url: image5,
//     lease_price: 349,
//     term: 36,
//     down_payment: 2500,
//     mileage: 10000,
//     msrp: 35700,
//     savings: 2800,
//     tags: ["Hybrid", "Sedan", "Eco-friendly"],
//     description: "Experience the most efficient Prius ever with the Toyota Prius Prime. This plug-in hybrid offers exceptional electric range combined with Toyota's renowned reliability."
//   },
//   {
//     id: 6,
//     make: "Audi",
//     model: "e-tron GT",
//     year: 2023,
//     image_url: image6,
//     lease_price: 899,
//     term: 36,
//     down_payment: 6000,
//     mileage: 10000,
//     msrp: 106500,
//     savings: 7800,
//     tags: ["Luxury", "Electric", "Sports"],
//     description: "Experience Audi's vision of electric performance with the e-tron GT. This electric grand tourer combines stunning design with exhilarating acceleration and precise handling."
//   }
// ];
