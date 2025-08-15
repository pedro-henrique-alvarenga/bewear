import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { decreaseProductQuantityFromCart } from "@/actions/decrease-product-quantity-from-cart";
import { removeProductFromCart } from "@/actions/remove-product-from-cart";
import { Button } from "@/components/ui/button";
import { formatCentsToBRL } from "@/helpers/money";

interface CartItemProps {
  id: string;
  productName: string;
  productVariantName: string;
  productVariantImageUrl: string;
  productVariantPriceInCents: number;
  quantity: number;
}

const CartItem = ({
  id,
  productName,
  productVariantName,
  productVariantImageUrl,
  productVariantPriceInCents,
  quantity
}: CartItemProps) => {
  const queryClient = useQueryClient();

  const { mutate: removeProductFromCartMutate, isPending: removeProductFromCartIsPending } = useMutation({
    mutationKey: ["removeProductFromCart", id],
    mutationFn: () => removeProductFromCart({ cartItemId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Produto removido do carrinho.");
    },
    onError: () => {
      toast.error("Erro ao remover produto do carrinho.");
    },
  });

  const { mutate: decreaseProductQuantityFromCartMutate, isPending: decreaseProductQuantityFromCartIsPending } = useMutation({
    mutationKey: ["decreaseProductQuantityFromCart", id],
    mutationFn: () => decreaseProductQuantityFromCart({ cartItemId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Quantidade do produto no carrinho diminuída.");
    },
    onError: () => {
      toast.error("Erro ao diminuir a quantidade do produto no carrinho.");
    },
  });

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
          <div className="flex items-center justify-between border rounded-lg w-[100px]">
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
            <Button variant="ghost" className="h-8 w-8 cursor-pointer" onClick={() => {}}>
              <PlusIcon />
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
