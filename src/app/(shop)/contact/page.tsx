import ContactForm from "@/components/contact/Contactform";
import ContactInfo from "@/components/contact/Contactinfo";
import ContactMap from "@/components/contact/Contactmap";
import CtaContact from "@/components/contact/Ctacontact";
import FaqContact from "@/components/contact/faqcontact";
import HeroContact from "@/components/contact/Herocontact";
import OtherWays from "@/components/contact/Otherways";


export default function ContactPage() {
  return (
    <main className="bg-white font-['Cairo'] text-right" dir="rtl">
      <HeroContact />

      {/* الفورم + معلومات التواصل */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-6 items-start">
          <ContactForm />
          <ContactInfo />
        </div>
      </section>

      {/* طرق أخرى للتواصل + الخريطة */}
      <section className="pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-6 items-stretch">
          <OtherWays />
          <ContactMap />
        </div>
      </section>

      <FaqContact />
      <CtaContact />
    </main>
  );
}