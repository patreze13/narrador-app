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
  FlatList,
  Image,
  Platform
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 28 : 0;

const jogoDados = {
  torneio: "BRASILEIRÃO SÉRIE A • 20ª RODADA",
  placar: "ATLÉTICO-MG  1 x 0  GRÊMIO",
  tempo: "⏱️ 38' 1º Tempo • Arena MRV",
  notificacaoGol: "⚽ GOL DO GALO! Cassierra (34') - Passe de Scarpa! Galo assume 7º lugar.",
  times: {
    mandante: {
      id: "CAM",
      nome: "ATLÉTICO-MG",
      alcunha: "Galo Forte Vingador",
      escudo: "https://media.api-sports.io/football/teams/1062.png",
      posicao: "9º Lugar (27 pts)",
      pontos: "27 pts",
      saldo: "+3 (24 GP / 21 GC)",
      forma: ["🟢", "🔴", "🟢", "⚪", "🟢"],
      formacao: "4-3-3",
      tecnico: "Gabriel Milito",
      corTema: "#ffffff",
      corBorda: "#3f3f46",
      corCard: "#18181b",
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
        { id: 10, num: 9, pos: "ATA", name: "Mateo Cassierra", gols: 8, assist: 2, amarelos: 0, ex: "Zenit, Racing", fezGol: true, golMinuto: "34'" },
        { id: 11, num: 7, pos: "ATA", name: "Hulk", gols: 10, assist: 5, amarelos: 1, ex: "Shanghai SIPG, Porto, Zenit" }
      ],
      reservas: [
        { id: 12, num: 31, pos: "GOL", name: "Matheus Mendes", gols: 0, assist: 0, amarelos: 0, ex: "CSA, Base" },
        { id: 13, num: 16, pos: "ZAG", name: "Igor Rabello", gols: 0, assist: 0, amarelos: 0, ex: "Botafogo, Náutico" },
        { id: 14, num: 44, pos: "LAT", name: "Rubens", gols: 1, assist: 1, amarelos: 1, ex: "Base" },
        { id: 15, num: 17, pos: "MEI", name: "Igor Gomes", gols: 2, assist: 1, amarelos: 0, ex: "São Paulo" },
        { id: 16, num: 11, pos: "ATA", name: "Eduardo Vargas", gols: 3, assist: 1, amarelos: 0, ex: "Tigres, Napoli" },
        { id: 17, num: 30, pos: "ATA", name: "Brahian Palacios", gols: 1, assist: 0, amarelos: 0, ex: "Atlético Nacional" }
      ]
    },
    visitante: {
      id: "GRE",
      nome: "GRÊMIO",
      alcunha: "Imortal Tricolor",
      escudo: "https://media.api-sports.io/football/teams/130.png",
      posicao: "6º Lugar (31 pts)",
      pontos: "31 pts",
      saldo: "+5 (26 GP / 21 GC)",
      forma: ["🟢", "🟢", "⚪", "🔴", "🟢"],
      formacao: "4-2-3-1",
      tecnico: "Renato Portaluppi",
      corTema: "#38bdf8",
      corBorda: "#0284c7",
      corCard: "#0c2135",
      titulares: [
        { id: 101, num: 1, pos: "GOL", name: "Agustín Marchesín", gols: 0, assist: 0, amarelos: 1, ex: "Celta de Vigo, Porto" },
        { id: 102, num: 18, pos: "LAT", name: "João Pedro", gols: 1, assist: 2, amarelos: 2, ex: "Porto, Corinthians" },
        { id: 103, num: 5, pos: "ZAG", name: "Rodrigo Ely", gols: 1, assist: 0, amarelos: 1, ex: "Almería, Milan" },
        { id: 104, num: 4, pos: "ZAG", name: "Walter Kannemann", gols: 0, assist: 0, amarelos: 2, ex: "San Lorenzo, Atlas" },
        { id: 105, num: 6, pos: "LAT", name: "Reinaldo", gols: 3, assist: 3, amarelos: 2, ex: "São Paulo, Chapecoense" },
        { id: 106, num: 20, pos: "VOL", name: "Mathías Villasanti", gols: 1, assist: 2, amarelos: 1, ex: "Cerro Porteño" },
        { id: 107, num: 17, pos: "VOL", name: "Dodi", gols: 0, assist: 1, amarelos: 2, ex: "Santos, Fluminense" },
        { id: 108, num: 7, pos: "MEI", name: "Yeferson Soteldo", gols: 4, assist: 4, amarelos: 0, ex: "Santos, Tigres" },
        { id: 109, num: 10, pos: "MEI", name: "Franco Cristaldo", gols: 6, assist: 5, amarelos: 1, ex: "Huracán, Boca Juniors" },
        { id: 110, num: 11, pos: "ATA", name: "Cristian Pavón", gols: 3, assist: 3, amarelos: 0, ex: "Atlético-MG, Boca Juniors" },
        { id: 111, num: 22, pos: "ATA", name: "Martin Braithwaite", gols: 5, assist: 1, amarelos: 1, ex: "Barcelona, Espanyol" }
      ],
      reservas: [
        { id: 112, num: 97, pos: "GOL", name: "Rafael Cabral", gols: 0, assist: 0, amarelos: 0, ex: "Cruzeiro, Santos" },
        { id: 113, num: 3, pos: "ZAG", name: "Pedro Geromel", gols: 0, assist: 0, amarelos: 0, ex: "Mallorca, Köln" },
        { id: 114, num: 26, pos: "LAT", name: "Mayk", gols: 0, assist: 0, amarelos: 0, ex: "Guarani" },
        { id: 115, num: 14, pos: "MEI", name: "Nathan Pescador", gols: 0, assist: 0, amarelos: 0, ex: "Fluminense, Chelsea" },
        { id: 116, num: 9, pos: "ATA", name: "Diego Costa", gols: 4, assist: 1, amarelos: 1, ex: "Botafogo, Chelsea, Atlético-MG" },
        { id: 117, num: 77, pos: "ATA", name: "André Henrique", gols: 1, assist: 0, amarelos: 0, ex: "Hercílio Luz" }
      ]
    }
  }
};

export default function App() {
  const [tabAtiva, setTabAtiva] = useState(0);
  const [titularesCAM, setTitularesCAM] = useState(jogoDados.times.mandante.titulares);
  const [reservasCAM, setReservasCAM] = useState(jogoDados.times.mandante.reservas);
  const [titularesGRE, setTitularesGRE] = useState(jogoDados.times.visitante.titulares);
  const [reservasGRE, setReservasGRE] = useState(jogoDados.times.visitante.reservas);

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [substituindo, setSubstituindo] = useState(null);
  const [gavetaAberta, setGavetaAberta] = useState(false);

  const flatListRef = useRef(null);

  function mudarTab(index) {
    setTabAtiva(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  }

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
        setGavetaAberta(false);
      } else {
        setSubstituindo(null);
      }
      return;
    }
    setSelectedPlayer({ ...player, timeId });
  }

  const timeAtual = tabAtiva === 0 ? jogoDados.times.mandante : jogoDados.times.visitante;
  const reservasAtuais = tabAtiva === 0 ? reservasCAM : reservasGRE;

  const renderPranchetaTime = (time, titulares) => {
    return (
      <View style={[styles.pageContainer, { width: SCREEN_WIDTH }]}>
        {/* Card do Clube com Escudo Oficial */}
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
            <Text style={styles.coachText}>Técnico: {time.tecnico} • Toque p/ ficha técnica</Text>
          </View>
          <View style={styles.badgeClassificacao}>
            <Text style={styles.badgeClassificacaoTexto}>{time.posicao.split(' ')[0]}</Text>
          </View>
        </TouchableOpacity>

        {/* 11 Titulares em Linha Vertical (Um abaixo do outro) */}
        <ScrollView style={styles.listaTitularesScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.listaAviso}>
            TITULARES EM CAMPO (Toque: Ficha | Segure: Substituir)
          </Text>
          {titulares.map((p) => {
            const isPendurado = p.amarelos === 2;
            return (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.linhaJogador,
                  { backgroundColor: time.corCard, borderColor: time.corBorda },
                  substituindo?.id === p.id && styles.linhaJogadorSubstituindo,
                  isPendurado && styles.linhaJogadorPendurado
                ]}
                onPress={() => handleSelectPlayer(p, true, time.id)}
                onLongPress={() => {
                  setSubstituindo(p);
                  setGavetaAberta(true); // Abre a gaveta de reservas na hora ao segurar
                }}
                activeOpacity={0.7}
              >
                <View style={styles.linhaEsquerda}>
                  <View style={[styles.badgeNumero, { borderColor: time.corTema }]}>
                    <Text style={[styles.numeroTexto, { color: time.corTema }]}>#{p.num}</Text>
                  </View>
                  <Text style={styles.posicaoTexto}>{p.pos}</Text>
                  <Text style={styles.nomeTexto} numberOfLines={1}>{p.name}</Text>
                </View>

                <View style={styles.linhaDireita}>
                  {p.fezGol && <Text style={styles.badgeGol}>⚽ {p.golMinuto}</Text>}
                  {p.temAssist && <Text style={styles.badgeAssist}>👟 Passe</Text>}
                  {isPendurado && <Text style={styles.badgePendurado}>⚠️ Pendurado</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 90 }} />
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" translucent />
      
      {/* 1. Header Responsivo (Não corta no notch) */}
      <View style={styles.headerPrincipal}>
        <Text style={styles.torneioText}>{jogoDados.torneio}</Text>
        <Text style={styles.placarText}>{jogoDados.placar}</Text>
        <Text style={styles.tempoText}>{jogoDados.tempo}</Text>
      </View>

      {/* 2. Banner de Alerta Dinâmico */}
      <View style={styles.bannerAlerta}>
        <Text style={styles.bannerAlertaTexto} numberOfLines={1}>
          {jogoDados.notificacaoGol}
        </Text>
      </View>

      {/* 3. Seletor de Tabs com Escudos */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tabButton, tabAtiva === 0 && styles.tabButtonAtivoCAM]}
          onPress={() => mudarTab(0)}
        >
          <Image source={{ uri: jogoDados.times.mandante.escudo }} style={styles.tabMiniLogo} />
          <Text style={[styles.tabButtonTexto, tabAtiva === 0 && styles.tabTextoAtivo]}>
            ATLÉTICO-MG
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, tabAtiva === 1 && styles.tabButtonAtivoGRE]}
          onPress={() => mudarTab(1)}
        >
          <Image source={{ uri: jogoDados.times.visitante.escudo }} style={styles.tabMiniLogo} />
          <Text style={[styles.tabButtonTexto, tabAtiva === 1 && styles.tabTextoAtivo]}>
            GRÊMIO
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

      {/* 4. Telas Deslizantes (Swipe) */}
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
            ? renderPranchetaTime(item, titularesCAM)
            : renderPranchetaTime(item, titularesGRE)
        }
      />

      {/* 5. GAVETA PUXÁVEL DE RESERVAS (Bottom Bar / Drawer) */}
      <TouchableOpacity 
        style={styles.gavetaBarraPuxador}
        onPress={() => setGavetaAberta(true)}
        activeOpacity={0.9}
      >
        <View style={styles.gavetaPuxadorHandle} />
        <View style={styles.gavetaBarraConteudo}>
          <Text style={styles.gavetaBarraTitulo}>
            💺 BANCO DE RESERVAS ({timeAtual.nome}) • {reservasAtuais.length} jogadores
          </Text>
          <Text style={styles.gavetaPuxarAviso}>Puxar / Toque para abrir ▲</Text>
        </View>
      </TouchableOpacity>

      {/* MODAL GAVETA COMPLETA DE RESERVAS EM LINHA */}
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
                {substituindo ? `Toque em quem vai entrar no lugar de ${substituindo.name}` : 'Toque no reserva para ver a ficha completa'}
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
                  onPress={() => handleSelectPlayer(p, false, timeAtual.id)}
                >
                  <View style={styles.linhaEsquerda}>
                    <View style={[styles.badgeNumero, { borderColor: timeAtual.corTema }]}>
                      <Text style={[styles.numeroTexto, { color: timeAtual.corTema }]}>#{p.num}</Text>
                    </View>
                    <Text style={styles.posicaoTexto}>{p.pos}</Text>
                    <Text style={styles.nomeTexto}>{p.name}</Text>
                  </View>
                  <Text style={styles.badgeEntrar}>{substituindo ? 'Substituir ↵' : 'Ver Ficha ›'}</Text>
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

      {/* MODAL 1: FICHA DO ATLETA */}
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
          <View style={[styles.modalCardBox, { borderColor: selectedTeam?.corTema }]}>
            {selectedTeam && (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  <Image source={{ uri: selectedTeam.escudo }} style={{ width: 36, height: 36, marginRight: 10 }} />
                  <View>
                    <Text style={[styles.modalJogadorNome, { color: selectedTeam.corTema }]}>
                      {selectedTeam.nome}
                    </Text>
                    <Text style={styles.modalJogadorTime}>{selectedTeam.alcunha}</Text>
                  </View>
                </View>

                <View style={styles.modalDivisor} />

                <Text style={styles.modalLinhaInfo}>
                  📊 Classificação Atual: <Text style={styles.modalDestaque}>{selectedTeam.posicao}</Text>
                </Text>
                <Text style={styles.modalLinhaInfo}>
                  🏆 Pontuação Total: <Text style={styles.modalDestaque}>{selectedTeam.pontos}</Text>
                </Text>
                <Text style={styles.modalLinhaInfo}>
                  ⚖️ Saldo de Gols: <Text style={styles.modalDestaque}>{selectedTeam.saldo}</Text>
                </Text>
                <Text style={styles.modalLinhaInfo}>
                  📈 Forma Recente: <Text style={styles.modalDestaque}>{selectedTeam.forma.join(' ')}</Text>
                </Text>

                <TouchableOpacity
                  style={[styles.modalBotaoFechar, { backgroundColor: selectedTeam.corTema }]}
                  onPress={() => setSelectedTeam(null)}
                >
                  <Text style={[styles.modalBotaoTexto, { color: '#000000' }]}>Fechar Ficha do Clube</Text>
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
  
  // Header Responsivo
  headerPrincipal: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#111827',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937'
  },
  torneioText: { color: '#9ca3af', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  placarText: { color: '#ffffff', fontSize: 18, fontWeight: '900', marginVertical: 2 },
  tempoText: { color: '#38bdf8', fontSize: 12, fontWeight: '600' },

  bannerAlerta: { backgroundColor: '#854d0e', paddingVertical: 6, paddingHorizontal: 12, alignItems: 'center' },
  bannerAlertaTexto: { color: '#fef08a', fontSize: 11, fontWeight: 'bold' },

  // Abas de Seleção
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937'
  },
  tabButton: { flex: 1, flexDirection: 'row', paddingVertical: 10, justifyContent: 'center', alignItems: 'center' },
  tabMiniLogo: { width: 18, height: 18, marginRight: 8 },
  tabButtonAtivoCAM: { borderBottomWidth: 3, borderBottomColor: '#ffffff' },
  tabButtonAtivoGRE: { borderBottomWidth: 3, borderBottomColor: '#38bdf8' },
  tabButtonTexto: { color: '#6b7280', fontSize: 13, fontWeight: 'bold' },
  tabTextoAtivo: { color: '#ffffff' },

  alertaSubstituicao: { backgroundColor: '#f59e0b', padding: 8, alignItems: 'center' },
  alertaSubstituicaoTexto: { color: '#000', fontWeight: 'bold', fontSize: 11 },

  // Conteúdo de Cada Time
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
  badgeClassificacao: { backgroundColor: '#1f2937', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeClassificacaoTexto: { color: '#f3f4f6', fontSize: 11, fontWeight: 'bold' },

  // 11 Titulares em Linha
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
  linhaJogadorPendurado: { borderColor: '#eab308' },
  linhaJogadorProntoParaEntrar: { borderColor: '#10b981', backgroundColor: '#064e3b' },
  linhaEsquerda: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  badgeNumero: {
    width: 32,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  numeroTexto: { fontSize: 11, fontWeight: 'bold' },
  posicaoTexto: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold', width: 30 },
  nomeTexto: { color: '#ffffff', fontSize: 13, fontWeight: 'bold', flex: 1 },
  linhaDireita: { flexDirection: 'row', alignItems: 'center' },
  badgeGol: { color: '#facc15', fontSize: 11, fontWeight: 'bold', marginRight: 6 },
  badgeAssist: { color: '#38bdf8', fontSize: 11, fontWeight: 'bold', marginRight: 6 },
  badgePendurado: { color: '#eab308', fontSize: 9, fontWeight: 'bold' },
  badgeEntrar: { color: '#38bdf8', fontSize: 11, fontWeight: 'bold' },

  // Gaveta Puxável (Bottom Sheet)
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

  // Modal da Gaveta Aberta
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
  gavetaHeaderTitulo: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  gavetaSubAviso: { color: '#94a3b8', fontSize: 11, marginTop: 4 },
  gavetaListaScroll: { maxHeight: SCREEN_HEIGHT * 0.52 },
  gavetaBotaoFechar: {
    backgroundColor: '#1f2937',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center'
  },
  gavetaBotaoFecharTexto: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },

  // Modais Ficha
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
