import { desc } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Orders from "@/app/my-orders/components/orders";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { db } from "@/db";
import { orderTable } from "@/db/schema";
import { auth } from "@/lib/auth";

const MyOrdersPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    redirect("/login");
  }

  const orders = await db.query.orderTable.findMany({
    where: (order, { eq }) => eq(order.userId, session.user.id),
    orderBy: [desc(orderTable.createdAt)],
    with: {
      orderItems: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });
    
  return (
    <>
      <Header />

      <div className="px-5">
        <Orders orders={orders.map((order) => ({
          id: order.id,
          totalPriceInCents: order.totalPriceInCents,
          status: order.status,
          createdAt: order.createdAt,
          orderItems: order.orderItems.map((item) => ({
            id: item.id,
            productName: item.productVariant.product.name,
            productVariantName: item.productVariant.name,
            quantity: item.quantity,
            priceInCents: item.priceInCents,
            imageUrl: item.imageUrl,
          })),
        }))} />
      </div>

      <Footer />
    </>
  );
}
 
export default MyOrdersPage;
