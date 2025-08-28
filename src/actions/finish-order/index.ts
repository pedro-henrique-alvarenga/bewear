"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartTable, orderItemTable, orderTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const finishOrder = async () => {
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
        with: {
          productVariant: true,
        }
      },
    }
  });

  await db.transaction(async (tx) => {
    if (!cart) {
      throw new Error("Carrinho não encontrado");
    }

    if (!cart.shippingAddress) {
      throw new Error("Endereço para envio não encontrado");
    }

    const totalPriceInCents = cart.cartItems.reduce(
      (sum, item) => sum + item.productVariant.priceInCents * item.quantity,
      0,
    );
    
    const [order] = await tx.insert(orderTable).values({
      userId: session.user.id,
      shippingAddressId: cart.shippingAddress.id,
      recipientName: cart.shippingAddress.recipientName,
      street: cart.shippingAddress.street,
      number: cart.shippingAddress.number,
      complement: cart.shippingAddress.complement,
      city: cart.shippingAddress.city,
      state: cart.shippingAddress.state,
      neighborhood: cart.shippingAddress.neighborhood,
      zipCode: cart.shippingAddress.zipCode,
      country: cart.shippingAddress.country,
      phone: cart.shippingAddress.phone,
      email: cart.shippingAddress.email,
      cpfOrCnpj: cart.shippingAddress.cpfOrCnpj,
      totalPriceInCents: totalPriceInCents,
    }).returning();

    if (!order) {
      throw new Error("Erro ao criar o pedido");
    }

    const ordemItems: (typeof orderItemTable.$inferInsert)[] = cart.cartItems.map((item) => ({
      orderId: order.id,
      productVariantId: item.productVariant.id,
      quantity: item.quantity,
      name: item.productVariant.name,
      slug: item.productVariant.slug,
      color: item.productVariant.color,
      priceInCents: item.productVariant.priceInCents,
      imageUrl: item.productVariant.imageUrl,
    }));

    await tx.insert(orderItemTable).values(ordemItems);

    await tx.delete(cartTable).where(eq(cartTable.id, cart.id));
  });

  return { success: true, message: "Pedido criado com sucesso!" };
}
