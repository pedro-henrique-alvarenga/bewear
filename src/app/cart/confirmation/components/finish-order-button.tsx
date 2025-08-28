"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFinishOrder } from "@/hooks/mutations/use-finish-order";

const FinishOrderButton = () => {
  const [successDialogIsOpen, setSuccessDialogIsOpen] = useState(true);
  const finishOrderMutation = useFinishOrder();

  const handleFinishOrder = async () => {
    try {
      await finishOrderMutation.mutateAsync();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar o pedido.");
    }
  }
  
  return (
    <>
      <Button
        size="lg"
        className="w-full rounded-full cursor-pointer"
        disabled={finishOrderMutation.isPending}
        onClick={handleFinishOrder}
      >
        {finishOrderMutation.isPending && (
          <Loader2 className="animate-spin" />
        )}
        Finalizar compra
      </Button>

      <Dialog open={successDialogIsOpen} onOpenChange={setSuccessDialogIsOpen}>
        <DialogContent className="text-center">
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
              className="rounded-full cursor-pointer"
              size="lg"
              variant="outline"
            >
              Voltar para a loja
            </Button>
            <Button
              className="rounded-full cursor-pointer"
              size="lg"
            >
              Ver meus pedidos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
 
export default FinishOrderButton;
