exports.getDashboard = async (req, res) => {
  res.json({
    name: "Demo User",
    email: "demo@example.com",
    listedProperties: [],
    boughtProperties: [],
    rentedProperties: [],
    givenOnRent: [],
  });
};
