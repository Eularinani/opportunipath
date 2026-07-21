import Link from 'next/link';

interface HeroSectionProps {
  title: string;
  description: string;
  breadcrumb?: { label: string; href: string }[];
}

export default function HeroSection({ title, description, breadcrumb }: HeroSectionProps) {
  return (
    <section className="bg-path-navy py-16 md:py-24">
      <div className="container-ango">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-2 text-white/50 text-sm mb-6">
            {breadcrumb.map((item, index) => (
              <span key={item.href} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                <Link href={item.href} className="hover:text-white transition-colors">
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
        )}
        <div className="max-w-3xl">
          <h1 className="font-poppins font-bold text-3xl md:text-5xl text-white mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-white/70 text-base md:text-lg leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
