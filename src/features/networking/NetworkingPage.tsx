import { Cloud, Refresh } from "@mui/icons-material";
import { Box, Container, IconButton, Stack } from "@mui/material";
import { AppBar, Toolbar } from "@mui/material";
import { TextBody1Neutral60, TextH6Bold } from "../../shared/components";
import { useTranslation } from "../../shared/hooks";

export function NetworkingPage() {
  const { t } = useTranslation();

  return (
    <Box>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <TextH6Bold component="h1" sx={{ flexGrow: 1 }}>{t("networking.title")}</TextH6Bold>
          <IconButton onClick={() => {}}>
            <Refresh />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm">
        <Stack spacing={2} sx={{ p: 4, alignItems: "center" }}>
          <Cloud sx={{ fontSize: 64, color: "text.disabled" }} />
          <TextBody1Neutral60 align="center">
            {t("home.networking.subtitle")}
          </TextBody1Neutral60>
        </Stack>
      </Container>
    </Box>
  );
}
