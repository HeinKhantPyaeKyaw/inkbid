import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons";

export const NavbarPrimary = ({isDisableNoti=false}: {isDisableNoti: boolean}) => {
  //---------------------
  //   CONST
  //---------------------
  const title = "Primary Navbar";

  //---------------------
  //   HANDLE
  //---------------------

  //---------------------
  //   RENDER
  //---------------------
  return (
    <nav className="flex items-center justify-between px-6 py-6 bg-primary/70">
      <div className="w-6" />
      <div className="text-[64px] tracking-wide font-Forum text-accent">
        INKBID
      </div>
      <div className="flex items-center gap-4">
        {!isDisableNoti &&<button>
          <FontAwesomeIcon icon={faBell} className="text-accent text-[24px]" />
        </button>}
        <button>
          <FontAwesomeIcon icon={faUser} className="text-accent text-[24px]" />
        </button>
      </div>
    </nav>
  );
};
