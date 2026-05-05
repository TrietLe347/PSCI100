const {useState,useEffect,useRef}=React;const h=React.createElement;

const SECTIONS=[
  {id:'branches',label:'Branches'},
  {id:'bill',label:'Bill → Law'},
  {id:'simulation',label:'Simulation'},
  {id:'checks',label:'Checks'},
  {id:'matters',label:'Why It Matters'},
  {id:'quiz',label:'Quiz'},
];

const BILL_STEPS=[
  {id:0,cls:'s0',num:'1',title:'Bill Introduced',desc:"A member of Congress introduces a new bill (idea for a law). This is the first step in the process."},
  {id:1,cls:'s1',num:'2',title:'Committee Review',desc:"A small group in Congress (committee) reviews the bill. They can change it, approve it, or stop it."},
  {id:2,cls:'s2',num:'3',title:'House Floor Vote',desc:"The House of Representatives debates and votes on the bill. It needs enough votes to move forward."},
  {id:3,cls:'s3',num:'4',title:'Senate Vote',desc:"The Senate also debates and votes. Both the House and Senate must agree on the same version."},
  {id:4,cls:'s4',num:'5',title:'President\'s Decision',desc:"The President decides what to do. They can sign the bill into law or reject it (veto)."},
  {id:5,cls:'s5',num:'✓',title:'Becomes Law',desc:"If approved, the bill becomes a law and is put into action."},
];

const SIM_STAGES=[
  {
    id:'committee',
    label:'Committee',
    question:'The bill is being reviewed. What should happen?',
    choices:[
      {id:'approve',label:'✓ Move the bill forward',cls:'choice-approve',next:'house'},
      {id:'reject',label:'✗ Stop the bill here',cls:'choice-reject',next:'dead_committee'},
    ]
  },
  {
    id:'house',
    label:'House Vote',
    question:'The bill is being voted on in the House. What is the result?',
    choices:[
      {id:'approve',label:'✓ It passes',cls:'choice-approve',next:'senate'},
      {id:'reject',label:'✗ It fails',cls:'choice-reject',next:'dead_house'},
    ]
  },
  {
    id:'senate',
    label:'Senate Vote',
    question:'The Senate is now voting on the bill. What happens?',
    choices:[
      {id:'approve',label:'✓ It passes',cls:'choice-approve',next:'president'},
      {id:'reject',label:'✗ It fails',cls:'choice-reject',next:'dead_senate'},
    ]
  },
  {
    id:'president',
    label:'President',
    question:'The bill reaches the President. What do they decide?',
    choices:[
      {id:'approve',label:'✓ Sign the bill',cls:'choice-approve',next:'law'},
      {id:'veto',label:'✗ Reject (veto)',cls:'choice-reject',next:'override'},
    ]
  },
  {
    id:'override',
    label:'Override Vote',
    question:'The President rejected the bill. Can Congress still pass it?',
    choices:[
      {id:'override',label:'⚡ Yes, override the veto',cls:'choice-override',next:'law'},
      {id:'sustain',label:'· No, the bill fails',cls:'choice-sustain',next:'dead_veto'},
    ]
  },
];

const OUTCOMES={
  law:{
    type:'pass',
    msg:'🎉 The bill became a law! This means it was approved by Congress and the President (or Congress overrode a veto).'
  },
  dead_committee:{
    type:'fail',
    msg:'The bill stopped in committee. This happens often because not all ideas move forward.'
  },
  dead_house:{
    type:'fail',
    msg:'The bill did not pass in the House. It didn’t get enough votes.'
  },
  dead_senate:{
    type:'fail',
    msg:'The bill failed in the Senate. Both chambers must agree for a bill to move forward.'
  },
  dead_veto:{
    type:'fail',
    msg:'The President rejected the bill, and Congress could not override the veto.'
  },
};

const QUIZ=[
  {q:'Which Article of the Constitution establishes the Executive Branch?',opts:['Article I','Article II','Article III','Article IV'],ans:1,exp:'Article II establishes the Executive Branch, outlining presidential powers, the Electoral College, and the process for impeachment.'},
  {q:'What fraction of Congress is needed to override a presidential veto?',opts:['Simple majority (51%)','Two-thirds of both chambers','Three-quarters of states','Unanimous consent'],ans:1,exp:'The Constitution requires a two-thirds supermajority in BOTH the House and Senate to override a presidential veto — a high bar designed to make vetoes meaningful.'},
  {q:'Which type of Supreme Court opinion is written by a justice who AGREES with the outcome but for different reasons?',opts:['Majority opinion','Dissenting opinion','Concurring opinion','Advisory opinion'],ans:2,exp:'A concurring opinion is written by a justice on the majority side who agrees with the result but wants to express additional or different reasoning.'},
  {q:'What is an "executive order"?',opts:['A law passed by Congress','A presidential directive with the force of law, issued without Congress','A Supreme Court ruling','A Cabinet recommendation'],ans:1,exp:'An executive order is a presidential directive that has the force of law. Presidents use the "take care clause" (Article II, Section 3) as authority. Congress can pass legislation to overturn it.'},
  {q:'How many federal appellate (circuit) courts are there?',opts:['9','12','13','50'],ans:2,exp:'There are 13 appellate courts in the federal system: 12 regional circuits plus 1 Court of Appeals for the Federal Circuit. California is in the 9th Circuit.'},
];

function App(){
  const [active,setActive]=useState('hero');
  const [scroll,setScroll]=useState(0);
  useEffect(()=>{
    const onScroll=()=>{
      const s=window.scrollY;const h=document.body.scrollHeight-window.innerHeight;
      setScroll(h>0?s/h*100:0);
      let cur='hero';
      for(const sec of SECTIONS){
        const el=document.getElementById(sec.id);
        if(el&&el.getBoundingClientRect().top<=80)cur=sec.id;
      }
      setActive(cur);
    };
    window.addEventListener('scroll',onScroll,{passive:true});
    return()=>window.removeEventListener('scroll',onScroll);
  },[]);
  const scrollTo=id=>{const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth'})};
  return h('div',{className:'app'},
    h('div',{className:'scroll-bar',style:{width:scroll+'%'}}),
    h('nav',null,
      h('div',{className:'nav-inner'},
        h('span',{className:'nav-logo'},'U.S. Government'),
        h('div',{className:'nav-links'},
          SECTIONS.map(s=>h('button',{key:s.id,className:'nav-btn'+(active===s.id?' active':''),onClick:()=>scrollTo(s.id)},s.label))
        )
      )
    ),
    h(Hero,{onStart:()=>scrollTo('branches')}),
    h('section',{id:'branches',className:'section section-alt'},h(Branches,null)),
    h('section',{id:'bill',className:'section'},h(BillSection,null)),
    h('section',{id:'simulation',className:'section section-alt'},h(SimSection,null)),
    h('section',{id:'checks',className:'section'},h(ChecksSection,null)),
    h('section',{id:'matters',className:'section section-alt'},h(MattersSection,null)),
    h('section',{id:'quiz',className:'section'},h(QuizSection,null)),
    h('footer',null,h('p',null,'Political Science Project — Based on lecture slides covering Chapters 2, 11, 12, and 13. ',h('strong',null,'U.S. Government Structure & Legislative Process.')))
  );
}

function Hero({onStart}){
  return h('section',{className:'hero'},
    h('div',{className:'hero-stars'}),
    h('div',{className:'hero-content'},
      h('div',{className:'hero-badge'},'Political Science Project - Minh Triet Le'),
      h('h1',null,'How a Bill Becomes a Law ',h('em',null,'& How Checks and Balances Work')),
      h('p',{className:'hero-sub'},'An interactive journey through the three branches of the U.S. government, the legislative process, and the constitutional system of checks and balances.'),
      h('div',{className:'hero-btns'},
        h('button',{className:'btn-primary',onClick:onStart},'Start Exploring'),
        h('button',{className:'btn-outline',onClick:()=>document.getElementById('simulation').scrollIntoView({behavior:'smooth'})},'Try Simulation')
      ),
      h('div',{className:'hero-tags'},
        ['Article I — Legislature','Article II — Executive','Article III — Judiciary','Checks & Balances','Veto & Override'].map(t=>h('span',{key:t,className:'tag'},t))
      )
    )
  );
}

function Branches(){
  const cards=[
    {cls:'leg',icon:'🏛️',name:'Legislative Branch',auth:'Article I',sub:'U.S. Congress — House & Senate',powers:[
    "Makes laws for the country",
    "Includes the House of Representatives and the Senate",
    "Members are elected by the people",
    "Can approve or reject laws",
    "Can override a president’s veto"
    ]},

    {cls:'exec',icon:'⭐',name:'Executive Branch',auth:'Article II',sub:'President, Cabinet & Agencies',powers:[
    "Carries out and enforces laws",
    "Led by the President",
    "The President can approve or reject laws",
    "Responsible for running the government",
    "Includes departments like defense, education, and health"
    ]
    },
    {cls:'jud',icon:'⚖️',name:'Judicial Branch',auth:'Article III',sub:'Supreme Court & Federal Courts',powers:[
    "Explains and interprets laws",
    "Includes the Supreme Court and other courts",
    "Decides if laws follow the Constitution",
    "Can stop laws that are unconstitutional",
    "Judges serve for a long time to stay independent"
    ]},
  ];
  return h('div',{className:'container'},
    h('p',{className:'section-label'},'Section 1'),
    h('h2',{className:'section-title'},'The Three Branches of Government'),
    h('p',{className:'section-sub'},'The Constitution divides federal power among three co-equal branches, each with distinct roles and the ability to limit the others.'),
    h('div',{className:'branches'},
      cards.map(c=>h('div',{key:c.cls,className:'branch-card'},
        h('div',{className:'branch-header'},
          h('div',{className:'branch-icon'},c.icon),
          h('h3',null,c.name),
          h('p',null,c.auth,' — ',c.sub)
        ),
        h('div',{className:'branch-body'},
          h('ul',null,c.powers.map((p,i)=>h('li',{key:i},p)))
        )
      ))
    )
  );
}

function BillSection(){
  const [active,setActive]=useState(null);
  return h('div',{className:'container'},
    h('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'3rem',alignItems:'start'}},
      h('div',null,
        h('p',{className:'section-label'},'Section 2'),
        h('h2',{className:'section-title'},'How a Bill Becomes a Law'),
        h('p',{className:'section-sub'},'Click each step to learn more. Most bills die in committee — only a small fraction become law.'),
        h('div',{className:'bill-track'},
          BILL_STEPS.map(step=>h('div',{key:step.id,className:'bill-step '+step.cls+(active===step.id?' active':''),onClick:()=>setActive(active===step.id?null:step.id)},
            h('div',{className:'step-circle'},step.num),
            h('div',{className:'step-body'},
              h('p',{className:'step-title'},step.title),
              h('p',{className:'step-desc'},step.desc),
              step.id===4&&active===4&&h('div',{className:'veto-branch'},
                h('h4',null,'If vetoed…'),
                h('p',null,'Congress can override with a two-thirds vote in BOTH chambers. If they cannot, the bill dies — this is how the Executive checks the Legislature.')
              )
            )
          ))
        )
      ),
      h('div',{style:{position:'sticky',top:'80px'}},
        h('div',{style:{background:'linear-gradient(135deg,#0a1628,#1e2e52)',borderRadius:'16px',padding:'2rem',color:'#fff'}},
          h('h3',{style:{fontFamily:'Playfair Display',fontSize:'1.2rem',color:'#e8c96a',marginBottom:'1rem'}},'Key Terms'),
          [
            {t:'Standing Committee',d:'Permanent committees that specialize in specific policy areas and review bills.'},
            {t:'Pocket Veto',d:'President does not sign within 10 days and Congress adjourns — bill dies.'},
            {t:'Conference Committee',d:'Joint committee that reconciles differences between House and Senate versions.'},
            {t:'Necessary & Expedient Clause',d:'Art. II §3 — authorizes the President to recommend legislation to Congress.'},
            {t:'Veto Override',d:'Two-thirds majority in BOTH chambers defeats a presidential veto.'},
          ].map(k=>h('div',{key:k.t,style:{marginBottom:'.9rem',paddingBottom:'.9rem',borderBottom:'1px solid rgba(255,255,255,.1)'}},
            h('p',{style:{fontSize:'.85rem',fontWeight:700,color:'#c9a84c',marginBottom:'.2rem'}},k.t),
            h('p',{style:{fontSize:'.8rem',color:'rgba(255,255,255,.65)',lineHeight:'1.5'}},k.d)
          ))
        )
      )
    )
  );
}

function SimSection(){
  const [stageIdx,setStageIdx]=useState(0);
  const [outcome,setOutcome]=useState(null);
  const [history,setHistory]=useState([]);
  const stage=SIM_STAGES[stageIdx];
  const choose=choice=>{
    const newH=[...history,{stage:stage.label,choice:choice.label}];
    setHistory(newH);
    if(OUTCOMES[choice.next]){setOutcome(OUTCOMES[choice.next]);}
    else{
      const nextIdx=SIM_STAGES.findIndex(s=>s.id===choice.next);
      if(nextIdx>=0)setStageIdx(nextIdx);
    }
  };
  const reset=()=>{setStageIdx(0);setOutcome(null);setHistory([])};
  const allStages=['committee','house','senate','president','override'];
  return h('div',{className:'container'},
    h('p',{className:'section-label'},'Simulation Mode'),
    h('h2',{className:'section-title'},'Trace a Bill Through Congress'),
    h('p',{className:'section-sub'},'Make real decisions at each stage. Your choices determine the bill\'s fate.'),
    h('div',{className:'sim-wrap'},
      h('div',{className:'sim-progress'},
        allStages.map((s,i)=>h('div',{key:s,className:'prog-dot'+(i<stageIdx?' done':i===stageIdx&&!outcome?' active':'')}))
      ),
      !outcome&&h('div',null,
        h('div',{className:'sim-status'},
          h('div',{className:'status-dot',style:{background:'#2e8b2e'}}),
          h('span',{className:'status-label'},'Stage: '+stage.label)
        ),
        h('div',{className:'bill-display'},
          h('h3',null,'📜 The Clean Air Improvement Act'),
          h('p',null,'A bill to update federal emissions standards for industrial facilities and require quarterly reporting to the EPA.')
        ),
        h('p',{style:{fontWeight:600,marginBottom:'1rem',fontSize:'.95rem'}},stage.question),
        h('div',{className:'sim-choices'},
          stage.choices.map(c=>h('button',{key:c.id,className:'choice-btn '+c.cls,onClick:()=>choose(c)},c.label))
        ),
        history.length>0&&h('div',{style:{fontSize:'.8rem',color:'var(--muted)'}},
          h('strong',null,'Your path so far: '),history.map(h=>h.stage+'→'+h.choice.slice(2)).join(' · ')
        )
      ),
      outcome&&h('div',null,
        h('div',{className:'sim-outcome '+(outcome.type==='pass'?'outcome-pass':'outcome-fail')},outcome.msg),
        history.length>0&&h('div',{style:{margin:'1rem 0',padding:'1rem',background:'#f8f8f8',borderRadius:'8px'}},
          h('p',{style:{fontSize:'.8rem',fontWeight:700,marginBottom:'.5rem'}},'Your Decision Path:'),
          history.map((item,i)=>
            h('p',{key:i,style:{fontSize:'.8rem',color:'var(--muted)'}},
              `${i+1}. ${item.stage}: ${item.choice}`
            )
          )
        ),
        h('button',{className:'sim-reset',onClick:reset},'↺ Try Again')
      )
    )
  );
}

function ChecksSection(){
  const cards=[
    {cls:'ck-leg',icon:'🏛️',head:'Legislative checks on…',subs:[
      {arrow:'→ Exec',items:['Override presidential veto (2/3 majority)','Senate confirms presidential nominees','Senate ratifies treaties','Congress can impeach and remove the President','Controls the federal budget (power of the purse)']},
      {arrow:'→ Jud',items:['Senate confirms all federal judges','Congress can impeach and remove federal judges','Congress can add or remove federal courts (below the Supreme Court)','Can pass laws to clarify or overturn court interpretations']},
    ]},
    {cls:'ck-exec',icon:'⭐',head:'Executive checks on…',subs:[
      {arrow:'→ Leg',items:['Veto any legislation passed by Congress','Pocket veto bills when Congress adjourns','Recommends legislation (Necessary & Expedient Clause)','Can call Congress into special session']},
      {arrow:'→ Jud',items:['Nominates all federal judges, including Supreme Court Justices','Grants pardons (can effectively nullify court sentences)','Enforces (or declines to enforce) court orders']},
    ]},
    {cls:'ck-jud',icon:'⚖️',head:'Judicial checks on…',subs:[
      {arrow:'→ Leg',items:['Declare laws unconstitutional (judicial review)','Interpret the meaning and scope of legislation','Strike down laws that violate the Bill of Rights']},
      {arrow:'→ Exec',items:['Declare executive orders unconstitutional','Review executive actions for legality','Issue injunctions blocking executive enforcement']},
    ]},
  ];
  return h('div',{className:'container'},
    h('p',{className:'section-label'},'Section 3'),
    h('h2',{className:'section-title'},'Checks and Balances'),
    h('p',{className:'section-sub'},'Each branch holds specific powers to limit the other two, preventing any single branch from becoming too powerful.'),
    h('div',{className:'checks-grid'},
      cards.map(c=>h('div',{key:c.cls,className:'check-card '+c.cls},
        h('div',{className:'check-head'},h('h3',null,c.head)),
        h('div',{className:'check-body'},
          c.subs.map((s,i)=>h('div',{key:i,style:{marginBottom:i<c.subs.length-1?'1rem':0}},
            h('p',{style:{fontSize:'.75rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:'.5rem',color:'var(--muted)'}},s.arrow),
            s.items.map((item,j)=>h('div',{key:j,className:'check-item'},
              h('span',{className:'check-arrow'},'›'),
              h('p',null,item)
            ))
          ))
        )
      ))
    )
  );
}

function MattersSection(){
  const items=[
    {icon:'🗳️',t:'Your Vote Matters',p:'You can vote for leaders who make decisions that match your beliefs.'},
    {icon:'🛡️',t:'Prevents Too Much Power',p:'No single person or group controls everything. Power is shared.'},
    {icon:'📜',t:'Protects Your Rights',p:'Courts can stop laws that are unfair or unconstitutional.'},
    {icon:'💰',t:'Government Decisions Affect You',p:'Laws affect things like taxes, education, and safety.'},
    {icon:'⚡',t:'Encourages Compromise',p:'Different branches must work together to pass laws.'},
    {icon:'⚖️',t:'Fair System',p:'The system is designed to balance power and keep things fair.'},
  ];
  return h('div',{className:'container'},
    h('p',{className:'section-label'},'Section 4'),
    h('h2',{className:'section-title'},'Why This Matters to You'),
    h('p',{className:'section-sub'},'These structures aren\'t abstract — they shape daily life, protect rights, and keep government accountable to the people.'),
    h('div',{className:'matters-grid'},items.map(i=>h('div',{key:i.t,className:'matter-card'},h('div',{className:'matter-icon'},i.icon),h('h3',null,i.t),h('p',null,i.p))))
  );
}

function QuizSection(){
  const [qIdx,setQIdx]=useState(0);
  const [chosen,setChosen]=useState(null);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const q=QUIZ[qIdx];
  const pick=i=>{
    if(chosen!==null)return;
    setChosen(i);
    if(i===q.ans)setScore(s=>s+1);
  };
  const next=()=>{
    if(qIdx<QUIZ.length-1){setQIdx(q=>q+1);setChosen(null);}
    else setDone(true);
  };
  const reset=()=>{setQIdx(0);setChosen(null);setScore(0);setDone(false)};
  const pct=Math.round(score/QUIZ.length*100);
  return h('div',{className:'container'},
    h('p',{className:'section-label'},'Mini Quiz'),
    h('h2',{className:'section-title'},'Test Your Knowledge'),
    h('p',{className:'section-sub'},'Five questions drawn directly from the lecture slides. How well do you know U.S. government?'),
    h('div',{className:'quiz-card'},
      done?h('div',{className:'quiz-score'},
        h('div',{style:{fontSize:'3rem',marginBottom:'.5rem'}},pct>=80?'🏆':pct>=60?'📚':'📖'),
        h('h3',null,'You scored '+score+' / '+QUIZ.length),
        h('p',null,pct>=80?'Excellent work! You have a strong grasp of U.S. government structure.':pct>=60?'Good effort! Review the sections above to strengthen your understanding.':'Keep studying — revisit the interactive sections and try again!'),
        h('button',{className:'btn-primary',onClick:reset},'Retake Quiz')
      ):h('div',null,
        h('div',{style:{display:'flex',gap:'6px',marginBottom:'1.2rem'}},
          QUIZ.map((_,i)=>h('div',{key:i,style:{flex:1,height:'4px',borderRadius:'2px',background:i<qIdx?'var(--gold)':i===qIdx?'var(--navy)':'#e0e0e0',transition:'background .3s'}}))
        ),
        h('p',{className:'quiz-q'},'Q'+(qIdx+1)+'. '+q.q),
        h('div',{className:'quiz-opts'},
          q.opts.map((opt,i)=>h('button',{key:i,className:'quiz-opt'+(chosen!==null?i===q.ans?' correct':i===chosen?' wrong':'':''),onClick:()=>pick(i),disabled:chosen!==null},opt))
        ),
        chosen!==null&&h('div',{className:'quiz-feedback '+(chosen===q.ans?'correct':'wrong')},
          (chosen===q.ans?'✓ Correct! ':'✗ Not quite. ')+q.exp
        ),
        h('div',{className:'quiz-nav'},
          h('span',{className:'quiz-prog'},'Question '+(qIdx+1)+' of '+QUIZ.length+' · Score: '+score),
          chosen!==null&&h('button',{className:'btn-primary',onClick:next,style:{fontSize:'.85rem',padding:'8px 20px'}},qIdx<QUIZ.length-1?'Next →':'See Results')
        )
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App,null));