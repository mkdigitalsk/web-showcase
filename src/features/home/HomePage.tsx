import { Box } from "@mui/material";
import { TextBody1Neutral60, TextH4Bold } from "../../shared/components";
import { useAuth, useTranslation } from "../../shared/hooks";

export function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <Box sx={{ p: 4 }}>
      <TextH4Bold sx={{ mb: 1 }}>
        {t("home.welcome")}, {user?.name}
      </TextH4Bold>
      <TextBody1Neutral60>{t("home.pickSection")}</TextBody1Neutral60>
    </Box>
  );
}
