import type { Locale } from "@/lib/i18n";

/**
 * Every string the lead form renders.
 *
 * English is complete. The other locales translate the parts a visitor must
 * understand to send an enquiry and to know what happened to it: labels,
 * consent, errors, the success state and the "not sent" state. Placeholders
 * and the option lists inside the selects (service names, machine-count
 * ranges) stay in English everywhere; they are product names and ranges.
 *
 * CONSENT. `consent` and `marketing` are translations of CONSENT_TEXT and
 * MARKETING_CONSENT_TEXT in lib/leads/schema.ts. The stored record keeps the
 * English wording, the CONSENT_VERSION and the locale the visitor saw, so a
 * change to any of these lines has to bump CONSENT_VERSION with it.
 */
export interface LeadFormCopy {
  eyebrow: string;
  title: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  rolePlaceholder: string;
  country: string;
  industry: string;
  service: string;
  challenge: string;
  challengePlaceholder: string;
  select: string;
  systemsTitle: string;
  systemsHint: string;
  scale: string;
  erpCrm: string;
  erpCrmPlaceholder: string;
  cadCam: string;
  cadCamPlaceholder: string;
  connectivity: string;
  consent: string;
  marketing: string;
  privacy: string;
  submit: string;
  submitting: string;
  footnote: string;
  errors: {
    summary: string;
    required: string;
    invalid: string;
    invalidEmail: string;
    invalidPhone: string;
    tooShort: string;
    tooLong: string;
    consent: string;
  };
  success: {
    title: string;
    /** `{name}` and `{email}` are replaced. */
    body: string;
    reference: string;
    nextTitle: string;
    again: string;
  };
  failure: {
    title: string;
    unavailable: string;
    delivery: string;
    network: string;
    rateLimited: string;
    rejected: string;
    retry: string;
    whatsapp: string;
    email: string;
  };
  /** `{email}` and `{phone}` are replaced. */
  noscript: string;
}

const en: LeadFormCopy = {
  eyebrow: "Enquiry",
  title: "Tell us about your operation",
  name: "Your name",
  email: "Work email",
  phone: "Phone or WhatsApp (optional)",
  company: "Company",
  role: "Your role",
  rolePlaceholder: "e.g. Plant manager, Director, CTO",
  country: "Country",
  industry: "Industry",
  service: "What would you like to discuss?",
  challenge: "What is the main operational challenge?",
  challengePlaceholder:
    "Plain words are fine. For example: downtime is logged on paper and reaches planning a day late; quotes wait on engineering; stock in the ERP does not match the floor.",
  select: "Select…",
  systemsTitle: "About your systems (optional)",
  systemsHint: "Skip anything you are not sure about. A rough answer helps us prepare.",
  scale: "Approximate machine count",
  erpCrm: "ERP / CRM in use today",
  erpCrmPlaceholder: "e.g. SAP, Tally, Odoo, Zoho, in-house",
  cadCam: "CAD / CAM systems",
  cadCamPlaceholder: "e.g. SOLIDWORKS, Mastercam, Fusion",
  connectivity: "Machine connectivity today",
  consent: "I agree that Savin Group may contact me about this enquiry using the details I have provided.",
  marketing:
    "Optional: send me occasional product and engineering updates from Savin Group. I can unsubscribe at any time.",
  privacy: "Privacy policy",
  submit: "Send request",
  submitting: "Sending…",
  footnote: "A person replies within one business day. Your details are used to respond to this enquiry.",
  errors: {
    summary: "Please check the highlighted fields.",
    required: "This field is required.",
    invalid: "Please check this value.",
    invalidEmail: "Enter a valid email address.",
    invalidPhone: "Enter a valid phone number, with country code if outside India.",
    tooShort: "Please add a little more detail.",
    tooLong: "This is too long. Please shorten it.",
    consent: "Please confirm that we may contact you.",
  },
  success: {
    title: "Request received.",
    body: "Thank you, {name}. A person from Savin Group will reply to {email} within one business day.",
    reference: "Your reference",
    nextTitle: "What happens next",
    again: "Send another request",
  },
  failure: {
    title: "Your request was not sent.",
    unavailable:
      "Our enquiry system is not accepting requests right now. What you typed is still here, and you can send it to us directly:",
    delivery: "We could not deliver your request. Try again, or send it to us directly:",
    network: "We could not reach the server. Check your connection and try again, or send it to us directly:",
    rateLimited: "Too many requests have come from this network. Wait a few minutes, or send it to us directly:",
    rejected: "We could not accept this submission automatically. Please send it to us directly:",
    retry: "Try again",
    whatsapp: "Send on WhatsApp",
    email: "Send by email",
  },
  noscript: "This form needs JavaScript. You can reach us directly at {email} or on WhatsApp at {phone}.",
};

type Partialish = Partial<Omit<LeadFormCopy, "errors" | "success" | "failure">> & {
  errors?: Partial<LeadFormCopy["errors"]>;
  success?: Partial<LeadFormCopy["success"]>;
  failure?: Partial<LeadFormCopy["failure"]>;
};

const translations: Partial<Record<Locale, Partialish>> = {
  hi: {
    eyebrow: "पूछताछ",
    title: "हमें अपने संचालन के बारे में बताएँ",
    name: "आपका नाम",
    email: "कार्यालय ईमेल",
    phone: "फ़ोन या WhatsApp (वैकल्पिक)",
    company: "कंपनी",
    role: "आपकी भूमिका",
    country: "देश",
    industry: "उद्योग",
    service: "आप किस बारे में बात करना चाहते हैं?",
    challenge: "संचालन की मुख्य चुनौती क्या है?",
    select: "चुनें…",
    systemsTitle: "आपके सिस्टम के बारे में (वैकल्पिक)",
    systemsHint: "जिसके बारे में पक्का न हो, उसे छोड़ दें। अनुमानित उत्तर भी हमारी तैयारी में मदद करता है।",
    scale: "मशीनों की अनुमानित संख्या",
    erpCrm: "अभी उपयोग में ERP / CRM",
    cadCam: "CAD / CAM सिस्टम",
    connectivity: "मशीन कनेक्टिविटी की वर्तमान स्थिति",
    consent: "मैं सहमत हूँ कि Savin Group इस पूछताछ के बारे में मेरे दिए गए विवरण से मुझसे संपर्क कर सकता है।",
    marketing: "वैकल्पिक: Savin Group से कभी-कभार उत्पाद और इंजीनियरिंग अपडेट भेजें। मैं कभी भी सदस्यता समाप्त कर सकता/सकती हूँ।",
    privacy: "गोपनीयता नीति",
    submit: "अनुरोध भेजें",
    submitting: "भेजा जा रहा है…",
    footnote: "एक व्यक्ति एक कार्यदिवस के भीतर उत्तर देता है। आपके विवरण का उपयोग इसी पूछताछ का उत्तर देने के लिए होता है।",
    errors: {
      summary: "कृपया चिह्नित फ़ील्ड जाँचें।",
      required: "यह फ़ील्ड आवश्यक है।",
      invalid: "कृपया यह मान जाँचें।",
      invalidEmail: "मान्य ईमेल पता दर्ज करें।",
      invalidPhone: "मान्य फ़ोन नंबर दर्ज करें।",
      tooShort: "कृपया थोड़ा और विवरण दें।",
      tooLong: "यह बहुत लंबा है। कृपया छोटा करें।",
      consent: "कृपया पुष्टि करें कि हम आपसे संपर्क कर सकते हैं।",
    },
    success: {
      title: "अनुरोध प्राप्त हुआ।",
      body: "धन्यवाद, {name}। Savin Group से एक व्यक्ति एक कार्यदिवस के भीतर {email} पर उत्तर देगा।",
      reference: "आपका संदर्भ",
      nextTitle: "आगे क्या होगा",
      again: "एक और अनुरोध भेजें",
    },
    failure: {
      title: "आपका अनुरोध नहीं भेजा गया।",
      unavailable: "हमारा पूछताछ सिस्टम अभी अनुरोध स्वीकार नहीं कर रहा है। आपने जो लिखा है वह यहीं है; आप इसे सीधे हमें भेज सकते हैं:",
      delivery: "हम आपका अनुरोध नहीं पहुँचा सके। दोबारा प्रयास करें, या इसे सीधे हमें भेजें:",
      network: "सर्वर से संपर्क नहीं हो सका। अपना कनेक्शन जाँचें और दोबारा प्रयास करें, या इसे सीधे हमें भेजें:",
      rateLimited: "इस नेटवर्क से बहुत अधिक अनुरोध आए हैं। कुछ मिनट प्रतीक्षा करें, या इसे सीधे हमें भेजें:",
      rejected: "हम यह सबमिशन स्वचालित रूप से स्वीकार नहीं कर सके। कृपया इसे सीधे हमें भेजें:",
      retry: "दोबारा प्रयास करें",
      whatsapp: "WhatsApp पर भेजें",
      email: "ईमेल से भेजें",
    },
    noscript: "इस फ़ॉर्म के लिए JavaScript आवश्यक है। आप हमसे सीधे {email} पर या WhatsApp {phone} पर संपर्क कर सकते हैं।",
  },
  gu: {
    eyebrow: "પૂછપરછ",
    title: "તમારા સંચાલન વિશે અમને જણાવો",
    name: "તમારું નામ",
    email: "ઓફિસ ઇમેઇલ",
    phone: "ફોન અથવા WhatsApp (વૈકલ્પિક)",
    company: "કંપની",
    role: "તમારી ભૂમિકા",
    country: "દેશ",
    industry: "ઉદ્યોગ",
    service: "તમે શેના વિશે વાત કરવા માંગો છો?",
    challenge: "સંચાલનનો મુખ્ય પડકાર શું છે?",
    select: "પસંદ કરો…",
    systemsTitle: "તમારી સિસ્ટમ્સ વિશે (વૈકલ્પિક)",
    systemsHint: "જેની ખાતરી ન હોય તે છોડી દો. અંદાજિત જવાબ પણ અમને તૈયારીમાં મદદ કરે છે.",
    scale: "મશીનોની અંદાજિત સંખ્યા",
    erpCrm: "હાલમાં વપરાતું ERP / CRM",
    cadCam: "CAD / CAM સિસ્ટમ્સ",
    connectivity: "મશીન કનેક્ટિવિટીની હાલની સ્થિતિ",
    consent: "હું સંમત છું કે Savin Group આ પૂછપરછ અંગે મેં આપેલી વિગતો દ્વારા મારો સંપર્ક કરી શકે છે.",
    marketing: "વૈકલ્પિક: Savin Group તરફથી ક્યારેક પ્રોડક્ટ અને એન્જિનિયરિંગ અપડેટ્સ મોકલો. હું ગમે ત્યારે બંધ કરાવી શકું છું.",
    privacy: "ગોપનીયતા નીતિ",
    submit: "વિનંતી મોકલો",
    submitting: "મોકલી રહ્યા છીએ…",
    footnote: "એક વ્યક્તિ એક કામકાજના દિવસમાં જવાબ આપે છે. તમારી વિગતોનો ઉપયોગ આ પૂછપરછનો જવાબ આપવા માટે થાય છે.",
    errors: {
      summary: "કૃપા કરીને ચિહ્નિત ફીલ્ડ તપાસો.",
      required: "આ ફીલ્ડ જરૂરી છે.",
      invalid: "કૃપા કરીને આ મૂલ્ય તપાસો.",
      invalidEmail: "માન્ય ઇમેઇલ સરનામું દાખલ કરો.",
      invalidPhone: "માન્ય ફોન નંબર દાખલ કરો.",
      tooShort: "કૃપા કરીને થોડી વધુ વિગત આપો.",
      tooLong: "આ ખૂબ લાંબું છે. કૃપા કરીને ટૂંકું કરો.",
      consent: "કૃપા કરીને પુષ્ટિ કરો કે અમે તમારો સંપર્ક કરી શકીએ.",
    },
    success: {
      title: "વિનંતી મળી ગઈ.",
      body: "આભાર, {name}. Savin Group તરફથી એક વ્યક્તિ એક કામકાજના દિવસમાં {email} પર જવાબ આપશે.",
      reference: "તમારો સંદર્ભ",
      nextTitle: "હવે શું થશે",
      again: "બીજી વિનંતી મોકલો",
    },
    failure: {
      title: "તમારી વિનંતી મોકલાઈ નથી.",
      unavailable: "અમારી પૂછપરછ સિસ્ટમ હાલમાં વિનંતીઓ સ્વીકારી રહી નથી. તમે જે લખ્યું છે તે અહીં જ છે; તમે તે સીધું અમને મોકલી શકો છો:",
      delivery: "અમે તમારી વિનંતી પહોંચાડી શક્યા નહીં. ફરી પ્રયાસ કરો, અથવા તે સીધું અમને મોકલો:",
      network: "સર્વર સુધી પહોંચી શકાયું નહીં. તમારું કનેક્શન તપાસો અને ફરી પ્રયાસ કરો, અથવા તે સીધું અમને મોકલો:",
      rateLimited: "આ નેટવર્ક પરથી ઘણી વિનંતીઓ આવી છે. થોડી મિનિટ રાહ જુઓ, અથવા તે સીધું અમને મોકલો:",
      rejected: "અમે આ સબમિશન આપમેળે સ્વીકારી શક્યા નહીં. કૃપા કરીને તે સીધું અમને મોકલો:",
      retry: "ફરી પ્રયાસ કરો",
      whatsapp: "WhatsApp પર મોકલો",
      email: "ઇમેઇલથી મોકલો",
    },
    noscript: "આ ફોર્મ માટે JavaScript જરૂરી છે. તમે સીધો {email} પર અથવા WhatsApp {phone} પર અમારો સંપર્ક કરી શકો છો.",
  },
  es: {
    eyebrow: "Consulta",
    title: "Cuéntenos sobre su operación",
    name: "Su nombre",
    email: "Correo de trabajo",
    phone: "Teléfono o WhatsApp (opcional)",
    company: "Empresa",
    role: "Su cargo",
    country: "País",
    industry: "Sector",
    service: "¿Sobre qué le gustaría hablar?",
    challenge: "¿Cuál es el principal reto operativo?",
    select: "Seleccione…",
    systemsTitle: "Sobre sus sistemas (opcional)",
    systemsHint: "Omita lo que no tenga claro. Una respuesta aproximada nos ayuda a prepararnos.",
    scale: "Número aproximado de máquinas",
    erpCrm: "ERP / CRM que usan hoy",
    cadCam: "Sistemas CAD / CAM",
    connectivity: "Conectividad actual de las máquinas",
    consent: "Acepto que Savin Group se ponga en contacto conmigo sobre esta consulta con los datos que he facilitado.",
    marketing: "Opcional: envíenme novedades ocasionales de producto e ingeniería de Savin Group. Puedo darme de baja en cualquier momento.",
    privacy: "Política de privacidad",
    submit: "Enviar solicitud",
    submitting: "Enviando…",
    footnote: "Una persona responde en un día hábil. Sus datos se usan para responder a esta consulta.",
    errors: {
      summary: "Revise los campos marcados.",
      required: "Este campo es obligatorio.",
      invalid: "Revise este valor.",
      invalidEmail: "Introduzca un correo electrónico válido.",
      invalidPhone: "Introduzca un número de teléfono válido, con prefijo internacional.",
      tooShort: "Añada un poco más de detalle.",
      tooLong: "Es demasiado largo. Acórtelo, por favor.",
      consent: "Confirme que podemos ponernos en contacto con usted.",
    },
    success: {
      title: "Solicitud recibida.",
      body: "Gracias, {name}. Una persona de Savin Group responderá a {email} en un día hábil.",
      reference: "Su referencia",
      nextTitle: "Qué ocurre ahora",
      again: "Enviar otra solicitud",
    },
    failure: {
      title: "Su solicitud no se ha enviado.",
      unavailable: "Nuestro sistema de consultas no acepta solicitudes en este momento. Lo que ha escrito sigue aquí y puede enviárnoslo directamente:",
      delivery: "No hemos podido entregar su solicitud. Inténtelo de nuevo o envíenosla directamente:",
      network: "No hemos podido conectar con el servidor. Compruebe su conexión e inténtelo de nuevo, o envíenosla directamente:",
      rateLimited: "Han llegado demasiadas solicitudes desde esta red. Espere unos minutos o envíenosla directamente:",
      rejected: "No hemos podido aceptar este envío automáticamente. Envíenoslo directamente:",
      retry: "Reintentar",
      whatsapp: "Enviar por WhatsApp",
      email: "Enviar por correo",
    },
    noscript: "Este formulario necesita JavaScript. Puede escribirnos directamente a {email} o por WhatsApp al {phone}.",
  },
  fr: {
    eyebrow: "Demande",
    title: "Parlez-nous de votre activité",
    name: "Votre nom",
    email: "E-mail professionnel",
    phone: "Téléphone ou WhatsApp (facultatif)",
    company: "Entreprise",
    role: "Votre fonction",
    country: "Pays",
    industry: "Secteur",
    service: "De quoi souhaitez-vous parler ?",
    challenge: "Quel est le principal défi opérationnel ?",
    select: "Sélectionner…",
    systemsTitle: "À propos de vos systèmes (facultatif)",
    systemsHint: "Passez ce dont vous n’êtes pas sûr. Une réponse approximative nous aide à nous préparer.",
    scale: "Nombre approximatif de machines",
    erpCrm: "ERP / CRM utilisés aujourd’hui",
    cadCam: "Systèmes CAO / FAO",
    connectivity: "Connectivité actuelle des machines",
    consent: "J’accepte que Savin Group me contacte au sujet de cette demande à l’aide des coordonnées que j’ai fournies.",
    marketing: "Facultatif : envoyez-moi de temps en temps des nouvelles produit et ingénierie de Savin Group. Je peux me désinscrire à tout moment.",
    privacy: "Politique de confidentialité",
    submit: "Envoyer la demande",
    submitting: "Envoi…",
    footnote: "Une personne répond sous un jour ouvré. Vos coordonnées servent à répondre à cette demande.",
    errors: {
      summary: "Veuillez vérifier les champs signalés.",
      required: "Ce champ est obligatoire.",
      invalid: "Veuillez vérifier cette valeur.",
      invalidEmail: "Saisissez une adresse e-mail valide.",
      invalidPhone: "Saisissez un numéro de téléphone valide, avec l’indicatif du pays.",
      tooShort: "Ajoutez un peu plus de détails.",
      tooLong: "C’est trop long. Merci de raccourcir.",
      consent: "Veuillez confirmer que nous pouvons vous contacter.",
    },
    success: {
      title: "Demande reçue.",
      body: "Merci, {name}. Une personne de Savin Group répondra à {email} sous un jour ouvré.",
      reference: "Votre référence",
      nextTitle: "La suite",
      again: "Envoyer une autre demande",
    },
    failure: {
      title: "Votre demande n’a pas été envoyée.",
      unavailable: "Notre système de demandes n’accepte pas de requêtes pour le moment. Ce que vous avez saisi est toujours là ; vous pouvez nous l’envoyer directement :",
      delivery: "Nous n’avons pas pu transmettre votre demande. Réessayez ou envoyez-la-nous directement :",
      network: "Impossible de joindre le serveur. Vérifiez votre connexion et réessayez, ou envoyez-la-nous directement :",
      rateLimited: "Trop de demandes proviennent de ce réseau. Patientez quelques minutes ou envoyez-la-nous directement :",
      rejected: "Nous n’avons pas pu accepter cet envoi automatiquement. Merci de nous l’envoyer directement :",
      retry: "Réessayer",
      whatsapp: "Envoyer sur WhatsApp",
      email: "Envoyer par e-mail",
    },
    noscript: "Ce formulaire nécessite JavaScript. Vous pouvez nous joindre directement à {email} ou sur WhatsApp au {phone}.",
  },
  de: {
    eyebrow: "Anfrage",
    title: "Erzählen Sie uns von Ihrem Betrieb",
    name: "Ihr Name",
    email: "Geschäftliche E-Mail",
    phone: "Telefon oder WhatsApp (optional)",
    company: "Unternehmen",
    role: "Ihre Funktion",
    country: "Land",
    industry: "Branche",
    service: "Worüber möchten Sie sprechen?",
    challenge: "Was ist die größte betriebliche Herausforderung?",
    select: "Auswählen…",
    systemsTitle: "Zu Ihren Systemen (optional)",
    systemsHint: "Überspringen Sie, was Sie nicht sicher wissen. Eine ungefähre Angabe hilft uns bei der Vorbereitung.",
    scale: "Ungefähre Anzahl der Maschinen",
    erpCrm: "Heute eingesetztes ERP / CRM",
    cadCam: "CAD- / CAM-Systeme",
    connectivity: "Aktuelle Maschinenanbindung",
    consent: "Ich bin einverstanden, dass Savin Group mich zu dieser Anfrage über die angegebenen Kontaktdaten kontaktiert.",
    marketing: "Optional: Senden Sie mir gelegentlich Produkt- und Engineering-Neuigkeiten von Savin Group. Ich kann mich jederzeit abmelden.",
    privacy: "Datenschutzerklärung",
    submit: "Anfrage senden",
    submitting: "Wird gesendet…",
    footnote: "Eine Person antwortet innerhalb eines Werktags. Ihre Angaben werden zur Beantwortung dieser Anfrage verwendet.",
    errors: {
      summary: "Bitte prüfen Sie die markierten Felder.",
      required: "Dieses Feld ist erforderlich.",
      invalid: "Bitte prüfen Sie diese Angabe.",
      invalidEmail: "Geben Sie eine gültige E-Mail-Adresse ein.",
      invalidPhone: "Geben Sie eine gültige Telefonnummer mit Ländervorwahl ein.",
      tooShort: "Bitte ergänzen Sie etwas mehr Details.",
      tooLong: "Das ist zu lang. Bitte kürzen Sie den Text.",
      consent: "Bitte bestätigen Sie, dass wir Sie kontaktieren dürfen.",
    },
    success: {
      title: "Anfrage eingegangen.",
      body: "Vielen Dank, {name}. Eine Person von Savin Group antwortet innerhalb eines Werktags an {email}.",
      reference: "Ihre Referenz",
      nextTitle: "So geht es weiter",
      again: "Weitere Anfrage senden",
    },
    failure: {
      title: "Ihre Anfrage wurde nicht gesendet.",
      unavailable: "Unser Anfragesystem nimmt derzeit keine Anfragen an. Ihre Eingaben sind noch da; Sie können sie uns direkt senden:",
      delivery: "Wir konnten Ihre Anfrage nicht zustellen. Versuchen Sie es erneut oder senden Sie sie uns direkt:",
      network: "Der Server war nicht erreichbar. Prüfen Sie Ihre Verbindung und versuchen Sie es erneut, oder senden Sie sie uns direkt:",
      rateLimited: "Aus diesem Netzwerk kamen zu viele Anfragen. Warten Sie einige Minuten oder senden Sie sie uns direkt:",
      rejected: "Wir konnten diese Übermittlung nicht automatisch annehmen. Bitte senden Sie sie uns direkt:",
      retry: "Erneut versuchen",
      whatsapp: "Per WhatsApp senden",
      email: "Per E-Mail senden",
    },
    noscript: "Dieses Formular benötigt JavaScript. Sie erreichen uns direkt unter {email} oder per WhatsApp unter {phone}.",
  },
  ar: {
    eyebrow: "استفسار",
    title: "أخبرنا عن عملياتك",
    name: "اسمك",
    email: "البريد الإلكتروني للعمل",
    phone: "الهاتف أو واتساب (اختياري)",
    company: "الشركة",
    role: "منصبك",
    country: "الدولة",
    industry: "القطاع",
    service: "ما الذي تود مناقشته؟",
    challenge: "ما التحدي التشغيلي الرئيسي؟",
    select: "اختر…",
    systemsTitle: "عن أنظمتك (اختياري)",
    systemsHint: "تجاوز ما لست متأكدًا منه. الإجابة التقريبية تساعدنا على الاستعداد.",
    scale: "العدد التقريبي للآلات",
    erpCrm: "نظام ERP / CRM المستخدم حاليًا",
    cadCam: "أنظمة CAD / CAM",
    connectivity: "حالة اتصال الآلات حاليًا",
    consent: "أوافق على أن تتواصل معي Savin Group بخصوص هذا الاستفسار باستخدام البيانات التي قدمتها.",
    marketing: "اختياري: أرسلوا لي من حين لآخر مستجدات المنتجات والهندسة من Savin Group. يمكنني إلغاء الاشتراك في أي وقت.",
    privacy: "سياسة الخصوصية",
    submit: "إرسال الطلب",
    submitting: "جارٍ الإرسال…",
    footnote: "يرد عليك أحد أفراد الفريق خلال يوم عمل واحد. تُستخدم بياناتك للرد على هذا الاستفسار.",
    errors: {
      summary: "يرجى مراجعة الحقول المحددة.",
      required: "هذا الحقل مطلوب.",
      invalid: "يرجى مراجعة هذه القيمة.",
      invalidEmail: "أدخل عنوان بريد إلكتروني صالحًا.",
      invalidPhone: "أدخل رقم هاتف صالحًا مع رمز الدولة.",
      tooShort: "يرجى إضافة مزيد من التفاصيل.",
      tooLong: "النص طويل جدًا. يرجى اختصاره.",
      consent: "يرجى تأكيد موافقتك على تواصلنا معك.",
    },
    success: {
      title: "تم استلام الطلب.",
      body: "شكرًا لك، {name}. سيرد أحد أفراد Savin Group على {email} خلال يوم عمل واحد.",
      reference: "الرقم المرجعي",
      nextTitle: "ما الذي يحدث بعد ذلك",
      again: "إرسال طلب آخر",
    },
    failure: {
      title: "لم يتم إرسال طلبك.",
      unavailable: "نظام الاستفسارات لا يستقبل الطلبات حاليًا. ما كتبته ما زال هنا، ويمكنك إرساله إلينا مباشرة:",
      delivery: "تعذر تسليم طلبك. حاول مرة أخرى أو أرسله إلينا مباشرة:",
      network: "تعذر الوصول إلى الخادم. تحقق من اتصالك وحاول مرة أخرى، أو أرسله إلينا مباشرة:",
      rateLimited: "وردت طلبات كثيرة من هذه الشبكة. انتظر بضع دقائق أو أرسله إلينا مباشرة:",
      rejected: "تعذر قبول هذا الإرسال تلقائيًا. يرجى إرساله إلينا مباشرة:",
      retry: "حاول مرة أخرى",
      whatsapp: "إرسال عبر واتساب",
      email: "إرسال بالبريد الإلكتروني",
    },
    noscript: "يتطلب هذا النموذج JavaScript. يمكنك التواصل معنا مباشرة على {email} أو عبر واتساب على {phone}.",
  },
  zh: {
    eyebrow: "咨询",
    title: "请介绍您的运营情况",
    name: "您的姓名",
    email: "工作邮箱",
    phone: "电话或 WhatsApp（选填）",
    company: "公司",
    role: "您的职位",
    country: "国家/地区",
    industry: "行业",
    service: "您想讨论什么？",
    challenge: "当前最主要的运营难题是什么？",
    select: "请选择…",
    systemsTitle: "关于您的系统（选填）",
    systemsHint: "不确定的内容可以跳过。大致的回答也有助于我们准备。",
    scale: "设备大致数量",
    erpCrm: "目前使用的 ERP / CRM",
    cadCam: "CAD / CAM 系统",
    connectivity: "目前的设备联网情况",
    consent: "我同意 Savin Group 使用我提供的联系方式，就此次咨询与我联系。",
    marketing: "选填：偶尔向我发送 Savin Group 的产品和工程动态。我可以随时退订。",
    privacy: "隐私政策",
    submit: "提交请求",
    submitting: "正在提交…",
    footnote: "我们会在一个工作日内由专人回复。您的信息仅用于回复此次咨询。",
    errors: {
      summary: "请检查标出的字段。",
      required: "此项为必填。",
      invalid: "请检查此项内容。",
      invalidEmail: "请输入有效的邮箱地址。",
      invalidPhone: "请输入有效的电话号码，并加上国家区号。",
      tooShort: "请再补充一些细节。",
      tooLong: "内容过长，请缩短。",
      consent: "请确认同意我们与您联系。",
    },
    success: {
      title: "已收到您的请求。",
      body: "谢谢您，{name}。Savin Group 的工作人员将在一个工作日内回复至 {email}。",
      reference: "您的参考编号",
      nextTitle: "接下来",
      again: "再提交一份请求",
    },
    failure: {
      title: "您的请求未发送成功。",
      unavailable: "我们的咨询系统目前无法接收请求。您填写的内容仍然保留，您可以直接发送给我们：",
      delivery: "我们未能送达您的请求。请重试，或直接发送给我们：",
      network: "无法连接服务器。请检查网络后重试，或直接发送给我们：",
      rateLimited: "来自此网络的请求过多。请稍等几分钟，或直接发送给我们：",
      rejected: "我们无法自动接受此次提交。请直接发送给我们：",
      retry: "重试",
      whatsapp: "通过 WhatsApp 发送",
      email: "通过邮件发送",
    },
    noscript: "此表单需要启用 JavaScript。您可以直接通过 {email} 或 WhatsApp {phone} 联系我们。",
  },
};

export function getLeadFormCopy(locale: Locale): LeadFormCopy {
  const t = translations[locale];
  if (!t) return en;
  return {
    ...en,
    ...t,
    errors: { ...en.errors, ...t.errors },
    success: { ...en.success, ...t.success },
    failure: { ...en.failure, ...t.failure },
  };
}
