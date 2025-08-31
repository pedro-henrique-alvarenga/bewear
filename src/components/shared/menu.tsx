"use client";

import { HouseIcon, LogInIcon, LogOutIcon, MenuIcon, TruckIcon } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";

const Menu = () => {
  const { data: session } = authClient.useSession();

  return (
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
            <div className="flex flex-col gap-6">
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

              <Separator />

              <div className="flex flex-col gap-5 pl-3">
                <Link href="/" className="flex gap-4">
                  <HouseIcon size={20} />
                  <p className="text-xs font-medium">Início</p>
                </Link>
                <Link href="/my-orders" className="flex gap-4">
                  <TruckIcon size={20} />
                  <p className="text-xs font-medium">Meus Pedidos</p>
                </Link>
              </div>
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
  );
}
 
export default Menu;
