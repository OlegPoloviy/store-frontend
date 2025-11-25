import {
  Mountain,
  Heart,
  Leaf,
  Award,
  Users,
  Target,
  Hammer,
  Sparkles,
  TreePine,
  Shield,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Carpathians Furniture - Handcrafted Excellence",
  description:
    "Discover the story behind Carpathians Furniture. Learn about our heritage of handcrafted excellence, sustainable practices, and commitment to quality furniture that lasts generations.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/background_hero.png')",
          }}
        >
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-800/60 to-gray-900/70"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge
              variant="secondary"
              className="mb-6 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
            >
              <span className="text-sm font-medium text-white tracking-wider uppercase">
                Our Story
              </span>
            </Badge>

            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Crafting Excellence Since Generations
            </h1>

            <p className="text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
              From the heart of the Carpathian mountains, we bring you
              handcrafted furniture that tells a story of tradition,
              craftsmanship, and sustainable beauty.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <Mountain className="w-10 h-10 text-gray-700" />
                <h2 className="text-4xl font-bold text-gray-900">
                  Our Heritage
                </h2>
              </div>

              <p className="text-lg text-gray-600 leading-relaxed">
                Nestled in the beautiful Carpathian region, our journey began
                with a simple belief: furniture should be more than just
                functional. It should be a work of art, a testament to the skill
                of the craftsperson, and a legacy that lasts generations.
              </p>

              <p className="text-lg text-gray-600 leading-relaxed">
                For decades, we&apos;ve been combining traditional woodworking
                techniques passed down through generations with modern design
                sensibilities. Each piece we create is a unique masterpiece,
                carefully crafted to bring warmth, character, and timeless
                elegance to your home.
              </p>

              <p className="text-lg text-gray-600 leading-relaxed">
                Our commitment to sustainability means we source our materials
                responsibly, ensuring that every tree we use is part of a
                managed forest. We believe in creating furniture that not only
                beautifies your space but also respects our planet.
              </p>
            </div>

            <Card className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
              <CardContent className="p-0">
                <div
                  className="h-[500px] bg-cover bg-center"
                  style={{
                    backgroundImage: "url('/images/bakcground_2.webp')",
                  }}
                >
                  <div className="h-full bg-gradient-to-t from-gray-900/50 to-transparent flex items-end p-8">
                    <div className="text-white">
                      <p className="text-2xl font-bold mb-2">
                        Decades of Excellence
                      </p>
                      <p className="text-gray-200">
                        Handcrafted with passion and precision
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge
              variant="secondary"
              className="mb-4 px-6 py-2 bg-gray-100 rounded-full"
            >
              <span className="text-sm font-medium text-gray-700 tracking-wider uppercase">
                What We Stand For
              </span>
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide every decision we make and every piece we
              create
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Value 1: Craftsmanship */}
            <Card className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-0 text-center">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-200 transition-colors">
                  <Hammer className="w-10 h-10 text-gray-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Master Craftsmanship
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Every piece is meticulously handcrafted by skilled artisans
                  with years of experience, ensuring unparalleled quality and
                  attention to detail.
                </p>
              </CardContent>
            </Card>

            {/* Value 2: Sustainability */}
            <Card className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-0 text-center">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-200 transition-colors">
                  <Leaf className="w-10 h-10 text-gray-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Sustainability First
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We source materials responsibly from managed forests and use
                  eco-friendly finishes, ensuring our legacy doesn&apos;t harm
                  future generations.
                </p>
              </CardContent>
            </Card>

            {/* Value 3: Authenticity */}
            <Card className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-0 text-center">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-200 transition-colors">
                  <Heart className="w-10 h-10 text-gray-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Authentic Design
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Each design reflects genuine craftsmanship and timeless
                  aesthetics, blending traditional techniques with contemporary
                  style.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image Side */}
            <Card className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden order-2 lg:order-1">
              <CardContent className="p-0">
                <div
                  className="h-[600px] bg-cover bg-center"
                  style={{
                    backgroundImage: "url('/images/sink.jpg')",
                  }}
                ></div>
              </CardContent>
            </Card>

            {/* Content Side */}
            <div className="space-y-8 order-1 lg:order-2">
              <div>
                <Badge
                  variant="secondary"
                  className="mb-4 px-6 py-2 bg-gray-100 rounded-full"
                >
                  <span className="text-sm font-medium text-gray-700 tracking-wider uppercase">
                    Why Choose Us
                  </span>
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Excellence in Every Detail
                </h2>
                <p className="text-lg text-gray-600">
                  We don&apos;t just make furniture. We create heirlooms that
                  will be cherished for generations.
                </p>
              </div>

              <div className="space-y-6">
                {/* Feature 1 */}
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-100 p-3 rounded-xl flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Premium Materials
                    </h3>
                    <p className="text-gray-600">
                      We use only the finest woods, metals, and finishes sourced
                      from sustainable suppliers.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-100 p-3 rounded-xl flex-shrink-0">
                    <Award className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Award-Winning Designs
                    </h3>
                    <p className="text-gray-600">
                      Our designs have been recognized internationally for their
                      innovation and timeless appeal.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-100 p-3 rounded-xl flex-shrink-0">
                    <Users className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Custom Solutions
                    </h3>
                    <p className="text-gray-600">
                      Work directly with our designers to create bespoke pieces
                      tailored to your exact specifications.
                    </p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-100 p-3 rounded-xl flex-shrink-0">
                    <Shield className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Lifetime Warranty
                    </h3>
                    <p className="text-gray-600">
                      We stand behind our craftsmanship with comprehensive
                      warranties on all our pieces.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TreePine className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-white">5000+</h3>
              <p className="text-gray-300">Trees Planted</p>
            </div>

            <div className="space-y-2">
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-white">10,000+</h3>
              <p className="text-gray-300">Happy Customers</p>
            </div>

            <div className="space-y-2">
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-white">25+</h3>
              <p className="text-gray-300">Years Experience</p>
            </div>

            <div className="space-y-2">
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-white">98%</h3>
              <p className="text-gray-300">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden">
            <CardContent className="p-12 text-center">
              <Sparkles className="w-16 h-16 text-white mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Transform Your Space?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Explore our collection of handcrafted furniture and find the
                perfect pieces to bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/categories">
                  <Button
                    size="lg"
                    className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-6 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Browse Collection
                  </Button>
                </Link>
                <Link href="/custom-orders">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-6 rounded-full font-semibold text-lg transition-all duration-300"
                  >
                    Custom Order
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
