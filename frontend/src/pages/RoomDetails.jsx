import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Wifi,
  Wind,
  Waves,
  UtensilsCrossed,
  Car,
  Dumbbell,
  Coffee,
  Tv,
  Bath,
  Mountain,
  CheckCircle2,
  CalendarDays,
  Minus,
  Plus,
} from "lucide-react";
import { useRoomsStore, useBookingStore } from "../stores";
import Loading from "../components/Loading";

const RoomDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { selectedRoom, isLoading, error, fetchRoomBySlug, checkAvailability } =
    useRoomsStore();
  const { bookingDetails, setBookingDetails } = useBookingStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState(bookingDetails.checkIn);
  const [checkOut, setCheckOut] = useState(bookingDetails.checkOut);
  const [guests, setGuests] = useState(bookingDetails.guests);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availability, setAvailability] = useState(null);

  useEffect(() => {
    fetchRoomBySlug(slug);
  }, [slug, fetchRoomBySlug]);

  useEffect(() => {
    if (checkIn && checkOut && selectedRoom) {
      checkRoomAvailability();
    }
  }, [checkIn, checkOut, selectedRoom]);

  const checkRoomAvailability = async () => {
    if (!checkIn || !checkOut) return;

    setIsCheckingAvailability(true);
    try {
      const result = await checkAvailability(
        slug,
        checkIn.toISOString(),
        checkOut.toISOString(),
      );
      setAvailability(result);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const amenityIcons = {
    WiFi: Wifi,
    AC: Wind,
    "Ocean View": Waves,
    Restaurant: UtensilsCrossed,
    Parking: Car,
    Gym: Dumbbell,
    Coffee: Coffee,
    TV: Tv,
    "Private Bathroom": Bath,
    "Mountain View": Mountain,
    default: CheckCircle2,
  };

  const getAmenityIcon = (amenity) => {
    for (const [key, Icon] of Object.entries(amenityIcons)) {
      if (amenity.toLowerCase().includes(key.toLowerCase())) {
        return Icon;
      }
    }
    return amenityIcons.default;
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const price =
      selectedRoom?.currentPrice || selectedRoom?.pricePerNight || 0;
    return nights * price;
  };

  const handleBookNow = () => {
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (!availability?.isAvailable) {
      toast.error("This room is not available for selected dates");
      return;
    }

    if (guests > selectedRoom.maxGuests) {
      toast.error(`Maximum ${selectedRoom.maxGuests} guests allowed`);
      return;
    }

    setBookingDetails({
      checkIn,
      checkOut,
      guests,
    });

    navigate(`/checkout/${slug}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) return <Loading fullScreen />;

  if (error || !selectedRoom) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold text-charcoal mb-2">
            Room Not Found
          </h2>
          <p className="text-gray-500 mb-4">
            The room you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/rooms")}
            className="btn btn-primary"
          >
            Browse Rooms
          </button>
        </div>
      </div>
    );
  }

  const hasDiscount =
    selectedRoom.seasonalDiscount?.isActive &&
    new Date() >= new Date(selectedRoom.seasonalDiscount.startDate) &&
    new Date() <= new Date(selectedRoom.seasonalDiscount.endDate);

  return (
    <div className="pt-20">
      {/* Image Gallery */}
      <div className="relative h-[50vh] md:h-[60vh] bg-charcoal">
        <img
          src={
            selectedRoom.images?.[currentImageIndex] ||
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920"
          }
          alt={selectedRoom.name}
          className="w-full h-full object-cover"
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-6 left-6 bg-sunset text-white px-4 py-2 rounded-lg font-heading font-bold">
            {selectedRoom.seasonalDiscount.percentage}% OFF
          </div>
        )}

        {/* Navigation Arrows */}
        {selectedRoom.images?.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === 0 ? selectedRoom.images.length - 1 : prev - 1,
                )
              }
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-charcoal" />
            </button>
            <button
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === selectedRoom.images.length - 1 ? 0 : prev + 1,
                )
              }
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-charcoal" />
            </button>
          </>
        )}

        {/* Thumbnails */}
        {selectedRoom.images?.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
            {selectedRoom.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentImageIndex
                    ? "border-white scale-110"
                    : "border-white/50 opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Room Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <span className="badge badge-ocean mb-2 capitalize">
                {selectedRoom.category.replace("-", " ")}
              </span>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
                {selectedRoom.name}
              </h1>
              <div className="flex items-center gap-6 text-gray-600">
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-ocean" />
                  Up to {selectedRoom.maxGuests} guests
                </span>
                <span className="flex items-center gap-2">
                  <Waves className="w-5 h-5 text-sunset" />
                  {selectedRoom.totalRooms} rooms available
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-heading font-bold text-charcoal mb-4">
                About This Room
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {selectedRoom.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-heading font-bold text-charcoal mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedRoom.amenities?.map((amenity, index) => {
                  const Icon = getAmenityIcon(amenity);
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-sand rounded-lg"
                    >
                      <Icon className="w-5 h-5 text-ocean" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              {/* Price */}
              <div className="mb-6">
                {hasDiscount ? (
                  <div>
                    <span className="text-gray-400 line-through text-lg">
                      {formatPrice(selectedRoom.pricePerNight)}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-heading font-bold text-ocean">
                        {formatPrice(selectedRoom.currentPrice)}
                      </span>
                      <span className="text-gray-500">/night</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-heading font-bold text-ocean">
                      {formatPrice(selectedRoom.pricePerNight)}
                    </span>
                    <span className="text-gray-500">/night</span>
                  </div>
                )}
              </div>

              {/* Date Picker */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="label flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-ocean" />
                    Check-in
                  </label>
                  <DatePicker
                    selected={checkIn}
                    onChange={(date) => setCheckIn(date)}
                    selectsStart
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={new Date()}
                    placeholderText="Select date"
                    className="input w-full"
                    dateFormat="MMM d, yyyy"
                  />
                </div>

                <div>
                  <label className="label flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-ocean" />
                    Check-out
                  </label>
                  <DatePicker
                    selected={checkOut}
                    onChange={(date) => setCheckOut(date)}
                    selectsEnd
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={checkIn || new Date()}
                    placeholderText="Select date"
                    className="input w-full"
                    dateFormat="MMM d, yyyy"
                  />
                </div>

                {/* Guests */}
                <div>
                  <label className="label flex items-center gap-2">
                    <Users className="w-4 h-4 text-ocean" />
                    Guests
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:border-ocean transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-semibold w-12 text-center">
                      {guests}
                    </span>
                    <button
                      onClick={() =>
                        setGuests(Math.min(selectedRoom.maxGuests, guests + 1))
                      }
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:border-ocean transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-500">
                      max {selectedRoom.maxGuests}
                    </span>
                  </div>
                </div>
              </div>

              {/* Availability Status */}
              {checkIn && checkOut && (
                <div className="mb-6">
                  {isCheckingAvailability ? (
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="w-4 h-4 spinner" />
                      Checking availability...
                    </div>
                  ) : availability ? (
                    <div
                      className={`p-3 rounded-lg ${
                        availability.isAvailable
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {availability.isAvailable
                        ? `✓ Available! ${availability.availableRooms} room(s) left`
                        : "✗ Not available for these dates"}
                    </div>
                  ) : null}
                </div>
              )}

              {/* Price Summary */}
              {checkIn && checkOut && availability?.isAvailable && (
                <div className="border-t border-gray-100 pt-4 mb-6 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>
                      {formatPrice(
                        selectedRoom.currentPrice || selectedRoom.pricePerNight,
                      )}{" "}
                      × {calculateNights()} nights
                    </span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between font-heading font-bold text-lg text-charcoal pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
              )}

              {/* Book Button */}
              <button
                onClick={handleBookNow}
                disabled={!checkIn || !checkOut || !availability?.isAvailable}
                className={`btn w-full ${
                  checkIn && checkOut && availability?.isAvailable
                    ? "btn-primary"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Reserve Now
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
