import z from "zod";

export const decreaseProductQuantityFromCartSchema = z.object({
  cartItemId: z.uuid(),
});

export type DecreaseProductQuantityFromCartSchema = z.infer<typeof decreaseProductQuantityFromCartSchema>;
