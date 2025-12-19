import { useNavigate } from "react-router-dom";
import { Recipe } from "@/lib/types";
import { Clock, Users, ChefHat, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const difficultyColors = {
  Easy: "bg-teal-100 text-teal-700",
  Medium: "bg-accent/20 text-accent",
  Hard: "bg-coral/20 text-coral",
};

export function RecipeCard({
  recipe,
  onClick,
  className,
  style,
}: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Pentru a favoriza retetele, creaza un cont", {
        description:
          "Alatura-te comunitatii noastre pentru a salva retetele preferate",
        action: {
          label: "Autentificare",
          onClick: () => navigate("/register"),
        },
        duration: 7000,
        className: "text-base md:text-lg font-medium flex flex-col gap-3",
        icon: null,
        style: {
          padding: "20px",
        },
      });
      return;
    }

    try {
      await toggleFavorite(recipe.id);
    } catch (error) {
      toast.error("Failed to update favorite");
    }
  };

  const isFav = isFavorite(recipe.id);

  return (
    <article
      onClick={onClick}
      style={style}
      className={cn(
        "group relative bg-card rounded-xl overflow-hidden cursor-pointer",
        "shadow-card hover:shadow-lifted",
        "transform transition-all duration-300 ease-out",
        "hover:-translate-y-2",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={recipe.coverImage}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Difficulty Badge */}
        <span
          className={cn(
            "absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold",
            "backdrop-blur-sm shadow-sm",
            difficultyColors[recipe.difficulty]
          )}
        >
          {recipe.difficulty}
        </span>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 left-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-200 shadow-sm"
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-all duration-200",
              isFav
                ? "fill-red-500 text-red-500"
                : "text-foreground hover:text-red-500"
            )}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {recipe.title}
        </h3>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 font-recipe">
          {recipe.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary" />
            <span>{totalTime} min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-primary" />
            <span>{recipe.servings}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ChefHat className="w-4 h-4 text-primary" />
            <span>{recipe.ingredients.length}</span>
          </div>
        </div>

        {/* Tags */}
        {recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {recipe.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
