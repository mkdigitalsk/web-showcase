import { Download, GitHub, LinkedIn, Mail, WhatsApp } from "@mui/icons-material";
import { Box, Stack } from "@mui/material";
import { Button, TextBody1Neutral60, TextH4Bold } from "../../shared/components";
import { useAuth, useTranslation } from "../../shared/hooks";
import { SkillGroup } from "./SkillGroup";

// Skills grouped by delivery area — categorical grouping is more scannable for
// (often non-technical) recruiters than a flat tag cloud. Category labels are
// i18n'd; tech names are proper nouns kept untranslated across locales.
const skillGroups = [
  {
    labelKey: "home.skills.mobile",
    items: [
      "Android",
      "iOS",
      "Kotlin Multiplatform",
      "Compose Multiplatform",
      "Flutter",
      "React Native",
      "Jetpack Compose",
      "SwiftUI",
      "Kotlin",
      "Swift",
      "Dart",
    ],
  },
  { labelKey: "home.skills.web", items: ["React", "TypeScript"] },
  { labelKey: "home.skills.backend", items: ["Ktor", "PostgreSQL", "REST APIs"] },
  {
    labelKey: "home.skills.foundations",
    items: ["Clean Architecture", "MVVM", "Koin", "SQLDelight", "CI/CD", "Firebase", "AI-assisted development"],
  },
];

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

      <Stack spacing={2} sx={{ mb: 4 }}>
        {skillGroups.map((group) => (
          <SkillGroup key={group.labelKey} title={t(group.labelKey)} items={group.items} />
        ))}
      </Stack>

      <Stack direction="row" sx={{ mb: 2 }}>
        <Button variant="primary" startIcon={<Mail />} href="mailto:admin@mkdigital.sk">
          {t("home.contactCta")}
        </Button>
      </Stack>

      <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
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
          href="https://github.com/KusnirM"
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
