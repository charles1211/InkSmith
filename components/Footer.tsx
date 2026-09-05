import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Music2, Phone, Youtube } from 'lucide-react';

import { serviceAreas } from '../content/service-areas';
import { services } from '../content/services';
import { siteConfig } from '../lib/seo/site.config';

/**
 * Site footer.
 *
 * Two things changed here beyond the layout. First, it is now a Server
 * Component — it had no interactivity, and marking it 'use client' put the
 * whole footer into the JavaScript bundle of every page for nothing.
 *
 * Second, the headings are gone. This footer renders on every route, so its old
 * h3 and h4 elements injected phantom levels into every document outline —
 * including the auth pages, which had no h1 at all. A footer contributes nothing
 * to a page's topical structure, so its labels are now plain elements.
 */

/** Only social networks that are actually configured get an icon. */
const SOCIAL_ICONS = [
  { key: 'instagram', Icon: Instagram, label: 'Instagram' },
  { key: 'facebook', Icon: Facebook, label: 'Facebook' },
  { key: 'youtube', Icon: Youtube, label: 'YouTube' },
  { key: 'tiktok', Icon: Music2, label: 'TikTok' },
  { key: 'linkedin', Icon: Linkedin, label: 'LinkedIn' },
] as const;

const EXPLORE_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About the studio' },
  { href: '/artists', label: 'Our artists' },
  { href: '/portfolio', label: 'Tattoo portfolio' },
  { href: '/aftercare', label: 'Aftercare guides' },
  { href: '/faq', label: 'Questions answered' },
  { href: '/contact', label: 'Contact us' },
];

const ColumnLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="font-bold text-white tracking-wider uppercase text-sm mb-4">{children}</p>
);

const Footer: React.FC = () => {
  const { address } = siteConfig.contact;
  const socials = SOCIAL_ICONS.map((entry) => ({
    ...entry,
    url: siteConfig.social[entry.key],
  })).filter((entry) => Boolean(entry.url));

  return (
    <footer className="bg-ink-950 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-4">
            <p className="font-serif text-2xl font-bold text-white tracking-widest">
              {siteConfig.wordmark}
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              {siteConfig.longDescription}
            </p>
            {socials.length > 0 && (
              <div className="flex space-x-4 pt-1">
                {socials.map(({ key, Icon, label, url }) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${siteConfig.name} on ${label}`}
                    className="text-gray-400 hover:text-ink-accent transition-colors"
                  >
                    <Icon size={20} aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Explore */}
          <nav aria-label="Site">
            <ColumnLabel>Explore</ColumnLabel>
            <ul className="space-y-2 text-sm text-gray-400">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-ink-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Services">
            <ColumnLabel>Services</ColumnLabel>
            <ul className="space-y-2 text-sm text-gray-400">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="hover:text-ink-accent transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/book" className="hover:text-ink-accent transition-colors">
                  Book an appointment
                </Link>
              </li>
            </ul>
          </nav>

          {/* Areas served */}
          <nav aria-label="Areas we serve">
            <ColumnLabel>Areas we serve</ColumnLabel>
            <ul className="space-y-2 text-sm text-gray-400">
              {serviceAreas.slice(0, 5).map((area) => (
                <li key={area.slug}>
                  <Link
                    href={`/locations/${area.slug}`}
                    className="hover:text-ink-accent transition-colors"
                  >
                    {area.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/locations" className="hover:text-ink-accent transition-colors">
                  All areas &rarr;
                </Link>
              </li>
            </ul>
          </nav>

          {/* Visit */}
          <div>
            <ColumnLabel>Visit</ColumnLabel>
            <address className="not-italic space-y-3 text-gray-400 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-ink-accent mt-1 shrink-0" aria-hidden="true" />
                <span>
                  {address.streetAddress}, {address.addressLocality} {address.postalCode}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-ink-accent shrink-0" aria-hidden="true" />
                <a
                  href={`tel:${siteConfig.contact.phoneE164}`}
                  className="hover:text-ink-accent transition-colors"
                >
                  {siteConfig.contact.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-ink-accent shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-ink-accent transition-colors break-all"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
            </address>

            <p className="font-bold text-white tracking-wider uppercase text-sm mt-6 mb-3">
              Studio hours
            </p>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex justify-between gap-4">
                <span>Mon &ndash; Sat</span> <span>12:00 PM &ndash; 8:00 PM</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Sunday</span> <span>11:00 AM &ndash; 7:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center text-gray-600 text-xs">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
