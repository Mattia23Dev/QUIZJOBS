import { message } from "antd";

export const handleCopyLink = (link) => {
  navigator.clipboard
    .writeText(link)
    .then(() => {
      message.success("Link copiato negli appunti");
    })
    .catch((error) => {
      console.error(
        "Si è verificato un errore durante la copia del link:",
        error
      );
      message.error("Si è verificato un errore durante la copia del link");
    });
};

export const generateUniqueId = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const addItemToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const isMobile = () => {
  return window.innerWidth <= 768;
};

export const getGenQuestionsAiPrompt = (config) => {
  return `Sei un esperto generatore di domande e devi testare le competenze di un candidato per un'offerta lavorativa per la posizione ${
    config.jobPosition
  }. Genera ${
    config.numOfQuestions < 25
      ? config.numOfQuestions
      : config.numOfQuestions / 2
  } domande a risposta multipla con 4 possibilità e con le rispettive risposte. Ripeti le stesse risposte SOLO SE NECESSARIO inserirle nel contesto della domanda. 
      Assicurati di non inserire opzioni che non centrano con il contesto della domanda o del ruolo, Assicurati di fare domande non banali e specifiche alle competenze fornite: ${config.skills.join(
        ", "
      )}, con difficoltà ${config.difficulty}, nella lingua ${
    config.testLanguage
  }.
      Le risposte all'interno della domanda devono essere fatte con una risposta completamente sbagliata, una risposta che possa sembrare corretta e le ultime due risposte simili tra loro, ma una sola corretta.
      Descrizione della difficoltà delle domande, prendi in considerazione il campo sopra con la discrezione sotto:
      - Facile (Junior): Le domande devono focalizzarsi su concetti di base che un candidato dovrebbe conoscere per svolgere il ruolo in modo efficace. Usa un linguaggio chiaro e semplice, evitando terminologia complessa o gergale che potrebbe confondere. Le domande dovrebbero richiedere la conoscenza diretta e applicabile, senza richiedere interpretazioni complesse o analisi dettagliate. Ogni opzione di risposta deve essere distinta, con una risposta corretta che sia chiaramente la migliore scelta tra le opzioni fornite. Attenendosi sempre alla domanda e mantenendo sempre e soltanto una sola risposta Corretta. Opzioni di Risposta:
      1) Una risposta completamente sbagliata.
      2) Una risposta che sembri corretta ma non lo è.
      3) Due risposte simili tra loro, ma solo una corretta.
      
      - Medio (Middle): Le domande devono richiedere una comprensione approfondita dei concetti fondamentali e delle applicazioni pratiche delle competenze richieste. Includi scenari realistici che i candidati potrebbero affrontare nel loro lavoro quotidiano. Questo aiuta a valutare la loro capacità di applicare le conoscenze in contesti pratici. Usa terminologia tecnica appropriata per il ruolo, ma non eccessivamente complessa. Questo garantisce che i candidati conoscano il gergo del settore senza essere eccessivamente intimiditi. Opzioni di Risposta:
      1) Una risposta completamente sbagliata.
      2) Una risposta che sembri corretta ma non lo è.
      3) Due risposte simili tra loro, ma solo una corretta.
      
      
      - Difficile (Senior): Le domande devono riguardare argomenti che richiedono una competenza avanzata e un'esperienza significativa nel campo specifico. Le opzioni di risposta sbagliate devono essere sofisticate e plausibili, dimostrando una comprensione superficiale o errata dei concetti avanzati. Alcune domande dovrebbero permettere di valutare l'abilità del candidato di innovare e pensare in modo creativo per risolvere problemi complessi.
       Opzioni di Risposta:
      1) Una risposta completamente sbagliata.
      2) Una risposta che sembri corretta ma non lo è, spesso mostrando una comprensione parziale.
      3) Due risposte simili alla corretta, ma solo una è esattamente corretta.`;
};

export const getExampleQuestionsAiPrompt = (config) => {
  return `
       Crea delle domande inerenti a queste competenze: ${config?.skills?.join(
         ", "
       )}, in questo formato, ricorda che questo è un esempio:
       ### Domande per Full Stack Developer

      1. In JavaScript, cosa restituisce 'typeof NaN'?
      - A) "number"
      - B) "NaN"
      - C) "undefined"
      - D) "error"
      - **Risposta corretta: A) "number"**
    
      2. Quale funzione di WordPress permette di aggiungere un nuovo tipo di post personalizzato?
      - A) add_new_post_type()
      - B) register_post_type()
      - C) create_post_type()
      - D) new_post_type()
      - **Risposta corretta: B) register_post_type()**
       E Prendi in considerazione questa ulteriore descrizione che specifica meglio l'obiettivo del test o una descrizione generica: ${config.description}
       `;
};
