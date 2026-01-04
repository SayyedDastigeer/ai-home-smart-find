const Inquiry = require("../models/Inquiry");

// 1. Start a new chat (Buyer)
exports.sendInquiry = async (req, res) => {
  try {
    const { propertyId, ownerId, message } = req.body;
    
    // Check if a chat already exists between these two for this property
    let inquiry = await Inquiry.findOne({ property: propertyId, buyer: req.userId });

    if (inquiry) {
      // If it exists, just add the message
      inquiry.messages.push({ sender: req.userId, text: message });
      await inquiry.save();
    } else {
      // Create new thread
      inquiry = await Inquiry.create({
        property: propertyId,
        buyer: req.userId,
        owner: ownerId,
        messages: [{ sender: req.userId, text: message }]
      });
    }
    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: "Error sending message" });
  }
};

// 2. Reply to existing chat
exports.replyToInquiry = async (req, res) => {
  try {
    const { text } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Chat not found" });

    const newMessage = { sender: req.userId, text, createdAt: new Date() };
    inquiry.messages.push(newMessage);
    await inquiry.save();

    // Trigger Real-time Push
    const io = req.app.get("socketio");
    const receiverId = (inquiry.buyer.toString() === req.userId) 
      ? inquiry.owner.toString() 
      : inquiry.buyer.toString();

    io.to(receiverId).emit("receive_message", {
      inquiryId: inquiry._id,
      message: newMessage
    });

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: "Reply failed" });
  }
};
// 3. Get Inbox (Owner or Buyer)
exports.getOwnerInbox = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ 
      $or: [{ owner: req.userId }, { buyer: req.userId }] 
    })
      .populate("property", "title price images")
      .populate("buyer", "name email")
      .populate("owner", "name email")
      .sort({ updatedAt: -1 });

    // SAFETY CHECK: Filter out inquiries where the property, buyer, or owner no longer exists
    const validInquiries = inquiries.filter(i => i.property && i.buyer && i.owner);
    
    res.json(validInquiries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inbox" });
  }
}; 

