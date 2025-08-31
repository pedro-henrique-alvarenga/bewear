"use client";

import CartSummary from "@/app/cart/components/cart-summary";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { orderTable } from "@/db/schema";

interface OrdersProps {
  orders: Array<{
    id: string;
    totalPriceInCents: number;
    status: (typeof orderTable.$inferSelect)["status"];
    createdAt: Date;
    orderItems: Array<{
      id: string;
      productName: string;
      productVariantName: string;
      quantity: number;
      priceInCents: number;
      imageUrl: string;
    }>;
  }>;
}

const Orders = ({ orders }: OrdersProps) => {
  return (
    <div className="space-y-5">
      {orders.map((order, index) => (
        <Card key={order.id}>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="cursor-pointer">
                  <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Pedido #{(orders.length - index)}</span>
                      {order.status === "paid" && <Badge>Pago</Badge>}
                      {order.status === "pending" && <Badge variant="secondary">Pagamento pendente</Badge>}
                      {order.status === "canceled" && <Badge variant="destructive">Cancelado</Badge>}
                    </div>
                    <span className="font-normal text-muted-foreground">
                      {order.createdAt.toLocaleDateString("pt-BR")} às {order.createdAt.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <CartSummary
                    subtotalInCents={order.totalPriceInCents}
                    totalInCents={order.totalPriceInCents}
                    products={order.orderItems.map((item) => ({
                      id: item.id,
                      name: item.productName,
                      variantName: item.productVariantName,
                      quantity: item.quantity,
                      priceInCents: item.priceInCents,
                      imageUrl: item.imageUrl,
                    }))}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
 
export default Orders;
