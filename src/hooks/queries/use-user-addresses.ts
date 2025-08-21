import { useQuery } from "@tanstack/react-query"

import { getUserAddresses } from "@/actions/get-user-addresses";

export const getUseUserAddressesQueryKey = () => ["user-addresses"] as const;

export const useUserAddresses = () => {
  return useQuery({
    queryKey: getUseUserAddressesQueryKey(),
    queryFn: () => getUserAddresses(),
  })
}
