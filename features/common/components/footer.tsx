import Link from "next/link";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/courses", label: "কোর্স" },
    { href: "/books", label: "বই" },
    { href: "/teachers", label: "শিক্ষক" },
    { href: "/profile", label: "প্রোফাইল" },
  ];

  const adminLinks = [
    { href: "/admin", label: "ড্যাশবোর্ড" },
    { href: "/admin/courses", label: "কোর্স পরিচালনা" },
    { href: "/admin/books", label: "বই পরিচালনা" },
    { href: "/admin/teachers", label: "শিক্ষক পরিচালনা" },
  ];

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-2xl font-bold transition-colors hover:text-primary"
            >
              <GraduationCap className="h-6 w-6" />
              <span>আরিশা একাডেমি</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              ৩ থেকে ১৮ বছর বয়সী শিশুদের জন্য একটি স্কুল। মানসম্মত শিক্ষার
              মাধ্যমে তরুণ মনের ক্ষমতায়ন এবং তাদের সম্ভাবনার বিকাশ।
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">দ্রুত লিংক</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">অ্যাডমিন</h3>
            <ul className="space-y-2">
              {adminLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">যোগাযোগ</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  +880 1234 567890
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <a
                  href="mailto:info@arishaacademy.com"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  info@arishaacademy.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Dhaka, Bangladesh
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {currentYear} আরিশা একাডেমি। সর্বস্বত্ব সংরক্ষিত।
            </p>
            <div className="flex space-x-6">
              <Link
                href="#"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                গোপনীয়তা নীতি
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                সেবার শর্তাবলী
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
