import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import api from '../api';
import { useAppStore } from '../stores/appStore';

interface Props {
  navigation: any;
}

interface Relationship {
  id: string;
  targetUserId: string;
  relationshipType: string;
  relationshipStrength: number;
  trustScore: number;
  cooperationScore: number;
  interactionCount: number;
}

export default function RelationshipsScreen({ navigation }: Props) {
  const { currentUser } = useAppStore();
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(false);
  const [newType, setNewType] = useState('friend');
  const [newAffinity, setNewAffinity] = useState('50');

  useEffect(() => {
    if (currentUser?.id) {
      loadRelationships();
    }
  }, [currentUser]);

  const loadRelationships = async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const data = await api.getRelationships();
      setRelationships(Array.isArray(data) ? data : []);
    } catch (err) {
      Alert.alert('错误', '加载关系失败');
    } finally {
      setLoading(false);
    }
  };

  const addRelationship = async () => {
    if (!currentUser?.id) {
      Alert.alert('提示', '请先登录');
      return;
    }
    try {
      await api.createRelationship({
        userId: currentUser.id,
        targetUserId: currentUser.id, // 暂时用自己测试
        relationshipType: newType,
        affinity: parseInt(newAffinity),
      });
      Alert.alert('成功', '添加关系成功');
      loadRelationships();
    } catch (err) {
      Alert.alert('错误', '添加关系失败');
    }
  };

  const renderItem = ({ item }: { item: Relationship }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>类型: {item.relationshipType}</Text>
      <Text style={styles.cardText}>亲密度: {item.relationshipStrength}</Text>
      <Text style={styles.cardText}>信任度: {item.trustScore}</Text>
      <Text style={styles.cardText}>互动次数: {item.interactionCount}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>关系图谱</Text>
      
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="关系类型 (friend/colleague/family)"
          value={newType}
          onChangeText={setNewType}
        />
        <TextInput
          style={styles.inputShort}
          placeholder="亲密度"
          value={newAffinity}
          onChangeText={setNewAffinity}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={addRelationship}>
          <Text style={styles.buttonText}>添加</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={relationships}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={loadRelationships}
        ListEmptyComponent={<Text style={styles.empty}>暂无关系</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  inputRow: { flexDirection: 'row', marginBottom: 16 },
  input: { flex: 1, backgroundColor: '#fff', padding: 10, borderRadius: 8, marginRight: 8 },
  inputShort: { width: 80, backgroundColor: '#fff', padding: 10, borderRadius: 8, marginRight: 8 },
  button: { backgroundColor: '#6366f1', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#666', marginBottom: 4 },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
});
