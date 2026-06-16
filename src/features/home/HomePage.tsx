import { Download, GitHub, LinkedIn, Mail, WhatsApp } from "@mui/icons-material";
import { Box, Stack } from "@mui/material";
import { Button, Chip, TextBody1Neutral60, TextH4Bold } from "../../shared/components";
import { useAuth, useTranslation } from "../../shared/hooks";

const techStack = ["Kotlin Multiplatform", "Compose Multiplatform", "Ktor", "PostgreSQL", "Koin", "SQLDelight"];

export function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <Box sx={{ p: 4, maxWidth: 720 }}>
      <TextBody1Neutral60 sx={{ mb: 0.5 }}>
        {t("home.welcome")}, {user?.name}
      </TextBody1Neutral60>
      <TextH4Bold sx={{ mb: 1 }}>{t("home.headline")}</TextH4Bold>
      <TextBody1Neutral60 sx={{ mb: 3 }}>{t("home.description")}</TextBody1Neutral60>

      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 4 }}>
        {techStack.map((tech) => (
          <Chip key={tech} label={tech} variant="outlined" />
        ))}
      </Stack>

      <Stack direction="row" sx={{ mb: 2 }}>
        <Button variant="primary" startIcon={<Mail />} href="mailto:mir.kusnir@gmail.com">
          {t("home.contactCta")}
        </Button>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
        <Button
          variant="outline"
          size="small"
          startIcon={<LinkedIn />}
          href="https://linkedin.com/in/miroslavkusnir"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("home.linkedin")}
        </Button>
        <Button
          variant="outline"
          size="small"
          startIcon={<WhatsApp />}
          href="https://wa.me/421951892670"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("home.whatsapp")}
        </Button>
        <Button
          variant="outline"
          size="small"
          startIcon={<GitHub />}
          href="https://github.com/KusnirM/kmp-showcase"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("home.viewSource")}
        </Button>
        <Button
          variant="outline"
          size="small"
          startIcon={<Download />}
          href="/cv.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("home.downloadCv")}
        </Button>
      </Stack>

      <TextBody1Neutral60>{t("home.responseTime")}</TextBody1Neutral60>
    </Box>
  );
}
