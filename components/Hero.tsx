import { Truck, Clock, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

export function Hero() {
  return (
    <section className="relative min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/sink.jpg')",
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/20 via-gray-800/10 to-gray-900/30"></div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
          {/* Left side - Empty space to show background image */}
          <div className="hidden lg:block"></div>

          {/* Right side - Content */}
          <Card className="space-y-8 bg-white/90 backdrop-blur-sm rounded-3xl p-8 mt-24 shadow-2xl border border-gray-200/50">
            <CardContent className="p-0 space-y-8">
              {/* Badge */}
              <Badge
                variant="secondary"
                className="px-4 py-2 bg-gray-800/10 backdrop-blur-sm rounded-full border border-gray-300/30"
              >
                <span className="text-sm font-medium text-gray-700 tracking-wider uppercase">
                  New Arrival
                </span>
              </Badge>

              {/* Main heading */}
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                  Discover Our
                  <br />
                  <span className="text-gray-600">New Collection</span>
                </h1>

                <p className="text-lg text-gray-600 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                  elit tellus, luctus nec ullamcorper mattis.
                </p>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Button
                  size="lg"
                  className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  BUY NOW
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom features section */}
        <div className="grid md:grid-cols-3 gap-8 mt-100">
          {/* Free Delivery */}
          <Card className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:bg-white/90 transition-all">
            <CardContent className="p-0 flex items-start space-x-4">
              <div className="bg-gray-800/10 p-3 rounded-xl group-hover:bg-gray-800/20 transition-colors">
                <Truck className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Free Delivery
                </h3>
                <p className="text-gray-600 text-sm">
                  Lorem ipsum dolor sit amet.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Support 24/7 */}
          <Card className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:bg-white/90 transition-all">
            <CardContent className="p-0 flex items-start space-x-4">
              <div className="bg-gray-800/10 p-3 rounded-xl group-hover:bg-gray-800/20 transition-colors">
                <Clock className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Support 24/7
                </h3>
                <p className="text-gray-600 text-sm">
                  Lorem ipsum dolor sit amet.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 100% Authentic */}
          <Card className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:bg-white/90 transition-all">
            <CardContent className="p-0 flex items-start space-x-4">
              <div className="bg-gray-800/10 p-3 rounded-xl group-hover:bg-gray-800/20 transition-colors">
                <Shield className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  100% Authentic
                </h3>
                <p className="text-gray-600 text-sm">
                  Lorem ipsum dolor sit amet.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
