import Link from 'next/link';

const Header = () => {
  return (
    <header>
      <div className="container">
        <div className="flex items-center justify-between">
          <Link href="/">HOME</Link>
          <Link href="/sample">SAMPLE</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
