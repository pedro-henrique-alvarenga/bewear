import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeProductFromCart } from "@/actions/remove-product-from-cart";
import { getUseCartQueryKey } from "@/hooks/queries/use-cart";

export const getUseRemoveProductFromCartMutationKey = (cartItemId: string) => [
  "remove-product-from-cart",
  cartItemId,
] as const;

export const useRemoveProductFromCart = (cartItemId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getUseRemoveProductFromCartMutationKey(cartItemId),
    mutationFn: () => removeProductFromCart({ cartItemId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
}
