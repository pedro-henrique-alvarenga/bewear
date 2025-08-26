import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCartShippingAddress } from "@/actions/update-cart-shipping-address";
import { getUseCartQueryKey } from "@/hooks/queries/use-cart";

export const getUseUpdateCartShippingAddressMutationKey = () => [
  "update-cart-shipping-address",
] as const;

export const useUpdateCartShippingAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getUseUpdateCartShippingAddressMutationKey(),
    mutationFn: updateCartShippingAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
}
