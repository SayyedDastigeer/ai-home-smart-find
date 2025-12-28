const Property = require("../models/Property");
const User = require("../models/User");

exports.listProperty = async (req, res) => {
  const property = await Property.create({
    ...req.body,
    owner: req.userId,
  });

  await User.findByIdAndUpdate(req.userId, {
    $push: { listedProperties: property._id },
  });

  res.json(property);
};

exports.buyProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);
  property.status = "sold";
  await property.save();

  await User.findByIdAndUpdate(req.userId, {
    $push: { boughtProperties: property._id },
  });

  res.json({ message: "Property bought" });
};

exports.rentProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);
  property.status = "rented";
  await property.save();

  await User.findByIdAndUpdate(req.userId, {
    $push: { rentedProperties: property._id },
  });

  await User.findByIdAndUpdate(property.owner, {
    $push: { givenOnRent: property._id },
  });

  res.json({ message: "Property rented" });
};
