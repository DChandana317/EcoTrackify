import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export const StatCard = ({ label, value, helper, icon }) => (
  <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0f0e8' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {icon && <Box sx={{ color: 'primary.main' }}>{icon}</Box>}
        <Box>
          <Typography variant="overline" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
            {value}
          </Typography>
          {helper && (
            <Typography variant="body2" color="text.secondary">
              {helper}
            </Typography>
          )}
        </Box>
      </Box>
    </CardContent>
  </Card>
);
