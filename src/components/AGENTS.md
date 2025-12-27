# UI Components

## Identity
Reusable React components using Tailwind CSS for styling.

## Patterns & Conventions

### Component Structure
- **Functional**: Always use functional components.
- **Props**: Define interface `Props` or specific type.
- **Client vs Server**: Default to Server Components. Add `'use client'` only when needing hooks (useState, useEffect) or interactivity.

### Styling (Tailwind v4)
- **Classes**: Use `className` prop with `clsx` or `tailwind-merge` (via `cn` utility) for dynamic classes.
- **Mobile-First**: Base styles are mobile, use `md:`, `lg:` for larger screens.
- **Example**:
  ```tsx
  // src/components/ui/Button.tsx
  import { cn } from "@/lib/utils";
  
  export function Button({ className, ...props }: ButtonProps) {
    return <button className={cn("px-4 py-2 rounded bg-blue-500", className)} {...props} />;
  }
  ```

## Key Locations
- **Dashboard UI**: `src/components/dashboard/**`
- **Landing Page**: `src/components/landing/**`
- **Global Styles**: `src/app/globals.css`

## JIT Index Hints
- Find client components: `rg "use client" src/components`
- Find dashboard components: `ls src/components/dashboard`
