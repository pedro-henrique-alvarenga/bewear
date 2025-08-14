"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const QuantitySelector = () => {
  const [quantity, setQuantity] = useState(1);

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  }

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Quantidade</h3>
      <div className="flex items-center justify-between border rounded-lg w-[100px]">
        <Button size="icon" variant="ghost" className="cursor-pointer" onClick={handleDecrement}>
          <MinusIcon />
        </Button>
        <p>{quantity}</p>
        <Button size="icon" variant="ghost" className="cursor-pointer" onClick={handleIncrement}>
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
}
 
export default QuantitySelector;
