import { MarketingHeader } from "@/components/layout/marketing-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <MarketingHeader />
      <main id="konten" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
