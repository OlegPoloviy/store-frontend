import { Phone, Mail, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";

export function FooterSection() {
  return (
    <footer className="bg-gray-100 text-gray-700 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Contact Information */}
          <Card className="bg-white/50 border-gray-200">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-sm">info@furniturestore.com</span>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <div>New York</div>
                  <div className="text-gray-500">
                    123 Furniture Street, NY 10001
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Catalog */}
          <Card className="bg-white/50 border-gray-200">
            <CardContent className="p-4">
              <h3 className="text-gray-900 font-semibold mb-4 text-sm uppercase tracking-wide">
                Categories
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors text-gray-600"
                  >
                    Living Room
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors text-gray-600"
                  >
                    Dining Room
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors text-gray-600"
                  >
                    Bedroom
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors text-gray-600"
                  >
                    Office
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors text-gray-600"
                  >
                    Outdoor
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Information */}
          <Card className="bg-white/50 border-gray-200">
            <CardContent className="p-4">
              <h3 className="text-gray-900 font-semibold mb-4 text-sm uppercase tracking-wide">
                Company
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors text-gray-600"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors text-gray-600"
                  >
                    Our Story
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors text-gray-600"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors text-gray-600"
                  >
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors text-gray-600"
                  >
                    Returns
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors text-gray-600"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Consultation Form */}
          <Card className="bg-white/50 border-gray-200">
            <CardContent className="p-4">
              <h3 className="text-gray-900 font-semibold mb-4 text-sm uppercase tracking-wide">
                Get Updates
              </h3>
              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder="Your name"
                  className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500"
                />
                <Input
                  type="email"
                  placeholder="Email address"
                  className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500"
                />
                <Button
                  variant="secondary"
                  className="w-full bg-gray-700 hover:bg-gray-800 text-white"
                >
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Border */}
        <div className="mt-8 pt-6 border-t border-gray-300">
          <div className="text-center text-gray-500 text-xs">
            © 2025 Furniture Store. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
