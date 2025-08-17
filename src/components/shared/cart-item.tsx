import { Loader2, MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { formatCentsToBRL } from "@/helpers/money";
import { useDecreaseProductQuantityFromCart } from "@/hooks/mutations/use-decrease-product-quantity-from-cart";
import { useIncreaseProductQuantityFromCart } from "@/hooks/mutations/use-increase-product-quantity-from-cart";
import { useRemoveProductFromCart } from "@/hooks/mutations/use-remove-product-from-cart";

interface CartItemProps {
  id: string;
  productName: string;
  productVariantId: string;
  productVariantName: string;
  productVariantImageUrl: string;
  productVariantPriceInCents: number;
  quantity: number;
}

const CartItem = ({
  id,
  productName,
  productVariantId,
  productVariantName,
  productVariantImageUrl,
  productVariantPriceInCents,
  quantity
}: CartItemProps) => {
  const {
    mutate: removeProductFromCartMutate,
    isPending: removeProductFromCartIsPending
  } = useRemoveProductFromCart(id);
  const {
    mutate: decreaseProductQuantityFromCartMutate,
    isPending: decreaseProductQuantityFromCartIsPending
  } = useDecreaseProductQuantityFromCart(id);
  const {
    mutate: increaseProductQuantityFromCartMutate,
    isPending: increaseProductQuantityFromCartIsPending
  } = useIncreaseProductQuantityFromCart(productVariantId);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          src={productVariantImageUrl}
          alt={productVariantName}
          width={78}
          height={78}
          className="rounded-lg"
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{productName}</p>
          <p className="text-xs font-medium text-muted-foreground">{productVariantName}</p>
          <div className="flex items-center justify-between border rounded-lg w-[88px]">
            <Button
              variant="ghost"
              className="h-8 w-8 cursor-pointer"
              disabled={decreaseProductQuantityFromCartIsPending}
              onClick={() => decreaseProductQuantityFromCartMutate()}
            >
              {decreaseProductQuantityFromCartIsPending 
                ? <Loader2 className="animate-spin" />
                : <MinusIcon />
              }
            </Button>
            <p className="text-xs font-medium">{quantity}</p>
            <Button
              variant="ghost"
              className="h-8 w-8 cursor-pointer"
              disabled={increaseProductQuantityFromCartIsPending}
              onClick={() => increaseProductQuantityFromCartMutate()}
            >
              {increaseProductQuantityFromCartIsPending 
                ? <Loader2 className="animate-spin" />
                : <PlusIcon />
              }
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between items-end gap-4">
        <Button
          variant="outline"
          className="h-8 w-8 cursor-pointer"
          disabled={removeProductFromCartIsPending}
          onClick={() => removeProductFromCartMutate()}
        >
          {removeProductFromCartIsPending 
            ? <Loader2 className="animate-spin" />
            : <TrashIcon />
          }
        </Button>
        <p className="text-sm font-bold">
          {formatCentsToBRL(productVariantPriceInCents)}
        </p>
      </div>
    </div>
  );
}
 
export default CartItem;
