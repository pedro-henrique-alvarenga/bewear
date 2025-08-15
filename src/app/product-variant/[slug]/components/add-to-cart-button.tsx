"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { addProductToCart } from "@/actions/add-product-to-cart";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  productVariantId: string;
  quantity: number;
}

const AddToCartButton = ({ productVariantId, quantity }: AddToCartButtonProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["addProductToCart", productVariantId, quantity],
    mutationFn: () => addProductToCart({
      productVariantId,
      quantity,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Produto adicionado ao carrinho.");
    },
    onError: () => {
      toast.error("Erro ao adicionar produto ao carrinho.");
    },
  });

  return (
    <Button
      className="rounded-full cursor-pointer"
      size="lg"
      variant="outline"
      disabled={isPending}
      onClick={() => mutate()}
    >
      {isPending && <Loader2 className="animate-spin" />}
      Adicionar ao carrinho
    </Button>
  );
}
 
export default AddToCartButton;
