// backend/controllers/chatController.js
const Property = require("../models/Property");
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.getAiRecommendation = async (req, res) => {
  try {
    const { userMessage } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // 🔹 FIX: Change "gemini-1.5-flash" to "gemini-2.5-flash" or "gemini-3-flash-preview"
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const properties = await Property.find({ status: "available" }).lean();
    const propertyContext = properties.map(p => (
      `Title: ${p.title}, Price: ₹${p.price}, Location: ${p.location}, Amenities: ${(p.amenities || []).join(", ")}`
    )).join("\n---\n");

    const prompt = `You are a luxe real estate expert. Use these listings to help: ${propertyContext}\n\nUser: ${userMessage}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ message: "The AI consultant is updating its records. Please try again." });
  }
};