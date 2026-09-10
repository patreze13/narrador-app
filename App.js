import React, { useState, useEffect, useRef } from 'react';
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
  FlatList,
  Image,
  Platform,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 28 : 0;

// CHAVE DA SUA API
const API_KEY = '5698610421c143d64ca493a63172fe3e';
const api = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: { 'x-apisports-key': API_KEY }
});

export default function App() {
  const [loading, setLoading] = useState(false);
  const [jogos, setJogos] = useState([]);
  const [partidaSelecionada, setPartidaSelecionada] = useState(null);

  // Estados da partida em exibição
  const [mandante, setMandante] = useState(null);
  const [visitante, setVisitante] = useState(null);
  const [titularesHome, setTitularesHome] = useState([]);
  const [reservasHome, setReservasHome] = useState([]);
  const [titularesAway, setTitularesAway] = useState([]);
  const [reservasAway, setReservasAway] = useState([]);

  // Navegação e Interações
  const [tabAtiva, setTabAtiva] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [substituindo, setSubstituindo] = useState(null);
  const [gavetaAberta, setGavetaAberta] = useState(false);

  const flatListRef = useRef(null);

  useEffect(() => {
    carregarJogosMLS();
  }, []);

  // 1. Carrega as partidas de hoje (com foco nos jogos da MLS)
  async function carregarJogosMLS() {
    setLoading(true);
    try {
      const hoje = new Date().toISOString().split('T')[0];
      // Busca partidas da MLS (league 253) para hoje
      let res = await api.get('/fixtures', { params: { date: hoje, league: 253 } });
      
      // Se por fuso horário não encontrar pela liga travada, busca as partidas gerais de hoje
      if (!res.data.response || res.data.response.length === 0) {
        res = await api.get('/fixtures', { params: { date: hoje } });
      }

      setJogos(res.data.response || []);
    } catch (e) {
      console.error('Erro ao carregar jogos:', e);
    } finally {
      setLoading(false);
    }
  }

  // 2. Ao tocar no jogo, busca a escalação oficial em tempo real
  async function abrirJogo(fixtureItem) {
    setLoading(true);
    setPartidaSelecionada(fixtureItem);
    try {
      const res = await api.get('/fixtures/lineups', {
        params: { fixture: fixtureItem.fixture.id }
      });
      const lineups = res.data.response;

      if (lineups && lineups.length >= 2) {
        const homeData = lineups[0];
        const awayData = lineups[1];

        setMandante({
          id: homeData.team.id,
          nome: homeData.team.name.toUpperCase(),
          escudo: homeData.team.logo,
          formacao: homeData.formation || '4-3-3',
          tecnico: homeData.coach?.name || 'Comissão Técnica',
          corTema: '#38bdf8',
          corBorda: '#0284c7',
          corCard: '#0f172a'
        });

        setVisitante({
          id: awayData.team.id,
          nome: awayData.team.name.toUpperCase(),
          escudo: awayData.team.logo,
          formacao: awayData.formation || '4-4-2',
          tecnico: awayData.coach?.name || 'Comissão Técnica',
          corTema: '#facc15',
          corBorda: '#ca8a04',
          corCard: '#1c1917'
        });

        // Mapeia titulares da casa
        setTitularesHome(homeData.startXI.map(i => ({
          id: i.player.id,
          num: i.player.number,
          pos: i.player.pos,
          name: i.player.name,
          time: homeData.team.name
        })));
        setReservasHome(homeData.substitutes.map(i => ({
          id: i.player.id,
          num: i.player.number,
          pos: i.player.pos,
          name: i.player.name,
          time: homeData.team.name
        })));

        // Mapeia titulares do visitante
        setTitularesAway(awayData.startXI.map(i => ({
          id: i.player.id,
          num: i.player.number,
          pos: i.player.pos,
          name: i.player.name,
          time: awayData.team.name
        })));
        setReservasAway(awayData.substitutes.map(i => ({
          id: i.player.id,
          num: i.player.number,
          pos: i.player.pos,
          name: i.player.name,
          time: awayData.team.name
        })));

        setTabAtiva(0);
      } else {
        alert('A súmula oficial desta partida ainda está sendo processada pela federação. Tente em alguns instantes.');
        setPartidaSelecionada(null);
      }
    } catch (e) {
      console.error('Erro ao buscar escalações:', e);
      setPartidaSelecionada(null);
    } finally {
      setLoading(false);
    }
  }

  function mudarTab(index) {
    setTabAtiva(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  }

  function handleSelectPlayer(player, isTitular, isHome) {
    if (substituindo) {
      if (!isTitular) {
        if (isHome) {
          setTitularesHome(titularesHome.map(t => t.id === substituindo.id ? player : t));
          setReservasHome(reservasHome.map(r => r.id === player.id ? substituindo : r));
        } else {
          setTitularesAway(titularesAway.map(t => t.id === substituindo.id ? player : t));
          setReservasAway(reservasAway.map(r => r.id === player.id ? substituindo : r));
        }
        setSubstituindo(null);
        setGavetaAberta(false);
      } else {
        setSubstituindo(null);
      }
      return;
    }
    setSelectedPlayer(player);
  }

  // ==========================================
  // TELA 1: SELETOR DE JOGOS DA RODADA
  // ==========================================
  if (!partidaSelecionada || !mandante) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#090d16" translucent />
        
        <View style={styles.headerPrincipal}>
          <Text style={styles.torneioText}>🎙️ BANCADA DE TRANSMISSÃO</Text>
          <Text style={styles.placarText}>SELECIONE A PARTIDA</Text>
          <Text style={styles.tempoText}>Partidas com dados ao vivo e escalações oficiais</Text>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#38bdf8" />
            <Text style={{ color: '#94a3b8', marginTop: 12 }}>Consultando jogos da rodada...</Text>
          </View>
        ) : (
          <FlatList
            data={jogos}
            keyExtractor={item => item.fixture.id.toString()}
            contentContainerStyle={{ padding: 12 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.cardPartidaItem} onPress={() => abrirJogo(item)}>
                <View style={styles.cardPartidaHeader}>
                  <Text style={styles.cardPartidaLiga}>{item.league.name.toUpperCase()}</Text>
                  <Text style={styles.cardPartidaStatus}>
                    {item.fixture.status.short === 'NS' ? 'Não Iniciado' : item.fixture.status.long}
                  </Text>
                </View>

                <View style={styles.cardPartidaConfronto}>
                  <View style={styles.timeLinha}>
                    <Image source={{ uri: item.teams.home.logo }} style={styles.logoPartidaMini} />
                    <Text style={styles.nomeTimePartida} numberOfLines={1}>{item.teams.home.name}</Text>
                  </View>
                  <Text style={styles.placarPartidaTexto}>
                    {item.goals.home ?? 0} x {item.goals.away ?? 0}
                  </Text>
                  <View style={[styles.timeLinha, { justifyContent: 'flex-end' }]}>
                    <Text style={[styles.nomeTimePartida, { textAlign: 'right' }]} numberOfLines={1}>{item.teams.away.name}</Text>
                    <Image source={{ uri: item.teams.away.logo }} style={[styles.logoPartidaMini, { marginLeft: 8, marginRight: 0 }]} />
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <Text style={{ color: '#94a3b8' }}>Nenhuma partida encontrada para hoje.</Text>
                <TouchableOpacity style={styles.btnRecarregar} onPress={carregarJogosMLS}>
                  <Text style={{ color: '#000', fontWeight: 'bold' }}>Recarregar</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </SafeAreaView>
    );
  }

  // ==========================================
  // TELA 2: MESA DO NARRADOR COM SWIPE E GAVETA
  // ==========================================
  const timeAtual = tabAtiva === 0 ? mandante : visitante;
  const titularesAtuais = tabAtiva === 0 ? titularesHome : titularesAway;
  const reservasAtuais = tabAtiva === 0 ? reservasHome : reservasAway;

  const renderPranchetaTime = (time, titulares, isHome) => {
    return (
      <View style={[styles.pageContainer, { width: SCREEN_WIDTH }]}>
        {/* Card do Clube com Escudo Real */}
        <TouchableOpacity 
          style={[styles.teamCardHeader, { borderColor: time.corBorda }]}
          onPress={() => setSelectedTeam(time)}
          activeOpacity={0.8}
        >
          <Image source={{ uri: time.escudo }} style={styles.teamLogo} resizeMode="contain" />
          <View style={styles.teamInfoCol}>
            <Text style={[styles.teamNameTitle, { color: time.corTema }]}>
              {time.nome} <Text style={styles.schemaText}>({time.formacao})</Text>
            </Text>
            <Text style={styles.coachText}>Técnico: {time.tecnico} • Toque p/ estatísticas</Text>
          </View>
        </TouchableOpacity>

        {/* 11 Titulares em Linha Vertical */}
        <ScrollView style={styles.listaTitularesScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.listaAviso}>
            TITULARES EM CAMPO (Toque: Ficha | Segure: Substituir)
          </Text>
          {titulares.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[
                styles.linhaJogador,
                { backgroundColor: time.corCard, borderColor: time.corBorda },
                substituindo?.id === p.id && styles.linhaJogadorSubstituindo
              ]}
              onPress={() => handleSelectPlayer(p, true, isHome)}
              onLongPress={() => {
                setSubstituindo(p);
                setGavetaAberta(true);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.linhaEsquerda}>
                <View style={[styles.badgeNumero, { borderColor: time.corTema }]}>
                  <Text style={[styles.numeroTexto, { color: time.corTema }]}>#{p.num}</Text>
                </View>
                <Text style={styles.posicaoTexto}>{p.pos || 'JOG'}</Text>
                <Text style={styles.nomeTexto} numberOfLines={1}>{p.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 90 }} />
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" translucent />

      {/* Header com Botão de Voltar */}
      <View style={styles.headerPrincipal}>
        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setPartidaSelecionada(null)} style={styles.btnVoltarTopo}>
            <Text style={styles.btnVoltarTexto}>‹ Jogos</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.torneioText}>{partidaSelecionada.league.name.toUpperCase()}</Text>
            <Text style={styles.placarText}>
              {partidaSelecionada.teams.home.name} {partidaSelecionada.goals.home ?? 0} x {partidaSelecionada.goals.away ?? 0} {partidaSelecionada.teams.away.name}
            </Text>
            <Text style={styles.tempoText}>⏱️ {partidaSelecionada.fixture.status.long}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* Tabs com os Escudos */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tabButton, tabAtiva === 0 && styles.tabButtonAtivoCAM]}
          onPress={() => mudarTab(0)}
        >
          <Image source={{ uri: mandante.escudo }} style={styles.tabMiniLogo} />
          <Text style={[styles.tabButtonTexto, tabAtiva === 0 && styles.tabTextoAtivo]}>
            {mandante.nome}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, tabAtiva === 1 && styles.tabButtonAtivoGRE]}
          onPress={() => mudarTab(1)}
        >
          <Image source={{ uri: visitante.escudo }} style={styles.tabMiniLogo} />
          <Text style={[styles.tabButtonTexto, tabAtiva === 1 && styles.tabTextoAtivo]}>
            {visitante.nome}
          </Text>
        </TouchableOpacity>
      </View>

      {substituindo && (
        <View style={styles.alertaSubstituicao}>
          <Text style={styles.alertaSubstituicaoTexto}>
            🔄 Substituindo {substituindo.name}: Escolha um reserva na gaveta abaixo!
          </Text>
        </View>
      )}

      {/* Swipeable List */}
      <FlatList
        ref={flatListRef}
        data={[mandante, visitante]}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setTabAtiva(index);
        }}
        renderItem={({ item, index }) =>
          index === 0
            ? renderPranchetaTime(item, titularesHome, true)
            : renderPranchetaTime(item, titularesAway, false)
        }
      />

      {/* Gaveta de Reservas Puxável */}
      <TouchableOpacity 
        style={styles.gavetaBarraPuxador}
        onPress={() => setGavetaAberta(true)}
        activeOpacity={0.9}
      >
        <View style={styles.gavetaPuxadorHandle} />
        <View style={styles.gavetaBarraConteudo}>
          <Text style={styles.gavetaBarraTitulo}>
            💺 RESERVAS ({timeAtual.nome}) • {reservasAtuais.length} suplentes
          </Text>
          <Text style={styles.gavetaPuxarAviso}>Abrir Banco ▲</Text>
        </View>
      </TouchableOpacity>

      {/* Modal da Gaveta Aberta */}
      <Modal visible={gavetaAberta} animationType="slide" transparent>
        <View style={styles.gavetaModalOverlay}>
          <View style={styles.gavetaModalContent}>
            <View style={styles.gavetaModalHeader}>
              <View style={styles.gavetaPuxadorHandle} />
              <View style={styles.gavetaHeaderInfo}>
                <Image source={{ uri: timeAtual.escudo }} style={styles.tabMiniLogo} />
                <Text style={styles.gavetaHeaderTitulo}>
                  BANCO DE SUPLENTES - {timeAtual.nome}
                </Text>
              </View>
              <Text style={styles.gavetaSubAviso}>
                {substituindo ? `Toque em quem entra no lugar de ${substituindo.name}` : 'Toque no reserva para ver detalhes'}
              </Text>
            </View>

            <ScrollView style={styles.gavetaListaScroll}>
              {reservasAtuais.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.linhaJogador,
                    { backgroundColor: timeAtual.corCard, borderColor: timeAtual.corBorda },
                    substituindo && styles.linhaJogadorProntoParaEntrar
                  ]}
                  onPress={() => handleSelectPlayer(p, false, tabAtiva === 0)}
                >
                  <View style={styles.linhaEsquerda}>
                    <View style={[styles.badgeNumero, { borderColor: timeAtual.corTema }]}>
                      <Text style={[styles.numeroTexto, { color: timeAtual.corTema }]}>#{p.num}</Text>
                    </View>
                    <Text style={styles.posicaoTexto}>{p.pos || 'JOG'}</Text>
                    <Text style={styles.nomeTexto}>{p.name}</Text>
                  </View>
                  <Text style={styles.badgeEntrar}>{substituindo ? 'Entrar ↵' : 'Ver Ficha ›'}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={styles.gavetaBotaoFechar}
              onPress={() => {
                setGavetaAberta(false);
                setSubstituindo(null);
              }}
            >
              <Text style={styles.gavetaBotaoFecharTexto}>Fechar Banco</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Ficha do Jogador */}
      <Modal visible={!!selectedPlayer} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCardBox}>
            {selectedPlayer && (
              <>
                <Text style={styles.modalJogadorNome}>
                  #{selectedPlayer.num} {selectedPlayer.name.toUpperCase()}
                </Text>
                <Text style={styles.modalJogadorTime}>
                  Posição: {selectedPlayer.pos} • {selectedPlayer.time}
                </Text>

                <View style={styles.modalDivisor} />

                <Text style={styles.modalLinhaInfo}>
                  📋 Status: <Text style={styles.modalDestaque}>Registrado na súmula oficial da partida</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#090d16', paddingTop: STATUSBAR_HEIGHT },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  headerPrincipal: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#111827',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937'
  },
  btnVoltarTopo: { padding: 4 },
  btnVoltarTexto: { color: '#38bdf8', fontSize: 13, fontWeight: 'bold' },
  torneioText: { color: '#9ca3af', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  placarText: { color: '#ffffff', fontSize: 16, fontWeight: '900', marginVertical: 2, textAlign: 'center' },
  tempoText: { color: '#38bdf8', fontSize: 11, fontWeight: '600' },

  // Lista de Seleção
  cardPartidaItem: {
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1f2937'
  },
  cardPartidaHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardPartidaLiga: { color: '#38bdf8', fontSize: 10, fontWeight: 'bold' },
  cardPartidaStatus: { color: '#9ca3af', fontSize: 10 },
  cardPartidaConfronto: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timeLinha: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  logoPartidaMini: { width: 22, height: 22, marginRight: 8 },
  nomeTimePartida: { color: '#ffffff', fontSize: 13, fontWeight: 'bold', flex: 1 },
  placarPartidaTexto: { color: '#f59e0b', fontSize: 16, fontWeight: 'bold', paddingHorizontal: 12 },
  btnRecarregar: { backgroundColor: '#38bdf8', padding: 10, borderRadius: 6, marginTop: 12 },

  // Abas
  tabSelector: { flexDirection: 'row', backgroundColor: '#111827', borderBottomWidth: 1, borderBottomColor: '#1f2937' },
  tabButton: { flex: 1, flexDirection: 'row', paddingVertical: 10, justifyContent: 'center', alignItems: 'center' },
  tabMiniLogo: { width: 18, height: 18, marginRight: 8 },
  tabButtonAtivoCAM: { borderBottomWidth: 3, borderBottomColor: '#38bdf8' },
  tabButtonAtivoGRE: { borderBottomWidth: 3, borderBottomColor: '#facc15' },
  tabButtonTexto: { color: '#6b7280', fontSize: 12, fontWeight: 'bold' },
  tabTextoAtivo: { color: '#ffffff' },

  alertaSubstituicao: { backgroundColor: '#f59e0b', padding: 8, alignItems: 'center' },
  alertaSubstituicaoTexto: { color: '#000', fontWeight: 'bold', fontSize: 11 },

  // Página do Time
  pageContainer: { flex: 1, paddingHorizontal: 12, paddingTop: 8 },
  teamCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#111827',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8
  },
  teamLogo: { width: 34, height: 34, marginRight: 10 },
  teamInfoCol: { flex: 1 },
  teamNameTitle: { fontSize: 14, fontWeight: 'bold' },
  schemaText: { color: '#9ca3af', fontSize: 11, fontWeight: 'normal' },
  coachText: { color: '#6b7280', fontSize: 10, marginTop: 2 },

  listaTitularesScroll: { flex: 1 },
  listaAviso: { color: '#64748b', fontSize: 10, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  linhaJogador: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 6
  },
  linhaJogadorSubstituindo: { borderColor: '#f59e0b', backgroundColor: '#451a03' },
  linhaJogadorProntoParaEntrar: { borderColor: '#10b981', backgroundColor: '#064e3b' },
  linhaEsquerda: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  badgeNumero: { width: 32, height: 24, borderRadius: 4, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  numeroTexto: { fontSize: 11, fontWeight: 'bold' },
  posicaoTexto: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold', width: 32 },
  nomeTexto: { color: '#ffffff', fontSize: 13, fontWeight: 'bold', flex: 1 },
  badgeEntrar: { color: '#38bdf8', fontSize: 11, fontWeight: 'bold' },

  // Gaveta
  gavetaBarraPuxador: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#111827',
    borderTopWidth: 2,
    borderTopColor: '#38bdf8',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center'
  },
  gavetaPuxadorHandle: { width: 40, height: 4, backgroundColor: '#4b5563', borderRadius: 2, marginBottom: 6 },
  gavetaBarraConteudo: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' },
  gavetaBarraTitulo: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
  gavetaPuxarAviso: { color: '#38bdf8', fontSize: 11, fontWeight: 'bold' },

  gavetaModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  gavetaModalContent: {
    backgroundColor: '#0c1322',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: SCREEN_HEIGHT * 0.75,
    padding: 16
  },
  gavetaModalHeader: { alignItems: 'center', marginBottom: 12 },
  gavetaHeaderInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  gavetaHeaderTitulo: { color: '#ffffff', fontSize: 13, fontWeight: 'bold' },
  gavetaSubAviso: { color: '#94a3b8', fontSize: 11, marginTop: 4 },
  gavetaListaScroll: { maxHeight: SCREEN_HEIGHT * 0.52 },
  gavetaBotaoFechar: { backgroundColor: '#1f2937', paddingVertical: 12, borderRadius: 8, marginTop: 10, alignItems: 'center' },
  gavetaBotaoFecharTexto: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modalCardBox: { width: '85%', backgroundColor: '#111827', borderRadius: 14, padding: 20, borderWidth: 1.5, borderColor: '#38bdf8' },
  modalJogadorNome: { color: '#ffffff', fontSize: 17, fontWeight: 'bold' },
  modalJogadorTime: { color: '#9ca3af', fontSize: 12, marginTop: 2 },
  modalDivisor: { height: 1, backgroundColor: '#1f2937', marginVertical: 12 },
  modalLinhaInfo: { color: '#d1d5db', fontSize: 13, marginBottom: 8 },
  modalDestaque: { color: '#ffffff', fontWeight: 'bold' },
  modalBotaoFechar: { backgroundColor: '#38bdf8', paddingVertical: 12, borderRadius: 8, marginTop: 15, alignItems: 'center' },
  modalBotaoTexto: { color: '#000000', fontWeight: 'bold', fontSize: 13 }
});
