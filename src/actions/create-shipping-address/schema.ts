import z from "zod";

export const createShippingAddressSchema = z.object({
  email: z.email("Email inválido"),
  recipientName: z.string().trim().min(2, "Nome é obrigatório"),
  cpfOrCnpj: z.string().trim().min(14, "CPF é obrigatório").max(18, "CNPJ é obrigatório"),
  phone: z.string().trim().length(15, "Telefone é obrigatório"),
  zipCode: z.string().trim().length(9, "CEP inválido"),
  street: z.string().trim().min(2, "Rua é obrigatório"),
  number: z.string().trim().min(1, "Número é obrigatório"),
  complement: z.string().trim().optional(),
  neighborhood: z.string().trim().min(2, "Bairro é obrigatório"),
  city: z.string().trim().min(2, "Cidade é obrigatório"),
  state: z.string().trim().min(2, "Estado é obrigatório"),
  country: z.string().trim().min(2, "País é obrigatório"),
});

export type CreateShippingAddressSchema = z.infer<typeof createShippingAddressSchema>;
