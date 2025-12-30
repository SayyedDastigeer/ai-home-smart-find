const Property = require("../models/Property");
const User = require("../models/User");

// GET: Fetch properties with filters
exports.getProperties = async (req, res) => {
  try {
    const { minPrice, maxPrice, type, bedrooms } = req.query;
    let query = { status: "available" };

    if (type) query.type = type;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };

    const properties = await Property.find(query).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching properties", error });
  }
};

// POST: List a new property (with Cloudinary images)
exports.listProperty = async (req, res) => {
  try {
    // 1. Parse amenities if they come as a string from FormData
    const amenities = req.body.amenities ? JSON.parse(req.body.amenities) : [];

    // 2. Get image URLs from Multer (populated by Cloudinary)
    const imageUrls = req.files ? req.files.map((file) => file.path) : [];

    // 3. Create the property
    const property = await Property.create({
      ...req.body,
      amenities,
      images: imageUrls,
      owner: req.userId, // Ensure your authMiddleware sets req.userId
    });

    // 4. Update user's listedProperties array
    await User.findByIdAndUpdate(req.userId, {
      $push: { listedProperties: property._id },
    });

    res.status(201).json(property);
  } catch (error) {
    console.error("List Property Error:", error);
    res.status(400).json({ message: "Error listing property", error: error.message });
  }
};

// POST: Buy a property
exports.buyProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    property.status = "sold";
    await property.save();

    await User.findByIdAndUpdate(req.userId, {
      $push: { boughtProperties: property._id },
    });

    res.json({ message: "Property bought" });
  } catch (error) {
    res.status(500).json({ message: "Purchase failed", error });
  }
};

// POST: Rent a property
exports.rentProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    property.status = "rented";
    await property.save();

    await User.findByIdAndUpdate(req.userId, {
      $push: { rentedProperties: property._id },
    });

    await User.findByIdAndUpdate(property.owner, {
      $push: { givenOnRent: property._id },
    });

    res.json({ message: "Property rented" });
  } catch (error) {
    res.status(500).json({ message: "Rental failed", error });
  }
}; // Fixed: All braces now closed correctly