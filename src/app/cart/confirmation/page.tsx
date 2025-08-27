import { headers } from "next/headers";
import { redirect } from "next/navigation";

import CartSummary from "@/app/cart/components/cart-summary";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { auth } from "@/lib/auth";

const ConfirmationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    redirect("/");
  }

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      shippingAddress: true,
      cartItems: {
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

  if (!cart || cart?.cartItems.length === 0) {
    redirect("/");
  }

  if (!cart?.shippingAddress) {
    redirect("/cart/identification");
  }

  const cartTotalPriceInCents = cart.cartItems.reduce(
    (sum, item) => sum + item.productVariant.priceInCents * item.quantity,
    0,
  );
  
  return (
    <>
      <Header />

      <div className="px-5 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Identificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card>
              <CardContent>
                <div>
                  <p className="text-sm font-medium">
                    {cart.shippingAddress.recipientName}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    {cart.shippingAddress.street}, {cart.shippingAddress.number}  
                    {cart.shippingAddress.complement && `, ${cart.shippingAddress.complement}`}, {cart.shippingAddress.neighborhood},
                    {" "}{cart.shippingAddress.city} - {cart.shippingAddress.state}, CEP: {cart.shippingAddress.zipCode}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button
              size="lg"
              className="w-full rounded-full cursor-pointer"
            >
              Finalizar compra
            </Button>
          </CardContent>
        </Card>

        <CartSummary
          subtotalInCents={cartTotalPriceInCents}
          totalInCents={cartTotalPriceInCents}
          products={cart.cartItems.map((item) => ({
            id: item.productVariant.id,
            name: item.productVariant.product.name,
            variantName: item.productVariant.name,
            quantity: item.quantity,
            priceInCents: item.productVariant.priceInCents,
            imageUrl: item.productVariant.imageUrl,
          }))}
        />
      </div>

      <Footer />
    </>
  );
}
 
export default ConfirmationPage;
