import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getUserAddresses } from "@/actions/get-user-addresses";
import Addresses from "@/app/cart/identification/components/addresses";
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
      cartItems: true,
    },
  });

  if (!cart || cart?.cartItems.length === 0) {
    redirect("/");
  }

  const shippingAddresses = await getUserAddresses();

  return (
    <>
      <Header />

      <div className="px-5">
        <Addresses shippingAddresses={shippingAddresses} />

      </div>
    </>
  );
}
 
export default IdentificationPage;
