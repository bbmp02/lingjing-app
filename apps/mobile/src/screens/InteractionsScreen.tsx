import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import api from '../api';
import { useAppStore } from '../stores/appStore';

interface Props {
  navigation: any;
}

interface InteractionRecord {
  id: string;
  interactionType: string;
  content: string;
  emotion: string;
  quantity: number;
  spiritValue: number;
  direction: string;
  createdAt: string;
}

export default function InteractionsScreen({ navigation }: Props) {
  const { currentUser } = useAppStore();
  const [records, setRecords] = useState<InteractionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [newType, setNewType] = useState('chat');
  const [newContent, setNewContent] = useState('');
  const [newEmotion, setNewEmotion] = useState('neutral');

  useEffect(() => {
    if (currentUser?.id) {
      loadRecords();
    }
  }, [currentUser]);

  const loadRecords = async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const data = await api.getInteractionRecords();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      Alert.alert('错误', '加载记录失败');
    } finally {
      setLoading(false);
    }
  };

  const addRecord = async () => {
    if (!currentUser?.id) {
      Alert.alert('提示', '请先登录');
      return;
    }
    if (!newContent.trim()) {
      Alert.alert('提示', '请输入内容');
      return;
    }
    try {
      await api.createInteractionRecord({
        userId: currentUser.id,
        targetUserId: currentUser.id, // 暂时用自己测试
        interactionType: newType,
        content: newContent,
        emotion: newEmotion,
      });
      Alert.alert('成功', '添加成功');
      setNewContent('');
      loadRecords();
    } catch (err) {
      Alert.alert('错误', '添加失败');
    }
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojis: Record<string, string> = {
      happy: '😊', sad: '😢', angry: '😠', neutral: '😐',
      excited: '🎉', worried: '😟', grateful: '🙏', excited: '🤩'
    };
    return emojis[emotion] || '😐';
  };

  const renderItem = ({ item }: { item: InteractionRecord }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.interactionType}</Text>
        <Text style={styles.emoji}>{getEmotionEmoji(item.emotion)}</Text>
      </View>
      <Text style={styles.cardText}>{item.content}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardText}>价值: {item.spiritValue}</Text>
        <Text style={styles.cardText}>数量: {item.quantity}</Text>
        <Text style={styles.cardText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>互动记录</Text>
      
      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          placeholder="互动内容..."
          value={newContent}
          onChangeText={setNewContent}
          multiline
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputShort}
            placeholder="类型 (chat/gift/help)"
            value={newType}
            onChangeText={setNewType}
          />
          <TextInput
            style={styles.inputShort}
            placeholder="情绪 (happy/sad)"
            value={newEmotion}
            onChangeText={setNewEmotion}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={addRecord}>
          <Text style={styles.buttonText}>记录互动</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={loadRecords}
        ListEmptyComponent={<Text style={styles.empty}>暂无记录</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  inputSection: { marginBottom: 16 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8, minHeight: 60 },
  inputRow: { flexDirection: 'row', marginBottom: 8 },
  inputShort: { flex: 1, backgroundColor: '#fff', padding: 10, borderRadius: 8, marginRight: 8 },
  button: { backgroundColor: '#6366f1', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', textTransform: 'capitalize' },
  emoji: { fontSize: 20 },
  cardText: { fontSize: 14, color: '#666', marginBottom: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
});
