import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconSmartHome } from "@tabler/icons-react";
import { ShieldX } from "lucide-react";
import Link from "next/link";

export default function NotAdminRoute() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 rounded-md p-4 w-fit mx-auto">
            <ShieldX className="size-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Restricted</CardTitle>
          <CardDescription className="max-w-xs mx-auto">
            Hey! you are not an admin, which means you cannot create any cpurses
            or stuff like that...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/"
            className={buttonVariants({
              className: "w-full h-10 rounded-md",
            })}
          >
            <IconSmartHome className="mr-1 size-4" />
            Back to Home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
