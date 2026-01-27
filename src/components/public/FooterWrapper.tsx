import Footer from './Footer';
import { getFooterData } from '@/modules/footer/queries';

/**
 * Server Component wrapper voor Footer
 * Haalt footer data op en geeft door aan client Footer component
 */
export default async function FooterWrapper() {
  const footerData = await getFooterData();

  return <Footer data={footerData} />;
}
