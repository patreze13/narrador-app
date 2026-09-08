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

const sumulaInicial = {
  partida: "Real Madrid vs Inter de Milão",
  horario: "16:00 (Brasília) • Santiago Bernabéu",
  titulares: [
    // Real Madrid (4-3-3)
    { id: 101, team: 'RMA', num: 1, pos: 'GOL', name: 'Thibaut Courtois', gols: 0, jogos: 6, amarelos: 0, ex: 'Chelsea, Atlético de Madrid' },
    { id: 102, team: 'RMA', num: 24, pos: 'LAT', name: 'Denzel Dumfries', gols: 2, jogos: 8, amarelos: 1, ex: 'Inter de Milão, PSV' },
    { id: 103, team: 'RMA', num: 16, pos: 'ZAG', name: 'Ibrahima Konaté', gols: 1, jogos: 7, amarelos: 1, ex: 'Liverpool, RB Leipzig' },
    { id: 104, team: 'RMA', num: 4, pos: 'ZAG', name: 'Dean Huijsen', gols: 1, jogos: 5, amarelos: 2, ex: 'Roma, Juventus' },
    { id: 105, team: 'RMA', num: 17, pos: 'LAT', name: 'Marc Cucurella', gols: 0, jogos: 6, amarelos: 0, ex: 'Chelsea, Brighton' },
    { id: 106, team: 'RMA', num: 12, pos: 'VOL', name: 'T. Alexander-Arnold', gols: 3, jogos: 9, amarelos: 1, ex: 'Liverpool' },
    { id: 107, team: 'RMA', num: 8, pos: 'MEI', name: 'Federico Valverde', gols: 4, jogos: 8, amarelos: 0, ex: 'Peñarol, Dep. La Coruña' },
    { id: 108, team: 'RMA', num: 5, pos: 'MEI', name: 'Jude Bellingham', gols: 6, jogos: 8, amarelos: 2, ex: 'Borussia Dortmund, Birmingham' },
    { id: 109, team: 'RMA', num: 21, pos: 'ATA', name: 'Brahim Díaz', gols: 3, jogos: 7, amarelos: 0, ex: 'Milan, Man. City' },
    { id: 110, team: 'RMA', num: 10, pos: 'ATA', name: 'Kylian Mbappé', gols: 11, jogos: 9, amarelos: 1, ex: 'Paris Saint-Germain, Monaco' },
    { id: 111, team: 'RMA', num: 7, pos: 'ATA', name: 'Vinicius Júnior', gols: 9, jogos: 8, amarelos: 2, ex: 'Flamengo' },

    // Inter de Milão (3-5-2)
    { id: 201, team: 'INT', num: 1, pos: 'GOL', name: 'Josep Martínez', gols: 0, jogos: 5, amarelos: 0, ex: 'Genoa, RB Leipzig' },
    { id: 202, team: 'INT', num: 28, pos: 'ZAG', name: 'Benjamin Pavard', gols: 1, jogos: 7, amarelos: 1, ex: 'Bayern de Munique, Lille' },
    { id: 203, team: 'INT', num: 31, pos: 'ZAG', name: 'Yann Bisseck', gols: 2, jogos: 6, amarelos: 1, ex: 'Aarhus, Köln' },
    { id: 204, team: 'INT', num: 95, pos: 'ZAG', name: 'Alessandro Bastoni', gols: 1, jogos: 8, amarelos: 2, ex: 'Atalanta, Parma' },
    { id: 205, team: 'INT', num: 17, pos: 'ALA', name: 'Andy Diouf', gols: 2, jogos: 7, amarelos: 0, ex: 'Lens, Rennes' },
    { id: 206, team: 'INT', num: 23, pos: 'MEI', name: 'Nicolò Barella', gols: 3, jogos: 8, amarelos: 2, ex: 'Cagliari, Como' },
    { id: 207, team: 'INT', num: 20, pos: 'VOL', name: 'Hakan Çalhanoğlu', gols: 5, jogos: 8, amarelos: 1, ex: 'Milan, Leverkusen' },
    { id: 208, team: 'INT', num: 21, pos: 'MEI', name: 'Curtis Jones', gols: 2, jogos: 6, amarelos: 0, ex: 'Liverpool' },
    { id: 209, team: 'INT', num: 30, pos: 'ALA', name: 'Carlos Augusto', gols: 1, jogos: 7, amarelos: 1, ex: 'Monza, Corinthians' },
    { id: 210, team: 'INT', num: 10, pos: 'ATA', name: 'Lautaro Martínez', gols: 8, jogos: 8, amarelos: 1, ex: 'Racing Club' },
    { id: 211, team: 'INT', num: 9, pos: 'ATA', name: 'Marcus Thuram', gols: 7, jogos: 8, amarelos: 0, ex: 'B. Mönchengladbach, Guingamp' }
  ],
  reservas: [
    // Banco Real Madrid
    { id: 112, team: 'RMA', num: 9, pos: 'ATA', name: 'Endrick', gols: 4, jogos: 6, amarelos: 0, ex: 'Palmeiras' },
    { id: 113, team: 'RMA', num: 13, pos: 'GOL', name: 'Andriy Lunin', gols: 0, jogos: 3, amarelos: 0, ex: 'Zorya Luhansk, Leganés' },
    { id: 114, team: 'RMA', num: 14, pos: 'MEI', name: 'A. Tchouaméni', gols: 1, jogos: 7, amarelos: 1, ex: 'Monaco, Bordeaux' },
    { id: 115, team: 'RMA', num: 18, pos: 'LAT', name: 'Álvaro Carreras', gols: 0, jogos: 4, amarelos: 0, ex: 'Benfica, Granada' },
    { id: 116, team: 'RMA', num: 22, pos: 'ZAG', name: 'Antonio Rüdiger', gols: 1, jogos: 6, amarelos: 2, ex: 'Chelsea, Roma' },

    // Banco Inter
    { id: 212, team: 'INT', num: 6, pos: 'ZAG', name: 'John Stones', gols: 1, jogos: 5, amarelos: 0, ex: 'Manchester City, Everton' },
    { id: 213, team: 'INT', num: 7, pos: 'MEI', name: 'Piotr Zieliński', gols: 2, jogos: 7, amarelos: 1, ex: 'Napoli, Udinese' },
    { id: 214, team: 'INT', num: 11, pos: 'ATA', name: 'Luis Henrique', gols: 3, jogos: 6, amarelos: 0, ex: 'Marseille, Botafogo' },
    { id: 215, team: 'INT', num: 25, pos: 'ZAG', name: 'Manuel Akanji', gols: 0, jogos: 6, amarelos: 1, ex: 'Man City, Dortmund' },
    { id: 216, team: 'INT', num: 94, pos: 'ATA', name: 'Pio Esposito', gols: 2, jogos: 4, amarelos: 0, ex: 'Spezia, Base' }
  ]
};

export default function App() {
  const [titulares, setTitulares] = useState(sumulaInicial.titulares);
  const [reservas, setReservas] = useState(sumulaInicial.reservas);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [substituindo, setSubstituindo] = useState(null);

  function handleSelectPlayer(player, isTitular) {
    if (substituindo) {
      if (!isTitular) {
        // Substitui apenas se for do mesmo time
        if (player.team !== substituindo.team) {
          alert('Substituição permitida apenas entre jogadores da mesma equipe!');
          setSubstituindo(null);
          return;
        }
        setTitulares(titulares.map(t => t.id === substituindo.id ? player : t));
        setReservas(reservas.map(r => r.id === player.id ? substituindo : r));
        setSubstituindo(null);
      } else {
        setSubstituindo(null);
      }
      return;
    }
    setSelectedPlayer(player);
  }

  const titularesRMA = titulares.filter(p => p.team === 'RMA');
  const titularesINT = titulares.filter(p => p.team === 'INT');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Placar e Torneio */}
      <View style={styles.header}>
        <Text style={styles.torneio}>🏆 UEFA CHAMPIONS LEAGUE</Text>
        <Text style={styles.placar}>REAL MADRID  0 x 0  INTER DE MILÃO</Text>
        <Text style={styles.tempo}>⏱️ {sumulaInicial.horario}</Text>
      </View>

      {substituindo && (
        <View style={styles.alertaSub}>
          <Text style={styles.alertaSubTexto}>
            🔄 Substituindo {substituindo.name}: Toque em um reserva do mesmo time abaixo!
          </Text>
        </View>
      )}

      {/* Campinho Dividido: RMA à esquerda, INT à direita */}
      <ScrollView style={styles.scrollArea}>
        <Text style={styles.sectionHeader}>TITULARES (Toque: Ficha | Segure: Substituir)</Text>
        
        <View style={styles.timesContainer}>
          {/* Coluna Real Madrid */}
          <View style={styles.colunaTime}>
            <Text style={styles.timeTitulo}>REAL MADRID (4-3-3)</Text>
            {titularesRMA.map((p) => {
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
                  <Text style={styles.playerNum}>#{p.num} • {p.pos}</Text>
                  <Text style={styles.playerName} numberOfLines={1}>{p.name}</Text>
                  {isPendurado && <Text style={styles.tagAlerta}>⚠️ PENDURADO</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Coluna Inter de Milão */}
          <View style={styles.colunaTime}>
            <Text style={styles.timeTitulo}>INTER (3-5-2)</Text>
            {titularesINT.map((p) => {
              const isPendurado = p.amarelos === 2;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.playerCard,
                    styles.playerCardInter,
                    substituindo?.id === p.id && styles.playerCardSub,
                    isPendurado && styles.playerCardPendurado
                  ]}
                  onPress={() => handleSelectPlayer(p, true)}
                  onLongPress={() => setSubstituindo(p)}
                >
                  <Text style={styles.playerNumInter}>#{p.num} • {p.pos}</Text>
                  <Text style={styles.playerName} numberOfLines={1}>{p.name}</Text>
                  {isPendurado && <Text style={styles.tagAlerta}>⚠️ PENDURADO</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Banco de Reservas */}
      <View style={styles.reservasSection}>
        <Text style={styles.reservasHeader}>BANCO DE RESERVAS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reservasRow}>
          {reservas.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[
                styles.reservaCard,
                p.team === 'INT' && styles.reservaCardInter,
                substituindo && styles.reservaDestacado
              ]}
              onPress={() => handleSelectPlayer(p, false)}
            >
              <Text style={styles.reservaNum}>[{p.team}] #{p.num} {p.pos}</Text>
              <Text style={styles.reservaName} numberOfLines={1}>{p.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Modal Ficha do Jogador para Narração */}
      <Modal visible={!!selectedPlayer} transparent animationType="slide">
        <View style={styles.modalFundo}>
          <View style={styles.modalBox}>
            {selectedPlayer && (
              <>
                <Text style={styles.modalNome}>#{selectedPlayer.num} {selectedPlayer.name.toUpperCase()}</Text>
                <Text style={styles.modalPosicao}>{selectedPlayer.team === 'RMA' ? 'Real Madrid' : 'Inter de Milão'} • {selectedPlayer.pos}</Text>

                <View style={styles.modalLinha} />

                <Text style={styles.modalDado}>⚽ Temporada: <Text style={styles.modalBold}>{selectedPlayer.gols} gols em {selectedPlayer.jogos} jogos</Text></Text>
                <Text style={styles.modalDado}>
                  🟨 Cartões na Champions: <Text style={styles.modalBold}>{selectedPlayer.amarelos} {selectedPlayer.amarelos === 2 ? '(⚠️ PENDURADO)' : ''}</Text>
                </Text>
                <Text style={styles.modalDado}>🔄 Passagens: <Text style={styles.modalBold}>Ex-{selectedPlayer.ex}</Text></Text>

                <TouchableOpacity 
                  style={styles.btnFechar} 
                  onPress={() => setSelectedPlayer(null)}
                >
                  <Text style={styles.btnFecharTexto}>Voltar à Transmissão</Text>
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
  header: { padding: 10, backgroundColor: '#1e293b', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#334155' },
  torneio: { color: '#38bdf8', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  placar: { color: '#fff', fontSize: 17, fontWeight: 'bold', marginTop: 2 },
  tempo: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  alertaSub: { backgroundColor: '#f59e0b', padding: 8, alignItems: 'center' },
  alertaSubTexto: { color: '#000', fontWeight: 'bold', fontSize: 12 },
  scrollArea: { flex: 1, paddingHorizontal: 8 },
  sectionHeader: { color: '#64748b', fontSize: 11, fontWeight: 'bold', marginVertical: 6, textAlign: 'center' },
  timesContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  colunaTime: { width: '48.5%' },
  timeTitulo: { color: '#e2e8f0', fontSize: 12, fontWeight: 'bold', marginBottom: 6, textAlign: 'center' },
  playerCard: {
    backgroundColor: '#1e293b',
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#334155'
  },
  playerCardInter: { backgroundColor: '#111e38', borderColor: '#1e3a8a' },
  playerCardSub: { borderColor: '#f59e0b', backgroundColor: '#451a03' },
  playerCardPendurado: { borderColor: '#eab308' },
  playerNum: { color: '#38bdf8', fontSize: 10, fontWeight: 'bold' },
  playerNumInter: { color: '#60a5fa', fontSize: 10, fontWeight: 'bold' },
  playerName: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginTop: 1 },
  tagAlerta: { color: '#eab308', fontSize: 9, fontWeight: 'bold', marginTop: 2 },
  reservasSection: { height: 95, backgroundColor: '#0f172a', padding: 8, borderTopWidth: 1, borderTopColor: '#1e293b' },
  reservasHeader: { color: '#64748b', fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
  reservasRow: { flexDirection: 'row', alignItems: 'center' },
  reservaCard: {
    backgroundColor: '#1e293b',
    padding: 6,
    borderRadius: 6,
    marginRight: 6,
    width: 105,
    borderWidth: 1,
    borderColor: '#334155'
  },
  reservaCardInter: { backgroundColor: '#111e38', borderColor: '#1e3a8a' },
  reservaDestacado: { borderColor: '#10b981' },
  reservaNum: { color: '#94a3b8', fontSize: 9 },
  reservaName: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  modalFundo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: '85%', backgroundColor: '#1e293b', borderRadius: 12, padding: 18, borderWidth: 1, borderColor: '#38bdf8' },
  modalNome: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalPosicao: { color: '#94a3b8', fontSize: 13, marginTop: 2 },
  modalLinha: { height: 1, backgroundColor: '#334155', marginVertical: 10 },
  modalDado: { color: '#cbd5e1', fontSize: 13, marginBottom: 6 },
  modalBold: { color: '#fff', fontWeight: 'bold' },
  btnFechar: { backgroundColor: '#38bdf8', padding: 10, borderRadius: 8, marginTop: 12, alignItems: 'center' },
  btnFecharTexto: { color: '#000', fontWeight: 'bold', fontSize: 13 }
});
