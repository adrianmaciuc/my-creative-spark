import { Recipe } from "@/lib/types";
import { Clock, Users, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

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

  return (
    <article
      onClick={onClick}
      style={style}
      data-testid={`recipe-card-${recipe.slug}`}
      className={cn(
        "group relative bg-card rounded-xl overflow-hidden cursor-pointer",
        "shadow-card hover:shadow-lifted",
        "transform transition-all duration-300 ease-out",
        "hover:-translate-y-2",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden" data-testid={`recipe-card-${recipe.slug}-image-container`}>
        <img
          src={recipe.coverImage}
          alt={recipe.title}
          data-testid={`recipe-card-${recipe.slug}-image`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" data-testid={`recipe-card-${recipe.slug}-image-overlay`} />

        {/* Difficulty Badge */}
        <span
          data-testid={`recipe-card-${recipe.slug}-difficulty`}
          className={cn(
            "absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold",
            "backdrop-blur-sm shadow-sm",
            difficultyColors[recipe.difficulty]
          )}
        >
          {recipe.difficulty}
        </span>
      </div>

      {/* Content */}
      <div className="p-5" data-testid={`recipe-card-${recipe.slug}-content`}>
        <h3 className="font-display text-lg font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors" data-testid={`recipe-card-${recipe.slug}-title`}>
          {recipe.title}
        </h3>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 font-recipe" data-testid={`recipe-card-${recipe.slug}-description`}>
          {recipe.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground" data-testid={`recipe-card-${recipe.slug}-meta`}>
          <div className="flex items-center gap-1.5" data-testid={`recipe-card-${recipe.slug}-time`}>
            <Clock className="w-4 h-4 text-primary" data-testid={`recipe-card-${recipe.slug}-time-icon`} />
            <span data-testid={`recipe-card-${recipe.slug}-time-value`}>{totalTime} min</span>
          </div>
          <div className="flex items-center gap-1.5" data-testid={`recipe-card-${recipe.slug}-servings`}>
            <Users className="w-4 h-4 text-primary" data-testid={`recipe-card-${recipe.slug}-servings-icon`} />
            <span data-testid={`recipe-card-${recipe.slug}-servings-value`}>{recipe.servings}</span>
          </div>
          <div className="flex items-center gap-1.5" data-testid={`recipe-card-${recipe.slug}-ingredients-count`}>
            <ChefHat className="w-4 h-4 text-primary" data-testid={`recipe-card-${recipe.slug}-ingredients-icon`} />
            <span data-testid={`recipe-card-${recipe.slug}-ingredients-value`}>{recipe.ingredients.length}</span>
          </div>
        </div>

        {/* Tags */}
        {recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4" data-testid={`recipe-card-${recipe.slug}-tags`}>
            {recipe.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                data-testid={`recipe-card-${recipe.slug}-tag-${tag}`}
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
