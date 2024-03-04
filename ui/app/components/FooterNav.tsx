import Image from "next/image";
import logo from "../../public/logo.png";
import Link from "next/link";

const FooterNav = () => {
  return (
    <header className="sticky bottom-0 z-10 flex justify-center items-center w-full h-16 bg-bg-secondary text-grayscale border-t-4 border-error">
      <div className="flex justify-around items-center w-full max-w-2xl mx-auto">
        <Link href="/monitor">monitor</Link>
        <Link href="/">
          <Image alt="logo" src={logo} width={100} />
        </Link>
        <Link href="/settings">settings</Link>
      </div>
    </header>
  );
};

export default FooterNav;
