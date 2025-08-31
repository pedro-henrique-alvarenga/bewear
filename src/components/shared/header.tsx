"use client";

import Image from "next/image";
import Link from "next/link";

import Cart from "@/components/shared/cart";
import Menu from "@/components/shared/menu";

const Header = () => {

  return ( 
    <header className="flex items-center justify-between p-5">
      <Link href="/">
        <Image
          src="/logo.svg"
          alt="BEWEAR"
          width={100}
          height={26.14}
          className="cursor-pointer"
        />
      </Link>

      <div className="flex item-center gap-3">
        <Cart />
        <Menu />
      </div>
    </header>
   );
}

export default Header;
