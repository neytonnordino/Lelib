import Hero from "./sections/Hero";
import Categories from "./sections/Categories";
import Sponsors from "./sections/Sponsors";

export default function Home() {
  return (
    <main className="pt-20">
      <Hero />
      <Categories />
      <Sponsors />
    </main>
  );
}
