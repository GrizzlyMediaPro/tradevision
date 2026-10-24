const PAYOUT_DIR = "/rezultatecurs(feedback+rezultate)";

export type PayoutFirm = "Blue Guardian" | "Tradeify";

export type PreviousEditionPayout = {
  id: string;
  file: string;
  personId: string;
  name: string;
  amountCents: number;
  firm: PayoutFirm;
  date: string;
  lifetime: boolean;
};

export type PreviousEditionReview = {
  id: string;
  author: string | null;
  text: string;
};

export function payoutImageSrc(file: string) {
  return `${PAYOUT_DIR}/${encodeURIComponent(file)}`;
}

/** Certificate din ediția precedentă. Sumele lifetime sunt totalul persoanei la firmă, nu payout-uri în plus. */
export const previousEditionPayouts: PreviousEditionPayout[] = [
  {
    id: "dumitru-bg-2026-09-10",
    file: "5843506875880640768.jpg",
    personId: "dumitru",
    name: "Dumitru Blaga",
    amountCents: 63000,
    firm: "Blue Guardian",
    date: "2026-09-10",
    lifetime: false,
  },
  {
    id: "adrian-bg-2026-08-26-1350",
    file: "5800696480120115143.jpg",
    personId: "adrian",
    name: "Adrian Poeana",
    amountCents: 135000,
    firm: "Blue Guardian",
    date: "2026-08-26",
    lifetime: false,
  },
  {
    id: "adrian-bg-2026-08-26-1298",
    file: "5800696480120115142.jpg",
    personId: "adrian",
    name: "Adrian Poeana",
    amountCents: 129870,
    firm: "Blue Guardian",
    date: "2026-08-26",
    lifetime: false,
  },
  {
    id: "stefan-bg-lifetime",
    file: "5800696480120114884.jpg",
    personId: "stefan",
    name: "Stefan Patrichi",
    amountCents: 121500,
    firm: "Blue Guardian",
    date: "2026-08-26",
    lifetime: true,
  },
  {
    id: "adrian-tf-2026-08-19",
    file: "5778204410700828515.jpg",
    personId: "adrian",
    name: "Adrian Poeana",
    amountCents: 150000,
    firm: "Tradeify",
    date: "2026-08-19",
    lifetime: false,
  },
  {
    id: "adrian-bg-2026-08-19",
    file: "5778204410700828514.jpg",
    personId: "adrian",
    name: "Adrian Poeana",
    amountCents: 135000,
    firm: "Blue Guardian",
    date: "2026-08-19",
    lifetime: false,
  },
  {
    id: "adrian-bg-2026-08-17",
    file: "5773726263049654126.jpg",
    personId: "adrian",
    name: "Adrian Poeana",
    amountCents: 148500,
    firm: "Blue Guardian",
    date: "2026-08-17",
    lifetime: false,
  },
  {
    id: "adrian-tf-2026-08-16",
    file: "5773726263049654415.jpg",
    personId: "adrian",
    name: "Adrian Poeana",
    amountCents: 150000,
    firm: "Tradeify",
    date: "2026-08-16",
    lifetime: false,
  },
  {
    id: "andrei-bg-2026-08-12",
    file: "6044123393822494696.jpg",
    personId: "andrei",
    name: "Andrei-Dragos B.",
    amountCents: 135000,
    firm: "Blue Guardian",
    date: "2026-08-12",
    lifetime: false,
  },
  {
    id: "marius-tf-2026-08-11",
    file: "6041871594008809782.jpg",
    personId: "marius",
    name: "Marius T.",
    amountCents: 150000,
    firm: "Tradeify",
    date: "2026-08-11",
    lifetime: false,
  },
  {
    id: "ovidiu-tf-2026-08-08",
    file: "6032605051743833887.jpg",
    personId: "ovidiu",
    name: "Ovidiu T.",
    amountCents: 100000,
    firm: "Tradeify",
    date: "2026-08-08",
    lifetime: false,
  },
  {
    id: "andrei-bg-2026-08-07",
    file: "6030364255636360779.jpg",
    personId: "andrei",
    name: "Andrei-Dragos B.",
    amountCents: 79200,
    firm: "Blue Guardian",
    date: "2026-08-07",
    lifetime: false,
  },
  {
    id: "emanuela-bg-lifetime",
    file: "6007991981444893962.jpg",
    personId: "emanuela",
    name: "Emanuela Catal G.",
    amountCents: 180000,
    firm: "Blue Guardian",
    date: "2026-07-30",
    lifetime: true,
  },
  {
    id: "andrei-tf-2026-07-25",
    file: "6023919085978062689.jpg",
    personId: "andrei",
    name: "Andrei-Dragos B.",
    amountCents: 150000,
    firm: "Tradeify",
    date: "2026-07-25",
    lifetime: false,
  },
  {
    id: "stefan-tf-2026-07-23",
    file: "5985604923975994946.jpg",
    personId: "stefan",
    name: "Stefan Patrichi",
    amountCents: 150000,
    firm: "Tradeify",
    date: "2026-07-23",
    lifetime: false,
  },
  {
    id: "ana-tf-2026-07-20",
    file: "6005740181631208835.jpg",
    personId: "ana",
    name: "Ana G.",
    amountCents: 150000,
    firm: "Tradeify",
    date: "2026-07-20",
    lifetime: false,
  },
];

export const previousEditionProfitCents = previousEditionPayouts.reduce(
  (sum, payout) => sum + payout.amountCents,
  0,
);

export const previousEditionTraderCount = new Set(
  previousEditionPayouts.map((payout) => payout.personId),
).size;

export const previousEditionReviews: PreviousEditionReview[] = [
  {
    id: "patrichi-stefan",
    author: "Patrichi Stefan",
    text: "Cel mai bun feedback sunt rezultatele. După 2 luni de încercări și peste 30 de conturi arse, în 2 zile am trecut 4 conturi Growth de la challenge pe funded. Mâine sper să îl trec pe al 5-lea. Sigur, mai trebuia să ajung și la payout, dar strategia predată, învățată, respectată, ne va duce și la payout. Mentorii sunt calmi, serioși și, dacă trebuie, amuzanți. Cursul este clar, simplu, dar foarte eficient. Prețul cursului a fost mic în comparație cu rezultatele care se văd. Mi-a plăcut și cursul de azi cu camerele. Live trading-ul este foarte folositor și așteptăm cât mai multe astfel de sesiuni. Una din cele mai bune investiții în educație financiară a fost acest curs.",
  },
  {
    id: "mircea",
    author: "Mircea",
    text: "Cu Cristi P. este a doua întâlnire. Îl admir pentru ceea ce a construit și pentru banii pe care îi face din trading. Cristi este un exemplu și sper să ajung și eu cândva la payout-urile pe care le face el. Felul în care vine informația de la Cristi B. în cadrul acestui curs parcă mi se potrivește mai bine. Este o chestie 100% subiectivă. Cred că faceți o echipă foarte bună pentru noi, cei care încercăm să învățăm de la voi. Eu evoluez în ritmul meu, ceva mai lent, dar evoluez. Avem și 2 business-uri în familie care în perioada asta ne ocupă foarte mult timp și ne solicită foarte mult din cauza recesiunii pe care o simțim din plin, așa că nu mă pot aloca day trading-ului atât cât aș fi vrut. Cu toate astea știu sigur că nu mă mai opresc din activitatea asta și sper, cu ajutorul vostru, să ajung să fiu profitabil. Mulțumesc!",
  },
  {
    id: "ana-gorcea",
    author: "Ana Gorcea",
    text: "Un curs care merită din plin timpul și investiția, foarte bine structurat, susținut de traineri profesioniști, implicați și carismatici. Cristi Pașatu și Cristi Barbu reușesc să explice lucruri care, pentru mine, păreau complicate, într-un mod clar și logic. Strategia prezentată este coerentă, bine argumentată și orientată spre rezultate, iar exemplele practice ajută mult la înțelegerea modului de aplicare în piață. Cel mai mult mi-a plăcut faptul că fiecare întrebare și-a găsit răspunsul, fără grabă și fără impresia că există întrebări nepotrivite. Pentru mine, acesta a fost unul dintre marile plusuri ale cursului. Deși acesta este primul meu contact cu tradingul pe futures, în doar două zile am reușit să trec evaluarea pentru un cont live. Sunt convinsă că explicațiile clare și suportul primit au avut un rol important în acest rezultat. La final, plec cu sentimentul că am câștigat mai mult decât niște informații: am o metodă, o direcție și încrederea că, prin disciplină și consecvență, rezultatele pot apărea în timp. Vă mulțumesc pentru tot!",
  },
  {
    id: "cristi-socaciu",
    author: "Cristi Socaciu",
    text: "Mulțumesc ambilor mentori, Cristi Pașatu și Cristi Barbu, pentru un curs foarte bine organizat, pentru răbdarea, dăruirea și pasiunea cu care ne explicați totul într-un mod clar și ușor de înțeles. Se vede pasiunea și implicarea voastră, iar strategia pare una valoroasă. Mulțumesc mult, sunteți tari! Abia aștept să mă laud cu primul payout.",
  },
  {
    id: "dorina-luchian",
    author: "Dorina Luchian",
    text: "Mulțumesc și eu ambilor mentori, Cristi Pașatu și Cristi Barbu, pentru cursul la care am participat. Strategia prezentată a fost clară și ușor de înțeles chiar și pentru începători, în tranzacționarea pieței futures. La cursuri și live-uri cu Cristi Pașatu am mai participat, întotdeauna cu mare plăcere, deoarece am avut mereu de învățat câte ceva, dar Cristi Barbu a fost o mare surpriză. L-am mai întâlnit la unele cursuri, dar credeam că este cursant ca și noi, când colo ce să vezi, parcă are în spate ani întregi de experiență în predarea și explicarea graficelor și a strategiilor. Eu cred că acum totul depinde de noi: avem direcția, avem strategia, ne trebuie răbdare și consecvență. Mă bucur foarte mult că am reușit să particip la curs și sper să reușesc să pun în practică ce am învățat. Consider că ați pornit foarte bine în formula aceasta. Mulțumesc încă o dată pentru tot și vă doresc mult succes!",
  },
  {
    id: "zt3k",
    author: "ZT3k",
    text: "Felicitări pentru curs. Strategia este una foarte bună și are un winrate destul de bun. Dacă este aplicat și planul de risk management așa cum a fost expus în curs, cu siguranță se vor face payout-uri. Cel mai probabil, destul de mulți oameni care au participat la acest curs o să vrea să participe și la un viitor curs de orderflow făcut tot de voi. Felicitări și mulțumim.",
  },
  {
    id: "prag-10k",
    author: null,
    text: "Astăzi am atins un prag care pentru mine, psihologic, este foarte important: de la primul payout la primii 10k, în doar 30 de zile. Pe 21 iulie făceam primul payout, astăzi am ajuns la 8. Mulțumesc pentru toate informațiile pe care le oferiți. Spor la TP-uri.",
  },
];
