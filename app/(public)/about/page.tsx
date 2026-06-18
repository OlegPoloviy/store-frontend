import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  Hammer,
  Leaf,
  Mountain,
  PackageCheck,
  Ruler,
  ShieldCheck,
  Sparkles,
  TreePine,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us | Carpathians Furniture",
  description:
    "Learn about Carpathians Furniture, our material-led approach, sustainable woodworking, and handcrafted furniture made for calm, lasting interiors.",
};

const values = [
  {
    title: "Material honesty",
    description:
      "We choose wood, stone, metal and textile finishes for how they age, feel and support daily life.",
    icon: Leaf,
  },
  {
    title: "Measured craft",
    description:
      "Every proportion is refined for comfort, balance and durability before a piece reaches your room.",
    icon: Ruler,
  },
  {
    title: "Long-term support",
    description:
      "From product guidance to care notes, we stay close to the details that keep furniture useful for years.",
    icon: ShieldCheck,
  },
];

const processSteps = [
  "Select responsible materials",
  "Shape each piece by hand",
  "Finish for real homes",
  "Deliver with expert support",
];

const stats = [
  { value: "25+", label: "years of workshop knowledge" },
  { value: "4.9", label: "average customer rating" },
  { value: "98%", label: "satisfaction across custom orders" },
];

const materials = ["Oak", "Ash", "Walnut", "Linen", "Stone", "Brass"];

const workshopNotes = [
  {
    title: "Custom proportions",
    description:
      "Tables, storage and seating can be adjusted around real floor plans, not abstract showroom dimensions.",
    icon: Ruler,
  },
  {
    title: "Careful delivery",
    description:
      "Large pieces are packed, protected and guided into place with the same attention as the workshop stage.",
    icon: Truck,
  },
  {
    title: "Aftercare clarity",
    description:
      "Each finish comes with simple care guidance so the material keeps its texture and tone over time.",
    icon: PackageCheck,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-stone-950">
      <section className="relative overflow-hidden px-3 pb-10 pt-40 sm:px-5 sm:pt-44 lg:px-8 lg:pt-48">
        <div className="absolute inset-0 -z-10 bg-[#d9d6d1]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.72),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.58),_transparent_28%)]" />
        <div className="absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="mx-auto grid max-w-[1760px] gap-4 rounded-[32px] border border-white/60 bg-[#f7f4ef]/88 p-3 shadow-[0_24px_80px_rgba(70,61,50,0.12)] backdrop-blur md:grid-cols-[0.92fr_1.08fr] md:p-5 lg:p-7">
          <article className="flex min-h-[520px] flex-col justify-between rounded-[30px] bg-white p-6 shadow-sm sm:p-8 lg:min-h-[660px]">
            <div>
              <Badge
                variant="outline"
                className="rounded-full border-stone-200 px-4 py-2 text-xs uppercase tracking-[0.2em] text-stone-500"
              >
                About Carpathians
              </Badge>

              <div className="mt-10 max-w-2xl space-y-6">
                <h1 className="text-5xl font-light tracking-tight text-stone-950 sm:text-6xl lg:text-7xl">
                  Furniture with a quieter kind of confidence.
                </h1>
                <p className="max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
                  We build handcrafted furniture for homes that value warmth,
                  proportion and material character. Each piece starts with the
                  room it will live in, then moves through careful sourcing,
                  patient workshop craft and a finish made to last.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {materials.map((material) => (
                  <span
                    key={material}
                    className="rounded-full bg-[#f0ebe4] px-4 py-2 text-sm font-medium text-stone-700"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[22px] bg-stone-100 px-5 py-4"
                >
                  <p className="text-3xl font-semibold tracking-tight text-stone-950">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm leading-5 text-stone-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <div className="grid gap-4 md:grid-cols-[0.94fr_1.06fr]">
            <article className="relative min-h-[360px] overflow-hidden rounded-[30px] bg-[#d8d1c8] md:min-h-full">
              <Image
                src="/images/background_hero.png"
                alt="Handcrafted furniture in a calm interior"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/72 via-stone-950/18 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <div className="rounded-[26px] bg-white/18 p-5 text-white shadow-[0_20px_50px_rgba(28,25,23,0.18)] backdrop-blur">
                  <Mountain className="h-7 w-7" />
                  <p className="mt-4 text-2xl font-medium tracking-tight">
                    Inspired by the Carpathian sense of calm, made for modern
                    interiors.
                  </p>
                </div>
              </div>
            </article>

            <div className="grid gap-4">
              <article className="relative overflow-hidden rounded-[30px] bg-[#f0ebe4] p-5 shadow-sm">
                <div className="relative aspect-[16/12] overflow-hidden rounded-[24px]">
                  <Image
                    src="/images/bakcground_2.webp"
                    alt="Warm wood textures and furniture details"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 32vw"
                  />
                </div>
                <div className="mt-5 flex items-center justify-between gap-4 rounded-full bg-[#d8ccbb] py-2 pl-5 pr-2 text-stone-900">
                  <span className="text-base font-medium">
                    Natural materials, edited forms
                  </span>
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-950 text-white">
                    <Sparkles className="h-4 w-4" />
                  </span>
                </div>
              </article>

              <article className="rounded-[30px] bg-stone-950 p-6 text-white sm:p-7">
                <BadgeCheck className="h-7 w-7 text-emerald-300" />
                <p className="mt-6 text-3xl font-medium tracking-tight">
                  Not loud. Not disposable. Just furniture that settles into the
                  room and earns its place.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-stone-300">
                  <div className="rounded-[20px] bg-white/10 p-4">
                    FSC-minded sourcing
                  </div>
                  <div className="rounded-[20px] bg-white/10 p-4">
                    Made-to-order rhythm
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <Badge
              variant="outline"
              className="rounded-full border-emerald-200 bg-emerald-50/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700"
            >
              Studio approach
            </Badge>
            <h2 className="mt-5 text-4xl font-medium tracking-tight text-stone-950 sm:text-5xl">
              We design around the life of the room.
            </h2>
          </div>

          <p className="max-w-3xl text-lg leading-8 text-stone-600">
            A dining table has to host long evenings, not just look good in a
            photo. A chair has to support the body, not only the composition.
            That is why our work begins with use, scale and texture before it
            becomes a finished object.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-7xl gap-4 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <article
                key={value.title}
                className="rounded-[30px] bg-white p-7 shadow-sm ring-1 ring-stone-100 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(84,72,57,0.12)]"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-8 text-2xl font-medium tracking-tight text-stone-950">
                  {value.title}
                </h3>
                <p className="mt-3 leading-7 text-stone-500">
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {workshopNotes.map((note) => {
            const Icon = note.icon;

            return (
              <article
                key={note.title}
                className="group rounded-[30px] bg-[#f7f4ef] p-6 ring-1 ring-stone-200/70 transition duration-300 hover:bg-white hover:shadow-[0_20px_50px_rgba(84,72,57,0.1)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-stone-700 shadow-sm group-hover:bg-emerald-50 group-hover:text-emerald-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
                    Detail
                  </span>
                </div>
                <h3 className="mt-8 text-2xl font-medium tracking-tight text-stone-950">
                  {note.title}
                </h3>
                <p className="mt-3 leading-7 text-stone-500">
                  {note.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <article className="relative min-h-[520px] overflow-hidden rounded-[30px] bg-stone-200">
            <Image
              src="/images/sink.jpg"
              alt="Custom wood furniture detail"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/72 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 max-w-xl p-6 text-white sm:p-8">
              <Badge className="rounded-full bg-white/18 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white backdrop-blur hover:bg-white/18">
                Workshop detail
              </Badge>
              <p className="mt-5 text-4xl font-medium tracking-tight sm:text-5xl">
                The final finish should feel effortless because the work behind
                it was exact.
              </p>
            </div>
          </article>

          <article className="flex flex-col justify-between rounded-[30px] bg-[#f0ebe4] p-7 sm:p-8">
            <div>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-stone-700 shadow-sm">
                <Hammer className="h-6 w-6" />
              </div>
              <h2 className="mt-8 text-4xl font-medium tracking-tight text-stone-950">
                From rough material to ready room.
              </h2>
              <p className="mt-4 text-lg leading-8 text-stone-600">
                Our process is deliberately simple: choose well, make carefully,
                finish beautifully and support the piece after it leaves the
                workshop.
              </p>
            </div>

            <div className="mt-10 grid gap-3">
              {processSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-4 rounded-full bg-white px-4 py-3 shadow-sm"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-950 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="font-medium text-stone-800">{step}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[0.88fr_1.12fr]">
          <article className="rounded-[30px] bg-white p-7 shadow-sm ring-1 ring-stone-100 sm:p-8">
            <Badge
              variant="outline"
              className="rounded-full border-stone-200 px-4 py-2 text-xs uppercase tracking-[0.2em] text-stone-500"
            >
              Living with the piece
            </Badge>
            <p className="mt-8 text-3xl font-medium leading-tight tracking-tight text-stone-950 sm:text-4xl">
              Good furniture should not ask for attention every time you enter
              the room. It should make the room feel resolved.
            </p>
          </article>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-[30px] bg-[#ebe4da] p-7">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-stone-500">
                Finish palette
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {["#d8ccbb", "#8f7f6b", "#322d27", "#f7f4ef", "#b4a088", "#dad5cd"].map(
                  (color) => (
                    <div
                      key={color}
                      className="aspect-square rounded-[22px] ring-1 ring-white/70"
                      style={{ backgroundColor: color }}
                    />
                  )
                )}
              </div>
            </article>

            <article className="rounded-[30px] bg-emerald-50 p-7 text-emerald-950">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
                Sustainability
              </p>
              <p className="mt-8 text-3xl font-medium tracking-tight">
                Responsible materials, low-waste production and finishes chosen
                for repairability.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[30px] bg-stone-950 p-6 text-white sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-emerald-300">
                <TreePine className="h-6 w-6" />
              </div>
              <h2 className="mt-8 text-4xl font-medium tracking-tight sm:text-5xl">
                Bring home pieces that feel considered from the first day.
              </h2>
              <p className="mt-4 text-lg leading-8 text-stone-300">
                Browse curated categories or start with our full product range
                to find furniture with the right material, scale and mood.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white px-6 text-stone-950 hover:bg-stone-100"
              >
                <Link href="/categories">
                  Browse categories
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 bg-transparent px-6 text-white hover:bg-white hover:text-stone-950"
              >
                <Link href="/products">View products</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
