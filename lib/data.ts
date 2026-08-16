import {
  Course,
  DeliveryMode,
  WorkshopEvent,
  Product,
  AccessoryCategory,
  EventClient,
  ServiceCard,
  GalleryItem,
  Testimonial,
  FAQItem,
  CounterStat,
} from "@/types";

export const nav = [
  { label: "Home", href: "/" },
  { label: "Classes", href: "/#classes" },
  { label: "Workshop", href: "/#workshop" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Store", href: "/store" },
  { label: "Events", href: "/events" },
  { label: "Collaboration", href: "/collaboration" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const courses: Course[] = [
  {
    id: "basic",
    tier: "Basic",
    title: "Basic Course",
    description: "Where every young artist begins — line, form, shading and confidence, built one visual class at a time. For ages 5–16.",
    duration: "6 Months",
    schedule: "2 classes / week · 1.5 hrs each",
    batchSize: "15 Students Only",
    certificate: true,
    feeOnline: 1500,
    feeOffline: 1700,
    highlights: ["Fully visual, hands-on classes", "Pencil, shading & basic composition", "Small 15-seat batches", "Certificate of completion"],
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "advanced",
    tier: "Advanced",
    title: "Advanced Course",
    description: "Deeper technique, colour theory and closer mentoring for students moving on from Basic.",
    duration: "6 Months",
    schedule: "2 classes / week · 1.5 hrs each",
    batchSize: "15 Students Only",
    certificate: true,
    feeOnline: 2000,
    feeOffline: 2200,
    highlights: ["Advanced shading & colour theory", "Closer, small-batch mentoring", "Mixed media exploration", "Certificate of completion"],
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "pro",
    tier: "Pro",
    title: "Pro Course",
    description: "Portfolio-ready technique for students completing their journey from Basic through Advanced to Pro.",
    duration: "6 Months",
    schedule: "2 classes / week · 1.5 hrs each",
    batchSize: "15 Students Only",
    certificate: true,
    feeOnline: 2300,
    feeOffline: 2500,
    highlights: ["Portfolio-ready final pieces", "Exhibition-style showcase", "Closer, one-on-one guidance", "Certificate of completion"],
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1200&auto=format&fit=crop",
  },
];

// New students pay a minimum of 3 months' fees at the time of admission.
export const admissionNote = "New admissions require a minimum of 3 months' fees to be paid upfront.";

export const deliveryModes: DeliveryMode[] = [
  {
    id: "offline",
    title: "Offline Classes",
    icon: "school",
    points: ["In-studio guided sessions in Bangalore", "24 weeks (6 months) · 15 students per batch", "Certificate included"],
  },
  {
    id: "online-live",
    title: "Online Live Classes",
    icon: "video",
    points: ["24 weeks live sessions, 2/week", "Lifetime video access", "Certificate · limited students per batch"],
  },
  {
    id: "pre-recorded",
    title: "Pre-Recorded Classes",
    icon: "play",
    points: ["70+ hours of content", "12 weeks, learn at your own pace", "Lifetime access + certificate"],
  },
];

export const workshops: WorkshopEvent[] = [
  {
    id: "w1",
    title: "Gated Community Art Workshop",
    venue: "Venue announced on registration",
    date: "Register for upcoming dates",
    image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=1200&auto=format&fit=crop",
    seatsLeft: 8,
  },
  {
    id: "w2",
    title: "Apartment Association Workshop",
    venue: "Venue announced on registration",
    date: "Register for upcoming dates",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1200&auto=format&fit=crop",
    seatsLeft: 6,
  },
  {
    id: "w3",
    title: "School Art Workshop",
    venue: "Venue announced on registration",
    date: "Register for upcoming dates",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop",
    seatsLeft: 10,
  },
];

export const products: Product[] = [
  { id: "p1", name: "Framed Sunset Study — Original", category: "framed-art", price: 4200, oldPrice: 5600, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop", rating: 4.9 },
  { id: "p2", name: "Framed Portrait Sketch", category: "framed-art", price: 2800, image: "https://images.unsplash.com/photo-1549289524-06cf8837ace5?q=80&w=1000&auto=format&fit=crop", rating: 4.8 },
  { id: "p3", name: "Framed Botanical Watercolour", category: "framed-art", price: 3600, oldPrice: 4400, image: "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?q=80&w=1000&auto=format&fit=crop", rating: 5.0 },
  { id: "p4", name: "Beginner's Materials Kit", category: "kit", price: 1299, oldPrice: 1699, image: "https://images.unsplash.com/photo-1596496181848-3091d4878b24?q=80&w=1000&auto=format&fit=crop", rating: 4.7 },
  { id: "p5", name: "Charcoal Pencil Set", category: "kit", price: 249, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop", rating: 4.6 },
  { id: "p6", name: "Professional Brush Set", category: "kit", price: 899, image: "https://images.unsplash.com/photo-1502476379703-c15ce3b48a0c?q=80&w=1000&auto=format&fit=crop", rating: 4.8 },
];

export const materialsKit = [
  "Charcoal Pencil",
  "Brush Set",
  "Drawing / Note Book — 150 GSM",
  "Mechanical Eraser",
  "Brustro Drawing Paper — 200 GSM (Pack of 50)",
  "Art Eraser",
  "Electric Eraser",
  "Baco Bamboo Tissues",
  "Blending Stumps",
];

export const accessories: AccessoryCategory[] = [
  { id: "a1", name: "Papers", image: "https://images.unsplash.com/photo-1517697471339-4aa32003c11a?q=80&w=800&auto=format&fit=crop", itemCount: 14 },
  { id: "a2", name: "Pencils", image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?q=80&w=800&auto=format&fit=crop", itemCount: 30 },
  { id: "a3", name: "Erasers", image: "https://images.unsplash.com/photo-1583505150956-9c8c6c72c4b3?q=80&w=800&auto=format&fit=crop", itemCount: 11 },
  { id: "a4", name: "Books", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop", itemCount: 17 },
  { id: "a5", name: "Brushes", image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=800&auto=format&fit=crop", itemCount: 22 },
  { id: "a6", name: "Canvas", image: "https://images.unsplash.com/photo-1600431521340-491eca880813?q=80&w=800&auto=format&fit=crop", itemCount: 9 },
  { id: "a7", name: "Color Kits", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop", itemCount: 12 },
];

export const eventClients: EventClient[] = [
  { id: "e1", category: "Schools", name: "School Art Immersion", year: "2026", description: "Multi-day art workshops for school students, culminating in a student exhibition." },
  { id: "e2", category: "IT Parks", name: "IT Park Creative Wellness Day", year: "2025", description: "Stress-relief sketching and mindful painting sessions for corporate teams." },
  { id: "e3", category: "Colleges", name: "College Fine Arts Fest", year: "2025", description: "Live portrait and mural demonstrations across college fests." },
  { id: "e4", category: "Community", name: "Gated Community Art Camp", year: "2026", description: "Weekend art workshops for children across gated communities and apartment associations." },
];

export const otherServices: ServiceCard[] = [
  { id: "s1", title: "Wall Painting", description: "Bring colour and story to blank walls — homes, schools, cafés and more.", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop" },
  { id: "s2", title: "Wall Designing", description: "Custom motifs, murals and typography designed for your exact space.", image: "https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?q=80&w=1000&auto=format&fit=crop" },
  { id: "s3", title: "Custom Art", description: "Commissioned pieces — portraits, landscapes and abstracts made to order.", image: "https://images.unsplash.com/photo-1578926288207-a90a5366759d?q=80&w=1000&auto=format&fit=crop" },
  { id: "s4", title: "Art At Your Place", description: "Our instructors travel to you for private lessons or live-painting events.", image: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?q=80&w=1000&auto=format&fit=crop" },
  { id: "s5", title: "Murals", description: "Large-scale statement murals for public spaces, campuses and offices.", image: "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?q=80&w=1000&auto=format&fit=crop" },
  { id: "s6", title: "Corporate Decoration", description: "Art installations and decor that give your workplace real character.", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop" },
];

export const galleryItems: GalleryItem[] = [
  { id: "g1", category: "Portrait", image: "https://images.unsplash.com/photo-1549289524-06cf8837ace5?q=80&w=800&auto=format&fit=crop", title: "Study in Graphite", height: 420 },
  { id: "g2", category: "Landscape", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop", title: "Hills at Dusk", height: 320 },
  { id: "g3", category: "Sketch", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop", title: "Quick Figure Sketch", height: 380 },
  { id: "g4", category: "Painting", image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=800&auto=format&fit=crop", title: "Abstract in Ember", height: 460 },
  { id: "g5", category: "Workshop", image: "https://images.unsplash.com/photo-1522205408450-add114ad53fe?q=80&w=800&auto=format&fit=crop", title: "Saturday Studio Session", height: 340 },
  { id: "g6", category: "Students", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop", title: "Foundation Batch 12", height: 400 },
  { id: "g7", category: "Painting", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop", title: "Sunset Study", height: 300 },
  { id: "g8", category: "Landscape", image: "https://images.unsplash.com/photo-1519638399535-1b036603ac77?q=80&w=800&auto=format&fit=crop", title: "River Bend", height: 440 },
  { id: "g9", category: "Portrait", image: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?q=80&w=800&auto=format&fit=crop", title: "Charcoal Portrait", height: 360 },
  { id: "g10", category: "Sketch", image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=800&auto=format&fit=crop", title: "Hands Study", height: 320 },
  { id: "g11", category: "Workshop", image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=800&auto=format&fit=crop", title: "Live Demo Day", height: 420 },
  { id: "g12", category: "Students", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop", title: "Pro Batch Showcase", height: 380 },
];

export const testimonials: Testimonial[] = [
  { id: "t1", name: "Priya Ramesh", role: "Parent", rating: 5, quote: "My daughter joined the Foundation course hesitant to even hold a pencil with confidence. Six months later, her sketchbook is full and so is her confidence.", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" },
  { id: "t2", name: "Arjun Vel", role: "Student", rating: 5, quote: "The Pro batch is where I actually built a portfolio worth showing. The mentoring felt personal, not like a classroom of thirty.", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop" },
  { id: "t3", name: "Meena Sundaram", role: "Parent", rating: 5, quote: "Small batch sizes made all the difference. Every class felt like personal attention, not a crowd.", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop" },
  { id: "t4", name: "Karthik R", role: "Student", rating: 4, quote: "Loved the pre-recorded track — I could learn at 11pm after work and still keep up with lifetime access to every lesson.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" },
];

export const faqs: FAQItem[] = [
  { id: "f1", question: "What age group is Zayith Academy for?", answer: "Our classes are designed for children aged 5–16 years, progressing through the Basic, Advanced and Pro levels." },
  { id: "f2", question: "Do I need any prior art experience to join Basic?", answer: "No prior experience is required. The Basic course is built from the ground up — line, form and shading — through fully visual, hands-on classes." },
  { id: "f3", question: "What's the difference between Online Live and Pre-Recorded classes?", answer: "Online Live mirrors the offline schedule with real-time instructor feedback over 24 weeks. Pre-Recorded gives you 70+ hours of structured lessons across 12 weeks with lifetime access, so you can learn at your own pace." },
  { id: "f4", question: "Is a certificate provided for every course?", answer: "Yes — Basic, Advanced, Pro, Online Live and Pre-Recorded courses all include a certificate of completion." },
  { id: "f5", question: "How large are the batches?", answer: "We intentionally cap batches at 15 students so every student gets real, individual attention from instructors." },
  { id: "f6", question: "Is there a minimum fee to be paid at admission?", answer: "Yes — every new student pays a minimum of 3 months' course fees at the time of admission." },
  { id: "f7", question: "Where are your classes held?", answer: "We run offline classes from our Bangalore studio as well as live online classes, so you can choose whichever fits your schedule. Offline batches are ₹200/month more than online to cover studio costs." },
  { id: "f8", question: "Can Zayith Academy host a workshop at our community, school or office?", answer: "Absolutely — we regularly run workshops at gated communities, apartment associations, schools, IT parks and colleges. Use the Collaboration form to share your event details and our team will get back to you." },
  { id: "f9", question: "Do you offer materials, or do I need to buy my own?", answer: "Our Art Store stocks a complete Materials Kit — charcoal pencils, brush sets, drawing paper and more — so you can get started without hunting for supplies." },
];

export const counters: CounterStat[] = [
  { label: "Students Trained", value: 1200, suffix: "+" },
  { label: "Awards Won", value: 18, suffix: "" },
  { label: "Years of Experience", value: 9, suffix: "+" },
  { label: "Projects Completed", value: 240, suffix: "+" },
];
