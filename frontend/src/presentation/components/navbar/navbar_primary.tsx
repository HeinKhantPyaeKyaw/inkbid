import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const NavbarPrimary = () => {
  //---------------------
  //   CONST
  //---------------------
  const title = 'Primary Navbar';

  //---------------------
  //   HANDLE
  //---------------------

  //---------------------
  //   RENDER
  //---------------------
  return (
    <nav className="flex items-center justify-between bg-primary">
      <div className="w-6" />
      <div className="text-[64px] tracking-wide font-Forum text-accent">
        INKBID
      </div>
      <div className="flex items-center gap-4">
        <button>
          <FontAwesomeIcon icon={faBell} className="text-accent text-[24px]" />
        </button>
        <button>
          <FontAwesomeIcon icon={faUser} className="text-accent text-[24px]" />
        </button>
      </div>
    </nav>
  );
};
