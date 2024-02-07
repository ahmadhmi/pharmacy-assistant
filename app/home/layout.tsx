import NavBar from "../UI/NavBar";
import SideBar from "../UI/SideBar";
import AuthProvider from "../_utils/AuthProvider";
import BlocksContextProvider from "../_utils/blocks-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <BlocksContextProvider>
          <NavBar />
          <SideBar>{children}</SideBar>
      </BlocksContextProvider>
  );
}
