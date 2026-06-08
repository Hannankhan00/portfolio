import StarField from "./components/StarField";
import Menu from "./components/Menu";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
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

      {/* Scroll progress bar */}
      <ScrollProgress />

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
        <div className="w-px h-14 bg-linear-to-b from-accent/30 to-transparent" />
      </div>

      {/* Fixed right sidebar: stats */}
      <div className="hidden lg:flex flex-col items-end gap-10 z-20" style={{ position: 'fixed', right: '2rem', top: '62%', transform: 'translateY(-50%)' }}>
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
        <div className="h-24 sm:h-36" />
      </main>
      <Footer />
    </>
  );
}
