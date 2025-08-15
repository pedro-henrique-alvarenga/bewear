"use client";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ShoppingBasketIcon } from "lucide-react";

import { getCart } from "@/actions/get-cart";
import CartItem from "@/components/shared/cart-item";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { formatCentsToBRL } from "@/helpers/money";

const Cart = () => {
  const { data: cart, isPending: cartIsLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
  });
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="cursor-pointer">
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Carrinho</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full px-5 pb-5">
          <div className="flex flex-col h-full max-h-full overflow-hidden">
            <ScrollArea className="h-full">
              <div className="flex h-full flex-col gap-8">
                {cartIsLoading && (
                  <div className="flex flex-col items-center justify-center gap-4 mt-10">
                    <Loader2 size={32} className="animate-spin" />
                    <p className="text-sm text-muted-foreground">Carregando...</p>
                  </div>
                )}
                {!cartIsLoading && cart?.cartItems.length === 0 && (
                  <div className="flex flex-col items-center justify-center gap-4 mt-10">
                    <ShoppingBasketIcon size={32} className="opacity-50" />
                    <p className="text-sm text-muted-foreground">Seu carrinho está vazio</p>
                  </div>
                )}
                {cart?.cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    productName={item.productVariant.product.name}
                    productVariantName={item.productVariant.name}
                    productVariantId={item.productVariant.id}
                    productVariantImageUrl={item.productVariant.imageUrl}
                    productVariantPriceInCents={item.productVariant.priceInCents}
                    quantity={item.quantity}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>

          {cart?.cartItems && cart?.cartItems.length > 0 && (
            <div className="flex flex-col gap-4">
              <Separator />

              <div className="flex items-center justify-between text-xs font-medium">
                <p>Subtotal</p>
                <p className="font-bold">{formatCentsToBRL(cart?.totalPriceInCents ?? 0)}</p>
              </div>

              <Separator />
              
              <div className="flex items-center justify-between text-xs font-medium">
                <p>Entrega</p>
                <p className="font-bold">GRÁTIS</p>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-xs font-medium">
                <p>Total</p>
                <p className="font-bold">{formatCentsToBRL(cart?.totalPriceInCents ?? 0)}</p>
              </div>

              <Button className="mt-5 rounded-full cursor-pointer" onClick={() => {}}>
                Finalizar compra
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
 
export default Cart;
