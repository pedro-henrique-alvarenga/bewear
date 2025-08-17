import { Loader2, MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

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
  const removeProductFromCartMutation = useRemoveProductFromCart(id);
  const decreaseProductQuantityFromCartMutation = useDecreaseProductQuantityFromCart(id);
  const increaseProductQuantityFromCartMutation = useIncreaseProductQuantityFromCart(productVariantId);

  const handleRemoveProductFromCart = async () => {
    try {
      await removeProductFromCartMutation.mutateAsync();
      toast.success("Produto removido do carrinho.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao remover produto do carrinho.");
    }
  }

  const handleDecreaseProductQuantityFromCart = async () => {
    try {
      await decreaseProductQuantityFromCartMutation.mutateAsync();
      toast.success("Quantidade do produto no carrinho diminuída.");

    } catch (error) {
      console.error(error);
      toast.error("Erro ao diminuir a quantidade do produto no carrinho.");
    }
  }

  const handleIncreaseProductQuantityFromCart = async () => {
    try {
      await increaseProductQuantityFromCartMutation.mutateAsync();
      toast.success("Quantidade do produto no carrinho aumentada.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao aumentar a quantidade do produto no carrinho.");
    }
  }

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
              disabled={decreaseProductQuantityFromCartMutation.isPending}
              onClick={() => handleDecreaseProductQuantityFromCart()}
            >
              {decreaseProductQuantityFromCartMutation.isPending 
                ? <Loader2 className="animate-spin" />
                : <MinusIcon />
              }
            </Button>
            <p className="text-xs font-medium">{quantity}</p>
            <Button
              variant="ghost"
              className="h-8 w-8 cursor-pointer"
              disabled={increaseProductQuantityFromCartMutation.isPending}
              onClick={() => handleIncreaseProductQuantityFromCart()}
            >
              {increaseProductQuantityFromCartMutation.isPending 
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
          disabled={removeProductFromCartMutation.isPending}
          onClick={() => handleRemoveProductFromCart()}
        >
          {removeProductFromCartMutation.isPending 
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
