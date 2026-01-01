const Property = require("../models/Property");
const User = require("../models/User");

// 1. Fetch properties with flexible search
exports.getProperties = async (req, res) => {
  try {
    const { location, type, minPrice, maxPrice, bedrooms } = req.query;
    let query = { status: "available" };

    if (location && location.trim() !== "") {
      query.location = { $regex: location, $options: "i" }; // Case-insensitive
    }
    if (type && type !== "all") query.type = type;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };

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
  } catch (error) { res.status(500).json({ message: "Error" }); }
};

// 3. Toggle Save
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
  } catch (err) { res.status(500).json({ message: "Error" }); }
};

// 4. Get All Saved
exports.getSavedProperties = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("savedProperties");
    res.status(200).json(user.savedProperties);
  } catch (err) { res.status(500).json({ message: "Error" }); }
};

// 5. Clear All Saved
exports.clearSavedProperties = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { savedProperties: [] });
    res.status(200).json({ message: "All cleared" });
  } catch (error) { res.status(500).json({ message: "Error" }); }
};

// 6. Transactions (List, Buy, Rent)
exports.listProperty = async (req, res) => {
  try {
    const imageUrls = req.files ? req.files.map(f => f.path) : [];
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
  } catch (error) { res.status(400).json({ message: "Error" }); }
};

exports.buyProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    property.status = "sold";
    property.buyer = req.userId;
    await property.save();
    await User.findByIdAndUpdate(req.userId, { $push: { boughtProperties: property._id } });
    res.json({ message: "Bought" });
  } catch (error) { res.status(500).json({ message: "Error" }); }
};

exports.rentProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    property.status = "rented";
    property.renter = req.userId;
    await property.save();
    await User.findByIdAndUpdate(req.userId, { $push: { rentedProperties: property._id } });
    await User.findByIdAndUpdate(property.owner, { $push: { givenOnRent: property._id } });
    res.json({ message: "Rented" });
  } catch (error) { res.status(500).json({ message: "Error" }); }
};