import mongoose from "mongoose";
import dotenv from "dotenv";
import Room from "../models/Room.js";
import Admin from "../models/Admin.js";

dotenv.config();

const rooms = [
  {
    name: "Ocean View Surf Suite",
    description:
      "Wake up to the sound of waves in this stunning oceanfront suite. Perfect for surfers who want quick access to the best breaks. Features a private balcony with panoramic ocean views, king-size bed, and a surfboard rack. Watch world-class waves from your room and paddle out in minutes.",
    pricePerNight: 299,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
    ],
    totalRooms: 4,
    maxGuests: 2,
    amenities: [
      "Ocean View",
      "Private Balcony",
      "King Bed",
      "Surfboard Rack",
      "AC",
      "WiFi",
      "Mini Bar",
      "Room Service",
    ],
    category: "beachfront",
    isActive: true,
    seasonalDiscount: {
      isActive: true,
      percentage: 15,
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-03-31"),
    },
  },
  {
    name: "Tropical Garden Villa",
    description:
      "Experience luxury in our spacious tropical villa surrounded by lush gardens. This secluded retreat features a private pool, outdoor shower, and full kitchen. Ideal for families or groups looking for privacy and relaxation after a day of surfing.",
    pricePerNight: 499,
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
    ],
    totalRooms: 3,
    maxGuests: 6,
    amenities: [
      "Private Pool",
      "Garden View",
      "Full Kitchen",
      "Outdoor Shower",
      "BBQ",
      "AC",
      "WiFi",
      "Parking",
    ],
    category: "villa",
    isActive: true,
  },
  {
    name: "Surfer's Paradise Room",
    description:
      "Our classic surf room is designed for wave riders. Comfortable twin beds, surfboard storage, and a shared lounge where you can meet fellow surfers. Great value for solo travelers or surf buddies on an adventure.",
    pricePerNight: 129,
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ez4c5c1f?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
    ],
    totalRooms: 8,
    maxGuests: 2,
    amenities: [
      "Twin Beds",
      "Surfboard Storage",
      "Shared Lounge",
      "AC",
      "WiFi",
      "Lockers",
    ],
    category: "surf-room",
    isActive: true,
    seasonalDiscount: {
      isActive: true,
      percentage: 10,
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-02-28"),
    },
  },
  {
    name: "Beachfront Bungalow",
    description:
      "Step directly onto the sand from your private bungalow. This romantic getaway features a king bed, hammock on the deck, and unobstructed sunset views. Fall asleep to the rhythm of the waves just steps from your door.",
    pricePerNight: 349,
    images: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
    ],
    totalRooms: 5,
    maxGuests: 2,
    amenities: [
      "Beachfront",
      "King Bed",
      "Private Deck",
      "Hammock",
      "AC",
      "WiFi",
      "Outdoor Shower",
    ],
    category: "beachfront",
    isActive: true,
  },
  {
    name: "Surf Camp Dorm",
    description:
      "Join the surf community in our clean and comfortable dorms. Each bed features privacy curtains, personal reading light, power outlets, and a secure locker. Perfect for budget travelers who want to meet other surfers.",
    pricePerNight: 45,
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
    ],
    totalRooms: 20,
    maxGuests: 1,
    amenities: [
      "Single Bed",
      "Privacy Curtains",
      "Locker",
      "Shared Bathroom",
      "Common Kitchen",
      "WiFi",
    ],
    category: "dorm",
    isActive: true,
  },
  {
    name: "Deluxe Family Suite",
    description:
      "Spacious two-bedroom suite perfect for families. Features a master bedroom with king bed, kids room with bunk beds, fully equipped kitchen, and living area. Steps away from kid-friendly surf lessons.",
    pricePerNight: 389,
    images: [
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800",
    ],
    totalRooms: 4,
    maxGuests: 5,
    amenities: [
      "Two Bedrooms",
      "King Bed",
      "Bunk Beds",
      "Full Kitchen",
      "Living Area",
      "Pool View",
      "AC",
      "WiFi",
    ],
    category: "villa",
    isActive: true,
  },
];

const adminUser = {
  username: "owner",
  email: "owner@example.com",
  password: "Passw0rd!",
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📦 Connected to MongoDB");

    // Clear existing data
    await Room.deleteMany({});
    await Admin.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Drop the slug index to prevent duplicate key errors
    try {
      await mongoose.connection.collection("rooms").dropIndex("slug_1");
    } catch (e) {
      // Index may not exist
    }

    // Insert rooms one by one to trigger pre-save hooks for slug generation
    const createdRooms = [];
    for (const roomData of rooms) {
      const room = new Room(roomData);
      await room.save();
      createdRooms.push(room);
    }
    console.log(`✅ Created ${createdRooms.length} rooms`);

    // Create admin
    const admin = await Admin.create(adminUser);
    console.log(`✅ Created admin user: ${admin.email}`);

    console.log("\n🌊 Database seeded successfully!");
    console.log("\nAdmin Login Credentials:");
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Password: ${adminUser.password}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
