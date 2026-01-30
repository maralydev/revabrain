import { PublicLayout } from "@/components/public/PublicLayout";

export default function CostsPage() {
  return (
    <PublicLayout>
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Tarieven
            </h1>
            <p className="text-lg text-gray-600">
              Onze tarieven en terugbetalingsinformatie.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600">Tarieven informatie wordt binnenkort bijgewerkt.</p>
        </div>
      </section>
    </PublicLayout>
  );
}
