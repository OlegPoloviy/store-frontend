import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50">
              <CardContent className="p-0 space-y-8">
                {/* 404 Icon */}
                <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center relative overflow-hidden">
                  {/* Decorative background pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-2 left-2 w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                    <div className="absolute top-4 right-3 w-2 h-2 border-2 border-gray-300 rounded-full"></div>
                    <div className="absolute bottom-3 left-3 w-3 h-3 border-2 border-gray-300 rounded-full"></div>
                    <div className="absolute bottom-2 right-2 w-2 h-2 border-2 border-gray-300 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-gray-300 rounded-full"></div>
                  </div>

                  {/* Main 404 text */}
                  <div className="text-4xl font-bold text-gray-600 relative z-10">
                    404
                  </div>
                </div>

                {/* Error Message */}
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                    Page Not Found
                  </h1>

                  <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
                    Sorry, we couldn&apos;t find the page you&apos;re looking
                    for. It might have been moved, deleted, or doesn&apos;t
                    exist.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="px-8 py-3">
                    <Link href="/" className="flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Go Home
                    </Link>
                  </Button>

                  <Button variant="outline" asChild className="px-8 py-3">
                    <Link
                      href="/categories"
                      className="flex items-center gap-2"
                    >
                      <Search className="w-4 h-4" />
                      Browse Categories
                    </Link>
                  </Button>
                </div>

                {/* Additional Help */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Need help?{" "}
                    <Link
                      href="/contact"
                      className="text-gray-700 hover:text-gray-900 underline"
                    >
                      Contact our support team
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute top-20 left-10 w-20 h-20 bg-gray-200 rounded-full opacity-20"></div>
              <div className="absolute top-40 right-20 w-16 h-16 bg-gray-300 rounded-full opacity-30"></div>
              <div className="absolute bottom-20 left-20 w-12 h-12 bg-gray-200 rounded-full opacity-25"></div>
              <div className="absolute bottom-40 right-10 w-24 h-24 bg-gray-300 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
