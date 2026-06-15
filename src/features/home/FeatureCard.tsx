import type { SvgIconComponent } from "@mui/icons-material";
import { Stack } from "@mui/material";
import {
  ElevatedCard,
  TextBody1Neutral60,
  TextH6Bold,
} from "../../shared/components";

interface FeatureCardProps {
  title: string;
  subtitle: string;
  Icon: SvgIconComponent;
  onClick: () => void;
}

export function FeatureCard({
  title,
  subtitle,
  Icon,
  onClick,
}: FeatureCardProps) {
  return (
    <ElevatedCard onClick={onClick} sx={{ px: 2, py: 1, width:"100%"}}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Icon color="primary" />
        <Stack>
          <TextH6Bold>{title}</TextH6Bold>
          <TextBody1Neutral60>{subtitle}</TextBody1Neutral60>
        </Stack>
      </Stack>
    </ElevatedCard>
  );
}
