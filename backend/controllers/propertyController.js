const Property = require("../models/Property");
const User = require("../models/User");

exports.getProperties = async (req, res) => {
  try {
    const { 
      location, type, minPrice, maxPrice, bedrooms, 
      bathrooms, minArea, role, userId 
    } = req.query;
    
    // Start with a totally empty object
    let query = {};

    // 1. Dashboard Logic
    if (role && userId) {
      if (role === "owner") query.owner = userId;
      else if (role === "buyer") { query.buyer = userId; query.status = "sold"; }
      else if (role === "renter") { query.renter = userId; query.status = "rented"; }
    } else {
      query.status = "available"; 
    }

    // 2. String Filters (Only add if they have text)
    if (location && location.trim() !== "") {
      query.location = { $regex: location, $options: "i" };
    }
    
    if (type && type !== "" && type !== "all" && type !== "Any") {
      query.type = type;
    }

    // 3. Price Logic (Strict check to prevent NaN)
    const minP = parseInt(minPrice);
    const maxP = parseInt(maxPrice);
    if (!isNaN(minP) || !isNaN(maxP)) {
      query.price = {};
      if (!isNaN(minP)) query.price.$gte = minP;
      if (!isNaN(maxP)) query.price.$lte = maxP;
    }

    // 4. Bedrooms (Strict check)
    if (bedrooms && bedrooms !== "Any" && bedrooms !== "") {
      const bedVal = parseInt(bedrooms.toString().replace(/[^0-9]/g, ''));
      if (!isNaN(bedVal)) {
        query.bedrooms = { $gte: bedVal };
      }
    }

    // 5. Bathrooms (Strict check)
    if (bathrooms && bathrooms !== "Any" && bathrooms !== "") {
      const bathVal = parseFloat(bathrooms.toString().replace(/[^0-9.]/g, ''));
      if (!isNaN(bathVal)) {
        query.bathrooms = { $gte: bathVal };
      }
    }

    // 6. Area (Strict check)
    const areaVal = parseInt(minArea);
    if (minArea && !isNaN(areaVal)) {
      query.area = { $gte: areaVal };
    }

    console.log("EXECUTION QUERY:", query); // Check your server terminal to see this!

    const properties = await Property.find(query).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    console.error("CRITICAL ERROR:", error);
    res.status(500).json({ message: "Search Error", error: error.message });
  }
};
// 2. Get Single Property Details
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("owner", "name email phone");
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
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
    res.status(500).json({ message: "Save toggle failed" });
  }
};

// 4. Get User's Saved Properties
exports.getSavedProperties = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("savedProperties");
    res.status(200).json(user.savedProperties);
  } catch (err) {
    res.status(500).json({ message: "Error fetching saved items" });
  }
};

// 5. Clear All Saved Properties
exports.clearSavedProperties = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { $set: { savedProperties: [] } });
    res.status(200).json({ message: "Wishlist cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Clear failed" });
  }
};

// 6. Delete Listing
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property || property.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Listing removed" });
  } catch (error) {
    res.status(500).json({ message: "Delete operation failed" });
  }
};

// 7. Create New Listing
exports.listProperty = async (req, res) => {
  try {
    const imageUrls = req.files ? req.files.map((f) => f.path) : [];
    const amenities = req.body.amenities ? JSON.parse(req.body.amenities) : [];
    
    const property = await Property.create({
      ...req.body,
      price: Number(req.body.price),
      bedrooms: Number(req.body.bedrooms),
      bathrooms: Number(req.body.bathrooms || 1),
      area: Number(req.body.area),
      amenities,
      images: imageUrls,
      owner: req.userId,
    });
    
    await User.findByIdAndUpdate(req.userId, { $push: { listedProperties: property._id } });
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: "Listing failed", error: error.message });
  }
};

// 8. Update Property
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    let property = await Property.findById(id);

    if (!property || property.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedData = {
      ...req.body,
      price: Number(req.body.price),
      bedrooms: Number(req.body.bedrooms),
      bathrooms: Number(req.body.bathrooms),
      area: Number(req.body.area),
      amenities: typeof req.body.amenities === 'string' ? JSON.parse(req.body.amenities) : req.body.amenities
    };

    property = await Property.findByIdAndUpdate(id, updatedData, { new: true });
    res.json({ message: "Property updated successfully!", property });
  } catch (error) {
    res.status(500).json({ message: "Failed to update property" });
  }
};