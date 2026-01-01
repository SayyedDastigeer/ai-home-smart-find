const Property = require("../models/Property");
const User = require("../models/User");

// GET: Fetch all properties with dynamic filters
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

    if (bedrooms) {
      query.bedrooms = { $gte: Number(bedrooms) };
    }

    const properties = await Property.find(query).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching properties", error });
  }
};

// GET: Fetch a single property by ID (Fixes your 404 error)
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    
    res.json(property);
  } catch (error) {
    console.error("Error fetching single property:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// POST: Create a new listing with images
exports.listProperty = async (req, res) => {
  try {
    // Collect Cloudinary URLs from Multer
    const imageUrls = req.files ? req.files.map((file) => file.path) : [];

    // Parse amenities string from FormData back into an array
    const amenities = req.body.amenities ? JSON.parse(req.body.amenities) : [];

    const property = await Property.create({
      ...req.body,
      price: Number(req.body.price),
      bedrooms: Number(req.body.bedrooms),
      bathrooms: Number(req.body.bathrooms),
      area: Number(req.body.area),
      amenities: amenities,
      images: imageUrls,
      owner: req.userId,
    });

    await User.findByIdAndUpdate(req.userId, {
      $push: { listedProperties: property._id },
    });

    res.status(201).json(property);
  } catch (error) {
    console.error("Listing error:", error);
    res.status(400).json({ message: "Error listing property", error: error.message });
  }
};

// POST: Buy a property
exports.buyProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Not found" });
    
    property.status = "sold";
    await property.save();
    
    await User.findByIdAndUpdate(req.userId, { 
      $push: { boughtProperties: property._id } 
    });
    
    res.json({ message: "Property bought" });
  } catch (error) {
    res.status(500).json({ message: "Purchase failed" });
  }
};

// POST: Rent a property
exports.rentProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Not found" });
    
    property.status = "rented";
    await property.save();
    
    await User.findByIdAndUpdate(req.userId, { 
      $push: { rentedProperties: property._id } 
    });
    
    await User.findByIdAndUpdate(property.owner, { 
      $push: { givenOnRent: property._id } 
    });
    
    res.json({ message: "Property rented" });
  } catch (error) {
    res.status(500).json({ message: "Rental failed" });
  }
};
exports.toggleSaveProperty = async (req, res) => {
  try {
    const userId = req.userId;
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const user = await User.findById(userId);

const index = user.savedProperties.findIndex(
  (id) => id.toString() === propertyId
);

    if (index > -1) {
      user.savedProperties.splice(index, 1);
      await user.save();
      return res.json({ saved: false });
    }

    user.savedProperties.push(propertyId);
    await user.save();

    res.json({ saved: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.getSavedProperties = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("savedProperties"); // IMPORTANT

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.savedProperties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



// CLEAR ALL SAVED PROPERTIES
exports.clearSavedProperties = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.savedProperties = [];
    await user.save();

    res.status(200).json({ message: "All saved properties cleared" });
  } catch (error) {
    console.error("Clear saved error:", error);
    res.status(500).json({ message: "Failed to clear saved properties" });
  }
};
