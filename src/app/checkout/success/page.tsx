"use client";

import Image from "next/image";
import Link from "next/link";

import Header from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const CheckoutPage = () => {
  return (
    <>
      <Header />

      <Dialog open={true} >
        <DialogContent className="text-center" showCloseButton={false}>
          <DialogHeader>
            <Image
              src="/illustration.svg"
              alt="Success"
              width={300}
              height={300}
              className="mx-auto"
            />
            <DialogTitle className="mt-4 text-2xl">Pedido efetuado!</DialogTitle>
            <DialogDescription className="font-medium">
              Seu pedido foi efetuado com sucesso. Você pode acompanhar o status
              na seção &quot;Meus Pedidos&quot;.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full cursor-pointer"
            >
              <Link href="/">Voltar para a loja</Link>
            </Button>
            <Button
              size="lg"
              className="rounded-full cursor-pointer"
            >
              Ver meus pedidos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
 
export default CheckoutPage;
