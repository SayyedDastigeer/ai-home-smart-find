const Inquiry = require("../models/Inquiry");
const Property = require("../models/Property");

// 1. Buyer clicks "Contact Seller"
exports.sendInquiry = async (req, res) => {
  try {
    const { propertyId, message, buyerPhone, buyerEmail } = req.body;
    const property = await Property.findById(propertyId);
    
    if (!property) return res.status(404).json({ message: "Property not found" });

    const inquiry = await Inquiry.create({
      property: propertyId,
      buyer: req.userId,
      owner: property.owner,
      message,
      buyerPhone,
      buyerEmail
    });

    res.status(201).json({ message: "Inquiry sent to seller!", inquiry });
  } catch (error) {
    res.status(500).json({ message: "Error sending inquiry" });
  }
};

// 2. Owner checks their inbox
exports.getOwnerInbox = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ owner: req.userId })
      .populate("property", "title price location images")
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inbox" });
  }
};