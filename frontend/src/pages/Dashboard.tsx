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
  Loader2,
  TrendingUp,
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

  // Parse user safely
  const getUserData = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  };

  const user = getUserData();
  const userId = user.id || user._id;

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        navigate("/auth");
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleCardClick = (role: string) => {
    if (role === "saved") {
      // CHANGED: Fixed path to match your actual route
      navigate("/saved"); 
    } else {
      // Passes role and userId to SearchResults for filtering
      navigate(`/search?role=${role}&userId=${userId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FB]">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-8 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome, {data.name}</h1>
            <p className="text-muted-foreground">{data.email}</p>
          </div>
          <Button
            variant="destructive"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/auth");
            }}
            className="shadow-sm"
          >
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <Stat 
            label="Listed Properties" 
            value={data.listedCount} 
            icon={LayoutDashboard} 
            onClick={() => handleCardClick("owner")} 
          />
          <Stat 
            label="Bought" 
            value={data.boughtCount} 
            icon={Heart} 
            onClick={() => handleCardClick("buyer")} 
          />
          <Stat 
            label="Rented" 
            value={data.rentedCount} 
            icon={Sparkles} 
            onClick={() => handleCardClick("renter")} 
          />
          <Stat 
            label="Active Income" 
            value={data.givenOnRentCount} 
            icon={TrendingUp} 
            onClick={() => handleCardClick("owner")} 
          />
          <Stat 
            label="Saved Listings" 
            value={data.savedCount} 
            icon={Bell} 
            onClick={() => handleCardClick("saved")} 
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Stat = ({ label, value, icon: Icon, onClick }: any) => (
  <Card 
    className="cursor-pointer hover:shadow-lg transition-all border-none shadow-sm hover:-translate-y-1"
    onClick={onClick}
  >
    <CardContent className="p-6 text-center">
      <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="text-3xl font-extrabold text-slate-800">{value}</div>
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
    </CardContent>
  </Card>
);

export default Dashboard;