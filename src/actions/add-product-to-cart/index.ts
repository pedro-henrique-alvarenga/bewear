"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { AddProductToCartSchema, addProductToCartSchema } from "@/actions/add-product-to-cart/schema";
import { db } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const addProductToCart = async (data: AddProductToCartSchema) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  addProductToCartSchema.parse(data);

  const productVariant = await db.query.productVariantTable.findFirst({
    where: (productVariant, { eq }) => eq(productVariant.id, data.productVariantId),
  });

  if (!productVariant) {
    throw new Error("Variante de produto não encontrada");
  }

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
  });

  let cartId = cart?.id;

  if (!cartId) {
    const [ newCart ] = await db.insert(cartTable).values({
      userId: session.user.id,
    }).returning();

    cartId = newCart.id;
  }

  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { and, eq }) => and(
      eq(cartItem.cartId, cartId),
      eq(cartItem.productVariantId, data.productVariantId),
    ),
  });

  if (cartItem) {
    await db.update(cartItemTable).set({
      quantity: cartItem.quantity + data.quantity,
    }).where(eq(cartItemTable.id, cartItem.id));
  } else {
    await db.insert(cartItemTable).values({
      cartId,
      productVariantId: data.productVariantId,
      quantity: data.quantity,
    });
  }

  return { success: true, message: "Produto adicionado ao carrinho com sucesso!" };
};
