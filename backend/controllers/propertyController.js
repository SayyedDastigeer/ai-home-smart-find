const Property = require("../models/Property");
const User = require("../models/User");

// 1. Fetch properties with flexible search
exports.getProperties = async (req, res) => {
  try {
    const { location, type, minPrice, maxPrice, bedrooms, role, userId } = req.query;
    let query = {};

    // --- DASHBOARD SPECIFIC FILTERING ---
    if (role && userId) {
      if (role === "owner") {
        query.owner = userId; // Show everything I listed
      } else if (role === "buyer") {
        query.buyer = userId; // Show only what I bought
        query.status = "sold";
      } else if (role === "renter") {
        query.renter = userId; // Show only what I am renting
        query.status = "rented";
      }
    } else {
      // PUBLIC VIEW: If no role/userId, only show available listings
      query.status = "available";
    }

    // --- REGULAR SEARCH FILTERS ---
    if (location && location.trim() !== "") query.location = { $regex: location, $options: "i" };
    if (type && type !== "all" && type !== "") query.type = type;
    // ... rest of your price/bedroom filters
    
    const properties = await Property.find(query).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};

// 2. Single Property
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Not found" });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

// 3. Toggle Save Property
exports.toggleSaveProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const user = await User.findById(req.userId);
    const index = user.savedProperties.findIndex((id) => id.toString() === propertyId);

    if (index > -1) {
      user.savedProperties.splice(index, 1);
      await user.save();
      return res.json({ saved: false, message: "Removed from saved" });
    }
    user.savedProperties.push(propertyId);
    await user.save();
    res.json({ saved: true, message: "Added to saved" });
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};

// 4. Get All Saved Properties
exports.getSavedProperties = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("savedProperties");
    res.status(200).json(user.savedProperties);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};

// 5. Clear All Saved Properties
exports.clearSavedProperties = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { savedProperties: [] });
    res.status(200).json({ message: "All cleared" });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

// 6. List Property
exports.listProperty = async (req, res) => {
  try {
    const imageUrls = req.files ? req.files.map((f) => f.path) : [];
    const amenities = req.body.amenities ? JSON.parse(req.body.amenities) : [];
    const property = await Property.create({
      ...req.body,
      price: Number(req.body.price),
      bedrooms: Number(req.body.bedrooms),
      bathrooms: Number(req.body.bathrooms),
      area: Number(req.body.area),
      amenities,
      images: imageUrls,
      owner: req.userId,
    });
    await User.findByIdAndUpdate(req.userId, { $push: { listedProperties: property._id } });
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: "Error" });
  }
};

// 7. Buy Property (Secured)
exports.buyProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Not found" });

    if (property.owner.toString() === req.userId) {
      return res.status(403).json({ message: "You cannot buy your own property" });
    }

    if (property.status !== "available") {
      return res.status(400).json({ message: "Property no longer available" });
    }

    property.status = "sold";
    property.buyer = req.userId;
    await property.save();

    await User.findByIdAndUpdate(req.userId, { $push: { boughtProperties: property._id } });
    res.json({ message: "Property bought successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

// 8. Rent Property (Secured)
exports.rentProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Not found" });

    if (property.owner.toString() === req.userId) {
      return res.status(403).json({ message: "You cannot rent your own property" });
    }

    if (property.status !== "available") {
      return res.status(400).json({ message: "Property already rented" });
    }

    property.status = "rented";
    property.renter = req.userId;
    await property.save();

    await User.findByIdAndUpdate(req.userId, { $push: { rentedProperties: property._id } });
    await User.findByIdAndUpdate(property.owner, { $push: { givenOnRent: property._id } });
    res.json({ message: "Property rented successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};