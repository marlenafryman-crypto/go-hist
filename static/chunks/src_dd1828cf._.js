(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/lib/mock-data.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "DECK": (()=>DECK)
});
const DECK = [
    {
        id: 'p01',
        name: 'Leonardo da Vinci',
        type: 'Person',
        description: 'A true Renaissance man, excelling in painting, sculpture, architecture, music, science, and more.',
        imageUrl: 'https://firebasestudio.app/assets/cards/leonardo-da-vinci.jpg',
        hint: 'renaissance artist'
    },
    {
        id: 'e01',
        name: 'The Renaissance',
        type: 'Event',
        description: 'A period of great cultural change and achievement in Europe that spanned from the 14th to the 17th century.',
        imageUrl: 'https://firebasestudio.app/assets/cards/the-renaissance.jpg',
        hint: 'historical period'
    },
    {
        id: 'p02',
        name: 'Marie Curie',
        type: 'Person',
        description: 'A physicist and chemist who conducted pioneering research on radioactivity. The first woman to win a Nobel Prize.',
        imageUrl: 'https://firebasestudio.app/assets/cards/marie-curie.jpg',
        hint: 'pioneering scientist'
    },
    {
        id: 'e02',
        name: 'Discovery of Radium',
        type: 'Event',
        description: 'The 1898 discovery by Marie and Pierre Curie, which revolutionized science and medicine.',
        imageUrl: 'https://firebasestudio.app/assets/cards/discovery-of-radium.jpg',
        hint: 'scientific breakthrough'
    },
    {
        id: 'p03',
        name: 'Julius Caesar',
        type: 'Person',
        description: 'A Roman general and statesman who played a critical role in the events that led to the demise of the Roman Republic.',
        imageUrl: 'https://firebasestudio.app/assets/cards/julius-caesar.jpg',
        hint: 'roman emperor'
    },
    {
        id: 'e03',
        name: 'Crossing the Rubicon',
        type: 'Event',
        description: 'A pivotal moment in 49 BC when Julius Caesar\'s army crossed the river, marking a point of no return.',
        imageUrl: 'https://firebasestudio.app/assets/cards/crossing-the-rubicon.jpg',
        hint: 'ancient battle'
    },
    {
        id: 'p04',
        name: 'Cleopatra',
        type: 'Person',
        description: 'The last active ruler of the Ptolemaic Kingdom of Egypt, known for her intelligence and political acumen.',
        imageUrl: 'https://i.ibb.co/TxkYvb1k/Untitled-design-5.png',
        hint: 'egyptian queen'
    },
    {
        id: 'e04',
        name: 'Ptolemaic Dynasty',
        type: 'Event',
        description: 'A Hellenistic kingdom based in ancient Egypt, founded by Ptolemy I Soter, a companion of Alexander the Great.',
        imageUrl: 'https://firebasestudio.app/assets/cards/ptolemaic-dynasty.jpg',
        hint: 'ancient dynasty'
    },
    {
        id: 'p05',
        name: 'Albert Einstein',
        type: 'Person',
        description: 'Developed the theory of relativity, one of the two pillars of modern physics.',
        imageUrl: 'https://firebasestudio.app/assets/cards/albert-einstein.jpg',
        hint: 'modern physicist'
    },
    {
        id: 'e05',
        name: 'Manhattan Project',
        type: 'Event',
        description: 'A top-secret research and development undertaking during World War II that produced the first nuclear weapons.',
        imageUrl: 'https://firebasestudio.app/assets/cards/manhattan-project.png',
        hint: 'wartime project'
    },
    {
        id: 'p06',
        name: 'Isaac Newton',
        type: 'Person',
        description: 'An English mathematician, physicist, and astronomer, widely recognized as one of the most influential scientists of all time.',
        imageUrl: 'https://firebasestudio.app/assets/cards/isaac-newton.jpg',
        hint: 'influential scientist'
    },
    {
        id: 'e06',
        name: 'Scientific Revolution',
        type: 'Event',
        description: 'A series of events that marked the emergence of modern science during the early modern period.',
        imageUrl: 'https://firebasestudio.app/assets/cards/scientific-revolution.jpg',
        hint: 'intellectual movement'
    },
    {
        id: 'p07',
        name: 'Martin Luther King Jr.',
        type: 'Person',
        description: 'An American Baptist minister and activist who became the most visible spokesperson in the civil rights movement.',
        imageUrl: 'https://i.ibb.co/BRp399Z/Untitled-design-51.png',
        hint: 'civil rights'
    },
    {
        id: 'e07',
        name: 'March on Washington',
        type: 'Event',
        description: 'A massive protest march in August 1963, where Martin Luther King Jr. delivered his famous "I Have a Dream" speech.',
        imageUrl: 'https://firebasestudio.app/assets/cards/march-on-washington.jpg',
        hint: 'protest march'
    },
    {
        id: 'p08',
        name: 'Queen Elizabeth I',
        type: 'Person',
        description: 'Queen of England and Ireland from 1558 until her death in 1603. Sometimes called the Virgin Queen.',
        imageUrl: 'https://firebasestudio.app/assets/cards/queen-elizabeth-i.jpg',
        hint: 'english monarch'
    },
    {
        id: 'e08',
        name: 'Spanish Armada',
        type: 'Event',
        description: 'A Habsburg Spanish fleet of 130 ships that sailed from Lisbon in 1588 with the purpose of escorting an army to invade England.',
        imageUrl: 'https://firebasestudio.app/assets/cards/spanish-armada.jpg',
        hint: 'naval fleet'
    },
    {
        id: 'p09',
        name: 'Nikola Tesla',
        type: 'Person',
        description: 'A Serbian-American inventor and engineer best known for his contributions to the design of the modern AC electricity system.',
        imageUrl: 'https://firebasestudio.app/assets/cards/nikola-tesla.jpg',
        hint: 'inventor engineer'
    },
    {
        id: 'e09',
        name: 'War of the Currents',
        type: 'Event',
        description: 'A series of events surrounding the introduction of competing electric power transmission systems in the late 1880s and early 1990s.',
        imageUrl: 'https://firebasestudio.app/assets/cards/war-of-the-currents.jpg',
        hint: 'technological rivalry'
    },
    {
        id: 'p10',
        name: 'Ada Lovelace',
        type: 'Person',
        description: 'An English mathematician and writer, chiefly known for her work on Charles Babbage\'s proposed mechanical computer.',
        imageUrl: 'https://firebasestudio.app/assets/cards/ada-lovelace.png',
        hint: 'computer pioneer'
    },
    {
        id: 'e10',
        name: 'Analytical Engine',
        type: 'Event',
        description: 'A proposed mechanical general-purpose computer designed by English mathematician and computer pioneer Charles Babbage.',
        imageUrl: 'https://firebasestudio.app/assets/cards/analytical-engine.png',
        hint: 'early computer'
    },
    {
        id: 'p11',
        name: 'Galileo Galilei',
        type: 'Person',
        description: 'An Italian astronomer, physicist and engineer, whose discoveries with the telescope revolutionized astronomy.',
        imageUrl: 'https://firebasestudio.app/assets/cards/galileo-galilei.jpg',
        hint: 'astronomer physicist'
    },
    {
        id: 'e11',
        name: 'The Copernican Model',
        type: 'Event',
        description: 'A model of the universe that placed the Sun, rather than Earth, at the center of the universe.',
        imageUrl: 'https://firebasestudio.app/assets/cards/copernican-model.png',
        hint: 'astronomy model'
    },
    {
        id: 'p12',
        name: 'Joan of Arc',
        type: 'Person',
        description: 'A peasant girl who, believing that she was acting under divine guidance, led the French army in a momentous victory at Orléans.',
        imageUrl: 'https://i.ibb.co/5hB8mc47/Untitled-design-46.png',
        hint: 'french heroine'
    },
    {
        id: 'e12',
        name: '100 Years War',
        type: 'Event',
        description: 'A series of conflicts from 1337 to 1453 between the House of Plantagenet of England and the House of Valois of France.',
        imageUrl: 'https://i.ibb.co/Vcr2M4qn/Untitled-design-74.png',
        hint: 'medieval war'
    },
    {
        id: 'e13',
        name: 'Treaty of Paris (1783)',
        type: 'Event',
        description: 'The peace agreement that officially ended the American Revolution. Britain recognized American independence and cede territory to the new United States.',
        imageUrl: 'https://i.ibb.co/qLC67Sgg/Untitled-design-10.png',
        hint: 'peace treaty'
    },
    {
        id: 'e14',
        name: 'Boston Tea Party',
        type: 'Event',
        description: 'In December 1773, American colonists disguised as Mohawk Indians dumped tea into Boston Harbor to protest the Tea Act and British taxation without representation.',
        imageUrl: 'https://i.ibb.co/Y7mpf3wz/Untitled-design-9.png',
        hint: 'american revolution'
    },
    {
        id: 'e15',
        name: 'Shot Heard Round the World',
        type: 'Event',
        description: 'The opening battles of the American Revolution in April 1775. British troops clashed with colonial militias at Lexington and Concord, marking the official start of the war.',
        imageUrl: 'https://i.ibb.co/XfW45Ngv/shot-1.png',
        hint: 'american revolution'
    },
    {
        id: 'p14',
        name: 'Paul Revere',
        type: 'Person',
        description: 'An American silversmith and Patriot in the American Revolution, famous for his midnight ride to alert colonial militia of British forces.',
        imageUrl: 'https://i.ibb.co/hQbfBWP/Untitled-design-29.png',
        hint: 'american patriot'
    },
    {
        id: 'p13',
        name: 'Henry VIII',
        type: 'Person',
        description: 'King of England from 1509 until his death, famously married six times and was a central figure in the English Reformation.',
        imageUrl: 'https://i.ibb.co/HfpLcVs6/Untitled-design-11.png',
        hint: 'english king'
    },
    {
        id: 'e16',
        name: 'Human Rights Movement',
        type: 'Event',
        description: 'A social movement dedicated to securing and protecting the fundamental rights and freedoms for all individuals.',
        imageUrl: 'https://firebasestudio.app/assets/cards/human-rights.png',
        hint: 'human rights protest'
    },
    {
        id: 'e17',
        name: 'Social Influence',
        type: 'Event',
        description: 'Influenced political life',
        imageUrl: 'https://i.ibb.co/HDDqDFs3/Untitled-design-43.png',
        hint: 'political influence'
    },
    {
        id: 'e18',
        name: 'Conservation',
        type: 'Event',
        description: 'Creates national parks and preserves natural resources.',
        imageUrl: 'https://i.ibb.co/j9wNN5HM/Untitled-design-4.png',
        hint: 'nature conservation'
    },
    {
        id: 'e19',
        name: 'Panama Canal',
        type: 'Event',
        description: 'Canal connecting the Atlantic and Pacific Oceans to boost trade.',
        imageUrl: 'https://i.ibb.co/VW52khDh/Untitled-design-2.png',
        hint: 'canal trade'
    },
    {
        id: 'e20',
        name: 'Universal Declaration of Human Rights',
        type: 'Event',
        description: 'Global document guaranteeing basic human rights.',
        imageUrl: 'https://i.ibb.co/Kpcq4dz0/Untitled-design-37.png',
        hint: 'human rights'
    },
    {
        id: 'p16',
        name: 'Abraham Lincoln',
        type: 'Person',
        description: '16th President of the United States, who led the country through the Civil War and abolished slavery.',
        imageUrl: 'https://i.ibb.co/TB28Jt1Q/Untitled-design-44.png',
        hint: 'us president'
    },
    {
        id: 'p17',
        name: 'Frederick Douglass',
        type: 'Person',
        description: 'An American social reformer, abolitionist, orator, writer, and statesman. After escaping from slavery, he became a national leader of the abolitionist movement.',
        imageUrl: 'https://i.ibb.co/tMtykZvF/Untitled-design-1.png',
        hint: 'abolitionist leader'
    },
    {
        id: 'e21',
        name: 'Fireside Chats',
        type: 'Event',
        description: 'A series of evening radio addresses given by U.S. President Franklin D. Roosevelt between 1933 and 1944.',
        imageUrl: 'https://i.ibb.co/TB5dxXyC/Untitled-design-3.png',
        hint: 'radio address'
    },
    {
        id: 'p18',
        name: 'Alexander the Great',
        type: 'Person',
        description: 'A king of the ancient Greek kingdom of Macedon, he created one of the largest empires of the ancient world.',
        imageUrl: 'https://i.ibb.co/xv24Q6v/Untitled-design-6.png',
        hint: 'ancient conqueror'
    },
    {
        id: 'p19',
        name: 'Sojourner Truth',
        type: 'Person',
        description: 'An African-American abolitionist and women\'s rights activist. Truth was born into slavery but escaped with her infant daughter to freedom in 1826.',
        imageUrl: 'https://i.ibb.co/MywWdS8M/Untitled-design-7.png',
        hint: 'abolitionist activist'
    },
    {
        id: 'p20',
        name: 'George Washington',
        type: 'Person',
        description: 'First President of the United States and Commander-in-Chief of the Continental Army during the American Revolutionary War.',
        imageUrl: 'https://i.ibb.co/svGwrHSc/Untitled-design-8.png',
        hint: 'us president'
    },
    {
        id: 'p21',
        name: 'Eleanor Roosevelt',
        type: 'Person',
        description: 'An American political figure, diplomat, and activist. She served as the First Lady of the United States from 1933 to 1945.',
        imageUrl: 'https://i.ibb.co/Xfn0DGdB/Untitled-design-31.png',
        hint: 'first lady activist'
    },
    {
        id: 'p22',
        name: 'Franklin D. Roosevelt',
        type: 'Person',
        description: '32nd U.S. President, he led the nation through the Great Depression and World War II. Known for his New Deal policies and Fireside Chats.',
        imageUrl: 'https://i.ibb.co/W48bn1vL/Untitled-design-32.png',
        hint: 'us president'
    },
    {
        id: 'p23',
        name: 'Theodore Roosevelt',
        type: 'Person',
        description: '26th U.S. President, known for his "Square Deal" policies, conservationism, and leading the Rough Riders.',
        imageUrl: 'https://i.ibb.co/5W8MnRLF/Untitled-design-33.png',
        hint: 'us president'
    },
    {
        id: 'e22',
        name: 'Human Rights',
        type: 'Event',
        description: 'A movement dedicated to securing and protecting the fundamental rights and freedoms for all individuals.',
        imageUrl: 'https://i.ibb.co/5g4VXpk3/Untitled-design-34.png',
        hint: 'human rights'
    },
    {
        id: 'e23',
        name: 'Womens Suffrage',
        type: 'Event',
        description: 'A decades-long fight to win the right to vote for women in the United States, culminating in the 19th Amendment.',
        imageUrl: 'https://i.ibb.co/4wxPbL8s/Untitled-design-39.png',
        hint: 'womens rights'
    },
    {
        id: 'e24',
        name: 'Lewis and Clark Expedition',
        type: 'Event',
        description: 'A journey of discovery across the western United States, commissioned by President Thomas Jefferson shortly after the Louisiana Purchase.',
        imageUrl: 'https://i.ibb.co/yFCszdHb/Untitled-design-36.png',
        hint: 'american expedition'
    },
    {
        id: 'p24',
        name: 'Dolley Madison',
        type: 'Person',
        description: 'Wife of President James Madison, she is credited with saving the classic portrait of George Washington from the White House before it was burned by the British in 1814.',
        imageUrl: 'https://i.ibb.co/FkBPXQLN/Untitled-design-38.png',
        hint: 'first lady'
    },
    {
        id: 'e25',
        name: 'Declaration of Independence',
        type: 'Event',
        description: 'The formal statement written by Thomas Jefferson declaring the freedom of the thirteen American colonies from Great Britain.',
        imageUrl: 'https://i.ibb.co/x8s3kyvV/Untitled-design-40.png',
        hint: 'founding document'
    },
    {
        id: 'e26',
        name: 'Louisiana Purchase',
        type: 'Event',
        description: 'The acquisition of the Louisiana territory by the United States from France in 1803.',
        imageUrl: 'https://i.ibb.co/KzGSYdgM/Untitled-design-41.png',
        hint: 'territory acquisition'
    },
    {
        id: 'p25',
        name: 'Rosa Parks',
        type: 'Person',
        description: 'An activist in the civil rights movement best known for her pivotal role in the Montgomery bus boycott.',
        imageUrl: 'https://i.ibb.co/w11Zjw3/Untitled-design-42.png',
        hint: 'civil rights activist'
    },
    {
        id: 'p26',
        name: 'Chief Sitting Bull',
        type: 'Person',
        description: 'A Hunkpapa Lakota leader who led his people during years of resistance against United States government policies.',
        imageUrl: 'https://i.ibb.co/C3btpR3C/Untitled-design-45.png',
        hint: 'native american leader'
    },
    {
        id: 'p27',
        name: 'Nelson Mandela',
        type: 'Person',
        description: 'A South African anti-apartheid revolutionary and political leader who served as President of South Africa from 1994 to 1999.',
        imageUrl: 'https://i.ibb.co/tp2S8S36/Untitled-design-47.png',
        hint: 'south african leader'
    },
    {
        id: 'p28',
        name: 'Betsey Ross',
        type: 'Person',
        description: 'An American upholsterer who was credited by her relatives in 1870 with making the first American flag.',
        imageUrl: 'https://i.ibb.co/jvBBfxRz/Untitled-design-48.png',
        hint: 'american flag'
    },
    {
        id: 'p29',
        name: 'Winston Churchill',
        type: 'Person',
        description: 'A British statesman, soldier, and writer who served as Prime Minister of the United Kingdom during the Second World War.',
        imageUrl: 'https://i.ibb.co/Mkvh2DTS/Untitled-design-49.png',
        hint: 'british prime minister'
    },
    {
        id: 'e27',
        name: 'Underground Railroad',
        type: 'Event',
        description: 'A network of secret routes and safe houses used by enslaved African Americans to escape into free states and Canada.',
        imageUrl: 'https://i.ibb.co/C5pvn437/Untitled-design-50.png',
        hint: 'escape network'
    },
    {
        id: 'e28',
        name: 'I Have a Dream Speech',
        type: 'Event',
        description: 'A public speech delivered by American civil rights activist Martin Luther King Jr. during the March on Washington for Jobs and Freedom on August 28, 1963.',
        imageUrl: 'https://i.ibb.co/9kRWjVdw/Untitled-design-52.png',
        hint: 'historic speech'
    },
    {
        id: 'p30',
        name: 'Mahatma Gandhi',
        type: 'Person',
        description: 'An Indian lawyer, anti-colonial nationalist, and political ethicist, who employed nonviolent resistance to lead the successful campaign for India\'s independence from British Rule.',
        imageUrl: 'https://i.ibb.co/4gZ937Kw/Untitled-design-53.png',
        hint: 'indian leader'
    },
    {
        id: 'p31',
        name: 'Aaron Burr',
        type: 'Person',
        description: 'An American politician and lawyer who served as the third Vice President of the United States. He is infamous for his duel with Alexander Hamilton.',
        imageUrl: 'https://i.ibb.co/DDRGWTLC/Untitled-design-54.png',
        hint: 'american politician'
    },
    {
        id: 'p32',
        name: 'Sacagawea',
        type: 'Person',
        description: 'A Lemhi Shoshone woman who, in her teens, helped the Lewis and Clark Expedition in achieving their chartered mission objectives by exploring the Louisiana Territory.',
        imageUrl: 'https://i.ibb.co/m5qPBJ6H/Untitled-design-55.png',
        hint: 'native american guide'
    },
    {
        id: 'p33',
        name: 'Harriet Tubman',
        type: 'Person',
        description: 'An American abolitionist and political activist who escaped slavery and made some 13 missions to rescue approximately 70 enslaved people.',
        imageUrl: 'https://i.ibb.co/nMnY5rGs/Untitled-design-56.png',
        hint: 'abolitionist activist'
    },
    {
        id: 'p34',
        name: 'Catherine the Great',
        type: 'Person',
        description: 'The last reigning Empress Regnant of Russia and the country\'s longest-ruling female leader.',
        imageUrl: 'https://i.ibb.co/hj7V5Ct/Untitled-design-57.png',
        hint: 'russian empress'
    },
    {
        id: 'e29',
        name: 'Revolutionary War',
        type: 'Event',
        description: 'The armed conflict between Great Britain and thirteen of its North American colonies, which had declared themselves the independent United States of America.',
        imageUrl: 'https://i.ibb.co/S4dNB7ZG/Untitled-design-58.png',
        hint: 'american war'
    },
    {
        id: 'e30',
        name: 'President of the United States',
        type: 'Event',
        description: 'The head of state and head of government of the United States of America. The president leads the executive branch of the federal government.',
        imageUrl: 'https://i.ibb.co/ZRNczRfd/Untitled-design-59.png',
        hint: 'us presidency'
    },
    {
        id: 'e31',
        name: 'Founding Fathers',
        type: 'Event',
        description: 'A group of American leaders who united the Thirteen Colonies, led the war for independence from Great Britain, and built a frame of government for the new United States.',
        imageUrl: 'https://i.ibb.co/bjmLJxD6/Untitled-design-60.png',
        hint: 'american leaders'
    },
    {
        id: 'p35',
        name: 'Susan B. Anthony',
        type: 'Person',
        description: 'An American social reformer and women\'s rights activist who played a pivotal role in the women\'s suffrage movement.',
        imageUrl: 'https://i.ibb.co/wZpPQ5Y4/Untitled-design-61.png',
        hint: 'womens suffrage'
    },
    {
        id: 'p36',
        name: 'George III',
        type: 'Person',
        description: 'King of Great Britain and Ireland during the American Revolution.',
        imageUrl: 'https://i.ibb.co/gZFhLBfk/Untitled-design-62.png',
        hint: 'british king'
    },
    {
        id: 'p37',
        name: 'Alexander Hamilton',
        type: 'Person',
        description: 'A Founding Father of the United States, chief staff aide to General George Washington, and the first Secretary of the Treasury.',
        imageUrl: 'https://i.ibb.co/Lz2XDN2j/Untitled-design-63.png',
        hint: 'founding father'
    },
    {
        id: 'p38',
        name: 'Thomas Jefferson',
        type: 'Person',
        description: 'A Founding Father, the principal author of the Declaration of Independence, and the third President of the United States.',
        imageUrl: 'https://i.ibb.co/0VVKGGwn/Untitled-design-64.png',
        hint: 'founding father'
    },
    {
        id: 'p39',
        name: 'John Adams',
        type: 'Person',
        description: 'A Founding Father, the first Vice President, and the second President of the United States.',
        imageUrl: 'https://i.ibb.co/4gVCBGKg/Untitled-design-65.png',
        hint: 'founding father'
    },
    {
        id: 'p40',
        name: 'Napoleon Bonaparte',
        type: 'Person',
        description: 'A French military and political leader who rose to prominence during the French Revolution.',
        imageUrl: 'https://i.ibb.co/1f67QDSX/Untitled-design-66.png',
        hint: 'french emperor'
    },
    {
        id: 'e32',
        name: 'American Flag Creation',
        type: 'Event',
        description: 'The official creation of the first American flag, a symbol of independence and unity for the new nation.',
        imageUrl: 'https://i.ibb.co/JR68yZV0/Untitled-design-67.png',
        hint: 'national symbol'
    },
    {
        id: 'e33',
        name: 'Emancipation Proclamation',
        type: 'Event',
        description: 'Issued by President Abraham Lincoln in 1863, it declared that all enslaved people in Confederate states in rebellion against the Union were to be set free.',
        imageUrl: 'https://i.ibb.co/xKjNpccv/Untitled-design-68.png',
        hint: 'historical document'
    },
    {
        id: 'p41',
        name: 'Ulysses S. Grant',
        type: 'Person',
        description: 'The 18th President of the United States and the commanding general of the Union Army in the American Civil War.',
        imageUrl: 'https://i.ibb.co/CsYMy8nf/Untitled-design-69.png',
        hint: 'us president general'
    },
    {
        id: 'e34',
        name: 'Famous speech',
        type: 'Event',
        description: 'This person has a famous speech',
        imageUrl: 'https://i.ibb.co/d9mjshq/Untitled-design-70.png',
        hint: 'famous speech'
    },
    {
        id: 'e35',
        name: 'Civil War',
        type: 'Event',
        description: 'A war fought in the United States from 1861 to 1865, between the Union and the Confederacy.',
        imageUrl: 'https://i.ibb.co/KpGc1rbs/Untitled-design-71.png',
        hint: 'american war'
    },
    {
        id_card: 'e36',
        name: 'Confederate Army',
        type: 'Event',
        description: 'The military land force of the Confederate States of America during the American Civil War.',
        imageUrl: 'https://i.ibb.co/dwkSGnyb/Untitled-design-72.png',
        hint: 'civil war army'
    },
    {
        id: 'p42',
        name: 'Robert E. Lee',
        type: 'Person',
        description: 'Commander of the Confederate States Army during the American Civil War.',
        imageUrl: 'https://i.ibb.co/cX8rv9Hw/Untitled-design-73.png',
        hint: 'confederate general'
    },
    {
        id: 'e37',
        name: 'War',
        type: 'Event',
        description: 'This person was involved in a war',
        imageUrl: 'https://i.ibb.co/vx1zJPhB/Untitled-design-77.png',
        hint: 'person involved war'
    },
    {
        id: 'e38',
        name: 'Duel',
        type: 'Event',
        description: 'A formal combat between two individuals with matched weapons.',
        imageUrl: 'https://i.ibb.co/pjpfk6zj/Untitled-design-78.png',
        hint: 'combat fight'
    },
    {
        id: 'e39',
        name: 'Treasury System',
        type: 'Event',
        description: 'The financial system of the United States, established by Alexander Hamilton.',
        imageUrl: 'https://i.ibb.co/JjTPpGHP/Untitled-design-79.png',
        hint: 'financial system'
    },
    {
        id: 'e40',
        name: 'Federalist Papers',
        type: 'Event',
        description: 'A series of 85 essays written by Alexander Hamilton, James Madison, and John Jay promoting the ratification of the United States Constitution.',
        imageUrl: 'https://i.ibb.co/d00XtdYM/Untitled-design-80.png',
        hint: 'constitutional essays'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/card.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Card": (()=>Card),
    "CardContent": (()=>CardContent),
    "CardDescription": (()=>CardDescription),
    "CardFooter": (()=>CardFooter),
    "CardHeader": (()=>CardHeader),
    "CardTitle": (()=>CardTitle)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Card = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-lg border bg-card text-card-foreground shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 9,
        columnNumber: 3
    }, this));
_c1 = Card;
Card.displayName = "Card";
const CardHeader = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 p-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 24,
        columnNumber: 3
    }, this));
_c3 = CardHeader;
CardHeader.displayName = "CardHeader";
const CardTitle = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-2xl font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 36,
        columnNumber: 3
    }, this));
_c5 = CardTitle;
CardTitle.displayName = "CardTitle";
const CardDescription = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 51,
        columnNumber: 3
    }, this));
_c7 = CardDescription;
CardDescription.displayName = "CardDescription";
const CardContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 63,
        columnNumber: 3
    }, this));
_c9 = CardContent;
CardContent.displayName = "CardContent";
const CardFooter = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 71,
        columnNumber: 3
    }, this));
_c11 = CardFooter;
CardFooter.displayName = "CardFooter";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "Card$React.forwardRef");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "CardHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "CardHeader");
__turbopack_context__.k.register(_c4, "CardTitle$React.forwardRef");
__turbopack_context__.k.register(_c5, "CardTitle");
__turbopack_context__.k.register(_c6, "CardDescription$React.forwardRef");
__turbopack_context__.k.register(_c7, "CardDescription");
__turbopack_context__.k.register(_c8, "CardContent$React.forwardRef");
__turbopack_context__.k.register(_c9, "CardContent");
__turbopack_context__.k.register(_c10, "CardFooter$React.forwardRef");
__turbopack_context__.k.register(_c11, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/button.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Button": (()=>Button),
    "buttonVariants": (()=>buttonVariants)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/button.tsx",
        lineNumber: 46,
        columnNumber: 7
    }, this);
});
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/popover.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Popover": (()=>Popover),
    "PopoverContent": (()=>PopoverContent),
    "PopoverTrigger": (()=>PopoverTrigger)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-popover/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const Popover = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const PopoverTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"];
const PopoverContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, align = "center", sideOffset = 4, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            ref: ref,
            align: align,
            sideOffset: sideOffset,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
            ...props
        }, void 0, false, {
            fileName: "[project]/src/components/ui/popover.tsx",
            lineNumber: 17,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/popover.tsx",
        lineNumber: 16,
        columnNumber: 3
    }, this));
_c1 = PopoverContent;
PopoverContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "PopoverContent$React.forwardRef");
__turbopack_context__.k.register(_c1, "PopoverContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/game/GameCard.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "GameCard": (()=>GameCard)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/history.js [app-client] (ecmascript) <export default as History>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$help$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-help.js [app-client] (ecmascript) <export default as HelpCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/popover.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function GameCard({ card, isSelected, onSelect, className, isPlayerCard, otherPlayers, onAsk }) {
    if (card === 'back') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-[220px] h-[320px] bg-card flex items-center justify-center border-4 border-card/50 shadow-lg overflow-hidden", className),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full h-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    src: "https://i.ibb.co/LddKckY6/Untitled-design-81.png",
                    alt: "Go Hist Card Back",
                    fill: true,
                    className: "object-cover",
                    "data-ai-hint": "card back"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/GameCard.tsx",
                    lineNumber: 26,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/GameCard.tsx",
                lineNumber: 25,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/game/GameCard.tsx",
            lineNumber: 24,
            columnNumber: 7
        }, this);
    }
    const handleSelect = ()=>{
        if (onSelect) {
            onSelect(card);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative', className),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            onClick: handleSelect,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-[220px] h-[320px] flex flex-col cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg border-4", isSelected ? 'border-ring shadow-2xl scale-105' : 'border-card', onSelect ? '' : 'cursor-default hover:scale-100'),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                    className: "p-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                            className: "font-headline text-lg leading-tight truncate",
                            children: card.name
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/GameCard.tsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center space-x-2",
                            children: [
                                card.type === 'Person' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                    className: "w-4 h-4 text-muted-foreground"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/GameCard.tsx",
                                    lineNumber: 57,
                                    columnNumber: 39
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"], {
                                    className: "w-4 h-4 text-muted-foreground"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/GameCard.tsx",
                                    lineNumber: 57,
                                    columnNumber: 92
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                    children: card.type
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/GameCard.tsx",
                                    lineNumber: 58,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/GameCard.tsx",
                            lineNumber: 56,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/GameCard.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                    className: "p-0 flex-grow",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative w-full h-[120px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: card.imageUrl,
                                alt: card.name,
                                fill: true,
                                className: "object-cover",
                                "data-ai-hint": card.hint
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/GameCard.tsx",
                                lineNumber: 63,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/GameCard.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs p-3 text-foreground/80 leading-snug",
                            children: card.description
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/GameCard.tsx",
                            lineNumber: 71,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/GameCard.tsx",
                    lineNumber: 61,
                    columnNumber: 9
                }, this),
                isPlayerCard && card.type === 'Person' && onAsk && otherPlayers && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardFooter"], {
                    className: "p-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverTrigger"], {
                                asChild: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "secondary",
                                    size: "sm",
                                    className: "w-full",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$help$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"], {
                                            className: "mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/GameCard.tsx",
                                            lineNumber: 78,
                                            columnNumber: 19
                                        }, this),
                                        " Ask for Card"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/GameCard.tsx",
                                    lineNumber: 77,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/GameCard.tsx",
                                lineNumber: 76,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverContent"], {
                                className: "w-auto p-1",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "p-2 text-sm font-medium",
                                            children: "Ask which opponent?"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/GameCard.tsx",
                                            lineNumber: 83,
                                            columnNumber: 19
                                        }, this),
                                        otherPlayers.map((player)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                className: "justify-start",
                                                onClick: ()=>onAsk(player.id, card.name),
                                                children: player.name
                                            }, player.id, false, {
                                                fileName: "[project]/src/components/game/GameCard.tsx",
                                                lineNumber: 85,
                                                columnNumber: 21
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/GameCard.tsx",
                                    lineNumber: 82,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/GameCard.tsx",
                                lineNumber: 81,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/GameCard.tsx",
                        lineNumber: 75,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/game/GameCard.tsx",
                    lineNumber: 74,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/GameCard.tsx",
            lineNumber: 46,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/GameCard.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
}
_c = GameCard;
var _c;
__turbopack_context__.k.register(_c, "GameCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/deck-editor/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>DeckEditorPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mock-data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$GameCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/GameCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
function DeckEditorPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-background text-foreground p-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "flex items-center justify-between mb-8 border-b pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-4xl font-headline text-primary",
                        children: "Deck Editor"
                    }, void 0, false, {
                        fileName: "[project]/src/app/deck-editor/page.tsx",
                        lineNumber: 13,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                    className: "w-4 h-4 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deck-editor/page.tsx",
                                    lineNumber: 16,
                                    columnNumber: 13
                                }, this),
                                "Back to Home"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/deck-editor/page.tsx",
                            lineNumber: 15,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/deck-editor/page.tsx",
                        lineNumber: 14,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/deck-editor/page.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DECK"].map((card)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$GameCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GameCard"], {
                                card: card
                            }, void 0, false, {
                                fileName: "[project]/src/app/deck-editor/page.tsx",
                                lineNumber: 24,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-muted-foreground",
                                children: [
                                    "ID: ",
                                    card.id
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/deck-editor/page.tsx",
                                lineNumber: 25,
                                columnNumber: 13
                            }, this)
                        ]
                    }, card.id, true, {
                        fileName: "[project]/src/app/deck-editor/page.tsx",
                        lineNumber: 23,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/deck-editor/page.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "mt-8 text-center text-muted-foreground text-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "To edit a card, modify the `DECK` array in the ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                className: "font-mono bg-muted px-1 py-0.5 rounded",
                                children: "src/lib/mock-data.ts"
                            }, void 0, false, {
                                fileName: "[project]/src/app/deck-editor/page.tsx",
                                lineNumber: 30,
                                columnNumber: 59
                            }, this),
                            " file."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/deck-editor/page.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "You can change names, descriptions, and image URLs directly in the code."
                    }, void 0, false, {
                        fileName: "[project]/src/app/deck-editor/page.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/deck-editor/page.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/deck-editor/page.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = DeckEditorPage;
var _c;
__turbopack_context__.k.register(_c, "DeckEditorPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_dd1828cf._.js.map