import { desc } from "drizzle-orm";
import Image from "next/image";

import CategorySelector from "@/components/shared/category-selector";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import ProductList from "@/components/shared/product-list";
import { db } from "@/db";
import { productTable } from "@/db/schema";

const Home = async () => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });

  const newlyCreatedProduts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    limit: 10,
    with: {
      variants: true,
    },
  });
  
  const categories = await db.query.categoryTable.findMany();

  return (
    <>
      <Header />

      <div className="space-y-6">
        <div className="px-5">
          <Image
            src={"/banner-01.png"}
            alt="Leve uma vida com estilo"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto"
          />
        </div>

        <ProductList title="Produtos em destaque" products={products} />

        <div className="px-5">
          <CategorySelector categories={categories} />
        </div>

        <div className="px-5">
          <Image
            src={"/banner-02.png"}
            alt="Seja autêntico"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto"
          />
        </div>

        <ProductList title="Novidades" products={newlyCreatedProduts} />

        <Footer />
      </div>
    </>
  );
}

export default Home;
