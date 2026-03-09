import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAppStore } from './src/stores/appStore';
import api from './src/api';

export default function App() {
  const { currentUser, users, isLoading, error, setCurrentUser, setUsers, setLoading, setError } = useAppStore();
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      let data: any;
      switch (activeTab) {
        case 'users':
          data = await api.getUsers();
          setUsers(Array.isArray(data) ? data : []);
          break;
        case 'currency':
          data = await api.getSpiritCurrencies();
          break;
        case 'relationships':
          data = await api.getRelationships();
          break;
        case 'interactions':
          data = await api.getInteractionRecords();
          break;
      }
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.retryText}>重试</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (users.length === 0) {
      return (
        <View style={styles.center}>
          <Text style={styles.emptyText}>暂无数据</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.list}>
        {users.map((user) => (
          <View key={user.id} style={styles.card}>
            <Text style={styles.cardTitle}>@{user.username}</Text>
            <Text style={styles.cardText}>{user.email}</Text>
            <Text style={styles.cardDate}>
              创建于: {new Date(user.createdAt).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🌟 灵境</Text>
        <Text style={styles.headerSubtitle}>精神货币与关系自组织</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['users', 'currency', 'relationships', 'interactions'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'users' ? '👥 用户' : 
               tab === 'currency' ? '💰 货币' : 
               tab === 'relationships' ? '🔗 关系' : '💬 互动'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {renderContent()}

      {/* Status */}
      <View style={styles.status}>
        <Text style={styles.statusText}>
          API: http://localhost:3000/api
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6366f1',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#6366f1',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
  },
  tabTextActive: {
    color: '#6366f1',
    fontWeight: '600',
  },
  list: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#6366f1',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
  status: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  statusText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
