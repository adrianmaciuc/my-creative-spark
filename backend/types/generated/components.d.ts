import type { Schema, Struct } from '@strapi/strapi';

export interface RecipeIngredient extends Struct.ComponentSchema {
  collectionName: 'components_recipe_ingredients';
  info: {
    displayName: 'ingredient';
    icon: 'priceTag';
  };
  attributes: {
    item: Schema.Attribute.String & Schema.Attribute.Required;
    notes: Schema.Attribute.String;
    quantity: Schema.Attribute.String & Schema.Attribute.Required;
    unit: Schema.Attribute.String;
  };
}

export interface RecipeInstruction extends Struct.ComponentSchema {
  collectionName: 'components_recipe_instructions';
  info: {
    displayName: 'instruction';
    icon: 'calendar';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    stepNumber: Schema.Attribute.Integer & Schema.Attribute.Required;
    tips: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'recipe.ingredient': RecipeIngredient;
      'recipe.instruction': RecipeInstruction;
    }
  }
}
