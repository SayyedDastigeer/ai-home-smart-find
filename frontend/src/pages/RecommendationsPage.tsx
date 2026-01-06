import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  TrendingUp,
  Shield,
  Car,
  DollarSign,
  GraduationCap,
} from "lucide-react";
import { Badge } from "../components/Badge";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

export const RecommendationsPage: React.FC = () => {
  const navigate = useNavigate();

  const recommendations = [
    {
      id: 1,
      name: "Brooklyn Heights",
      safetyScore: 92,
      commuteScore: 88,
      priceGrowth: 15.2,
      avgPrice: 5200000,
      whyRecommended:
        "Great balance of safety, amenities, and investment potential within your budget",
    },
    {
      id: 2,
      name: "Queens Village",
      safetyScore: 85,
      commuteScore: 78,
      priceGrowth: 18.5,
      avgPrice: 3800000,
      whyRecommended:
        "High growth potential with affordable pricing and good schools",
    },
    {
      id: 3,
      name: "Williamsburg",
      safetyScore: 88,
      commuteScore: 95,
      priceGrowth: 12.8,
      avgPrice: 6100000,
      whyRecommended:
        "Excellent commute options and vibrant neighborhood culture",
    },
    {
      id: 4,
      name: "Astoria",
      safetyScore: 86,
      commuteScore: 90,
      priceGrowth: 14.3,
      avgPrice: 4500000,
      whyRecommended:
        "Strong rental demand and diverse dining & entertainment",
    },
  ];

  const factors = [
    { icon: <Shield className="w-5 h-5" />, label: "Safety Score", color: "text-[#29A397]" },
    { icon: <Car className="w-5 h-5" />, label: "Commute Score", color: "text-[#29A397]" },
    { icon: <DollarSign className="w-5 h-5" />, label: "Price Growth", color: "text-[#29A397]" },
    { icon: <GraduationCap className="w-5 h-5" />, label: "School Rating", color: "text-[#29A397]" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* GLOBAL PAGE ANIMATION */}
      <PageTransition>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Best Areas for You
            </h1>
            <p className="text-lg text-gray-600">
              Based on your budget, preferences, and investment goals
            </p>
          </div>

          {/* AI Explanation */}
          <Card className="p-6 mb-8 bg-gradient-to-r from-[#E6F5F2] to-[#D1EFEA] border-2 border-[#29A397]">
            <div className="flex items-start gap-4">
              <div className="bg-[#29A397] p-3 rounded-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  How We Calculate Recommendations
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Our AI analyzes over 50 factors including historical price
                  trends, neighborhood safety data, school ratings, commute
                  times, amenities, rental demand, and future development plans
                  to identify the best locations for you.
                </p>
              </div>
            </div>
          </Card>

          {/* Key Factors */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Key Factors
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {factors.map((factor, index) => (
                <Card key={index} className="p-4 text-center">
                  <div className={`inline-flex ${factor.color} mb-2`}>
                    {factor.icon}
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {factor.label}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Heatmap */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Price Growth Heatmap
            </h2>
            <Card className="p-6">
              <div className="grid grid-cols-8 gap-2 mb-4">
                {Array.from({ length: 64 }).map((_, index) => {
                  const intensity = Math.floor(Math.random() * 5);
                  const colors = [
                    "bg-[#E6F5F2]",
                    "bg-[#CDEDEA]",
                    "bg-[#A8DED8]",
                    "bg-[#6EC6BD]",
                    "bg-[#29A397]",
                  ];
                  return (
                    <div
                      key={index}
                      className={`h-12 ${colors[intensity]} rounded`}
                    />
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Recommendations */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Recommended Locations
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {recommendations.map((area) => (
                <Card key={area.id} hover className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {area.name}
                      </h3>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">New York</span>
                      </div>
                    </div>
                    <Badge variant="success">Top Match</Badge>
                  </div>

                  <Button
                    onClick={() => navigate("/search")}
                    className="w-full"
                    variant="outline"
                  >
                    View Properties
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <Card className="p-8 bg-gradient-to-br from-[#E6F5F2] to-[#D1EFEA]">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Want More Personalized Recommendations?
              </h3>
              <p className="text-gray-600 mb-6">
                Answer a few questions and we’ll refine the results further
              </p>
              <Button size="lg">Take Preference Quiz</Button>
            </Card>
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
};
