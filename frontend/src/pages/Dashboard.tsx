import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Building2, 
  PlusCircle, 
  Trash2, 
  Loader2, 
  MapPin,
  ExternalLink,
  Settings
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth");

    try {
      // Fetches active listing counts and the full property list
      const res = await axios.get("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Delete Functionality: Calls backend to remove listing instantly
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently remove this listing?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Listing removed successfully");
      fetchDashboardData(); // Refresh counts and listing grid
    } catch (err) {
      toast.error("Could not delete the listing. Please try again.");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin h-10 w-10 text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FE]">
      <Navbar />
      
      <main className="flex-1 container py-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Management Dashboard</h1>
          <Button onClick={() => navigate("/list-property")} className="rounded-xl shadow-lg">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Listing
          </Button>
        </div>

        {/* Statistics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="rounded-3xl border-none shadow-sm">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Building2 className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Active Listings</p>
                <h2 className="text-4xl font-black">{data.activeListingsCount}</h2>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-none shadow-sm cursor-pointer hover:bg-white/50 transition-colors" onClick={() => navigate("/inbox")}>
            <CardContent className="p-8 flex items-center gap-6">
              <div className="h-16 w-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <MessageSquare className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Property Inquiries</p>
                <h2 className="text-4xl font-black">{data.totalInquiriesCount}</h2>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Listing Management: Displays a clean list of the owner's properties */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Settings className="h-5 w-5 text-primary" />
            My Listed Properties
          </div>

          <div className="grid gap-4">
            {data.myListings && data.myListings.length > 0 ? (
              data.myListings.map((property: any) => (
                <Card key={property._id} className="rounded-2xl border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex flex-col md:flex-row items-center gap-6">
                    <img 
                      src={property.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=300"} 
                      className="h-24 w-32 rounded-xl object-cover shadow-sm" 
                      alt="Property" 
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={property.status === 'available' ? 'bg-green-500' : 'bg-red-500'}>
                          {property.status}
                        </Badge>
                        <h3 className="font-bold text-lg truncate">{property.title}</h3>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1 text-primary" /> {property.location}
                      </div>
                      <div className="mt-2 text-primary font-bold">₹{property.price.toLocaleString()}</div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                      <Link to={`/property/${property._id}`} className="flex-1 md:flex-none">
                        <Button variant="outline" className="w-full rounded-xl">
                          <ExternalLink className="h-4 w-4 mr-2" /> View
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        className="text-destructive hover:bg-destructive/10 rounded-xl" 
                        onClick={() => handleDelete(property._id)} //
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">You don't have any properties listed for sale or rent.</p>
                <Button variant="link" onClick={() => navigate("/list-property")} className="mt-2">Start listing now</Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;