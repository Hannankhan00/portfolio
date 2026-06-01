import StarField from "./components/StarField";
import Menu from "./components/Menu";
import CustomCursor from "./components/CustomCursor";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Footer from "./components/Footer";

const stats = [
  { value: "2+", label: "Years of\nExperience" },
  { value: "10+", label: "Completed\nProjects" },
];

export default function Home() {
  return (
    <>
      {/* Custom cursor */}
      <CustomCursor />

      {/* Fixed background stars — covers entire page */}
      <StarField />

      {/* Hamburger nav */}
      <Menu />

      {/* Fixed left sidebar: vertical email */}
      <div className="fixed left-5 bottom-8 hidden lg:flex flex-col items-center gap-3 z-20">
        <span
          className="text-slate-500 text-xs tracking-[0.18em]"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          8hannankhan00@gmail.com
        </span>
        <div className="w-px h-14 bg-gradient-to-b from-accent/30 to-transparent" />
      </div>

      {/* Fixed right sidebar: stats */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-end gap-10 z-20">
        {stats.map(({ value, label }) => (
          <div key={value} className="text-right">
            <p className="font-display text-4xl font-bold text-accent leading-none">
              {value}
            </p>
            <p className="text-slate-400 text-xs mt-2 leading-snug whitespace-pre-line">
              {label}
            </p>
          </div>
        ))}
      </div>

      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
      </main>
      <Footer />
    </>
  );
}
