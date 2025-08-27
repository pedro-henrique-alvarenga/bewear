"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MapPinnedIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { shippingAddressTable } from "@/db/schema";
import { useCreateShippingAddress } from "@/hooks/mutations/use-create-shipping-address";
import { useUpdateCartShippingAddress } from "@/hooks/mutations/use-update-cart-shipping-address";
import { useUserAddresses } from "@/hooks/queries/use-user-addresses";

const formSchema = z.object({
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
}).refine(
  (data) => data.cpfOrCnpj.replace(/\D/g, '').length === 11 || data.cpfOrCnpj.replace(/\D/g, '').length === 14,
  {
    error: "CNPJ é obrigatório",
    path: ["cpfOrCnpj"],
  }
);

interface AddressesProps {
  shippingAddresses: typeof shippingAddressTable.$inferSelect[];
  defaultShippingAddressId: string | null;
}

type FormData = z.infer<typeof formSchema>;

const Addresses = ({ shippingAddresses, defaultShippingAddressId }: AddressesProps) => {
  const router = useRouter();
  const { data: addresses, isLoading } = useUserAddresses({ initialData: shippingAddresses });
  const [selectedAddress, setSelectedAddress] = useState<string | null>(defaultShippingAddressId);
  const createShippingAddressMutation = useCreateShippingAddress();
  const updateCartShippingAddressMutation = useUpdateCartShippingAddress();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      recipientName: "",
      cpfOrCnpj: "",
      phone: "",
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      country: "",
    },
  });

  const onSubmit = async (formData: FormData) => {
    try {
      const newAddress = await createShippingAddressMutation.mutateAsync(formData);
      toast.success("Endereço adicionado com sucesso.");
      form.reset();
      setSelectedAddress(newAddress.id);

      await updateCartShippingAddressMutation.mutateAsync({
        shippingAddressId: newAddress.id,
      });
      toast.success("Endereço associado ao carrinho!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao adicionar endereço.");
    }
  };

  const handleGoToPayment = async () => {
    if (!selectedAddress || selectedAddress === "add_new") return;

    try {
      await updateCartShippingAddressMutation.mutateAsync({
        shippingAddressId: selectedAddress,
      });
      toast.success("Endereço selecionado para entrega!");
      router.push("/cart/confirmation");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao selecionar endereço.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identificação</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 mt-6">
            <Loader2 size={32} className="animate-spin" />
            <p className="text-sm text-muted-foreground">Carregando...</p>
          </div>
        ) : (
          <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
            {addresses?.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-4 mt-6 mb-6">
                <MapPinnedIcon size={32} className="opacity-50" />
                <p className="text-sm text-muted-foreground">Você ainda não possui endereços cadastrados</p>
              </div>
            )}
            {addresses?.map((address) => (
              <Card key={address.id}>
                <CardContent>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value={address.id} id={address.id} />
                    <div className="flex-1">
                      <Label htmlFor={address.id} className="cursor-pointer">
                        <div>
                          <p className="text-sm">
                            {address.recipientName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {address.street}, {address.number}  
                            {address.complement && `, ${address.complement}`}, {address.neighborhood},
                            {" "}{address.city} - {address.state}, CEP: {address.zipCode}
                          </p>
                        </div>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="add_new" id="add_new" />
                  <Label htmlFor="add_new" className="cursor-pointer">Adicionar novo endereço</Label>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>
        )}

        {selectedAddress && selectedAddress !== "add_new" && (
          <div className="mt-4">
            <Button
              className="w-full cursor-pointer"
              disabled={updateCartShippingAddressMutation.isPending}
              onClick={handleGoToPayment}
            >
              {updateCartShippingAddressMutation.isPending
                ? (<Loader2 className="animate-spin" />)
                : "Ir para pagamento"
              }
            </Button>
          </div>
        )}

        {selectedAddress === "add_new" && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recipientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu nome completo" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cpfOrCnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF/CNPJ</FormLabel>
                      <FormControl>
                        <PatternFormat
                          format={
                            form.getValues('cpfOrCnpj').replace(/\D/g, '').length < 12
                              ? "###.###.###-###"
                              : "##.###.###/####-##"
                          }
                          placeholder="000.000.000-00"
                          customInput={Input}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Celular</FormLabel>
                      <FormControl>
                        <PatternFormat
                          format="(##) #####-####"
                          placeholder="(99) 99999-9999"
                          customInput={Input}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <PatternFormat
                          format="#####-###"
                          placeholder="00000-000"
                          customInput={Input}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu endereço" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu número" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Apto, bloco, etc." type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu bairro" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite sua cidade" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu Estado" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>País</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu país" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={createShippingAddressMutation.isPending}
              >
                {createShippingAddressMutation.isPending
                  ? (<Loader2 className="animate-spin" />)
                  : "Salvar endereço"
                }
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
 
export default Addresses;
