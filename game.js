const $ = id => document.getElementById(id);
let mode = 'all', questions = [], index = 0, score = 0, locked = false, best = 0;
try { best = Number(localStorage.getItem('orbita-sixth-best')) || 0; } catch {}
$('record').textContent = `RECORDE · ${best}`;

const bank = [
  ['operations','Quanto é 348 + 276?','624',['614','634','524'],'Some unidades, dezenas e centenas, alinhando os valores: 348 + 276 = 624.'],
  ['operations','Quanto é 900 − 457?','443',['453','543','433'],'Faça a subtração com calma, começando pelas unidades: 900 − 457 = 443.'],
  ['operations','Quanto é 24 × 6?','144',['124','134','164'],'24 grupos de 6: 20 × 6 = 120 e 4 × 6 = 24. Junte: 144.'],
  ['operations','Quanto é 144 ÷ 12?','12',['10','11','14'],'Pense: 12 vezes qual número dá 144? Como 12 × 12 = 144, a resposta é 12.'],
  ['fractions','Quanto é 1/2 + 1/4?','3/4',['2/6','1/6','2/4'],'Para somar, use o mesmo denominador: 1/2 = 2/4. Então 2/4 + 1/4 = 3/4.'],
  ['fractions','Quanto é 3/4 − 1/4?','1/2',['2/8','2/4','1/4'],'Os denominadores são iguais. Subtraia os numeradores: 3/4 − 1/4 = 2/4, que simplifica para 1/2.'],
  ['fractions','Qual fração é equivalente a 2/3?','4/6',['3/6','2/6','4/9'],'Multiplique o numerador e o denominador por 2: 2/3 = 4/6.'],
  ['fractions','Quanto é 1/3 de 18?','6',['3','9','12'],'Divida 18 em 3 partes iguais: 18 ÷ 3 = 6.'],
  ['decimals','Quanto é 3,5 + 2,25?','5,75',['5,30','5,65','6,75'],'Alinhe as vírgulas e complete com zero: 3,50 + 2,25 = 5,75.'],
  ['decimals','Quanto é 8,4 − 3,7?','4,7',['5,3','4,3','5,7'],'Alinhe as vírgulas: 8,4 − 3,7 = 4,7.'],
  ['decimals','Quanto é 0,6 × 5?','3',['0,30','3,0','2,5'],'6 décimos vezes 5 são 30 décimos, ou seja, 3.'],
  ['decimals','Quanto é 4,8 ÷ 2?','2,4',['2,2','2,6','24'],'Metade de 4,8 é 2,4.'],
  ['logic','Qual é o próximo número? 5, 10, 15, 20, __','25',['22','30','24'],'A sequência aumenta de 5 em 5. Depois de 20 vem 25.'],
  ['logic','Qual é o menor número primo?','2',['1','0','3'],'O menor número primo é 2. Ele tem exatamente dois divisores: 1 e 2.'],
  ['logic','Qual destes números é múltiplo de 9?','63',['62','64','56'],'63 é múltiplo de 9 porque 9 × 7 = 63.'],
  ['logic','Qual é o maior divisor comum de 12 e 18?','6',['3','9','12'],'Os divisores comuns incluem 1, 2, 3 e 6. O maior deles é 6.'],
  ['geometry','Um retângulo mede 8 cm por 3 cm. Qual é o perímetro?','22 cm',['11 cm','24 cm','16 cm'],'Perímetro é a soma dos lados: 8 + 3 + 8 + 3 = 22 cm.'],
  ['geometry','Um quadrado tem lado de 5 cm. Qual é sua área?','25 cm²',['20 cm²','10 cm²','15 cm²'],'Área do quadrado = lado × lado: 5 × 5 = 25 cm².'],
  ['geometry','Um triângulo tem lados de 4, 5 e 6 cm. Qual é o perímetro?','15 cm',['14 cm','15 cm²','120 cm'],'Some os três lados: 4 + 5 + 6 = 15 cm.'],
  ['geometry','Quantos graus tem um ângulo reto?','90°',['45°','180°','360°'],'Um ângulo reto mede 90 graus.'],
  ['expressions','Resolva: 6 + 3 × 4','18',['36','24','15'],'Faça a multiplicação antes da adição: 3 × 4 = 12; depois 6 + 12 = 18.'],
  ['expressions','Resolva: (10 − 4) ÷ 2','3',['8','4','6'],'Primeiro resolva o que está entre parênteses: 10 − 4 = 6. Depois 6 ÷ 2 = 3.'],
  ['expressions','Resolva: 20 − 2 × 5','10',['90','15','18'],'A multiplicação vem antes da subtração: 2 × 5 = 10; 20 − 10 = 10.'],
  ['percent','Quanto é 50% de 80?','40',['20','30','50'],'50% significa metade. A metade de 80 é 40.'],
  ['percent','Quanto é 25% de 100?','25',['20','40','75'],'25% é um quarto. Um quarto de 100 é 25.'],
  ['percent','Uma camiseta custa R$ 40 e tem desconto de R$ 10. Qual é o percentual de desconto?','25%',['10%','20%','40%'],'R$ 10 é um quarto de R$ 40. Um quarto corresponde a 25%.']
];
const labels = {operations:'OPERAÇÕES',fractions:'FRAÇÕES',decimals:'NÚMEROS DECIMAIS',logic:'MÚLTIPLOS E DIVISORES',geometry:'GEOMETRIA',expressions:'EXPRESSÕES NUMÉRICAS',percent:'PORCENTAGEM'};
const shuffle = arr => { for (let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]} return arr };
function makeQuestion(row){ return {type:row[0],expression:row[1],answer:row[2],options:shuffle([row[2],...row[3]]),explanation:row[4]}; }
document.querySelectorAll('.mode').forEach(btn=>btn.onclick=()=>{mode=btn.dataset.mode;document.querySelectorAll('.mode').forEach(b=>{const selected=b===btn;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',selected);b.querySelector('i').textContent=selected?'✓':''})});
function start(){index=0;score=0;const rows=mode==='all'?bank:bank.filter(q=>q[0]===mode);questions=mode==='all'?shuffle([...rows]).slice(0,10).map(makeQuestion):Array.from({length:10},()=>makeQuestion(rows[Math.floor(Math.random()*rows.length)]));$('setup').hidden=true;$('results').hidden=true;$('play').hidden=false;render()}
function render(){locked=false;const q=questions[index];$('round').textContent=`DESAFIO ${index+1} DE ${questions.length}`;$('score').textContent=`${score} pontos`;$('progress').style.width=`${index/questions.length*100}%`;$('kind').textContent=labels[q.type];$('equation').textContent=q.expression;$('feedback').textContent='';$('next').hidden=true;$('answers').replaceChildren();q.options.forEach(value=>{const b=document.createElement('button');b.className='answer';b.textContent=value;b.onclick=()=>answer(value,b);$('answers').append(b)});}
function answer(value,button){if(locked)return;locked=true;const q=questions[index],correct=value===q.answer;if(correct)score+=100;[...$('answers').children].forEach(b=>{b.disabled=true;if(b.textContent===q.answer)b.classList.add('correct')});if(!correct)button.classList.add('wrong');$('score').textContent=`${score} pontos`;$('feedback').replaceChildren();const title=document.createElement('strong');title.textContent=correct?'✦ Isso mesmo!':'Vamos aprender juntos!';const text=document.createElement('span');text.textContent=q.explanation;$('feedback').append(title,text);$('next').hidden=false;$('next').innerHTML=index===questions.length-1?'Ver resultado <span>↗</span>':'Próximo desafio <span>→</span>';$('progress').style.width=`${(index+1)/questions.length*100}%`}
function finish(){$('play').hidden=true;$('results').hidden=false;$('result-title').textContent=score>=800?'Mandou muito bem!':score>=500?'Boa exploração!':'Continue praticando!';$('result-score').textContent=`${score/100} de ${questions.length} acertos · ${score} pontos`;if(score>best){best=score;try{localStorage.setItem('orbita-sixth-best',String(best))}catch{}$('record').textContent=`RECORDE · ${best}`}}
$('start').onclick=start;$('next').onclick=()=>{if(!locked)return;index++;if(index===questions.length)finish();else render()};function home(){$('play').hidden=true;$('results').hidden=true;$('setup').hidden=false}$('quit').onclick=home;$('again').onclick=home;
