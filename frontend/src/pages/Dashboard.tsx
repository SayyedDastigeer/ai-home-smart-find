import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Trash2,
  ArrowUpRight,
  Settings2,
  UserX,
  Bookmark,
  Loader2,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = user.id || user._id;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth");

    try {
      const res = await axios.get("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch {
      toast.error("Authentication required");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Delete account permanently?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/api/auth/delete-account", {
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
      navigate("/");
    } catch {
      toast.error("Failed");
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm("Delete listing?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDashboardData();
    } catch {
      toast.error("Failed");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      {/* GLOBAL PAGE ANIMATION */}
      <PageTransition>
        <main className="max-w-7xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Dashboard
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                User ID · {currentUserId?.slice(0, 8)}
              </p>
            </div>

            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings2 className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleDeleteAccount}
                    className="text-red-600 font-medium"
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Delete Account
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                size="sm"
                className="bg-slate-900 hover:bg-slate-800"
                onClick={() => navigate("/list-property")}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Listing
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-12">
            {[
              {
                label: "Active Listings",
                value: data.activeListingsCount,
              },
              {
                label: "Inbox",
                value: data.totalInquiriesCount,
                click: () => navigate("/inbox"),
              },
              {
                label: "Saved",
                value: data.savedCount ?? "View",
                click: () => navigate("/saved"),
              },
              {
                label: "Status",
                value: "Connected",
                green: true,
              },
            ].map((card, i) => (
              <div
                key={i}
                onClick={card.click}
                className="bg-white rounded-xl border shadow-sm p-6 cursor-pointer hover:-translate-y-1 transition-transform"
              >
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  {card.label}
                </p>
                <p
                  className={`mt-3 text-3xl font-semibold ${
                    card.green ? "text-green-600 text-sm" : ""
                  }`}
                >
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          {/* Listings */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Property
                  </th>
                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Location
                  </th>
                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Price
                  </th>
                  <th className="px-6 py-4 text-xs uppercase text-slate-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.myListings?.map((property: any) => (
                  <tr
                    key={property._id}
                    className="border-b last:border-none hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">
                      {property.title}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {property.location}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      ₹{property.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/property/${property._id}`}>
                          <Button variant="ghost" size="icon">
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() =>
                            handleDeleteProperty(property._id)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {data.myListings?.length === 0 && (
              <div className="py-20 text-center text-slate-400">
                No listings yet.
              </div>
            )}
          </div>
        </main>
      </PageTransition>
    </div>
  );
};

export default Dashboard;
