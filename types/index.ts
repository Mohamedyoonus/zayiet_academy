export interface CourseHighlight {
  label: string;
  value: string;
}

export interface Course {
  id: string;
  tier: "Basic" | "Advanced" | "Pro";
  title: string;
  description: string;
  duration: string;
  schedule: string;
  batchSize: string;
  certificate: boolean;
  feeOnline: number;
  feeOffline: number;
  highlights: string[];
  image: string;
}

export interface DeliveryMode {
  id: string;
  title: string;
  icon: string;
  points: string[];
}

export interface WorkshopEvent {
  id: string;
  title: string;
  venue: string;
  date: string;
  image: string;
  seatsLeft: number;
}

export interface Product {
  id: string;
  name: string;
  category: "kit" | "framed-art" | "accessory";
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
}

export interface AccessoryCategory {
  id: string;
  name: string;
  image: string;
  itemCount: number;
}

export interface EventClient {
  id: string;
  category: "Schools" | "IT Parks" | "Colleges" | "Community";
  name: string;
  year: string;
  description: string;
}

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface GalleryItem {
  id: string;
  category: "Portrait" | "Landscape" | "Sketch" | "Painting" | "Workshop" | "Students";
  image: string;
  title: string;
  height: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: "Student" | "Parent";
  rating: number;
  quote: string;
  image: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface CounterStat {
  label: string;
  value: number;
  suffix: string;
}
