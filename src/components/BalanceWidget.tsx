import React, { useState, useEffect } from 'react';
import { Card, Typography, CircularProgress, Box } from '@mui/material';
import { supabase } from '../lib/supabaseClient';

interface BalanceData {
  available: number;
  pending: number;
  currency: string;
}

export const BalanceWidget: React.FC = () => {
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('merchant_balances')
        .select('*')
        .eq('merchant_id', user.id)
        .single();

      if (error) throw error;

      setBalance(data);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card sx={{ p: 3, minWidth: 275 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3, minWidth: 275 }}>
      <Typography variant="h6" gutterBottom>
        Available Balance
      </Typography>
      <Typography variant="h4" color="primary">
        {balance ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: balance.currency
        }).format(balance.available) : '$0.00'}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Pending: {balance ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: balance.currency
        }).format(balance.pending) : '$0.00'}
      </Typography>
    </Card>
  );
};