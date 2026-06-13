import { IconAlertCircle } from "@tabler/icons-react";
import { buttonVariants } from "../ui/button";
import Link from "next/link";

interface iAppProps {
  title: string;
  description: string;
  btnText: string;
  href: string;
}

export function EmptyState({ btnText, description, title, href }: iAppProps) {
  return (
    <div className="mx-auto max-w-md text-center">
      <IconAlertCircle
        size={80}
        stroke={1.5}
        className="mx-auto text-gray-400"
      />

      <h2 className="mt-6 text-4xl font-black text-gray-900 uppercase">
        {title}
      </h2>

      <p className="mt-4 text-gray-700">{description}</p>

      <Link
        type="button"
        className={buttonVariants({
          className: "h-10 rounded-md mt-6 w-56 text-sm font-medium",
        })}
        href={href}
      >
        {btnText}
      </Link>
    </div>
  );
}
