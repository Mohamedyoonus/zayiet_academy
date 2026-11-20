import type { DataTranslations } from "../types";

// English — the source text for every other language file.
// Placeholders in {braces} are filled in with fmt() from lib/i18n.
const en = {
  common: {
    enquire: "Enquire",
    enroll: "Enroll",
    registerNow: "Register Now",
    offline: "Offline",
    online: "Online",
    perMonthShort: "/mo",
    close: "Close",
    back: "Back",
    optional: "(optional)",
    required: "(required)",
    newBadge: "New",
    tagline: "Learn • Create • Inspire",
  },

  nav: {
    home: "Home",
    classes: "Classes",
    workshop: "Workshop",
    gallery: "Gallery",
    funZone: "Fun Zone",
    store: "Store",
    events: "Events",
    collaboration: "Collaboration",
    about: "About",
    contact: "Contact",
    settings: "Settings",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    logoAlt: "Zayit Academy Logo",
  },

  hero: {
    eyebrow: "Zayit Academy",
    titleBefore: "Beyond Art.",
    titleHighlight: "Towards a Better You",
    titleAfter: "",
    description:
      "More than art education—a space to explore creativity, discover your abilities, and grow through the power of making.",
    exploreClasses: "Explore Classes",
    viewGallery: "View Gallery",
    statStudents: "Students Trained",
    statYears: "Years of Teaching",
    statAwards: "Awards Won",
    imageAlt: "Students painting together at the Zayit Academy studio",
  },

  visionValues: {
    eyebrow: "Our Vision",
    title: "Where Art Inspires",
    highlight: "Inner Peace",
    description:
      "We believe creativity can nurture self-understanding, confidence, compassion, and respect. Through art, we encourage people to discover their potential and contribute to a more peaceful world.",
    card1Title: "Discover the Artist Within",
    card1Desc:
      "Every individual has the potential to create. We provide space, guidance, and encouragement to explore it.",
    card2Title: "Learn Through Creation",
    card2Desc:
      "Develop artistic skills through drawing, painting, experimentation, and hands-on learning.",
    card3Title: "Grow Beyond the Canvas",
    card3Desc:
      "Cultivate patience, focus, imagination, independent thinking, and confidence through the creative process.",
    card4Title: "Create a Culture of Kindness",
    card4Desc:
      "Encourage respect, empathy, individuality, and meaningful connections through shared creative experiences.",
  },

  littleArtists: {
    eyebrow: "Little Artists",
    title: "Every child is an",
    highlight: "artist",
    description: "Hover over our little artists and watch their ideas come to life.",
    watchMeDraw: "Watch me draw",
    kidAarav: "Sketching a home",
    kidMeera: "Painting a rainbow",
    kidDiya: "Drawing a flower",
    cta: "Your little one could be our next artist.",
    enrollChild: "Enroll your child",
    tryFunZone: "Try the Fun Zone",
  },

  classes: {
    eyebrow: "Art Classes",
    title: "Grow Beyond the",
    highlight: "Canvas",
    description:
      "Every stage of learning is an opportunity to develop artistic skills, patience, observation, imagination, focus, and independent thinking. We encourage students to experiment, learn from mistakes, and build confidence through practice.",
    paceTitle: "Every Artist Grows at Their Own Pace.",
    paceDesc:
      "From learning the fundamentals to developing advanced techniques, we guide learners through a structured creative journey that values progress, practice, and individual expression.",
    duration: "Duration",
    batch: "Batch",
    weeklySchedule: "Weekly Schedule",
    perMonthOffline: "/mo Offline",
    perMonthOnline: "/mo Online",
    howEyebrow: "How You Learn",
    howTitle: "Choose your",
    howHighlight: "format",
  },

  classFinder: {
    eyebrow: "Class Finder",
    title: "Not sure where to",
    highlight: "start?",
    description: "Answer three quick questions and we'll suggest the right course for your child.",
    questionOf: "Question {n} of {total}",
    ageTitle: "How old is your child?",
    age5to8: "5 – 8 years",
    age9to12: "9 – 12 years",
    age13to16: "13 – 16 years",
    ageOver16: "Older than 16",
    experienceTitle: "How much art have they learned so far?",
    expBasic: "Just starting out",
    expBasicHint: "No formal art classes yet",
    expAdvanced: "Finished a beginner course",
    expAdvancedHint: "Comfortable with pencil & shading",
    expPro: "Finished an advanced course",
    expProHint: "Ready to build a portfolio",
    modeTitle: "Where would they like to learn?",
    modeOffline: "In our Bangalore studio",
    modeOfflineHint: "Offline, in-person classes",
    modeOnline: "Live online from home",
    modeOnlineHint: "Live video classes",
    talkEyebrow: "Let's talk",
    olderTitle: "Our courses are built for ages 5–16",
    olderText: "Reach out and we'll help you find a workshop or session that suits an older learner.",
    contactUs: "Contact us",
    retake: "Retake quiz",
    pickEyebrow: "Our pick for your child",
    certificate: "Certificate included",
    liveOnline: "Live online",
    studio: "Studio · Bangalore",
    perMonth: "per month",
    enrollIn: "Enroll in {tier}",
  },

  workshop: {
    eyebrow: "Creativity Brings Us Together",
    title: "Create, Connect, and",
    highlight: "Discover",
    description:
      "Our creative workshops offer opportunities to explore new techniques, experiment with ideas, express individuality, and learn together. We aim to make creativity an engaging experience where everyone can participate, grow, and appreciate different perspectives.",
    seatsLeft: "Only {count} seats left",
  },

  gallery: {
    eyebrow: "Gallery",
    title: "A Gallery of",
    highlight: "Creativity and Growth",
    description:
      "Every creation tells a story of exploration, practice, and progress. Celebrate the ideas, individual expression, and creative journeys of our learners.",
    all: "All",
  },

  funZone: {
    eyebrow: "Student Fun Zone",
    title: "Let's color and",
    highlight: "create",
    description:
      "Pick a picture and fill it with your favourite colors, or grab a brush and draw anything you like. Save it and show your family!",
    modeColor: "Color a picture",
    modeDraw: "Free drawing",
    choosePicture: "Choose a picture",
    pickColor: "Pick a color",
    colors: "Colors",
    customColor: "Custom color",
    pickAnyColor: "Pick any color",
    tapToFill: "Tap any part of the picture to fill it.",
    coloringPageLabel: "{title} coloring page",
    pictureButterfly: "Butterfly",
    pictureFish: "Happy Fish",
    pictureHouse: "My House",
    pictureFlower: "Flower Pot",
    undo: "Undo",
    surprise: "Surprise me",
    startOver: "Start over",
    download: "Download",
    share: "Share",
    clear: "Clear",
    tools: "Tools",
    brush: "Brush",
    rainbow: "Rainbow",
    stamps: "Stamps",
    eraser: "Eraser",
    size: "Size",
    sizeSmall: "Small",
    sizeMedium: "Medium",
    sizeLarge: "Large",
    sizeHuge: "Huge",
    pickStamp: "Pick a stamp",
    stampHint: "Tap the paper to stamp. Size changes the stamp too.",
    rainbowHint: "Rainbow brush picks the colors for you!",
    canvasLabel: "Drawing canvas",
    shareText: "Look what I made in the Zayit Academy Fun Zone! 🎨",
    shareTitle: "My artwork",
  },

  store: {
    eyebrow: "Art Store",
    title: "Framed artwork &",
    highlight: "materials",
    description:
      "Original framed pieces from our students and instructors, plus everything you need to start creating today.",
    addToWishlist: "Add to wishlist",
    buyNow: "Buy now",
    kitTitleLine1: "Everything Included",
    kitTitleLine2: "Materials Kit",
    kitDescription: "Everything a beginner needs in one box — sourced and packed by us.",
    shopKit: "Shop the Kit →",
  },

  accessories: {
    eyebrow: "Accessories",
    title: "Stock up on the",
    highlight: "essentials",
    description: "Quality art supplies and tools curated for every creative journey.",
    viewAll: "View All",
    items: "{count} items",
  },

  events: {
    eyebrow: "Community Events",
    title: "Where we've brought",
    highlight: "art to life",
    description:
      "From school campuses to corporate parks, Zayit Academy travels to bring hands-on creative experiences to your community.",
    bookEvent: "Book an Event",
  },

  collaboration: {
    eyebrow: "Collaboration",
    title: "Art That",
    highlight: "Connects Us",
    description:
      "We believe creativity can bring people together, encourage meaningful conversations, and communicate messages of peace, unity, kindness, and hope. We welcome opportunities to collaborate with schools, residential communities, and organisations through workshops, collaborative art, and community projects.",
    optionsTitle: "Collaboration Opportunities",
    imageAlt: "Instructor collaborating with students",
    thanks: "Thank you!",
    thanksText: "Our team will reach out to you shortly.",
    name: "Name",
    namePlaceholder: "Your full name",
    organisation: "Organisation",
    organisationPlaceholder: "School, company, or residential community",
    email: "Email",
    mobile: "Mobile",
    collaborationType: "Type of Collaboration",
    preferredDate: "Preferred Date",
    purpose: "Purpose",
    purposePlaceholder: "Workshop, event, custom art…",
    message: "Message",
    messagePlaceholder: "Tell us more about what you're planning...",
    send: "Send Message",
  },

  about: {
    eyebrow: "The Founder’s Story",
    title: "Chalz Simon",
    highlight: "From Self-Doubt to Self-Discovery",
    story:
      "Art became more than a creative interest in my life. It gave me a way to express myself, explore my abilities, and gradually discover my potential.\n\nThat experience shaped my belief that everyone deserves the opportunity to grow, build confidence, and discover their abilities without being defined by discouragement or the opinions of others.\n\nZayit Academy was born from this belief: that creative education can inspire people to learn, express themselves, and grow—not only as artists, but as individuals.",
    aboutZayitTitle: "About Zayit Academy",
    aboutZayitText:
      "Zayit Academy believes that art is more than a skill—it is a journey of self-discovery, confidence, and personal growth.\n\nThrough creative learning, we encourage individuals to explore their potential, express themselves freely, think independently, and develop patience, focus, and imagination.\n\nOur vision is to spread peace through art by nurturing creativity, kindness, and respect, helping people grow not only as artists, but as individuals.",
    aboutZayitTagline: "Create with Purpose. Grow with Confidence. Spread Peace Through Art.",
    missionTitle: "Mission",
    missionTagline: "Teach Skills. Inspire Confidence. Nurture Creativity.",
    mission:
      "We aim to create a supportive learning environment where people can develop artistic skills, explore ideas, express themselves, learn from mistakes, and discover their potential.",
    visionTitle: "Vision",
    visionTagline: "Spreading Peace Through Art.",
    vision:
      "We envision a world where creativity nurtures self-understanding, confidence, compassion, and respect—one person, one heart, and one creation at a time.",
    closingTitle: "A Better World Begins Within.",
    closingText: "Discover your creativity. Develop your potential. Share your gifts with the world.",
    closingSignature: "One Mind. One Heart. One Creation at a Time.",
    quote: "Create with Purpose. Grow with Confidence. Spread Peace Through Art.",
    quoteBy: "— Chalz Simon, Founder",
    imageAlt: "Chalz Simon, founder of Zayit Academy",
  },

  contact: {
    eyebrow: "Contact",
    title: "Come say",
    highlight: "hello",
    description: "Have a question before you enroll? Reach out — we're happy to help you pick the right course.",
    call: "Call Us",
    email: "Email Us",
    hours: "Working Hours",
    visit: "Visit Us",
    phoneValue: "[Add phone number]",
    emailValue: "[Add email address]",
    hoursValue: "Mon – Sat · 10 AM – 7 PM",
    addressValue: "Zayit Studio, Bangalore, Karnataka",
    mapTitle: "Zayit Academy Location",
  },

  enroll: {
    eyebrow: "Enroll",
    title: "Start your",
    highlight: "art journey",
    description: "Pick a course and format, tell us about the student, and we'll confirm your seat.",
    step1: "Choose a course",
    step1Hint: "Click a card (or press Tab then Enter) to select it.",
    step2: "Choose a class format",
    step2Hint: "Offline meets in-studio; online is a live video class.",
    formatLabel: "Class format",
    selection: "Your selection",
    doneTitle: "You're on the list!",
    doneText: "We'll call you shortly to confirm the seat for {course} ({mode}).",
    step3: "Your details",
    step3Hint: "Fields marked * are required — we'll use these to confirm your seat.",
    studentName: "Student Name",
    fullName: "Full name",
    studentAge: "Student Age",
    agePlaceholder: "e.g. 9",
    ageHint: "Ages 5–16",
    parentName: "Parent / Guardian Name",
    mobile: "Mobile Number",
    email: "Email Address",
    message: "Message",
    messagePlaceholder: "Anything we should know before your first class?",
    confirm: "Confirm Enrollment",
    consent: "By submitting, you agree to be contacted by Zayit Academy about this enrollment.",
  },

  faq: {
    eyebrow: "FAQ",
    title: "Questions,",
    highlight: "answered",
    description: "Everything you need to know about our classes, workshops, and more.",
  },

  testimonials: {
    eyebrow: "Testimonials",
    title: "Loved by students",
    highlight: "& parents",
    description: "Real stories from our community of artists, creators, and dreamers.",
    averageRating: "Average Rating",
  },

  services: {
    eyebrow: "Other Services",
    title: "Beyond the",
    highlight: "classroom",
    description: "Murals, wall art and custom commissions — we bring the studio to you.",
  },

  footer: {
    blurb: "Create with Purpose. Grow with Confidence. Spreading Peace Through Art.",
    quickLinks: "Quick Links",
    support: "Support",
    helpCenter: "Help Center",
    courseSupport: "Course Support",
    customerSupport: "Customer Support",
    faq: "FAQ",
    accessories: "Accessories",
    otherServices: "Other Services",
    testimonials: "Testimonials",
    settings: "Settings & Themes",
    stayInspired: "Stay Inspired",
    newsletter: "Get workshop dates, new store drops and student features in your inbox.",
    emailPlaceholder: "you@email.com",
    subscribe: "Subscribe",
    rights: "© {year} Zayit Academy. All rights reserved.",
  },

  floating: {
    backToTop: "Back to top",
    callUs: "Call us",
    whatsapp: "Chat on WhatsApp",
  },

  settings: {
    eyebrow: "Settings",
    title: "Make Zayit",
    highlight: "yours",
    description:
      "Pick a color theme, adjust reading comfort and choose which fun effects play. Changes apply instantly and are saved on this device.",
    languageTitle: "Language",
    languageDescription: "Read the whole website in your language.",
    themeTitle: "Color theme",
    themeDescription: "Recolor the whole website. Sage Garden is the original design.",
    original: "Original",
    themeSage: "Sage Garden",
    themeSageTagline: "The original Zayit look",
    themeOcean: "Ocean Breeze",
    themeOceanTagline: "Calm, cool blues",
    themeSunset: "Sunset Clay",
    themeSunsetTagline: "Warm terracotta",
    themeLavender: "Lavender Dream",
    themeLavenderTagline: "Soft, gentle purple",
    themeRose: "Rose Petal",
    themeRoseTagline: "Dusty, friendly pink",
    themeGolden: "Golden Hour",
    themeGoldenTagline: "Sunny ochre warmth",
    previewExplore: "Explore",
    readingTitle: "Reading comfort",
    readingDescription: "Make text bigger, change the heading style, or strengthen light text.",
    textSize: "Text size",
    sizeSmall: "Small",
    sizeDefault: "Default",
    sizeLarge: "Large",
    sizeExtraLarge: "Extra large",
    headingStyle: "Heading style",
    fontElegant: "Elegant",
    fontModern: "Modern",
    fontPlayful: "Playful",
    sample: "Aa",
    strongerText: "Stronger text",
    strongerTextDescription: "Darkens light grey text for easier reading.",
    preview: "Preview",
    previewBody: "Small batches, real mentorship and plenty of colour — offline in Bangalore or live online.",
    previewMeta: "Ages 5–16 · Certificate included",
    motionTitle: "Motion & effects",
    motionDescription: "Turn the playful animations on or off.",
    reduceMotion: "Reduce motion",
    reduceMotionDevice: "Your device already asks for less motion, so animations are calmed.",
    reduceMotionDescription: "Calms page animations and pauses all the effects below.",
    effectTrail: "Cursor paint trail",
    effectTrailDescription: "Colorful paint dots follow your mouse on the home page.",
    effectSplash: "Menu click splash",
    effectSplashDescription: "The menu bubble bursts into a paint splash when you click a link.",
    effectDoodles: "Crayon doodles",
    effectDoodlesDescription: "Hand-drawn stars, hearts and spirals around the page.",
    saved: "Saved automatically on this device",
    reset: "Reset to original",
  },

  notFound: {
    title: "Page not found",
    text: "The page you're looking for doesn't exist.",
    home: "Go back home",
  },

  // English content lives in lib/data.ts, so nothing to override here
  data: {} as DataTranslations,
};

// What each other language file provides. Keys marked optional aren't translated
// everywhere yet; lib/i18n shows the English text until they are.
export type Translation = Omit<typeof en, "visionValues" | "classes" | "collaboration" | "about"> & {
  visionValues?: typeof en.visionValues;
  classes: Omit<typeof en.classes, "paceTitle" | "paceDesc"> & {
    paceTitle?: string;
    paceDesc?: string;
  };
  collaboration: Omit<
    typeof en.collaboration,
    "optionsTitle" | "organisation" | "organisationPlaceholder" | "collaborationType" | "preferredDate"
  > & {
    optionsTitle?: string;
    organisation?: string;
    organisationPlaceholder?: string;
    collaborationType?: string;
    preferredDate?: string;
  };
  about: Omit<
    typeof en.about,
    | "founderName"
    | "founderSubtitle"
    | "aboutZayitTitle"
    | "aboutZayitText"
    | "aboutZayitTagline"
    | "missionTagline"
    | "visionTagline"
    | "closingTitle"
    | "closingText"
    | "closingSignature"
  > & {
    founderName?: string;
    founderSubtitle?: string;
    aboutZayitTitle?: string;
    aboutZayitText?: string;
    aboutZayitTagline?: string;
    missionTagline?: string;
    visionTagline?: string;
    closingTitle?: string;
    closingText?: string;
    closingSignature?: string;
  };
};

export default en;
