"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { UpdateCartShippingAddressSchema, updateCartShippingAddressSchema } from "@/actions/update-cart-shipping-address/schema";
import { db } from "@/db";
import { cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const updateCartShippingAddress = async (data: UpdateCartShippingAddressSchema) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  updateCartShippingAddressSchema.parse(data);

  const shippingAddress = await db.query.shippingAddressTable.findFirst({
    where: (shippingAddress, { and, eq }) => and(
      eq(shippingAddress.id, data.shippingAddressId),
      eq(shippingAddress.userId, session.user.id),
    ),
  });

  if (!shippingAddress) {
    throw new Error("Endereço para envio não encontrado");
  }

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
  });

  if (!cart) {
    throw new Error("Carrinho não encontrado");
  }

  await db.update(cartTable).set({
    shippingAddressId: data.shippingAddressId,
  }).where(eq(cartTable.id, cart.id));

  return { success: true, message: "Endereço para envio associado com sucesso!" };
}
