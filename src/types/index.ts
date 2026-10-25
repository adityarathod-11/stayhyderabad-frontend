export type Role = 'ROLE_USER' | 'ROLE_OWNER' | 'ROLE_ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
export type PropertyStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED';
export type GenderCategory = 'MALE' | 'FEMALE' | 'CO_LIVING';
export type FoodType = 'VEG_ONLY' | 'VEG_AND_NON_VEG' | 'NONE';
export type SharingType = 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'FOUR_SHARING';
export type BookingStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  role: Role;
  status: UserStatus;
  avatarUrl?: string;
  businessName?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  email: string;
  fullName: string;
  role: Role;
  phone: string;
}

export interface Amenity {
  id: number;
  name: string;
  iconName: string;
  category: string;
  description?: string;
}

export interface RoomType {
  id: number;
  sharingType: SharingType;
  monthlyRent: number;
  securityDeposit: number;
  totalBeds: number;
  availableBeds: number;
  hasAc: boolean;
  hasAttachedBathroom: boolean;
  hasBalcony: boolean;
}

export interface PropertyImage {
  id: number;
  imageUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  category?: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface PropertySummary {
  id: number;
  name: string;
  slug: string;
  genderCategory: GenderCategory;
  locality: string;
  landmark?: string;
  startingMonthlyRent: number;
  securityDeposit: number;
  availableBeds: number;
  totalBeds: number;
  foodIncluded: boolean;
  foodType: FoodType;
  primaryImageUrl?: string;
  imageCount: number;
  sharingTypes: SharingType[];
  keyAmenities: string[];
  status: PropertyStatus;
  isFeatured: boolean;
  lastAvailabilityUpdate: string;
}

export interface PropertyDetail {
  id: number;
  name: string;
  slug: string;
  genderCategory: GenderCategory;
  locality: string;
  addressLine: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  houseRules?: string;
  gateClosingTime: string;
  foodIncluded: boolean;
  foodType: FoodType;
  startingMonthlyRent: number;
  securityDeposit: number;
  maintenanceCharge: number;
  noticePeriodDays: number;
  status: PropertyStatus;
  isFeatured: boolean;
  totalBeds: number;
  availableBeds: number;
  contactPhone?: string;
  whatsappNumber?: string;
  lastAvailabilityUpdate: string;
  images: PropertyImage[];
  roomTypes: RoomType[];
  amenities: Amenity[];
  ownerId: number;
  ownerName: string;
  ownerBusinessName?: string;
}

export interface Booking {
  id: number;
  bookingReference: string;
  propertyId: number;
  propertyName: string;
  propertySlug: string;
  locality: string;
  propertyPrimaryImage?: string;
  roomTypeId: number;
  sharingType: SharingType;
  preferredMoveInDate: string;
  numPersons: number;
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
  message?: string;
  monthlyRentLocked: number;
  depositLocked: number;
  status: BookingStatus;
  ownerNote?: string;
  bedsAllocated: boolean;
  createdAt: string;
}

export interface Enquiry {
  id: number;
  propertyId: number;
  propertyName: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  isWhatsapp: boolean;
  createdAt: string;
}

export interface OwnerDashboardStats {
  publishedProperties: number;
  totalProperties: number;
  pendingBookings: number;
  acceptedBookings: number;
  totalEnquiries: number;
  availableBeds: number;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalOwners: number;
  totalProperties: number;
  pendingProperties: number;
  publishedProperties: number;
  totalBookings: number;
  pendingReports: number;
}

export interface AuditLog {
  id: number;
  actor?: { id: number; fullName: string; email: string };
  action: string;
  entityName: string;
  entityId?: number;
  details?: string;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
