
import WhyJoin from '@/components/join/WhyJoin';
import HeroJoin from '@/components/join/HeroJoin';
import WhoCanJoin from '@/components/join/Whocanjoin';
import WhatYouGet from '@/components/join/Whatyouget';
import JoinForm from '@/components/join/Joinform';

export default function JoinPage() {
  return (
    <main className="bg-white font-['Cairo'] text-right" dir="rtl">
      <HeroJoin />
      <WhyJoin />
      <WhoCanJoin />
      <WhatYouGet />
      <JoinForm />
    </main>
  );
}