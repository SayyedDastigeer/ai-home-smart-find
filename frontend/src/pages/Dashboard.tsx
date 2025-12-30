import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Scale, Sparkles, Bell, User, LogOut, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error("Auth failed", err);
        navigate("/auth");
      }
    };
    fetchDashboard();
  }, [navigate]);

  if (!data) return <div className="text-center py-20">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Welcome back, {data.name}</h1>
            <p className="text-muted-foreground">{data.email}</p>
          </div>
          <Button variant="destructive" size="sm" onClick={() => { localStorage.removeItem("token"); navigate("/auth"); }}>
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Properties Listed" value={data.listedProperties?.length || 0} icon={LayoutDashboard} color="text-blue-500" />
          <StatCard label="Properties Bought" value={data.boughtProperties?.length || 0} icon={Heart} color="text-red-500" />
          <StatCard label="Properties Rented" value={data.rentedProperties?.length || 0} icon={Sparkles} color="text-amber-500" />
          <StatCard label="Income Streams" value={data.givenOnRent?.length || 0} icon={Bell} color="text-green-500" />
        </div>
      </main>
      <Footer />
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <Card variant="interactive">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg bg-muted ${color}`}><Icon className="h-5 w-5" /></div>
        <div className="text-3xl font-bold">{value}</div>
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </CardContent>
  </Card>
);

export default Dashboard;