import { NavLink } from "react-router-dom";
import { Users, Waves, Star } from "lucide-react";

const RoomCard = ({ room }) => {
  const hasDiscount =
    room.seasonalDiscount?.isActive &&
    new Date() >= new Date(room.seasonalDiscount.startDate) &&
    new Date() <= new Date(room.seasonalDiscount.endDate);

  const categoryLabels = {
    "surf-room": "Surf Room",
    villa: "Villa",
    beachfront: "Beachfront",
    dorm: "Dorm",
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <NavLink to={`/rooms/${room.slug}`} className="card card-hover group block">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={
            room.images?.[0] ||
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
          }
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-ocean text-white px-4 py-2 rounded-lg shadow-lg">
          {hasDiscount ? (
            <div className="text-center">
              <span className="text-xs line-through opacity-70 block">
                {formatPrice(room.pricePerNight)}
              </span>
              <span className="font-heading font-bold text-xl">
                {formatPrice(room.currentPrice)}
              </span>
            </div>
          ) : (
            <span className="font-heading font-bold text-xl">
              {formatPrice(room.pricePerNight)}
            </span>
          )}
          <span className="text-xs opacity-80 block text-center">/night</span>
        </div>

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-4 left-4 bg-sunset text-white px-3 py-1 rounded-full text-sm font-medium">
            {room.seasonalDiscount.percentage}% OFF
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-ocean px-3 py-1 rounded-full text-sm font-medium">
          {categoryLabels[room.category]}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-heading font-bold text-xl text-charcoal mb-2 group-hover:text-ocean transition-colors">
          {room.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {room.description}
        </p>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-ocean" />
            <span>Up to {room.maxGuests} guests</span>
          </div>
          <div className="flex items-center gap-1">
            <Waves className="w-4 h-4 text-sunset" />
            <span>{room.totalRooms} available</span>
          </div>
        </div>

        {/* Amenities Preview */}
        {room.amenities?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {room.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-sand rounded-full text-gray-600"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="text-xs px-2 py-1 bg-sand rounded-full text-gray-600">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-sunset font-medium text-sm group-hover:text-sunset-dark transition-colors">
            View Details →
          </span>
        </div>
      </div>
    </NavLink>
  );
};

export default RoomCard;
