# Authentication & User Roles Implementation Plan

⚠️ **ARCHIVED - December 22, 2025**

**This plan has been archived. All authentication features have been removed from the codebase.**

---

**Reason for removal**: Decided to keep the app simple and focus on core recipe functionality without authentication features. Strapi backend has been reset and will be reconfigured following StrapiConfigurationGuide.md (Parts 1-6 only).

**What was removed**:

- AuthContext and auth infrastructure
- Login/Register pages
- User Profile page
- Favorites feature
- Protected routes
- All auth-related API calls

**Current app features**:

- Browse recipes (public access)
- View recipe details
- Search recipes
- No user accounts needed

---

## Original Plan (For Reference Only)

**Recipe App User & Chef Authentication System**

---

## � Progress Overview

**Phase 1: Database & Backend** 🔄 In Progress

- Configure User fields (avatar, bio, newsletter) ✅
- Create Favorites collection ✅
- Add Recipe author field ✅
- Configure API permissions ✅
- Create sample users via Admin ❌ Blocked (403 on role fetch)
- Assign author to recipes 🔜 Pending

**Phase 2: Frontend Auth Infrastructure** ✅ Complete

- AuthContext with JWT management
- useAuth hook
- ProtectedRoute component
- auth.ts API client with tokenManager

**Phase 3: User Features** ✅ Complete

- Login/Register pages with Romanian text
- User Profile page with avatar selector
- Header auth state (login button, user dropdown)
- Favorites feature with toast CTA

**Phase 4: Chef Features** 🔄 In Progress

- Chef Dashboard → Not started
- Recipe Editor → Not started
- Recipe Preview → Not started
- Chef header features → Not started

**Phase 5: Technical Details** ✅ Complete

- JWT token management with tokenManager
- authenticatedFetch helper for protected calls
- DiceBear avatars integration

**Phase 6: Database Schema** ✅ Documented

- Complete schema aligned with StrapiConfigurationGuide.md
- SQL migration notes for PostgreSQL
- API permissions matrix

---

## �📋 Overview

Implement role-based authentication with two user types:

- **User**: Can browse recipes, favorite them, subscribe to newsletter, manage profile
- **Chef**: Can manage recipes (CRUD), moderate content, access recipe dashboard

**Stack**: Strapi JWT auth + React Context + localStorage

---

## 🔐 Architecture Overview

### Authentication Flow

```
User/Chef Registration
        ↓
Choose Role (User/Chef)
        ↓
POST /api/auth/local/register
        ↓
JWT Token + User Object stored in localStorage
        ↓
React Context provides auth state to all components
        ↓
Protected routes check role and redirect if needed
```

### Role Permissions

| Feature            | User | Chef |
| ------------------ | ---- | ---- |
| View Recipes       | ✅   | ✅   |
| Favorite Recipes   | ✅   | ✅   |
| View Favorites     | ✅   | ✅   |
| Newsletter Signup  | ✅   | ✅   |
| Add Recipes        | ❌   | ✅   |
| Edit All Recipes   | ❌   | ✅   |
| Delete All Recipes | ❌   | ✅   |
| Create Tags        | ❌   | ✅   |
| Manage Categories  | ❌   | ✅   |
| Access CMS UI      | ❌   | ✅   |

---

## 🛠️ Troubleshooting

### 403 Forbidden when assigning roles in Strapi Admin (even as Super Admin)

- Symptom: Admin header shows "Super Admin", but opening the Role field in Content Manager → Users triggers a 403 when Strapi tries to fetch roles.

  - Network example: GET /content-manager/collection-types/plugin::users-permissions.role/{id}? → 403 (Forbidden), sometimes with "policy failed".

- Repro:

  - Content Manager → Users (Users & Permissions) → Create new → open Role dropdown → request fails with 403.

- Already tried (still reproduces):

  - Full browser cache + cookies clear for localhost:1337/admin; fully close and reopen browser.
  - Kill process on port 1337 and restart Strapi.
  - Clear Strapi caches and restart from backend folder:
    - cd backend && rm -rf .cache build && npm run dev
  - Logout and login with the original Super Admin created at first boot.

- Next checks and potential fixes:

  - Verify Admin Panel role: Settings → Administration Panel → Users → ensure your admin user is truly "Super Admin".
  - Settings → Administration Panel → Roles: confirm default "Super Admin" role exists and is intact.
  - Watch server logs during the 403 to see which policy rejects the request (distinguish Admin vs Content API permission issues).
  - Create a fresh Super Admin to rule out a corrupted admin account:
    - cd backend && npm run strapi admin:create-user
  - Try a different browser profile (eliminate extension/cookie interference).

- Status: Issue remains after cache clears + restart; recorded here to revisit alongside StrapiConfigurationGuide Step 7.9.

---

## 🗄️ Phase 1: Database & Backend Setup

### Step 1.1: Extend User Collection with Custom Fields

**Status**: ❌ Not started

**Location**: Strapi Admin → Content-Type Builder → User (under Users & Permissions)

**Actions**:

1. Navigate to **Content-Type Builder** in left sidebar
2. Under **USERS & PERMISSIONS PLUGIN**, find and click **User**
3. Add the following custom fields:

#### Field 1: role (Enumeration)

1. Click **"Add another field"**
2. Select **Enumeration** field type
3. **Name**: `role`
4. Configuration:
   - Add these values:
     - `user` (default)
     - `chef`
   - **Default value**: `user`
   - Go to **Advanced settings** tab
   - Check **"Required field"**
   - Click **Finish**

#### Field 2: avatar (Text)

1. Click **"Add another field"**
2. Select **Text** field type
3. **Name**: `avatar`
4. Configuration:
   - **Type**: Short text (URL)
   - Leave **"Required field"** unchecked
   - **Default value**: Leave empty
   - Click **Finish**

#### Field 3: newsletterSubscribed (Boolean)

1. Click **"Add another field"**
2. Select **Boolean** field type
3. **Name**: `newsletterSubscribed`
4. Configuration:
   - **Default value**: `false`
   - Leave **"Required field"** unchecked
   - Click **Finish**

#### Field 4: bio (Text)

1. Click **"Add another field"**
2. Select **Text** field type
3. **Name**: `bio`
4. Configuration:

   - **Type**: Long text
   - Leave **"Required field"** unchecked
   - Click **Finish**

5. Click **Save** button (top right)
6. Wait for server restart (10-20 seconds)

**File Changes**: None (Strapi admin UI only)

**Database Changes**:

- Table: `up_users`
- New columns: `role`, `avatar`, `newsletter_subscribed`, `bio`

**Expected Result**:

- ✅ User collection has custom fields: role, avatar, newsletterSubscribed, bio
- ✅ createdAt and updatedAt already exist (auto-generated by Strapi)
- ✅ Frontend User interface matches backend schema

---

### Step 1.2: Create Favorites Collection Type

**Status**: ❌ Not started

**Purpose**: Track which recipes users favorite (many-to-many relationship through junction table)

**Actions**:

1. In **Content-Type Builder**, click **"Create new collection type"**
2. **Display name**: `Favorite`
3. **API ID (singular)**: Should auto-fill as `favorite`
4. **API ID (plural)**: Should auto-fill as `favorites`
5. Click **Continue**

#### Add Favorite Fields:

**Field 1: user (Relation)**

1. Click **"Add another field"**
2. Select **Relation** field type
3. Configure relation:
   - **Left side (Favorite)**: Favorite has one User
   - **Right side (User)**: User has many Favorites
   - **Relation type**: Many-to-One
   - **Field name**: `user`
4. Go to **Advanced settings** tab
5. Check **"Required field"**
6. Click **Finish**

**Field 2: recipe (Relation)**

1. Click **"Add another field"**
2. Select **Relation** field type
3. Configure relation:
   - **Left side (Favorite)**: Favorite has one Recipe
   - **Right side (Recipe)**: Recipe has many Favorites
   - **Relation type**: Many-to-One
   - **Field name**: `recipe`
4. Go to **Advanced settings** tab
5. Check **"Required field"**
6. Click **Finish**

7. Click **Save** button
8. Wait for server restart

**Database Changes**:

- Table: `favorites`
- Columns: `id`, `user_id` (FK to up_users), `recipe_id` (FK to recipes), `created_at`, `updated_at`

**API Endpoints Created**:

- `GET /api/favorites` - List user's favorites
- `POST /api/favorites` - Add favorite
- `DELETE /api/favorites/:id` - Remove favorite
- `GET /api/favorites/:id` - Get specific favorite

**Expected Result**:

- ✅ Favorites collection created
- ✅ Relations to User and Recipe established
- ✅ Can track which user favorited which recipe
- ✅ Frontend favorites.ts API matches backend endpoints

---

### Step 1.3: Add Author Field to Recipe Collection

**Status**: ❌ Not started

**Purpose**: Track which chef created each recipe

**Actions**:

1. In **Content-Type Builder**, click **Recipe** under Collection Types
2. Click **"Add another field"**
3. Select **Relation** field type
4. Configure relation:
   - **Left side (Recipe)**: Recipe has one User (author)
   - **Right side (User)**: User has many Recipes
   - **Relation type**: Many-to-One
   - **Field name**: `author`
5. Go to **Advanced settings** tab
6. Leave **"Required field"** unchecked (for now, until migration is done)
7. Click **Finish**
8. Click **Save**
9. Wait for server restart

**Database Changes**:

- Table: `recipes`
- New column: `author_id` (FK to up_users)

**Expected Result**:

- ✅ Recipe has author field
- ✅ Chefs can see only their recipes in dashboard
- ✅ Can filter recipes by author

---

### Step 1.4: Update Strapi API Permissions

**Status**: ❌ Not started

**Location**: Strapi Admin → Settings → Roles

**Actions**:

#### 1. Configure Public Role

**Path**: Settings → Roles → Public

**Enable these permissions**:

**Auth**:

- ✅ `register` - Allow user registration
- ✅ `callback` - OAuth callback
- ⚠️ Do NOT enable `forgot-password` or `reset-password` yet (future feature)

**Recipe**:

- ✅ `find` - List recipes
- ✅ `findOne` - View single recipe
- ❌ `create`, `update`, `delete` - Disabled

**Category**:

- ✅ `find` - List categories
- ✅ `findOne` - View single category
- ❌ `create`, `update`, `delete` - Disabled

**Favorite**:

- ❌ All disabled (must be authenticated)

Click **Save**

---

#### 2. Configure Authenticated Role

**Path**: Settings → Roles → Authenticated

**Enable these permissions**:

**Auth**:

- ✅ All enabled (already default)

**Recipe**:

- ✅ `find` - List recipes
- ✅ `findOne` - View single recipe
- ❌ `create`, `update`, `delete` - Disabled (only for chefs)

**Category**:

- ✅ `find` - List categories
- ✅ `findOne` - View single category
- ❌ `create`, `update`, `delete` - Disabled

**Favorite**:

- ✅ `find` - List own favorites
- ✅ `findOne` - View specific favorite
- ✅ `create` - Add favorite
- ✅ `delete` - Remove own favorite
- ❌ `update` - Not needed

**User**:

- ✅ `me` - Get own profile
- ✅ `update` - Update own profile (configure to only allow own)
- ❌ `find`, `findOne`, `create`, `delete` - Disabled

Click **Save**

---

#### 3. Create Chef Role

**Path**: Settings → Roles → Create new role

1. Click **"Add new role"** button
2. **Name**: `Chef`
3. **Description**: `Role for recipe creators with full recipe management access`
4. Click **Save**

**Enable these permissions**:

**Auth**:

- ✅ All enabled

**Recipe**:

- ✅ `find` - List all recipes
- ✅ `findOne` - View single recipe
- ✅ `create` - Create recipes
- ✅ `update` - Edit all recipes (no author restriction)
- ✅ `delete` - Delete all recipes (no author restriction)

**Category**:

- ✅ `find` - List categories
- ✅ `findOne` - View single category
- ⚠️ `create`, `update`, `delete` - Optional (decide if chefs can manage categories)

**Favorite**:

- ✅ All enabled (chefs can also favorite recipes)

**User**:

- ✅ `me` - Get own profile
- ✅ `update` - Update own profile
- ❌ `find`, `findOne`, `create`, `delete` - Disabled

Click **Save**

---

#### 4. No Custom Policies Required

**Status**: ✅ Not needed

Since chefs can edit and delete all recipes (not just their own), no custom policies are required. The default Strapi permissions are sufficient.

---

**File Changes**: None (Strapi admin UI only)

**Expected Result**:

- ✅ Public can view recipes and categories
- ✅ Public can register and login
- ✅ Authenticated users can favorite recipes
- ✅ Authenticated users can update own profile
- ✅ Chefs can create/edit/delete ALL recipes (no author restriction)
- ✅ Only superuser can manage categories

---

## 🎨 Phase 2: Frontend Setup - Auth Context & Hooks

### Step 2.1: Create Authentication Context

**Status**: ✅ DONE

**File**: `src/contexts/AuthContext.tsx`

**Code Structure**:

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "chef";
  avatar: string;
  newsletterSubscribed: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string,
    role: "user" | "chef"
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isChef: boolean;
}

// Provider component that:
// - Loads JWT from localStorage on mount
// - Verifies token still valid
// - Provides user data to entire app
// - Handles login/logout/register
```

**Expected Result**:

- ✅ Auth context created and exported
- ✅ Can access auth state anywhere with useAuth hook

---

### Step 2.2: Create useAuth Hook

**Status**: ✅ DONE

**File**: `src/hooks/useAuth.ts`

**Functionality**:

```typescript
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
```

**Expected Result**:

- ✅ Easy auth access in components
- ✅ Error thrown if used outside provider

---

### Step 2.3: Create Protected Route Component

**Status**: ✅ DONE

**File**: `src/components/ProtectedRoute.tsx`

**Functionality**:

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "user" | "chef";
}

// Component that:
// - Checks if user is authenticated
// - Checks if user has required role
// - Redirects to login if not authenticated
// - Redirects to unauthorized page if wrong role
```

**Expected Result**:

- ✅ Routes can be protected
- ✅ Role-based access control working

---

### Step 2.4: Create API Client for Auth

**Status**: ✅ DONE

**File**: `src/lib/auth.ts`

**Functions**:

```typescript
export const authAPI = {
  register: (email: string, username: string, password: string) => POST /api/auth/local/register,
  login: (identifier: string, password: string) => POST /api/auth/local,
  logout: () => Clear JWT from localStorage,
  me: (jwt: string) => GET /api/users/me,
  updateProfile: (jwt: string, data: Partial<User>) => PUT /api/users/me,
};
```

**Expected Result**:

- ✅ All auth API calls centralized
- ✅ JWT automatically included in requests

---

## 👤 Phase 3: User Authentication UI & Profile

### Step 3.1: Create Login Page

**Status**: ✅ DONE

**File**: `src/pages/Login.tsx`

**Features**:

- [ ] Email/username input field
- [ ] Password input field
- [ ] "Remember me" checkbox (optional)
- [ ] Login button
- [ ] Error message display
- [ ] Loading state
- [ ] Link to register page
- [ ] Link to forgot password (future feature)

**Styling**: Tailwind with turquoise/green theme

**Navigation**: On success → redirect to home page

**Expected Result**:

- ✅ Users can login
- ✅ Errors displayed clearly
- ✅ JWT stored in localStorage

---

### Step 3.2: Create Register Page

**Status**: ✅ DONE

**File**: `src/pages/Register.tsx`

**Features**:

- [ ] Email input (with validation)
- [ ] Username input
- [ ] Password input (with strength indicator)
- [ ] Confirm password input
- [ ] Role selection: "User" or "Chef" buttons/radio
- [ ] Terms & conditions checkbox
- [ ] Register button
- [ ] Error handling
- [ ] Loading state
- [ ] Link to login page

**Role Selection UI**:

```
Choose Your Role:
[User Card]     [Chef Card]
- Browse        - Manage recipes
- Favorite      - Create content
- Newsletter    - CMS access
```

**Expected Result**:

- ✅ New users can register
- ✅ Role selected during registration
- ✅ Token stored, auto-login on success

---

### Step 3.3: Create User Profile Page

**Status**: ✅ DONE

**File**: `src/pages/UserProfile.tsx`

**Layout**:

```
┌─ Header: User Avatar + Name
├─ Profile Section
│  ├─ Avatar (clickable → change)
│  ├─ Username (editable)
│  ├─ Email (read-only)
│  ├─ Bio (editable)
│  └─ Update Profile button
├─ Newsletter Section
│  ├─ Toggle "Subscribe to Newsletter"
│  └─ Last email date (if applicable)
├─ Favorites Section (Users only)
│  ├─ Display as grid of recipe cards
│  └─ Remove from favorites button on each card
├─ Stats Section
│  ├─ Total favorites
│  ├─ Member since
│  └─ Role badge
└─ Logout Button
```

**Features**:

- [ ] Display user avatar
- [ ] Edit username/bio
- [ ] Change avatar (random selection or upload)
- [ ] Toggle newsletter subscription
- [ ] View favorite recipes (grid)
- [ ] Remove favorites
- [ ] Edit password (optional)
- [ ] Delete account (optional)

**Avatar Options**:

- [ ] 10+ random avatar URLs (generate from service like DiceBear, Gravatar, or UI Avatars)
- [ ] "Randomize" button to assign new random avatar
- [ ] Display current avatar as preview

**Expected Result**:

- ✅ Users can manage their profile
- ✅ Avatar changes persist
- ✅ Newsletter preference saved
- ✅ Favorites displayed beautifully

---

### Step 3.4: Create Avatar Selection Component

**Status**: ✅ DONE

**File**: `src/components/AvatarSelector.tsx`

**Functionality**:

```typescript
interface AvatarSelectorProps {
  currentAvatar: string;
  onSelect: (avatarUrl: string) => void;
}

// Component that:
// - Shows grid of 10-12 random avatar options
// - Highlights currently selected avatar
// - Has "Randomize" button to generate new options
// - On selection, updates user profile
```

**Avatar API Service**:

```typescript
// Option 1: DiceBear Avatars (free, no auth needed)
// https://api.dicebear.com/8.x/avataaars/svg?seed={seed}

// Option 2: UI Avatars
// https://ui-avatars.com/api/?name={name}&background=0D8ABC

// Option 3: Gravatar (requires email hash)

// Recommended: DiceBear with random seeds
```

**Expected Result**:

- ✅ Users can choose from random avatars
- ✅ Avatar persists on profile
- ✅ Used in all UI elements (header, cards, etc.)

---

### Step 3.5: Add Auth State to Header

**Status**: ✅ DONE

**File**: `src/components/Header.tsx` (modify existing)

**Changes**:

```
Before:
Header with logo + "Add Recipe" button

After:
Header with:
├─ Logo (left)
├─ Add Recipe button (center, only for chefs)
└─ Auth Section (right)
   ├─ If logged out: Login | Register buttons
   └─ If logged in:
      ├─ User avatar (clickable → profile)
      ├─ Favorites icon with count (users)
      ├─ Dropdown menu:
         ├─ Profile
         ├─ Settings
         ├─ [Chef Dashboard] (chefs only)
         └─ Logout
```

**Expected Result**:

- ✅ Auth state reflected in header
- ✅ Easy access to profile/logout
- ✅ Chef features hidden from users

---

### Step 3.6: Create Favorite Feature

**Status**: ✅ DONE

**Files**:

- `src/lib/favorites.ts` - API calls
- `src/hooks/useFavorites.ts` - Custom hook
- Update `src/components/RecipeCard.tsx` - Add heart icon (NEXT)
- Update `src/components/RecipeDetail.tsx` - Add heart icon (NEXT)

**Functionality**:

```typescript
// useFavorites hook:
const { favorites, isFavorite, toggleFavorite } = useFavorites();

// API calls:
POST /api/favorites { recipeId }
DELETE /api/favorites/{id}
GET /api/favorites?populate=recipe
```

**UI Changes**:

- **RecipeCard**: Add heart icon (filled if favorited, outline if not)
- **RecipeDetail**: Add heart icon in hero section
- **Heart icon**: On click → toggle favorite (if authenticated)
- **Non-authenticated**: Show toast "Please login to favorite recipes"

**Heart Icon Styling**:

```
Outline heart (not favorited): lucide-react Heart
Filled heart (favorited): lucide-react Heart (className="fill-red-500")
Color: Turquoise on hover, Red when favorited
```

**Expected Result**:

- ✅ Users can favorite recipes
- ✅ Favorites persist
- ✅ Visual feedback (filled heart)
- ✅ Count updates in header

---

## 👨‍🍳 Phase 4: Chef Content Management UI

### Step 4.1: Create Chef Dashboard

**Status**: 🔄 In Progress

**File**: `src/pages/ChefDashboard.tsx`

**Layout**:

```
┌─ Header: "Recipe Management"
├─ Action Bar
│  ├─ + Add New Recipe button
│  ├─ Search recipes input
│  └─ Filter dropdowns (category, difficulty, date)
├─ Recipes Table/Grid
│  ├─ Recipe image (thumbnail)
│  ├─ Title
│  ├─ Category
│  ├─ Difficulty
│  ├─ Last modified date
│  ├─ Published status (badge)
│  └─ Actions (Edit, Delete, View)
└─ Pagination (if many recipes)
```

**Features**:

- [ ] Table view of all recipes created by this chef
- [ ] Search recipes by title
- [ ] Filter by category
- [ ] Filter by difficulty
- [ ] Sort by date, title, difficulty
- [ ] Edit recipe (opens edit form)
- [ ] Delete recipe (with confirmation)
- [ ] View published recipe
- [ ] Publish/unpublish toggle
- [ ] Bulk delete (checkbox selection)

**Expected Result**:

- ✅ Chefs can see all their recipes
- ✅ Easy to manage content
- ✅ Better UX than Strapi admin

---

### Step 4.2: Create Recipe Editor Form

**Status**: ❌ Not started

**File**: `src/pages/RecipeEditor.tsx`

**Modes**:

- **Create**: New recipe form
- **Edit**: Edit existing recipe

**Form Sections**:

```
1. Basic Info
   ├─ Title (required)
   ├─ Slug (auto-generated from title)
   └─ Description (required, max 500 chars)

2. Media
   ├─ Cover image (upload or URL)
   └─ Gallery images (multi-upload)

3. Recipe Details
   ├─ Prep time (minutes)
   ├─ Cook time (minutes)
   ├─ Servings
   ├─ Difficulty (Easy/Medium/Hard)
   └─ Categories (multi-select)

4. Ingredients
   ├─ Add ingredient button
   ├─ For each ingredient:
   │  ├─ Item name
   │  ├─ Quantity
   │  ├─ Unit
   │  ├─ Notes (optional)
   │  └─ Remove button

5. Instructions
   ├─ Add instruction button
   ├─ For each instruction:
   │  ├─ Step number (auto)
   │  ├─ Description
   │  ├─ Optional image
   │  ├─ Tips (optional)
   │  └─ Remove button

6. Tags
   ├─ Tag input (comma-separated)
   └─ Suggested tags below

7. Actions
   ├─ Save as Draft button
   ├─ Publish button
   └─ Cancel button
```

**Form Validation**:

- [ ] Title: required, min 3 chars, max 200 chars
- [ ] Description: required, max 500 chars
- [ ] Prep/chef time: required, min 0
- [ ] Servings: required, min 1
- [ ] At least 1 ingredient required
- [ ] At least 1 instruction required
- [ ] Cover image required

**Smart Features**:

- [ ] Auto-calculate total time (prep + chef)
- [ ] Auto-generate slug from title
- [ ] Image drag-and-drop upload
- [ ] Ingredient quantity validation (numbers)
- [ ] Save progress indicator (unsaved changes warning)
- [ ] Auto-save draft every 30 seconds

**Expected Result**:

- ✅ Chefs can create recipes easily
- ✅ All Strapi fields editable
- ✅ Validation prevents bad data
- ✅ Better UX than Strapi admin

---

### Step 4.3: Create Recipe Preview Component

**Status**: ❌ Not started

**File**: `src/components/RecipePreview.tsx`

**Purpose**: Show how recipe will look before publishing

**Features**:

- [ ] Side-by-side editor and preview
- [ ] Real-time preview updates as user types
- [ ] Responsive preview (desktop/tablet/mobile toggle)
- [ ] Shows all content: images, ingredients, instructions
- [ ] Print preview option

**Expected Result**:

- ✅ Chefs can see final result
- ✅ Catch issues before publishing
- ✅ Professional workflow

---

### Step 4.4: Create Category Management (Optional)

**Status**: ❌ Not started

**File**: `src/pages/CategoryManagement.tsx`

**Features** (if chef can manage categories):

- [ ] List all categories
- [ ] Add new category
- [ ] Edit category name
- [ ] Delete category
- [ ] Assign color to category

**If not allowing chef to manage**: Remove this step, categories only managed by admin

**Expected Result**:

- ✅ Categories manageable via UI (or admin-only)

---

### Step 4.5: Add Chef Features to Header

**Status**: ❌ Not started

**File**: `src/components/Header.tsx` (modify)

**Changes for Chef Users**:

```
Header (chef view):
├─ Logo (left)
├─ + Add New Recipe button (prominent, center-left)
├─ Dashboard link (center)
└─ Auth Section (right)
   ├─ Avatar
   └─ Dropdown:
      ├─ Dashboard
      ├─ My Recipes
      ├─ Profile
      └─ Logout
```

**Expected Result**:

- ✅ Chef-specific features visible
- ✅ Easy access to content management

---

## 🔧 Phase 5: Technical Implementation Details

### Step 5.1: JWT Token Management

**Status**: ✅ DONE

**File**: `src/lib/auth.ts`

**Implementation**:

The app uses a `tokenManager` object to handle JWT tokens:

```typescript
export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem("jwt");
  },

  setToken: (token: string): void => {
    localStorage.setItem("jwt", token);
  },

  removeToken: (): void => {
    localStorage.removeItem("jwt");
  },

  hasToken: (): boolean => {
    return !!localStorage.getItem("jwt");
  },
};
```

**Token Flow**:

1. **On Registration/Login**:

   - Strapi returns `{ jwt, user }`
   - Frontend stores JWT: `tokenManager.setToken(jwt)`
   - User data stored in React Context

2. **On App Load** (AuthContext initialization):

   - Check if token exists: `tokenManager.hasToken()`
   - If yes, verify token: `authAPI.me()`
   - If 401, remove token and logout
   - If 200, load user data into context

3. **On Logout**:

   - Clear token: `tokenManager.removeToken()`
   - Clear user from context

4. **On Protected API Calls**:
   - Get token: `tokenManager.getToken()`
   - Add to headers: `Authorization: Bearer ${token}`
   - If 401 response, auto-logout and redirect to login

**Expected Result**:

- ✅ Tokens persisted across browser sessions
- ✅ Tokens sent with every authenticated request
- ✅ Auto-logout on token expiration
- ✅ Centralized token management

---

### Step 5.2: Protected API Calls

**Status**: ✅ DONE

**File**: `src/lib/auth.ts`

**Implementation**:

The app uses `authenticatedFetch` helper for all protected API calls:

```typescript
export const authenticatedFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  if (!STRAPI_URL) {
    throw new Error("VITE_STRAPI_URL is not configured");
  }

  const token = tokenManager.getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${STRAPI_URL.replace(/\/$/, "")}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 - token expired
  if (response.status === 401) {
    tokenManager.removeToken();
    window.location.href = "/login";
  }

  return response;
};
```

**Usage Examples**:

```typescript
// Favorites API (src/lib/favorites.ts)
export const getFavorites = async (): Promise<number[]> => {
  const response = await authenticatedFetch("/api/favorites");
  // ... handle response
};

export const addFavorite = async (recipeId: number): Promise<boolean> => {
  const response = await authenticatedFetch("/api/favorites", {
    method: "POST",
    body: JSON.stringify({ recipe: recipeId }),
  });
  // ... handle response
};

// Profile update (src/lib/auth.ts)
export const updateProfile = async (userId: number, data: Partial<User>) => {
  const response = await authenticatedFetch(`/api/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  // ... handle response
};
```

**Error Handling**:

- ✅ 401 → Auto-logout + redirect to /login
- ✅ Network errors → Caught and displayed as toast
- ✅ 403/404 → Specific error messages
- ✅ All errors logged to console for debugging

**Expected Result**:

- ✅ All API calls include JWT automatically
- ✅ 401 errors handled gracefully with redirect
- ✅ Consistent error handling across app
- ✅ No duplicate token logic in different files

---

### Step 5.3: Avatar URL Generation Service

**Status**: ✅ DONE (Using DiceBear API directly)

**Implementation**: Inline in components

**DiceBear Avatars API** (used throughout the app):

```typescript
// Generate avatar URL from username seed
const avatarUrl = `https://api.dicebear.com/8.x/avataaars/svg?seed=${username}`;

// Used in:
// - AvatarSelector.tsx (generates 12 random options)
// - Register.tsx (default avatar on registration)
// - Header.tsx (display user avatar)
// - UserProfile.tsx (display and change avatar)
```

**AvatarSelector Component** (`src/components/AvatarSelector.tsx`):

- Generates 12 random avatar options using random seeds
- Highlights currently selected avatar
- "Randomize" button generates new set of 12 avatars
- On selection, calls `onSelect(avatarUrl)` callback
- Parent component (UserProfile) handles profile update

**Avatar Generation Logic**:

```typescript
// Generate array of 12 random avatar URLs
const generateAvatars = () => {
  return Array.from({ length: 12 }, () => {
    const randomSeed = Math.random().toString(36).substring(2, 15);
    return `https://api.dicebear.com/8.x/avataaars/svg?seed=${randomSeed}`;
  });
};
```

**Benefits**:

- ✅ No authentication required
- ✅ Infinite unique avatars
- ✅ SVG format (scalable, small file size)
- ✅ Consistent style across all user avatars
- ✅ No server-side storage needed

**Expected Result**:

- ✅ Random avatars generated on demand
- ✅ Consistent avatar URLs based on seed
- ✅ Avatar persists on user profile
- ✅ Used in all UI elements (header, profile, cards)

---

## 📊 Phase 6: Database Schema Summary

### Complete Strapi Content Types & Fields

This section summarizes the complete database schema after implementing all authentication features, aligned with the existing Recipe/Category schema from [StrapiConfigurationGuide.md](./StrapiConfigurationGuide.md).

---

#### 1. User Collection (Extended)

**API Endpoint**: `/api/users`

**Database Table**: `up_users`

**Fields**:

| Field Name           | Type         | Required | Default | Notes               |
| -------------------- | ------------ | -------- | ------- | ------------------- |
| id                   | Integer      | ✅       | Auto    | Primary key         |
| username             | String       | ✅       | -       | Unique              |
| email                | String       | ✅       | -       | Unique              |
| password             | String       | ✅       | -       | Hashed              |
| role                 | Enum         | ✅       | `user`  | `user` or `chef`    |
| avatar               | String (URL) | ❌       | `null`  | DiceBear URL        |
| newsletterSubscribed | Boolean      | ❌       | `false` | Subscription status |
| bio                  | Text (Long)  | ❌       | `null`  | User biography      |
| createdAt            | DateTime     | ✅       | Auto    | Auto-generated      |
| updatedAt            | DateTime     | ✅       | Auto    | Auto-generated      |
| blocked              | Boolean      | ✅       | `false` | Strapi default      |
| confirmed            | Boolean      | ✅       | `true`  | Strapi default      |

**Relations**:

- `recipes` - One-to-Many with Recipe (as author)
- `favorites` - One-to-Many with Favorite

---

#### 2. Favorite Collection (New)

**API Endpoint**: `/api/favorites`

**Database Table**: `favorites`

**Purpose**: Junction table for User-Recipe many-to-many relationship

**Fields**:

| Field Name | Type     | Required | Default | Notes                   |
| ---------- | -------- | -------- | ------- | ----------------------- |
| id         | Integer  | ✅       | Auto    | Primary key             |
| user       | Relation | ✅       | -       | Many-to-One with User   |
| recipe     | Relation | ✅       | -       | Many-to-One with Recipe |
| createdAt  | DateTime | ✅       | Auto    | When favorited          |
| updatedAt  | DateTime | ✅       | Auto    | Auto-generated          |

**Relations**:

- `user` (FK: `user_id`) → User
- `recipe` (FK: `recipe_id`) → Recipe

**Unique Constraint**: (`user_id`, `recipe_id`) - User can favorite recipe only once

---

#### 3. Recipe Collection (Extended)

**API Endpoint**: `/api/recipes`

**Database Table**: `recipes`

**Existing Fields** (from StrapiConfigurationGuide.md):

| Field Name    | Type             | Required | Notes                           |
| ------------- | ---------------- | -------- | ------------------------------- |
| id            | Integer          | ✅       | Primary key                     |
| title         | String           | ✅       | Recipe name                     |
| slug          | UID              | ✅       | URL-friendly, based on title    |
| description   | Text (Long)      | ✅       | Max 500 chars                   |
| coverImage    | Media (Single)   | ✅       | Main recipe image               |
| galleryImages | Media (Multiple) | ❌       | Process photos                  |
| ingredients   | Component        | ✅       | recipe.ingredient (repeatable)  |
| instructions  | Component        | ✅       | recipe.instruction (repeatable) |
| prepTime      | Integer          | ✅       | Minutes                         |
| cookTime      | Integer          | ✅       | Minutes                         |
| servings      | Integer          | ✅       | Number of servings              |
| difficulty    | Enum             | ✅       | Easy, Medium, Hard              |
| categories    | Relation         | ❌       | Many-to-Many with Category      |
| tags          | JSON             | ❌       | Array of strings                |
| createdAt     | DateTime         | ✅       | Auto-generated                  |
| updatedAt     | DateTime         | ✅       | Auto-generated                  |

**New Fields** (for authentication):

| Field Name | Type     | Required | Notes                         |
| ---------- | -------- | -------- | ----------------------------- |
| author     | Relation | ❌       | Many-to-One with User (chef)  |
| published  | Boolean  | ❌       | Default: `true`, draft status |

**Relations**:

- `author` (FK: `author_id`) → User
- `categories` (Many-to-Many) → Category
- `favorites` (One-to-Many) → Favorite

---

#### 4. Category Collection (Existing)

**API Endpoint**: `/api/categories`

**Database Table**: `categories`

**Fields** (from StrapiConfigurationGuide.md):

| Field Name | Type     | Required | Notes          |
| ---------- | -------- | -------- | -------------- |
| id         | Integer  | ✅       | Primary key    |
| name       | String   | ✅       | Category name  |
| slug       | UID      | ✅       | URL-friendly   |
| createdAt  | DateTime | ✅       | Auto-generated |
| updatedAt  | DateTime | ✅       | Auto-generated |

**Relations**:

- `recipes` (Many-to-Many) → Recipe

---

#### 5. Components

##### recipe.ingredient (Existing)

**Fields** (from StrapiConfigurationGuide.md):

| Field Name | Type   | Required | Notes                     |
| ---------- | ------ | -------- | ------------------------- |
| item       | String | ✅       | Ingredient name           |
| quantity   | String | ✅       | Amount (e.g., "2", "1/2") |
| unit       | String | ❌       | cups, grams, etc.         |
| notes      | String | ❌       | e.g., "chopped"           |

##### recipe.instruction (Existing)

**Fields** (from StrapiConfigurationGuide.md):

| Field Name  | Type           | Required | Notes               |
| ----------- | -------------- | -------- | ------------------- |
| stepNumber  | Integer        | ✅       | Step order          |
| description | Text (Long)    | ✅       | Step details        |
| image       | Media (Single) | ❌       | Optional step image |
| tips        | String         | ❌       | Cooking tips        |

---

### Database Relationships Diagram

```
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│   User       │          │   Favorite   │          │   Recipe     │
│──────────────│          │──────────────│          │──────────────│
│ id (PK)      │◄─────────│ user_id (FK) │          │ id (PK)      │
│ username     │          │ recipe_id(FK)│─────────►│ title        │
│ email        │          │              │          │ slug         │
│ role         │          └──────────────┘          │ description  │
│ avatar       │                                    │ coverImage   │
│ bio          │                                    │ ingredients  │
└──────────────┘                                    │ instructions │
      │                                             │ prepTime     │
      │ author_id (FK)                              │ cookTime     │
      └────────────────────────────────────────────►│ author_id(FK)│
                                                    │ published    │
                                                    └──────────────┘
                                                           │
                                                           │
                         ┌──────────────┐                 │
                         │  Category    │                 │
                         │──────────────│                 │
                         │ id (PK)      │◄────────────────┘
                         │ name         │    (Many-to-Many)
                         │ slug         │
                         └──────────────┘
```

---

### API Permissions Matrix

| Endpoint                      | Public | Authenticated | Chef     |
| ----------------------------- | ------ | ------------- | -------- |
| **Auth**                      |
| POST /api/auth/local/register | ✅     | ✅            | ✅       |
| POST /api/auth/local          | ✅     | ✅            | ✅       |
| **Users**                     |
| GET /api/users/me             | ❌     | ✅            | ✅       |
| PUT /api/users/:id            | ❌     | ✅ (own)      | ✅ (own) |
| **Recipes**                   |
| GET /api/recipes              | ✅     | ✅            | ✅       |
| GET /api/recipes/:id          | ✅     | ✅            | ✅       |
| POST /api/recipes             | ❌     | ❌            | ✅       |
| PUT /api/recipes/:id          | ❌     | ❌            | ✅ (all) |
| DELETE /api/recipes/:id       | ❌     | ❌            | ✅ (all) |
| **Categories**                |
| GET /api/categories           | ✅     | ✅            | ✅       |
| GET /api/categories/:id       | ✅     | ✅            | ✅       |
| **Favorites**                 |
| GET /api/favorites            | ❌     | ✅ (own)      | ✅ (own) |
| POST /api/favorites           | ❌     | ✅            | ✅       |
| DELETE /api/favorites/:id     | ❌     | ✅ (own)      | ✅ (own) |

---

### SQL Migration Notes (PostgreSQL)

When migrating from SQLite to PostgreSQL for production:

```sql
-- 1. User table already exists (up_users)
-- Add custom columns:
ALTER TABLE up_users
  ADD COLUMN role VARCHAR(10) DEFAULT 'user',
  ADD COLUMN avatar TEXT,
  ADD COLUMN newsletter_subscribed BOOLEAN DEFAULT false,
  ADD COLUMN bio TEXT;

-- 2. Create Favorites table
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES up_users(id) ON DELETE CASCADE,
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- 3. Add author to recipes
ALTER TABLE recipes
  ADD COLUMN author_id INTEGER REFERENCES up_users(id) ON DELETE SET NULL,
  ADD COLUMN published BOOLEAN DEFAULT true;

-- 4. Create indexes for performance
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_recipe ON favorites(recipe_id);
CREATE INDEX idx_recipes_author ON recipes(author_id);
CREATE INDEX idx_users_role ON up_users(role);
```

See [PostgresqlMigrationGuide.md](./PostgresqlMigrationGuide.md) for complete migration instructions.

---

## 📋 Implementation Checklist

### Phase 1: Backend (Strapi)

- [ ] Extend User collection with role, avatar, newsletter fields
- [ ] Create Favorites collection type
- [ ] Update Recipe to have author field
- [ ] Configure API permissions for roles
- [ ] Test auth endpoints with Postman/Insomnia
- [ ] Generate new JWT secret for production

### Phase 2: Frontend Auth Infrastructure

- [ ] Create AuthContext.tsx
- [ ] Create useAuth hook
- [ ] Create ProtectedRoute component
- [ ] Create auth API client (src/lib/auth.ts)
- [ ] Setup localStorage JWT management
- [ ] Test context with sample login

### Phase 3: User Features

- [ ] Create Login page
- [ ] Create Register page
- [ ] Update Header with auth state
- [ ] Create User Profile page
- [ ] Create AvatarSelector component
- [ ] Implement favorites feature
- [ ] Add heart icons to recipes
- [ ] Test user registration and login flow

### Phase 4: Chef Features

- [ ] Create Chef Dashboard page
- [ ] Create Recipe Editor form
- [ ] Create Recipe Preview component
- [ ] Add chef-specific header features
- [ ] Test recipe creation/editing/deletion
- [ ] Test chef-only access control

### Phase 5: Polish & Testing

- [ ] Error handling and toast notifications
- [ ] Loading states on all forms
- [ ] Form validation and feedback
- [ ] Test logout functionality
- [ ] Test token expiration
- [ ] Test role-based access (try accessing chef features as user)
- [ ] Responsive design on all pages
- [ ] Cross-browser testing

### Phase 6: Deployment

- [ ] Update Strapi permissions in production
- [ ] Update environment variables
- [ ] Test full auth flow in production
- [ ] Verify JWT tokens work
- [ ] Monitor error logs

---

## 🎨 UI Component Map

### New Components to Create

```
src/
├── contexts/
│   └── AuthContext.tsx (provider + context)
├── hooks/
│   ├── useAuth.ts
│   └── useFavorites.ts
├── components/
│   ├── ProtectedRoute.tsx
│   ├── AvatarSelector.tsx
│   ├── RecipePreview.tsx
│   └── (modify existing: Header.tsx, RecipeCard.tsx, RecipeDetail.tsx)
├── pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── UserProfile.tsx
│   ├── ChefDashboard.tsx
│   └── RecipeEditor.tsx
└── lib/
    ├── auth.ts (new)
    ├── avatars.ts (new)
    └── favorites.ts (new)
```

---

## 🚀 Success Criteria

✅ **User Experience**:

- Users can register with email/username/password
- Users can login securely with JWT
- Users see their profile with avatar
- Users can favorite recipes
- Users can subscribe to newsletter
- Users can see their favorite recipes
- Logout works properly

✅ **Chef Experience**:

- Chefs can access dashboard
- Chefs can create recipes (full form)
- Chefs can edit recipes
- Chefs can delete recipes
- Chefs see only their recipes in dashboard
- Chef features hidden from regular users
- No need to access Strapi admin

✅ **Security**:

- JWT tokens stored securely
- Protected routes working
- Role-based access enforced
- Tokens expire and logout
- API respects permissions

✅ **Design**:

- Consistent with turquoise/green theme
- Mobile responsive
- Accessible forms
- Clear error messages
- Professional UI

---

## 📚 Implementation Order

**Recommended sequence**:

1. **Week 1**: Strapi backend setup + Auth context
2. **Week 2**: Login/Register pages + JWT management
3. **Week 3**: User profile + favorites feature
4. **Week 4**: Chef dashboard + recipe editor
5. **Week 5**: Polish, testing, deployment

---

## 🔗 Related Documentation

- Strapi Plugins: https://docs.strapi.io/user-docs/plugins
- Strapi Users Permissions: https://docs.strapi.io/user-docs/users-roles-permissions
- JWT Authentication: https://docs.strapi.io/dev-docs/plugins/users-permissions
- React Context: https://react.dev/reference/react/useContext
- Protected Routes: https://reactrouter.com/examples/auth

---

**Ready to implement? Start with Phase 1 (Strapi backend setup) or Phase 2 (React auth context).**
