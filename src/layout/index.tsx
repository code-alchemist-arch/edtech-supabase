import Sidebar, { type NavItem } from './sidebar';
import Header from './Header';

const Layout = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: NavItem;
}) => {
  return (
    <div className='flex flex-row'>
      <Sidebar title={title} />
      <main className='flex flex-col grow'>
        <Header title={title} />
        {children}
      </main>
    </div>
  );
};

export default Layout;
