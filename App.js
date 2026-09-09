import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  StatusBar,
  Dimensions,
  FlatList
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Dados do confronto para teste estético
const jogoDados = {
  torneio: "BRASILEIRÃO SÉRIE A • 20ª RODADA",
  placar: "ATLÉTICO-MG  1 x 0  GRÊMIO",
  tempo: "⏱️ 38' 1º Tempo • Arena MRV",
  notificacaoGol: "⚽ GOL DO GALO! Cassierra (34') - Passe de Scarpa! Galo assume temporariamente a 7ª posição.",
  times: {
    mandante: {
      id: "CAM",
      nome: "ATLÉTICO-MG",
      alcunha: "Galo Forte Vingador",
      posicao: "9º Lugar (7V - 6E - 6D)",
      pontos: "27 pts",
      saldo: "+3 (24 GP / 21 GC)",
      forma: ["🟢", "🔴", "🟢", "⚪", "🟢"],
      formacao: "4-3-3",
      tecnico: "Gabriel Milito",
      corPrimaria: "#f8fafc", // Branco/Cinza claro
      corBorda: "#e2e8f0",
      corFundoCard: "#18181b",
      titulares: [
        { id: 1, num: 22, pos: "GOL", name: "Everson", gols: 0, assist: 0, amarelos: 0, ex: "Santos, Ceará" },
        { id: 2, num: 26, pos: "LAT", name: "Renzo Saravia", gols: 0, assist: 1, amarelos: 1, ex: "Botafogo, Racing" },
        { id: 3, num: 3, pos: "ZAG", name: "Bruno Fuchs", gols: 0, assist: 0, amarelos: 2, ex: "CSKA Moscou, Internacional" },
        { id: 4, num: 21, pos: "ZAG", name: "Rodrigo Battaglia", gols: 2, assist: 0, amarelos: 1, ex: "Mallorca, Sporting" },
        { id: 5, num: 13, pos: "LAT", name: "Guilherme Arana", gols: 2, assist: 4, amarelos: 2, ex: "Sevilla, Corinthians" },
        { id: 6, num: 23, pos: "VOL", name: "Alan Franco", gols: 0, assist: 2, amarelos: 1, ex: "Talleres, Charlotte FC" },
        { id: 7, num: 8, pos: "VOL", name: "Otávio", gols: 0, assist: 0, amarelos: 0, ex: "Bordeaux, Athletico" },
        { id: 8, num: 6, pos: "MEI", name: "Gustavo Scarpa", gols: 5, assist: 6, amarelos: 1, ex: "Nottingham Forest, Palmeiras", temAssist: true },
        { id: 9, num: 10, pos: "ATA", name: "Paulinho", gols: 7, assist: 3, amarelos: 0, ex: "Bayer Leverkusen, Vasco" },
        { id: 10, num: 9, pos: "ATA", name: "Mateo Cassierra", gols: 8, assist: 2, amarelos: 0, ex: "Zenit, Racing, D. Cali", fezGol: true, golMinuto: "34'" },
        { id: 11, num: 7, pos: "ATA", name: "Hulk", gols: 10, assist: 5, amarelos: 1, ex: "Shanghai SIPG, Porto, Zenit" }
      ],
      reservas: [
        { id: 12, num: 31, pos: "GOL", name: "Matheus Mendes", gols: 0, assist: 0, amarelos: 0, ex: "CSA, Base" },
        { id: 13, num: 16, pos: "ZAG", name: "Igor Rabello", gols: 0, assist: 0, amarelos: 0, ex: "Botafogo, Náutico" },
        { id: 14, num: 44, pos: "LAT", name: "Rubens", gols: 1, assist: 1, amarelos: 1, ex: "Base" },
        { id: 15, num: 17, pos: "MEI", name: "Igor Gomes", gols: 2, assist: 1, amarelos: 0, ex: "São Paulo" },
        { id: 16, num: 11, pos: "ATA", name: "Eduardo Vargas", gols: 3, assist: 1, amarelos: 0, ex: "Tigres, Hoffenheim, Napoli" },
        { id: 17, num: 30, pos: "ATA", name: "Brahian Palacios", gols: 1, assist: 0, amarelos: 0, ex: "Atlético Nacional" }
      ]
    },
    visitante: {
      id: "GRE",
      nome: "GRÊMIO",
      alcunha: "Imortal Tricolor",
      posicao: "6º Lugar (9V - 4E - 6D)",
      pontos: "31 pts",
      saldo: "+5 (26 GP / 21 GC)",
      forma: ["🟢", "🟢", "⚪", "🔴", "🟢"],
      formacao: "4-2-3-1",
      tecnico: "Renato Portaluppi",
      corPrimaria: "#38bdf8", // Azul Celeste
      corBorda: "#0284c7",
      corFundoCard: "#082f49",
      titulares: [
        { id: 101, num: 1, pos: "GOL", name: "Agustín Marchesín", gols: 0, assist: 0, amarelos: 1, ex: "Celta de Vigo, Porto, América-MEX" },
        { id: 102, num: 18, pos: "LAT", name: "João Pedro", gols: 1, assist: 2, amarelos: 2, ex: "Porto, Corinthians, Bahia" },
        { id: 103, num: 5, pos: "ZAG", name: "Rodrigo Ely", gols: 1, assist: 0, amarelos: 1, ex: "Almería, Alavés, Milan" },
        { id: 104, num: 4, pos: "ZAG", name: "Walter Kannemann", gols: 0, assist: 0, amarelos: 2, ex: "San Lorenzo, Atlas" },
        { id: 105, num: 6, pos: "LAT", name: "Reinaldo", gols: 3, assist: 3, amarelos: 2, ex: "São Paulo, Chapecoense" },
        { id: 106, num: 20, pos: "VOL", name: "Mathías Villasanti", gols: 1, assist: 2, amarelos: 1, ex: "Cerro Porteño" },
        { id: 107, num: 17, pos: "VOL", name: "Dodi", gols: 0, assist: 1, amarelos: 2, ex: "Santos, Kashiwa Reysol, Fluminense" },
        { id: 108, num: 7, pos: "MEI", name: "Yeferson Soteldo", gols: 4, assist: 4, amarelos: 0, ex: "Santos, Tigres, Toronto FC" },
        { id: 109, num: 10, pos: "MEI", name: "Franco Cristaldo", gols: 6, assist: 5, amarelos: 1, ex: "Huracán, Boca Juniors" },
        { id: 110, num: 11, pos: "ATA", name: "Cristian Pavón", gols: 3, assist: 3, amarelos: 0, ex: "Atlético-MG, Boca Juniors, LA Galaxy" },
        { id: 111, num: 22, pos: "ATA", name: "Martin Braithwaite", gols: 5, assist: 1, amarelos: 1, ex: "Espanyol, Barcelona, Leganés" }
      ],
      reservas: [
        { id: 112, num: 97, pos: "GOL", name: "Rafael Cabral", gols: 0, assist: 0, amarelos: 0, ex: "Cruzeiro, Reading, Santos" },
        { id: 113, num: 3, pos: "ZAG", name: "Pedro Geromel", gols: 0, assist: 0, amarelos: 0, ex: "Mallorca, Köln, Vitória de Guimarães" },
        { id: 114, num: 26, pos: "LAT", name: "Mayk", gols: 0, assist: 0, amarelos: 0, ex: "Guarani, Joinville" },
        { id: 115, num: 14, pos: "MEI", name: "Nathan Pescador", gols: 0, assist: 0, amarelos: 0, ex: "Fluminense, Atlético-MG, Chelsea" },
        { id: 116, num: 9, pos: "ATA", name: "Diego Costa", gols: 4, assist: 1, amarelos: 1, ex: "Botafogo, Wolves, Atlético de Madrid" },
        { id: 117, num: 77, pos: "ATA", name: "André Henrique", gols: 1, assist: 0, amarelos: 0, ex: "Hercílio Luz" }
      ]
    }
  }
};

export default function App() {
  const [tabAtiva, setTabAtiva] = useState(0); // 0 = Mandante (CAM), 1 = Visitante (GRE)
  const [titularesCAM, setTitularesCAM] = useState(jogoDados.times.mandante.titulares);
  const [reservasCAM, setReservasCAM] = useState(jogoDados.times.mandante.reservas);
  const [titularesGRE, setTitularesGRE] = useState(jogoDados.times.visitante.titulares);
  const [reservasGRE, setReservasGRE] = useState(jogoDados.times.visitante.reservas);

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [substituindo, setSubstituindo] = useState(null);

  const flatListRef = useRef(null);

  // Alterna tab pelo botão ou arrasto
  function mudarTab(index) {
    setTabAtiva(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  }

  // Substituição manual dedicada para cada equipe
  function handleSelectPlayer(player, isTitular, timeId) {
    if (substituindo) {
      if (!isTitular) {
        if (timeId === 'CAM') {
          setTitularesCAM(titularesCAM.map(t => t.id === substituindo.id ? player : t));
          setReservasCAM(reservasCAM.map(r => r.id === player.id ? substituindo : r));
        } else {
          setTitularesGRE(titularesGRE.map(t => t.id === substituindo.id ? player : t));
          setReservasGRE(reservasGRE.map(r => r.id === player.id ? substituindo : r));
        }
        setSubstituindo(null);
      } else {
        setSubstituindo(null);
      }
      return;
    }
    setSelectedPlayer({ ...player, timeId });
  }

  const renderPranchetaTime = (time, titulares, reservas) => {
    const isCAM = time.id === 'CAM';
    return (
      <View style={[styles.pageContainer, { width: SCREEN_WIDTH }]}>
        {/* Sub-header do Time (Clicável para abrir estatísticas do clube) */}
        <TouchableOpacity 
          style={[styles.teamHeaderBar, { borderColor: time.corBorda }]}
          onPress={() => setSelectedTeam(time)}
        >
          <View>
            <Text style={[styles.teamNameTitle, { color: time.corPrimaria }]}>
              🛡️ {time.nome} <Text style={styles.schemaText}>({time.formacao})</Text>
            </Text>
            <Text style={styles.coachText}>Técnico: {time.tecnico} • Toque p/ estatísticas</Text>
          </View>
          <View style={styles.badgePosicao}>
            <Text style={styles.badgePosicaoTexto}>{time.posicao.split(' ')[0]}</Text>
          </View>
        </TouchableOpacity>

        {/* 11 Titulares em Campo */}
        <ScrollView style={styles.titularesScrollView} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionDividerText}>
            TITULARES EM CAMPO (Toque: Ficha | Segure: Substituir)
          </Text>
          <View style={styles.gridTitulares}>
            {titulares.map((p) => {
              const isPendurado = p.amarelos === 2;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.cardJogador,
                    { backgroundColor: time.corFundoCard, borderColor: time.corBorda },
                    substituindo?.id === p.id && styles.cardJogadorSubstituindo,
                    isPendurado && styles.cardJogadorPendurado
                  ]}
                  onPress={() => handleSelectPlayer(p, true, time.id)}
                  onLongPress={() => setSubstituindo(p)}
                >
                  <View style={styles.cardJogadorTopo}>
                    <Text style={[styles.cardJogadorNum, { color: time.corPrimaria }]}>
                      #{p.num} • {p.pos}
                    </Text>
                    {p.fezGol && <Text style={styles.iconGoal}>⚽ {p.golMinuto}</Text>}
                    {p.temAssist && <Text style={styles.iconAssist}>👟</Text>}
                  </View>

                  <Text style={styles.cardJogadorNome} numberOfLines={1}>
                    {p.name}
                  </Text>

                  {isPendurado && (
                    <Text style={styles.badgePenduradoTexto}>⚠️ PENDURADO</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Banco de Reservas Dedicado */}
        <View style={styles.reservasFooter}>
          <Text style={styles.reservasFooterTitulo}>BANCO DE SUPLENTES ({time.nome})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reservasScroll}>
            {reservas.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.cardReserva,
                  { borderColor: time.corBorda },
                  substituindo && styles.cardReservaDestacado
                ]}
                onPress={() => handleSelectPlayer(p, false, time.id)}
              >
                <Text style={styles.cardReservaNum}>#{p.num} {p.pos}</Text>
                <Text style={styles.cardReservaNome} numberOfLines={1}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />

      {/* 1. Header Fixo: Torneio e Placar */}
      <View style={styles.headerPrincipal}>
        <Text style={styles.torneioText}>{jogoDados.torneio}</Text>
        <Text style={styles.placarText}>{jogoDados.placar}</Text>
        <Text style={styles.tempoText}>{jogoDados.tempo}</Text>
      </View>

      {/* 2. Banner de Notificação de Gol / Alerta da Rodada */}
      <View style={styles.bannerAlerta}>
        <Text style={styles.bannerAlertaTexto} numberOfLines={1}>
          {jogoDados.notificacaoGol}
        </Text>
      </View>

      {/* 3. Seletor de Tabs (Swipe) */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tabButton, tabAtiva === 0 && styles.tabButtonAtivoGalo]}
          onPress={() => mudarTab(0)}
        >
          <Text style={[styles.tabButtonTexto, tabAtiva === 0 && styles.tabTextoAtivo]}>
            ⚪ ATLÉTICO-MG
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, tabAtiva === 1 && styles.tabButtonAtivoGremio]}
          onPress={() => mudarTab(1)}
        >
          <Text style={[styles.tabButtonTexto, tabAtiva === 1 && styles.tabTextoAtivo]}>
            🔵 GRÊMIO
          </Text>
        </TouchableOpacity>
      </View>

      {substituindo && (
        <View style={styles.alertaSubstituicao}>
          <Text style={styles.alertaSubstituicaoTexto}>
            🔄 Substituindo {substituindo.name}: Toque em um reserva do banco abaixo!
          </Text>
        </View>
      )}

      {/* 4. Telas Deslizantes (Swipeable) */}
      <FlatList
        ref={flatListRef}
        data={[jogoDados.times.mandante, jogoDados.times.visitante]}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setTabAtiva(index);
        }}
        renderItem={({ item, index }) =>
          index === 0
            ? renderPranchetaTime(item, titularesCAM, reservasCAM)
            : renderPranchetaTime(item, titularesGRE, reservasGRE)
        }
      />

      {/* MODAL 1: FICHA DO JOGADOR PARA O NARRADOR */}
      <Modal visible={!!selectedPlayer} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCardBox}>
            {selectedPlayer && (
              <>
                <Text style={styles.modalJogadorNome}>
                  #{selectedPlayer.num} {selectedPlayer.name.toUpperCase()}
                </Text>
                <Text style={styles.modalJogadorTime}>
                  Posição: {selectedPlayer.pos} • {selectedPlayer.timeId === 'CAM' ? 'Atlético-MG' : 'Grêmio'}
                </Text>

                <View style={styles.modalDivisor} />

                <Text style={styles.modalLinhaInfo}>
                  ⚽ Gols no Brasileirão: <Text style={styles.modalDestaque}>{selectedPlayer.gols} gols</Text>
                </Text>
                <Text style={styles.modalLinhaInfo}>
                  🎯 Assistências: <Text style={styles.modalDestaque}>{selectedPlayer.assist}</Text>
                </Text>
                <Text style={styles.modalLinhaInfo}>
                  🟨 Cartões Amarelos: <Text style={styles.modalDestaque}>
                    {selectedPlayer.amarelos} {selectedPlayer.amarelos === 2 ? '(⚠️ PENDURADO)' : ''}
                  </Text>
                </Text>
                <Text style={styles.modalLinhaInfo}>
                  🔄 Clubes anteriores: <Text style={styles.modalDestaque}>Ex-{selectedPlayer.ex}</Text>
                </Text>

                <TouchableOpacity
                  style={styles.modalBotaoFechar}
                  onPress={() => setSelectedPlayer(null)}
                >
                  <Text style={styles.modalBotaoTexto}>Voltar à Transmissão</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* MODAL 2: ESTATÍSTICAS E TABELA DO CLUBE */}
      <Modal visible={!!selectedTeam} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCardBox, { borderColor: selectedTeam?.corPrimaria }]}>
            {selectedTeam && (
              <>
                <Text style={[styles.modalJogadorNome, { color: selectedTeam.corPrimaria }]}>
                  🛡️ {selectedTeam.nome}
                </Text>
                <Text style={styles.modalJogadorTime}>{selectedTeam.alcunha}</Text>

                <View style={styles.modalDivisor} />

                <Text style={styles.modalLinhaInfo}>
                  📊 Posição Atual: <Text style={styles.modalDestaque}>{selectedTeam.posicao}</Text>
                </Text>
                <Text style={styles.modalLinhaInfo}>
                  🏆 Pontuação: <Text style={styles.modalDestaque}>{selectedTeam.pontos}</Text>
                </Text>
                <Text style={styles.modalLinhaInfo}>
                  ⚖️ Saldo de Gols: <Text style={styles.modalDestaque}>{selectedTeam.saldo}</Text>
                </Text>
                <Text style={styles.modalLinhaInfo}>
                  📈 Forma Recente: <Text style={styles.modalDestaque}>{selectedTeam.forma.join(' ')}</Text>
                </Text>

                <TouchableOpacity
                  style={[styles.modalBotaoFechar, { backgroundColor: selectedTeam.corPrimaria }]}
                  onPress={() => setSelectedTeam(null)}
                >
                  <Text style={[styles.modalBotaoTexto, { color: '#000' }]}>Fechar Estatísticas</Text>
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
  
  // Header Geral
  headerPrincipal: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#111827',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937'
  },
  torneioText: { color: '#9ca3af', fontSize: 10, fontWeight: 'bold', letterSpacing: 1.2 },
  placarText: { color: '#ffffff', fontSize: 18, fontWeight: '900', marginVertical: 2 },
  tempoText: { color: '#38bdf8', fontSize: 11, fontWeight: '600' },

  // Alerta de Gol / Classificação
  bannerAlerta: {
    backgroundColor: '#854d0e',
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center'
  },
  bannerAlertaTexto: { color: '#fef08a', fontSize: 11, fontWeight: 'bold' },

  // Abas de Seleção (Swipe Indicator)
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937'
  },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabButtonAtivoGalo: { borderBottomWidth: 3, borderBottomColor: '#ffffff' },
  tabButtonAtivoGremio: { borderBottomWidth: 3, borderBottomColor: '#38bdf8' },
  tabButtonTexto: { color: '#6b7280', fontSize: 13, fontWeight: 'bold' },
  tabTextoAtivo: { color: '#ffffff' },

  alertaSubstituicao: { backgroundColor: '#f59e0b', padding: 8, alignItems: 'center' },
  alertaSubstituicaoTexto: { color: '#000', fontWeight: 'bold', fontSize: 11 },

  // Container de cada Time (Página de Swipe)
  pageContainer: { flex: 1, paddingHorizontal: 10, paddingTop: 8 },
  teamHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#111827',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8
  },
  teamNameTitle: { fontSize: 14, fontWeight: 'bold' },
  schemaText: { color: '#9ca3af', fontSize: 11, fontWeight: 'normal' },
  coachText: { color: '#6b7280', fontSize: 10, marginTop: 2 },
  badgePosicao: { backgroundColor: '#1f2937', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgePosicaoTexto: { color: '#f3f4f6', fontSize: 11, fontWeight: 'bold' },

  // Titulares
  titularesScrollView: { flex: 1 },
  sectionDividerText: { color: '#64748b', fontSize: 10, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  gridTitulares: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cardJogador: {
    width: '31.5%',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    minHeight: 65,
    justifyContent: 'space-between'
  },
  cardJogadorSubstituindo: { borderColor: '#f59e0b', backgroundColor: '#451a03' },
  cardJogadorPendurado: { borderColor: '#eab308' },
  cardJogadorTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardJogadorNum: { fontSize: 10, fontWeight: 'bold' },
  iconGoal: { fontSize: 10, color: '#facc15', fontWeight: 'bold' },
  iconAssist: { fontSize: 10 },
  cardJogadorNome: { color: '#ffffff', fontSize: 12, fontWeight: 'bold', marginTop: 2 },
  badgePenduradoTexto: { color: '#eab308', fontSize: 8, fontWeight: 'bold', marginTop: 2 },

  // Reservas
  reservasFooter: {
    height: 95,
    backgroundColor: '#0c1322',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    marginBottom: 5
  },
  reservasFooterTitulo: { color: '#64748b', fontSize: 10, fontWeight: 'bold', marginBottom: 6 },
  reservasScroll: { flexDirection: 'row', alignItems: 'center' },
  cardReserva: {
    backgroundColor: '#111827',
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
    width: 105,
    borderWidth: 1
  },
  cardReservaDestacado: { borderColor: '#10b981' },
  cardReservaNum: { color: '#94a3b8', fontSize: 9, fontWeight: 'bold' },
  cardReservaNome: { color: '#ffffff', fontSize: 11, fontWeight: 'bold', marginTop: 1 },

  // Modais
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modalCardBox: {
    width: '85%',
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#38bdf8'
  },
  modalJogadorNome: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  modalJogadorTime: { color: '#9ca3af', fontSize: 12, marginTop: 2 },
  modalDivisor: { height: 1, backgroundColor: '#1f2937', marginVertical: 12 },
  modalLinhaInfo: { color: '#d1d5db', fontSize: 13, marginBottom: 8 },
  modalDestaque: { color: '#ffffff', fontWeight: 'bold' },
  modalBotaoFechar: {
    backgroundColor: '#38bdf8',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center'
  },
  modalBotaoTexto: { color: '#000000', fontWeight: 'bold', fontSize: 13 }
});
