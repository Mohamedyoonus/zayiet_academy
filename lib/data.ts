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
  { label: "Store", href: "/#store" },
  { label: "Events", href: "/#events" },
  { label: "Collaboration", href: "/#collaboration" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export const courses: Course[] = [
  {
    id: "foundation",
    tier: "Foundation",
    title: "Foundation Course",
    description: "Where every artist begins — line, form, shading and confidence, built one class at a time.",
    duration: "24 Weeks",
    schedule: "2 classes / week · 1.5 hrs each",
    batchSize: "15 Students Only",
    certificate: true,
    fee: 1500,
    oldFee: 2100,
    highlights: ["Fully visual, hands-on classes", "Pencil, shading & basic composition", "Small 15-seat batches", "Certificate of completion"],
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "intermediate",
    tier: "Intermediate",
    title: "Intermediate / Advance",
    description: "Advanced techniques, colour theory and mentoring for students ready to push further.",
    duration: "8 Months",
    schedule: "Professional guidance",
    batchSize: "15 Students Only",
    certificate: true,
    fee: 3200,
    highlights: ["Advanced shading & colour theory", "One-on-one professional mentoring", "Mixed media exploration", "Certificate of completion"],
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "final-pro",
    tier: "Final Pro",
    title: "Final Pro",
    description: "Portfolio building and career guidance for students ready to take art from passion to profession.",
    duration: "8 Months",
    schedule: "Studio-style sessions",
    batchSize: "12 Students Only",
    certificate: true,
    fee: 5000,
    highlights: ["Portfolio building for admissions", "Career & placement guidance", "Exhibition-ready final pieces", "Certificate of completion"],
    featured: true,
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1200&auto=format&fit=crop",
  },
];

export const deliveryModes: DeliveryMode[] = [
  {
    id: "offline",
    title: "Offline Classes",
    icon: "school",
    points: ["In-studio guided sessions", "24 weeks · 15 students only", "Certificate included"],
  },
  {
    id: "online-live",
    title: "Online Live Classes",
    icon: "video",
    points: ["24 Weeks live sessions", "Lifetime video access", "Certificate · 15 students/batch"],
  },
  {
    id: "pre-recorded",
    title: "Pre-Recorded Classes",
    icon: "play",
    points: ["70+ Hours of content", "12 Weeks structured path", "Lifetime access + certificate"],
  },
];

export const workshops: WorkshopEvent[] = [
  {
    id: "w1",
    title: "Charcoal & Light: A Weekend Intensive",
    venue: "Zayith Studio, Madurai",
    date: "Every Saturday",
    image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=1200&auto=format&fit=crop",
    seatsLeft: 6,
  },
  {
    id: "w2",
    title: "Watercolour Landscapes Under the Sky",
    venue: "Zayith Studio, Madurai",
    date: "Every Sunday",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1200&auto=format&fit=crop",
    seatsLeft: 4,
  },
  {
    id: "w3",
    title: "Portraits in Pencil: Faces & Expression",
    venue: "Zayith Studio, Madurai",
    date: "Monthly · Third Week",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop",
    seatsLeft: 8,
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
  "DOMS Binding Note — 150 GSM",
  "Brustro Drawing Paper — 200 GSM (Pack of 50)",
  "Blending Stumps",
  "Electric Eraser",
  "Art Eraser",
  "Beco Bamboo Tissues",
  "Sketch Book",
];

export const accessories: AccessoryCategory[] = [
  { id: "a1", name: "Papers", image: "https://images.unsplash.com/photo-1517697471339-4aa32003c11a?q=80&w=800&auto=format&fit=crop", itemCount: 14 },
  { id: "a2", name: "Brushes", image: "https://images.unsplash.com/photo-1583505150956-9c8c6c72c4b3?q=80&w=800&auto=format&fit=crop", itemCount: 22 },
  { id: "a3", name: "Canvas", image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=800&auto=format&fit=crop", itemCount: 9 },
  { id: "a4", name: "Books", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop", itemCount: 17 },
  { id: "a5", name: "Pencils", image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?q=80&w=800&auto=format&fit=crop", itemCount: 30 },
  { id: "a6", name: "Markers", image: "https://images.unsplash.com/photo-1600431521340-491eca880813?q=80&w=800&auto=format&fit=crop", itemCount: 18 },
  { id: "a7", name: "Color Kits", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop", itemCount: 12 },
];

export const eventClients: EventClient[] = [
  { id: "e1", category: "Schools", name: "Government Higher Secondary School", year: "2026", description: "3-day art immersion for grades 6–10, culminating in a student exhibition." },
  { id: "e2", category: "IT Parks", name: "TIDEL Park Creative Wellness Day", year: "2025", description: "Stress-relief sketching and mindful painting sessions for corporate teams." },
  { id: "e3", category: "Colleges", name: "Fine Arts Fest, Madurai Kamaraj College", year: "2025", description: "Live portrait and mural demonstrations across a two-day college fest." },
  { id: "e4", category: "Community", name: "Ward Cultural Program", year: "2026", description: "Free weekend art camp for children across the community, open to all." },
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
  { id: "g12", category: "Students", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop", title: "Final Pro Showcase", height: 380 },
];

export const testimonials: Testimonial[] = [
  { id: "t1", name: "Priya Ramesh", role: "Parent", rating: 5, quote: "My daughter joined the Foundation course hesitant to even hold a pencil with confidence. Six months later, her sketchbook is full and so is her confidence.", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" },
  { id: "t2", name: "Arjun Vel", role: "Student", rating: 5, quote: "The Final Pro batch is where I actually built a portfolio worth showing. The mentoring felt personal, not like a classroom of thirty.", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop" },
  { id: "t3", name: "Meena Sundaram", role: "Parent", rating: 5, quote: "Small batch sizes made all the difference. Every class felt like personal attention, not a crowd.", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop" },
  { id: "t4", name: "Karthik R", role: "Student", rating: 4, quote: "Loved the pre-recorded track — I could learn at 11pm after work and still keep up with lifetime access to every lesson.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" },
];

export const faqs: FAQItem[] = [
  { id: "f1", question: "Do I need any prior art experience to join Foundation?", answer: "No prior experience is required. The Foundation course is built from the ground up — line, form and shading — for complete beginners of any age." },
  { id: "f2", question: "What's the difference between Online Live and Pre-Recorded classes?", answer: "Online Live mirrors the offline schedule with real-time instructor feedback over 24 weeks. Pre-Recorded gives you 70+ hours of structured lessons across 12 weeks with lifetime access, so you can learn at your own pace." },
  { id: "f3", question: "Is a certificate provided for every course?", answer: "Yes — Foundation, Intermediate, Final Pro, Online Live and Pre-Recorded courses all include a certificate of completion." },
  { id: "f4", question: "How large are the batches?", answer: "We intentionally cap batches at 15 students (12 for Final Pro) so every student gets real, individual attention from instructors." },
  { id: "f5", question: "Can Zayith Academy host a workshop at our school or office?", answer: "Absolutely — we regularly run workshops at schools, IT parks, colleges and community events. Use the Collaboration form to share your event details and our team will get back to you." },
  { id: "f6", question: "Do you offer materials, or do I need to buy my own?", answer: "Our Art Store stocks a complete Materials Kit — charcoal pencils, brush sets, drawing paper and more — so you can get started without hunting for supplies." },
];

export const counters: CounterStat[] = [
  { label: "Students Trained", value: 1200, suffix: "+" },
  { label: "Awards Won", value: 18, suffix: "" },
  { label: "Years of Experience", value: 9, suffix: "+" },
  { label: "Projects Completed", value: 240, suffix: "+" },
];
