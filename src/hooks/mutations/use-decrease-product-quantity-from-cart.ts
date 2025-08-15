import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { decreaseProductQuantityFromCart } from "@/actions/decrease-product-quantity-from-cart";
import { getUseCartQueryKey } from "@/hooks/queries/use-cart";

export const getUseDecreaseProductQuantityFromCartMutationKey = (cartItemId: string) => [
  "decrease-product-quantity-from-cart",
  cartItemId,
] as const;

export const useDecreaseProductQuantityFromCart = (cartItemId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getUseDecreaseProductQuantityFromCartMutationKey(cartItemId),
    mutationFn: () => decreaseProductQuantityFromCart({ cartItemId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
      toast.success("Quantidade do produto no carrinho diminuída.");
    },
    onError: () => {
      toast.error("Erro ao diminuir a quantidade do produto no carrinho.");
    },
  });
}
