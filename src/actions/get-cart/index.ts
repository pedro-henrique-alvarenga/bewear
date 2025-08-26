"use server";

import { asc } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const getCart = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      shippingAddress: true,
      cartItems: {
        orderBy: [asc(cartItemTable.createdAt)],
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    const [ newCart ] = await db.insert(cartTable).values({
      userId: session.user.id,
    }).returning();
    
    return {
      ...newCart,
      shippingAddress: null,
      cartItems: [],
      totalPriceInCents: 0,
    };
  }

  return {
    ...cart,
    totalPriceInCents: cart.cartItems.reduce((sum, item) =>
      sum + item.productVariant.priceInCents * item.quantity, 0,
    ),
  };
}
