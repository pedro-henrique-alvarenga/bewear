import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { addProductToCart } from "@/actions/add-product-to-cart";
import { getUseCartQueryKey } from "@/hooks/queries/use-cart";

export const getUseIncreaseProductQuantityFromCartMutationKey = (productVariantId: string) => [
  "increase-product-quantity-from-cart",
  productVariantId,
] as const;

export const useIncreaseProductQuantityFromCart = (productVariantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getUseIncreaseProductQuantityFromCartMutationKey(productVariantId),
    mutationFn: () => addProductToCart({ productVariantId: productVariantId, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
      toast.success("Quantidade do produto no carrinho aumentada.");
    },
    onError: () => {
      toast.error("Erro ao aumentar a quantidade do produto no carrinho.");
    },
  });
}
