import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  Button
} from '@mui/material';
import { exportToCSV } from '@paysurity/ui';
import { supabase } from '../../lib/supabaseClient';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
}

export const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          date,
          amount,
          currency,
          status,
          description
        `)
        .eq('merchant_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleExport = () => {
    const csvData = transactions.map(tx => ({
      Date: new Date(tx.date).toLocaleDateString(),
      Description: tx.description,
      Amount: `${tx.currency} ${tx.amount}`,
      Status: tx.status
    }));

    exportToCSV(csvData, 'transactions.csv');
  };

  return (
    <div>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleExport}
        sx={{ mb: 2 }}
      >
        Export to CSV
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                <TableCell>{tx.description}</TableCell>
                <TableCell align="right">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: tx.currency
                  }).format(tx.amount)}
                </TableCell>
                <TableCell>{tx.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};