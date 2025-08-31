import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { formatCentsToBRL } from "@/helpers/money";

interface CartSummaryProps {
  subtotalInCents: number;
  totalInCents: number;
  products: Array<{
    id: string;
    name: string;
    variantName: string;
    quantity: number;
    priceInCents: number;
    imageUrl: string;
  }>;
}

const CartSummary = ({ subtotalInCents, totalInCents, products }: CartSummaryProps) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <p className="text-sm">Subtotal</p>
        <p className="text-sm text-muted-foreground font-medium">
          {formatCentsToBRL(subtotalInCents)}
        </p>
      </div>
      <div className="flex justify-between">
        <p className="text-sm">Frete</p>
        <p className="text-sm text-muted-foreground font-medium">GRÁTIS</p>
      </div>
      <div className="flex justify-between">
        <p className="text-sm">Total</p>
        <p className="text-sm font-bold">
          {formatCentsToBRL(totalInCents)}
        </p>
      </div>

      <div className="py-3">
        <Separator />
      </div>
      
      {products.map((product) => (
        <div key={product.id} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={product.imageUrl}
              alt={product.variantName}
              width={78}
              height={78}
              className="rounded-lg"
            />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold">{product.name}</p>
              <p className="text-xs font-medium text-muted-foreground">
                {product.variantName} x {product.quantity}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between items-end gap-4">
            <p className="text-sm font-bold">
              {formatCentsToBRL(product.priceInCents)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
 
export default CartSummary;
