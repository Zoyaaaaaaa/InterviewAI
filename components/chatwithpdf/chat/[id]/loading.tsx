import { IconLoader2 } from "@tabler/icons-react";

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <IconLoader2 className="h-10 w-10 animate-spin" />
    </div>
  );
}
