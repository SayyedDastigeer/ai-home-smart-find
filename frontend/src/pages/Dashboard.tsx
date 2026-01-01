import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Sparkles,
  Bell,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type DashboardData = {
  name: string;
  email: string;
  listedCount: number;
  boughtCount: number;
  rentedCount: number;
  givenOnRentCount: number;
  savedCount: number;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch {
        navigate("/auth");
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (!data) {
    return <div className="text-center py-20">Loading Dashboard…</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {data.name}</h1>
            <p className="text-muted-foreground">{data.email}</p>
          </div>

          <Button
            variant="destructive"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Stat label="Listed" value={data.listedCount} icon={LayoutDashboard} />
          <Stat label="Bought" value={data.boughtCount} icon={Heart} />
          <Stat label="Rented" value={data.rentedCount} icon={Sparkles} />
          <Stat label="Income" value={data.givenOnRentCount} icon={Bell} />
          <Stat label="Saved" value={data.savedCount} icon={Heart} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

const Stat = ({ label, value, icon: Icon }: any) => (
  <Card>
    <CardContent className="p-6 text-center">
      <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </CardContent>
  </Card>
);

export default Dashboard;
