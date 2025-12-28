import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const Dashboard = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    listedProperties: [],
    boughtProperties: [],
    rentedProperties: [],
    givenOnRent: [],
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    };
    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {data.name}
        </h1>
        <p className="text-muted-foreground mb-6">
          {data.email}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Listed" value={data.listedProperties.length} />
          <Stat label="Bought" value={data.boughtProperties.length} />
          <Stat label="Rented" value={data.rentedProperties.length} />
          <Stat label="Given on Rent" value={data.givenOnRent.length} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="p-4 border rounded">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default Dashboard;
