import {
  CalendarMonth,
  Cloud,
  Dataset,
  Notifications,
  Palette,
  PhoneAndroid,
  QrCode2,
  Storage,
} from "@mui/icons-material";
import { AppBar, Box, Stack, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextBody1Neutral60,
  TextH6Bold,
} from "../../shared/components";
import { useAuth, useTranslation } from "../../shared/hooks";
import { Routes } from "../../utils";
import { FeatureCard } from "./FeatureCard";

const features = [
  {
    id: "ui-components",
    titleKey: "home.uiComponents.title",
    subtitleKey: "home.uiComponents.subtitle",
    Icon: Palette,
  },
  {
    id: "networking",
    titleKey: "home.networking.title",
    subtitleKey: "home.networking.subtitle",
    Icon: Cloud,
  },
  {
    id: "storage",
    titleKey: "home.storage.title",
    subtitleKey: "home.storage.subtitle",
    Icon: Storage,
  },
  {
    id: "database",
    titleKey: "home.database.title",
    subtitleKey: "home.database.subtitle",
    Icon: Dataset,
  },
  {
    id: "platform-apis",
    titleKey: "home.platformApis.title",
    subtitleKey: "home.platformApis.subtitle",
    Icon: PhoneAndroid,
  },
  {
    id: "scanner",
    titleKey: "home.scanner.title",
    subtitleKey: "home.scanner.subtitle",
    Icon: QrCode2,
  },
  {
    id: "calendar",
    titleKey: "home.calendar.title",
    subtitleKey: "home.calendar.subtitle",
    Icon: CalendarMonth,
  },
  {
    id: "notifications",
    titleKey: "home.notifications.title",
    subtitleKey: "home.notifications.subtitle",
    Icon: Notifications,
  },
] as const;

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate(Routes.LOGIN);
  };

  return (
    <Box>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <TextH6Bold component="h1" sx={{ flexGrow: 1 }}>
            {t("home.title")}
          </TextH6Bold>
          <TextBody1Neutral60 sx={{ mr: 2 }}>
            {t("home.welcome")}, {user?.name}
          </TextBody1Neutral60>
          <Button onClick={handleLogout} variant="secondary">
            {t("home.logout")}
          </Button>
        </Toolbar>
      </AppBar>

      <Stack spacing={2} sx={{ p: 2, pt: 4 }}>
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            onClick={() => navigate(`/${feature.id}`)}
            title={t(feature.titleKey)}
            subtitle={t(feature.subtitleKey)}
            Icon={feature.Icon}
          />
        ))}
      </Stack>
    </Box>
  );
}
