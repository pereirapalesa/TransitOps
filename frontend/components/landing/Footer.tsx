import Link from "next/link";
import {
  Truck,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const productLinks = [
  "Fleet Management",
  "Driver Management",
  "Trip Tracking",
  "Maintenance",
  "Fuel Logs",
  "Analytics",
];

const companyLinks = [
  "About Us",
  "Careers",
  "Blog",
  "Contact",
  "Privacy Policy",
  "Terms of Service",
];

const resourceLinks = [
  "Documentation",
  "API Reference",
  "Support Center",
  "Community",
  "FAQs",
  "Release Notes",
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-slate-200 bg-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

        <div className="grid gap-12 lg:grid-cols-5">

          {/* Company */}

          <div className="lg:col-span-2">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Truck size={24} />
              </div>

              <div>

                <h2 className="text-2xl font-bold text-slate-900">
                  TransitOps
                </h2>

                <p className="text-sm text-slate-500">
                  Fleet Management ERP
                </p>

              </div>

            </div>

            <p className="mt-6 max-w-md leading-7 text-slate-600">
              TransitOps is a modern enterprise fleet management platform
              designed to simplify vehicle operations, driver management,
              maintenance scheduling, trip tracking, analytics,
              and business reporting.
            </p>

            <div className="mt-8 space-y-4">

              <div className="flex items-center gap-3 text-slate-600">
                <Mail size={18} />
                support@transitops.com
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <Phone size={18} />
                +91 98765 43210
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <MapPin size={18} />
                Mumbai, Maharashtra, India
              </div>

            </div>

          </div>

          {/* Product */}

          <div>

            <h3 className="mb-6 text-lg font-semibold text-slate-900">
              Product
            </h3>

            <ul className="space-y-4">

              {productLinks.map((item) => (

                <li key={item}>
                  <Link
                    href="#"
                    className="text-slate-600 transition hover:text-blue-600"
                  >
                    {item}
                  </Link>
                </li>

              ))}

            </ul>

          </div>

          {/* Company */}

          <div>

            <h3 className="mb-6 text-lg font-semibold text-slate-900">
              Company
            </h3>

            <ul className="space-y-4">

              {companyLinks.map((item) => (

                <li key={item}>
                  <Link
                    href="#"
                    className="text-slate-600 transition hover:text-blue-600"
                  >
                    {item}
                  </Link>
                </li>

              ))}

            </ul>

          </div>

          {/* Resources */}

          <div>

            <h3 className="mb-6 text-lg font-semibold text-slate-900">
              Resources
            </h3>

            <ul className="space-y-4">

              {resourceLinks.map((item) => (

                <li key={item}>
                  <Link
                    href="#"
                    className="text-slate-600 transition hover:text-blue-600"
                  >
                    {item}
                  </Link>
                </li>

              ))}

            </ul>

          </div>

        </div>

        {/* Newsletter */}

        <div className="mt-20 rounded-2xl border border-slate-200 bg-slate-50 p-8">

          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">

            <div>

              <h3 className="text-2xl font-bold text-slate-900">
                Stay Updated
              </h3>

              <p className="mt-2 text-slate-600">
                Get product updates, release notes, and fleet management insights.
              </p>

            </div>

            <form className="flex w-full max-w-lg gap-3">

              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-xl border border-slate-300 px-5 py-3 outline-none transition focus:border-blue-600"
              />

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Subscribe
              </button>

            </form>

          </div>

        </div>

        {/* Bottom */}

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-slate-200 pt-8 lg:flex-row">

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} TransitOps. All rights reserved.
          </p>

          <div className="flex items-center gap-5">

            {/* <Link
              href="#"
              className="rounded-lg p-2 transition hover:bg-slate-100"
            >
              <Facebook
                size={20}
                className="text-slate-600"
              />
            </Link> */}
{/* 
            <Link
              href="#"
              className="rounded-lg p-2 transition hover:bg-slate-100"
            >
              <Twitter
                size={20}
                className="text-slate-600"
              />
            </Link>

            <Link
              href="#"
              className="rounded-lg p-2 transition hover:bg-slate-100"
            >
              <Linkedin
                size={20}
                className="text-slate-600"
              />
            </Link>

            <Link
              href="#"
              className="rounded-lg p-2 transition hover:bg-slate-100"
            >
              <Github
                size={20}
                className="text-slate-600"
              />
            </Link> */}

          </div>

        </div>

      </div>
    </footer>
  );
}