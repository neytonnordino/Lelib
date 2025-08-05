import Hero from "./sections/Hero";
import Categories from "./sections/Categories";
import Sponsors from "./sections/Sponsors";
import RecentlyViewedSection from "./sections/RecentlyViewedSection";
import Footer from "./sections/Footer";

export default function Home() {
  return (
    <>
      <main className="pt-20">
        <Hero />
        <Categories />
        <RecentlyViewedSection />
        <Sponsors />
      </main>
      <Footer />
    </>
  );
}
