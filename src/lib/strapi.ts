import { Recipe } from "./types";
import { sampleRecipes } from "./sample-recipes";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL as string | undefined;

function mapStrapiToRecipe(data: any): Recipe {
  // Defensive mapping: if fields are missing, fall back to reasonable defaults
  return {
    id: String(data.id ?? data._id ?? Math.random()),
    slug:
      data.attributes?.slug ?? data.slug ?? data.id ?? String(data.id ?? ""),
    title: data.attributes?.title ?? data.title ?? "Untitled",
    description: data.attributes?.description ?? data.description ?? "",
    coverImage:
      data.attributes?.coverImage?.data?.attributes?.formats?.medium?.url ||
      data.attributes?.coverImage?.data?.attributes?.url ||
      data.coverImage ||
      data.attributes?.coverImage ||
      "",
    galleryImages:
      (data.attributes?.galleryImages?.data || data.galleryImages || []).map(
        (g: any) => {
          return (
            g?.attributes?.formats?.medium?.url || g?.attributes?.url || g || ""
          );
        }
      ) || [],
    ingredients: (data.attributes?.ingredients || data.ingredients || []).map(
      (ing: any, idx: number) => ({
        id: String(ing.id ?? idx),
        item: ing.item ?? ing.name ?? "",
        quantity: ing.quantity ?? "",
        unit: ing.unit ?? "",
        notes: ing.notes ?? "",
      })
    ),
    instructions: (
      data.attributes?.instructions ||
      data.instructions ||
      []
    ).map((ins: any, idx: number) => ({
      id: String(ins.id ?? idx),
      stepNumber: ins.stepNumber ?? idx + 1,
      description: ins.description ?? ins.text ?? "",
      image: ins.image?.url ?? ins.image ?? undefined,
      tips: ins.tips ?? undefined,
    })),
    prepTime: Number(data.attributes?.prepTime ?? data.prepTime ?? 0),
    cookTime: Number(data.attributes?.cookTime ?? data.cookTime ?? 0),
    servings: Number(data.attributes?.servings ?? data.servings ?? 1),
    difficulty: (data.attributes?.difficulty ??
      data.difficulty ??
      "Medium") as any,
    categories: (
      data.attributes?.categories?.data ||
      data.categories ||
      []
    ).map((c: any) => ({
      id: String(c.id ?? c._id ?? c.id),
      name: c.attributes?.name ?? c.name ?? c,
      slug: c.attributes?.slug ?? c.slug ?? String(c.id ?? c._id ?? c),
    })),
    tags: data.attributes?.tags ?? data.tags ?? [],
    createdAt: data.attributes?.createdAt ?? data.createdAt,
    updatedAt: data.attributes?.updatedAt ?? data.updatedAt,
  } as Recipe;
}

export async function getRecipes(): Promise<Recipe[]> {
  if (!STRAPI_URL) {
    // No Strapi configured — fallback to sample recipes
    return Promise.resolve(sampleRecipes);
  }

  try {
    const res = await fetch(
      `${STRAPI_URL.replace(/\/$/, "")}/api/recipes?populate=deep`
    );
    if (!res.ok) throw new Error(`Strapi responded ${res.status}`);
    const json = await res.json();
    const data = json.data || [];
    return data.map((item: any) => mapStrapiToRecipe(item));
  } catch (err) {
    console.error("Error fetching recipes from Strapi", err);
    // On error, return sample recipes as a graceful fallback
    return sampleRecipes;
  }
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  if (!STRAPI_URL)
    return Promise.resolve(sampleRecipes.find((r) => r.slug === slug) ?? null);

  try {
    const res = await fetch(
      `${STRAPI_URL.replace(
        /\/$/,
        ""
      )}/api/recipes?filters[slug][$eq]=${encodeURIComponent(
        slug
      )}&populate=deep`
    );
    if (!res.ok) throw new Error(`Strapi responded ${res.status}`);
    const json = await res.json();
    const item = json.data?.[0];
    if (!item) return null;
    return mapStrapiToRecipe(item);
  } catch (err) {
    console.error("Error fetching recipe by slug from Strapi", err);
    return sampleRecipes.find((r) => r.slug === slug) ?? null;
  }
}

export async function getCategories(): Promise<
  { id: string; name: string; slug: string }[]
> {
  if (!STRAPI_URL)
    return Promise.resolve([
      { id: "italian", name: "Italian", slug: "italian" },
      { id: "seafood", name: "Seafood", slug: "seafood" },
      { id: "thai", name: "Thai", slug: "thai" },
      { id: "desserts", name: "Desserts", slug: "desserts" },
      { id: "healthy", name: "Healthy", slug: "healthy" },
    ]);

  try {
    const res = await fetch(`${STRAPI_URL.replace(/\/$/, "")}/api/categories`);
    if (!res.ok) throw new Error(`Strapi responded ${res.status}`);
    const json = await res.json();
    return (json.data || []).map((c: any) => ({
      id: String(c.id ?? ""),
      name: c.attributes?.name ?? "Unknown",
      slug: c.attributes?.slug ?? `cat-${c.id}`,
    }));
  } catch (err) {
    console.error("Error fetching categories from Strapi", err);
    return [];
  }
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  const q = (query || "").trim();
  if (!q) return getRecipes();

  if (!STRAPI_URL) {
    // client-side fallback search over sample recipes
    const lower = q.toLowerCase();
    return sampleRecipes.filter(
      (r) =>
        r.title.toLowerCase().includes(lower) ||
        r.description.toLowerCase().includes(lower) ||
        r.tags.some((t) => t.toLowerCase().includes(lower)) ||
        r.ingredients.some((ing) => ing.item.toLowerCase().includes(lower)) ||
        r.instructions.some((ins) =>
          (ins.description || "").toLowerCase().includes(lower)
        )
    );
  }

  try {
    // Try server-side filtering on common fields (title, description, tags)
    const encoded = encodeURIComponent(q);
    const url = `${STRAPI_URL.replace(
      /\/$/,
      ""
    )}/api/recipes?filters[$or][0][title][$containsi]=${encoded}&filters[$or][1][description][$containsi]=${encoded}&filters[$or][2][tags][$containsi]=${encoded}&populate=deep`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Strapi responded ${res.status}`);
    const json = await res.json();
    const data = json.data || [];

    // If server-side returned results, map and return
    if (data.length > 0) {
      return data.map((item: any) => mapStrapiToRecipe(item));
    }

    // Otherwise, fetch all and perform client-side filtering to include ingredients/instructions
    const all = await getRecipes();
    const lower = q.toLowerCase();
    return all.filter(
      (r) =>
        r.title.toLowerCase().includes(lower) ||
        r.description.toLowerCase().includes(lower) ||
        r.tags.some((t) => t.toLowerCase().includes(lower)) ||
        r.ingredients.some((ing) => ing.item.toLowerCase().includes(lower)) ||
        r.instructions.some((ins) =>
          (ins.description || "").toLowerCase().includes(lower)
        )
    );
  } catch (err) {
    console.error("Error searching recipes in Strapi", err);
    // fallback to client-side search
    const lower = q.toLowerCase();
    return (await getRecipes()).filter(
      (r) =>
        r.title.toLowerCase().includes(lower) ||
        r.description.toLowerCase().includes(lower) ||
        r.tags.some((t) => t.toLowerCase().includes(lower)) ||
        r.ingredients.some((ing) => ing.item.toLowerCase().includes(lower)) ||
        r.instructions.some((ins) =>
          (ins.description || "").toLowerCase().includes(lower)
        )
    );
  }
}
