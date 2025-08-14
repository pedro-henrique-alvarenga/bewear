import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

import VariantSelector from "@/app/product-variant/[slug]/components/variant-selector";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import ProductList from "@/components/shared/product-list";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";

import QuantitySelector from "./components/quantity-selector";

interface ProductVariantPageProps {
  params: Promise<{slug: string}>;
}

const ProductVariantPage = async ({ params }: ProductVariantPageProps) => {
  const { slug } = await params;
  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.slug, slug),
    with: {
      product: {
        with: {
          variants: true,
        },
      },
    },
  });

  if (!productVariant) {
    return notFound();
  }

  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, productVariant.product.categoryId),
    with: {
      variants: true,
    },
  });
  
  return (
    <>
      <Header />
      <div className="flex flex-col space-y-6">
        <Image
          src={productVariant.imageUrl}
          alt={productVariant.name}
          sizes="100vw"
          width={0}
          height={0}
          className="h-auto w-full rounded-3xl object-cover"
        />

        <div className="px-5">
          <VariantSelector variants={productVariant.product.variants} selectedVariantSlug={productVariant.slug} />
        </div>

        <div className="px-5">
          <h2 className="text-lg font-semibold">{productVariant.product.name}</h2>
          <h3 className="text-sm text-muted-foreground">{productVariant.name}</h3>
          <h3 className="text-lg font-semibold">{formatCentsToBRL(productVariant.priceInCents)}</h3>
        </div>

        <div className="px-5">
          <QuantitySelector />
        </div>

        <div className="px-5 space-y-4 flex flex-col">
          <Button className="rounded-full cursor-pointer" size="lg" variant="outline">
            Adicionar ao carrinho
          </Button>
          <Button className="rounded-full cursor-pointer" size="lg">
            Comprar agora
          </Button>
        </div>

        <div className="px-5">
          <p className="text-sm">{productVariant.product.description}</p>
        </div>

        <ProductList title="Talvez você também goste" products={likelyProducts} />

        <Footer />
      </div>
    </>
  );
}
 
export default ProductVariantPage;
