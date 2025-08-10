import ProductItem from "@/components/shared/product-item";
import { productTable, productVariantTable } from "@/db/schema";

interface ProductListProps {
  title: string;
  products: (typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  })[];
};

const ProductList = ({title, products} : ProductListProps) => {
  
  return (
    <div className="space-y-6">
      <h3 className="px-5 font-semibold">{title}</h3>
      <div className="px-5 flex w-full overflow-x-auto gap-4 [&::-webkit-scrollbar]:hidden">
        {products.map((product) =>
          <ProductItem key={product.id} product={product} />
        )}
      </div>
    </div> 
  );
}
 
export default ProductList;
