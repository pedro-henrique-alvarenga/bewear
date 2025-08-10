import Image from "next/image";

import Header from "@/components/shared/header";
import ProductList from "@/components/shared/product-list";
import { db } from "@/db";

const Home = async () => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });

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
          <Image
            src={"/banner-02.png"}
            alt="Seja autêntico"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto"
          />
        </div>
      </div>
    </>
  );
}

export default Home;
