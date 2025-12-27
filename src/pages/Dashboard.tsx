import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIChatWidget } from "@/components/chat/AIChatWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PropertyCard } from "@/components/property/PropertyCard";
import { mockProperties } from "@/data/mockProperties";
import {
  Heart,
  Scale,
  Sparkles,
  Bell,
  Settings,
  TrendingUp,
  Eye,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Saved Properties", value: "12", icon: Heart, color: "text-destructive" },
  { label: "Compared", value: "5", icon: Scale, color: "text-primary" },
  { label: "AI Recommendations", value: "8", icon: Sparkles, color: "text-accent" },
  { label: "Notifications", value: "3", icon: Bell, color: "text-success" },
];

const notifications = [
  {
    id: "1",
    title: "Price Drop Alert",
    message: "A property you saved dropped by 5%",
    time: "2 hours ago",
    type: "price",
  },
  {
    id: "2",
    title: "New Recommendation",
    message: "We found 3 new properties matching your criteria",
    time: "5 hours ago",
    type: "recommendation",
  },
  {
    id: "3",
    title: "Market Update",
    message: "Downtown prices increased 2% this month",
    time: "1 day ago",
    type: "market",
  },
];

const Dashboard = () => {
  const savedProperties = mockProperties.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="container py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, Alex!</h1>
              <p className="text-muted-foreground">
                Here's what's happening with your property search
              </p>
            </div>
            <Button variant="outline">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} variant="interactive">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-3xl font-bold">{stat.value}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Saved Properties */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Saved Properties</h2>
                  <Link to="/saved">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {savedProperties.slice(0, 2).map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>

              {/* AI Recommendations */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    AI Recommendations
                  </h2>
                  <Link to="/recommendations">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
                <Card variant="glass" className="border-primary/20">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <TrendingUp className="h-8 w-8 text-success mx-auto mb-2" />
                        <div className="font-semibold mb-1">Best Investment</div>
                        <div className="text-sm text-muted-foreground">
                          SoMa neighborhood shows 12% growth potential
                        </div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
                        <div className="font-semibold mb-1">Hidden Gem</div>
                        <div className="text-sm text-muted-foreground">
                          3 undervalued properties found in your area
                        </div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <MessageCircle className="h-8 w-8 text-accent mx-auto mb-2" />
                        <div className="font-semibold mb-1">Negotiation Tip</div>
                        <div className="text-sm text-muted-foreground">
                          Market favors buyers this month
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Notifications */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Recent Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                      <div>
                        <div className="font-medium text-sm">{notification.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {notification.message}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link to="/search">
                    <Button variant="outline" className="w-full justify-start">
                      Search Properties
                    </Button>
                  </Link>
                  <Link to="/list-property">
                    <Button variant="outline" className="w-full justify-start">
                      List Your Property
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    Compare Saved Properties
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AIChatWidget />
    </div>
  );
};

export default Dashboard;
