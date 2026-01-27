'use client';

import { useState } from 'react';
import { PageContentData } from '@/modules/page-content/queries';

interface FAQItem {
  question: string;
  answer: string;
}

// Default FAQ items - kunnen worden overschreven via CMS
const DEFAULT_FAQS: FAQItem[] = [
  {
    question: 'Is een voorschrift nodig voor logopedie?',
    answer: 'Ja, voor terugbetaling door het ziekenfonds is een voorschrift van een arts (huisarts, specialist) nodig. Dit voorschrift is 2 maanden geldig voor de start van de behandeling.',
  },
  {
    question: 'Hoe lang duurt een behandeltraject?',
    answer: 'Dit is sterk afhankelijk van de aandoening en de individuele patiënt. Tijdens de intake bespreken we de verwachte duur en doelstellingen. Gemiddeld duurt een traject voor neurologopedie 3-12 maanden.',
  },
  {
    question: 'Zijn er wachttijden?',
    answer: 'We streven naar een intake binnen 2 weken na verwijzing. Voor specifieke specialisaties kan de wachttijd langer zijn. Neem gerust contact op voor actuele wachttijden.',
  },
  {
    question: 'Kunnen jullie aan huis komen?',
    answer: 'Ja, voor patiënten die moeilijk mobiel zijn, bieden we huisbezoeken aan. Dit wordt in overleg met de patiënt en verwijzer bepaald.',
  },
  {
    question: 'Hoe verloopt de terugkoppeling?',
    answer: 'Na de evaluatie en na afloop van het behandeltraject ontvangt u een schriftelijk verslag. Bij belangrijke wijzigingen of vragen nemen we tussentijds contact op.',
  },
];

interface VerwijzersFAQProps {
  content: Record<string, PageContentData>;
}

export default function VerwijzersFAQ({ content }: VerwijzersFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Gebruik CMS content of defaults
  const faqTitle = content.faq?.title || 'Veelgestelde vragen';

  // FAQ items kunnen via CMS worden aangevuld (faq1, faq2, etc.)
  const faqs: FAQItem[] = [];
  for (let i = 1; i <= 10; i++) {
    const faqContent = content[`faq${i}`];
    if (faqContent?.title && faqContent?.content) {
      faqs.push({
        question: faqContent.title,
        answer: faqContent.content,
      });
    }
  }

  // Als geen FAQ's via CMS, gebruik defaults
  const displayFaqs = faqs.length > 0 ? faqs : DEFAULT_FAQS;

  return (
    <section className="py-16 lg:py-24 bg-[var(--gray-50)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {faqTitle}
          </h2>
        </div>

        <div className="space-y-4">
          {displayFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                <svg
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-4 text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
