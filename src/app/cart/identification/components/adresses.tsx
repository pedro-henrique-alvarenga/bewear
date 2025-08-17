"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useCreateShippingAdress } from "@/hooks/mutations/use-create-shipping-adress";

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

type FormData = z.infer<typeof formSchema>;

const Adresses = () => {
  const [selectedAdress, setSelectedAdress] = useState<string | null>(null);
  const createShippingAdressMutation = useCreateShippingAdress();

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
      await createShippingAdressMutation.mutateAsync(formData);
      toast.success("Endereço adicionado com sucesso.");
      form.reset();
      setSelectedAdress(null);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao adicionar endereço.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identificação</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedAdress} onValueChange={setSelectedAdress}>
          <Card>
            <CardContent>
              <div className="flex itecms-center space-x-2">
                <RadioGroupItem value="add_new" id="add_new" />
                <Label htmlFor="add_new">Adicionar novo endereço</Label>
              </div>
            </CardContent>
          </Card>
        </RadioGroup>

        {selectedAdress === "add_new" && (
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
              <Button type="submit" className="w-full cursor-pointer">Salvar endereço</Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
 
export default Adresses;
