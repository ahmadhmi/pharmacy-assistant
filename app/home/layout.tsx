import NavBar from "../UI/NavBar";
import SideBar from "../UI/SideBar";
import AuthProvider from "../auth/AuthProvider";
import BlocksContextProvider from "../_utils/blocks-context";

export default async function Layout({ children }: { children: React.ReactNode }) {
  
  return (
      <BlocksContextProvider>
          <SideBar>{children}</SideBar>
      </BlocksContextProvider>
  );
}
