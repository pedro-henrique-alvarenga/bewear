"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { createCheckoutSession } from "@/actions/create-checkout-session";
import { Button } from "@/components/ui/button";
import { useFinishOrder } from "@/hooks/mutations/use-finish-order";

const FinishOrderButton = () => {
  const finishOrderMutation = useFinishOrder();

  const handleFinishOrder = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error("Chave publicável do Stripe não definida");
      }

      const { orderId } = await finishOrderMutation.mutateAsync();
      const checkoutSession = await createCheckoutSession({ orderId });
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

      if (!stripe) {
        throw new Error("Erro ao carregar o Stripe");
      }

      await stripe.redirectToCheckout({
        sessionId: checkoutSession.id,
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar o pedido.");
    }
  }
  
  return (
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
  );
}
 
export default FinishOrderButton;
