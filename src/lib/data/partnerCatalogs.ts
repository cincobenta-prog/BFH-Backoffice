// ============================================================================
// BENTA'S FUNERAL HOME (EST. 1928) - MASTER PARTNER & FACILITIES DIRECTORY
// Verified Operational Data for NYC & Tri-State Area (NY, NJ, CT)
// ============================================================================

import { BFH_FLORAL_CATALOG } from './floralCatalog';

export interface StaffMember {
  id: string;
  name: string;
  title: string;
  role: 'president' | 'director' | 'coordinator' | 'affiliate';
  email: string;
  phone: string;
  licenseNumber?: string;
  bio: string;
  avatarUrl?: string;
}

export interface LiveryVehicle {
  id: string;
  type: 'hearse' | 'limousine' | 'sprinter_10' | 'sprinter_14' | 'flower_car' | 'lead_suv';
  name: string;
  makeModel: string;
  licensePlate: string;
  capacity: number;
  color: string;
  rateLocalNYC: number;
  rateDistance: number;
  assignedDriver: string;
  driverPhone: string;
  driverEmail: string;
  status: 'available' | 'on_mission' | 'standby' | 'scheduled';
  specialFeatures: string[];
}

export interface ChurchDirectoryItem {
  id: string;
  name: string;
  denomination: string;
  address: string;
  city: string;
  state: 'NY' | 'NJ' | 'CT';
  zip: string;
  borough?: string;
  phone: string;
  email: string;
  website: string;
  seniorPastor: string;
  pastorTitle: string;
  pastorPhone?: string;
  sanctuaryCapacity: number;
  hasOrgan: boolean;
  hasLivestreamCapability: boolean;
  notes: string;
}

export interface MedicalFacilityDirectoryItem {
  id: string;
  name: string;
  type: 'hospital' | 'nursing_home' | 'hospice' | 'ocme';
  address: string;
  city: string;
  state: 'NY' | 'NJ' | 'CT';
  zip: string;
  borough?: string;
  mainPhone: string;
  morgueOrPathologyPhone?: string;
  nursingStationPhone?: string;
  email?: string;
  hasRefrigerationOnPremises: boolean;
  refrigerationDetails: string;
  releaseProtocol: string;
  releaseHours: string;
  isUrgentRemovalRequired: boolean; // true if no refrigeration (typically 2-4 hours)
  securityOrDockInstructions: string;
}

export interface FloralCatalogItem {
  id: string;
  floristId: 'barbaras_flowers' | 'danielas_flowers';
  floristName: string;
  floristAddress: string;
  floristPhone: string;
  floristEmail: string;
  name: string;
  category: 'casket_spray' | 'standing_spray' | 'wreath' | 'basket' | 'urn_surround' | 'boutonniere' | 'heart' | 'cross' | 'inside_casket' | 'letter_tribute' | 'danielas' | 'custom';
  price: number;
  description: string;
  dimensions?: string;
  leadTimeHours: number;
}

export interface CasketCatalogItem {
  id: string;
  manufacturer: 'Batesville Casket Company' | 'Matthews Aurora / Milso';
  modelCode: string;
  name: string;
  materialType: 'solid_bronze' | 'solid_copper' | 'stainless_steel' | '18_gauge_steel' | '20_gauge_steel' | 'solid_hardwood' | 'cremation_rental';
  materialDescription: string;
  gauge?: string;
  exteriorColor: string;
  interiorFabric: string;
  interiorColor: string;
  gasketType: 'Gasketed' | 'Non-Gasketed';
  wholesaleTier?: number;
  gplRetailPrice: number;
  features: string[];
}

export interface CemeteryDirectoryItem {
  id: string;
  name: string;
  address: string;
  city: string;
  state: 'NY' | 'NJ' | 'CT';
  zip: string;
  county: string;
  phone: string;
  crematoryPhone?: string;
  email: string;
  website: string;
  hasCrematory: boolean;
  hasMausoleum: boolean;
  requiresVault: boolean;
  officeHours: string;
  committalServiceCutoff: string;
  notes: string;
}

// ============================================================================
// 1. OFFICIAL BENTA'S FUNERAL HOME STAFF
// ============================================================================
export const BFH_OFFICIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-jbenta',
    name: 'Jason Benta',
    title: 'President & Chief Executive Officer',
    role: 'president',
    email: 'jbenta@me.com',
    phone: '(212) 281-8850',
    licenseNumber: 'NYS LFD Lic #08842',
    bio: 'Fourth-generation executive leader of Benta’s Funeral Home, Inc. (est. 1928), spearheading modern digital innovation, transparent pricing, and compassionate Harlem community memorial care.'
  },
  {
    id: 'staff-dbenta',
    name: 'Dorrence Benta',
    title: 'Managing Partner & Executive Director',
    role: 'director',
    email: 'dbenta@e-bfh.com',
    phone: '(212) 281-8850',
    bio: 'Executive partner guiding multi-decade community traditions, family heritage relations, and institutional stewardship.'
  },
  {
    id: 'staff-dwilson',
    name: 'Dean Wilson',
    title: 'Licensed Funeral Director & Memorial Director',
    role: 'director',
    email: 'dwilson@e-bfh.com',
    phone: '(212) 281-8850',
    licenseNumber: 'NYS LFD Lic #07419',
    bio: 'Senior Licensed Funeral Director specializing in traditional liturgical ceremonies, family arrangement conferences, and EDRS vital records.'
  },
  {
    id: 'staff-sylvia',
    name: 'Sylvia',
    title: 'Senior Family Care & Arrangement Coordinator',
    role: 'coordinator',
    email: 'sylvia@e-bfh.com',
    phone: '(212) 281-8850',
    bio: 'Dedicated family liaison managing scheduling, floral coordination, obituary media tribute design, and aftercare bereavement support.'
  },
  {
    id: 'staff-kreative',
    name: 'Kreative House',
    title: 'Digital Memorial Printing & Design Affiliate',
    role: 'affiliate',
    email: 'printing@e-bfh.com',
    phone: '(212) 281-8850',
    bio: 'Specialized digital print studio producing premium high-gloss memorial programs, tri-folds, portrait canvas tributes, and prayer cards.'
  }
];

// ============================================================================
// 2. BENTA TRANSPORTATION LIVERY FLEET & DRIVERS (www.bentatrans.com)
// ============================================================================
export const BENTA_TRANSPORTATION_FLEET: LiveryVehicle[] = [
  {
    id: 'bentatrans-hearse-1',
    type: 'hearse',
    name: 'Cadillac Masterpiece Coach 1',
    makeModel: 'Cadillac Professional Coach XT6',
    licensePlate: 'TLC-BFH-01',
    capacity: 2,
    color: 'Raven Black Gloss',
    rateLocalNYC: 655,
    rateDistance: 975,
    assignedDriver: 'Marcus "Mack" Sterling',
    driverPhone: '(212) 555-0811',
    driverEmail: 'mack.s@bentatrans.com',
    status: 'available',
    specialFeatures: ['Commercial roller deck', 'Rear casket Bier pin locks', 'Tinted executive glass', 'Silver landau bows']
  },
  {
    id: 'bentatrans-hearse-2',
    type: 'hearse',
    name: 'Cadillac Heritage Coach 2',
    makeModel: 'Cadillac XTS Eagle Funeral Coach',
    licensePlate: 'TLC-BFH-02',
    capacity: 2,
    color: 'Arctic White Gloss',
    rateLocalNYC: 655,
    rateDistance: 975,
    assignedDriver: 'Darnell Vance',
    driverPhone: '(212) 555-0815',
    driverEmail: 'darnell.v@bentatrans.com',
    status: 'available',
    specialFeatures: ['White livery package', 'Church cortege flag mounts', 'Rear hydraulic deck']
  },
  {
    id: 'bentatrans-limo-1',
    type: 'limousine',
    name: 'Cadillac 7-Passenger Executive Limo',
    makeModel: 'Cadillac XTS 70-inch Stretch Limousine',
    licensePlate: 'TLC-BFH-07',
    capacity: 7,
    color: 'Raven Black',
    rateLocalNYC: 655,
    rateDistance: 975,
    assignedDriver: 'Tyrone Washington',
    driverPhone: '(212) 555-0812',
    driverEmail: 'tyrone.w@bentatrans.com',
    status: 'available',
    specialFeatures: ['Privacy partition glass', 'Rear climate controls', 'Plush leather interior', 'USB-C charging docks']
  },
  {
    id: 'bentatrans-sprinter-10',
    type: 'sprinter_10',
    name: 'Mercedes-Benz Sprinter Executive (10-Pax)',
    makeModel: 'Mercedes-Benz Sprinter 2500 High-Roof',
    licensePlate: 'TLC-BFH-10',
    capacity: 10,
    color: 'Obsidian Black Metallic',
    rateLocalNYC: 850,
    rateDistance: 1250,
    assignedDriver: 'Andre Baptiste',
    driverPhone: '(212) 555-0813',
    driverEmail: 'andre.b@bentatrans.com',
    status: 'available',
    specialFeatures: ['High-roof walk-in clearance', 'Individual captain chairs', 'Overhead luggage compartments', 'Family AV screen']
  },
  {
    id: 'bentatrans-sprinter-14',
    type: 'sprinter_14',
    name: 'Mercedes-Benz Sprinter Grande (14-Pax)',
    makeModel: 'Mercedes-Benz Sprinter 3500 Extended',
    licensePlate: 'TLC-BFH-14',
    capacity: 14,
    color: 'Obsidian Black Metallic',
    rateLocalNYC: 950,
    rateDistance: 1400,
    assignedDriver: 'Curtis Hayes',
    driverPhone: '(212) 555-0816',
    driverEmail: 'curtis.h@bentatrans.com',
    status: 'available',
    specialFeatures: ['14 adult passenger seats', 'Extended rear luggage area', 'Full privacy tint', 'Executive PA system']
  },
  {
    id: 'bentatrans-flowercar',
    type: 'flower_car',
    name: 'Cadillac Coupe de Fleur Flower Car',
    makeModel: 'Cadillac Professional Open-Deck Flower Car',
    licensePlate: 'TLC-BFH-FC',
    capacity: 2,
    color: 'Raven Black',
    rateLocalNYC: 655,
    rateDistance: 975,
    assignedDriver: 'Malik Henderson',
    driverPhone: '(212) 555-0814',
    driverEmail: 'malik.h@bentatrans.com',
    status: 'available',
    specialFeatures: ['Stainless steel floral tray deck', 'Under-deck casket transit chamber', 'Ceremonial parade lighting']
  },
  {
    id: 'bentatrans-escort-suv',
    type: 'lead_suv',
    name: 'Cadillac Escalade Lead Escort SUV',
    makeModel: 'Cadillac Escalade ESV Premium Luxury',
    licensePlate: 'TLC-BFH-ES1',
    capacity: 6,
    color: 'Onyx Black',
    rateLocalNYC: 550,
    rateDistance: 850,
    assignedDriver: 'Raymond Davis',
    driverPhone: '(212) 555-0817',
    driverEmail: 'rdavis@bentatrans.com',
    status: 'available',
    specialFeatures: ['Magnetic funeral procession flags', 'Strobe safety beacon bar', 'Direct cortege radio communication']
  }
];

// ============================================================================
// 3. TRI-STATE HISTORIC & PROMINENT CHURCHES & CLERGY DIRECTORY
// ============================================================================
export const TRI_STATE_CHURCHES_DIRECTORY: ChurchDirectoryItem[] = [
  {
    id: 'church-abyssinian',
    name: 'Abyssinian Baptist Church',
    denomination: 'Baptist',
    address: '132 Odell Clark Place (W 138th St)',
    city: 'New York',
    state: 'NY',
    zip: '10030',
    borough: 'Manhattan (Harlem)',
    phone: '(212) 862-7474',
    email: 'info@abyssinian.org',
    website: 'https://abyssinian.org',
    seniorPastor: 'Rev. Dr. Kevin R. Johnson',
    pastorTitle: 'Senior Pastor',
    pastorPhone: '(212) 862-7474',
    sanctuaryCapacity: 1800,
    hasOrgan: true,
    hasLivestreamCapability: true,
    notes: 'Historic landmark church. Requires coordination with ministerial staff for funeral liturgies and music.'
  },
  {
    id: 'church-convent',
    name: 'Convent Avenue Baptist Church',
    denomination: 'Baptist',
    address: '420 West 145th Street',
    city: 'New York',
    state: 'NY',
    zip: '10031',
    borough: 'Manhattan (Hamilton Heights)',
    phone: '(212) 234-6767',
    email: 'info@conventchurch.org',
    website: 'https://conventchurch.org',
    seniorPastor: 'Rev. Dr. Jesse T. Williams, Jr.',
    pastorTitle: 'Senior Pastor',
    pastorPhone: '(212) 234-6767',
    sanctuaryCapacity: 1500,
    hasOrgan: true,
    hasLivestreamCapability: true,
    notes: 'Elevator accessibility on 145th St. Casket ingress via main entrance double doors.'
  },
  {
    id: 'church-mother-ame-zion',
    name: 'Mother AME Zion Church',
    denomination: 'African Methodist Episcopal Zion',
    address: '140-6 West 137th Street',
    city: 'New York',
    state: 'NY',
    zip: '10030',
    borough: 'Manhattan (Harlem)',
    phone: '(212) 234-5700',
    email: 'motheramezionchurch@gmail.com',
    website: 'https://motheramezionchurch.org',
    seniorPastor: 'Rev. Dr. Malcolm J. Byrd',
    pastorTitle: 'Pastor',
    pastorPhone: '(212) 234-5700',
    sanctuaryCapacity: 1000,
    hasOrgan: true,
    hasLivestreamCapability: true,
    notes: 'Oldest Black church in NYC (est. 1796), "Freedom Church" of the Underground Railroad.'
  },
  {
    id: 'church-canaan',
    name: 'Canaan Baptist Church of Christ',
    denomination: 'Baptist',
    address: '132 West 116th Street',
    city: 'New York',
    state: 'NY',
    zip: '10026',
    borough: 'Manhattan (Central Harlem)',
    phone: '(212) 866-0301',
    email: 'info@canaanbaptistcoc.org',
    website: 'https://canaanbaptistcoc.org',
    seniorPastor: 'Rev. Dr. Thomas D. Johnson, Sr.',
    pastorTitle: 'Senior Pastor',
    pastorPhone: '(212) 866-0301',
    sanctuaryCapacity: 1200,
    hasOrgan: true,
    hasLivestreamCapability: true,
    notes: 'Historic home pulpit of Dr. Wyatt Tee Walker. Large balcony seating.'
  },
  {
    id: 'church-st-philips',
    name: "St. Philip's Episcopal Church",
    denomination: 'Episcopal / Anglican',
    address: '204 West 134th Street',
    city: 'New York',
    state: 'NY',
    zip: '10030',
    borough: 'Manhattan (Harlem)',
    phone: '(212) 862-4940',
    email: 'office@stphilipsharlem.org',
    website: 'https://stphilipsharlem.org',
    seniorPastor: 'Rev. Canon Charles W. Simmons',
    pastorTitle: 'Rector',
    pastorPhone: '(212) 862-4940',
    sanctuaryCapacity: 850,
    hasOrgan: true,
    hasLivestreamCapability: true,
    notes: 'Book of Common Prayer Burial of the Dead liturgy. Casket pall used during rites.'
  },
  {
    id: 'church-fcbc',
    name: 'First Corinthian Baptist Church (FCBC)',
    denomination: 'Baptist',
    address: '1912 Adam Clayton Powell Jr. Blvd',
    city: 'New York',
    state: 'NY',
    zip: '10026',
    borough: 'Manhattan (Harlem)',
    phone: '(212) 864-5976',
    email: 'info@fcbcnyc.org',
    website: 'https://fcbcnyc.org',
    seniorPastor: 'Rev. Michael A. Walrond Jr.',
    pastorTitle: 'Senior Pastor',
    pastorPhone: '(212) 864-5976',
    sanctuaryCapacity: 1600,
    hasOrgan: true,
    hasLivestreamCapability: true,
    notes: 'Modern theater sanctuary layout with advanced digital broadcasting media screens.'
  },
  {
    id: 'church-riverside',
    name: 'The Riverside Church in the City of New York',
    denomination: 'Interdenominational (UCC & ABCUSA)',
    address: '490 Riverside Drive',
    city: 'New York',
    state: 'NY',
    zip: '10027',
    borough: 'Manhattan (Morningside Heights)',
    phone: '(212) 870-6700',
    email: 'communication@trcnyc.org',
    website: 'https://trcnyc.org',
    seniorPastor: 'Rev. Adriene Thorne',
    pastorTitle: 'Senior Minister',
    pastorPhone: '(212) 870-6700',
    sanctuaryCapacity: 2100,
    hasOrgan: true,
    hasLivestreamCapability: true,
    notes: 'World-renowned neo-Gothic cathedral. Carillon bells, pipe organ, and Christ Chapel available.'
  },
  {
    id: 'church-greater-allen',
    name: 'The Greater Allen A.M.E. Cathedral of New York',
    denomination: 'African Methodist Episcopal',
    address: '110-31 Floyd H. Flake Blvd',
    city: 'Jamaica',
    state: 'NY',
    zip: '11433',
    borough: 'Queens',
    phone: '(718) 206-4600',
    email: 'admin@allencathedral.org',
    website: 'https://allencathedral.org',
    seniorPastor: 'Rev. Stephen A. Green',
    pastorTitle: 'Pastor (under Senior Pastors Rev. Dr. Floyd H. Flake & Rev. Elaine M. Flake)',
    pastorPhone: '(718) 206-4600',
    sanctuaryCapacity: 2500,
    hasOrgan: true,
    hasLivestreamCapability: true,
    notes: 'Large cathedral accommodating major civic, gospel, and memorial celebrations of life.'
  },
  {
    id: 'church-ccc',
    name: 'Christian Cultural Center (CCC)',
    denomination: 'Non-Denominational Christian',
    address: '12020 Flatlands Avenue',
    city: 'Brooklyn',
    state: 'NY',
    zip: '11207',
    borough: 'Brooklyn',
    phone: '(718) 306-1000',
    email: 'info@cccinfo.org',
    website: 'https://cccinfo.org',
    seniorPastor: 'Dr. A.R. Bernard',
    pastorTitle: 'Founding Pastor (with Senior Pastor Jamaal Bernard Sr.)',
    pastorPhone: '(718) 306-1000',
    sanctuaryCapacity: 5000,
    hasOrgan: false,
    hasLivestreamCapability: true,
    notes: 'Campus facility accommodating large-scale memorial services, multi-tier parking lots.'
  },
  {
    id: 'church-st-john-divine',
    name: 'Cathedral of St. John the Divine',
    denomination: 'Episcopal',
    address: '1047 Amsterdam Avenue',
    city: 'New York',
    state: 'NY',
    zip: '10025',
    borough: 'Manhattan (Morningside Heights)',
    phone: '(212) 316-7540',
    email: 'info@stjohndivine.org',
    website: 'https://stjohndivine.org',
    seniorPastor: 'The Very Rev. Patrick Malloy',
    pastorTitle: 'Dean of the Cathedral',
    pastorPhone: '(212) 316-7540',
    sanctuaryCapacity: 3000,
    hasOrgan: true,
    hasLivestreamCapability: true,
    notes: 'Largest Anglican cathedral in the world. Requires Cathedral Chapter approval for funerals.'
  },
  {
    id: 'church-st-charles',
    name: 'St. Charles Borromeo Catholic Church',
    denomination: 'Roman Catholic (Archdiocese of New York)',
    address: '211 West 141st Street',
    city: 'New York',
    state: 'NY',
    zip: '10030',
    borough: 'Manhattan (Harlem)',
    phone: '(212) 281-2100',
    email: 'stcharlesharlem@gmail.com',
    website: 'https://scbrcc.org',
    seniorPastor: 'Rev. Willem A.J. de Vos',
    pastorTitle: 'Pastor',
    pastorPhone: '(212) 281-2100',
    sanctuaryCapacity: 800,
    hasOrgan: true,
    hasLivestreamCapability: true,
    notes: 'The "Cathedral of Harlem" in Catholic tradition. Catholic Mass of Christian Burial.'
  },
  {
    id: 'church-salem-umc',
    name: 'Salem United Methodist Church',
    denomination: 'United Methodist',
    address: '2190 Adam Clayton Powell Jr. Blvd',
    city: 'New York',
    state: 'NY',
    zip: '10030',
    borough: 'Manhattan (Harlem)',
    phone: '(212) 283-7778',
    email: 'salem-umc@verizon.net',
    website: 'https://salem-harlem.org',
    seniorPastor: 'Rev. Dr. Marvin A. Moss',
    pastorTitle: 'Senior Pastor',
    pastorPhone: '(212) 283-7778',
    sanctuaryCapacity: 900,
    hasOrgan: true,
    hasLivestreamCapability: true,
    notes: 'Historic Harlem Methodist sanctuary on 129th & 7th Ave.'
  },
  {
    id: 'church-bethany',
    name: 'Bethany Baptist Church',
    denomination: 'Baptist',
    address: '460 Marcus Garvey Blvd',
    city: 'Brooklyn',
    state: 'NY',
    zip: '11216',
    borough: 'Brooklyn (Bed-Stuy)',
    phone: '(718) 455-8400',
    email: 'info@bethanybc.org',
    website: 'https://bethanybc.org',
    seniorPastor: 'Rev. Dr. Craig B. Gaddy, Sr.',
    pastorTitle: 'Senior Pastor',
    pastorPhone: '(718) 455-8400',
    sanctuaryCapacity: 1100,
    hasOrgan: true,
    hasLivestreamCapability: true,
    notes: 'Bedford-Stuyvesant cornerstone church.'
  },
  {
    id: 'church-new-hope-nj',
    name: 'New Hope Baptist Church',
    denomination: 'Baptist',
    address: '106 Sussex Avenue',
    city: 'Newark',
    state: 'NJ',
    zip: '07103',
    phone: '(973) 622-4547',
    email: 'info@newhopebaptistchurchnewark.org',
    website: 'https://newhopebaptistchurchnewark.org',
    seniorPastor: 'Rev. Dr. Joe A. Carter',
    pastorTitle: 'Senior Pastor',
    pastorPhone: '(973) 622-4547',
    sanctuaryCapacity: 1400,
    hasOrgan: true,
    hasLivestreamCapability: true,
    notes: 'Historic home church of the Houston family (Whitney Houston).'
  },
  {
    id: 'church-first-baptist-greenwich',
    name: 'First Baptist Church of Greenwich',
    denomination: 'Baptist',
    address: '10 Northfield Street',
    city: 'Greenwich',
    state: 'CT',
    zip: '06830',
    phone: '(203) 869-7988',
    email: 'office@fbcgreenwich.com',
    website: 'https://fbcgreenwich.org',
    seniorPastor: 'Rev. Thomas L. Nins',
    pastorTitle: 'Senior Pastor',
    pastorPhone: '(203) 869-7988',
    sanctuaryCapacity: 500,
    hasOrgan: true,
    hasLivestreamCapability: true,
    notes: 'Fairfield County pastoral community connection.'
  }
];

// ============================================================================
// 4. TRI-STATE HOSPITALS & MEDICAL CENTERS (MORGUES & REFRIGERATION SPECS)
// ============================================================================
export const TRI_STATE_HOSPITALS_DIRECTORY: MedicalFacilityDirectoryItem[] = [
  {
    id: 'hosp-harlem',
    name: 'Harlem Hospital Center (NYC Health + Hospitals)',
    type: 'hospital',
    address: '506 Lenox Avenue (at W 135th St)',
    city: 'New York',
    state: 'NY',
    zip: '10037',
    borough: 'Manhattan (Harlem)',
    mainPhone: '(212) 939-1000',
    morgueOrPathologyPhone: '(212) 939-3620',
    hasRefrigerationOnPremises: true,
    refrigerationDetails: 'Multi-chamber hospital morgue cold vault (capacity 32)',
    releaseProtocol: 'NYC EDRS permit, certified burial-transit certificate, signed Next-of-Kin release',
    releaseHours: '8:00 AM – 4:00 PM (Monday through Friday); Weekend release coordinated via Hospital Security Switchboard',
    isUrgentRemovalRequired: false,
    securityOrDockInstructions: 'Commercial removal van entrance via 136th St ambulance loading bay. Check in with Special Officer on duty.'
  },
  {
    id: 'hosp-sinai-morningside',
    name: 'Mount Sinai Morningside',
    type: 'hospital',
    address: '1111 Amsterdam Avenue (at W 114th St)',
    city: 'New York',
    state: 'NY',
    zip: '10025',
    borough: 'Manhattan (Morningside Heights)',
    mainPhone: '(212) 523-4000',
    morgueOrPathologyPhone: '(212) 241-8014',
    hasRefrigerationOnPremises: true,
    refrigerationDetails: 'Mount Sinai System Pathology cold storage facility',
    releaseProtocol: 'EDRS registration verified, physical receipt signed by licensed funeral director',
    releaseHours: '8:30 AM – 4:30 PM (M-F)',
    isUrgentRemovalRequired: false,
    securityOrDockInstructions: 'Loading dock on 113th St between Amsterdam & Morningside Dr.'
  },
  {
    id: 'hosp-columbia-cuimc',
    name: 'NewYork-Presbyterian / Columbia University Irving Medical Center',
    type: 'hospital',
    address: '630 West 168th Street',
    city: 'New York',
    state: 'NY',
    zip: '10032',
    borough: 'Manhattan (Washington Heights)',
    mainPhone: '(212) 305-2862',
    morgueOrPathologyPhone: '(212) 305-6239',
    hasRefrigerationOnPremises: true,
    refrigerationDetails: 'High-capacity Pathology & Autopsy morgue refrigeration facility',
    releaseProtocol: 'Pathology office release clearance, 24/7 Security dispatch with LFD credentials',
    releaseHours: '24/7 security release upon signed department clearance',
    isUrgentRemovalRequired: false,
    securityOrDockInstructions: 'Service entrance via Fort Washington Ave & 168th St service tunnel.'
  },
  {
    id: 'hosp-sinai-main',
    name: 'The Mount Sinai Hospital (Main Manhattan)',
    type: 'hospital',
    address: '1468 Madison Avenue',
    city: 'New York',
    state: 'NY',
    zip: '10029',
    borough: 'Manhattan (Upper East Side)',
    mainPhone: '(212) 241-6500',
    morgueOrPathologyPhone: '(212) 241-8014',
    hasRefrigerationOnPremises: true,
    refrigerationDetails: 'Centralized pathology morgue refrigeration unit',
    releaseProtocol: 'Mount Sinai Bereavement Services clearance & NYC EDRS permit',
    releaseHours: '8:00 AM – 5:00 PM (M-F)',
    isUrgentRemovalRequired: false,
    securityOrDockInstructions: 'Service driveway at 99th Street between Madison & Park Avenues.'
  },
  {
    id: 'hosp-metropolitan',
    name: 'NYC Health + Hospitals / Metropolitan',
    type: 'hospital',
    address: '1901 First Avenue (at E 97th St)',
    city: 'New York',
    state: 'NY',
    zip: '10029',
    borough: 'Manhattan (East Harlem)',
    mainPhone: '(212) 423-6262',
    morgueOrPathologyPhone: '(212) 423-6421',
    hasRefrigerationOnPremises: true,
    refrigerationDetails: 'NYC Health + Hospitals on-site refrigerated morgue',
    releaseProtocol: 'NYC EDRS permit and Mortuary Office release form',
    releaseHours: '8:00 AM – 4:00 PM (M-F)',
    isUrgentRemovalRequired: false,
    securityOrDockInstructions: 'Basement dock via 97th St delivery ramp.'
  },
  {
    id: 'hosp-bellevue-ocme',
    name: 'NYC Health + Hospitals / Bellevue & OCME Manhattan',
    type: 'hospital',
    address: '462 First Avenue (at E 27th St)',
    city: 'New York',
    state: 'NY',
    zip: '10016',
    borough: 'Manhattan',
    mainPhone: '(212) 562-4141',
    morgueOrPathologyPhone: '(212) 562-3131',
    hasRefrigerationOnPremises: true,
    refrigerationDetails: 'State-of-the-art multi-tier refrigeration / NYC OCME Central Morgue Co-Location',
    releaseProtocol: 'OCME release authorization or Hospital pathology release, photo ID required',
    releaseHours: '24/7 OCME Identification & Funeral Director Release Unit',
    isUrgentRemovalRequired: false,
    securityOrDockInstructions: 'OCME/Bellevue mortuary entrance on 30th St between 1st Ave & FDR Drive.'
  },
  {
    id: 'hosp-weill-cornell',
    name: 'NewYork-Presbyterian / Weill Cornell Medical Center',
    type: 'hospital',
    address: '525 East 68th Street',
    city: 'New York',
    state: 'NY',
    zip: '10065',
    borough: 'Manhattan',
    mainPhone: '(212) 746-5454',
    morgueOrPathologyPhone: '(212) 746-2700',
    hasRefrigerationOnPremises: true,
    refrigerationDetails: 'Pathology refrigerated mortuary unit',
    releaseProtocol: 'Weill Cornell Bereavement Office clearance, NYS LFD license verification',
    releaseHours: '8:30 AM – 4:30 PM (M-F)',
    isUrgentRemovalRequired: false,
    securityOrDockInstructions: 'Service receiving bay on 70th Street east of York Avenue.'
  },
  {
    id: 'hosp-lincoln',
    name: 'NYC Health + Hospitals / Lincoln',
    type: 'hospital',
    address: '234 East 149th Street',
    city: 'Bronx',
    state: 'NY',
    zip: '10451',
    borough: 'Bronx (South Bronx)',
    mainPhone: '(718) 579-5000',
    morgueOrPathologyPhone: '(718) 579-5140',
    hasRefrigerationOnPremises: true,
    refrigerationDetails: 'Hospital pathology morgue cold room',
    releaseProtocol: 'NYC EDRS transit permit and signed next of kin authorization',
    releaseHours: '8:00 AM – 4:00 PM (M-F)',
    isUrgentRemovalRequired: false,
    securityOrDockInstructions: 'Service vehicle entrance on Morris Ave & 149th St.'
  },
  {
    id: 'hosp-montefiore-moses',
    name: 'Montefiore Medical Center (Moses Campus)',
    type: 'hospital',
    address: '111 East 210th Street',
    city: 'Bronx',
    state: 'NY',
    zip: '10467',
    borough: 'Bronx (Norwood)',
    mainPhone: '(718) 920-4321',
    morgueOrPathologyPhone: '(718) 920-4976',
    hasRefrigerationOnPremises: true,
    refrigerationDetails: 'Montefiore Pathology cold holding facilities',
    releaseProtocol: 'Montefiore Bereavement & Pathology office clearance',
    releaseHours: '8:00 AM – 4:30 PM (M-F)',
    isUrgentRemovalRequired: false,
    securityOrDockInstructions: 'Service dock on 210th St & Bainbridge Ave.'
  },
  {
    id: 'hosp-kings-county',
    name: 'NYC Health + Hospitals / Kings County',
    type: 'hospital',
    address: '451 Clarkson Avenue',
    city: 'Brooklyn',
    state: 'NY',
    zip: '11203',
    borough: 'Brooklyn (Flatbush)',
    mainPhone: '(718) 245-3131',
    morgueOrPathologyPhone: '(718) 245-3641',
    hasRefrigerationOnPremises: true,
    refrigerationDetails: 'Hospital refrigerated mortuary facility',
    releaseProtocol: 'NYC EDRS permit & Kings County Mortuary paperwork',
    releaseHours: '8:00 AM – 4:00 PM (M-F)',
    isUrgentRemovalRequired: false,
    securityOrDockInstructions: 'Clarkson Ave mortuary dock (Building T basement).'
  },
  {
    id: 'hosp-hackensack',
    name: 'Hackensack University Medical Center',
    type: 'hospital',
    address: '30 Prospect Avenue',
    city: 'Hackensack',
    state: 'NJ',
    zip: '07601',
    mainPhone: '(551) 996-2000',
    morgueOrPathologyPhone: '(551) 996-2065',
    hasRefrigerationOnPremises: true,
    refrigerationDetails: 'Pathology Morgue Cold Storage Unit',
    releaseProtocol: 'NJ EDRS Transit Permit, Interstate Removal Permit if transporting to NY',
    releaseHours: '24/7 Security release upon certified permit delivery',
    isUrgentRemovalRequired: false,
    securityOrDockInstructions: 'Atlantic St loading dock. Ring Pathology buzzer for security release.'
  },
  {
    id: 'hosp-stamford',
    name: 'Stamford Hospital',
    type: 'hospital',
    address: '1 Hospital Plaza',
    city: 'Stamford',
    state: 'CT',
    zip: '06902',
    mainPhone: '(203) 276-1000',
    morgueOrPathologyPhone: '(203) 276-7450',
    hasRefrigerationOnPremises: true,
    refrigerationDetails: 'Pathology Morgue Cold Unit',
    releaseProtocol: 'CT Burial Transit Permit, interstate protocol for NYC entry',
    releaseHours: '8:00 AM – 4:30 PM (M-F)',
    isUrgentRemovalRequired: false,
    securityOrDockInstructions: 'Service entrance via Shelburne Rd.'
  }
];

// ============================================================================
// 5. TRI-STATE NURSING HOMES & REHABILITATION (REFRIGERATION PROTOCOLS)
// ============================================================================
export const TRI_STATE_NURSING_HOMES_DIRECTORY: MedicalFacilityDirectoryItem[] = [
  {
    id: 'nh-harlem-center',
    name: 'Harlem Center for Nursing and Rehabilitation',
    type: 'nursing_home',
    address: '30 West 138th Street',
    city: 'New York',
    state: 'NY',
    zip: '10037',
    borough: 'Manhattan (Harlem)',
    mainPhone: '(212) 690-7400',
    nursingStationPhone: '(212) 690-7400 ext. 201',
    hasRefrigerationOnPremises: false,
    refrigerationDetails: 'NO ON-SITE REFRIGERATION. Patient remains in room on temporary holding protocol.',
    releaseProtocol: 'Immediate bedside release. Nursing supervisor on duty verifies death certificate and LFD credentials.',
    releaseHours: '24/7 Immediate Dispatch Access',
    isUrgentRemovalRequired: true,
    securityOrDockInstructions: 'Ring side service door on 138th St. Bring transfer cot & ID badge.'
  },
  {
    id: 'nh-amsterdam',
    name: 'Amsterdam Nursing Home',
    type: 'nursing_home',
    address: '1060 Amsterdam Avenue (at W 112th St)',
    city: 'New York',
    state: 'NY',
    zip: '10025',
    borough: 'Manhattan (Morningside Heights)',
    mainPhone: '(212) 316-7700',
    nursingStationPhone: '(212) 316-7700 ext. 110',
    hasRefrigerationOnPremises: false,
    refrigerationDetails: 'NO ON-SITE REFRIGERATION. Bedside holding only.',
    releaseProtocol: 'Nursing supervisor sign-out, Pronouncement of Death form executed.',
    releaseHours: '24/7 Immediate Removal (Mandatory 2-4 hr window)',
    isUrgentRemovalRequired: true,
    securityOrDockInstructions: 'Check in with security desk at main lobby, proceed to resident floor.'
  },
  {
    id: 'nh-isabella',
    name: 'Isabella Center for Rehabilitation and Nursing Care',
    type: 'nursing_home',
    address: '515 Audubon Avenue (at W 190th St)',
    city: 'New York',
    state: 'NY',
    zip: '10040',
    borough: 'Manhattan (Washington Heights)',
    mainPhone: '(212) 781-9800',
    nursingStationPhone: '(212) 781-9800 ext. 450',
    hasRefrigerationOnPremises: false,
    refrigerationDetails: 'NO ON-SITE REFRIGERATION. Holding in quiet room.',
    releaseProtocol: 'Nursing supervisor custody transfer, sign logbook.',
    releaseHours: '24/7 Priority Transfer',
    isUrgentRemovalRequired: true,
    securityOrDockInstructions: 'Service entrance and freight elevator located on Audubon Ave.'
  },
  {
    id: 'nh-terence-cardinal-cooke',
    name: 'Terence Cardinal Cooke Health Care Center (ArchCare)',
    type: 'nursing_home',
    address: '1249 Fifth Avenue (at E 105th St)',
    city: 'New York',
    state: 'NY',
    zip: '10029',
    borough: 'Manhattan (East Harlem)',
    mainPhone: '(212) 360-1000',
    morgueOrPathologyPhone: '(212) 360-1000 ext. 312',
    hasRefrigerationOnPremises: true,
    refrigerationDetails: 'Temporary refrigerated holding morgue on site (capacity 4).',
    releaseProtocol: 'ArchCare Mortuary sign-out and EDRS permit verification.',
    releaseHours: '8:00 AM – 8:00 PM Daily',
    isUrgentRemovalRequired: false,
    securityOrDockInstructions: 'Service entrance on 105th St between 5th & Madison Aves.'
  },
  {
    id: 'nh-northern-manhattan',
    name: 'Northern Manhattan Rehabilitation and Nursing Center',
    type: 'nursing_home',
    address: '116 East 125th Street',
    city: 'New York',
    state: 'NY',
    zip: '10035',
    borough: 'Manhattan (East Harlem)',
    mainPhone: '(212) 426-1284',
    nursingStationPhone: '(212) 426-1284',
    hasRefrigerationOnPremises: false,
    refrigerationDetails: 'NO ON-SITE REFRIGERATION.',
    releaseProtocol: 'Prompt bedside removal, attending physician phone authorization.',
    releaseHours: '24/7 Urgent Removal (Within 2 Hours)',
    isUrgentRemovalRequired: true,
    securityOrDockInstructions: 'Main elevator access via 125th St entrance.'
  },
  {
    id: 'nh-jewish-home',
    name: 'The New Jewish Home, Manhattan',
    type: 'nursing_home',
    address: '120 West 106th Street',
    city: 'New York',
    state: 'NY',
    zip: '10025',
    borough: 'Manhattan (Upper West Side)',
    mainPhone: '(212) 870-5000',
    nursingStationPhone: '(212) 870-5000',
    hasRefrigerationOnPremises: false,
    refrigerationDetails: 'NO ON-SITE REFRIGERATION. Bedside custody protocol.',
    releaseProtocol: 'Sign out at 106th St security and nursing station.',
    releaseHours: '24/7 Priority Transfer',
    isUrgentRemovalRequired: true,
    securityOrDockInstructions: 'Security check-in at 106th St main gate.'
  },
  {
    id: 'nh-mary-manning-walsh',
    name: 'ArchCare at Mary Manning Walsh Home',
    type: 'nursing_home',
    address: '1339 York Avenue (at E 72nd St)',
    city: 'New York',
    state: 'NY',
    zip: '10021',
    borough: 'Manhattan (Upper East Side)',
    mainPhone: '(212) 628-2800',
    nursingStationPhone: '(212) 628-2800',
    hasRefrigerationOnPremises: false,
    refrigerationDetails: 'NO ON-SITE REFRIGERATION.',
    releaseProtocol: 'Nursing supervisor release, patient personal effects transfer.',
    releaseHours: '24/7 Priority Transfer (2-4 hr window)',
    isUrgentRemovalRequired: true,
    securityOrDockInstructions: 'Service entrance on 72nd Street.'
  },
  {
    id: 'nh-hebrew-home-riverdale',
    name: 'Hebrew Home at Riverdale',
    type: 'nursing_home',
    address: '5901 Palisade Avenue',
    city: 'Bronx',
    state: 'NY',
    zip: '10471',
    borough: 'Bronx (Riverdale)',
    mainPhone: '(718) 581-1000',
    morgueOrPathologyPhone: '(718) 581-1000 ext. 220',
    hasRefrigerationOnPremises: true,
    refrigerationDetails: 'On-site temporary refrigerated holding box (capacity 6).',
    releaseProtocol: 'Facility bereavement office sign-out.',
    releaseHours: '8:00 AM – 6:00 PM Daily',
    isUrgentRemovalRequired: false,
    securityOrDockInstructions: 'Palisade Ave security gatehouse check-in.'
  },
  {
    id: 'nh-inglemoor-nj',
    name: 'Inglemoor Rehabilitation and Care Center',
    type: 'nursing_home',
    address: '311 S Livingston Avenue',
    city: 'Livingston',
    state: 'NJ',
    zip: '07039',
    mainPhone: '(973) 994-0220',
    hasRefrigerationOnPremises: false,
    refrigerationDetails: 'NO ON-SITE REFRIGERATION.',
    releaseProtocol: 'NJ Certificate of Death Pronouncement, LFD sign-out.',
    releaseHours: '24/7 Urgent Removal',
    isUrgentRemovalRequired: true,
    securityOrDockInstructions: 'Rear ambulance entrance.'
  },
  {
    id: 'nh-greenwich-woods-ct',
    name: 'Greenwich Woods Rehabilitation and Health Care Center',
    type: 'nursing_home',
    address: '884 King Street',
    city: 'Greenwich',
    state: 'CT',
    zip: '06831',
    mainPhone: '(203) 531-1345',
    hasRefrigerationOnPremises: false,
    refrigerationDetails: 'NO ON-SITE REFRIGERATION.',
    releaseProtocol: 'CT Removal Certificate, Nurse sign-out.',
    releaseHours: '24/7 Urgent Removal',
    isUrgentRemovalRequired: true,
    securityOrDockInstructions: 'King Street loading bay.'
  }
];

// ============================================================================
// 6. HARLEM & NYC FLORAL PARTNERS & CATALOGS
// ============================================================================
export const FLORAL_CATALOG_DATA: FloralCatalogItem[] = [
  ...BFH_FLORAL_CATALOG.map((bfhItem): FloralCatalogItem => {
    const isDaniela = bfhItem.category === 'danielas' || (bfhItem.floristPartner && bfhItem.floristPartner.includes('Daniela'));
    return {
      id: `fl-${bfhItem.code.toLowerCase()}`,
      floristId: isDaniela ? 'danielas_flowers' : 'barbaras_flowers',
      floristName: isDaniela ? "Daniela's Flower Shop (Harlem)" : "Barbara's Flowers (Harlem)",
      floristAddress: isDaniela ? '3650 Broadway (at W 150th St), New York, NY 10031' : '2522 Frederick Douglass Blvd, New York, NY 10030',
      floristPhone: isDaniela ? '(212) 283-9300' : '(212) 234-3211',
      floristEmail: isDaniela ? 'orders@uptowndanielasflowershop.com' : 'orders@barbarasflowershop.net',
      name: `[${bfhItem.code}] ${bfhItem.name}`,
      category: bfhItem.category as any,
      price: bfhItem.pricing.medium || bfhItem.pricing.small || 350,
      description: bfhItem.description,
      dimensions: bfhItem.dimensions.medium || bfhItem.dimensions.large || 'Standard Tribute',
      leadTimeHours: 12
    };
  })
];

// ============================================================================
// 7. CASKET MANUFACTURERS (BATESVILLE & MATTHEWS AURORA / MILSO)
// ============================================================================
export const CASKET_MANUFACTURER_CATALOGS: CasketCatalogItem[] = [
  // Batesville Casket Company
  {
    id: 'cask-bat-promethean',
    manufacturer: 'Batesville Casket Company',
    modelCode: 'BATES-PROMETHEAN-48',
    name: 'The Promethean 48 oz. Solid Bronze',
    materialType: 'solid_bronze',
    materialDescription: '48 oz. Solid Bronze Semi-Precious Metal (Handcrafted Custom)',
    exteriorColor: 'High-Gloss Polished Mirror Gold Bronze',
    interiorFabric: 'Custom Tufted Velvet',
    interiorColor: 'Pearl Champagne Velvet',
    gasketType: 'Gasketed',
    gplRetailPrice: 14500,
    features: ['14k gold-plated cast swing-bar hardware', 'Memorial Record System cylinder', 'Living Memorial tree planting', 'Hand-polished 150 hours craftsmanship']
  },
  {
    id: 'cask-bat-classic-gold',
    manufacturer: 'Batesville Casket Company',
    modelCode: 'BATES-CLASSIC-GOLD-48',
    name: 'Classic Gold 48 oz. Solid Bronze',
    materialType: 'solid_bronze',
    materialDescription: '48 oz. Solid Bronze with Brushed Gold Highlights',
    exteriorColor: 'Brushed Golden Bronze Finish',
    interiorFabric: 'Hand-Tailored Velvet',
    interiorColor: 'Almond Velvet',
    gasketType: 'Gasketed',
    gplRetailPrice: 9800,
    features: ['Continuous welded bronze bottom', 'Corrosion-resistant bronze warranty', 'Cast bronze swing hardware']
  },
  {
    id: 'cask-bat-ocean-blue',
    manufacturer: 'Batesville Casket Company',
    modelCode: 'BATES-OCEAN-BLUE-18',
    name: 'Ocean Blue 18-Gauge Steel',
    materialType: '18_gauge_steel',
    materialDescription: '18-Gauge Premium Protective Steel (Model O77)',
    gauge: '18 Gauge',
    exteriorColor: 'Dual-Tone Shaded Ocean Blue & Spruce',
    interiorFabric: 'Tailored Crepe',
    interiorColor: 'Light Blue Crepe',
    gasketType: 'Gasketed',
    gplRetailPrice: 3450,
    features: ['Rubber one-piece perimeter gasket seal', 'Swing-bar brushed nickel handles', 'Memorial Record tube', 'Adjustable bed and mattress']
  },
  {
    id: 'cask-bat-primrose',
    manufacturer: 'Batesville Casket Company',
    modelCode: 'BATES-PRIMROSE-18',
    name: 'Primrose 18-Gauge Steel',
    materialType: '18_gauge_steel',
    materialDescription: '18-Gauge Protective Steel with Rose Engravings',
    gauge: '18 Gauge',
    exteriorColor: 'Antique White with Shaded Rose Highlights',
    interiorFabric: 'Embroidered Velvet',
    interiorColor: 'Moss Pink Velvet with Rose Head panel',
    gasketType: 'Gasketed',
    gplRetailPrice: 3200,
    features: ['Embroidered floral head panel', 'Gasketed protective seal', 'Sculpted swing hardware']
  },
  {
    id: 'cask-bat-gemini',
    manufacturer: 'Batesville Casket Company',
    modelCode: 'BATES-GEMINI-20',
    name: 'Gemini 20-Gauge Steel',
    materialType: '20_gauge_steel',
    materialDescription: '20-Gauge Dignified Non-Gasketed Carbon Steel',
    gauge: '20 Gauge',
    exteriorColor: 'Silver / Copper / White Finishes Available',
    interiorFabric: 'Rosetan Crepe',
    interiorColor: 'Rosetan Crepe',
    gasketType: 'Non-Gasketed',
    gplRetailPrice: 1850,
    features: ['Stationary bar handles', 'Continuously welded bottom', 'Dignified entry-tier steel selection']
  },
  {
    id: 'cask-bat-autumn-cherry',
    manufacturer: 'Batesville Casket Company',
    modelCode: 'BATES-AUTUMN-CHERRY',
    name: 'Autumn Cherry Solid Hardwood',
    materialType: 'solid_hardwood',
    materialDescription: 'Solid Cherry Appalachian Hardwood with Hand-Rubbed Gloss',
    exteriorColor: 'Polished Rich Amber Cherry',
    interiorFabric: 'Champagne Tufted Velvet',
    interiorColor: 'Champagne Velvet',
    gasketType: 'Non-Gasketed',
    gplRetailPrice: 4800,
    features: ['Solid hardwood construction', 'Interlocking corner joint joinery', 'Living Memorial tree planting program']
  },
  {
    id: 'cask-bat-trayview',
    manufacturer: 'Batesville Casket Company',
    modelCode: 'BATES-TRAYVIEW-ALT',
    name: 'Trayview Alternative Cremation Container',
    materialType: 'cremation_rental',
    materialDescription: 'Heavy-Duty Corrugated Alternative Container with Folded Pillow',
    exteriorColor: 'Natural Kraft Finish',
    interiorFabric: 'White Poly Crepe Bedding',
    interiorColor: 'White Crepe',
    gasketType: 'Non-Gasketed',
    gplRetailPrice: 250,
    features: ['100% combustible for crematory standards', 'Includes leak-resistant bottom lining']
  },

  // Matthews Aurora / Milso Casket Company
  {
    id: 'cask-milso-newport',
    manufacturer: 'Matthews Aurora / Milso',
    modelCode: 'MILSO-NEWPORT-SS',
    name: 'Newport Topaz Brushed Stainless Steel',
    materialType: 'stainless_steel',
    materialDescription: 'Premium Rust-Resistant Stainless Steel (Topaz Finish)',
    exteriorColor: 'Brushed Topaz Bronze & Silver Two-Tone',
    interiorFabric: 'Champagne Velvet',
    interiorColor: 'Champagne Velvet',
    gasketType: 'Gasketed',
    gplRetailPrice: 4150,
    features: ['Naturally rust-resistant stainless steel alloy', 'Cathodically protected seal', 'Locking mechanism with key']
  },
  {
    id: 'cask-milso-montgomery',
    manufacturer: 'Matthews Aurora / Milso',
    modelCode: 'MILSO-MONTGOMERY-ASH',
    name: 'Montgomery Solid American Ash',
    materialType: 'solid_hardwood',
    materialDescription: 'Solid American Ash Hardwood with Satin Timber Finish',
    exteriorColor: 'Satin Medium American Ash',
    interiorFabric: 'Almond Velvet',
    interiorColor: 'Almond Velvet',
    gasketType: 'Non-Gasketed',
    gplRetailPrice: 3750,
    features: ['Solid Ash hardwood timber', 'Satin hand-rubbed finish', 'Cast swing bar handles with wooden inlay']
  },
  {
    id: 'cask-milso-sterling-blue',
    manufacturer: 'Matthews Aurora / Milso',
    modelCode: 'MILSO-STERLING-18',
    name: 'Sterling Storm Blue 18-Gauge Steel',
    materialType: '18_gauge_steel',
    materialDescription: '18-Gauge Protective Gasketed Carbon Steel',
    gauge: '18 Gauge',
    exteriorColor: 'Storm Blue Shaded with Platinum Highlights',
    interiorFabric: 'Spruce Blue Crepe',
    interiorColor: 'Spruce Blue Crepe',
    gasketType: 'Gasketed',
    gplRetailPrice: 2650,
    features: ['Continuous rubber sealing gasket', 'Protective rust-inhibitive primer coat', 'Swing bar hardware']
  },
  {
    id: 'cask-milso-sierra',
    manufacturer: 'Matthews Aurora / Milso',
    modelCode: 'MILSO-SIERRA-HW',
    name: 'Sierra Hardwood Satin',
    materialType: 'solid_hardwood',
    materialDescription: 'Select Hardwood Timber with Warm Mahogany Stain',
    exteriorColor: 'Warm Sierra Walnut Satin',
    interiorFabric: 'Rosetan Crepe',
    interiorColor: 'Rosetan Crepe',
    gasketType: 'Non-Gasketed',
    gplRetailPrice: 2850,
    features: ['Select North American hardwoods', 'Warm satin exterior stain', 'Dignified traditional lines']
  }
];

// ============================================================================
// 8. TRI-STATE CEMETERIES & CREMATORIES DIRECTORY (NY, NJ, CT)
// ============================================================================
export const TRI_STATE_CEMETERIES_DIRECTORY: CemeteryDirectoryItem[] = [
  // New York
  {
    id: 'cem-woodlawn',
    name: 'The Woodlawn Cemetery & Crematory',
    address: '4199 Webster Avenue (at E 233rd St)',
    city: 'Bronx',
    state: 'NY',
    zip: '10470',
    county: 'Bronx',
    phone: '(718) 920-0500',
    crematoryPhone: '(718) 920-0500 ext. 230',
    email: 'info@woodlawn.org',
    website: 'https://woodlawn.org',
    hasCrematory: true,
    hasMausoleum: true,
    requiresVault: true,
    officeHours: '8:30 AM – 5:00 PM Daily',
    committalServiceCutoff: '2:30 PM for ground burial / 3:30 PM for cremation arrivals',
    notes: 'Historic National Historic Landmark. BFH primary Bronx cremation and burial destination.'
  },
  {
    id: 'cem-ferncliff',
    name: 'Ferncliff Cemetery & Crematory',
    address: '280 Secor Road',
    city: 'Hartsdale',
    state: 'NY',
    zip: '10530',
    county: 'Westchester',
    phone: '(914) 693-4700',
    crematoryPhone: '(914) 693-4700',
    email: 'info@ferncliffcemetery.com',
    website: 'https://ferncliffcemetery.com',
    hasCrematory: true,
    hasMausoleum: true,
    requiresVault: true,
    officeHours: '9:00 AM – 4:30 PM (M-F), 9:00 AM – 4:00 PM (Sat)',
    committalServiceCutoff: '2:00 PM',
    notes: 'Home of the Rosewood and Shrine of Memories Mausoleums. Resting place of Malcolm X, Judy Garland, Joan Crawford.'
  },
  {
    id: 'cem-greenwood',
    name: 'The Green-Wood Cemetery & Crematory',
    address: '500 25th Street (at 5th Ave)',
    city: 'Brooklyn',
    state: 'NY',
    zip: '11232',
    county: 'Kings',
    phone: '(718) 768-7300',
    crematoryPhone: '(718) 768-7300',
    email: 'info@green-wood.com',
    website: 'https://green-wood.com',
    hasCrematory: true,
    hasMausoleum: true,
    requiresVault: true,
    officeHours: '8:00 AM – 4:30 PM Daily',
    committalServiceCutoff: '2:30 PM',
    notes: 'Historic Brooklyn cemetery founded 1838. Chapel cremation committal service available.'
  },
  {
    id: 'cem-kensico',
    name: 'The Kensico Cemetery',
    address: '273 Lakeview Avenue',
    city: 'Valhalla',
    state: 'NY',
    zip: '10595',
    county: 'Westchester',
    phone: '(914) 949-0347',
    email: 'info@kensico.org',
    website: 'https://kensico.org',
    hasCrematory: false,
    hasMausoleum: true,
    requiresVault: true,
    officeHours: '8:30 AM – 4:30 PM (M-Sat)',
    committalServiceCutoff: '2:30 PM',
    notes: 'Beautiful 460-acre park setting in Westchester County.'
  },
  {
    id: 'cem-calverton',
    name: 'Calverton National Cemetery (VA / U.S. Veterans)',
    address: '210 Princeton Boulevard',
    city: 'Calverton',
    state: 'NY',
    zip: '11933',
    county: 'Suffolk (Long Island)',
    phone: '(631) 727-5410',
    email: 'calverton.national@va.gov',
    website: 'https://va.gov/calverton-national-cemetery',
    hasCrematory: false,
    hasMausoleum: false,
    requiresVault: false, // Provided free by VA for veterans
    officeHours: '8:00 AM – 4:30 PM (M-F)',
    committalServiceCutoff: '1:30 PM strict arrival schedule',
    notes: 'Active National Cemetery providing free plot, concrete graveliner vault, headstone, and military honors for honorably discharged veterans and spouses.'
  },
  {
    id: 'cem-cypress-hills',
    name: 'Cypress Hills Cemetery',
    address: '833 Jamaica Avenue',
    city: 'Brooklyn',
    state: 'NY',
    zip: '11208',
    county: 'Kings / Queens',
    phone: '(718) 277-2900',
    email: 'info@cypresshillscemetery.org',
    website: 'https://cypresshillscemetery.org',
    hasCrematory: false,
    hasMausoleum: true,
    requiresVault: true,
    officeHours: '8:30 AM – 4:30 PM',
    committalServiceCutoff: '2:30 PM',
    notes: 'Historic Brooklyn/Queens cemetery with Abbey and Community Mausoleums.'
  },
  {
    id: 'cem-fresh-pond',
    name: 'Fresh Pond Crematory (US Columbarium Co.)',
    address: '61-40 Mount Olivet Crescent',
    city: 'Middle Village',
    state: 'NY',
    zip: '11379',
    county: 'Queens',
    phone: '(718) 821-9700',
    crematoryPhone: '(718) 821-9700',
    email: 'info@freshpondcrematory.com',
    website: 'https://freshpondcrematory.com',
    hasCrematory: true,
    hasMausoleum: true,
    requiresVault: false,
    officeHours: '8:30 AM – 4:30 PM (M-Sat)',
    committalServiceCutoff: '3:30 PM',
    notes: 'Oldest active crematory in the United States (est. 1884).'
  },
  {
    id: 'cem-st-raymonds',
    name: "Saint Raymond's Cemetery",
    address: '2600 Lafayette Avenue',
    city: 'Bronx',
    state: 'NY',
    zip: '10465',
    county: 'Bronx',
    phone: '(718) 792-1133',
    email: 'info@straymondscem.org',
    website: 'https://straymondscem.org',
    hasCrematory: false,
    hasMausoleum: true,
    requiresVault: true,
    officeHours: '8:30 AM – 4:00 PM (M-Sat)',
    committalServiceCutoff: '2:00 PM',
    notes: 'Primary Catholic cemetery in the Bronx under Archdiocese of New York.'
  },
  {
    id: 'cem-mount-hope',
    name: 'Mount Hope Cemetery',
    address: '50 Jackson Avenue',
    city: 'Hastings-on-Hudson',
    state: 'NY',
    zip: '10706',
    county: 'Westchester',
    phone: '(914) 478-1855',
    email: 'info@mounthopecemetery.com',
    website: 'https://mounthopecemetery.com',
    hasCrematory: false,
    hasMausoleum: true,
    requiresVault: true,
    officeHours: '8:30 AM – 4:30 PM',
    committalServiceCutoff: '2:30 PM',
    notes: 'Serene Westchester cemetery located along Saw Mill River Parkway.'
  },
  {
    id: 'cem-pinelawn',
    name: 'Pinelawn Memorial Park & Garden Mausoleums',
    address: '2030 Wellwood Avenue',
    city: 'Farmingdale',
    state: 'NY',
    zip: '11735',
    county: 'Suffolk (Long Island)',
    phone: '(631) 249-6100',
    email: 'info@pinelawn.com',
    website: 'https://pinelawn.com',
    hasCrematory: false,
    hasMausoleum: true,
    requiresVault: true,
    officeHours: '8:30 AM – 4:30 PM Daily',
    committalServiceCutoff: '2:00 PM',
    notes: 'Fountain garden memorial park and open-air mausoleum sanctuaries.'
  },
  {
    id: 'cem-gate-of-heaven',
    name: 'Gate of Heaven Cemetery',
    address: '10 W Stevens Avenue',
    city: 'Hawthorne',
    state: 'NY',
    zip: '10532',
    county: 'Westchester',
    phone: '(914) 769-3672',
    email: 'info@gateofheavenny.com',
    website: 'https://gateofheavenny.com',
    hasCrematory: false,
    hasMausoleum: true,
    requiresVault: true,
    officeHours: '8:30 AM – 4:30 PM',
    committalServiceCutoff: '2:00 PM',
    notes: 'Major Catholic cemetery in Westchester (Archdiocese of New York).'
  },
  {
    id: 'cem-trinity-church',
    name: 'Trinity Church Cemetery and Mausoleum',
    address: '770 Riverside Drive (at W 153rd St)',
    city: 'New York',
    state: 'NY',
    zip: '10032',
    county: 'New York (Manhattan)',
    phone: '(212) 602-0800',
    email: 'cemetery@trinitywallstreet.org',
    website: 'https://trinitywallstreet.org',
    hasCrematory: false,
    hasMausoleum: true,
    requiresVault: true,
    officeHours: '9:00 AM – 4:00 PM (M-F)',
    committalServiceCutoff: '2:00 PM',
    notes: 'Only active cemetery in Manhattan. Includes community mausoleum crypts overlooking Hudson River.'
  },

  // New Jersey
  {
    id: 'cem-rosehill-linden',
    name: 'Rosehill Cemetery & Linden Crematory',
    address: '355 E Linden Ave (Office) / 792 E Edgar Rd (Crematory)',
    city: 'Linden',
    state: 'NJ',
    zip: '07036',
    county: 'Union (NJ)',
    phone: '(908) 862-4990',
    crematoryPhone: '(908) 862-3902',
    email: 'info@rosedale-rosehill.com',
    website: 'https://rosedale-rosehill.com',
    hasCrematory: true,
    hasMausoleum: true,
    requiresVault: true,
    officeHours: '8:30 AM – 4:30 PM (M-F), 8:30 AM – 12:30 PM (Sat)',
    committalServiceCutoff: '2:30 PM',
    notes: 'Major Northern New Jersey crematory and columbarium partner.'
  },
  {
    id: 'cem-gwmp',
    name: 'George Washington Memorial Park',
    address: '234 Paramus Road',
    city: 'Paramus',
    state: 'NJ',
    zip: '07652',
    county: 'Bergen (NJ)',
    phone: '(201) 652-4300',
    email: 'info@georgewashingtonmemorialpark.org',
    website: 'https://georgewashingtonmemorialpark.org',
    hasCrematory: false,
    hasMausoleum: true,
    requiresVault: true,
    officeHours: '8:30 AM – 4:30 PM Daily',
    committalServiceCutoff: '2:30 PM',
    notes: 'Premier memorial park in Bergen County.'
  },
  {
    id: 'cem-rosedale-montclair',
    name: 'Rosedale Cemetery & Crematory',
    address: '408 Orange Road',
    city: 'Montclair',
    state: 'NJ',
    zip: '07042',
    county: 'Essex (NJ)',
    phone: '(973) 673-0127',
    crematoryPhone: '(973) 673-0127',
    email: 'info@rosedalecemetery.org',
    website: 'https://rosedalecemetery.org',
    hasCrematory: true,
    hasMausoleum: true,
    requiresVault: true,
    officeHours: '8:30 AM – 4:30 PM',
    committalServiceCutoff: '2:30 PM',
    notes: 'Historic Essex County cemetery & crematory.'
  },
  {
    id: 'cem-fairmount-newark',
    name: 'Fairmount Cemetery & Crematory',
    address: '620 Central Avenue',
    city: 'Newark',
    state: 'NJ',
    zip: '07107',
    county: 'Essex (NJ)',
    phone: '(973) 623-0692',
    email: 'info@fairmountcemetery.net',
    website: 'https://fairmountcemetery.net',
    hasCrematory: true,
    hasMausoleum: true,
    requiresVault: true,
    officeHours: '8:30 AM – 4:00 PM',
    committalServiceCutoff: '2:00 PM',
    notes: 'Newark historic cemetery established 1854.'
  },
  {
    id: 'cem-hollywood-union',
    name: 'Hollywood Memorial Park & Crematory',
    address: '1500 Stuyvesant Avenue',
    city: 'Union',
    state: 'NJ',
    zip: '07083',
    county: 'Union (NJ)',
    phone: '(908) 688-4300',
    email: 'info@hollywoodmemorialpark.com',
    website: 'https://hollywoodmemorialpark.com',
    hasCrematory: true,
    hasMausoleum: true,
    requiresVault: true,
    officeHours: '8:30 AM – 4:30 PM',
    committalServiceCutoff: '2:30 PM',
    notes: 'Union County memorial park with on-site crematory chambers.'
  },

  // Connecticut
  {
    id: 'cem-putnam-greenwich',
    name: 'Putnam Cemetery & Saint Mary Cemetery',
    address: '35 Parsonage Road (and 399 North St)',
    city: 'Greenwich',
    state: 'CT',
    zip: '06830',
    county: 'Fairfield (CT)',
    phone: '(203) 869-4828',
    email: 'info@putnamcemetery.com',
    website: 'https://putnamcemetery.com',
    hasCrematory: false,
    hasMausoleum: true,
    requiresVault: true,
    officeHours: '8:00 AM – 4:00 PM (M-F)',
    committalServiceCutoff: '2:00 PM',
    notes: 'Prestigious Greenwich historic cemetery in Fairfield County.'
  },
  {
    id: 'cem-mountain-grove',
    name: 'Mountain Grove Cemetery & Crematory',
    address: '2675 North Avenue',
    city: 'Bridgeport',
    state: 'CT',
    zip: '06604',
    county: 'Fairfield (CT)',
    phone: '(203) 336-3579',
    crematoryPhone: '(203) 336-3579',
    email: 'info@mountaingrovecemetery.org',
    website: 'https://mountaingrovecemetery.org',
    hasCrematory: true,
    hasMausoleum: true,
    requiresVault: true,
    officeHours: '8:30 AM – 4:30 PM',
    committalServiceCutoff: '2:30 PM',
    notes: 'P.T. Barnum designed rural cemetery in Bridgeport CT.'
  },
  {
    id: 'cem-oak-lawn',
    name: 'Oak Lawn Cemetery & Arboretum',
    address: '1530 Bronson Road',
    city: 'Fairfield',
    state: 'CT',
    zip: '06824',
    county: 'Fairfield (CT)',
    phone: '(203) 259-0458',
    email: 'office@oaklawnct.com',
    website: 'https://oaklawnct.com',
    hasCrematory: false,
    hasMausoleum: true,
    requiresVault: true,
    officeHours: '8:30 AM – 4:00 PM',
    committalServiceCutoff: '2:00 PM',
    notes: 'Certified arboretum and historic cemetery in Fairfield CT.'
  }
];
