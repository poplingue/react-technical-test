import Box from "@mui/joy/Box";
import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider } from "@mui/joy/styles";
import MessagesPane from "./MessagesPane";
import Sidebar from "./Sidebar";
import { useGlobalContext } from "./GlobalContext";

function App() {
  const {
    state: { issue },
  } = useGlobalContext();

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Box component="aside" sx={{ width: 300 }}>
          <Sidebar />
        </Box>
        <Box component="main" sx={{ flex: 1 }}>
          {issue && <MessagesPane />}
        </Box>
      </Box>
    </CssVarsProvider>
  );
}

export default App;
