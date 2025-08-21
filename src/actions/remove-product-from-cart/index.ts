"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { RemoveProductFromCartSchema, removeProductFromCartSchema } from "@/actions/remove-product-from-cart/schema";
import { db } from "@/db";
import { cartItemTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const removeProductFromCart = async (data: RemoveProductFromCartSchema) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  removeProductFromCartSchema.parse(data);

  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) => eq(cartItem.id, data.cartItemId),
    with: {
      cart: true,
    },
  });

  if (cartItem?.cart.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  if (!cartItem) {
    throw new Error("Item do carrinho não encontrado");
  }

  await db.delete(cartItemTable).where(eq(cartItemTable.id, cartItem.id));
  
  return { success: true, message: "Produto removido do carrinho com sucesso!" };
}
