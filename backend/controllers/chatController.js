// backend/controllers/chatController.js
const Property = require("../models/Property");
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.getAiRecommendation = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  try {
    const { userMessage } = req.body;
    const properties = await Property.find({ status: "available" }).lean();

    // Create a context list for the AI
    const propertyContext = properties.map(p => (
      `Title: ${p.title}, Price: ₹${p.price.toLocaleString()}, Location: ${p.location}, ID: ${p._id}, Amenities: ${(p.amenities || []).join(", ")}`
    )).join("\n---\n");

    const prompt = `
      Act as an Elite Real Estate Advisor for "Luxe Real Estate."
      Your goal is to provide a curated, high-end experience for your client.
      
      Available Properties:
      ${propertyContext}

      Client Inquiry: "${userMessage}"
      
      Formatting Instructions:
      1. Start with a sophisticated opening sentence (e.g., "I have curated an exceptional selection for you...").
      2. For each recommendation, use this clean layout:
         ### [Property Title](http://localhost:8080/property/[Property_ID])
         * **Investment:** ₹[Price]
         * **Location:** [Location]
         * **Lifestyle Features:** [Amenities list, use icons like 🏊, 🏋️]
      3. Use a Markdown Table if comparing more than 2 properties.
      4. End with: "Would you like to schedule a private viewing or view more details?"
    `;

    const result = await model.generateContent(prompt);
    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Consultant is currently busy." });
  }
};