"use client";
import Image from "next/image";
import logo from "../../public/logo.png";
import Link from "next/link";
import { usePathname } from "next/navigation";

const FooterNav = () => {
  const curPage = usePathname()?.substring(1);
  const pages = [
    "monitor",
    <Image key="logo_key" priority alt="logo" src={logo} width={100} />,
    "adjust",
  ];
  return (
    <header className="sticky bottom-0 z-10 flex justify-center items-center w-full h-16 bg-bg-secondary text-grayscale border-t-4 border-error shadow-[var(--error)_0_0_10px_0]">
      <div className="flex justify-around items-center w-full max-w-2xl mx-auto">
        {pages.map((p, i) => {
          const isLogo = typeof p !== "string";
          const isCurPage = isLogo && !curPage ? true : curPage === p;
          return (
            <Link
              key={i}
              href={isLogo ? "/" : p}
              className={isCurPage ? "animate-pulse transition-all" : ""}
            >
              {!isLogo ? (
                <span className={isCurPage ? "text-error" : ""}>_</span>
              ) : null}
              {p}
            </Link>
          );
        })}
      </div>
    </header>
  );
};

export default FooterNav;
