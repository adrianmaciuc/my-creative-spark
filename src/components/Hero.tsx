import { SearchBar } from "./SearchBar";

interface HeroProps {
  onSearch: (query: string) => void;
  recipeCount: number;
}

export function Hero({ onSearch, recipeCount }: HeroProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-subtle" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-teal-200 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-teal-100 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Retete delicioase
            <span className="block text-primary">
              Pentru iepurasi pofticiosi
            </span>
          </h1>
          <p className="font-recipe text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            Colectie de retete delicioase pentru orice ocazie
          </p>

          <div className="flex justify-center mb-6">
            <SearchBar
              onSearch={onSearch}
              placeholder="Cauta dupa nume sau ingredient..."
            />
          </div>

          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-primary">{recipeCount}</span>{" "}
            {recipeCount <= 1 ? "reteta in colectie" : "retete in colectie"}
          </p>
        </div>
      </div>
    </section>
  );
}
