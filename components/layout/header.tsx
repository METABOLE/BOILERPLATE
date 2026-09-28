import Link from 'next/link';

const Header = () => {
  return (
    <header className="fixed z-500">
      <div className="flex items-center justify-between">
        <Link href="/">HOME</Link>
        <Link href="/sample">SAMPLE</Link>
      </div>
    </header>
  );
};

export default Header;
