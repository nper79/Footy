
import { Team, Player } from './types';

const createPlayer = (id: string, name: string, pos: Player['position'], rat: number): Player => {
  const base = rat;
  return {
    id, 
    name, 
    position: pos, 
    rating: rat, 
    morale: 80, 
    fitness: 100,
    traits: pos === 'FWD' ? ['Clinical', 'Fast'] : pos === 'MID' ? ['Vision', 'Passer'] : pos === 'DEF' ? ['Strong', 'Tackle'] : ['Reflexes', 'Agile'],
    attributes: {
      pac: Math.min(99, Math.floor(base * (0.8 + Math.random() * 0.3))),
      sho: Math.min(99, Math.floor(base * (pos === 'FWD' ? 0.9 : 0.6))),
      pas: Math.min(99, Math.floor(base * (pos === 'MID' ? 0.9 : 0.7))),
      dri: Math.min(99, Math.floor(base * (pos === 'MID' || pos === 'FWD' ? 0.85 : 0.6))),
      def: Math.min(99, Math.floor(base * (pos === 'DEF' ? 0.9 : 0.4))),
      phy: Math.min(99, Math.floor(base * (0.7 + Math.random() * 0.3)))
    }
  };
};

export const PREMIER_LEAGUE_TEAMS: Team[] = [
  {
    id: 'mancity', name: 'Manchester City', shortName: 'MCI', primaryColor: '#6CABDD', secondaryColor: '#ffffff', stadium: 'Etihad Stadium',
    squad: [
      createPlayer('mci1', 'Erling Haaland', 'FWD', 91),
      createPlayer('mci2', 'Kevin De Bruyne', 'MID', 91),
      createPlayer('mci3', 'Rodri', 'MID', 90),
      createPlayer('mci4', 'Phil Foden', 'MID', 89),
      createPlayer('mci5', 'Ederson', 'GK', 88),
      createPlayer('mci6', 'Ruben Dias', 'DEF', 89),
      createPlayer('mci7', 'Bernardo Silva', 'MID', 88),
      createPlayer('mci8', 'John Stones', 'DEF', 86),
      createPlayer('mci9', 'Kyle Walker', 'DEF', 84),
      createPlayer('mci10', 'Jack Grealish', 'FWD', 84),
      createPlayer('mci11', 'Jeremy Doku', 'FWD', 83),
      createPlayer('mci12', 'Mateo Kovacic', 'MID', 83),
      createPlayer('mci13', 'Nathan Ake', 'DEF', 84),
      createPlayer('mci14', 'Josko Gvardiol', 'DEF', 84),
      createPlayer('mci15', 'Manuel Akanji', 'DEF', 83),
      createPlayer('mci16', 'Savinho', 'FWD', 81),
      createPlayer('mci17', 'Ilkay Gundogan', 'MID', 85),
      createPlayer('mci18', 'Rico Lewis', 'DEF', 79),
      createPlayer('mci19', 'Stefan Ortega', 'GK', 80)
    ]
  },
  {
    id: 'arsenal', name: 'Arsenal', shortName: 'ARS', primaryColor: '#EF0107', secondaryColor: '#ffffff', stadium: 'Emirates Stadium',
    squad: [
      createPlayer('ars1', 'Martin Ødegaard', 'MID', 88),
      createPlayer('ars2', 'Bukayo Saka', 'FWD', 88),
      createPlayer('ars3', 'William Saliba', 'DEF', 87),
      createPlayer('ars4', 'Declan Rice', 'MID', 86),
      createPlayer('ars5', 'Kai Havertz', 'FWD', 83),
      createPlayer('ars6', 'Gabriel Magalhaes', 'DEF', 85),
      createPlayer('ars7', 'David Raya', 'GK', 84),
      createPlayer('ars8', 'Ben White', 'DEF', 83),
      createPlayer('ars9', 'Gabriel Martinelli', 'FWD', 83),
      createPlayer('ars10', 'Thomas Partey', 'MID', 82),
      createPlayer('ars11', 'Oleksandr Zinchenko', 'DEF', 80),
      createPlayer('ars12', 'Leandro Trossard', 'FWD', 82),
      createPlayer('ars13', 'Jurrien Timber', 'DEF', 81),
      createPlayer('ars14', 'Jorginho', 'MID', 81),
      createPlayer('ars15', 'Riccardo Calafiori', 'DEF', 82),
      createPlayer('ars16', 'Mikel Merino', 'MID', 83),
      createPlayer('ars17', 'Gabriel Jesus', 'FWD', 81),
      createPlayer('ars18', 'Raheem Sterling', 'FWD', 80)
    ]
  },
  {
    id: 'liverpool', name: 'Liverpool FC', shortName: 'LIV', primaryColor: '#C8102E', secondaryColor: '#ffffff', stadium: 'Anfield',
    squad: [
      createPlayer('liv1', 'Mohamed Salah', 'FWD', 89),
      createPlayer('liv2', 'Virgil van Dijk', 'DEF', 89),
      createPlayer('liv3', 'Alisson', 'GK', 89),
      createPlayer('liv4', 'Trent Alexander-Arnold', 'DEF', 86),
      createPlayer('liv5', 'Alexis Mac Allister', 'MID', 85),
      createPlayer('liv6', 'Luis Diaz', 'FWD', 84),
      createPlayer('liv7', 'Dominik Szoboszlai', 'MID', 83),
      createPlayer('liv8', 'Darwin Nunez', 'FWD', 82),
      createPlayer('liv9', 'Ibrahima Konate', 'DEF', 84),
      createPlayer('liv10', 'Andrew Robertson', 'DEF', 83),
      createPlayer('liv11', 'Cody Gakpo', 'FWD', 81),
      createPlayer('liv12', 'Harvey Elliott', 'MID', 80),
      createPlayer('liv13', 'Diogo Jota', 'FWD', 83),
      createPlayer('liv14', 'Ryan Gravenberch', 'MID', 81),
      createPlayer('liv15', 'Wataru Endo', 'MID', 80),
      createPlayer('liv16', 'Federico Chiesa', 'FWD', 81),
      createPlayer('liv17', 'Curtis Jones', 'MID', 79),
      createPlayer('liv18', 'Jarell Quansah', 'DEF', 78)
    ]
  },
  {
    id: 'manutd', name: 'Manchester United', shortName: 'MUN', primaryColor: '#DA291C', secondaryColor: '#ffffff', stadium: 'Old Trafford',
    squad: [
      createPlayer('mun1', 'Bruno Fernandes', 'MID', 87),
      createPlayer('mun2', 'Marcus Rashford', 'FWD', 83),
      createPlayer('mun3', 'Andre Onana', 'GK', 83),
      createPlayer('mun4', 'Lisandro Martinez', 'DEF', 84),
      createPlayer('mun5', 'Casemiro', 'MID', 82),
      createPlayer('mun6', 'Alejandro Garnacho', 'FWD', 81),
      createPlayer('mun7', 'Rasmus Hojlund', 'FWD', 80),
      createPlayer('mun8', 'Kobbie Mainoo', 'MID', 80),
      createPlayer('mun9', 'Diogo Dalot', 'DEF', 81),
      createPlayer('mun10', 'Luke Shaw', 'DEF', 81),
      createPlayer('mun11', 'Matthijs de Ligt', 'DEF', 84),
      createPlayer('mun12', 'Noussair Mazraoui', 'DEF', 81),
      createPlayer('mun13', 'Manuel Ugarte', 'MID', 82),
      createPlayer('mun14', 'Joshua Zirkzee', 'FWD', 79),
      createPlayer('mun15', 'Mason Mount', 'MID', 80),
      createPlayer('mun16', 'Amad Diallo', 'FWD', 78),
      createPlayer('mun17', 'Harry Maguire', 'DEF', 79),
      createPlayer('mun18', 'Christian Eriksen', 'MID', 79)
    ]
  },
  {
    id: 'chelsea', name: 'Chelsea', shortName: 'CHE', primaryColor: '#034694', secondaryColor: '#ffffff', stadium: 'Stamford Bridge',
    squad: [
      createPlayer('che1', 'Cole Palmer', 'MID', 86),
      createPlayer('che2', 'Enzo Fernandez', 'MID', 83),
      createPlayer('che3', 'Moises Caicedo', 'MID', 82),
      createPlayer('che4', 'Nicolas Jackson', 'FWD', 80),
      createPlayer('che5', 'Reece James', 'DEF', 83),
      createPlayer('che6', 'Levi Colwill', 'DEF', 80),
      createPlayer('che7', 'Robert Sanchez', 'GK', 79),
      createPlayer('che8', 'Malo Gusto', 'DEF', 79),
      createPlayer('che9', 'Christopher Nkunku', 'FWD', 84),
      createPlayer('che10', 'Jadon Sancho', 'FWD', 81),
      createPlayer('che11', 'Pedro Neto', 'FWD', 81),
      createPlayer('che12', 'Joao Felix', 'FWD', 80),
      createPlayer('che13', 'Wesley Fofana', 'DEF', 79),
      createPlayer('che14', 'Marc Cucurella', 'DEF', 80),
      createPlayer('che15', 'Romeo Lavia', 'MID', 77),
      createPlayer('che16', 'Filip Jorgensen', 'GK', 76)
    ]
  },
  {
    id: 'tottenham', name: 'Tottenham Hotspur', shortName: 'TOT', primaryColor: '#132257', secondaryColor: '#ffffff', stadium: 'Tottenham Stadium',
    squad: [
      createPlayer('tot1', 'Heung-min Son', 'FWD', 87),
      createPlayer('tot2', 'James Maddison', 'MID', 85),
      createPlayer('tot3', 'Cristian Romero', 'DEF', 84),
      createPlayer('tot4', 'Guglielmo Vicario', 'GK', 83),
      createPlayer('tot5', 'Micky van de Ven', 'DEF', 82),
      createPlayer('tot6', 'Dejan Kulusevski', 'FWD', 81),
      createPlayer('tot7', 'Yves Bissouma', 'MID', 80),
      createPlayer('tot8', 'Dominic Solanke', 'FWD', 81),
      createPlayer('tot9', 'Pedro Porro', 'DEF', 82),
      createPlayer('tot10', 'Brennan Johnson', 'FWD', 79),
      createPlayer('tot11', 'Destiny Udogie', 'DEF', 81),
      createPlayer('tot12', 'Pape Matar Sarr', 'MID', 79),
      createPlayer('tot13', 'Rodrigo Bentancur', 'MID', 81),
      createPlayer('tot14', 'Archie Gray', 'MID', 75),
      createPlayer('tot15', 'Wilson Odobert', 'FWD', 76)
    ]
  },
  { id: 'astonvilla', name: 'Aston Villa', shortName: 'AVL', primaryColor: '#95BFE5', secondaryColor: '#670E36', stadium: 'Villa Park', squad: [createPlayer('avl1', 'Ollie Watkins', 'FWD', 83), createPlayer('avl2', 'Emi Martinez', 'GK', 86), createPlayer('avl3', 'Leon Bailey', 'FWD', 81), createPlayer('avl4', 'Morgan Rogers', 'MID', 77), createPlayer('avl5', 'Ezri Konsa', 'DEF', 81), createPlayer('avl6', 'Pau Torres', 'DEF', 82), createPlayer('avl7', 'Youri Tielemans', 'MID', 81), createPlayer('avl8', 'Amadou Onana', 'MID', 81), createPlayer('avl9', 'John McGinn', 'MID', 80)] },
  { id: 'newcastle', name: 'Newcastle United', shortName: 'NEW', primaryColor: '#241F20', secondaryColor: '#ffffff', stadium: 'St. James Park', squad: [createPlayer('new1', 'Alexander Isak', 'FWD', 85), createPlayer('new2', 'Bruno Guimaraes', 'MID', 84), createPlayer('new3', 'Anthony Gordon', 'FWD', 83), createPlayer('new4', 'Kieran Trippier', 'DEF', 81), createPlayer('new5', 'Nick Pope', 'GK', 82), createPlayer('new6', 'Sandro Tonali', 'MID', 82), createPlayer('new7', 'Joelinton', 'MID', 81), createPlayer('new8', 'Sven Botman', 'DEF', 82)] },
  { id: 'westham', name: 'West Ham United', shortName: 'WHU', primaryColor: '#7A263A', secondaryColor: '#1BB1E7', stadium: 'London Stadium', squad: [createPlayer('whu1', 'Jarrod Bowen', 'FWD', 83), createPlayer('whu2', 'Lucas Paqueta', 'MID', 82), createPlayer('whu3', 'Mohammed Kudus', 'FWD', 81), createPlayer('whu4', 'Alphonse Areola', 'GK', 80), createPlayer('whu5', 'Edson Alvarez', 'MID', 80), createPlayer('whu6', 'Max Kilman', 'DEF', 79), createPlayer('whu7', 'Niclas Fullkrug', 'FWD', 80)] },
  { id: 'brighton', name: 'Brighton', shortName: 'BHA', primaryColor: '#0057B8', secondaryColor: '#ffffff', stadium: 'Amex Stadium', squad: [createPlayer('bha1', 'Kaoru Mitoma', 'FWD', 81), createPlayer('bha2', 'Joao Pedro', 'FWD', 80), createPlayer('bha3', 'Lewis Dunk', 'DEF', 80), createPlayer('bha4', 'Bart Verbruggen', 'GK', 78), createPlayer('bha5', 'Yankuba Minteh', 'FWD', 77)] },
  { id: 'wolves', name: 'Wolves', shortName: 'WOL', primaryColor: '#FDB913', secondaryColor: '#231F20', stadium: 'Molineux', squad: [createPlayer('wol1', 'Matheus Cunha', 'FWD', 81), createPlayer('wol2', 'Hwang Hee-chan', 'FWD', 79), createPlayer('wol3', 'Jose Sa', 'GK', 79), createPlayer('wol4', 'Mario Lemina', 'MID', 79)] },
  { id: 'fulham', name: 'Fulham', shortName: 'FUL', primaryColor: '#ffffff', secondaryColor: '#000000', stadium: 'Craven Cottage', squad: [createPlayer('ful1', 'Andreas Pereira', 'MID', 79), createPlayer('ful2', 'Bernd Leno', 'GK', 81), createPlayer('ful3', 'Emile Smith Rowe', 'MID', 79), createPlayer('ful4', 'Antonee Robinson', 'DEF', 78)] },
  { id: 'bournemouth', name: 'Bournemouth', shortName: 'BOU', primaryColor: '#B50E12', secondaryColor: '#000000', stadium: 'Vitality Stadium', squad: [createPlayer('bou1', 'Evanilson', 'FWD', 79), createPlayer('bou2', 'Kepa Arrizabalaga', 'GK', 78), createPlayer('bou3', 'Marcus Tavernier', 'MID', 77), createPlayer('bou4', 'Antoine Semenyo', 'FWD', 77)] },
  { id: 'everton', name: 'Everton', shortName: 'EVE', primaryColor: '#003399', secondaryColor: '#ffffff', stadium: 'Goodison Park', squad: [createPlayer('eve1', 'Jordan Pickford', 'GK', 82), createPlayer('eve2', 'Dominic Calvert-Lewin', 'FWD', 78), createPlayer('eve3', 'James Tarkowski', 'DEF', 79), createPlayer('eve4', 'Dwight McNeil', 'MID', 78)] },
  { id: 'brentford', name: 'Brentford', shortName: 'BRE', primaryColor: '#E30613', secondaryColor: '#ffffff', stadium: 'Gtech Stadium', squad: [createPlayer('bre1', 'Bryan Mbeumo', 'FWD', 80), createPlayer('bre2', 'Yoane Wissa', 'FWD', 78), createPlayer('bre3', 'Christian Norgaard', 'MID', 78), createPlayer('bre4', 'Mark Flekken', 'GK', 78)] },
  { id: 'nottingham', name: 'Nottm Forest', shortName: 'NFO', primaryColor: '#E31B23', secondaryColor: '#ffffff', stadium: 'City Ground', squad: [createPlayer('nfo1', 'Morgan Gibbs-White', 'MID', 81), createPlayer('nfo2', 'Callum Hudson-Odoi', 'FWD', 78), createPlayer('nfo3', 'Matz Sels', 'GK', 78), createPlayer('nfo4', 'Chris Wood', 'FWD', 77)] },
  { id: 'crystalpalace', name: 'Crystal Palace', shortName: 'CRY', primaryColor: '#1B458F', secondaryColor: '#C4122E', stadium: 'Selhurst Park', squad: [createPlayer('cry1', 'Eberechi Eze', 'MID', 82), createPlayer('cry2', 'Jean-Philippe Mateta', 'FWD', 79), createPlayer('cry3', 'Adam Wharton', 'MID', 78), createPlayer('cry4', 'Marc Guehi', 'DEF', 81)] },
  { id: 'leicester', name: 'Leicester City', shortName: 'LEI', primaryColor: '#003090', secondaryColor: '#FDBE11', stadium: 'King Power Stadium', squad: [createPlayer('lei1', 'Jamie Vardy', 'FWD', 78), createPlayer('lei2', 'Facundo Buonanotte', 'MID', 76), createPlayer('lei3', 'Mads Hermansen', 'GK', 76), createPlayer('lei4', 'Wilfred Ndidi', 'MID', 78)] },
  { id: 'ipswich', name: 'Ipswich Town', shortName: 'IPS', primaryColor: '#003399', secondaryColor: '#ffffff', stadium: 'Portman Road', squad: [createPlayer('ips1', 'Liam Delap', 'FWD', 75), createPlayer('ips2', 'Sam Morsy', 'MID', 74), createPlayer('ips3', 'Omari Hutchinson', 'FWD', 75), createPlayer('ips4', 'Arijanet Muric', 'GK', 75)] },
  { id: 'southampton', name: 'Southampton', shortName: 'SOU', primaryColor: '#D71920', secondaryColor: '#ffffff', stadium: 'St Mary Stadium', squad: [createPlayer('sou1', 'Adam Armstrong', 'FWD', 76), createPlayer('sou2', 'Ben Brereton Diaz', 'FWD', 76), createPlayer('sou3', 'Aaron Ramsdale', 'GK', 80), createPlayer('sou4', 'Kyle Walker-Peters', 'DEF', 77)] }
];
