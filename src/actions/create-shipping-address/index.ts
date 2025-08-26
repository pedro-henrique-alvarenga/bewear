"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { CreateShippingAddressSchema, createShippingAddressSchema } from "@/actions/create-shipping-address/schema";
import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const createShippingAddress = async (data: CreateShippingAddressSchema) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  createShippingAddressSchema.parse(data);

  const [shippingAddress] = await db.insert(shippingAddressTable).values({
    userId: session.user.id,
    email: data.email,
    recipientName: data.recipientName,
    cpfOrCnpj: data.cpfOrCnpj.replace(/\D/g, ''),
    phone: data.phone.replace(/\D/g, ''),
    zipCode: data.zipCode.replace(/\D/g, ''),
    street: data.street,
    number: data.number,
    complement: data.complement || null,
    neighborhood: data.neighborhood,
    city: data.city,
    state: data.state,
    country: data.country,
  }).returning();

  revalidatePath("/cart/identification");

  return shippingAddress;
}
