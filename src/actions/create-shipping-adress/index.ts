"use server";

import { headers } from "next/headers";

import { CreateShippingAdressSchema, createShippingAdressSchema } from "@/actions/create-shipping-adress/schema";
import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const createShippingAdress = async (data: CreateShippingAdressSchema) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  createShippingAdressSchema.parse(data);

  await db.insert(shippingAddressTable).values({
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
  });

  return { success: true, message: "Endereço adicionado com sucesso!" };
};
