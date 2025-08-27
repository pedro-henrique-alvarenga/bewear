import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getUserAddresses } from "@/actions/get-user-addresses";
import CartSummary from "@/app/cart/components/cart-summary";
import Addresses from "@/app/cart/identification/components/addresses";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { db } from "@/db";
import { auth } from "@/lib/auth";

const IdentificationPage = async () => {
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

  const shippingAddresses = await getUserAddresses();

  const cartTotalPriceInCents = cart.cartItems.reduce(
    (sum, item) => sum + item.productVariant.priceInCents * item.quantity,
    0,
  );

  return (
    <div className="space-y-6">
      <Header />

      <div className="px-5 space-y-4">
        <Addresses
          shippingAddresses={shippingAddresses}
          defaultShippingAddressId={cart.shippingAddress?.id || null}
        />

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
    </div>
  );
}
 
export default IdentificationPage;
