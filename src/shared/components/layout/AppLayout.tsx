import { Box, Toolbar } from "@mui/material";
import { useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { Panel, PanelGroup, PanelResizeHandle, type ImperativePanelHandle } from "react-resizable-panels";
import { AccountMenu } from "./AccountMenu";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  const sidebarRef = useRef<ImperativePanelHandle>(null);
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    const panel = sidebarRef.current;
    if (!panel) return;
    if (panel.isCollapsed()) panel.expand();
    else panel.collapse();
  };

  return (
    <PanelGroup direction="horizontal" autoSaveId="app-layout" style={{ height: "100vh" }}>
      <Panel
        id="sidebar"
        order={1}
        ref={sidebarRef}
        collapsible
        collapsedSize={5}
        minSize={12}
        maxSize={28}
        defaultSize={18}
        onCollapse={() => setCollapsed(true)}
        onExpand={() => setCollapsed(false)}
      >
        <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
      </Panel>

      <PanelResizeHandle style={{ width: 6, cursor: "col-resize", outline: "none" }}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            "&:hover > div, &:active > div": { backgroundColor: "primary.main", width: "2px" },
          }}
        >
          <Box
            sx={{
              width: "1px",
              height: "100%",
              bgcolor: "divider",
              transition: "background-color 0.15s ease, width 0.15s ease",
            }}
          />
        </Box>
      </PanelResizeHandle>

      <Panel id="main" order={2}>
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "auto" }}>
          <Toolbar sx={{ justifyContent: "flex-end", gap: 1 }}>
            <LocaleSwitcher />
            <AccountMenu />
          </Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Outlet />
          </Box>
        </Box>
      </Panel>
    </PanelGroup>
  );
}
