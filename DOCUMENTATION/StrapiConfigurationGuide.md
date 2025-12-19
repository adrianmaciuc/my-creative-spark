# Strapi CMS Configuration Guide - Step by Step

Complete guide to configure Strapi CMS for the Recipe App

---

## 📋 Overview

This guide will walk you through configuring your Strapi CMS backend to work with the Recipe App frontend. You'll create:

- **Category** collection type (for recipe categorization)
- **Ingredient** component (repeatable ingredient entries)
- **Instruction** component (step-by-step cooking instructions)
- **Recipe** collection type (main content type with all fields)
- **API permissions** (public read access)

**Estimated time**: 45-60 minutes

---

## ✅ Prerequisites

Before starting, ensure:

- [ ] Strapi is installed and running at `http://localhost:1337`
- [ ] You've created an admin user and logged in
- [ ] You're at the Strapi admin panel welcome screen

---

## Part 1: Create Category Collection Type

### Step 1.1: Navigate to Content-Type Builder

1. In the left sidebar, click **Content-Type Builder** (icon looks like blocks)
2. You should see the Content-Type Builder interface

### Step 1.2: Create Category Collection

1. Click **"Create new collection type"** button (top right area)
2. **Display name**: Enter `Category`
3. **API ID (singular)**: Should auto-fill as `category`
4. **API ID (plural)**: Should auto-fill as `categories`
5. Click **Continue**

### Step 1.3: Add Category Fields

#### Field 1: name

1. Click **"Add another field"**
2. Select **Text** field type
3. **Name**: `name`

- **Type**: Short text
- Go to **Advanced settings** tab
- Check **"Required field"**
- **Maximum length**: Leave empty or set to 100
- Click **Finish**

#### Field 2: slug

1. Click **"Add another field"**
2. Select **UID** field type
3. **Name**: `slug`
4. **Attached field**: Select `name` from dropdown

- Go to advanced settings tab
- Check **"Required field"**
- Click **Finish**

### Step 1.4: Save Category

1. Click **Save** button (top left)
2. Wait for server to restart (this takes 10-20 seconds)
3. You'll see a success message

✅ **Category collection type created!**

---

## Part 2: Create Components

Components are reusable structures that can be used in multiple content types.

### Step 2.1: Create Ingredient Component

#### Navigate to Components

1. Still in **Content-Type Builder**
2. Look for **Components** section in the left panel
3. Click **"Create new component"** button (the plus icon)

#### Configure Component Category

1. **Display name**: `ingredient`
2. **Category**: Select **"Create new category"**
3. **Category name**: `recipe`
4. **Icon**: Choose any icon you like (e.g., 🍽️)
5. Click **Continue**

#### Add Ingredient Fields

**Field 1: item** (required)

1. Click **"Add another field to this component"**
2. Select **Text** field type
3. **Name**: `item`
4. Configuration:
   - **Type**: Short text
   - go to **Advanced settings** tab
   - Check **"Required field"**
   - Click **Finish**

**Field 2: quantity** (required)

1. Click **"Add another field to this component"**
2. Select **Text** field type
3. **Name**: `quantity`
4. Configuration:
   - **Type**: Short text
   - go to **Advanced settings** tab
   - Check **"Required field"**
   - Click **Finish**

**Field 3: unit** (optional)

1. Click **"Add another field to this component"**
2. Select **Text** field type
3. **Name**: `unit`
4. Configuration:
   - **Type**: Short text
   - go to **Advanced settings** tab
   - Leave **"Required field"** unchecked
   - Click **Finish**

**Field 4: notes** (optional)

1. Click **"Add another field to this component"**
2. Select **Text** field type
3. **Name**: `notes`
4. Configuration:
   - **Type**: Short text
   - go to **Advanced settings** tab
   - Leave **"Required field"** unchecked
   - Click **Finish**

#### Save Component

1. Click **Save** button
2. Wait for server restart

✅ **Ingredient component created!**

---

### Step 2.2: Create Instruction Component

#### Start New Component

1. In **Content-Type Builder** → **Components**
2. Click **"Create new component"**

#### Configure Component

1. **Display name**: `instruction`
2. **Category**: Select **"recipe"** (the category we created before)
3. Click **Continue**

#### Add Instruction Fields

**Field 1: stepNumber** (required)

1. Click **"Add another field to this component"**
2. Select **Number** field type
3. **Name**: `stepNumber`
4. Configuration:
   - **Number format**: Integer
   - go to **Advanced settings** tab
   - Check **"Required field"**
   - Click **Finish**

**Field 2: description** (required)

1. Click **"Add another field to this component"**
2. Select **Text** field type
3. **Name**: `description`
4. Configuration:
   - **Type**: Long text
   - go to **Advanced settings** tab
   - Check **"Required field"**
   - Click **Finish**

**Field 3: image** (optional)

1. Click **"Add another field to this component"**
2. Select **Media** field type
3. **Name**: `image`
4. Configuration:
   - **Type**: Single media
   - go to advanced settings tab
   - **Allowed types of media**: Check only **"Images"**
   - Leave **"Required field"** unchecked
   - Click **Finish**

**Field 4: tips** (optional)

1. Click **"Add another field to this component"**
2. Select **Text** field type
3. **Name**: `tips`
4. Configuration:
   - **Type**: Short text
   - go to advanced settings tab
   - Leave **"Required field"** unchecked
   - Click **Finish**

#### Save Component

1. Click **Save** button
2. Wait for server restart

✅ **Instruction component created!**

---

## Part 3: Create Recipe Collection Type

This is the main content type that will hold all recipe data.

### Step 3.1: Start Recipe Collection

1. In **Content-Type Builder**
2. Click **"Create new collection type"**
3. **Display name**: `Recipe`
4. **API ID (singular)**: Should auto-fill as `recipe`
5. **API ID (plural)**: Should auto-fill as `recipes`
6. Click **Continue**

### Step 3.2: Add Recipe Fields

We'll add 13 fields in total. Let's go one by one:

#### Field 1: title (Text)

1. Click **"Add another field"**
2. Select **Text**
3. **Name**: `title`
4. Configuration:
   - **Type**: Short text
   - go to **Advanced settings** tab
   - Check **"Required field"**
   - **Maximum length**: 200
   - Click **Finish**

#### Field 2: slug (UID)

1. Click **"Add another field"**
2. Select **UID**
3. **Name**: `slug`
4. **Attached field**: Select `title`
5. Configuration:
   - go to **Advanced settings** tab
   - Check **"Required field"**
   - Click **Finish**

#### Field 3: description (Text)

1. Click **"Add another field"**
2. Select **Text**
3. **Name**: `description`
4. Configuration:
   - **Type**: Long text
   - go to **Advanced settings** tab
   - Check **"Required field"**
   - **Maximum length**: 1000
   - Click **Finish**

#### Field 4: coverImage (Media)

1. Click **"Add another field"**
2. Select **Media**
3. **Name**: `coverImage`
4. Configuration:
   - **Type**: Single media
   - go to advanced settings tab
   - **Allowed types**: Check only **"Images"**
   - Check **"Required field"**
   - Click **Finish**

#### Field 5: galleryImages (Media)

1. Click **"Add another field"**
2. Select **Media**
3. **Name**: `galleryImages`
4. Configuration:
   - **Type**: Multiple media
   - go to advanced settings tab
   - **Allowed types**: Check only **"Images"**
   - Leave **"Required field"** unchecked
   - Click **Finish**

#### Field 6: ingredients (Component)

1. Click **"Add another field"**
2. Select **Component**
3. Dialog "Add new component (1/2)" opens:
   - Select **"Use an existing component"** (radio button on right)
   - Click Select a component
4. Dialog "Add new component (2/2)" opens:
   - **Name**: Enter `ingredients`
   - **Select a component**: `recipe - ingredient`
   - **Type**: `Repeatable component` should already be selected
   - Click **ADVANCED SETTINGS** tab
   - Check **"Required field"**
   - Click **Finish**

#### Field 7: instructions (Component)

1. Click **"Add another field"**
2. Select **Component**
3. Dialog "Add new component (1/2)" opens:
   - Select **"Use an existing component"** (radio button on right)
   - Click Select a component
4. Dialog "Add new component (2/2)" opens:
   - **Name**: Enter `instructions`
   - **Select a component**: `recipe - instruction`
   - **Type**: `Repeatable component` should already be selected
   - Click **ADVANCED SETTINGS** tab
   - Check **"Required field"**
   - Click **Finish**

#### Field 8: prepTime (Number)

1. Click **"Add another field"**
2. Select **Number**
3. **Name**: `prepTime`
4. Configuration:
   - **Number format**: Integer
   - go to **Advanced settings** tab
   - Check **"Required field"**
   - **Minimum value**: 0
   - Click **Finish**

#### Field 9: cookTime (Number)

1. Click **"Add another field"**
2. Select **Number**
3. **Name**: `cookTime`
4. Configuration:
   - **Number format**: Integer
   - go to **Advanced settings** tab
   - Check **"Required field"**
   - **Minimum value**: 0
   - Click **Finish**

#### Field 10: servings (Number)

1. Click **"Add another field"**
2. Select **Number**
3. **Name**: `servings`
4. Configuration:
   - **Number format**: Integer
   - go to **Advanced settings** tab
   - Check **"Required field"**
   - **Default value**: 4
   - **Minimum value**: 1
   - Click **Finish**

#### Field 11: difficulty (Enumeration)

1. Click **"Add another field"**
2. Select **Enumeration**
3. **Name**: `difficulty`
4. Configuration:
   - Add these values:
     - `Easy`
     - `Medium`
     - `Hard`
   - go to **Advanced settings** tab
   - Check **"Required field"**
   - **Default value**: Select `Medium`
   - Click **Finish**

#### Field 12: categories (Relation)

1. Click **"Add another field"**
2. Select **Relation**
3. The "Add new Relation field" dialog opens:
   - **Left side (Recipe)**:
     - Should show **Recipe**
     - **Field name**: `categories` (auto-filled)
   - **Right side (Category)**:
     - Select **Category** from dropdown
     - **Field name**: `recipe` (auto-filled)
   - **Relation type**: Click the **3rd icon** (middle row, center)
     - This represents: "Recipe **belongs to many** Categories"
   - Click **Finish**

#### Field 13: tags (JSON)

1. Click **"Add another field"**
2. Select **JSON**
3. **Name**: `tags`
4. Configuration:
   - Leave **"Required field"** unchecked
   - Click **Finish**

### Step 3.3: Save Recipe Collection

1. Click **Save** button (top left)
2. Wait for server to restart (may take 5-10 seconds)
3. You should see a success notification

✅ **Recipe collection type created with all fields!**

---

## Part 4: Configure API Permissions

Allow public (unauthenticated) users to read recipes and categories.

### Step 4.1: Navigate to Settings

1. In the left sidebar, click **Settings** (gear icon at bottom)
2. Under **USERS & PERMISSIONS PLUGIN**, click **Roles**

### Step 4.2: Configure Public Role

1. Click on **Public** role
2. Scroll down to the **Permissions** section

### Step 4.3: Enable Recipe Permissions

1. Find **Recipe** in the permissions list
2. Expand it by clicking on it
3. Check these permissions:
   - ✅ **find** (allows GET /api/recipes)
   - ✅ **findOne** (allows GET /api/recipes/:id)
4. Do NOT check `create`, `update`, or `delete` (these should only be done via admin panel)

### Step 4.4: Enable Category Permissions

1. Find **Category** in the permissions list
2. Expand it
3. Check these permissions:
   - ✅ **find** (allows GET /api/categories)
   - ✅ **findOne** (allows GET /api/categories/:id)

### Step 4.5: Save Permissions

1. Scroll to the top
2. Click **Save** button (top right)
3. You should see a success message

✅ **API permissions configured!**

---

## Part 5: Add Sample Data

### Step 5.1: Create Categories

1. In left sidebar, click **Content Manager**
2. Click **Category** under **Collection Types**
3. Click **"Create new entry"** button

#### Category 1: Italian

- **name**: `Italian`
- **slug**: Auto-generated as `italian`
- Click **Save**
- Click **Publish** button

#### Category 2: Desserts

- **name**: `Desserts`
- **slug**: Auto-generated as `desserts`
- Click **Save** and **Publish**

#### Category 3: Healthy

- **name**: `Healthy`
- **slug**: Auto-generated as `healthy`
- Click **Save** and **Publish**

Create additional categories as desired (Seafood, Thai, Mexican, etc.)

✅ **Categories created!**

---

### Step 5.2: Create Sample Recipe

1. In **Content Manager**, click **Recipe** under **Collection Types**
2. Click **"Create new entry"**

#### Fill in Recipe Fields:

**Basic Info:**

- **title**: `Classic Margherita Pizza`
- **slug**: Auto-generated as `classic-margherita-pizza`
- **description**: `A traditional Italian pizza with fresh ingredients, featuring a crispy crust, tangy tomato sauce, creamy mozzarella, and fragrant basil. Perfect for a homemade pizza night!`

**Cover Image:**

- Click **"Add an asset"** or upload a pizza image
- Upload any pizza image you have (or use Unsplash)

**Gallery Images** (optional):

- Add 2-3 process images if desired

**Ingredients:**
Click **"Add a component"** for each ingredient:

1. First ingredient:

   - **item**: `Pizza dough`
   - **quantity**: `500`
   - **unit**: `g`
   - **notes**: Leave empty

2. Second ingredient:

   - **item**: `Tomato sauce`
   - **quantity**: `200`
   - **unit**: `ml`
   - **notes**: Leave empty

3. Third ingredient:

   - **item**: `Fresh mozzarella`
   - **quantity**: `250`
   - **unit**: `g`
   - **notes**: `torn into pieces`

4. Fourth ingredient:

   - **item**: `Fresh basil leaves`
   - **quantity**: `10`
   - **unit**: `leaves`
   - **notes**: Leave empty

5. Fifth ingredient:
   - **item**: `Olive oil`
   - **quantity**: `2`
   - **unit**: `tbsp`
   - **notes**: Leave empty

**Instructions:**
Click **"Add a component"** for each step:

1. Step 1:

   - **stepNumber**: `1`
   - **description**: `Preheat your oven to 250°C (480°F). If using a pizza stone, place it in the oven while preheating.`
   - **image**: Leave empty or add image
   - **tips**: `A hot oven is key to a crispy crust`

2. Step 2:

   - **stepNumber**: `2`
   - **description**: `Roll out the pizza dough on a floured surface into a 12-inch circle, about 1/4 inch thick.`
   - **image**: Leave empty
   - **tips**: Leave empty

3. Step 3:

   - **stepNumber**: `3`
   - **description**: `Spread tomato sauce evenly over the dough, leaving a 1-inch border for the crust.`
   - **image**: Leave empty
   - **tips**: Leave empty

4. Step 4:

   - **stepNumber**: `4`
   - **description**: `Distribute torn mozzarella pieces evenly over the sauce.`
   - **image**: Leave empty
   - **tips**: Leave empty

5. Step 5:
   - **stepNumber**: `5`
   - **description**: `Bake for 12-15 minutes until the crust is golden and cheese is bubbly. Remove from oven, add fresh basil leaves and drizzle with olive oil.`
   - **image**: Leave empty
   - **tips**: `Add basil after baking to keep it fresh`

**Times & Servings:**

- **prepTime**: `30` (minutes)
- **cookTime**: `15` (minutes)
- **servings**: `4`
- **difficulty**: Select `Medium`

**Categories:**

- Click the categories dropdown
- Select **Italian** (and any others that apply)

**Tags:**
Enter this JSON array (copy and paste):

```json
["italian", "pizza", "vegetarian", "classic"]
```

#### Save and Publish

1. Click **Save** button (top right)
2. Click **Publish** button
3. You should see success messages

✅ **Sample recipe created!**

---

### Step 5.3: Create 1-2 More Recipes

Repeat Step 5.2 with different recipes. Here are suggestions:

**Recipe 2: Chocolate Lava Cake**

- Categories: Desserts
- Difficulty: Medium
- Tags: `["dessert", "chocolate", "french"]`

**Recipe 3: Mediterranean Quinoa Bowl**

- Categories: Healthy
- Difficulty: Easy
- Tags: `["healthy", "vegetarian", "mediterranean", "bowl"]`

---

## Part 6: Test the Configuration

### Step 6.1: Test API Endpoints

Open these URLs in your browser to verify API access:

**Get all recipes:**

```
http://localhost:1337/api/recipes?populate=*
```

Should return JSON with your recipes and all nested data.

**Get all categories:**

```
http://localhost:1337/api/categories
```

Should return JSON with your categories.

**Get specific recipe by slug:**

```
http://localhost:1337/api/recipes?filters[slug][$eq]=classic-margherita-pizza&populate=*
```

Should return the specific recipe.

✅ **If all URLs return data, your API is working correctly!**

---

### Step 6.2: Connect Frontend

1. In your project root, create or edit `.env` file:

   ```env
   VITE_STRAPI_URL=http://localhost:1337
   ```

2. Restart your frontend dev server:

   ```bash
   npm run dev
   ```

3. Open `http://localhost:8080` (or your Vite port)

4. Check browser console - you should see:

   ```
   ✅ Successfully fetched X recipes from Strapi
   ✅ Successfully fetched X categories from Strapi
   ```

5. Your recipes should display on the homepage!

✅ **Frontend connected to Strapi!**

---

## Part 7: Authentication Setup (Optional)

This section extends Strapi for user authentication with role-based access control. Complete this if you're implementing the authentication features from [AuthenticationPlan.md](./AuthenticationPlan.md).

### Step 7.1: Extend User Collection with Custom Fields

**Purpose**: Add custom fields for user profiles and role management

**Location**: Content-Type Builder → User (under Users & Permissions)

#### Navigate to User Collection

1. Click **Content-Type Builder** in left sidebar
2. Under **USERS & PERMISSIONS PLUGIN**, click **User**
3. You'll see existing fields (username, email, etc.)

#### Add Custom Fields

**Field 1: role (Enumeration)**

1. Click **"Add another field"**
2. Select **Enumeration** field type
3. **Name**: `role`
4. Configuration:
   - Add value: `user` (press Enter)
   - Add value: `cook` (press Enter)
   - **Default value**: `user`
   - Go to **Advanced settings** tab
   - Check **"Required field"**
   - Click **Finish**

**Field 2: avatar (Text)**

1. Click **"Add another field"**
2. Select **Text** field type
3. **Name**: `avatar`
4. Configuration:
   - **Type**: Short text
   - Leave **"Required field"** unchecked
   - Click **Finish**

**Field 3: newsletterSubscribed (Boolean)**

1. Click **"Add another field"**
2. Select **Boolean** field type
3. **Name**: `newsletterSubscribed`
4. Configuration:
   - **Default value**: `false`
   - Leave **"Required field"** unchecked
   - Click **Finish**

**Field 4: bio (Text)**

1. Click **"Add another field"**
2. Select **Text** field type
3. **Name**: `bio`
4. Configuration:

   - **Type**: Long text
   - Leave **"Required field"** unchecked
   - Click **Finish**

5. Click **Save** button (top right)
6. Wait for server restart

✅ **User collection extended with custom fields!**

---

### Step 7.2: Create Favorites Collection Type

**Purpose**: Track which recipes users have favorited (many-to-many relationship)

#### Create Collection

1. In **Content-Type Builder**, click **"Create new collection type"**
2. **Display name**: `Favorite`
3. **API ID (singular)**: Should auto-fill as `favorite`
4. **API ID (plural)**: Should auto-fill as `favorites`
5. Click **Continue**

#### Add Fields

**Field 1: user (Relation)**

1. Click **"Add another field"**
2. Select **Relation** field type
3. Configure the relation:
   - **Left side**: Favorite has one User
   - **Right side**: User has many Favorites
   - This creates a **Many-to-One** relationship
   - **Field name**: `user`
4. Go to **Advanced settings** tab
5. Check **"Required field"**
6. Click **Finish**

**Field 2: recipe (Relation)**

1. Click **"Add another field"**
2. Select **Relation** field type
3. Configure the relation:
   - **Left side**: Favorite has one Recipe
   - **Right side**: Recipe has many Favorites
   - This creates a **Many-to-One** relationship
   - **Field name**: `recipe`
4. Go to **Advanced settings** tab
5. Check **"Required field"**
6. Click **Finish**

7. Click **Save** button
8. Wait for server restart

✅ **Favorites collection created!**

**Note**: `createdAt` and `updatedAt` are auto-generated by Strapi.

---

### Step 7.3: Add Author Field to Recipe Collection

**Purpose**: Track which cook created each recipe

#### Add Author Relation

1. In **Content-Type Builder**, click **Recipe** under Collection Types
2. Click **"Add another field"**
3. Select **Relation** field type
4. Configure the relation:
   - **Left side**: Recipe has one User (author)
   - **Right side**: User has many Recipes
   - This creates a **Many-to-One** relationship
   - **Field name**: `author`
5. Go to **Advanced settings** tab
6. Leave **"Required field"** unchecked (for now, to avoid breaking existing recipes)
7. Click **Finish**
8. Click **Save**
9. Wait for server restart

✅ **Recipe now has author field!**

---

### Step 7.4: Configure API Permissions for Authentication

**Location**: Settings → Roles

#### 1. Configure Public Role

1. In left sidebar, click **Settings** (gear icon)
2. Under **USERS & PERMISSIONS PLUGIN**, click **Roles**
3. Click **Public** role

**Enable these permissions**:

**Auth**:

- ✅ `register` - Allow new user registration
- ✅ `callback` - OAuth callback (for future social login)

**Recipe**:

- ✅ `find` - List recipes
- ✅ `findOne` - View single recipe
- ❌ `create`, `update`, `delete` - Keep disabled

**Category**:

- ✅ `find` - List categories
- ✅ `findOne` - View single category
- ❌ `create`, `update`, `delete` - Keep disabled

**Favorite**:

- ❌ All disabled - Users must be authenticated to favorite recipes

4. Scroll to top and click **Save**

---

#### 2. Configure Authenticated Role

1. Still in Settings → Roles, click **Authenticated** role

**Enable these permissions**:

**Recipe**:

- ✅ `find` - List recipes
- ✅ `findOne` - View single recipe
- ❌ `create`, `update`, `delete` - Disabled (only cooks can do this)

**Category**:

- ✅ `find` - List categories
- ✅ `findOne` - View single category

**Favorite**:

- ✅ `find` - List own favorites
- ✅ `findOne` - View specific favorite
- ✅ `create` - Add favorite
- ✅ `delete` - Remove own favorite
- ❌ `update` - Not needed

**User**:

- ✅ `me` - Get own profile
- ✅ `update` - Update own profile

2. Click **Save**

---

#### 3. Create Cook Role

1. Still in Settings → Roles, click **"Add new role"** button
2. **Name**: `Cook`
3. **Description**: `Role for recipe creators with full recipe management`
4. Click **Save**

**Enable these permissions**:

**Recipe**:

- ✅ `find` - List all recipes
- ✅ `findOne` - View single recipe
- ✅ `create` - Create new recipes
- ✅ `update` - Edit recipes
- ✅ `delete` - Delete recipes

**Category**:

- ✅ `find` - List categories
- ✅ `findOne` - View single category
- ⚠️ `create`, `update`, `delete` - Optional (decide if cooks can manage categories)

**Favorite**:

- ✅ All enabled - Cooks can also favorite recipes

**User**:

- ✅ `me` - Get own profile
- ✅ `update` - Update own profile

5. Click **Save**

✅ **API permissions configured!**

**Important Note**: For production, you should add custom policies to ensure cooks can only edit/delete their own recipes. This requires custom code in Strapi policies. See [AuthenticationPlan.md](./AuthenticationPlan.md) Phase 1.4 for policy implementation details.

---

### Step 7.5: Test Authentication API

#### Test User Registration

Open your browser or API client (Postman/Insomnia):

**Request**:

```
POST http://localhost:1337/api/auth/local/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test123!",
  "role": "user"
}
```

**Expected Response**:

```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "role": "user",
    "avatar": null,
    "newsletterSubscribed": false,
    "bio": null
  }
}
```

#### Test User Login

**Request**:

```
POST http://localhost:1337/api/auth/local
Content-Type: application/json

{
  "identifier": "test@example.com",
  "password": "Test123!"
}
```

**Expected Response**:

```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

#### Test Get Current User

**Request**:

```
GET http://localhost:1337/api/users/me
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Expected Response**:

```json
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "role": "user",
  ...
}
```

✅ **If all tests pass, authentication is working correctly!**

---

### Step 7.6: Create Sample Users via Admin Panel

1. In Strapi admin, click **Content Manager** (left sidebar)
2. Under **USERS & PERMISSIONS PLUGIN**, click **User**
3. Click **"Create new entry"**

**Create a Cook User**:

- **Username**: `chef_john`
- **Email**: `john@example.com`
- **Password**: `Chef123!`
- **Role**: Select `cook`
- **Avatar**: `https://api.dicebear.com/8.x/avataaars/svg?seed=chef_john`
- **Newsletter Subscribed**: Check if desired
- **Bio**: `Professional chef with 10 years of experience`
- **Confirmed**: ✅ Check this
- **Blocked**: Leave unchecked

4. Click **Save** and **Publish**

**Create a Regular User**:

- **Username**: `foodlover`
- **Email**: `lover@example.com`
- **Password**: `Food123!`
- **Role**: Select `user`
- **Avatar**: `https://api.dicebear.com/8.x/avataaars/svg?seed=foodlover`
- **Confirmed**: ✅ Check this

5. Click **Save** and **Publish**

✅ **Sample users created for testing!**

---

## 🎉 Configuration Complete!

You've successfully configured Strapi CMS with:

- ✅ Category collection type
- ✅ Ingredient component
- ✅ Instruction component
- ✅ Recipe collection type with all fields
- ✅ Public API permissions
- ✅ Sample data
- ✅ Frontend connection verified

---

## 📝 Next Steps

1. **Add more recipes** via Content Manager
2. **Upload better images** for your recipes
3. **Create more categories** to organize recipes
4. **Test the search** functionality on the frontend
5. **Explore Strapi plugins** (if needed)

---

## 🔧 Troubleshooting

### Issue: "An error occurred - when saving content type"

**Solution:**

- logut and log back into Strapi admin

### Issue: "Server restart failed"

**Solution:**

- Close Strapi terminal
- Delete `.cache` and `build` folders in backend directory
- Restart: `npm run develop`

### Issue: "Cannot access /api/recipes - 403 Forbidden"

**Solution:**

- Check Settings → Roles → Public → Permissions
- Ensure `find` and `findOne` are checked for Recipe
- Click Save

### Issue: "Recipe images not showing"

**Solution:**

- Check that images are uploaded in Content Manager
- Verify image URLs in API response
- Check browser console for CORS errors

### Issue: "Frontend shows sample data instead of Strapi data"

**Solution:**

- Verify `.env` file has `VITE_STRAPI_URL=http://localhost:1337`
- Restart Vite dev server after creating `.env`
- Check browser console for connection errors
- Verify Strapi is running on port 1337

---

## 📚 Additional Resources

- [Strapi Documentation](https://docs.strapi.io/)
- [Content-Type Builder Guide](https://docs.strapi.io/user-docs/content-type-builder)
- [API Documentation](https://docs.strapi.io/dev-docs/api/rest)
- [Authentication Plan](./AuthenticationPlan.md) - Complete frontend implementation guide
- [Users & Permissions Plugin](https://docs.strapi.io/dev-docs/plugins/users-permissions)

---

**Happy cooking! 🍳**
