import { useMutation, useQueryClient } from "@tanstack/react-query";

import { finishOrder } from "@/actions/finish-order";
import { getUseCartQueryKey } from "@/hooks/queries/use-cart";

export const getUseFinishOrderMutationKey = () => [
  "finish-order",
] as const;

export const useFinishOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getUseFinishOrderMutationKey(),
    mutationFn: finishOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
}
