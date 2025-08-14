"use client";

import { LogInIcon, LogOutIcon, MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Cart from "@/components/shared/cart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";

const Header = () => {
  const { data: session } = authClient.useSession();

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

        <Sheet>
          <SheetTrigger asChild>
            <Button variant={"outline"} size="icon" className="cursor-pointer">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="px-5">
              {session?.user ? (
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={session?.user?.image as string | undefined} alt="User Avatar"
                      />
                      <AvatarFallback>
                        {session?.user?.name?.split(" ").length > 1
                          ? session?.user?.name?.split(" ")[0][0].toUpperCase() +
                            session?.user?.name?.split(" ")[1][0].toUpperCase()
                          : session?.user?.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className="font-semibold">{session?.user?.name}</h3>
                      <span className="block text-xs text-muted-foreground">
                        {session?.user?.email}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant={"outline"}
                    size="icon"
                    onClick={() => authClient.signOut()}
                    className="cursor-pointer"
                  >
                    <LogOutIcon />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Olá! Faça seu login!</h2>
                  <Button asChild variant="outline" size="icon">
                    <Link href="/authentication">
                      <LogInIcon />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
   );
}
 
export default Header;
