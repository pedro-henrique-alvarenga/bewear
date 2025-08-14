import Image from "next/image";
import Link from "next/link";

import { productVariantTable } from "@/db/schema";

interface ProductVariantProps {
  variants: (typeof productVariantTable.$inferSelect)[];
  selectedVariantSlug: string;
}

const VariantSelector = ({ variants, selectedVariantSlug }: ProductVariantProps) => {
  return (
    <div className="flex items-center gap-4">
      {variants.map((variant) => (
        <Link
          key={variant.id}
          href={`/product-variant/${variant.slug}`}
          className={`rounded-xl border-2 ${variant.slug === selectedVariantSlug ? "border-primary" : "border-transparent"}`}
        >
          <Image
            src={variant.imageUrl}
            alt={variant.name}
            width={68}
            height={68}
            className="rounded-xl"
          />
        </Link>
      ))}
    </div>
  );
}
 
export default VariantSelector;
