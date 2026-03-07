import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import api, { SpiritCurrency } from '../api';

interface Props {
  navigation: any;
}

export default function CurrencyScreen({ navigation }: Props) {
  const [currencies, setCurrencies] = useState<SpiritCurrency[]>([]);
  const [total, setTotal] = useState(0);

  // 模拟数据（API 不可用时）
  const mockData: SpiritCurrency[] = [
    {
      id: '1',
      userId: 'user1',
      amount: 100,
      type: 'income',
      description: '帮助他人解答问题',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      userId: 'user1',
      amount: -50,
      type: 'expense',
      description: '捐赠给慈善机构',
      createdAt: new Date().toISOString(),
    },
  ];

  // 计算总收入和支出
  const calculateTotal = (data: SpiritCurrency[]) => {
    return data.reduce((sum, item) => {
      return item.type === 'income' ? sum + item.amount : sum + item.amount;
    }, 0);
  };

  const displayData = currencies.length > 0 ? currencies : mockData;
  const displayTotal = currencies.length > 0 ? total : calculateTotal(mockData);

  return (
    <View style={styles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <Text style={styles.headerLabel}>我的精神货币</Text>
        <Text style={styles.headerAmount}>
          {displayTotal > 0 ? '+' : ''}{displayTotal}
        </Text>
        <View style={styles.headerStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>收入</Text>
            <Text style={[styles.statValue, styles.income]}>
              +{displayData.filter(c => c.type === 'income').reduce((s, c) => s + c.amount, 0)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>支出</Text>
            <Text style={[styles.statValue, styles.expense]}>
              {displayData.filter(c => c.type === 'expense').reduce((s, c) => s + c.amount, 0)}
            </Text>
          </View>
        </View>
      </View>

      {/* Transaction List */}
      <Text style={styles.sectionTitle}>交易记录</Text>
      <ScrollView style={styles.list}>
        {displayData.map((item) => (
          <View key={item.id} style={styles.transactionItem}>
            <View style={styles.transactionLeft}>
              <View style={[styles.typeIcon, item.type === 'income' ? styles.incomeBg : styles.expenseBg]}>
                <Text>{item.type === 'income' ? '💰' : '💸'}</Text>
              </View>
              <View>
                <Text style={styles.transactionDesc}>{item.description}</Text>
                <Text style={styles.transactionDate}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <Text style={[styles.transactionAmount, item.type === 'income' ? styles.income : styles.expense]}>
              {item.type === 'income' ? '+' : ''}{item.amount}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ 添加记录</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    backgroundColor: '#6366f1',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  headerLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  headerAmount: {
    color: '#fff',
    fontSize: 42,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  headerStats: {
    flexDirection: 'row',
    marginTop: 12,
  },
  statItem: {
    marginRight: 24,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 2,
  },
  income: {
    color: '#4ade80',
  },
  expense: {
    color: '#f87171',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  transactionItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  incomeBg: {
    backgroundColor: '#dcfce7',
  },
  expenseBg: {
    backgroundColor: '#fee2e2',
  },
  transactionDesc: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#6366f1',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
