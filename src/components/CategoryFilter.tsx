import { cn } from "@/lib/utils";

interface CategoryType {
  id: string;
  name: string;
  slug: string;
  emoji?: string;
}

const defaultEmojis: Record<string, string> = {
  all: "🍽️",
  italian: "🍝",
  seafood: "🦐",
  thai: "🥢",
  desserts: "🍰",
  healthy: "🥗",
  japanese: "🍱",
};

interface CategoryFilterProps {
  selected: string;
  onSelect: (categoryId: string) => void;
  categories?: CategoryType[]; // optional, will fall back to built-in list
}

export function CategoryFilter({
  selected,
  onSelect,
  categories,
}: CategoryFilterProps) {
  const list =
    categories && categories.length > 0
      ? categories
      : [
          {
            id: "all",
            name: "Toate retetele",
            slug: "all",
            emoji: defaultEmojis.all,
          },
          {
            id: "italian",
            name: "Italian",
            slug: "italian",
            emoji: defaultEmojis.italian,
          },
          {
            id: "seafood",
            name: "Seafood",
            slug: "seafood",
            emoji: defaultEmojis.seafood,
          },
          { id: "thai", name: "Thai", slug: "thai", emoji: defaultEmojis.thai },
          {
            id: "desserts",
            name: "Desserts",
            slug: "desserts",
            emoji: defaultEmojis.desserts,
          },
          {
            id: "healthy",
            name: "Healthy",
            slug: "healthy",
            emoji: defaultEmojis.healthy,
          },
          {
            id: "japanese",
            name: "Japanese",
            slug: "japanese",
            emoji: defaultEmojis.japanese,
          },
        ];

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {list.map((category) => (
        <button
          key={category.slug}
          onClick={() => onSelect(category.slug)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            selected === category.slug
              ? "bg-primary text-primary-foreground shadow-soft"
              : "bg-card text-muted-foreground hover:bg-secondary hover:text-secondary-foreground border border-border"
          )}
        >
          <span>{category.emoji ?? defaultEmojis[category.slug] ?? "📁"}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
}
