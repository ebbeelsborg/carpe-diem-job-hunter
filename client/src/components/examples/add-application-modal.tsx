import { useState } from "react";
import { AddApplicationModal } from "../add-application-modal";
import { Button } from "@/components/ui/button";

export default function AddApplicationModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <AddApplicationModal
        open={open}
        onOpenChange={setOpen}
        onSubmit={(data) => {
          console.log("Application submitted:", data);
        }}
      />
    </div>
  );
}
