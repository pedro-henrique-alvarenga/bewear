"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import AddToCartButton from "@/app/product-variant/[slug]/components/add-to-cart-button";
import { Button } from "@/components/ui/button";

interface ProductActionsProps {
  productVariantId: string;
}

const ProductActions = ({ productVariantId }: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);
  
  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  }

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  }
  
  return (
    <>
      <div className="px-5">
        <div className="space-y-4">
          <h3 className="font-medium">Quantidade</h3>
          <div className="flex items-center justify-between border rounded-lg w-[100px]">
            <Button size="icon" variant="ghost" className="cursor-pointer" onClick={handleDecrement}>
              <MinusIcon />
            </Button>
            <p>{quantity}</p>
            <Button size="icon" variant="ghost" className="cursor-pointer" onClick={handleIncrement}>
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-4 flex flex-col">
        <AddToCartButton productVariantId={productVariantId} quantity={quantity} />
        <Button className="rounded-full cursor-pointer" size="lg">
          Comprar agora
        </Button>
      </div>
    </>
  );
}
 
export default ProductActions;
