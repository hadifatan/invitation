import { db } from "./db";
import { storage } from "./storage";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Starting database seed...");

  const existingAdmin = await storage.getAdminUserByUsername("admin");
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await storage.createAdminUser({
      username: "admin",
      password: hashedPassword,
    });
    console.log("Created admin user: username='admin', password='admin123'");
  } else {
    console.log("Admin user already exists");
  }

  await storage.upsertSetting({
    key: "telegram_link",
    value: "https://t.me",
  });
  console.log("Created default Telegram link setting");

  const sampleInvitations = [
    {
      title: "Elegant Wedding Invitation",
      description: "A beautiful wedding invitation featuring soft pastel pink and gold accents with delicate floral borders. Perfect for romantic and sophisticated celebrations.",
      price: 45,
      imageUrl: "/api/sample-images/wedding",
    },
    {
      title: "Modern Birthday Party",
      description: "Contemporary birthday invitation with bold geometric shapes in teal and coral colors. Vibrant, fun, and perfect for modern celebrations.",
      price: 25,
      imageUrl: "/api/sample-images/birthday",
    },
    {
      title: "Luxurious Corporate Event",
      description: "Sophisticated corporate invitation with deep navy blue and metallic gold color scheme. Features elegant Art Deco patterns for premium business events.",
      price: 65,
      imageUrl: "/api/sample-images/corporate",
    },
    {
      title: "Rustic Outdoor Wedding",
      description: "Charming outdoor wedding invitation with earthy tones and watercolor wildflowers. Perfect for natural, organic celebrations.",
      price: 40,
      imageUrl: "/api/sample-images/rustic",
    },
    {
      title: "Sweet Baby Shower",
      description: "Whimsical baby shower invitation featuring soft pastels and cute illustrated animals. Cheerful and sweet design for welcoming new arrivals.",
      price: 30,
      imageUrl: "/api/sample-images/baby-shower",
    },
    {
      title: "Black Tie Gala",
      description: "Elegant formal invitation with sophisticated black and champagne gold palette. Features ornate Victorian scrollwork for upscale events.",
      price: 75,
      imageUrl: "/api/sample-images/gala",
    },
  ];

  const existingInvitations = await storage.getInvitations();
  
  if (existingInvitations.length === 0) {
    for (const invitation of sampleInvitations) {
      await storage.createInvitation(invitation);
    }
    console.log(`Created ${sampleInvitations.length} sample invitations`);
  } else {
    console.log("Sample invitations already exist");
  }

  console.log("Database seed completed!");
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
