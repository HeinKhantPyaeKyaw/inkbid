export const NavbarPrimary = () => {
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
      <div className="text-[64px] tracking-wide font-Montserrat text-accent">
        INKBID
      </div>
      <div className="text-[64px] tracking-wide font-Forum text-accent">
        INKBID
      </div>
      <div className="flex items-center gap-4">
        <button>
          <i className="fa fa-search" />
        </button>
        <button>
          <i className="fa fa-search" />
        </button>
      </div>
    </nav>
  );
};
