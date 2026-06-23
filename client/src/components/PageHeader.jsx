import React from 'react';
import { Box, Typography } from '@mui/material';

export const PageHeader = ({ title, subtitle, actions }) => (
  <Box
    sx={{
      mb: 3,
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: { xs: 'flex-start', md: 'center' },
      gap: 2
    }}
  >
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
    <Box sx={{ flexGrow: 1 }} />
    {actions}
  </Box>
);
