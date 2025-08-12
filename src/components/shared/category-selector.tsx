import Link from "next/link";

import { Button } from "@/components/ui/button";
import { categoryTable } from "@/db/schema";

interface CategorySelectorProps {
  categories: (typeof categoryTable.$inferSelect)[];
};

const CategorySelector = ({ categories } : CategorySelectorProps) => {
  return (
    <div className="p-6 rounded-3xl bg-[#F4EFFF]">
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <Button
            asChild
            key={category.id}
            variant="ghost"
            className="rounded-full bg-white font-semibold text-xs cursor-pointer"
          >
            <Link href={`/category/${category.slug}`}>
              {category.name}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};
 
export default CategorySelector;
