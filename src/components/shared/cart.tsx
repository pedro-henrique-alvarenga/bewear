"use client";

import { useQuery } from "@tanstack/react-query";
import { ShoppingBasketIcon } from "lucide-react";
import Image from "next/image";

import { getCart } from "@/actions/get-cart";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

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
        {cartIsLoading && <p>Carregando...</p>}
        {cart?.cartItems.map((item) => (
          <div key={item.id}>
            <Image
              src={item.productVariant.imageUrl}
              alt={item.productVariant.product.name}
              width={100}
              height={100}
            />
            <div>
              <h3>{item.productVariant.product.name}</h3>
            </div>
            
          </div>
        ))}
      </SheetContent>
    </Sheet>
  );
}
 
export default Cart;
