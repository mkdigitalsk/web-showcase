import { ExpandMore } from "@mui/icons-material";
import { Box, Collapse, IconButton, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";
import { Chip, Divider, TextH6BoldPrimary } from "../../shared/components";

interface SkillGroupProps {
  title: string;
  items: string[];
}

export function SkillGroup({ title, items }: SkillGroupProps) {
  const [open, setOpen] = useState(true);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
        }}
      >
        <TextH6BoldPrimary>{title}</TextH6BoldPrimary>
        <IconButton size="small" onClick={() => setOpen((prev) => !prev)} aria-label={title}>
          <ExpandMore
            sx={{
              transition: "transform 0.2s ease",
              transform: open ? "rotate(0deg)" : "rotate(180deg)",
            }}
          />
        </IconButton>
      </Box>
      <Divider />
      <Collapse in={open}>
        <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: "wrap", p: 2 }}>
          {items.map((item) => (
            <Chip key={item} label={item} variant="outlined" />
          ))}
        </Stack>
      </Collapse>
    </Box>
  );
}
