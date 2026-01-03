const Property = require("../models/Property");
const User = require("../models/User");

// 1. Fetch properties with Search & Dashboard filtering
exports.getProperties = async (req, res) => {
  try {
    const { location, type, minPrice, maxPrice, bedrooms, role, userId } = req.query;
    let query = {};

    // Dashboard-specific filtering logic
    if (role && userId) {
      if (role === "owner") {
        query.owner = userId; // Show all properties listed by this user
      } else if (role === "buyer") {
        query.buyer = userId; // Show properties user has bought
        query.status = "sold";
      } else if (role === "renter") {
        query.renter = userId; // Show properties user is renting
        query.status = "rented";
      }
    } else {
      // General Search: Only show active listings
      query.status = "available";
    }

    // Flexible Location Search (Case-insensitive Regex)
    if (location && location.trim() !== "") {
      query.location = { $regex: location, $options: "i" };
    }

    // Property Type Filter (Mapping 'buy' intent to 'sell' type)
    if (type && type !== "all" && type !== "") {
      query.type = type;
    }

    // Numerical Filters
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

// 2. Get Single Property Details
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
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
      // Unsave: Remove from array
      user.savedProperties.splice(index, 1);
      await user.save();
      return res.json({ saved: false, message: "Removed from saved" });
    }
    
    // Save: Add to array
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
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user.savedProperties);
  } catch (err) {
    res.status(500).json({ message: "Error fetching saved items" });
  }
};

// 5. Clear All Saved Properties
exports.clearSavedProperties = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { savedProperties: [] } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Wishlist cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Clear failed" });
  }
};

// 6. Delete/Deactivate Listing (Owner Only)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Listing not found" });

    // Authorization Check
    if (property.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized to delete this listing" });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Listing successfully removed" });
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
      bathrooms: Number(req.body.bathrooms),
      area: Number(req.body.area),
      amenities,
      images: imageUrls,
      owner: req.userId,
    });
    
    await User.findByIdAndUpdate(req.userId, { $push: { listedProperties: property._id } });
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: "Failed to list property", error: error.message });
  }
};
// 9. Update existing property
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    let property = await Property.findById(id);

    if (!property) return res.status(404).json({ message: "Property not found" });

    // Verify ownership
    if (property.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized: You do not own this listing" });
    }

    // Update fields (excluding images for simplicity in this version)
    const updatedData = {
      ...req.body,
      price: Number(req.body.price),
      bedrooms: Number(req.body.bedrooms),
      bathrooms: Number(req.body.bathrooms),
      area: Number(req.body.area),
      // Parse amenities if they are sent as a string
      amenities: typeof req.body.amenities === 'string' ? JSON.parse(req.body.amenities) : req.body.amenities
    };

    property = await Property.findByIdAndUpdate(id, updatedData, { new: true });
    res.json({ message: "Property updated successfully!", property });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Failed to update property" });
  }
};