import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';

const API_KEY = '5698610421c143d64ca493a63172fe3e'; // Insira sua chave API-Sports

export default function App() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [substituindo, setSubstituindo] = useState(null);

  // Exemplo de escalação inicial
  const [titulares, setTitulares] = useState([
    { id: 1, name: 'Lucas Arcanjo', pos: 'GOL', num: 1, gols: 0, jogos: 22, amarelos: 1, ex: 'Base' },
    { id: 2, name: 'Willean Lepo', pos: 'LAT', num: 98, gols: 1, jogos: 20, amarelos: 2, ex: 'Novorizontino' },
    { id: 3, name: 'Wagner Leonardo', pos: 'ZAG', num: 3, gols: 4, jogos: 24, amarelos: 3, ex: 'Santos, Portimonense' },
    { id: 4, name: 'Nerís', pos: 'ZAG', num: 4, gols: 0, jogos: 15, amarelos: 1, ex: 'Cruzeiro, Santa Cruz' },
    { id: 5, name: 'Lucas Esteves', pos: 'LAT', num: 16, gols: 1, jogos: 21, amarelos: 2, ex: 'Palmeiras, Colorado Rapids' },
    { id: 6, name: 'Luan Santos', pos: 'VOL', num: 5, gols: 0, jogos: 18, amarelos: 1, ex: 'São Paulo' },
    { id: 7, name: 'Willian Oliveira', pos: 'VOL', num: 29, gols: 5, jogos: 23, amarelos: 2, ex: 'Cruzeiro, Ceará' },
    { id: 8, name: 'Matheuzinho', pos: 'MEI', num: 30, gols: 3, jogos: 22, amarelos: 0, ex: 'Ypiranga' },
    { id: 9, name: 'Gustavo Mosquito', pos: 'ATA', num: 7, gols: 2, jogos: 12, amarelos: 0, ex: 'Corinthians, Paraná' },
    { id: 10, name: 'Alerrandro', pos: 'ATA', num: 9, gols: 8, jogos: 24, amarelos: 2, ex: 'Atlético-MG, Bragantino' },
    { id: 11, name: 'Carlos Eduardo', pos: 'ATA', num: 25, gols: 1, jogos: 10, amarelos: 0, ex: 'Palmeiras, Athletico' }
  ]);

  const [reservas, setReservas] = useState([
    { id: 12, name: 'Muriel', pos: 'GOL', num: 22, gols: 0, jogos: 2, amarelos: 0, ex: 'Fluminense, Internacional' },
    { id: 13, name: 'Zé Hugo', pos: 'ATA', num: 17, gols: 2, jogos: 16, amarelos: 1, ex: 'Azuriz' },
    { id: 14, name: 'Janderson', pos: 'ATA', num: 39, gols: 3, jogos: 14, amarelos: 1, ex: 'Botafogo' },
    { id: 15, name: 'Jean Mota', pos: 'MEI', num: 10, gols: 1, jogos: 11, amarelos: 0, ex: 'Inter Miami, Santos' },
    { id: 16, name: 'Machado', pos: 'VOL', num: 20, gols: 1, jogos: 13, amarelos: 2, ex: 'Cruzeiro, Grêmio' }
  ]);

  // Lógica de substituição manual instantânea
  function handleSelectPlayer(player, isTitular) {
    if (substituindo) {
      if (!isTitular) {
        // Realiza a troca entre quem estava marcado e o reserva clicado
        const novoTitulares = titulares.map(t => t.id === substituindo.id ? player : t);
        const novosReservas = reservas.map(r => r.id === player.id ? substituindo : r);
        setTitulares(novoTitulares);
        setReservas(novosReservas);
        setSubstituindo(null);
      } else {
        setSubstituindo(null);
      }
      return;
    }
    setSelectedPlayer(player);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Barra de Placar e Status */}
      <View style={styles.header}>
        <Text style={styles.placar}>VITÓRIA  1 x 0  ADVERSÁRIO</Text>
        <Text style={styles.tempo}>⏱️ 62' | 2º Tempo</Text>
      </View>

      {substituindo && (
        <View style={styles.alertaSub}>
          <Text style={styles.alertaSubTexto}>
            🔄 Substituindo {substituindo.name}: Toque em um reserva abaixo para entrar!
          </Text>
        </View>
      )}

      {/* Titulares em Campo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TITULARES EM CAMPO (Toque para ver ficha / Segure para substituir)</Text>
        <ScrollView contentContainerStyle={styles.grid}>
          {titulares.map((p) => {
            const isPendurado = p.amarelos === 2;
            return (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.playerCard,
                  substituindo?.id === p.id && styles.playerCardSub,
                  isPendurado && styles.playerCardPendurado
                ]}
                onPress={() => handleSelectPlayer(p, true)}
                onLongPress={() => setSubstituindo(p)}
              >
                <Text style={styles.playerNum}>#{p.num} {p.pos}</Text>
                <Text style={styles.playerName} numberOfLines={1}>{p.name}</Text>
                {isPendurado && <Text style={styles.tagAlerta}>⚠️ PENDURADO</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Banco de Reservas */}
      <View style={styles.reservasSection}>
        <Text style={styles.sectionTitle}>BANCO DE RESERVAS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reservasContainer}>
          {reservas.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.reservaCard, substituindo && styles.reservaDestacado]}
              onPress={() => handleSelectPlayer(p, false)}
            >
              <Text style={styles.reservaNum}>#{p.num} {p.pos}</Text>
              <Text style={styles.reservaName}>{p.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Modal Ficha do Jogador para Leitura Rápida */}
      <Modal visible={!!selectedPlayer} transparent animationType="slide">
        <View style={styles.modalFundo}>
          <View style={styles.modalBox}>
            {selectedPlayer && (
              <>
                <Text style={styles.modalNome}>#{selectedPlayer.num} {selectedPlayer.name.toUpperCase()}</Text>
                <Text style={styles.modalPosicao}>Posição: {selectedPlayer.pos}</Text>
                
                <View style={styles.modalLinha} />
                
                <Text style={styles.modalDado}>⚽ Gols na temporada: <Text style={styles.modalBold}>{selectedPlayer.gols} gols em {selectedPlayer.jogos} jogos</Text></Text>
                <Text style={styles.modalDado}>🟨 Cartões amarelos: <Text style={styles.modalBold}>{selectedPlayer.amarelos} {selectedPlayer.amarelos === 2 ? '(⚠️ PENDURADO)' : ''}</Text></Text>
                <Text style={styles.modalDado}>🔄 Clubes anteriores: <Text style={styles.modalBold}>Ex-{selectedPlayer.ex}</Text></Text>

                <TouchableOpacity 
                  style={styles.btnFechar} 
                  onPress={() => setSelectedPlayer(null)}
                >
                  <Text style={styles.btnFecharTexto}>Voltar ao Jogo</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  header: { padding: 12, backgroundColor: '#1e293b', alignItems: 'center' },
  placar: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  tempo: { color: '#38bdf8', fontSize: 13, marginTop: 3 },
  alertaSub: { backgroundColor: '#f59e0b', padding: 8, alignItems: 'center' },
  alertaSubTexto: { color: '#000', fontWeight: 'bold', fontSize: 12 },
  section: { flex: 1, padding: 10 },
  sectionTitle: { color: '#94a3b8', fontSize: 11, fontWeight: 'bold', marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  playerCard: {
    width: '31%',
    backgroundColor: '#1e293b',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155'
  },
  playerCardSub: { borderColor: '#f59e0b', backgroundColor: '#332709' },
  playerCardPendurado: { borderColor: '#eab308' },
  playerNum: { color: '#38bdf8', fontSize: 11, fontWeight: 'bold' },
  playerName: { color: '#fff', fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  tagAlerta: { color: '#eab308', fontSize: 9, fontWeight: 'bold', marginTop: 4 },
  reservasSection: { height: 95, backgroundColor: '#0f172a', padding: 10, borderTopWidth: 1, borderTopColor: '#1e293b' },
  reservasContainer: { flexDirection: 'row', alignItems: 'center' },
  reservaCard: {
    backgroundColor: '#1e293b',
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
    minWidth: 90,
    alignItems: 'center'
  },
  reservaDestacado: { borderColor: '#10b981', borderWidth: 1 },
  reservaNum: { color: '#94a3b8', fontSize: 10 },
  reservaName: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  modalFundo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: '85%', backgroundColor: '#1e293b', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#38bdf8' },
  modalNome: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalPosicao: { color: '#94a3b8', fontSize: 13, marginTop: 2 },
  modalLinha: { height: 1, backgroundColor: '#334155', marginVertical: 12 },
  modalDado: { color: '#cbd5e1', fontSize: 14, marginBottom: 8 },
  modalBold: { color: '#fff', fontWeight: 'bold' },
  btnFechar: { backgroundColor: '#38bdf8', padding: 12, borderRadius: 8, marginTop: 15, alignItems: 'center' },
  btnFecharTexto: { color: '#000', fontWeight: 'bold', fontSize: 14 }
});
